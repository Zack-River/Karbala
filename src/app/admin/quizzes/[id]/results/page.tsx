import React from "react";
import { notFound } from "next/navigation";
import { getQuizAttempts } from "@/lib/queries";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";

export const metadata = { title: "نتائج الاختبار | لوحة التحكم" };

export default async function QuizResultsPage({ params }: { params: { id: string } }) {
  const supabase = await createAuthenticatedServerClient();
  
  // Verify quiz exists and get its title
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("title, nights(number)")
    .eq("id", params.id)
    .single();

  if (!quiz) notFound();

  const attempts = await getQuizAttempts(params.id);

  const nightData = Array.isArray(quiz.nights) ? quiz.nights[0] : quiz.nights;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quizTitle = quiz.title || (nightData ? `الليلة ${(nightData as any).number}` : "بدون عنوان");

  return (
    <div className="font-kufi space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-scheherazade text-karbala-gold">
            نتائج الاختبار
          </h1>
          <p className="text-karbala-secondary mt-1">
            {quizTitle} — {attempts.length} مشارك
          </p>
        </div>
      </div>

      <DataTable
        data={attempts}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "المشارك",
            accessor: (row) => row.anonymous_id ? "زائر مجهول" : (row.user_id ? "مستخدم مسجل" : "غير معروف"),
          },
          {
            header: "النتيجة",
            accessor: (row) => (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.score && row.score >= 50 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {row.score}%
              </span>
            ),
          },
          {
            header: "إجابات صحيحة",
            accessor: (row) => <span className="text-green-600 font-bold">{row.correct_count}</span>,
          },
          {
            header: "إجابات خاطئة",
            accessor: (row) => <span className="text-red-600">{row.wrong_count}</span>,
          },
          {
            header: "وقت التسليم",
            accessor: (row) => row.submitted_at ? new Date(row.submitted_at).toLocaleString("ar-SA", { timeZone: "Asia/Riyadh", dateStyle: "medium", timeStyle: "short" }) : "—",
          },
        ]}
      />
    </div>
  );
}
