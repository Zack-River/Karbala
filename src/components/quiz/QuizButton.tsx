"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getQuizStatus } from "@/lib/quiz";

interface QuizButtonProps {
  nightSlug: string;
  opensAt: string | null;
  closesAt: string | null;
  compact?: boolean;
}

export function QuizButton({ nightSlug, opensAt, closesAt, compact = false }: QuizButtonProps) {
  const [status, setStatus] = useState(() => getQuizStatus({ opens_at: opensAt, closes_at: closesAt }));

  useEffect(() => {
    // Only poll when status is 'upcoming' — once it transitions, it's final
    if (status === 'upcoming') {
      const interval = setInterval(() => {
        const newStatus = getQuizStatus({ opens_at: opensAt, closes_at: closesAt });
        setStatus(newStatus);
        if (newStatus !== 'upcoming') clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [opensAt, closesAt, status]);

  const isOpen = status === 'open';
  const isClosed = status === 'closed';

  const label = isClosed ? "مغلق" : isOpen ? "اختبر معلوماتك" : "قريباً";

  if (compact) {
    if (isClosed || !isOpen) {
      return (
        <div className="inline-flex items-center justify-center px-3 py-1 border border-karbala-gray/30 text-karbala-gray text-[0.75rem] font-kufi rounded-pill bg-transparent cursor-not-allowed">
          {label}
        </div>
      );
    }
    return (
      <Link
        href={`/karbala/night/${nightSlug}/quiz`}
        className="inline-flex items-center justify-center px-3 py-1 border border-karbala-gold/60 text-karbala-gold text-[0.75rem] font-kufi rounded-pill hover:bg-[rgba(212,185,138,0.1)] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </Link>
    );
  }

  if (isClosed || !isOpen) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-3 border border-karbala-gray text-karbala-gray rounded-pill bg-transparent font-kufi cursor-not-allowed opacity-70">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {label}
      </div>
    );
  }

  return (
    <Link
      href={`/karbala/night/${nightSlug}/quiz`}
      className="inline-flex items-center gap-2 px-6 py-3 border border-karbala-gold text-karbala-gold rounded-pill hover:bg-[rgba(212,185,138,0.1)] transition-colors font-kufi"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
      {label}
    </Link>
  );
}
