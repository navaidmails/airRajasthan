"use client";

import { useState } from "react";
import { submitEnquiryAction } from "@/features/enquiries/enquiry-actions";
import { EnquiryType } from "@prisma/client";
import {
  Plane,
  Package,
  Scale,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Send,
  Boxes,
  ThermometerSnowflake,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface QueryFormProps {
  initialService?: string;
  userEmail?: string;
  userName?: string;
}

export function QueryForm({ initialService = "", userEmail = "", userName = "" }: QueryFormProps) {
  const [formType, setFormType] = useState<"QUOTATION" | "GENERAL">("QUOTATION");
  const [loading, setLoading] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    type: EnquiryType;
    serviceName: string;
    origin: string;
    destination: string;
    cargoDescription: string;
    weight: string;
    weightUnit: "KG" | "LBS" | "TONNES";
    pieces: string;
    message: string;
  }>({
    name: userName,
    company: "",
    email: userEmail,
    phone: "",
    type: EnquiryType.QUOTATION,
    serviceName: initialService || "Scheduled Air Freight",
    origin: "",
    destination: "",
    cargoDescription: "",
    weight: "",
    weightUnit: "KG",
    pieces: "",
    message: "",
  });

  const handleTypeChange = (type: "QUOTATION" | "GENERAL") => {
    setFormType(type);
    setFormData((prev) => ({
      ...prev,
      type: type === "QUOTATION" ? EnquiryType.QUOTATION : EnquiryType.GENERAL,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await submitEnquiryAction({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      serviceName: formData.serviceName,
      origin: formData.origin,
      destination: formData.destination,
      cargoDescription: formData.cargoDescription,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      weightUnit: formData.weightUnit,
      pieces: formData.pieces ? parseInt(formData.pieces, 10) : undefined,
      message: formData.message,
    });

    setLoading(false);

    if (res.success && res.reference) {
      setSuccessReference(res.reference);
      setFormData({
        name: userName,
        company: "",
        email: userEmail,
        phone: "",
        type: EnquiryType.QUOTATION,
        serviceName: "Scheduled Air Freight",
        origin: "",
        destination: "",
        cargoDescription: "",
        weight: "",
        weightUnit: "KG",
        pieces: "",
        message: "",
      });
    } else {
      setErrorMessage(res.error || "Failed to submit quotation request. Please check inputs.");
    }
  };

  if (successReference) {
    return (
      <div className="card-aviation p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-navy-950">
            Enquiry Received & Registered
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Your cargo specifications have been securely inserted into the AirRajasthan operations database.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-navy-50 border border-navy-100 max-w-md mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-navy-600">
            Assigned Consignment Reference
          </span>
          <p className="font-mono text-2xl font-extrabold text-navy-950 mt-1 select-all">
            {successReference}
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Please retain this reference for all communications with our flight operations desk.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Workflow Progression:</span>
          </p>
          <p>
            Status set to <span className="font-semibold font-mono">NEW</span>. A notification dispatch job has been queued in the system outbox.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSuccessReference(null)}
            className="btn-secondary text-xs font-semibold py-2.5 px-5"
          >
            Submit Another Cargo Query
          </button>
          <Link href="/dashboard" className="btn-navy text-xs font-semibold py-2.5 px-5">
            Go to Client Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-aviation p-6 md:p-10 max-w-3xl mx-auto">
      {/* Form Type Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          type="button"
          onClick={() => handleTypeChange("QUOTATION")}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            formType === "QUOTATION"
              ? "text-navy-950 border-b-2 border-saffron-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Air Cargo Quotation
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("GENERAL")}
          className={`pb-3 px-6 text-sm font-bold transition-all relative ${
            formType === "GENERAL"
              ? "text-navy-950 border-b-2 border-saffron-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          General Operations Inquiry
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Shipper / Representative Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-2">
            <span>1. Shipper / Contact Representative</span>
          </h4>

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
                placeholder="Ramesh Patel"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Agency Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Rajputana Exports Pvt Ltd"
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
                placeholder="ramesh@rajputanaexports.com"
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
                placeholder="+91 98290 11223"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Service & Routing */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">
            2. Service Category & Flight Routing
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enquiry Classification
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none bg-white"
              >
                <option value={EnquiryType.QUOTATION}>Cargo Quotation Request</option>
                <option value={EnquiryType.CHARTER}>Dedicated Aircraft Charter</option>
                <option value={EnquiryType.PHARMA}>Pharma & Cold-Chain (+2°C to +8°C)</option>
                <option value={EnquiryType.PERISHABLE}>Perishable & Agricultural Produce</option>
                <option value={EnquiryType.EXPRESS}>Express Time-Critical / AOG</option>
                <option value={EnquiryType.GENERAL}>General Operational Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Air Service Offering
              </label>
              <select
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none bg-white"
              >
                <option value="Scheduled Air Freight">Scheduled Air Freight</option>
                <option value="Full & Part Cargo Charter">Full & Part Cargo Charter</option>
                <option value="Multimodal Cargo Consolidation">Multimodal Cargo Consolidation</option>
                <option value="Pharma & Perishable Cold Chain">Pharma & Perishable Cold Chain</option>
                <option value="AOG & Aerospace Urgent Lift">AOG & Aerospace Urgent Lift</option>
                <option value="General Cargo Consultation">General Cargo Consultation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Origin Hub / Airport
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. JAI (Jaipur) or Jodhpur ICD"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination Hub / Airport
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g. DXB (Dubai) or FRA (Frankfurt)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all uppercase"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Cargo Specifications (Visible when quotation) */}
        {formType === "QUOTATION" && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950">
              3. Cargo Specifications & Payload Metrics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gross Weight
                </label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="1250"
                    className="w-full px-3.5 py-2.5 rounded-l-lg border border-r-0 border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
                  />
                  <select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as any })}
                    className="px-2.5 py-2.5 rounded-r-lg border border-slate-300 text-xs bg-slate-50 text-slate-700 font-semibold outline-none"
                  >
                    <option value="KG">KG</option>
                    <option value="LBS">LBS</option>
                    <option value="TONNES">TONS</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Piece Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.pieces}
                  onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                  placeholder="18"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commodity Classification
                </label>
                <input
                  type="text"
                  value={formData.cargoDescription}
                  onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                  placeholder="e.g. Textiles, Solar inverters, Pharmaceuticals"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Message & Specific Requirements */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Cargo Requirements, Flight Timeline & Handling Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Please specify shipment dimensions (L x W x H in cm), preferred uplift date, dangerous goods (DG) status, or temperature constraints..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none transition-all"
          />
          <p className="text-[11px] text-slate-400">
            Note: Customer file attachments will be enabled once private persistent S3 storage is connected.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-aviation"
        >
          {loading ? (
            <span>Processing Enquiry...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Official Cargo Quotation Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
