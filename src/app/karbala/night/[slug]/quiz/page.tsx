import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuizByNightSlug, getQuizStats } from "@/lib/queries";
import { getQuizStatus } from "@/lib/quiz";
import { QuizTaker } from "@/components/quiz/QuizTaker";
import { QuizCountdown } from "@/components/quiz/QuizCountdown";
import { QuizStatsDisplay } from "@/components/quiz/QuizStatsDisplay";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const quiz = await getQuizByNightSlug(params.slug);
  if (!quiz) return { title: "الاختبار غير متاح" };
  return {
    title: `اختبار الليلة ${quiz.night.number} | وعيٌ يمرّ من كربلاء`,
    description: `اختبر معلوماتك في الليلة ${quiz.night.number}: ${quiz.night.title}`,
  };
}

export default async function NightQuizPage({
  params,
}: {
  params: { slug: string };
}) {
  const quizData = await getQuizByNightSlug(params.slug);
  if (!quizData) notFound();

  const [stats] = await Promise.all([
    getQuizStats(quizData.id)
  ]);

  const status = getQuizStatus(quizData);
  const isUpcoming = status === 'upcoming';
  const isClosed = status === 'closed';
  const hasQuestions = quizData.questions.length > 0;

  return (
    <div className="pb-8xl">
      <div className="section-container pt-32 pb-4 border-b border-[rgba(212,185,138,0.12)]">
        <nav className="flex items-center gap-2 font-kufi text-body-sm text-karbala-secondary">
          <Link href="/karbala" className="hover:text-karbala-gold transition-colors">
            الرئيسية
          </Link>
          <span className="text-karbala-gray">/</span>
          <Link
            href={`/karbala/night/${quizData.night.slug}`}
            className="hover:text-karbala-gold transition-colors"
          >
            الليلة {quizData.night.number}
          </Link>
          <span className="text-karbala-gray">/</span>
          <span className="text-karbala-gold">اختبار المعرفة</span>
        </nav>
      </div>

      <section className="section-container mt-4xl mb-6xl text-center max-w-prose mx-auto">
        <h1 className="font-scheherazade text-display-h2 text-karbala-gold mb-4">
          اختبر معلوماتك
        </h1>
        <p className="font-kufi text-body-lg text-karbala-gold-light">
          الليلة {quizData.night.number}: {quizData.night.title}
        </p>
      </section>

      <section className="section-container">
        {isUpcoming && quizData.opens_at ? (
          <QuizCountdown opensAt={quizData.opens_at} />
        ) : isClosed ? (
          <div className="card-base p-8 text-center bg-[rgba(212,185,138,0.05)] border-karbala-gray/30 max-w-lg mx-auto">
            <h2 className="text-2xl text-karbala-gold font-scheherazade mb-3">انتهى وقت الاختبار</h2>
            <p className="text-karbala-gray font-kufi">شكراً لاهتمامكم، نلقاكم في الاختبار القادم.</p>
          </div>
        ) : !hasQuestions ? (
          <p className="font-kufi text-karbala-secondary text-center">
            الاختبار قيد الإعداد. عد لاحقاً.
          </p>
        ) : (
          <QuizTaker quiz={quizData} />
        )}

        {stats && <QuizStatsDisplay stats={stats} />}
      </section>
    </div>
  );
}
