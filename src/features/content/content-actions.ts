"use server";

import { AuthService } from "../authentication/auth-service";
import { ContentService } from "./content-service";
import { ServiceCatalog } from "../services/service-catalog";
import { EventService } from "../events/event-service";
import { GalleryService } from "../gallery/gallery-service";
import { ContentStatus } from "@prisma/client";

export async function saveSectionAction(
  sectionKey: string,
  data: { title: string; subtitle?: string; content: string; metaJson?: string; status?: ContentStatus }
) {
  try {
    const session = await AuthService.requireAuth();
    const updated = await ContentService.updateSection(session, sectionKey, data);
    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save section" };
  }
}

export async function publishSectionAction(sectionKey: string) {
  try {
    const session = await AuthService.requireAuth();
    const updated = await ContentService.publishSection(session, sectionKey);
    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to publish section" };
  }
}

export async function saveServiceAction(data: {
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
}) {
  try {
    const session = await AuthService.requireAuth();
    const saved = await ServiceCatalog.saveService(session, data);
    return { success: true, saved };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save service" };
  }
}

export async function publishServiceAction(serviceId: string) {
  try {
    const session = await AuthService.requireAuth();
    const updated = await ServiceCatalog.publishService(session, serviceId);
    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to publish service" };
  }
}

export async function saveEventAction(data: {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  location: string;
  eventDate: string;
  isPast?: boolean;
  imageUrl?: string;
  status?: ContentStatus;
}) {
  try {
    const session = await AuthService.requireAuth();
    const saved = await EventService.saveEvent(session, {
      ...data,
      eventDate: new Date(data.eventDate),
    });
    return { success: true, saved };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save event" };
  }
}

export async function publishEventAction(eventId: string) {
  try {
    const session = await AuthService.requireAuth();
    const updated = await EventService.publishEvent(session, eventId);
    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to publish event" };
  }
}

export async function saveGalleryAction(data: {
  id?: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText: string;
  description?: string;
  order?: number;
  status?: ContentStatus;
}) {
  try {
    const session = await AuthService.requireAuth();
    const saved = await GalleryService.saveGalleryItem(session, data);
    return { success: true, saved };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save gallery item" };
  }
}

export async function publishGalleryAction(id: string) {
  try {
    const session = await AuthService.requireAuth();
    const updated = await GalleryService.publishGalleryItem(session, id);
    return { success: true, updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to publish gallery item" };
  }
}
