"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { GalleryLightbox } from "./GalleryLightbox";

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

interface GallerySliderProps {
  images: GalleryImage[];
}

export function GallerySlider({ images }: GallerySliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setDragMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragMoved(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Keep dragMoved true for a tiny bit so onClick can check it
    setTimeout(() => setDragMoved(false), 50);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    setDragMoved(true);
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Lightbox State
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    const isRtl = window.getComputedStyle(scrollContainerRef.current).direction === "rtl";
    
    if (isRtl) {
       setCanScrollRight(scrollLeft < 0);
       setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 2);
    } else {
       setCanScrollLeft(scrollLeft > 0);
       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, images]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const isRtl = window.getComputedStyle(scrollContainerRef.current).direction === "rtl";
    const scrollAmount = 300; 
    
    let delta = 0;
    if (isRtl) {
       delta = direction === "right" ? scrollAmount : -scrollAmount;
    } else {
       delta = direction === "right" ? scrollAmount : -scrollAmount;
    }

    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedImageIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        // RTL logic: ArrowRight goes to PREVIOUS image
        setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowLeft") {
        // RTL logic: ArrowLeft goes to NEXT image
        setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="relative group w-full" dir="rtl">
        
        {/* Arrows */}
        {canScrollRight && (
          <button 
            onClick={() => scroll("right")}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-20 w-12 h-12 rounded-full border border-karbala-gold bg-karbala-black/60 backdrop-blur-md items-center justify-center text-karbala-gold shadow-ambient hover:bg-karbala-black hover:scale-110 transition-all"
            aria-label="السابق"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M9 18l6-6-6-6" />
             </svg>
          </button>
        )}

        {canScrollLeft && (
          <button 
            onClick={() => scroll("left")}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-20 w-12 h-12 rounded-full border border-karbala-gold bg-karbala-black/60 backdrop-blur-md items-center justify-center text-karbala-gold shadow-ambient hover:bg-karbala-black hover:scale-110 transition-all"
            aria-label="التالي"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 18l-6-6 6-6" />
             </svg>
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-4 px-4 md:px-12 snap-x snap-mandatory hide-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="snap-start shrink-0 relative p-2 bg-[rgba(20,18,16,0.6)] backdrop-blur-sm rounded-2xl border border-karbala-gold/10 hover:border-karbala-gold/40 shadow-ambient transition-colors duration-500 group/card cursor-pointer w-[280px] h-[360px] md:w-[320px] md:h-[420px]"
              onClick={() => {
                if (!dragMoved) {
                  setSelectedImageIndex(index);
                }
              }}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image 
                  src={image.image_url} 
                  alt={image.alt_text || "معرض الصور"} 
                  fill
                  className="object-cover group-hover/card:scale-110 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 768px) 280px, 320px"
                  priority={index < 3}
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
          {/* Spacer */}
          <div className="shrink-0 w-4 md:w-8" aria-hidden="true" />
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <GalleryLightbox 
        images={images}
        selectedIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        onNavigate={(index) => setSelectedImageIndex(index)}
      />
    </>
  );
}
