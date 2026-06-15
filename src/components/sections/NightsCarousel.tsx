"use client";

import React, { useRef, useState, useEffect } from "react";
import { NightCard } from "@/components/cards/NightCard";
import type { Night } from "@/types/database";

interface NightsCarouselProps {
  nights: (Pick<Night, "id" | "number" | "title" | "slug"> & {
    isLocked?: boolean;
    quiz?: { id: string; is_enabled: boolean; opens_at: string | null; closes_at: string | null } | null;
  })[];
}

export function NightsCarousel({ nights }: NightsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // In RTL, scrollLeft is usually negative or goes from 0 to negative.
    // However, browser implementations vary. We'll check based on standard RTL scroll behavior.
    const isRtl = window.getComputedStyle(scrollContainerRef.current).direction === "rtl";
    
    if (isRtl) {
       // In modern browsers, RTL scrollLeft is negative. 0 is the start (right).
       // Min scrollLeft is -(scrollWidth - clientWidth)
       setCanScrollRight(scrollLeft < 0);
       setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 2); // -2 for rounding errors
    } else {
       setCanScrollLeft(scrollLeft > 0);
       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [nights]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const isRtl = window.getComputedStyle(scrollContainerRef.current).direction === "rtl";
    
    const scrollAmount = 300; // rough width of card + gap
    
    // Determine actual scroll delta based on direction and RTL
    let delta = 0;
    if (isRtl) {
       delta = direction === "right" ? scrollAmount : -scrollAmount;
    } else {
       delta = direction === "right" ? scrollAmount : -scrollAmount;
    }

    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative group">
      
      {/* Arrows (Desktop/Tablet) */}
      {canScrollRight && (
        <button 
          onClick={() => scroll("right")}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-5 z-20 w-10 h-10 rounded-full border border-karbala-gold bg-karbala-card items-center justify-center text-karbala-gold shadow-ambient hover:bg-karbala-card-hover hover:-translate-y-[calc(50%+2px)] transition-all"
          aria-label="السابق"
        >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M9 18l6-6-6-6" />
           </svg>
        </button>
      )}

      {canScrollLeft && (
        <button 
          onClick={() => scroll("left")}
          className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-5 z-20 w-10 h-10 rounded-full border border-karbala-gold bg-karbala-card items-center justify-center text-karbala-gold shadow-ambient hover:bg-karbala-card-hover hover:-translate-y-[calc(50%+2px)] transition-all"
          aria-label="التالي"
        >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M15 18l-6-6 6-6" />
           </svg>
        </button>
      )}

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-xl overflow-x-auto pb-8 pt-4 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {nights.map((night, index) => (
          <div key={night.id} className="snap-start shrink-0 first:ms-0 md:first:ms-4">
             {/* Make the first night "featured" for demo purposes, or based on logic later */}
            <NightCard night={night} isFeatured={index === 0} />
          </div>
        ))}
        {/* Spacer for the end to allow full scroll peek */}
        <div className="shrink-0 w-4 md:w-8" aria-hidden="true" />
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
