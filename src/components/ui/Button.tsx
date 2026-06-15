import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cta" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-kufi rounded-pill
    transition-premium cursor-pointer
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-karbala-gold
  `;

  const variants = {
    primary: `
      border border-[rgba(212,185,138,0.6)]
      bg-[rgba(212,185,138,0.08)]
      text-karbala-gold
      backdrop-blur-sm
      hover:bg-[rgba(212,185,138,0.18)]
      hover:border-[rgba(212,185,138,0.9)]
      hover:shadow-glow
      hover:-translate-y-0.5
    `,
    cta: `
      border border-[rgba(139,30,30,0.5)]
      bg-[rgba(139,30,30,0.2)]
      text-karbala-gold
      hover:bg-[rgba(139,30,30,0.4)]
      hover:border-karbala-crimson
      hover:shadow-glow
    `,
    ghost: `
      border border-transparent
      bg-transparent
      text-karbala-secondary
      hover:text-karbala-gold
      hover:border-[rgba(212,185,138,0.25)]
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-body-sm",
    md: "px-8 py-3 text-body-md",
    lg: "px-10 py-4 text-body-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
