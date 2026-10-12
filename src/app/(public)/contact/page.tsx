import { ContentService } from "@/features/content/content-service";
import { ContactForm } from "./ContactForm";
import { MapPin, Phone, Mail, Clock, ShieldCheck, AlertCircle } from "lucide-react";

export const revalidate = 60;

export default async function ContactPage() {
  const contactSection = await ContentService.getPublishedSection("contact_details");

  const title = contactSection?.title || "Get in Touch with Air Cargo Operations";
  const subtitle = contactSection?.subtitle || "24/7 Air Freight Desk & Charter Inquiries";
  const content =
    contactSection?.content ||
    "Our operations team is available around the clock to address quotation requests, charter charters, and consignment enquiries.";

  let contactMeta = {
    headOffice: "Air Cargo Complex, Terminal 1 Cargo Gate, Sanganer, Jaipur, Rajasthan 302029 (Placeholder)",
    phone: "+91 141 289 0000 (Demo Operations Line)",
    email: "cargo@airrajasthan.com (Demo Desk)",
    charterHotline: "+91 9829 000 000 (AOG & Charter Emergency)",
    hours: "24/7 Operations Control Center (OCC)",
  };

  if (contactSection?.metaJson) {
    try {
      contactMeta = { ...contactMeta, ...JSON.parse(contactSection.metaJson) };
    } catch {}
  }

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Cargo Desk Contact</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-base text-slate-300">{subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-navy-950">Operations Control Center (OCC)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {content}
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-navy-950 text-xs">Air Cargo Facility Address</p>
                      <p className="text-slate-600 mt-1 leading-relaxed">{contactMeta.headOffice}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-navy-950 text-xs">Direct Freight Desk</p>
                      <p className="text-slate-600 mt-1">{contactMeta.phone}</p>
                      <p className="text-saffron-600 font-semibold mt-1">
                        Emergency AOG: {contactMeta.charterHotline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-navy-950 text-xs">Operations Email</p>
                      <p className="text-slate-600 mt-1">{contactMeta.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Clock className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-navy-950 text-xs">Operating Hours</p>
                      <p className="text-slate-600 mt-1">{contactMeta.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Placeholder Notice */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Locations and phone lines shown above are demo operational placeholders for testing.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
