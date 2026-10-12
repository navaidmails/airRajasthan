import { TrackingWidget } from "@/components/tracking/TrackingWidget";
import { Plane, ShieldCheck, HelpCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Consignment Visibility</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Live Air Cargo & Airway Bill Tracking
            </h1>
            <p className="text-base text-slate-300">
              Track air freight milestones, flight status, tarmac loading timestamps, and customs release checkpoints.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tracking Widget Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Tracking Widget */}
          <TrackingWidget variant="full" />

          {/* How tracking works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-xs mb-4">
                01
              </div>
              <h4 className="text-sm font-bold text-navy-950">Enter Airway Bill</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Provide your Master Airway Bill (MAWB) or House Airway Bill (HAWB) reference issued at booking confirmation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-xs mb-4">
                02
              </div>
              <h4 className="text-sm font-bold text-navy-950">Milestone Logging</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                View real-time apron loading, ULD weight check, customs clearance stamp, and flight departure status.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-xs mb-4">
                03
              </div>
              <h4 className="text-sm font-bold text-navy-950">Delivery & Handover</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Receive electronic confirmation once the consignment is available for consignee pickup at the destination hub.
              </p>
            </div>
          </div>

          {/* Need help banner */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-navy-950">Cannot locate your consignment?</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our 24/7 Operations Control Center (OCC) desk can assist with manual manifest checks.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-navy text-xs font-semibold py-2.5 px-4 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Contact OCC Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
