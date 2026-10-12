import { AuthService } from "@/features/authentication/auth-service";
import { GalleryService } from "@/features/gallery/gallery-service";
import { redirect } from "next/navigation";
import { GalleryEditorClient } from "./GalleryEditorClient";

export const dynamic = "force-dynamic";

export default async function GalleryDashboardPage() {
  const session = await AuthService.requireAuth();

  if (session.role !== "ADMIN" && session.role !== "TEAM") {
    redirect("/dashboard");
  }

  const items = await GalleryService.getAllGallery(session);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">Operations & Fleet Gallery Manager</h1>
        <p className="text-xs text-slate-500 mt-1">
          Catalog categorized photos of freighters, ramp loading, warehouse facilities, and cold-chain equipment.
        </p>
      </div>

      <GalleryEditorClient items={items} userRole={session.role} />
    </div>
  );
}
