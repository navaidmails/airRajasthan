"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox, LightboxImage } from "@/components/ui/Lightbox";
import { Layers, ZoomIn } from "lucide-react";

interface GalleryClientProps {
  initialItems: LightboxImage[];
}

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ["ALL", "AIRCRAFT", "OPERATIONS", "WAREHOUSE", "COLD_CHAIN", "CHARTER"];

  const filteredItems =
    selectedCategory === "ALL"
      ? initialItems
      : initialItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-bold uppercase text-slate-500 mr-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-navy-950 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Grid of Image Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No gallery media found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="card-aviation overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative w-full h-60 bg-navy-900 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="p-2.5 rounded-full bg-white/90 text-navy-950 shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950/80 backdrop-blur text-saffron-400 uppercase tracking-wider">
                    {item.category.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="text-sm font-bold text-navy-950 group-hover:text-saffron-600 transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accessible Lightbox Modal */}
      <Lightbox
        images={filteredItems}
        currentIndex={activeLightboxIndex}
        onClose={() => setActiveLightboxIndex(null)}
        onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
      />
    </div>
  );
}
