import { Plane } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-saffron-500 animate-spin" />
        <Plane className="w-5 h-5 text-navy-950 absolute" />
      </div>
      <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-mono">
        Loading Flight Operations Data...
      </p>
    </div>
  );
}
