import Link from "next/link";
import Image from "next/image";
import { ServiceCatalog } from "@/features/services/service-catalog";
import { Plane, ArrowRight, CheckCircle2, ShieldCheck, Box } from "lucide-react";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await ServiceCatalog.getPublishedServices();

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Air Cargo Capabilities</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              B2B Air Freight & Specialized Logistics Services
            </h1>
            <p className="text-base text-slate-300">
              Draft commercial offerings connecting western India's industrial manufacturers and exporters with high-demand international destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Services List Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Important Notice */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                All service offerings, schedules, and payloads represent draft specifications pending regulatory licensing and fleet commissioning.
              </span>
            </div>
            <Link
              href="/query"
              className="text-amber-950 font-bold underline hover:text-amber-800 flex-shrink-0"
            >
              Inquire Now
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((svc) => {
              let features: string[] = [];
              try {
                features = JSON.parse(svc.featuresJson);
              } catch {
                features = [];
              }

              return (
                <div
                  key={svc.id}
                  className="card-aviation overflow-hidden flex flex-col justify-between group"
                >
                  {/* Media banner if available */}
                  {svc.imageUrl && (
                    <div className="relative w-full h-48 bg-navy-900 overflow-hidden">
                      <Image
                        src={svc.imageUrl}
                        alt={svc.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                        <span className="font-semibold text-saffron-400 uppercase tracking-wider text-[11px]">
                          AirRajasthan Operations
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-mono">
                          Draft Offering
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center">
                          <Plane className="w-5 h-5 text-navy-800" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 uppercase">
                          Slug: {svc.slug}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-navy-950 group-hover:text-saffron-600 transition-colors">
                        {svc.title}
                      </h2>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {svc.shortDescription}
                      </p>

                      {features.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">
                            Operational Capabilities
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-600">
                            {features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <Link
                        href={`/services/${svc.slug}`}
                        className="btn-navy text-xs font-semibold py-2.5 px-4"
                      >
                        Detailed Specs &rarr;
                      </Link>

                      <Link
                        href={`/query?service=${encodeURIComponent(svc.title)}`}
                        className="btn-primary text-xs font-bold uppercase tracking-wider py-2.5 px-4"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
