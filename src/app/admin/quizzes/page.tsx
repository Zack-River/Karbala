import React from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { deleteQuizAction } from "@/lib/actions/quiz";
import { getAllQuizStats } from "@/lib/queries";

export const metadata = { title: "الاختبارات | لوحة التحكم" };

export default async function AdminQuizzesPage() {
  const supabase = await createAuthenticatedServerClient();

  const [{ data: quizzes }, allStats] = await Promise.all([
    supabase
      .from("quizzes")
      .select("*, nights(number, title)")
      .order("created_at", { ascending: false }),
    getAllQuizStats()
  ]);

  // Calculate global stats
  const totalAttempts = allStats.reduce((sum, stat) => sum + stat.total_attempts, 0);
  const totalPerfect = allStats.reduce((sum, stat) => sum + stat.perfect_score_count, 0);
  const totalErrors = allStats.reduce((sum, stat) => sum + stat.total_errors, 0);
  
  const totalQuizzesWithAttempts = allStats.filter(s => s.total_attempts > 0).length;
  const avgPassRate = totalQuizzesWithAttempts > 0 
    ? (allStats.reduce((sum, stat) => sum + stat.pass_rate, 0) / totalQuizzesWithAttempts).toFixed(1) 
    : 0;

  return (
    <div className="font-kufi space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-scheherazade text-karbala-gold">
          إدارة الاختبارات
        </h1>
        <Link
          href="/admin/quizzes/new"
          className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors text-sm"
        >
          + إنشاء اختبار
        </Link>
      </div>

      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">إجمالي المحاولات</p>
          <p className="text-2xl font-bold text-karbala-gold">{totalAttempts}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">متوسط نسبة النجاح</p>
          <p className="text-2xl font-bold text-green-600">{avgPassRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">إجمالي العلامات الكاملة</p>
          <p className="text-2xl font-bold text-blue-600">{totalPerfect}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">إجمالي الأخطاء المتراكمة</p>
          <p className="text-2xl font-bold text-red-600">{totalErrors}</p>
        </div>
      </div>

      <DataTable
        data={quizzes ?? []}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "الليلة",
            accessor: (row) =>
              row.nights ? `الليلة ${row.nights.number}: ${row.nights.title}` : "—",
          },
          { header: "العنوان", accessor: (row) => row.title || "—" },
          {
            header: "الحالة",
            accessor: (row) => (
              <span className={`px-2 py-1 rounded-full text-xs ${row.is_enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {row.is_enabled ? "مفعّل" : "معطّل"}
              </span>
            ),
          },
          {
            header: "يفتح في",
            accessor: (row) =>
              row.opens_at ? new Date(row.opens_at).toLocaleString("ar") : "فوراً",
          },
          {
            header: "إجراءات",
            accessor: (row) => (
              <div className="flex items-center gap-3">
                <Link href={`/admin/quizzes/${row.id}/results`} className="text-blue-600 hover:underline text-sm">
                  النتائج
                </Link>
                <Link href={`/admin/quizzes/${row.id}`} className="text-karbala-gold hover:underline text-sm">
                  تعديل
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteQuizAction(row.id);
                  revalidatePath("/admin/quizzes");
                }}>
                  <button type="submit" className="text-red-600 hover:text-red-800 text-sm">
                    حذف
                  </button>
                </form>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
