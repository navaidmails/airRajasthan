"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveEventAction, publishEventAction } from "@/features/content/content-actions";
import { ContentStatus, Role } from "@prisma/client";
import { formatDateOnly } from "@/lib/utils";
import { Calendar, Save, Globe, Plus, MapPin } from "lucide-react";

interface EventItemData {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  location: string;
  eventDate: Date;
  isPast: boolean;
  imageUrl: string | null;
  status: ContentStatus;
}

interface EventsEditorClientProps {
  events: EventItemData[];
  userRole: Role;
}

export function EventsEditorClient({ events, userRole }: EventsEditorClientProps) {
  const router = useRouter();
  const isAdmin = userRole === Role.ADMIN;

  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    summary: "",
    content: "",
    location: "",
    eventDate: new Date().toISOString().slice(0, 10),
    isPast: false,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSelectEvent = (ev: EventItemData) => {
    setIsCreatingNew(false);
    setSelectedEventId(ev.id);
    setFormData({
      slug: ev.slug,
      title: ev.title,
      summary: ev.summary,
      content: ev.content,
      location: ev.location,
      eventDate: new Date(ev.eventDate).toISOString().slice(0, 10),
      isPast: ev.isPast,
      imageUrl: ev.imageUrl || "",
    });
  };

  const handleAddNew = () => {
    setIsCreatingNew(true);
    setSelectedEventId(null);
    setFormData({
      slug: "new-cargo-summit-2026",
      title: "New Cargo Summit 2026",
      summary: "Executive summary of the event...",
      content: "Complete schedule and agenda topics...",
      location: "Jaipur International Airport Convention Hall",
      eventDate: "2026-11-20",
      isPast: false,
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    });
  };

  const handleSave = async (status: ContentStatus) => {
    setLoading(true);
    setFeedback(null);

    const res = await saveEventAction({
      id: isCreatingNew ? undefined : selectedEventId || undefined,
      slug: formData.slug,
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      location: formData.location,
      eventDate: formData.eventDate,
      isPast: formData.isPast,
      imageUrl: formData.imageUrl,
      status,
    });

    setLoading(false);

    if (res.success) {
      setFeedback({
        type: "success",
        text: `Event saved as ${status}. ${status === ContentStatus.PUBLISHED ? "Live events updated." : ""}`,
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save event" });
    }
  };

  const currentEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Events List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Conferences & Summits
            </h3>
            <button
              onClick={handleAddNew}
              className="btn-navy text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-2">
            {events.map((ev) => {
              const isSelected = ev.id === selectedEventId;
              return (
                <div
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-navy-950 text-white border-navy-950 shadow-sm"
                      : "bg-white text-slate-800 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold truncate">{ev.title}</h4>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        ev.status === ContentStatus.PUBLISHED
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 truncate ${
                      isSelected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {formatDateOnly(ev.eventDate)} • {ev.location}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-8">
          <div className="card-aviation p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {isCreatingNew ? "Create New Event" : `Editing: ${formData.title}`}
                </h3>
                {currentEvent && (
                  <p className="text-xs text-slate-500">
                    Status: {currentEvent.status} • Scheduled: {formatDateOnly(currentEvent.eventDate)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(ContentStatus.DRAFT)}
                  disabled={loading}
                  className="btn-secondary text-xs font-semibold py-2 px-3 flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleSave(ContentStatus.PUBLISHED)}
                    disabled={loading}
                    className="btn-primary text-xs font-bold uppercase tracking-wider py-2 px-3.5 flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publish Live</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Venue / Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPast"
                    checked={formData.isPast}
                    onChange={(e) => setFormData({ ...formData, isPast: e.target.checked })}
                    className="w-4 h-4 rounded text-navy-900 focus:ring-saffron-400"
                  />
                  <label htmlFor="isPast" className="font-semibold text-slate-700">
                    Mark as Concluded / Past Event
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary (Cards)</label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Symposium Agenda & Content
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Banner Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
