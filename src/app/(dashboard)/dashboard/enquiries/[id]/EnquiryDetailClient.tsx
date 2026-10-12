"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateEnquiryStatusAction,
  assignEnquiryAction,
  addInternalNoteAction,
  addReplyAction,
} from "@/features/enquiries/enquiry-actions";
import { EnquiryStatus, Role } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import {
  Send,
  Lock,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Clock,
  User,
  History,
  AlertCircle,
} from "lucide-react";

interface EnquiryDetailClientProps {
  enquiryId: string;
  currentStatus: EnquiryStatus;
  currentAssigneeId: string | null;
  userRole: Role;
  teamMembers: Array<{ id: string; name: string; email: string }>;
  replies: Array<{
    id: string;
    authorName: string;
    isFromCustomer: boolean;
    message: string;
    createdAt: Date;
  }>;
  notes?: Array<{
    id: string;
    authorName: string;
    note: string;
    createdAt: Date;
  }>;
  activities: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: Date;
  }>;
}

export function EnquiryDetailClient({
  enquiryId,
  currentStatus,
  currentAssigneeId,
  userRole,
  teamMembers,
  replies,
  notes,
  activities,
}: EnquiryDetailClientProps) {
  const router = useRouter();
  const isCustomer = userRole === Role.USER;
  const isTeamOrAdmin = userRole === Role.TEAM || userRole === Role.ADMIN;

  // State for forms
  const [status, setStatus] = useState<EnquiryStatus>(currentStatus);
  const [assigneeId, setAssigneeId] = useState<string>(currentAssigneeId || "");
  const [statusLoading, setStatusLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  // Replies & Notes input state
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    setStatusLoading(true);
    setFeedback(null);
    const res = await updateEnquiryStatusAction(enquiryId, newStatus);
    setStatusLoading(false);
    if (res.success) {
      setStatus(newStatus);
      setFeedback({ type: "success", text: `Status updated to ${newStatus}` });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to update status" });
    }
  };

  const handleAssignChange = async (newAssignee: string) => {
    setAssignLoading(true);
    setFeedback(null);
    const res = await assignEnquiryAction(enquiryId, newAssignee);
    setAssignLoading(false);
    if (res.success) {
      setAssigneeId(newAssignee);
      setFeedback({ type: "success", text: "Specialist assigned successfully" });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to assign enquiry" });
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setReplyLoading(true);
    setFeedback(null);
    const res = await addReplyAction(enquiryId, replyMessage);
    setReplyLoading(false);
    if (res.success) {
      setReplyMessage("");
      setFeedback({ type: "success", text: "Message transmitted to communication thread" });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to send message" });
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteLoading(true);
    setFeedback(null);
    const res = await addInternalNoteAction(enquiryId, noteText);
    setNoteLoading(false);
    if (res.success) {
      setNoteText("");
      setFeedback({ type: "success", text: "Internal note saved to private operations log" });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save note" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Operations Controls (Status & Assignment) - Team / Admin ONLY */}
      {isTeamOrAdmin && (
        <div className="bg-navy-950 text-white p-6 rounded-2xl border border-navy-850 shadow-aviation space-y-4">
          <div className="flex items-center justify-between border-b border-navy-850 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Operations Workflow Controls</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Team / Admin Access Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            {/* Workflow Stage */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Workflow Stage:
              </label>
              <select
                value={status}
                disabled={statusLoading}
                onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white font-semibold outline-none focus:ring-2 focus:ring-saffron-400"
              >
                <option value={EnquiryStatus.NEW}>NEW (Pending Review)</option>
                <option value={EnquiryStatus.ASSIGNED}>ASSIGNED (Specialist Allocated)</option>
                <option value={EnquiryStatus.IN_PROGRESS}>IN_PROGRESS (Working Quotation)</option>
                <option value={EnquiryStatus.AWAITING_CUSTOMER}>AWAITING_CUSTOMER (Reply Sent)</option>
                <option value={EnquiryStatus.CLOSED}>CLOSED (Completed / Booked)</option>
              </select>
            </div>

            {/* Specialist Assignment */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Assigned Specialist:
              </label>
              <select
                value={assigneeId}
                disabled={assignLoading}
                onChange={(e) => handleAssignChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-900 border border-navy-700 text-xs text-white font-semibold outline-none focus:ring-2 focus:ring-saffron-400"
              >
                <option value="">-- Unassigned --</option>
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.name} ({tm.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Section: Communication & Internal Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer-Visible Communication Thread */}
        <div className={`space-y-6 ${isTeamOrAdmin ? "lg:col-span-7" : "lg:col-span-8"}`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-saffron-500" />
                <h3 className="text-base font-bold text-navy-950">
                  Consignment Communication Thread
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Visible to Client & Operations Desk
              </span>
            </div>

            {/* Replies List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {replies.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500 text-xs">
                  No correspondence messages posted yet. Use the message form below to contact the team.
                </div>
              ) : (
                replies.map((reply) => {
                  const isCust = reply.isFromCustomer;
                  return (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl border text-xs leading-relaxed ${
                        isCust
                          ? "bg-slate-50 border-slate-200"
                          : "bg-blue-50/70 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1.5 text-navy-950">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{reply.authorName}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                              isCust
                                ? "bg-slate-200 text-slate-700"
                                : "bg-navy-900 text-white"
                            }`}
                          >
                            {isCust ? "Shipper" : "Air Cargo Desk"}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700">{reply.message}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Send Reply Form */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                {isCustomer ? "Send Message to Cargo Operations" : "Post Official Reply to Customer"}
              </label>
              <textarea
                required
                rows={3}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message, query clarification, or rate quotation details here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400">
                  {isCustomer ? "Our operations team monitors incoming queries 24/7." : "Posting a reply updates status to Awaiting Customer."}
                </span>
                <button
                  type="submit"
                  disabled={replyLoading || !replyMessage.trim()}
                  className="btn-primary text-xs font-bold uppercase tracking-wider py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{replyLoading ? "Posting..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Internal Notes (STRICTLY Team / Admin) + Activity Log */}
        <div className={`space-y-6 ${isTeamOrAdmin ? "lg:col-span-5" : "lg:col-span-4"}`}>
          {/* Internal Notes Box - ONLY rendered for Team or Admin. NEVER visible to customers! */}
          {isTeamOrAdmin && notes && (
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Internal Operations Notes</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Confidential
                </span>
              </div>

              <div className="text-[11px] text-amber-800">
                Private notes for airside loadmasters, dispatchers, and pricing analysts. Never visible to customer portal.
              </div>

              {/* Notes list */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {notes.length === 0 ? (
                  <p className="text-xs text-amber-700/80 italic">No internal notes added yet.</p>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-white border border-amber-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-amber-950">
                        <span>{n.authorName}</span>
                        <span className="text-[10px] text-amber-600 font-mono font-normal">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{n.note}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddInternalNote} className="space-y-2 pt-2 border-t border-amber-200">
                <textarea
                  rows={2}
                  required
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record carrier allocation rate, customs broker clearance status, or OCC notes..."
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 text-xs focus:ring-2 focus:ring-amber-400 outline-none bg-white"
                />
                <button
                  type="submit"
                  disabled={noteLoading || !noteText.trim()}
                  className="w-full btn-navy text-xs font-semibold py-2 disabled:opacity-50"
                >
                  {noteLoading ? "Saving..." : "Add Confidential Internal Note"}
                </button>
              </form>
            </div>
          )}

          {/* Activity Audit History */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <History className="w-4 h-4 text-navy-700" />
              <h3 className="text-sm font-bold text-navy-950">Activity Audit Trail</h3>
            </div>

            <div className="space-y-3 text-xs">
              {activities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="font-bold text-navy-900">{act.action}</span>
                    <span>{formatDate(act.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed text-[11px]">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
