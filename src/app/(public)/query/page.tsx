import { AuthService } from "@/features/authentication/auth-service";
import { QueryForm } from "./QueryForm";
import { ShieldCheck, Clock, FileText } from "lucide-react";

interface QueryPageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function QueryPage({ searchParams }: QueryPageProps) {
  const { service } = await searchParams;
  const session = await AuthService.getCurrentSession();

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Cargo Quotation Desk</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Request an Air Cargo Quotation
            </h1>
            <p className="text-base text-slate-300">
              Submit your air freight, charter, or multimodal routing requirements. Enquiries are logged immediately with persistent reference tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {session && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div>
                <span className="font-bold">Logged In Account:</span> {session.name} ({session.email})
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-bold text-[10px]">
                {session.role}
              </span>
            </div>
          )}

          <QueryForm
            initialService={service || ""}
            userEmail={session?.email || ""}
            userName={session?.name || ""}
          />
        </div>
      </section>
    </div>
  );
}
