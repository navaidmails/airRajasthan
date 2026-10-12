import { BrandLogo } from "@/components/common/BrandLogo";
import { RegisterForm } from "./RegisterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-bold text-navy-950">
          Create AirRajasthan Client Account
        </h1>
        <p className="text-xs text-slate-500">
          Register to submit and monitor your air freight quotations, view replies, and track consignment history.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-aviation rounded-2xl border border-slate-200 sm:px-10">
          <RegisterForm />
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
