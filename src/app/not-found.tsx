import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="mb-6">
        <BrandLogo />
      </div>
      <div className="w-16 h-16 rounded-2xl bg-navy-100 text-navy-950 flex items-center justify-center mx-auto mb-6">
        <Plane className="w-8 h-8 text-saffron-500" />
      </div>
      <span className="font-mono text-xs font-bold text-saffron-600 uppercase tracking-widest">
        404 • Flight Path Not Found
      </span>
      <h1 className="text-3xl font-extrabold text-navy-950 mt-2 mb-3">
        Page or Waypoint Does Not Exist
      </h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        The requested airway bill, service catalog offering, or dashboard route could not be located in our flight system.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="btn-primary text-xs font-bold py-2.5 px-5">
          Return to Hub Homepage
        </Link>
        <Link href="/services" className="btn-secondary text-xs font-semibold py-2.5 px-5">
          Browse Cargo Services
        </Link>
      </div>
    </div>
  );
}
