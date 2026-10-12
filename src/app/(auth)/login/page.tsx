import { BrandLogo } from "@/components/common/BrandLogo";
import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-bold text-navy-950">
          AirRajasthan Operations & Client Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to access your cargo workflow, quotation tracking, and management console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-aviation rounded-2xl border border-slate-200 sm:px-10">
          <LoginForm />
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
