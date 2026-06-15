import { createServerClient } from "@/lib/supabase/server";
import type {
  Season,
  Night,
  NightWithRelations,
  Card,
  SheikhProfile,
  QuizWithQuestions,
  Majlis,
} from "@/types/database";

// ─── Season Queries ───

export async function getActiveSeason(): Promise<Season | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching active season:", error);
    return null;
  }
  return data;
}

// ─── Sheikh Profile ───

export async function getSheikhProfile(): Promise<SheikhProfile | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("sheikh_profile")
    .select("*")
    .eq("is_visible", true)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching sheikh profile:", error);
    return null;
  }
  return data;
}

// ─── Night Queries ───

export async function getPublishedNights(): Promise<Night[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("nights")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching nights:", error);
    return [];
  }
  return data ?? [];
}

export async function getNightsWithQuizzes(): Promise<
  (Night & { quiz: { id: string; is_enabled: boolean; opens_at: string | null; closes_at: string | null } | null })[]
> {
  const supabase = createServerClient();
  const { data: nights, error } = await supabase
    .from("nights")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !nights) return [];

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, night_id, is_enabled, opens_at, closes_at")
    .eq("is_enabled", true);

  const quizMap = new Map(
    (quizzes ?? []).map((q) => [q.night_id, { id: q.id, is_enabled: q.is_enabled, opens_at: q.opens_at, closes_at: q.closes_at }])
  );

  return nights.map((n) => ({
    ...n,
    quiz: quizMap.get(n.id) ?? null,
  }));
}

async function fetchQuizForNight(
  supabase: ReturnType<typeof createServerClient>,
  nightId: string
): Promise<QuizWithQuestions | null> {
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("night_id", nightId)
    .eq("is_enabled", true)
    .single();

  if (!quiz) return null;

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quiz.id)
    .order("sort_order");

  if (!questions || questions.length === 0) return { ...quiz, questions: [] };

  const questionIds = questions.map((q) => q.id);
  const { data: answers } = await supabase
    .from("quiz_answers")
    .select("*")
    .in("question_id", questionIds)
    .order("sort_order");

  const answersByQuestion = new Map<string, typeof answers>();
  for (const answer of answers ?? []) {
    const existing = answersByQuestion.get(answer.question_id) ?? [];
    existing.push(answer);
    answersByQuestion.set(answer.question_id, existing);
  }

  return {
    ...quiz,
    questions: questions.map((q) => {
      const qAnswers = answersByQuestion.get(q.id) ?? [];
      const safeAnswers = qAnswers.map((a) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { is_correct, ...safe } = a;
        return safe;
      });
      return {
        ...q,
        answers: safeAnswers,
      };
    }),
  };
}

export async function getNightBySlug(
  slug: string
): Promise<NightWithRelations | null> {
  const supabase = createServerClient();

  const { data: night, error } = await supabase
    .from("nights")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !night) {
    console.error("Error fetching night:", error);
    return null;
  }

  const [topics, verses, narrations, resources, cards, attachments, quiz] =
    await Promise.all([
      supabase
        .from("topics")
        .select("*")
        .eq("night_id", night.id)
        .order("sort_order"),
      supabase
        .from("verses")
        .select("*")
        .eq("night_id", night.id)
        .order("sort_order"),
      supabase
        .from("narrations")
        .select("*")
        .eq("night_id", night.id)
        .order("sort_order"),
      supabase
        .from("resources")
        .select("*")
        .eq("night_id", night.id)
        .order("sort_order"),
      supabase
        .from("cards")
        .select("*")
        .eq("night_id", night.id)
        .eq("status", "published")
        .order("sort_order"),
      supabase
        .from("attachments")
        .select("*")
        .eq("night_id", night.id)
        .eq("status", "published")
        .order("created_at"),
      fetchQuizForNight(supabase, night.id),
    ]);

  return {
    ...night,
    topics: topics.data ?? [],
    verses: verses.data ?? [],
    narrations: narrations.data ?? [],
    resources: resources.data ?? [],
    cards: cards.data ?? [],
    attachments: attachments.data ?? [],
    quiz,
  };
}

export async function getAllNightSlugs(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("nights")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching night slugs:", error);
    return [];
  }
  return (data ?? []).map((n) => n.slug);
}

// ─── Quiz Queries ───

export async function getQuizByNightSlug(
  slug: string
): Promise<(QuizWithQuestions & { night: Pick<Night, "id" | "number" | "title" | "slug"> }) | null> {
  const supabase = createServerClient();

  const { data: night } = await supabase
    .from("nights")
    .select("id, number, title, slug")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!night) return null;

  const quiz = await fetchQuizForNight(supabase, night.id);
  if (!quiz) return null;

  return { ...quiz, night };
}

export async function getQuizStats(quizId: string): Promise<import("@/types/database").QuizStats | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("quiz_stats_view")
    .select("*")
    .eq("quiz_id", quizId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching quiz stats:", error);
    return null;
  }
  return data;
}

export async function getAllQuizStats(): Promise<import("@/types/database").QuizStats[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("quiz_stats_view")
    .select("*");

  if (error) {
    console.error("Error fetching all quiz stats:", error);
    return [];
  }
  return data ?? [];
}

export async function getQuizAttempts(quizId: string): Promise<import("@/types/database").QuizAttempt[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .not("submitted_at", "is", null)
    .order("score", { ascending: false })
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching quiz attempts:", error);
    return [];
  }
  return data ?? [];
}

// ─── Card Queries ───

export async function getPublishedCards(type?: string): Promise<Card[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("cards")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedCards(): Promise<Card[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(6);

  if (error) {
    console.error("Error fetching featured cards:", error);
    return [];
  }
  return data ?? [];
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching card:", error);
    return null;
  }
  return data;
}

export async function getAllCardSlugs(): Promise<string[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("cards")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching card slugs:", error);
    return [];
  }
  return (data ?? []).map((c) => c.slug);
}

// ─── Majalis Queries ───

export async function getEnabledMajalis(): Promise<Majlis[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("majalis")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching majalis:", error);
    return [];
  }
  return data ?? [];
}
