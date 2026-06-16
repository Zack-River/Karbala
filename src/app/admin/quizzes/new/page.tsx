import React from "react";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { QuizForm } from "@/components/admin/forms/QuizForm";

export const metadata = { title: "إنشاء اختبار | لوحة التحكم" };

export default async function NewQuizPage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: existingQuizzes } = await supabase
    .from("quizzes")
    .select("night_id");
    
  const existingNightIds = new Set((existingQuizzes || []).map(q => q.night_id));

  const { data: allNights } = await supabase
    .from("nights")
    .select("id, number, title")
    .order("number", { ascending: true });

  const nights = (allNights || []).filter(n => !existingNightIds.has(n.id));

  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold mb-8 font-scheherazade text-karbala-gold">
        إنشاء اختبار جديد
      </h1>
      <QuizForm nights={nights ?? []} />
    </div>
  );
}
