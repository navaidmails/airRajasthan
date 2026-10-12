import { AuthService } from "@/features/authentication/auth-service";
import { redirect } from "next/navigation";
import { UsersAdminClient } from "./UsersAdminClient";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const session = await AuthService.requireAuth();

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await AuthService.getAllUsers(session);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">User Access & Role Administration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system users, assign operations team roles, or grant administrative permissions.
        </p>
      </div>

      <UsersAdminClient users={users} currentUserId={session.userId} />
    </div>
  );
}
