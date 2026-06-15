"use client";

import React, { useState } from "react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }

    // Fallback to copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-pill font-kufi text-sm transition-all duration-300
        ${copied 
          ? "bg-[rgba(212,185,138,0.2)] border-karbala-gold text-karbala-gold" 
          : "border-[rgba(212,185,138,0.3)] text-karbala-secondary hover:text-karbala-gold hover:border-[rgba(212,185,138,0.6)]"
        } border
      `}
    >
      {copied ? (
        <>
          <span>تم النسخ ✓</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
             <polyline points="16 6 12 2 8 6" />
             <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          مشاركة
        </>
      )}
    </button>
  );
}
