"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { AuthSession } from "@/features/authentication/types";
import { logoutAction } from "@/features/authentication/auth-actions";
import { Menu, X, Plane, Shield, LogOut, LayoutDashboard, Search } from "lucide-react";

interface NavbarProps {
  session: AuthSession | null;
}

export function Navbar({ session }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "Track Cargo", href: "/tracking" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-navy-950 font-semibold bg-navy-50"
                      : "text-slate-600 hover:text-navy-950 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/query"
              className="btn-primary text-xs font-semibold uppercase tracking-wider py-2.5 px-4"
            >
              Request a Quote
            </Link>

            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-navy-50 text-navy-950 hover:bg-navy-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-navy-700" />
                  <span>Dashboard</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy-900 text-white">
                    {session.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-secondary text-xs font-semibold py-2.5 px-4"
              >
                Client Portal / Login
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/tracking"
              className="p-2 text-slate-600 hover:text-navy-950"
              title="Track Cargo"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-navy-950 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === link.href ? "bg-navy-50 text-navy-950 font-bold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/query"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full text-center py-2.5 text-xs font-semibold uppercase tracking-wider"
            >
              Request a Quote
            </Link>

            {session ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-navy-50 border border-navy-100">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-navy-800" />
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-navy-950 hover:underline"
                  >
                    Go to Dashboard ({session.role})
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary w-full text-center py-2.5 text-xs font-semibold"
              >
                Client Portal / Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
