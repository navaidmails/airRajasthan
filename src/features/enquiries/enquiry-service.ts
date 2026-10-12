import { prisma } from "@/lib/prisma";
import { EnquiryStatus, EnquiryType, Role, NotificationStatus } from "@prisma/client";
import { generateReference } from "@/lib/utils";
import { AuthSession } from "../authentication/types";
import { EnquiryCreateInput, EnquiryCreateSchema } from "./validation";

export interface EnquiryFilterParams {
  status?: EnquiryStatus;
  type?: EnquiryType;
  search?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

export class EnquiryService {
  /**
   * Create an enquiry (public guest or authenticated customer)
   */
  static async createEnquiry(input: EnquiryCreateInput, session?: AuthSession | null, ipHash?: string) {
    const validated = EnquiryCreateSchema.parse(input);

    // Duplicate submission protection: check if same email and same message was submitted in last 60 seconds
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const duplicate = await prisma.enquiry.findFirst({
      where: {
        email: validated.email.toLowerCase().trim(),
        message: validated.message.trim(),
        createdAt: { gte: sixtySecondsAgo },
      },
    });

    if (duplicate) {
      throw new Error("Duplicate enquiry detected. Please wait a minute before submitting again.");
    }

    const reference = generateReference();

    // Ensure customerId is ONLY set from authenticated session, never trusted from client
    const customerId = session?.role === Role.USER ? session.userId : null;

    // Persistent transaction: Enquiry + Initial Activity Log + Outbox Notification
    const result = await prisma.$transaction(async (tx) => {
      const enq = await tx.enquiry.create({
        data: {
          reference,
          type: validated.type,
          status: EnquiryStatus.NEW,
          name: validated.name.trim(),
          company: validated.company?.trim() || null,
          email: validated.email.toLowerCase().trim(),
          phone: validated.phone.trim(),
          serviceName: validated.serviceName.trim(),
          origin: validated.origin?.trim() || null,
          destination: validated.destination?.trim() || null,
          cargoDescription: validated.cargoDescription?.trim() || null,
          weight: typeof validated.weight === "number" ? validated.weight : null,
          weightUnit: validated.weightUnit,
          pieces: typeof validated.pieces === "number" ? validated.pieces : null,
          message: validated.message.trim(),
          customerId,
          ipHash: ipHash || null,
        },
      });

      await tx.activityLog.create({
        data: {
          enquiryId: enq.id,
          action: "ENQUIRY_CREATED",
          details: `Enquiry reference ${reference} registered successfully via Web Portal`,
        },
      });

      // Outbox Pattern: Save notification job persistently
      await tx.notificationJob.create({
        data: {
          channel: "EMAIL",
          recipient: enq.email,
          subject: `Enquiry Acknowledgment [${reference}] - AirRajasthan Cargo`,
          content: `Thank you for contacting AirRajasthan Cargo. Your enquiry has been received and assigned reference ${reference}. Our operations desk will review your requirements.`,
          status: NotificationStatus.NOT_CONFIGURED,
          errorDetails: "Demo environment: SMTP email provider not configured. Notification saved to persistent outbox.",
        },
      });

      return enq;
    });

    return {
      success: true,
      reference: result.reference,
      id: result.id,
    };
  }

  /**
   * List enquiries with role-based filtering, search, and pagination
   */
  static async listEnquiries(session: AuthSession, filters: EnquiryFilterParams = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(5, filters.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    // Role-based boundary: USER can ONLY see their own enquiries!
    if (session.role === Role.USER) {
      where.customerId = session.userId;
    } else {
      // TEAM or ADMIN
      if (filters.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { reference: { contains: q } },
        { name: { contains: q } },
        { company: { contains: q } },
        { email: { contains: q } },
        { origin: { contains: q } },
        { destination: { contains: q } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reference: true,
          type: true,
          status: true,
          name: true,
          company: true,
          email: true,
          phone: true,
          serviceName: true,
          origin: true,
          destination: true,
          weight: true,
          weightUnit: true,
          pieces: true,
          createdAt: true,
          updatedAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              replies: true,
              // Only count internal notes for TEAM or ADMIN
              notes: session.role !== Role.USER,
            },
          },
        },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single enquiry details with strict privacy boundaries
   */
  static async getEnquiryById(session: AuthSession, id: string) {
    const isCustomer = session.role === Role.USER;

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
        },
        // SECURITY: OMIT internal notes completely if requester is a regular customer USER!
        notes: !isCustomer
          ? {
              orderBy: { createdAt: "desc" },
            }
          : false,
        activities: {
          orderBy: { createdAt: "desc" },
          take: isCustomer ? 10 : 30,
        },
      },
    });

