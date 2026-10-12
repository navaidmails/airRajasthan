"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error encountered:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-navy-950">System Processing Error</h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6">
        An unexpected condition occurred while communicating with the operations database or rendering the view.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="btn-navy text-xs font-semibold py-2 px-4 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
        <Link href="/" className="btn-secondary text-xs font-semibold py-2 px-4">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
