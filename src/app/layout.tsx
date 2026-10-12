import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AirRajasthan | B2B Air Cargo & Logistics",
  description:
    "AirRajasthan provides dedicated scheduled freight, full-charter aircraft, and multimodal cargo consolidation connecting regional corridors with global trade routes.",
  keywords: [
    "Air Cargo",
    "Air Freight Rajasthan",
    "B2B Logistics",
    "Jaipur Air Cargo",
    "Cargo Charter India",
    "Pharma Cold Chain Air",
    "Airway Bill Tracking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