    if (!enquiry) {
      throw new Error("NOT_FOUND");
    }

    // SECURITY: Ensure customer can only view their own enquiry
    if (isCustomer && enquiry.customerId !== session.userId) {
      throw new Error("FORBIDDEN: You do not have permission to view this enquiry.");
    }

    return enquiry;
  }

  /**
   * Update enquiry status (Team or Admin)
   */
  static async updateStatus(session: AuthSession, enquiryId: string, newStatus: EnquiryStatus) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Only operations team members can change status.");
    }

    const current = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!current) throw new Error("NOT_FOUND");

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status: newStatus },
    });

    await prisma.activityLog.create({
      data: {
        enquiryId,
        userId: session.userId,
        action: "STATUS_CHANGED",
        details: `Status updated from ${current.status} to ${newStatus} by ${session.name}`,
      },
    });

    return updated;
  }

  /**
   * Assign enquiry to a team member (Admin or Team)
   */
  static async assignEnquiry(session: AuthSession, enquiryId: string, assignedToId: string) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Only operations team can reassign enquiries.");
    }

    const assignee = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!assignee || (assignee.role !== Role.TEAM && assignee.role !== Role.ADMIN)) {
      throw new Error("Assignee must be an active Team member or Administrator.");
    }

    const current = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!current) throw new Error("NOT_FOUND");

    const newStatus = current.status === EnquiryStatus.NEW ? EnquiryStatus.ASSIGNED : current.status;

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: {
        assignedToId,
        status: newStatus,
      },
    });

    await prisma.activityLog.create({
      data: {
        enquiryId,
        userId: session.userId,
        action: "ASSIGNED",
        details: `Assigned to ${assignee.name} (${assignee.role}) by ${session.name}`,
      },
    });

    return updated;
  }

  /**
   * Add internal note (Team or Admin ONLY - NEVER visible to customer)
   */
  static async addInternalNote(session: AuthSession, enquiryId: string, noteText: string) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Customers cannot create internal notes.");
    }

    const note = await prisma.enquiryNote.create({
      data: {
        enquiryId,
        authorId: session.userId,
        authorName: session.name,
        note: noteText.trim(),
      },
    });

    await prisma.activityLog.create({
      data: {
        enquiryId,
        userId: session.userId,
        action: "INTERNAL_NOTE_ADDED",
        details: `Internal note added by ${session.name}`,
      },
    });

    return note;
  }

  /**
   * Add customer-visible reply (Customer, Team, or Admin)
   */
  static async addReply(session: AuthSession, enquiryId: string, messageText: string) {
    const isCustomer = session.role === Role.USER;

    const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
    if (!enquiry) throw new Error("NOT_FOUND");

    if (isCustomer && enquiry.customerId !== session.userId) {
      throw new Error("FORBIDDEN");
    }

    const reply = await prisma.enquiryReply.create({
      data: {
        enquiryId,
        authorId: session.userId,
        authorName: session.name,
        isFromCustomer: isCustomer,
        message: messageText.trim(),
      },
    });

    // Auto workflow transition:
    // If reply is from Team/Admin -> mark AWAITING_CUSTOMER
    // If reply is from Customer -> mark IN_PROGRESS
    let updatedStatus = enquiry.status;
    if (!isCustomer && enquiry.status !== EnquiryStatus.CLOSED) {
      updatedStatus = EnquiryStatus.AWAITING_CUSTOMER;
    } else if (isCustomer && enquiry.status === EnquiryStatus.AWAITING_CUSTOMER) {
      updatedStatus = EnquiryStatus.IN_PROGRESS;
    }

    if (updatedStatus !== enquiry.status) {
      await prisma.enquiry.update({
        where: { id: enquiryId },
        data: { status: updatedStatus },
      });
    }

    await prisma.activityLog.create({
      data: {
        enquiryId,
        userId: session.userId,
        action: "REPLY_POSTED",
        details: `${isCustomer ? "Customer" : "Operations desk"} posted a message. Status: ${updatedStatus}`,
      },
    });

    // Queue notification job in outbox
    const recipient = isCustomer ? "cargo@airrajasthan.com" : enquiry.email;
    await prisma.notificationJob.create({
      data: {
        channel: "EMAIL",
        recipient,
        subject: `New Message on Enquiry [${enquiry.reference}] - AirRajasthan Cargo`,
        content: messageText.trim(),
        status: NotificationStatus.NOT_CONFIGURED,
        errorDetails: "Demo environment: SMTP email provider not configured.",
      },
    });

    return reply;
  }
}
