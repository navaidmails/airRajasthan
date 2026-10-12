import { prisma } from "@/lib/prisma";
import { ContentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AuthSession } from "../authentication/types";

export class ServiceCatalog {
  // Public - only published services
  static async getPublishedServices() {
    return await prisma.serviceItem.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { order: "asc" },
    });
  }

  static async getPublishedServiceBySlug(slug: string) {
    return await prisma.serviceItem.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  // Dashboard - all services
  static async getAllServices(session: AuthSession) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Requires Admin or Team privileges");
    }

    return await prisma.serviceItem.findMany({
      orderBy: { order: "asc" },
    });
  }

  // Save/Create Service
  static async saveService(
    session: AuthSession,
    data: {
      id?: string;
      slug: string;
      title: string;
      shortDescription: string;
      fullDescription: string;
      features: string[];
      icon?: string;
      imageUrl?: string;
      order?: number;
      status?: ContentStatus;
    }
  ) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN");
    }

    const targetStatus =
      session.role === Role.ADMIN ? (data.status ?? ContentStatus.DRAFT) : ContentStatus.DRAFT;

    const featuresJson = JSON.stringify(data.features || []);

    let saved;
    if (data.id) {
      saved = await prisma.serviceItem.update({
        where: { id: data.id },
        data: {
          slug: data.slug,
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          featuresJson,
          icon: data.icon || "Plane",
          imageUrl: data.imageUrl,
          order: data.order ?? 0,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    } else {
      saved = await prisma.serviceItem.create({
        data: {
          slug: data.slug,
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          featuresJson,
          icon: data.icon || "Plane",
          imageUrl: data.imageUrl,
          order: data.order ?? 0,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    }

    if (targetStatus === ContentStatus.PUBLISHED) {
      revalidatePath("/services");
      revalidatePath(`/services/${data.slug}`);
      revalidatePath("/");
    }

    return saved;
  }

  static async publishService(session: AuthSession, serviceId: string) {
    if (session.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can publish services.");
    }

    const updated = await prisma.serviceItem.update({
      where: { id: serviceId },
      data: {
        status: ContentStatus.PUBLISHED,
        updatedBy: session.userId,
      },
    });

    revalidatePath("/services");
    revalidatePath(`/services/${updated.slug}`);
    revalidatePath("/");

    return updated;
  }
}
