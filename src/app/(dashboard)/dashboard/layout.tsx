import { AuthService } from "@/features/authentication/auth-service";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  FileEdit,
  Plane,
  Calendar,
  Image as ImageIcon,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Sliders,
} from "lucide-react";
import { logoutAction } from "@/features/authentication/auth-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await AuthService.getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.role === "ADMIN";
  const isTeam = session.role === "TEAM" || isAdmin;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-navy-950 text-white flex-shrink-0 flex flex-col justify-between border-r border-navy-900">
        <div>
          {/* Logo & Portal Label */}
          <div className="p-6 border-b border-navy-900">
            <BrandLogo variant="light" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">OPERATIONS PORTAL</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isAdmin
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : isTeam
                    ? "bg-saffron-500/20 text-saffron-300 border border-saffron-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {session.role}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-saffron-400" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/enquiries"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
            >
              <Inbox className="w-4 h-4 text-saffron-400" />
              <span>
                {session.role === "USER" ? "My Enquiries" : "Enquiries Workflow"}
              </span>
            </Link>

            {/* Team and Admin CMS Screens */}
            {isTeam && (
              <>
                <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Content Management
                </div>

                <Link
                  href="/dashboard/content"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
                >
                  <FileEdit className="w-4 h-4 text-saffron-400" />
                  <span>Page Sections</span>
                </Link>

                <Link
                  href="/dashboard/services"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
                >
                  <Plane className="w-4 h-4 text-saffron-400" />
                  <span>Services Catalog</span>
                </Link>

                <Link
                  href="/dashboard/events"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
                >
                  <Calendar className="w-4 h-4 text-saffron-400" />
                  <span>Industry Events</span>
                </Link>

                <Link
                  href="/dashboard/gallery"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
                >
                  <ImageIcon className="w-4 h-4 text-saffron-400" />
                  <span>Media Gallery</span>
                </Link>
              </>
            )}

            {/* Admin Only Screens */}
            {isAdmin && (
              <>
                <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Administration
                </div>

                <Link
                  href="/dashboard/users"
                  className="flex items-center gap-3 px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition-colors font-medium"
                >
                  <Users className="w-4 h-4 text-saffron-400" />
                  <span>Users & Role Control</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-navy-900 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-navy-900/60">
            <p className="text-xs font-bold text-white truncate">{session.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{session.email}</p>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <Link
              href="/"
              target="_blank"
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <form
              action={async () => {
                "use server";
                await logoutAction();
              }}
            >
              <button
                type="submit"
                className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px] font-semibold"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
