"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActionClient } from "@/lib/supabase/action";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidateNightById, revalidatePublicSite } from "@/lib/revalidate";

interface QuizQuestionInput {
  question: string;
  answers: { text: string; is_correct: boolean }[];
}

export async function saveQuizAction(formData: FormData) {
  const supabase = await createActionClient();

  const id = formData.get("id") as string | null;
  const night_id = formData.get("night_id") as string;
  const title = formData.get("title") as string;
  const is_enabledRaw = formData.get("is_enabled");
  const is_enabled = is_enabledRaw === "on" || is_enabledRaw === "true";
  const opens_at = (formData.get("opens_at") as string) || null;
  const closes_at = (formData.get("closes_at") as string) || null;
  const duration_minutes_str = formData.get("duration_minutes") as string;
  const duration_minutes = duration_minutes_str ? parseInt(duration_minutes_str, 10) : null;
  const motivational_message = (formData.get("motivational_message") as string) || null;
  const questionsJson = formData.get("questions") as string;

  try {
    const questions: QuizQuestionInput[] = questionsJson ? JSON.parse(questionsJson) : [];

    if (questions.length > 10) {
      return { success: false, error: "الحد الأقصى ١٠ أسئلة" };
    }

    let quizId = id;

    if (quizId) {
      const { error } = await persistRowUpdate(supabase, "quizzes", quizId, {
        night_id,
        title,
        is_enabled,
        opens_at: opens_at || null,
        closes_at: closes_at || null,
        duration_minutes,
        motivational_message,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error);

      await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);
    } else {
      const { data, error } = await supabase.from("quizzes").insert({
        night_id,
        title,
        is_enabled,
        opens_at: opens_at || null,
        closes_at: closes_at || null,
        duration_minutes,
        motivational_message,
      }).select().single();
      if (error) throw error;
      quizId = data.id;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const { data: question, error: qError } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: quizId,
          question: q.question,
          sort_order: i + 1,
        })
        .select()
        .single();
      if (qError) throw qError;

      if (q.answers.length > 0) {
        const answersToInsert = q.answers.map((a, j) => ({
          question_id: question.id,
          answer_text: a.text,
          is_correct: a.is_correct,
          sort_order: j + 1,
        }));
        const { error: aError } = await supabase.from("quiz_answers").insert(answersToInsert);
        if (aError) throw aError;
      }
    }

    revalidatePath("/admin/quizzes");
    await revalidateNightById(night_id);
    await revalidatePublicSite();

    return { success: true, quizId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteQuizAction(id: string) {
  const supabase = await createActionClient();
  const { data: quiz } = await supabase.from("quizzes").select("night_id").eq("id", id).single();
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/quizzes");
  await revalidateNightById(quiz?.night_id);
  await revalidatePublicSite();
  return { success: true };
}
