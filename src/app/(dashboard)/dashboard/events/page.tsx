import { AuthService } from "@/features/authentication/auth-service";
import { EventService } from "@/features/events/event-service";
import { redirect } from "next/navigation";
import { EventsEditorClient } from "./EventsEditorClient";

export const dynamic = "force-dynamic";

export default async function EventsDashboardPage() {
  const session = await AuthService.requireAuth();

  if (session.role !== "ADMIN" && session.role !== "TEAM") {
    redirect("/dashboard");
  }

  const events = await EventService.getAllEvents(session);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-navy-950">Industry Events & Conclaves Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage upcoming logistics symposiums, trade conference agendas, and proceedings.
        </p>
      </div>

      <EventsEditorClient events={events} userRole={session.role} />
    </div>
  );
}
