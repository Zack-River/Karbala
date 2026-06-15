import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "crimson" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default:
      "border-[rgba(212,185,138,0.3)] text-karbala-gold bg-[rgba(212,185,138,0.08)]",
    gold: "border-karbala-gold text-karbala-gold bg-[rgba(212,185,138,0.12)]",
    crimson:
      "border-[rgba(139,30,30,0.5)] text-karbala-crimson bg-[rgba(139,30,30,0.1)]",
    muted:
      "border-[rgba(212,185,138,0.15)] text-karbala-gray bg-transparent",
  };

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        rounded-pill
        border
        font-kufi text-body-sm
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
