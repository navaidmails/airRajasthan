import { AuthService } from "@/features/authentication/auth-service";
import { EnquiryService } from "@/features/enquiries/enquiry-service";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  FileText,
  Plane,
  Shield,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic"; // Dashboard must not use shared public cache!

export default async function DashboardPage() {
  const session = await AuthService.requireAuth();
  const isCustomer = session.role === "USER";
  const isAdmin = session.role === "ADMIN";

  // Fetch metrics
  let totalEnquiries = 0;
  let newEnquiries = 0;
  let inProgressEnquiries = 0;
  let closedEnquiries = 0;
  let notificationCount = 0;

  if (isCustomer) {
    totalEnquiries = await prisma.enquiry.count({ where: { customerId: session.userId } });
    newEnquiries = await prisma.enquiry.count({
      where: { customerId: session.userId, status: "NEW" },
    });
    inProgressEnquiries = await prisma.enquiry.count({
      where: { customerId: session.userId, status: "IN_PROGRESS" },
    });
    closedEnquiries = await prisma.enquiry.count({
      where: { customerId: session.userId, status: "CLOSED" },
    });
  } else {
    [totalEnquiries, newEnquiries, inProgressEnquiries, closedEnquiries, notificationCount] =
      await Promise.all([
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { status: "NEW" } }),
        prisma.enquiry.count({ where: { status: "IN_PROGRESS" } }),
        prisma.enquiry.count({ where: { status: "CLOSED" } }),
        prisma.notificationJob.count({ where: { status: "NOT_CONFIGURED" } }),
      ]);
  }

  // Fetch recent enquiries
  const recent = await EnquiryService.listEnquiries(session, { page: 1, limit: 5 });

  const getStatusBadge = (status: string) => {
    switch (status) {
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
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950">
              Operations Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-950 text-white font-mono">
              {session.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, {session.name}. Real-time consignment metrics and workflow tracking.
          </p>
        </div>

        <div>
          <Link
            href={isCustomer ? "/query" : "/dashboard/enquiries"}
            className="btn-primary text-xs font-bold uppercase tracking-wider py-2.5 px-4 shadow-sm"
          >
            {isCustomer ? "+ New Cargo Quotation" : "Manage Enquiries Workflow"}
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">
              {isCustomer ? "My Total Queries" : "All Enquiries"}
            </span>
            <Inbox className="w-4 h-4 text-navy-700" />
          </div>
          <div className="text-2xl font-extrabold text-navy-950">{totalEnquiries}</div>
          <p className="text-[11px] text-slate-400 mt-1">Stored in persistent MySQL database</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">New / Unassigned</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600">{newEnquiries}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting operational review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active In-Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{inProgressEnquiries}</div>
          <p className="text-[11px] text-slate-400 mt-1">Quotations & route allocations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Closed / Booked</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{closedEnquiries}</div>
          <p className="text-[11px] text-slate-400 mt-1">Completed air freight requests</p>
        </div>
      </div>

      {/* Outbox notification alert for team/admin */}
      {!isCustomer && notificationCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              Notification Outbox: <strong className="font-semibold">{notificationCount} email dispatch jobs</strong> preserved in database (SMTP status: NOT_CONFIGURED for demo mode).
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-700 font-bold">Zero Loss Guarantee</span>
        </div>
      )}

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950">Recent Enquiries</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCustomer ? "Quotations submitted under your company account" : "Latest incoming consignment requests"}
            </p>
          </div>
          <Link
            href="/dashboard/enquiries"
            className="text-xs font-bold text-navy-900 hover:text-saffron-600 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">Reference</th>
                <th className="py-3 px-4 font-semibold">Customer / Shipper</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Route</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No enquiries recorded yet.
                  </td>
                </tr>
              ) : (
                recent.items.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                      {enq.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{enq.name}</p>
                      {enq.company && <p className="text-[11px] text-slate-500">{enq.company}</p>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{enq.serviceName || "-"}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {enq.origin && enq.destination ? `${enq.origin} → ${enq.destination}` : "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(enq.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/enquiries/${enq.id}`}
                        className="btn-navy text-[11px] py-1.5 px-3 font-semibold"
                      >
                        Open Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
