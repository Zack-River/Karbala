import React from "react";
import type { SheikhProfile } from "@/types/database";

interface SheikhSectionProps {
  profile: SheikhProfile;
}

export function SheikhSection({ profile }: SheikhSectionProps) {
  return (
    <section id="sheikh" className="section-spacing relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(212,185,138,0.03)] to-transparent pointer-events-none" />
      <div className="section-container relative z-10">
        <div className="card-base max-w-4xl mx-auto p-6 md:p-10 lg:p-12 border-gold-medium overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-[rgba(212,185,138,0.3)] opacity-60" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-[rgba(212,185,138,0.3)] opacity-60" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {profile.image && (
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-full border border-[rgba(212,185,138,0.25)] animate-pulse opacity-50" />
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-karbala-gold shadow-glow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="text-center md:text-right flex-1">
              <h2 className="font-scheherazade text-display-h2 text-karbala-gold mb-4 leading-tight">
                {profile.name}
              </h2>
              <div className="w-16 h-[2px] bg-gradient-to-l from-karbala-gold to-transparent mx-auto md:mx-0 md:mr-0 mb-4" />
              <p className="font-kufi text-body-md text-karbala-secondary leading-relaxed max-w-md mx-auto md:mx-0">
                يقدّم محاضرات الموسم المعرفي في الوعي الحسيني
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
