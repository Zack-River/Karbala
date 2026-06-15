import React from "react";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { QuizForm } from "@/components/admin/forms/QuizForm";
import { notFound } from "next/navigation";
import type { QuizQuestionWithAnswers } from "@/types/database";

export const metadata = { title: "تعديل اختبار | لوحة التحكم" };

export default async function EditQuizPage({ params }: { params: { id: string } }) {
  const supabase = await createAuthenticatedServerClient();

  const [{ data: quiz }, { data: nights }] = await Promise.all([
    supabase.from("quizzes").select("*").eq("id", params.id).single(),
    supabase.from("nights").select("id, number, title").order("number", { ascending: true }),
  ]);

  if (!quiz) notFound();

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quiz.id)
    .order("sort_order");

  let questionsWithAnswers: QuizQuestionWithAnswers[] = [];
  if (questions && questions.length > 0) {
    const questionIds = questions.map((q) => q.id);
    const { data: answers } = await supabase
      .from("quiz_answers")
      .select("*")
      .in("question_id", questionIds)
      .order("sort_order");

    questionsWithAnswers = questions.map((q) => ({
      ...q,
      answers: (answers ?? []).filter((a) => a.question_id === q.id),
    }));
  }

  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade text-karbala-gold">
        تعديل الاختبار
      </h1>
      <QuizForm
        nights={nights ?? []}
        existing={{ ...quiz, questions: questionsWithAnswers }}
      />
    </div>
  );
}
