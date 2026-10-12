import Link from "next/link";
import Image from "next/image";
import { EventService } from "@/features/events/event-service";
import { formatDateOnly } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, Clock, ShieldCheck } from "lucide-react";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await EventService.getPublishedEvents();

  const upcoming = events.filter((e) => !e.isPast);
  const past = events.filter((e) => e.isPast);

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Industry Engagements</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Air Freight Summits, Expos & Conclaves
            </h1>
            <p className="text-base text-slate-300">
              AirRajasthan's upcoming trade conferences, logistics exhibitions, and bilateral cargo corridor summits.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-navy-950">Upcoming Conferences & Summits</h2>
            </div>

            {upcoming.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">No upcoming events scheduled at this moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcoming.map((ev) => (
                  <div
                    key={ev.id}
                    className="card-aviation overflow-hidden flex flex-col justify-between group"
                  >
                    {ev.imageUrl && (
                      <div className="relative w-full h-48 bg-navy-900 overflow-hidden">
                        <Image
                          src={ev.imageUrl}
                          alt={ev.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                            Upcoming
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-saffron-600 mb-2 font-mono">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateOnly(ev.eventDate)}</span>
                        </div>

                        <h3 className="text-lg font-bold text-navy-950 group-hover:text-saffron-600 transition-colors">
                          {ev.title}
                        </h3>

                        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                          {ev.summary}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{ev.location}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={`/events/${ev.slug}`}
                          className="text-xs font-bold text-navy-900 group-hover:text-saffron-600 inline-flex items-center gap-1"
                        >
                          <span>Full Agenda & Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/query"
                          className="text-xs font-semibold text-saffron-600 hover:underline"
                        >
                          Book Meeting &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Events */}
          {past.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-4 h-4 text-slate-400" />
                <h2 className="text-xl font-bold text-navy-950">Past Engagements & Proceedings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {past.map((ev) => (
                  <div key={ev.id} className="card-aviation p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span>{formatDateOnly(ev.eventDate)}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          Concluded
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-navy-950">{ev.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {ev.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href={`/events/${ev.slug}`}
                        className="text-xs font-bold text-navy-900 hover:text-saffron-600 inline-flex items-center gap-1"
                      >
                        <span>View Summary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
