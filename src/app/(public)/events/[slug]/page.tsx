import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EventService } from "@/features/events/event-service";
import { formatDateOnly } from "@/lib/utils";
import { Calendar, MapPin, ArrowLeft, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export const revalidate = 60;

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await EventService.getPublishedEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-400 hover:text-saffron-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  event.isPast
                    ? "bg-slate-700 text-slate-300"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {event.isPast ? "Concluded Event" : "Upcoming Event"}
              </span>
              <span className="text-xs text-saffron-400 font-mono">
                {formatDateOnly(event.eventDate)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {event.title}
            </h1>
            <p className="text-base text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron-400 flex-shrink-0" />
              <span>{event.location}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative Area */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              {event.imageUrl && (
                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-navy-900 border border-slate-200 shadow-sm">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/90 text-sm text-slate-700 italic">
                {event.summary}
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base">
                <h2 className="text-xl font-bold text-navy-950 mb-4">Agenda & Symposium Proceedings</h2>
                {event.content.split("\n\n").map((para, i) => (
                  <p key={i} className="mb-4 text-slate-600 whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-navy-950 text-white shadow-aviation space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Event Delegation</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Meet AirRajasthan network and charter coordinators during this summit.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href={`/query?service=Event+Meeting+Request`}
                    className="btn-primary w-full text-center py-3 text-xs font-bold uppercase tracking-wider block"
                  >
                    Schedule a Meeting
                  </Link>

                  <Link
                    href="/contact"
                    className="w-full text-center py-3 text-xs font-semibold text-slate-300 hover:text-white bg-navy-850 hover:bg-navy-800 rounded-lg transition-colors block border border-navy-700"
                  >
                    Contact Delegation Desk
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
                <h4 className="font-bold text-navy-950 uppercase tracking-wider">Event Details</h4>
                <div>
                  <p className="text-slate-400 text-[11px]">Date:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{formatDateOnly(event.eventDate)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Venue:</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{event.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
