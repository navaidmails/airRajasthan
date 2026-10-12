import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { Plane, MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <BrandLogo variant="light" />
            <p className="text-sm text-slate-400 leading-relaxed">
              B2B air cargo operations linking industrial corridors across Rajasthan with domestic and international trade gateways.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-xs text-saffron-400">
              <ShieldCheck className="w-4 h-4" />
              <span>B2B Logistics Platform Prototype</span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-saffron-400 mb-4">
              Cargo Offerings (Draft)
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/air-freight" className="text-slate-400 hover:text-white transition-colors">
                  Scheduled Air Freight
                </Link>
              </li>
              <li>
                <Link href="/services/cargo-charter" className="text-slate-400 hover:text-white transition-colors">
                  Dedicated Cargo Charter
                </Link>
              </li>
              <li>
                <Link href="/services/cargo-consolidation" className="text-slate-400 hover:text-white transition-colors">
                  Multimodal Consolidation
                </Link>
              </li>
              <li>
                <Link href="/services/pharma-cold-chain" className="text-slate-400 hover:text-white transition-colors">
                  Pharma Cold-Chain
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-saffron-400 hover:underline inline-flex items-center gap-1 text-xs font-semibold pt-1">
                  View All Services &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & Tools */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-saffron-400 mb-4">
              Operations & Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tracking" className="text-slate-400 hover:text-white transition-colors">
                  Live Cargo Tracking (Demo)
                </Link>
              </li>
              <li>
                <Link href="/query" className="text-slate-400 hover:text-white transition-colors">
                  Request a Quotation
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-400 hover:text-white transition-colors">
                  Industry Events & Conclaves
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-slate-400 hover:text-white transition-colors">
                  Fleet & Operations Gallery
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                  Operations & Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations Contact */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-saffron-400 mb-4">
              Operations Control (OCC)
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-saffron-400 mt-1 flex-shrink-0" />
                <span>Airside Cargo Shed Gate, Sanganer Airport, Jaipur 302029 (Placeholder)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                <span>+91 141 289 0000 (Demo Line)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                <span>cargo@airrajasthan.com (Demo Desk)</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>24/7 Operations Monitoring</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-navy-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} AirRajasthan Cargo & Logistics Demo. All rights reserved.
          </p>
          <p className="text-slate-400 text-center sm:text-right max-w-md">
            This platform is an interactive engineering prototype. Unconfirmed operational details remain editable and subject to commercial launch.
          </p>
        </div>
      </div>
    </footer>
  );
}
