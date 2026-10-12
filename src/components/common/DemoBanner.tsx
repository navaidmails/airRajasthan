import { AlertCircle } from "lucide-react";

export function DemoBanner() {
  return (
    <aside aria-label="Demo platform notice" className="bg-navy-950 text-slate-300 border-b border-navy-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500"></span>
          </span>
          <span className="font-semibold text-saffron-400 uppercase tracking-wider text-[11px]">
            Demo Environment:
          </span>
          <span className="text-slate-300">
            AirRajasthan B2B Cargo Portal prototype. Operating routes, fleet allocations, and schedules are draft specifications pending commercial confirmation.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="hidden sm:inline">24/7 Operations Desk (Demo)</span>
          <span className="text-saffron-400 font-mono font-medium">AWB Tracking Demo Active</span>
        </div>
      </div>
    </aside>
  );
}
