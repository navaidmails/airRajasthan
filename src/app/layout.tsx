import type { Metadata } from "next";
import { Rajdhani, Barlow } from "next/font/google";
import "./globals.css";

// Headings and prominent display text
const rajdhani = Rajdhani({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

// Paragraphs, navigation, buttons, forms, tables
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
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
    <html lang="en" className={`${rajdhani.variable} ${barlow.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-surface-bg text-charcoal-700 antialiased">
        {children}
      </body>
    </html>
  );
}
