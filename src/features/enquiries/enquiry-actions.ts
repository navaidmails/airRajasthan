"use server";

import { AuthService } from "../authentication/auth-service";
import { EnquiryService } from "./enquiry-service";
import { EnquiryCreateInput, EnquiryCreateSchema } from "./validation";
import { EnquiryStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function submitEnquiryAction(formData: EnquiryCreateInput) {
  try {
    const session = await AuthService.getCurrentSession();
    const result = await EnquiryService.createEnquiry(formData, session);
    revalidatePath("/dashboard/enquiries");
    return { success: true, reference: result.reference };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit enquiry" };
  }
}

export async function updateEnquiryStatusAction(enquiryId: string, status: EnquiryStatus) {
  try {
    const session = await AuthService.requireAuth();
    await EnquiryService.updateStatus(session, enquiryId, status);
    revalidatePath(`/dashboard/enquiries/${enquiryId}`);
    revalidatePath("/dashboard/enquiries");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update status" };
  }
}

export async function assignEnquiryAction(enquiryId: string, assignedToId: string) {
  try {
    const session = await AuthService.requireAuth();
    await EnquiryService.assignEnquiry(session, enquiryId, assignedToId);
    revalidatePath(`/dashboard/enquiries/${enquiryId}`);
    revalidatePath("/dashboard/enquiries");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to assign enquiry" };
  }
}

export async function addInternalNoteAction(enquiryId: string, noteText: string) {
  try {
    const session = await AuthService.requireAuth();
    await EnquiryService.addInternalNote(session, enquiryId, noteText);
    revalidatePath(`/dashboard/enquiries/${enquiryId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add note" };
  }
}

export async function addReplyAction(enquiryId: string, messageText: string) {
  try {
    const session = await AuthService.requireAuth();
    await EnquiryService.addReply(session, enquiryId, messageText);
    revalidatePath(`/dashboard/enquiries/${enquiryId}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message" };
  }
}
