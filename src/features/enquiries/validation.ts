import { z } from "zod";
import { EnquiryType, EnquiryStatus } from "@prisma/client";

export const EnquiryCreateSchema = z.object({
  name: z.string().min(2, "Full name is required").max(100),
  company: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Valid corporate or business email address is required"),
  phone: z.string().min(7, "Valid phone or WhatsApp number is required").max(30),
  type: z.nativeEnum(EnquiryType, {
    errorMap: () => ({ message: "Please select an enquiry type" }),
  }).default(EnquiryType.GENERAL),
  serviceName: z.string().min(1, "Please select an applicable service").max(100),
  origin: z.string().max(100).optional().or(z.literal("")),
  destination: z.string().max(100).optional().or(z.literal("")),
  cargoDescription: z.string().max(500).optional().or(z.literal("")),
  weight: z.coerce.number().positive("Weight must be greater than zero").optional().or(z.literal("")).or(z.null()),
  weightUnit: z.enum(["KG", "LBS", "TONNES"]).default("KG"),
  pieces: z.coerce.number().int().positive("Piece count must be at least 1").optional().or(z.literal("")).or(z.null()),
  message: z.string().min(10, "Please provide enquiry details or requirements (min 10 characters)").max(2000),
});

export const StatusUpdateSchema = z.object({
  enquiryId: z.string().min(1),
  status: z.nativeEnum(EnquiryStatus),
});

export const AssignEnquirySchema = z.object({
  enquiryId: z.string().min(1),
  assignedToId: z.string().min(1),
});

export const AddNoteSchema = z.object({
  enquiryId: z.string().min(1),
  note: z.string().min(3, "Internal note must be at least 3 characters").max(2000),
});

export const AddReplySchema = z.object({
  enquiryId: z.string().min(1),
  message: z.string().min(5, "Reply message must be at least 5 characters").max(3000),
});

export type EnquiryCreateInput = z.infer<typeof EnquiryCreateSchema>;
