import { prisma } from "@/lib/prisma";
import { ContentStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AuthSession } from "../authentication/types";

export interface PageSectionDTO {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  content: string;
  metaJson: string | null;
  status: ContentStatus;
  updatedAt: Date;
}

export class ContentService {
  // Public accessor - strictly PUBLISHED status only
  static async getPublishedSection(sectionKey: string): Promise<PageSectionDTO | null> {
    return await prisma.pageSection.findFirst({
      where: {
        sectionKey,
        status: ContentStatus.PUBLISHED,
      },
    });
  }

  // Admin & Team accessor - view both Draft and Published content
  static async getAllSections(session: AuthSession): Promise<PageSectionDTO[]> {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Requires Admin or Team privileges");
    }

    return await prisma.pageSection.findMany({
      orderBy: { sectionKey: "asc" },
    });
  }

  // Team & Admin - save draft or updates
  static async updateSection(
    session: AuthSession,
    sectionKey: string,
    data: { title: string; subtitle?: string; content: string; metaJson?: string; status?: ContentStatus }
  ) {
    if (session.role !== Role.ADMIN && session.role !== Role.TEAM) {
      throw new Error("FORBIDDEN: Requires Admin or Team privileges");
    }

    // Team members can only save as DRAFT. Only ADMIN can set PUBLISHED directly.
    const targetStatus =
      session.role === Role.ADMIN ? (data.status ?? ContentStatus.DRAFT) : ContentStatus.DRAFT;

    const updated = await prisma.pageSection.upsert({
      where: { sectionKey },
      update: {
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        metaJson: data.metaJson,
        status: targetStatus,
        updatedBy: session.userId,
      },
      create: {
        sectionKey,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        metaJson: data.metaJson,
        status: targetStatus,
        updatedBy: session.userId,
      },
    });

    if (targetStatus === ContentStatus.PUBLISHED) {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/contact");
    }

    return updated;
  }

  // Admin only - publish section
  static async publishSection(session: AuthSession, sectionKey: string) {
    if (session.role !== Role.ADMIN) {
      throw new Error("FORBIDDEN: Only administrators can publish live content.");
    }

    const updated = await prisma.pageSection.update({
      where: { sectionKey },
      data: {
        status: ContentStatus.PUBLISHED,
        updatedBy: session.userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return updated;
  }
}
