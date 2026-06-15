"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { type GalleryImage } from "./GallerySlider"; // Or define it locally and export

interface GalleryLightboxProps {
  images: GalleryImage[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  images,
  selectedIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        if (selectedIndex > 0) onNavigate(selectedIndex - 1); // RTL right is previous
      }
      if (e.key === "ArrowLeft") {
        if (selectedIndex < images.length - 1) onNavigate(selectedIndex + 1); // RTL left is next
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length, onClose, onNavigate]);

  if (selectedIndex === null) return null;

  const currentImage = images[selectedIndex];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-karbala-black/95 p-4 sm:p-6 md:p-12 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      dir="rtl"
    >
      {/* Top Bar for close button */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-[102] bg-gradient-to-b from-karbala-black/80 to-transparent pointer-events-none">
        <div className="flex-1" />
        <p className="font-scheherazade text-xl text-karbala-gold drop-shadow-md text-center flex-1 hidden sm:block pointer-events-auto">
          {currentImage.alt_text || `صورة ${selectedIndex + 1} من ${images.length}`}
        </p>
        <div className="flex-1 flex justify-end pointer-events-auto">
          <button 
            className="flex items-center gap-2 text-karbala-gold hover:text-karbala-black bg-karbala-card/80 hover:bg-karbala-gold border border-karbala-gold/40 rounded-full px-4 py-2 transition-all shadow-ambient hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="إغلاق"
          >
            <span className="font-kufi text-sm md:text-base hidden sm:inline-block">إغلاق</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Image Container - Centered and Size Limited */}
      <div 
        className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center group/lightbox cursor-zoom-out"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image 
            src={currentImage.image_url} 
            alt={currentImage.alt_text || "عرض الصورة مكبرة"} 
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 768px) 100vw, 80vw"
            priority
            quality={82}
          />
        </div>

        {/* Navigation Arrows - Placed tightly beside the image container */}
        {selectedIndex > 0 && (
          <button 
            className="absolute -right-2 sm:-right-8 top-1/2 -translate-y-1/2 z-[101] text-karbala-gold hover:text-karbala-black bg-karbala-black/80 hover:bg-karbala-gold border border-karbala-gold/30 rounded-full p-3 sm:p-4 transition-all hover:scale-110 shadow-ambient opacity-100 sm:opacity-0 sm:group-hover/lightbox:opacity-100 focus:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(selectedIndex - 1);
            }}
            aria-label="السابق"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {selectedIndex < images.length - 1 && (
          <button 
            className="absolute -left-2 sm:-left-8 top-1/2 -translate-y-1/2 z-[101] text-karbala-gold hover:text-karbala-black bg-karbala-black/80 hover:bg-karbala-gold border border-karbala-gold/30 rounded-full p-3 sm:p-4 transition-all hover:scale-110 shadow-ambient opacity-100 sm:opacity-0 sm:group-hover/lightbox:opacity-100 focus:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(selectedIndex + 1);
            }}
            aria-label="التالي"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Mobile Text (Visible only on small screens) */}
        <div className="absolute -bottom-12 left-0 right-0 text-center sm:hidden pb-4">
          <p className="font-scheherazade text-lg text-karbala-gold drop-shadow-md">
            {currentImage.alt_text || `صورة ${selectedIndex + 1} من ${images.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
