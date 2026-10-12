import { AuthService } from "@/features/authentication/auth-service";
import { ContentService } from "@/features/content/content-service";
import { redirect } from "next/navigation";
import { ContentEditorClient } from "./ContentEditorClient";

export const dynamic = "force-dynamic";

export default async function ContentDashboardPage() {
  const session = await AuthService.requireAuth();

  if (session.role !== "ADMIN" && session.role !== "TEAM") {
    redirect("/dashboard");
  }

  const sections = await ContentService.getAllSections(session);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">CMS Page Sections Editor</h1>
        <p className="text-xs text-slate-500 mt-1">
          Edit draft corporate introductions, hero headlines, benefits, and operations contact details without code rebuilds.
        </p>
      </div>

      <ContentEditorClient sections={sections} userRole={session.role} />
    </div>
  );
}
