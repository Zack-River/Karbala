import React from "react";
import type { Majlis } from "@/types/database";

interface MajalisGridProps {
  majalis: Majlis[];
}

export function MajalisGrid({ majalis }: MajalisGridProps) {
  if (majalis.length === 0) {
    return (
      <p className="font-kufi text-karbala-secondary text-center">
        لا توجد مجالس متاحة حالياً.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl">
      {majalis.map((majlis) => (
        <article key={majlis.id} className="card-base p-6 md:p-8 flex flex-col h-full group">
          <div className="w-12 h-12 rounded-full border border-[rgba(212,185,138,0.3)] flex items-center justify-center text-karbala-gold mb-5 group-hover:shadow-glow transition-shadow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <h3 className="font-scheherazade text-xl text-karbala-gold-light mb-3">
            {majlis.name}
          </h3>

          {majlis.location_description && (
            <p className="font-kufi text-sm text-karbala-gold mb-2">
              الموقع: {majlis.location_description}
            </p>
          )}

          {majlis.address && (
            <p className="font-kufi text-sm text-karbala-secondary mb-6 flex-1 leading-relaxed">
              {majlis.address}
            </p>
          )}

          <a
            href={majlis.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-karbala-gold text-karbala-gold rounded-pill hover:bg-[rgba(212,185,138,0.1)] transition-colors font-kufi text-sm mt-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            عرض الموقع على الخريطة
          </a>
        </article>
      ))}
    </div>
  );
}
