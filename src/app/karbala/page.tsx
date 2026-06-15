import React from "react";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { HeroSection } from "@/components/sections/HeroSection";
import { SheikhSection } from "@/components/sections/SheikhSection";
import { NightsCarousel } from "@/components/sections/NightsCarousel";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { renderCard } from "@/components/cards/ContentCards";
import {
  getNightsWithQuizzes,
  getFeaturedCards,
  getActiveSeason,
  getSheikhProfile,
} from "@/lib/queries";
import { createServerClient } from "@/lib/supabase/server";
import { GallerySlider, type GalleryImage } from "@/components/gallery/GallerySlider";

export const dynamic = "force-dynamic";

export default async function KarbalaPage() {
  const supabase = createServerClient();

  const [nightsWithQuizzes, featuredCards, season, sheikh, galleryRes] = await Promise.all([
    getNightsWithQuizzes(),
    getFeaturedCards(),
    getActiveSeason(),
    getSheikhProfile(),
    supabase.from("gallery_images").select("*").order("sort_order", { ascending: true }).limit(8),
  ]);

  const dbImages = galleryRes.data || [];
  const fallbackImages = [
    { id: "fb1", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/5.png"), alt_text: "مقتطفات بصرية 1", sort_order: 1 },
    { id: "fb2", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/6.png"), alt_text: "مقتطفات بصرية 2", sort_order: 2 },
    { id: "fb3", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/7.png"), alt_text: "مقتطفات بصرية 3", sort_order: 3 },
    { id: "fb4", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/8.png"), alt_text: "مقتطفات بصرية 4", sort_order: 4 },
    { id: "fb5", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/9.png"), alt_text: "مقتطفات بصرية 5", sort_order: 5 },
    { id: "fb6", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/10.png"), alt_text: "مقتطفات بصرية 6", sort_order: 6 },
    { id: "fb7", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/11.png"), alt_text: "مقتطفات بصرية 7", sort_order: 7 },
    { id: "fb8", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/12.png"), alt_text: "مقتطفات بصرية 8", sort_order: 8 },
  ];
  const galleryImages = dbImages.length > 0 ? dbImages : fallbackImages;

  const nightsForCarousel = nightsWithQuizzes.map((n) => ({
    id: n.id,
    number: n.number,
    title: n.title,
    slug: n.slug,
    isLocked: false,
    quiz: n.quiz,
  }));

  return (
    <div>
      <HeroSection
        heroImage={season?.hero_image || "/hero.png"}
        logoImage={season?.logo_image || "/icon.png"}
        title={season?.title || undefined}
        subtitle={season?.subtitle || undefined}
        intro={season?.intro || undefined}
      />

      {sheikh && <SheikhSection profile={sheikh} />}

      <section id="nights" className="section-spacing overflow-hidden">
        <div className="section-container">
          <SectionDivider title="ليالي الموسم" />
          <div className="mt-4xl relative">
            <NightsCarousel nights={nightsForCarousel} />
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[rgba(13,11,9,0.5)] border-y border-gold-subtle relative">
        <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-[0.03] pointer-events-none" />
        <div className="section-container relative z-10">
          <SectionDivider title="محتوى المنصة" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl mt-4xl">
            <FeatureCard
              title="محاضرات عميقة"
              description="طرح فكري وتأصيلي لقضايا عاشوراء"
              iconType="microphone"
            />
            <FeatureCard
              title="مواد مساندة"
              description="نصوص، وثائق، وكتب تدعم البحث"
              iconType="document"
            />
            <FeatureCard
              title="مكتبة مرئية"
              description="توثيق بصري وحلقات مسجلة"
              iconType="film"
            />
            <FeatureCard
              title="تأملات حية"
              description="أسئلة وخطوات عملية للتطبيق"
              iconType="bell"
            />
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="section-container">
          <SectionDivider title="مقتطفات" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl mt-4xl">
            {featuredCards.length > 0 ? (
              featuredCards.map((card) => (
                <div key={card.id}>{renderCard(card)}</div>
              ))
            ) : (
              <p className="text-karbala-secondary font-kufi col-span-full text-center">
                لا توجد بطاقات مميزة حالياً
              </p>
            )}
          </div>

          <div className="mt-4xl text-center">
            <a
              href="/karbala/cards"
              className="inline-flex items-center text-karbala-gold hover:text-karbala-gold-light transition-colors group"
            >
              <span className="font-kufi ml-2">تصفح جميع البطاقات</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-x-1 transition-transform"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-[rgba(13,11,9,0.5)] border-t border-gold-subtle relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-[0.03] pointer-events-none" />
        <div className="w-full relative z-10 pt-16 pb-8">
          <div className="section-container mb-12">
            <SectionDivider title="معرض الصور" />
            <p className="text-center font-kufi text-karbala-secondary mt-4">
              مقتطفات بصرية من مجالسنا
            </p>
          </div>
          
          <div className="w-full max-w-[90rem] mx-auto my-8 relative px-4 sm:px-8">
            {galleryImages.length > 0 ? (
              <GallerySlider images={galleryImages as GalleryImage[]} />
            ) : (
              <p className="text-karbala-secondary font-kufi text-center py-12">
                سيتم إضافة الصور قريباً
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/karbala/gallery"
              className="inline-flex items-center text-karbala-gold hover:text-karbala-gold-light transition-colors group"
            >
              <span className="font-kufi ml-2">تصفح المعرض كاملاً</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-x-1 transition-transform"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
