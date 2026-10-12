"use client";

import { useState } from "react";
import { submitEnquiryAction } from "@/features/enquiries/enquiry-actions";
import { CheckCircle2, AlertCircle, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    serviceName: "General Contact Query",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await submitEnquiryAction({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      serviceName: formData.serviceName,
      message: formData.message,
      type: "GENERAL" as any,
      weightUnit: "KG",
    });

    setLoading(false);

    if (res.success && res.reference) {
      setSuccessReference(res.reference);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        serviceName: "General Contact Query",
        message: "",
      });
    } else {
      setErrorMessage(res.error || "Failed to submit message. Please try again.");
    }
  };

  if (successReference) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-navy-950">Message Submitted Successfully</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Your inquiry has been stored in our operations database. Our freight team has been notified.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block text-center">
          <p className="text-[11px] uppercase font-bold text-slate-500">Your Enquiry Reference</p>
          <p className="font-mono text-lg font-bold text-navy-950 mt-1">{successReference}</p>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => setSuccessReference(null)}
            className="btn-secondary text-xs font-semibold py-2 px-4"
          >
            Submit Another Message
          </button>
          <Link
            href="/"
            className="btn-navy text-xs font-semibold py-2 px-4"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
      <h3 className="text-lg font-bold text-navy-950 border-b border-slate-100 pb-4">
        Direct Operations Inquiries
      </h3>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company / Freight Forwarder
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Apex Logistics Ltd"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@apexlogistics.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98111 22334"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Inquiry Subject / Topic
        </label>
        <select
          value={formData.serviceName}
          onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all bg-white"
        >
          <option value="General Contact Query">General Operations Inquiries</option>
          <option value="Scheduled Air Freight">Scheduled Air Freight Allocation</option>
          <option value="Full & Part Cargo Charter">Ad-Hoc Cargo Aircraft Charter</option>
          <option value="Multimodal Cargo Consolidation">Multimodal Road-Feeder Network</option>
          <option value="Pharma Cold Chain">GDP Temperature Cold-Chain</option>
          <option value="Interline / Freight Forwarder Partnership">Interline Airline Alliance</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Message / Specifications <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please describe your cargo requirements, flight dates, or inquiry..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <span>Transmitting Enquiry...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Operations Message</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Duplicate protection active. Queries receive automated reference confirmation upon database insertion.
      </p>
    </form>
  );
}
