"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveServiceAction, publishServiceAction } from "@/features/content/content-actions";
import { ContentStatus, Role } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Plane, Save, Globe, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

interface ServiceItemData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  featuresJson: string;
  icon: string;
  imageUrl: string | null;
  status: ContentStatus;
  order: number;
  updatedAt: Date;
}

interface ServicesEditorClientProps {
  services: ServiceItemData[];
  userRole: Role;
}

export function ServicesEditorClient({ services, userRole }: ServicesEditorClientProps) {
  const router = useRouter();
  const isAdmin = userRole === Role.ADMIN;

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(services[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    featuresText: "",
    icon: "Plane",
    imageUrl: "",
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSelectService = (svc: ServiceItemData) => {
    setIsCreatingNew(false);
    setSelectedServiceId(svc.id);
    let featuresList: string[] = [];
    try {
      featuresList = JSON.parse(svc.featuresJson);
    } catch {}

    setFormData({
      slug: svc.slug,
      title: svc.title,
      shortDescription: svc.shortDescription,
      fullDescription: svc.fullDescription,
      featuresText: featuresList.join("\n"),
      icon: svc.icon,
      imageUrl: svc.imageUrl || "",
      order: svc.order,
    });
  };

  const handleAddNew = () => {
    setIsCreatingNew(true);
    setSelectedServiceId(null);
    setFormData({
      slug: "new-cargo-service",
      title: "New Cargo Service",
      shortDescription: "Short summary of offering...",
      fullDescription: "Detailed cargo specifications...",
      featuresText: "Key capability 1\nKey capability 2",
      icon: "Plane",
      imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
      order: services.length + 1,
    });
  };

  const handleSave = async (status: ContentStatus) => {
    setLoading(true);
    setFeedback(null);

    const features = formData.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await saveServiceAction({
      id: isCreatingNew ? undefined : selectedServiceId || undefined,
      slug: formData.slug,
      title: formData.title,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      features,
      icon: formData.icon,
      imageUrl: formData.imageUrl,
      order: formData.order,
      status,
    });

    setLoading(false);

    if (res.success) {
      setFeedback({
        type: "success",
        text: `Service saved as ${status}. ${status === ContentStatus.PUBLISHED ? "Live site updated." : ""}`,
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save service" });
    }
  };

  const currentService = services.find((s) => s.id === selectedServiceId);

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
        {/* Left Column: Services list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Catalog Offerings
            </h3>
            <button
              onClick={handleAddNew}
              className="btn-navy text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="space-y-2">
            {services.map((svc) => {
              const isSelected = svc.id === selectedServiceId;
              return (
                <div
                  key={svc.id}
                  onClick={() => handleSelectService(svc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-navy-950 text-white border-navy-950 shadow-sm"
                      : "bg-white text-slate-800 hover:bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold truncate">{svc.title}</h4>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                        svc.status === ContentStatus.PUBLISHED
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {svc.status}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1 truncate ${
                      isSelected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    Slug: {svc.slug}
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
                  {isCreatingNew ? "Create New Cargo Offering" : `Editing: ${formData.title}`}
                </h3>
                {currentService && (
                  <p className="text-xs text-slate-500">
                    Status: {currentService.status} • Last updated: {formatDate(currentService.updatedAt)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Service Title</label>
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Summary (Cards)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Description & Specifications
                </label>
                <textarea
                  rows={5}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Operational Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Representative Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
