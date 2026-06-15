/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getNightBySlug, getAllNightSlugs } from "@/lib/queries";
import { notFound } from "next/navigation";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { QuoteCard, renderCard } from "@/components/cards/ContentCards";
import { QuizButton } from "@/components/quiz/QuizButton";
import { ShareButton } from "@/components/ui/ShareButton";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllNightSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const night = await getNightBySlug(params.slug);
  if (!night) {
    return { title: "الليلة غير موجودة" };
  }
  return {
    title: `${night.title} | وعيٌ يمرّ من كربلاء`,
    description: night.short_description || night.teaser || `الليلة ${night.number} من موسم وعي يمر من كربلاء`,
    openGraph: {
      title: night.seo_title || night.title,
      description: night.seo_description || night.short_description || "",
      images: night.seo_image ? [{ url: night.seo_image }] : [],
    },
  };
}

function getEstimatedReadingTime(night: any): number {
  const texts = [
    night.short_description,
    night.teaser,
    night.central_idea,
    night.why_important,
    night.quote,
    night.reflection_question,
    night.practical_step,
  ];

  if (night.topics) {
    night.topics.forEach((t: any) => {
      texts.push(t.title);
      texts.push(t.content);
    });
  }

  if (night.verses) {
    night.verses.forEach((v: any) => texts.push(v.content));
  }

  if (night.narrations) {
    night.narrations.forEach((n: any) => texts.push(n.content));
  }

  const fullText = texts.filter(Boolean).join(" ");
  const wordCount = fullText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  const readingSpeedWPM = 180;
  const minutes = Math.round(wordCount / readingSpeedWPM);
  
  return Math.max(1, minutes);
}

function formatReadingTime(minutes: number): string {
  if (minutes === 1) return "دقيقة";
  if (minutes === 2) return "دقيقتين";
  if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
}

