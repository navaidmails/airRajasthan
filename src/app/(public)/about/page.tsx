import { ContentService } from "@/features/content/content-service";
import Link from "next/link";
import { Plane, Compass, Target, Shield, Users, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
  const introSection = await ContentService.getPublishedSection("about_intro");

  const title =
    introSection?.title || "Pioneering Strategic Air Cargo Across Rajasthan & Global Corridors";
  const subtitle = introSection?.subtitle || "AirRajasthan Corporate Profile";
  const content =
    introSection?.content ||
    "AirRajasthan is conceptualized as an agile air cargo carrier and logistics operator connecting industrial belts across Rajasthan with major Middle Eastern, European, and Southeast Asian hubs.";

  let meta: { mission?: string; vision?: string; coreValues?: string[] } = {};
  if (introSection?.metaJson) {
    try {
      meta = JSON.parse(introSection.metaJson);
    } catch {
      meta = {};
    }
  }

  const team = [
    {
      name: "Capt. Arvind Rathore",
      role: "Director of Flight Operations (OCC)",
      bio: "28 years in commercial aviation cargo routing and flight dispatch logistics across South Asia and GCC corridors.",
      isDraft: true,
    },
    {
      name: "Pooja Deshmukh",
      role: "Head of Ramp & Ground Cargo Operations",
      bio: "Specialist in airside freight handling, ULD build-up, and pharma GDP temperature-sensitive logistics.",
      isDraft: true,
    },
    {
      name: "Farhan Al-Mansoor",
      role: "VP Charter Solutions & Network Alliances",
      bio: "Former air charter broker managing heavy-lift aircraft and ad-hoc industrial cargo operations.",
      isDraft: true,
    },
  ];

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">About AirRajasthan</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-base text-slate-300 font-medium">{subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Narrative & Disclaimer */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6 text-slate-700 leading-relaxed text-base">
              <div className="prose prose-slate max-w-none">
                {content.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 text-slate-600">
                    {para}
                  </p>
                ))}
              </div>

              {/* Explicit Draft Business Content Notice */}
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-900">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Important Commercial Disclosure</span>
                </div>
                <p>
                  AirRajasthan is an active B2B cargo demo and architecture blueprint. Operational fleet leasing, scheduled corridor slots, and ground-handling agreements depicted are draft frameworks pending regulatory aviation approvals.
                </p>
              </div>
            </div>

            {/* Quick Metrics & Highlights */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-navy-50 border border-navy-100">
                <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider mb-4">
                  Strategic Hub Overview
                </h3>
                <dl className="space-y-4 text-xs">
                  <div>
                    <dt className="text-slate-500">Primary Feeder Gateways</dt>
                    <dd className="font-bold text-navy-950 text-sm mt-0.5">Jaipur (JAI) • Jodhpur (JDH) • Udaipur (UDR)</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Key Export Commodities</dt>
                    <dd className="font-bold text-navy-950 text-sm mt-0.5">Pharma, Gems & Jewelry, Handicrafts, Auto Components</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Target Freight Corridors</dt>
                    <dd className="font-bold text-navy-950 text-sm mt-0.5">Gulf GCC • Central Europe • South East Asia</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Operational Model</dt>
                    <dd className="font-bold text-navy-950 text-sm mt-0.5">Dedicated Cargo Freighters & Bonded RFS Feeder</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-aviation p-8">
              <div className="w-12 h-12 rounded-xl bg-navy-900 text-saffron-400 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-950">Our Mission</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {meta.mission ||
                  "Deliver high-reliability air cargo connectivity and tailored charters with unwavering speed, regulatory compliance, and total consignment safety."}
              </p>
            </div>

            <div className="card-aviation p-8">
              <div className="w-12 h-12 rounded-xl bg-saffron-500 text-navy-950 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-950">Our Vision</h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {meta.vision ||
                  "Establish Rajasthan's most agile air freight bridge linking northern and western India's manufacturing corridors with world trade routes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="badge-navy mb-3">Operations Leadership</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
              Experienced Aviation Professionals
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Sample advisory leadership structure (profiles maintained for demonstration).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div key={idx} className="card-aviation p-6 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-lg mb-4">
                    {m.name.charAt(0)}
                  </div>
                  <h4 className="text-base font-bold text-navy-950">{m.name}</h4>
                  <p className="text-xs font-semibold text-saffron-600 mt-1">{m.role}</p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{m.bio}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Demo Profile</span>
                  <span className="font-semibold text-navy-900">OCC Operations</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/query"
              className="btn-primary text-xs font-bold uppercase tracking-wider py-3 px-6"
            >
              Partner with AirRajasthan &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
