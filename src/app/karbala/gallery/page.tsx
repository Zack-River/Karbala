import React from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { type GalleryImage } from "@/components/gallery/GallerySlider";
import { createServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "معرض الصور | وعيٌ يمرّ من كربلاء",
  description: "المعرض الفوتوغرافي الشامل لمجالس وعي يمر من كربلاء",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = createServerClient();

  // Fetch count and first 12 images
  const { data: images, count } = await supabase
    .from("gallery_images")
    .select("*", { count: 'exact' })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(12);

  const fallbackImages = [
    { id: "fb1", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/5.png"), alt_text: "مقتطفات بصرية 1", sort_order: 1 },
    { id: "fb2", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/6.png"), alt_text: "مقتطفات بصرية 2", sort_order: 2 },
    { id: "fb3", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/7.png"), alt_text: "مقتطفات بصرية 3", sort_order: 3 },
    { id: "fb4", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/8.png"), alt_text: "مقتطفات بصرية 4", sort_order: 4 },
    { id: "fb5", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/9.png"), alt_text: "مقتطفات بصرية 5", sort_order: 5 },
    { id: "fb6", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/10.png"), alt_text: "مقتطفات بصرية 6", sort_order: 6 },
    { id: "fb7", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/11.png"), alt_text: "مقتطفات بصرية 7", sort_order: 7 },
    { id: "fb8", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/12.png"), alt_text: "مقتطفات بصرية 8", sort_order: 8 },
    { id: "fb9", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/13.png"), alt_text: "مقتطفات بصرية 9", sort_order: 9 },
    { id: "fb10", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/14.png"), alt_text: "مقتطفات بصرية 10", sort_order: 10 },
    { id: "fb11", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/15.png"), alt_text: "مقتطفات بصرية 11", sort_order: 11 },
    { id: "fb12", image_url: encodeURI("/Last section/وعي-يمر-من-كربلا/16.png"), alt_text: "مقتطفات بصرية 12", sort_order: 12 },
  ];

  const dbImages = images || [];
  const displayImages = dbImages.length > 0 ? dbImages : fallbackImages;
  const totalCount = count !== null && count > 0 ? count : fallbackImages.length;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-karbala-black relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-karbala-gold/5 to-transparent pointer-events-none" />

      <div className="section-container relative z-10 text-center mb-16">
        <h1 className="font-scheherazade text-display-h1 text-karbala-gold mb-6 drop-shadow-md">
          المعرض الفوتوغرافي
        </h1>
        <p className="font-kufi text-xl md:text-2xl text-karbala-secondary max-w-2xl mx-auto leading-relaxed">
          توثيق بصري للحظات الروحانية ومقتطفات من مجالس &quot;وعي يمر من كربلاء&quot;
        </p>
        <div className="w-24 h-[2px] bg-karbala-gold/40 mx-auto mt-8 rounded-full" />
      </div>

      <div className="w-full max-w-[90rem] mx-auto relative px-4 sm:px-8 z-10">
        <GalleryGrid 
          initialImages={displayImages as GalleryImage[]} 
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
