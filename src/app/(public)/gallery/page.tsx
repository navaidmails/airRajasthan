import { GalleryService } from "@/features/gallery/gallery-service";
import { GalleryClient } from "./GalleryClient";
import { Shield } from "lucide-react";

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await GalleryService.getPublishedGallery();

  const formattedItems = items.map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category,
    imageUrl: g.imageUrl,
    altText: g.altText,
    description: g.description,
  }));

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="badge-saffron">Visual Archive</div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Aviation, Airside & Operations Gallery
            </h1>
            <p className="text-base text-slate-300">
              Visual documentation of freighter configurations, airside apron transfers, cold-chain ULD equipment, and logistics facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>
              All photography represents industry reference visual assets and representative aircraft/ramp configurations.
            </span>
          </div>

          <GalleryClient initialItems={formattedItems} />
        </div>
      </section>
    </div>
  );
}