export default async function NightPage({ params }: { params: { slug: string } }) {
  const night = await getNightBySlug(params.slug);
  if (!night) notFound();

  const showAudio = night.show_audio !== false && night.audio_file;
  const showVideo = night.show_video !== false && (night.video_file || night.video_url);
  const hasQuiz = night.quiz?.is_enabled && night.quiz.questions.length > 0;
  
  const readingMinutes = getEstimatedReadingTime(night);
  const readingTimeText = formatReadingTime(readingMinutes);

  return (
    <div className="pb-8xl">
      <div className="section-container pt-32 pb-4 flex items-center justify-between border-b border-[rgba(212,185,138,0.12)]">
        <nav className="flex items-center gap-2 font-kufi text-body-sm text-karbala-secondary">
          <Link href="/karbala" className="hover:text-karbala-gold transition-colors">
            الرئيسية
          </Link>
          <span className="text-karbala-gray">/</span>
          <Link href="/karbala#nights" className="hover:text-karbala-gold transition-colors">
            الليالي
          </Link>
          <span className="text-karbala-gray">/</span>
          <span className="text-karbala-gold">الليلة {night.number}</span>
        </nav>

        <ShareButton title={night.title} />
      </div>

      {night.cover_image && (
        <section className="section-container max-w-4xl mb-6xl">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-gold-card shadow-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={night.cover_image}
              alt={night.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      <section className="section-container mt-4xl mb-6xl text-center max-w-prose">
        <div className="inline-flex items-center justify-center gap-2 mb-6 px-5 py-2 rounded-pill border border-[rgba(212,185,138,0.2)] bg-[rgba(212,185,138,0.05)] text-karbala-secondary backdrop-blur-sm shadow-sm transition-colors hover:border-[rgba(212,185,138,0.4)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-karbala-gold">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="font-kufi text-[0.85rem] md:text-sm font-medium tracking-wide">مدة القراءة: {readingTimeText}</span>
        </div>
        
        <h1 className="font-scheherazade text-display-h1 text-karbala-gold mb-4 leading-tight">
          {night.title}
        </h1>
        {night.short_description && (
          <p className="font-kufi text-body-lg text-karbala-gold-light leading-relaxed">
            {night.short_description}
          </p>
        )}
        {hasQuiz && (
          <div className="mt-6">
            <QuizButton
              nightSlug={night.slug}
              opensAt={night.quiz!.opens_at}
              closesAt={night.quiz!.closes_at}
            />
          </div>
        )}
      </section>

      {showAudio && (
        <section className="section-container max-w-prose mb-6xl">
          <AudioPlayer src={night.audio_file!} title={`تسجيل الليلة ${night.number}`} />
        </section>
      )}

      {showVideo && (
        <section className="section-container max-w-prose mb-6xl">
          <VideoPlayer
            src={night.video_file}
            url={night.video_url}
            title={`محاضرة الليلة ${night.number}`}
          />
        </section>
      )}

      <section className="section-container max-w-prose mb-6xl space-y-xl text-karbala-white font-kufi text-body-md leading-relaxed">
        {night.teaser && <p className="text-karbala-gold-light italic text-center text-lg">{night.teaser}</p>}
        {night.central_idea && (
          <div>
            <h3 className="text-karbala-gold mb-2 text-xl font-scheherazade">الفكرة المركزية</h3>
            <p>{night.central_idea}</p>
          </div>
        )}
        {night.why_important && (
          <div>
            <h3 className="text-karbala-gold mb-2 text-xl font-scheherazade">لماذا هذا الموضوع مهم؟</h3>
            <p>{night.why_important}</p>
          </div>
        )}
      </section>

      {night.quote && (
        <section className="section-container max-w-prose mb-6xl">
          <QuoteCard
            card={{
              type: "quote",
              title: "اقتباس الليلة",
              content: night.quote,
              seo_description: night.quote_author,
              id: "",
              slug: "",
              status: "published",
              downloadable: false,
              featured: false,
              sort_order: 0,
              night_id: null,
              image: null,
              image_position: "top",
              seo_title: null,
              created_at: "",
              updated_at: "",
            }}
          />
        </section>
      )}

      {night.cards && night.cards.length > 0 && (
        <section className="section-container max-w-4xl mb-6xl">
          <SectionDivider title="بطاقات الليلة" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mt-4xl">
            {night.cards.map((card) => (
              <div key={card.id}>{renderCard(card)}</div>
            ))}
          </div>
        </section>
      )}

      {night.topics && night.topics.length > 0 && (
        <section className="section-container max-w-4xl mb-6xl">
          <SectionDivider title="محاور الليلة" />
          <div className="relative border-r-2 border-[rgba(212,185,138,0.15)] pr-8 md:pr-12 mt-4xl space-y-12">
            {night.topics.map((topic: any, index: number) => (
              <div key={topic.id || index} className="relative group">
                <div className="absolute -right-[41px] md:-right-[57px] top-6 w-4 h-4 rounded-full bg-[#0D0B09] border-[3px] border-karbala-gold group-hover:scale-150 transition-transform duration-500 shadow-glow" />

                <div className="card-base p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-[rgba(212,185,138,0.03)] to-transparent">
                  <div className="absolute -left-4 -top-8 text-[8rem] font-scheherazade text-karbala-gold opacity-5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    {index + 1}
                  </div>

                  <h3 className="font-scheherazade text-2xl md:text-3xl text-karbala-gold-light mb-5 relative z-10">
                    {topic.title}
                  </h3>

                  {topic.content && (
                    <div
                      className="font-kufi text-[0.95rem] md:text-[1.05rem] text-karbala-secondary leading-[2] relative z-10"
                      dangerouslySetInnerHTML={{
                        __html: topic.content
                          .replace(/\\n/g, "<br/>")
                          .replace(/\n/g, "<br/>")
                          .replace(/•/g, '<span class="text-karbala-gold mx-2">•</span>'),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {((night.verses?.length ?? 0) > 0 || (night.narrations?.length ?? 0) > 0) && (
        <section className="section-container max-w-prose mb-6xl space-y-4xl">
          <SectionDivider title="شواهد الليلة" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mt-4xl">
            {night.verses?.map((verse: any, idx: number) => (
              <div key={idx} className="card-base p-lg text-center relative overflow-hidden">
                <div className="absolute -top-4 -right-4 text-6xl opacity-5 font-scheherazade text-karbala-gold">﴾</div>
                <div className="absolute -bottom-4 -left-4 text-6xl opacity-5 font-scheherazade text-karbala-gold">﴿</div>
                <p className="font-scheherazade text-xl text-karbala-gold-light leading-relaxed mb-4 relative z-10">
                  ﴿ {verse.content} ﴾
                </p>
                <Badge variant="muted">
                  {verse.surah_name} - {verse.verse_number}
                </Badge>
              </div>
            ))}

            {night.narrations?.map((narration: any, idx: number) => (
              <div key={idx} className="card-base p-lg text-center">
                <p className="font-kufi text-body-md text-karbala-white leading-relaxed mb-4">
                  &quot;{narration.content}&quot;
                </p>
                {narration.source && <Badge variant="muted">{narration.source}</Badge>}
              </div>
            ))}
          </div>
        </section>
      )}

      {(night.reflection_question || night.practical_step) && (
        <section className="section-container max-w-prose mb-6xl">
          <div className="border border-gold-medium bg-[rgba(212,185,138,0.05)] rounded-xl p-2xl">
            <h3 className="font-scheherazade text-display-h3 text-karbala-gold text-center mb-xl">
              للتأمل والعمل
            </h3>

            <div className="space-y-xl">
              {night.reflection_question && (
                <div>
                  <h4 className="font-kufi text-sm text-karbala-gold-dark mb-2 uppercase tracking-widest">
                    سؤال للتأمل
                  </h4>
                  <p className="font-kufi text-lg text-karbala-white">{night.reflection_question}</p>
                </div>
              )}

              {night.practical_step && (
                <div>
                  <h4 className="font-kufi text-sm text-karbala-gold-dark mb-2 uppercase tracking-widest">
                    خطوة عملية
                  </h4>
                  <p className="font-kufi text-lg text-karbala-white">{night.practical_step}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {((night.resources?.length ?? 0) > 0 || night.pdf_file) && (
        <section className="section-container max-w-prose mb-6xl text-center">
          <SectionDivider title="مواد مساندة" />

          <div className="mt-4xl flex flex-wrap justify-center gap-4">
            {night.pdf_file && (
              <a
                href={night.pdf_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-karbala-gold text-karbala-gold rounded-pill hover:bg-[rgba(212,185,138,0.1)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                تحميل الملخص (PDF)
              </a>
            )}

            {night.resources?.map((res: any) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gold-medium text-karbala-secondary rounded-pill hover:border-karbala-gold hover:text-karbala-gold transition-colors"
              >
                <span className="text-sm">🔗</span> {res.title}
              </a>
            ))}
          </div>
        </section>
      )}

      {(night.attachments?.length ?? 0) > 0 && (
        <section className="section-container max-w-prose mb-6xl">
          <SectionDivider title="مرفقات الليلة" />
          <div className="mt-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            {night.attachments.map((att: any) => (
              <a
                key={att.id}
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-base p-lg flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-[rgba(212,185,138,0.3)] flex items-center justify-center text-karbala-gold shrink-0 group-hover:bg-[rgba(212,185,138,0.1)] transition-colors">
                  {att.type === "pdf" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                  {att.type === "audio" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  )}
                  {att.type === "image" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-kufi text-sm text-karbala-gold-light truncate">{att.title}</p>
                  <p className="font-kufi text-xs text-karbala-gray mt-1">
                    {att.type === "pdf" ? "ملف PDF" : att.type === "audio" ? "ملف صوتي" : "صورة"}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
