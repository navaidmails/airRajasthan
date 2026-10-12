import Link from "next/link";

interface BrandLogoProps {
  variant?: "dark" | "light";
  className?: string;
  withTagline?: boolean;
}

export function BrandLogo({ variant = "dark", className = "", withTagline = true }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Aviation Wing Icon */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-navy-900 border border-navy-700/60 shadow-sm group-hover:border-saffron-500 transition-colors">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-saffron-400 group-hover:rotate-6 transition-transform"
        >
          {/* Stylized swept wing & cargo jet outline */}
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20.5 3c-1-1-3-.5-4.5 1L12.5 7.5 4.3 5.7c-.7-.1-1.3.4-1.3 1.1 0 .4.2.8.5 1l5.5 4.2-3 3-2.5-.5c-.4-.1-.8.1-1 .4l-.5.6 3 1.5 1.5 3 .6-.5c.3-.2.5-.6.4-1l-.5-2.5 3-3 4.2 5.5c.2.3.6.5 1 .5.7 0 1.2-.6 1.1-1.3Z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-saffron-500 ring-2 ring-white"></span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center text-lg font-bold tracking-tight">
          <span className={isLight ? "text-white" : "text-navy-950"}>Air</span>
          <span className="text-saffron-500">Rajasthan</span>
        </div>
        {withTagline && (
          <span
            className={`text-[10px] uppercase font-semibold tracking-widest ${
              isLight ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Cargo & Logistics
          </span>
        )}
      </div>
    </Link>
  );
}
