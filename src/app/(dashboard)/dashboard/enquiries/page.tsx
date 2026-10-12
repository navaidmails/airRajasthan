import { AuthService } from "@/features/authentication/auth-service";
import { EnquiryService } from "@/features/enquiries/enquiry-service";
import { EnquiryStatus, EnquiryType } from "@prisma/client";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Search, Filter, ArrowRight, Inbox, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface EnquiriesPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
    page?: string;
  }>;
}

export default async function EnquiriesListPage({ searchParams }: EnquiriesPageProps) {
  const session = await AuthService.requireAuth();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const status = params.status && params.status !== "ALL" ? (params.status as EnquiryStatus) : undefined;
  const type = params.type && params.type !== "ALL" ? (params.type as EnquiryType) : undefined;
  const search = params.search || "";

  const data = await EnquiryService.listEnquiries(session, {
    page,
    limit: 10,
    status,
    type,
    search,
  });

  const isCustomer = session.role === "USER";

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

  const statuses = ["ALL", "NEW", "ASSIGNED", "IN_PROGRESS", "AWAITING_CUSTOMER", "CLOSED"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">
            {isCustomer ? "My Cargo Enquiries" : "Enquiries Workflow Management"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isCustomer
              ? "All quotations and operational requests associated with your account"
              : "Search, assign, review customer replies, and update enquiry workflow stages"}
          </p>
        </div>

        {isCustomer && (
          <Link
            href="/query"
            className="btn-primary text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Quotation</span>
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input Form */}
        <form method="GET" className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search reference (e.g. AR-ENQ), customer name, company, origin, or destination..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
            />
          </div>

          {params.status && <input type="hidden" name="status" value={params.status} />}
          {params.type && <input type="hidden" name="type" value={params.type} />}

          <button
            type="submit"
            className="btn-navy text-xs font-semibold py-2.5 px-5 flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {statuses.map((st) => {
            const isSelected = (!params.status && st === "ALL") || params.status === st;
            const queryParams = new URLSearchParams();
            if (search) queryParams.set("search", search);
            if (st !== "ALL") queryParams.set("status", st);

            return (
              <Link
                key={st}
                href={`/dashboard/enquiries?${queryParams.toString()}`}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  isSelected
                    ? "bg-navy-950 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st.replace("_", " ")}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Reference</th>
                <th className="py-3.5 px-4 font-semibold">Shipper / Company</th>
                <th className="py-3.5 px-4 font-semibold">Service & Route</th>
                <th className="py-3.5 px-4 font-semibold">Payload</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                {!isCustomer && <th className="py-3.5 px-4 font-semibold">Assigned Specialist</th>}
                <th className="py-3.5 px-4 font-semibold">Received</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.length === 0 ? (
                <tr>
                  <td colSpan={isCustomer ? 7 : 8} className="py-12 text-center text-slate-500">
                    <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-sm">No enquiries found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting search criteria or filter status.</p>
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                      {item.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      {item.company && <p className="text-[11px] text-slate-500">{item.company}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-700">{item.serviceName || "General"}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        {item.origin && item.destination ? `${item.origin} → ${item.destination}` : "-"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {item.weight ? `${item.weight} ${item.weightUnit}` : "-"}
                      {item.pieces ? ` (${item.pieces} pcs)` : ""}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {!isCustomer && (
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {item.assignedTo ? (
                          <span className="font-semibold text-navy-900">{item.assignedTo.name}</span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                    )}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/dashboard/enquiries/${item.id}`}
                        className="btn-navy text-[11px] py-1.5 px-3 font-semibold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {data.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing Page {data.page} of {data.totalPages} ({data.total} total)
            </div>
            <div className="flex gap-2">
              {data.page > 1 && (
                <Link
                  href={`/dashboard/enquiries?page=${data.page - 1}${search ? `&search=${search}` : ""}${
                    status ? `&status=${status}` : ""
                  }`}
                  className="btn-secondary py-1 px-3 text-xs"
                >
                  Previous
                </Link>
              )}
              {data.page < data.totalPages && (
                <Link
                  href={`/dashboard/enquiries?page=${data.page + 1}${search ? `&search=${search}` : ""}${
                    status ? `&status=${status}` : ""
                  }`}
                  className="btn-secondary py-1 px-3 text-xs"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
