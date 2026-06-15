"use server";

import { createActionClient } from "@/lib/supabase/action";
import { cookies } from "next/headers";

export async function startQuizAttempt(quizId: string) {
  const supabase = await createActionClient();

  // 1. Fetch quiz to validate schedule
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("opens_at, closes_at, duration_minutes")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return { success: false, error: "الاختبار غير موجود" };
  }

  const now = new Date();
  const nowMs = now.getTime();

  if (quiz.opens_at && nowMs < new Date(quiz.opens_at).getTime()) {
    return { success: false, error: "عذراً، الاختبار لم يُفتح بعد" };
  }
  
  if (quiz.closes_at && nowMs > new Date(quiz.closes_at).getTime()) {
    return { success: false, error: "عذراً، لقد انتهى وقت الاختبار المسموح" };
  }

  // 2. Count total questions for this quiz
  const { count: totalQuestions } = await supabase
    .from("quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", quizId);

  // 3. Insert attempt record into quiz_attempts
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      started_at: now.toISOString(),
      total_questions: totalQuestions ?? 0,
    })
    .select("id")
    .single();

  if (attemptError || !attempt) {
    console.error("Failed to create quiz attempt:", attemptError);
    // Don't block the user — fall back to cookie-only mode
    // This handles the case where the migration hasn't been run yet
  }

  // 4. Store start time in HTTP-only cookie for server-side duration enforcement
  const cookieStore = await cookies();
  const cookieValue = JSON.stringify({
    startedAt: nowMs,
    attemptId: attempt?.id ?? null,
  });
  cookieStore.set(`quiz_attempt_${quizId}`, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: (quiz.duration_minutes || 60) * 60 * 2, // 2x duration as safety margin
  });

  return {
    success: true,
    attemptId: attempt?.id ?? null,
    serverTime: now.toISOString(),
  };
}
