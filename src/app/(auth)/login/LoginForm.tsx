"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/features/authentication/auth-actions";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAction({ email, password });
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Login failed. Please check credentials.");
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Corporate Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@airrajasthan.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-navy w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick-Select Box */}
      <div className="pt-6 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-navy-950 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-saffron-500" />
          <span>Demo Access Quick Fill:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo("admin@airrajasthan.com", "AdminSecurePassword2026!")}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
          >
            <div className="text-[11px] font-bold text-navy-950">Administrator</div>
            <div className="text-[10px] text-slate-500 truncate">admin@airrajasthan.com</div>
            <div className="text-[9px] font-mono text-saffron-600 mt-0.5">Role: ADMIN</div>
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo("team@airrajasthan.com", "TeamSecurePassword2026!")}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
          >
            <div className="text-[11px] font-bold text-navy-950">Operations Team</div>
            <div className="text-[10px] text-slate-500 truncate">team@airrajasthan.com</div>
            <div className="text-[9px] font-mono text-saffron-600 mt-0.5">Role: TEAM</div>
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo("client@logistics-partner.com", "ClientSecurePassword2026!")}
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
          >
            <div className="text-[11px] font-bold text-navy-950">Client Shipper</div>
            <div className="text-[10px] text-slate-500 truncate">client@logistics-partner.com</div>
            <div className="text-[9px] font-mono text-saffron-600 mt-0.5">Role: USER</div>
          </button>
        </div>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          New client forwarder?{" "}
          <Link href="/register" className="text-navy-950 font-bold hover:underline">
            Register Client Account
          </Link>
        </p>
      </div>
    </div>
  );
}
