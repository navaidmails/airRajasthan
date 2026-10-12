"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGalleryAction, publishGalleryAction } from "@/features/content/content-actions";
import { ContentStatus, Role } from "@prisma/client";
import { Image as ImageIcon, Save, Globe, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  altText: string;
  description: string | null;
  status: ContentStatus;
  order: number;
}

interface GalleryEditorClientProps {
  items: GalleryItemData[];
  userRole: Role;
}

export function GalleryEditorClient({ items, userRole }: GalleryEditorClientProps) {
  const router = useRouter();
  const isAdmin = userRole === Role.ADMIN;

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "AIRCRAFT",
    imageUrl: "",
    thumbnailUrl: "",
    altText: "",
    description: "",
    order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSelectItem = (item: GalleryItemData) => {
    setIsCreatingNew(false);
    setSelectedId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      altText: item.altText,
      description: item.description || "",
      order: item.order,
    });
  };

  const handleAddNew = () => {
    setIsCreatingNew(true);
    setSelectedId(null);
    setFormData({
      title: "New Operations Asset",
      category: "OPERATIONS",
      imageUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=400&q=80",
      altText: "Air cargo operations asset",
      description: "Asset caption description...",
      order: items.length + 1,
    });
  };

  const handleSave = async (status: ContentStatus) => {
    setLoading(true);
    setFeedback(null);

    const res = await saveGalleryAction({
      id: isCreatingNew ? undefined : selectedId || undefined,
      title: formData.title,
      category: formData.category,
      imageUrl: formData.imageUrl,
      thumbnailUrl: formData.thumbnailUrl || formData.imageUrl,
      altText: formData.altText,
      description: formData.description,
      order: formData.order,
      status,
    });

    setLoading(false);

    if (res.success) {
      setFeedback({
        type: "success",
        text: `Gallery item saved as ${status}. ${status === ContentStatus.PUBLISHED ? "Live gallery updated." : ""}`,
      });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save item" });
    }
  };

  const currentItem = items.find((i) => i.id === selectedId);

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

      {/* Persistent Storage Architecture Notice */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
        <p className="font-bold">Media Metadata Architecture Point:</p>
        <p>
          Media records and metadata are stored persistently in MySQL. Direct file uploads bypass server disk and will connect to private AWS S3 / Cloudflare R2 bucket in production to maintain stateless container deployments on Hostinger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Gallery thumbnails list */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              Media Archive
            </h3>
            <button
              onClick={handleAddNew}
              className="btn-navy text-xs py-1.5 px-3 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Media</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-saffron-500 border-transparent bg-slate-100"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-slate-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.altText}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-black/70 text-white">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-navy-950 truncate mt-1.5">{item.title}</p>
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
                  {isCreatingNew ? "Add New Media Asset" : `Editing: ${formData.title}`}
                </h3>
                {currentItem && (
                  <p className="text-xs text-slate-500">
                    Category: {currentItem.category} • Status: {currentItem.status}
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
                  <label className="block font-semibold text-slate-700 mb-1">Asset Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none bg-white"
                  >
                    <option value="AIRCRAFT">AIRCRAFT</option>
                    <option value="OPERATIONS">OPERATIONS</option>
                    <option value="WAREHOUSE">WAREHOUSE</option>
                    <option value="COLD_CHAIN">COLD_CHAIN</option>
                    <option value="CHARTER">CHARTER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full-Resolution Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accessibility Alt Text</label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="Describe image content for screen readers..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Operational Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 outline-none"
                />
              </div>

              {formData.imageUrl && (
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 mb-2">Live Preview:</label>
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={formData.imageUrl}
                      alt={formData.altText || "Preview"}
                      fill
                      sizes="600px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
