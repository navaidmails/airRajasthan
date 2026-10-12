"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRoleAction } from "@/features/authentication/auth-actions";
import { Role } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Users, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  _count: {
    assignedEnquiries: number;
    customerEnquiries: number;
  };
}

interface UsersAdminClientProps {
  users: UserItem[];
  currentUserId: string;
}

export function UsersAdminClient({ users, currentUserId }: UsersAdminClientProps) {
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setLoadingUserId(userId);
    setFeedback(null);

    const res = await updateUserRoleAction(userId, newRole);
    setLoadingUserId(null);

    if (res.success) {
      setFeedback({ type: "success", text: `User role successfully updated to ${newRole}` });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to update role" });
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-navy-950">Registered System Accounts</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only Administrators can modify user access levels. Self-downgrade is restricted.
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-navy-50 text-navy-950 px-2.5 py-1 rounded-lg">
            {users.length} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-semibold">User Details</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Enquiries Activity</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold">Role Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                const isLoading = loadingUserId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-navy-950">{u.name}</p>
                      {isSelf && (
                        <span className="text-[10px] font-mono font-bold text-saffron-600">
                          (Your Current Account)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span>{u._count.assignedEnquiries} assigned</span>
                      <span className="mx-1">•</span>
                      <span>{u._count.customerEnquiries} submitted</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        disabled={isLoading || isSelf}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold outline-none transition-colors ${
                          u.role === Role.ADMIN
                            ? "bg-red-50 text-red-900 border-red-200"
                            : u.role === Role.TEAM
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : "bg-blue-50 text-blue-900 border-blue-200"
                        } ${isSelf ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <option value={Role.ADMIN}>ADMIN (Full Control)</option>
                        <option value={Role.TEAM}>TEAM (Draft & Workflow)</option>
                        <option value={Role.USER}>USER (Customer Portal)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
