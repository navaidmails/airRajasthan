import { AuthService } from "@/features/authentication/auth-service";
import { EnquiryService } from "@/features/enquiries/enquiry-service";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { EnquiryDetailClient } from "./EnquiryDetailClient";
import {
  ArrowLeft,
  Plane,
  Package,
  Scale,
  MapPin,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const session = await AuthService.requireAuth();
  const { id } = await params;

  let enquiry;
  try {
    enquiry = await EnquiryService.getEnquiryById(session, id);
  } catch (err: any) {
    if (err.message === "FORBIDDEN") {
      redirect("/dashboard/enquiries");
    }
    notFound();
  }

  // If team member or admin, fetch active team members for assignment dropdown
  let teamMembers: Array<{ id: string; name: string; email: string }> = [];
  if (session.role === "TEAM" || session.role === "ADMIN") {
    teamMembers = await prisma.user.findMany({
      where: {
        role: { in: ["TEAM", "ADMIN"] },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ASSIGNED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "IN_PROGRESS":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "AWAITING_CUSTOMER":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "CLOSED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/enquiries"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Enquiries List</span>
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="card-aviation p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl md:text-2xl font-extrabold text-navy-950">
                {enquiry.reference}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                  enquiry.status
                )}`}
              >
                {enquiry.status}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-navy-100 text-navy-800">
                {enquiry.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Received: {formatDate(enquiry.createdAt)} • Last Updated: {formatDate(enquiry.updatedAt)}
            </p>
          </div>

          <div className="text-xs md:text-right text-slate-600">
            <p className="font-semibold text-navy-950">
              Assigned Specialist:{" "}
              {enquiry.assignedTo ? (
                <span className="text-saffron-600 font-bold">{enquiry.assignedTo.name}</span>
              ) : (
                <span className="text-slate-400 italic">Unassigned</span>
              )}
            </p>
            {enquiry.assignedTo && (
              <p className="text-[11px] text-slate-400">{enquiry.assignedTo.email}</p>
            )}
          </div>
        </div>

        {/* Customer & Route Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* Customer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Shipper / Contact</span>
            <p className="font-bold text-navy-950 text-sm">{enquiry.name}</p>
            {enquiry.company && (
              <p className="text-slate-600 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{enquiry.company}</span>
              </p>
            )}
            <p className="text-slate-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{enquiry.email}</span>
            </p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{enquiry.phone}</span>
            </p>
          </div>

          {/* Route & Service */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Routing & Service</span>
            <p className="font-bold text-navy-950 text-sm">{enquiry.serviceName || "General Freight"}</p>
            <div className="pt-1 flex items-center gap-2 font-mono text-xs font-semibold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-saffron-500" />
              <span>{enquiry.origin || "Origin TBD"}</span>
              <span>&rarr;</span>
              <span>{enquiry.destination || "Destination TBD"}</span>
            </div>
          </div>

          {/* Cargo Metrics */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Payload Metrics</span>
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950 font-mono">
              <Scale className="w-4 h-4 text-saffron-500" />
              <span>
                {enquiry.weight ? `${enquiry.weight} ${enquiry.weightUnit}` : "Weight Unspecified"}
              </span>
            </div>
            <p className="text-slate-600">
              Pieces: <span className="font-bold">{enquiry.pieces || "N/A"} units</span>
            </p>
            {enquiry.cargoDescription && (
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Commodity: {enquiry.cargoDescription}
              </p>
            )}
          </div>

          {/* Message / Requirements */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Initial Specifications</span>
            <p className="text-slate-700 italic leading-relaxed text-xs line-clamp-4">
              "{enquiry.message}"
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Detail Client: Status, Assignment, Replies, Internal Notes, Activities */}
      <EnquiryDetailClient
        enquiryId={enquiry.id}
        currentStatus={enquiry.status}
        currentAssigneeId={enquiry.assignedToId}
        userRole={session.role}
        teamMembers={teamMembers}
        replies={enquiry.replies.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          isFromCustomer: r.isFromCustomer,
          message: r.message,
          createdAt: r.createdAt,
        }))}
        notes={
          enquiry.notes
            ? enquiry.notes.map((n) => ({
                id: n.id,
                authorName: n.authorName,
                note: n.note,
                createdAt: n.createdAt,
              }))
            : undefined
        }
        activities={enquiry.activities.map((a) => ({
          id: a.id,
          action: a.action,
          details: a.details,
          createdAt: a.createdAt,
        }))}
      />
    </div>
  );
}
