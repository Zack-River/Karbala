import React from "react";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { MajalisGrid } from "@/components/sections/MajalisGrid";
import { getEnabledMajalis } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المجالس | وعيٌ يمرّ من كربلاء",
  description: "مجالس عزاء وعي حسيني — مواقع وأماكن المجالس",
};

export const dynamic = "force-dynamic";

export default async function MajalisPage() {
  const majalis = await getEnabledMajalis();

  return (
    <div className="pb-8xl">
      <section className="section-container pt-32 pb-4 border-b border-[rgba(212,185,138,0.12)]">
        <nav className="flex items-center gap-2 font-kufi text-body-sm text-karbala-secondary mb-6">
          <a href="/karbala" className="hover:text-karbala-gold transition-colors">
            الرئيسية
          </a>
          <span className="text-karbala-gray">/</span>
          <span className="text-karbala-gold">المجالس</span>
        </nav>
        <h1 className="font-scheherazade text-display-h1 text-karbala-gold text-center">
          المجالس
        </h1>
        <p className="font-kufi text-body-lg text-karbala-gold-light text-center mt-4 max-w-prose mx-auto">
          أماكن المجالس ومواقعها على الخريطة
        </p>
      </section>

      <section className="section-container section-spacing">
        <SectionDivider title="قائمة المجالس" />
        <div className="mt-4xl">
          <MajalisGrid majalis={majalis} />
        </div>
      </section>
    </div>
  );
}
