import { NextResponse, type NextRequest } from "next/server";
import { createActionClient } from "@/lib/supabase/action";

export async function POST(request: NextRequest) {
  let quizId: string | undefined;

  try {
    const body = await request.json();
    quizId = body.quizId;
  } catch {
    return NextResponse.json(
      { success: false, error: "طلب غير صالح" },
      { status: 400 }
    );
  }

  if (!quizId) {
    return NextResponse.json(
      { success: false, error: "الاختبار غير موجود" },
      { status: 400 }
    );
  }

  const supabase = await createActionClient();

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("opens_at, closes_at, duration_minutes")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    return NextResponse.json(
      { success: false, error: "الاختبار غير موجود" },
      { status: 404 }
    );
  }

  const now = new Date();
  const nowMs = now.getTime();

  if (quiz.opens_at && nowMs < new Date(quiz.opens_at).getTime()) {
    return NextResponse.json(
      { success: false, error: "عذراً، الاختبار لم يُفتح بعد" },
      { status: 403 }
    );
  }

  if (quiz.closes_at && nowMs > new Date(quiz.closes_at).getTime()) {
    return NextResponse.json(
      { success: false, error: "عذراً، لقد انتهى وقت الاختبار المسموح" },
      { status: 403 }
    );
  }

  const { count: totalQuestions } = await supabase
    .from("quiz_questions")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", quizId);

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
  }

  const response = NextResponse.json({
    success: true,
    attemptId: attempt?.id ?? null,
    serverTime: now.toISOString(),
  });

  response.cookies.set(
    `quiz_attempt_${quizId}`,
    JSON.stringify({
      startedAt: nowMs,
      attemptId: attempt?.id ?? null,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: (quiz.duration_minutes || 60) * 60 * 2,
    }
  );

  return response;
}
