"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSectionAction, publishSectionAction } from "@/features/content/content-actions";
import { ContentStatus, Role } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Save, Globe, Eye, FileEdit } from "lucide-react";

interface SectionItem {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  content: string;
  metaJson: string | null;
  status: ContentStatus;
  updatedAt: Date;
}

interface ContentEditorClientProps {
  sections: SectionItem[];
  userRole: Role;
}

export function ContentEditorClient({ sections, userRole }: ContentEditorClientProps) {
  const router = useRouter();
  const isAdmin = userRole === Role.ADMIN;

  const [activeKey, setActiveKey] = useState<string>(sections[0]?.sectionKey || "");
  const [formData, setFormData] = useState<Record<string, { title: string; subtitle: string; content: string; metaJson: string }>>(
    () => {
      const initial: Record<string, any> = {};
      sections.forEach((s) => {
        initial[s.sectionKey] = {
          title: s.title,
          subtitle: s.subtitle || "",
          content: s.content,
          metaJson: s.metaJson || "",
        };
      });
      return initial;
    }
  );

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeSection = sections.find((s) => s.sectionKey === activeKey);
  const currentForm = formData[activeKey] || { title: "", subtitle: "", content: "", metaJson: "" };

  const handleFieldChange = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [field]: val,
      },
    }));
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setFeedback(null);
    const res = await saveSectionAction(activeKey, {
      title: currentForm.title,
      subtitle: currentForm.subtitle,
      content: currentForm.content,
      metaJson: currentForm.metaJson,
      status: ContentStatus.DRAFT,
    });
    setLoading(false);

    if (res.success) {
      setFeedback({ type: "success", text: `Draft saved for [${activeKey}]. Ready for administrator review.` });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save draft" });
    }
  };

  const handlePublish = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setFeedback(null);

    // Save active updates first then publish
    await saveSectionAction(activeKey, {
      title: currentForm.title,
      subtitle: currentForm.subtitle,
      content: currentForm.content,
      metaJson: currentForm.metaJson,
      status: ContentStatus.PUBLISHED,
    });

    const res = await publishSectionAction(activeKey);
    setLoading(false);

    if (res.success) {
      setFeedback({ type: "success", text: `Section [${activeKey}] successfully published to live website and cache cleared!` });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to publish section" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Role permission notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div>
          <span className="font-bold text-navy-950">Publishing Permissions: </span>
          {isAdmin
            ? "You are logged in as Administrator: You have full authority to save drafts and publish live content immediately."
            : "You are logged in as Team Member: You can edit content and save drafts. Only Administrators can publish live."}
        </div>
        <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-navy-950 text-white">
          {userRole}
        </span>
      </div>

      {/* Section Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {sections.map((s) => {
          const isSelected = s.sectionKey === activeKey;
          const isDraft = s.status === ContentStatus.DRAFT;

          return (
            <button
              key={s.sectionKey}
              onClick={() => setActiveKey(s.sectionKey)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-navy-950 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{s.sectionKey.replace("_", " ").toUpperCase()}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                  isDraft
                    ? "bg-amber-400 text-amber-950 font-bold"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {s.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Editor Form */}
      {activeSection && (
        <div className="card-aviation p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-navy-950">
                Editing Section: <span className="font-mono text-saffron-600">{activeKey}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Last modified: {formatDate(activeSection.updatedAt)} • Current State: {activeSection.status}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="btn-secondary text-xs font-semibold py-2 px-4 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="btn-primary text-xs font-bold uppercase tracking-wider py-2 px-4 flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publish to Live Site</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Main Title
              </label>
              <input
                type="text"
                value={currentForm.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Tagline
              </label>
              <input
                type="text"
                value={currentForm.subtitle}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Body Content (Markdown supported)
              </label>
              <textarea
                rows={6}
                value={currentForm.content}
                onChange={(e) => handleFieldChange("content", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Structured Metadata JSON (Labels, cards, benefits array)
              </label>
              <textarea
                rows={4}
                value={currentForm.metaJson}
                onChange={(e) => handleFieldChange("metaJson", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-saffron-300 focus:border-saffron-500 outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
