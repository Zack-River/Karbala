import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
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

    // Use anon key for reads (RLS allows public SELECT on quizzes)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

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

    // For the INSERT, use the service role client to bypass RLS 
    // (fallback: use anon client which also has INSERT policy)
    let insertClient = supabase;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (serviceKey) {
      try {
        insertClient = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
      } catch {
        // Fall back to anon client — RLS policy "Anyone can create quiz attempts" allows insert
      }
    }

    const { data: attempt, error: attemptError } = await insertClient
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        started_at: now.toISOString(),
        total_questions: totalQuestions ?? 0,
      })
      .select("id")
      .single();

    if (attemptError) {
      console.error("Failed to create quiz attempt:", attemptError);
      // Non-fatal: quiz can still proceed without attempt tracking
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
  } catch (error) {
    console.error("Quiz start route unhandled error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}

