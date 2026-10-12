import { prisma } from "@/lib/prisma";
import { ContentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AuthSession } from "../authentication/types";

export class GalleryService {
  static async getPublishedGallery(category?: string) {
    return await prisma.galleryItem.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(category && category !== "ALL" ? { category } : {}),
      },
      orderBy: { order: "asc" },
    });
  }

  static async getAllGallery(session: AuthSession) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Requires Admin or Team privileges");
    }

    return await prisma.galleryItem.findMany({
      orderBy: { order: "asc" },
    });
  }

  static async saveGalleryItem(
    session: AuthSession,
    data: {
      id?: string;
      title: string;
      category: string;
      imageUrl: string;
      thumbnailUrl?: string;
      altText: string;
      description?: string;
      order?: number;
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
      saved = await prisma.galleryItem.update({
        where: { id: data.id },
        data: {
          title: data.title,
          category: data.category.toUpperCase(),
          imageUrl: data.imageUrl,
          thumbnailUrl: data.thumbnailUrl || data.imageUrl,
          altText: data.altText,
          description: data.description,
          order: data.order ?? 0,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    } else {
      saved = await prisma.galleryItem.create({
        data: {
          title: data.title,
          category: data.category.toUpperCase(),
          imageUrl: data.imageUrl,
          thumbnailUrl: data.thumbnailUrl || data.imageUrl,
          altText: data.altText,
          description: data.description,
          order: data.order ?? 0,
          status: targetStatus,
          updatedBy: session.userId,
        },
      });
    }

    if (targetStatus === ContentStatus.PUBLISHED) {
      revalidatePath("/gallery");
      revalidatePath("/");
    }

    return saved;
  }

  static async publishGalleryItem(session: AuthSession, id: string) {
    if (session.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can publish gallery media.");
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        status: ContentStatus.PUBLISHED,
        updatedBy: session.userId,
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/");

    return updated;
  }
}
