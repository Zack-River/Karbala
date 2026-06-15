import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  iconType: "microphone" | "document" | "film" | "bell";
}

export function FeatureCard({ title, description, iconType }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center group cursor-default">
      {/* Icon Container with Gold Glow on Hover */}
      <div className="w-16 h-16 mb-4 flex items-center justify-center text-karbala-gold transition-all duration-350 ease-premium group-hover:drop-shadow-[0_0_8px_rgba(212,185,138,0.5)] group-hover:-translate-y-1">
        <IconSvg type={iconType} />
      </div>

      <h3 className="font-scheherazade text-[1.25rem] text-karbala-gold-light mb-2 transition-colors group-hover:text-karbala-gold">
        {title}
      </h3>
      
      <p className="font-kufi text-[0.875rem] text-karbala-gray max-w-[200px] leading-[1.6]">
        {description}
      </p>
    </div>
  );
}

// Simple SVG wrapper for custom icons
function IconSvg({ type }: { type: FeatureCardProps["iconType"] }) {
  switch (type) {
    case "microphone":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
           <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
           <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
           <line x1="12" y1="19" x2="12" y2="22" />
           <line x1="8" y1="22" x2="16" y2="22" />
        </svg>
      );
    case "document":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
           <polyline points="14 2 14 8 20 8" />
           <line x1="16" y1="13" x2="8" y2="13" />
           <line x1="16" y1="17" x2="8" y2="17" />
           <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "film":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
           <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
           <line x1="7" y1="2" x2="7" y2="22" />
           <line x1="17" y1="2" x2="17" y2="22" />
           <line x1="2" y1="12" x2="22" y2="12" />
           <line x1="2" y1="7" x2="7" y2="7" />
           <line x1="2" y1="17" x2="7" y2="17" />
           <line x1="17" y1="17" x2="22" y2="17" />
           <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      );
    case "bell":
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
           <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
           <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
  }
}
