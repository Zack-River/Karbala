"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  try {
    // Use service role client for trusted grading (needs to read is_correct column)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, serviceKey || anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Fetch quiz to verify it's open (including duration_minutes for time enforcement)
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("opens_at, closes_at, duration_minutes")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return { success: false, error: "الاختبار غير موجود" };
    }

    const now = new Date().getTime();
    if (quiz.opens_at && now < new Date(quiz.opens_at).getTime()) {
      return { success: false, error: "الاختبار لم يفتح بعد" };
    }
    if (quiz.closes_at && now > new Date(quiz.closes_at).getTime()) {
      return { success: false, error: "انتهى وقت الاختبار" };
    }

    let attemptId: string | null = null;
    let startedAt: number | null = null;

    try {
      const cookieStore = await cookies();
      const attemptCookie = cookieStore.get(`quiz_attempt_${quizId}`);
      
      if (attemptCookie) {
        try {
          const cookieData = JSON.parse(attemptCookie.value);
          startedAt = cookieData.startedAt;
          attemptId = cookieData.attemptId;
        } catch {
          // Fallback for older cookie format if any
          startedAt = parseInt(attemptCookie.value, 10);
        }
      }
    } catch (cookieErr) {
      console.error("Failed to read quiz cookie:", cookieErr);
      // Continue without cookie data — grading still works
    }

    // Check duration constraint using HTTP-only cookie
    if (quiz.duration_minutes) {
      if (!startedAt) {
        return { success: false, error: "لم يتم العثور على محاولة نشطة. الرجاء تحديث الصفحة والبدء من جديد." };
      }
      
      const maxDurationMs = quiz.duration_minutes * 60 * 1000;
      const GRACE_PERIOD_MS = 15000; // 15 seconds grace period for network latency
      
      if (now > startedAt + maxDurationMs + GRACE_PERIOD_MS) {
        return { success: false, error: "عذراً، لقد تجاوزت الوقت المسموح (العداد انتهى). لا يمكن قبول هذا التسليم المتأخر." };
      }
    }

    // 2. Fetch correct answers using a reliable two-step approach (Bug #3 fix)
    const { data: quizQuestions } = await supabase
      .from("quiz_questions")
      .select("id")
      .eq("quiz_id", quizId);

    if (!quizQuestions || quizQuestions.length === 0) {
      return { success: false, error: "لا توجد أسئلة في هذا الاختبار" };
    }

    const questionIds = quizQuestions.map((q) => q.id);
    const { data: correctAnswersData, error: answersError } = await supabase
      .from("quiz_answers")
      .select("question_id, id")
      .eq("is_correct", true)
      .in("question_id", questionIds);

    if (answersError) {
      return { success: false, error: "حدث خطأ أثناء تصحيح الاختبار" };
    }

    // Map correct answers: { questionId: answerId }
    const correctAnswersMap: Record<string, string> = {};
    (correctAnswersData ?? []).forEach((a) => {
      correctAnswersMap[a.question_id] = a.id;
    });

    // 3. Calculate score & prepare answers for insert
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const attemptAnswersToInsert = [];

    for (const questionId of questionIds) {
      const selectedAnswerId = answers[questionId];
      const isCorrect = selectedAnswerId ? correctAnswersMap[questionId] === selectedAnswerId : false;
      
      if (!selectedAnswerId) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }

      if (attemptId) {
        attemptAnswersToInsert.push({
          attempt_id: attemptId,
          question_id: questionId,
          selected_answer: selectedAnswerId || null,
          is_correct: isCorrect
        });
      }
    }

    const scorePercentage = (correctCount / questionIds.length) * 100;

    // 4. Save to Database (if attemptId exists)
    if (attemptId) {
      // Insert answers
      if (attemptAnswersToInsert.length > 0) {
        await supabase.from("quiz_attempt_answers").insert(attemptAnswersToInsert);
      }

      // Update attempt record
      await supabase.from("quiz_attempts").update({
        submitted_at: new Date().toISOString(),
        score: scorePercentage,
        correct_count: correctCount,
        wrong_count: wrongCount,
        unanswered_count: unansweredCount
      }).eq("id", attemptId);
    }

    // Clear the cookie so they can't re-submit
    try {
      const cookieStore = await cookies();
      cookieStore.delete(`quiz_attempt_${quizId}`);
    } catch {
      // Non-fatal — cookie will expire on its own
    }

    return {
      success: true,
      score: correctCount,
      correctAnswers: correctAnswersMap,
    };
  } catch (error) {
    console.error("Quiz submit unhandled error:", error);
    return { success: false, error: "حدث خطأ في الخادم. حاول مرة أخرى." };
  }
}

