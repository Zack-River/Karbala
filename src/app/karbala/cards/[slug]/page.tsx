import React from "react";
import { getCardBySlug, getAllCardSlugs } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import { renderCard } from "@/components/cards/ContentCards";
import { ShareButton } from "@/components/ui/ShareButton";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllCardSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const card = await getCardBySlug(params.slug);
  if (!card) return { title: "البطاقة غير موجودة" };

  return {
    title: `${card.title} | وعيٌ يمرّ من كربلاء`,
    description: card.seo_description || card.content?.substring(0, 160) || "",
    openGraph: {
      title: card.seo_title || card.title,
      description: card.seo_description || card.content?.substring(0, 160) || "",
      images: card.image ? [{ url: card.image }] : [],
    },
  };
}

export default async function CardDetailPage({ params }: { params: { slug: string } }) {
  const card = await getCardBySlug(params.slug);
  if (!card) notFound();

  return (
    <div className="pb-8xl min-h-screen">
      <div className="section-container pt-32 pb-4 flex items-center justify-between border-b border-[rgba(212,185,138,0.12)]">
        <nav className="flex items-center gap-2 font-kufi text-body-sm text-karbala-secondary">
          <Link href="/karbala" className="hover:text-karbala-gold transition-colors">
            الرئيسية
          </Link>
          <span className="text-karbala-gray">/</span>
          <Link href="/karbala/cards" className="hover:text-karbala-gold transition-colors">
            البطاقات
          </Link>
          <span className="text-karbala-gray">/</span>
          <span className="text-karbala-gold">{card.title}</span>
        </nav>
      </div>

      <div className="section-container mt-4xl flex flex-col items-center">
        <div className="w-full max-w-[500px]">{renderCard(card)}</div>

        <div className="mt-2xl flex flex-wrap gap-4 justify-center">
          <ShareButton title={card.title} />

          {card.downloadable && card.image && (
            <a
              href={card.image}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-karbala-gold text-karbala-black rounded-pill font-kufi hover:bg-karbala-gold-light transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              تحميل البطاقة
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
