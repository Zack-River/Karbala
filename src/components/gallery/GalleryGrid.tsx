"use client";

import React, { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { GalleryLightbox } from "./GalleryLightbox";
import { type GalleryImage } from "./GallerySlider";
import { Button } from "@/components/ui/Button";

interface GalleryGridProps {
  initialImages: GalleryImage[];
  totalCount: number;
}

export function GalleryGrid({ initialImages, totalCount }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialImages.length < totalCount);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const from = images.length;
    const to = from + 11; // Fetch next 12 images (inclusive)

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setImages((prev) => [...prev, ...data]);
      if (images.length + data.length >= totalCount) {
        setHasMore(false);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className="relative p-2 bg-[rgba(20,18,16,0.6)] backdrop-blur-sm rounded-2xl border border-karbala-gold/10 hover:border-karbala-gold/40 shadow-ambient transition-colors duration-500 group/card cursor-pointer w-full aspect-[3/4]"
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image 
                src={image.image_url} 
                alt={image.alt_text || "معرض الصور"} 
                fill
                className="object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out"
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(50vw - 3rem), (max-width: 1280px) calc(33vw - 3rem), 320px"
                priority={index < 4}
                quality={72}
              />
              
              {/* Gold Filter Layer (Inactive state) */}
              <div className="absolute inset-0 bg-karbala-gold/20 mix-blend-color group-hover/card:opacity-0 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[#3a2c14]/30 mix-blend-multiply group-hover/card:opacity-0 transition-opacity duration-700" />
              
              {/* Gradient Overlay for Text & Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity duration-500" />
              
              {/* Hover Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col justify-end items-center">
                <p className="font-scheherazade text-2xl text-karbala-gold text-center mb-3 drop-shadow-md">
                  {image.alt_text || "معرض الصور"}
                </p>
                <div className="w-12 h-[2px] bg-karbala-gold/60 rounded-full" />
              </div>

              {/* Center Expand Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover/card:opacity-100 text-karbala-black bg-karbala-gold/90 p-3 rounded-full transition-all duration-500 backdrop-blur-md transform scale-50 group-hover/card:scale-100 -translate-y-4 group-hover/card:-translate-y-8 shadow-glow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <Button 
            onClick={loadMore}
            disabled={isLoading}
            className="bg-transparent border border-karbala-gold text-karbala-gold hover:bg-karbala-gold hover:text-karbala-black rounded-full px-8 py-3 transition-colors duration-300 min-w-[200px]"
          >
            {isLoading ? "جاري التحميل..." : "عرض المزيد"}
          </Button>
        </div>
      )}

      <GalleryLightbox 
        images={images}
        selectedIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        onNavigate={(index) => setSelectedImageIndex(index)}
      />
    </div>
  );
}
