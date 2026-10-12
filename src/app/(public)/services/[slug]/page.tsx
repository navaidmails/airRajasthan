import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ServiceCatalog } from "@/features/services/service-catalog";
import { Plane, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, PackageCheck } from "lucide-react";

export const revalidate = 60;

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await ServiceCatalog.getPublishedServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  let features: string[] = [];
  try {
    features = JSON.parse(service.featuresJson);
  } catch {
    features = [];
  }

  return (
    <div className="w-full">
      {/* Detail Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-400 hover:text-saffron-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Services</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-850 border border-navy-700 text-xs font-semibold text-saffron-400">
              <Plane className="w-3.5 h-3.5" />
              <span>Draft Service Specification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {service.title}
            </h1>
            <p className="text-base text-slate-300">{service.shortDescription}</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-8">
              {service.imageUrl && (
                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-navy-900 border border-slate-200 shadow-sm">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-md backdrop-blur">
                    Equipment & Ramp Conceptual Imagery
                  </div>
                </div>
              )}

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
                <h2 className="text-xl font-bold text-navy-950 mb-4">Service Overview</h2>
                {service.fullDescription.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 text-slate-600">
                    {para}
                  </p>
                ))}
              </div>

              {features.length > 0 && (
                <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-base font-bold text-navy-950 mb-4 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-saffron-500" />
                    <span>Key Operational Capabilities & Handling Protocols</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-saffron-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editable Unconfirmed Specification Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Draft Offering Notice</span>
                </p>
                <p className="text-amber-900/90 leading-relaxed">
                  The aircraft capacity, routes, payload limits, and handling metrics listed for this offering represent draft operational models. These specifications will be finalized upon commercial deployment.
                </p>
              </div>
            </div>

            {/* Right Action Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-navy-950 text-white shadow-aviation space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Book or Inquire</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Request bespoke cargo quotation or charter allocation for this service.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href={`/query?service=${encodeURIComponent(service.title)}`}
                    className="btn-primary w-full text-center py-3 text-xs font-bold uppercase tracking-wider block"
                  >
                    Request a Quotation
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full text-center py-3 text-xs font-semibold text-slate-300 hover:text-white bg-navy-850 hover:bg-navy-800 rounded-lg transition-colors block border border-navy-700"
                  >
                    Talk to Operations Desk
                  </Link>
                </div>

                <div className="pt-4 border-t border-navy-850 text-[11px] text-slate-400 space-y-2">
                  <p className="font-semibold text-saffron-400">Response SLA:</p>
                  <p>Our air cargo desk responds within 2 business hours for standard freight and 30 minutes for emergency AOG charter queries.</p>
                </div>
              </div>

              {/* Feeder Corridors */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wider mb-3">
                  Connected Trade Gateways
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center justify-between">
                    <span>Jaipur International (JAI)</span>
                    <span className="font-mono text-[10px] text-slate-400">Primary Hub</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Delhi Indira Gandhi (DEL)</span>
                    <span className="font-mono text-[10px] text-slate-400">Gateway Link</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Mumbai CSMIA (BOM)</span>
                    <span className="font-mono text-[10px] text-slate-400">RFS Feeder</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Dubai International (DXB)</span>
                    <span className="font-mono text-[10px] text-slate-400">Scheduled Cargo</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
