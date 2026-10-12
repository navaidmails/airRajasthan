import Link from "next/link";
import Image from "next/image";
import { ContentService } from "@/features/content/content-service";
import { ServiceCatalog } from "@/features/services/service-catalog";
import { EventService } from "@/features/events/event-service";
import { TrackingWidget } from "@/components/tracking/TrackingWidget";
import { formatDateOnly } from "@/lib/utils";
import {
  Plane,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Boxes,
  Zap,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [heroSection, benefitsSection, services, events] = await Promise.all([
    ContentService.getPublishedSection("home_hero"),
    ContentService.getPublishedSection("business_benefits"),
    ServiceCatalog.getPublishedServices(),
    EventService.getPublishedEvents(),
  ]);

  const heroTitle = heroSection?.title || "Reliable B2B Air Cargo & Charter Solutions";
  const heroSubtitle = heroSection?.subtitle || "Connecting Western India with Global Trade Corridors";
  const heroContent =
    heroSection?.content ||
    "AirRajasthan provides dedicated scheduled freight, full-charter aircraft, and multimodal cargo consolidation. Engineered for mission-critical supply chains, temperature-sensitive pharma, and oversized industrial project cargo.";

  let benefits: Array<{ title: string; description: string }> = [];
  if (benefitsSection?.metaJson) {
    try {
      benefits = JSON.parse(benefitsSection.metaJson);
    } catch {
      benefits = [];
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section with Aviation Navy Background */}
      <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white overflow-hidden py-20 lg:py-28 border-b border-navy-850">
        {/* Subtle aeronautical grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-850 border border-navy-700 text-xs font-semibold text-saffron-400">
                <span className="w-2 h-2 rounded-full bg-saffron-400 animate-pulse" />
                <span>Regional Air Cargo Hub • Prototype</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {heroTitle}
              </h1>

              <p className="text-lg text-saffron-300 font-medium">{heroSubtitle}</p>

              <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                {heroContent}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/query"
                  className="btn-primary text-sm font-bold uppercase tracking-wider py-3.5 px-6 shadow-aviation"
                >
                  Request a Cargo Quote
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-navy-800/80 hover:bg-navy-800 border border-navy-700 transition-colors"
                >
                  <span>Explore Draft Offerings</span>
                  <ArrowRight className="w-4 h-4 text-saffron-400" />
                </Link>
              </div>

              {/* Key Trust & Operations Badges */}
              <div className="pt-6 border-t border-navy-850 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-navy-850 text-saffron-400">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Dedicated Ramp</p>
                    <p className="text-slate-400 text-[11px]">Direct Apron Handling</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-navy-850 text-saffron-400">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Bonded Multimodal</p>
                    <p className="text-slate-400 text-[11px]">RFS Trucking Network</p>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-navy-850 text-saffron-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">24/7 Desk (OCC)</p>
                    <p className="text-slate-400 text-[11px]">Flight Watch Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Integrated Demo Tracking Widget */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-saffron-500/20 to-navy-500/30 blur-xl opacity-50" />
                <div className="relative">
                  <TrackingWidget variant="compact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="badge-saffron mb-3">Air Cargo Capabilities</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                Specialized B2B Logistics Offerings
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Draft commercial offerings designed for freight forwarders, industrial manufacturers, and global supply chains.
              </p>
            </div>
            <Link
              href="/services"
              className="text-navy-900 hover:text-saffron-600 font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Detailed Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="card-aviation flex flex-col justify-between p-6 hover:-translate-y-1 transition-all group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-navy-900 text-saffron-400 flex items-center justify-center mb-5 group-hover:bg-saffron-500 group-hover:text-navy-950 transition-colors">
                      <Plane className="w-6 h-6" />
                    </div>

                    <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
                      Draft Spec
                    </div>

                    <h3 className="text-lg font-bold text-navy-950 group-hover:text-saffron-600 transition-colors">
                      {svc.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                      {svc.shortDescription}
                    </p>

                    {features.length > 0 && (
                      <ul className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                        {features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-xs font-bold text-navy-900 group-hover:text-saffron-600 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="badge-navy mb-3">Enterprise Advantage</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                {benefitsSection?.title || "Why Logistics Leaders Choose AirRajasthan"}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {benefitsSection?.subtitle || "Engineered for Time-Critical Air Freight Precision"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-saffron-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                    0{i + 1}
                  </div>
                  <h4 className="text-base font-bold text-navy-950">{b.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry Workflow Process */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="badge-saffron mb-3">Transparent Booking Flow</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              How Consignment Enquiries Are Handled
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From online quotation intake to airway bill execution and ramp turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm relative">
              <div className="text-saffron-500 font-mono text-xs font-bold mb-2">STAGE 01</div>
              <h4 className="text-base font-bold text-navy-950">1. Request Quotation</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Submit cargo origin, destination, commodity, and dimensional weight via our portal. A unique reference code is issued immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm relative">
              <div className="text-saffron-500 font-mono text-xs font-bold mb-2">STAGE 02</div>
              <h4 className="text-base font-bold text-navy-950">2. Feasibility & Space</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our air cargo desk verifies flight deck allocation, ramp handling capabilities, and bonded trucking slots.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm relative">
              <div className="text-saffron-500 font-mono text-xs font-bold mb-2">STAGE 03</div>
              <h4 className="text-base font-bold text-navy-950">3. Ramp Staging & Uplift</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Cargo is weighed, X-ray screened, consolidated onto ULD pallets, and loaded onto scheduled or charter freighters.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-sm relative">
              <div className="text-saffron-500 font-mono text-xs font-bold mb-2">STAGE 04</div>
              <h4 className="text-base font-bold text-navy-950">4. Destination Delivery</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Break-bulk processing at destination terminal, customs release handover, and electronic proof of delivery (e-POD).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="badge-navy mb-3">Industry Engagements</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
                  Aviation & Cargo Conclaves
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Stay updated on trade corridor summits, logistics symposiums, and regional meetings.
                </p>
              </div>
              <Link
                href="/events"
                className="text-navy-900 hover:text-saffron-600 font-semibold text-sm inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View All Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.slice(0, 3).map((ev) => (
                <div
                  key={ev.id}
                  className="card-aviation flex flex-col justify-between p-6 hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-saffron-500" />
                        {formatDateOnly(ev.eventDate)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.isPast
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {ev.isPast ? "Past Event" : "Upcoming"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy-950 line-clamp-2">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {ev.summary}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/events/${ev.slug}`}
                      className="text-xs font-bold text-navy-900 hover:text-saffron-600 inline-flex items-center gap-1"
                    >
                      <span>Read Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-xs text-saffron-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Fast Turnaround Quotations</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white max-w-2xl mx-auto">
            Ready to Plan Your Cargo Uplift or Charter?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Submit your cargo specifications directly to our operations desk. All queries are tracked in our persistent workflow system.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/query"
              className="btn-primary text-xs font-bold uppercase tracking-wider py-3.5 px-7"
            >
              Request a Cargo Quotation
            </Link>
            <Link
              href="/contact"
              className="btn-secondary text-xs font-bold py-3.5 px-6"
            >
              Contact Operations Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
