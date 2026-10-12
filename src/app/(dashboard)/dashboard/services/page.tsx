import { AuthService } from "@/features/authentication/auth-service";
import { ServiceCatalog } from "@/features/services/service-catalog";
import { redirect } from "next/navigation";
import { ServicesEditorClient } from "./ServicesEditorClient";

export const dynamic = "force-dynamic";

export default async function ServicesDashboardPage() {
  const session = await AuthService.requireAuth();

  if (session.role !== "ADMIN" && session.role !== "TEAM") {
    redirect("/dashboard");
  }

  const services = await ServiceCatalog.getAllServices(session);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">Services Catalog Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Add and modify air freight offerings, charter capabilities, and technical payload metrics.
        </p>
      </div>

      <ServicesEditorClient services={services} userRole={session.role} />
    </div>
  );
}
