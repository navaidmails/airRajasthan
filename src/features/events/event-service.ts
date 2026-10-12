import { prisma } from "@/lib/prisma";
import { ContentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AuthSession } from "../authentication/types";

export class EventService {
  static async getPublishedEvents() {
    return await prisma.eventItem.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { eventDate: "desc" },
    });
  }

  static async getPublishedEventBySlug(slug: string) {
    return await prisma.eventItem.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  static async getAllEvents(session: AuthSession) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Requires Admin or Team privileges");
    }

    return await prisma.eventItem.findMany({
      orderBy: { eventDate: "desc" },
    });
  }

  static async saveEvent(
    session: AuthSession,
    data: {
      id?: string;
      slug: string;
      title: string;
      summary: string;
      content: string;
      location: string;
      eventDate: Date;
      isPast?: boolean;
      imageUrl?: string;
      status?: ContentStatus;
    }
  ) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN");
    }

    const targetStatus =
      session.role === Role.ADMIN ? (data.status ?? ContentStatus.DRAFT) : ContentStatus.DRAFT;

    let saved;
    if (data.id) {
      saved = await prisma.eventItem.update({
        where: { id: data.id },
        data: {
          slug: data.slug,
          title: data.title,
          summary: data.summary,
          content: data.content,
          location: data.location,
          eventDate: data.eventDate,
          isPast: data.isPast ?? false,
          imageUrl: data.imageUrl,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    } else {
      saved = await prisma.eventItem.create({
        data: {
          slug: data.slug,
          title: data.title,
          summary: data.summary,
          content: data.content,
          location: data.location,
          eventDate: data.eventDate,
          isPast: data.isPast ?? false,
          imageUrl: data.imageUrl,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    }

    if (targetStatus === ContentStatus.PUBLISHED) {
      revalidatePath("/events");
      revalidatePath(`/events/${data.slug}`);
      revalidatePath("/");
    }

    return saved;
  }

  static async publishEvent(session: AuthSession, eventId: string) {
    if (session.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can publish events.");
    }

    const updated = await prisma.eventItem.update({
      where: { id: eventId },
      data: {
        status: ContentStatus.PUBLISHED,
        updatedBy: session.userId,
      },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${updated.slug}`);
    revalidatePath("/");

    return updated;
  }
}
