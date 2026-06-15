"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  intro?: string;
  heroImage?: string | null;
  logoImage?: string | null;
}

export function HeroSection({
  title = "الموسم الأول — ١٣ ليلة معرفية",
  subtitle = "رحلة معرفية في الوعي الحسيني",
  intro,
  heroImage,
  logoImage,
}: HeroSectionProps) {

  // Parse intro text to split description from the bulleted items
  let mainIntro = "";
  let featureTitle = "";
  let features: string[] = [];

  if (intro) {
    const listIndicator = intro.includes("تضم هذه الصفحة:") 
      ? "تضم هذه الصفحة:" 
      : intro.includes("هذه الصفحة:") 
      ? "هذه الصفحة:" 
      : null;

    if (listIndicator) {
      const parts = intro.split(listIndicator);
      mainIntro = parts[0].trim();
      featureTitle = listIndicator;
      
      const listPart = parts[1] || "";
      features = listPart
        .split("•")
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } else if (intro.includes("•")) {
      const parts = intro.split("•");
      mainIntro = parts[0].trim();
      features = parts.slice(1).map(item => item.trim()).filter(item => item.length > 0);
    } else {
      mainIntro = intro;
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 md:py-24">
      {/* Background Image (Cinematic) with Slow Zoom */}
      {heroImage && (
        <div 
          className="absolute inset-0 bg-cover md:bg-contain bg-center bg-no-repeat scale-100 animate-slow-zoom" 
          style={{ backgroundImage: `url(${heroImage})` }} 
        />
      )}

      {/* Dark gradient background overlay & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-karbala-black/30 via-karbala-black/80 to-karbala-black z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(13,11,9,0.95)_100%)] z-[1]" />
      <div className="absolute inset-0 shadow-deep z-[1]" />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise-texture.png')] z-[2] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-base flex flex-col items-center w-full max-w-4xl mx-auto pt-16 md:pt-24">
        
        {/* Animated text group */}
        <>
          {/* Logo / Icon above the main headline */}
          {logoImage && (
            <div className="mb-6 opacity-0 animate-fade-up drop-shadow-[0_0_25px_rgba(212,185,138,0.25)]" style={{ animationDelay: "300ms" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoImage} alt="شعار وعي" className="h-20 md:h-24 mx-auto rounded-md shadow-lg" />
              </div>
            )}

            {/* Typography Title Layout - Clean & Creative */}
            <h1 className="font-scheherazade text-center flex flex-col items-center select-none drop-shadow-[0_0_35px_rgba(212,185,138,0.2)]">
              {/* وعي */}
              <span
                className="block opacity-0 animate-fade-up text-transparent bg-clip-text bg-gradient-to-b from-karbala-gold-light via-karbala-gold to-karbala-gold-dark font-bold leading-loose pt-3 pb-8 px-6"
                style={{ fontSize: "clamp(3.8rem, 10vw, 8.5rem)", animationDelay: "400ms" }}
              >
                وعي
              </span>

              {/* يمرّ من */}
              <span
                className="block opacity-0 animate-fade-up text-karbala-gold-light/85 font-medium leading-[1.3] my-1"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", animationDelay: "700ms" }}
              >
                يمرّ من
              </span>

              {/* كربلاء */}
              <span
                className="block italic opacity-0 animate-fade-up text-transparent bg-clip-text bg-gradient-to-b from-[#E74C3C] to-[#962D22] font-bold leading-loose pt-3 pb-8 px-6 drop-shadow-[0_2px_12px_rgba(150,45,34,0.4)]"
                style={{ fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)", animationDelay: "1000ms" }}
              >
                كربلاء
              </span>
            </h1>

            {/* Season Title - letter-spacing (tracking) removed for correct Arabic cursive rendering */}
            <p
              className="font-kufi text-body-md text-karbala-gold/80 mt-8 opacity-0 animate-fade-up"
              style={{ animationDelay: "1200ms" }}
            >
              {title}
            </p>

            {/* Season Subtitle */}
            <p
              className="font-kufi text-body-lg text-karbala-white mt-4 max-w-[720px] mx-auto opacity-0 animate-fade-up leading-relaxed"
              style={{ animationDelay: "1350ms" }}
            >
              {subtitle}
            </p>
            
            {/* Intro description */}
            {mainIntro && (
               <p className="font-kufi text-body-md text-karbala-secondary/90 mt-6 max-w-2xl mx-auto opacity-0 animate-fade-up leading-relaxed text-center"
               style={{ animationDelay: "1500ms" }}>
                 {mainIntro}
               </p>
            )}

            {/* Structured feature card list */}
            {features.length > 0 && (
              <div 
                className="mt-8 w-full max-w-2xl mx-auto opacity-0 animate-fade-up"
                style={{ animationDelay: "1600ms" }}
              >
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-karbala-gold/30 to-transparent mx-auto mb-6" />
                
                {featureTitle && (
                  <p className="font-kufi text-body-sm text-karbala-gold font-bold mb-4 text-center">
                    {featureTitle}
                  </p>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 bg-karbala-card/30 backdrop-blur-sm border border-gold-subtle hover:border-gold-medium px-4 py-3.5 rounded-lg transition-all duration-350 hover:translate-y-[-2px] group"
                    >
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-karbala-gold shadow-glow group-hover:scale-125 transition-transform duration-350" />
                      <span className="font-kufi text-body-sm text-karbala-secondary group-hover:text-karbala-white transition-colors duration-350 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 opacity-0 animate-fade-up" style={{ animationDelay: "1750ms" }}>
              <Button href="#nights" size="lg" variant="primary">
                تصفح الليالي
              </Button>
            </div>
          </>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-hint opacity-0 z-10"
        style={{ animationFillMode: "forwards", animationDelay: "2000ms" }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4B98A"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-60"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
