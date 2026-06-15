import React from "react";

interface SectionDividerProps {
  title?: string;
  className?: string;
}

export function SectionDivider({ title, className = "" }: SectionDividerProps) {
  if (!title) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <div className="h-px flex-1 bg-[rgba(212,185,138,0.2)]" />
        <span className="mx-4 text-karbala-gold text-sm">◆</span>
        <div className="h-px flex-1 bg-[rgba(212,185,138,0.2)]" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 py-4 ${className}`}>
      <div className="h-px w-16 bg-[rgba(212,185,138,0.2)] sm:w-24 lg:w-32" />
      <span className="text-karbala-gold-dark text-sm">◆</span>
      <h2 className="font-scheherazade text-display-h2 text-karbala-gold text-center">
        {title}
      </h2>
      <span className="text-karbala-gold-dark text-sm">◆</span>
      <div className="h-px w-16 bg-[rgba(212,185,138,0.2)] sm:w-24 lg:w-32" />
    </div>
  );
}
