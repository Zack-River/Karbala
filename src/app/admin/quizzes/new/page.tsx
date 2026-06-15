import React from "react";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { QuizForm } from "@/components/admin/forms/QuizForm";

export const metadata = { title: "إنشاء اختبار | لوحة التحكم" };

export default async function NewQuizPage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: nights } = await supabase
    .from("nights")
    .select("id, number, title")
    .order("number", { ascending: true });

  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade text-karbala-gold">
        إنشاء اختبار جديد
      </h1>
      <QuizForm nights={nights ?? []} />
    </div>
  );
}
