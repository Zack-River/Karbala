import React from "react";
import Link from "next/link";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { LiveVisitorsWidget } from "@/components/admin/LiveVisitorsWidget";

export const metadata = {
  title: "لوحة التحكم | وعي يمر من كربلاء",
};

export default async function AdminDashboardPage() {
  const supabase = await createAuthenticatedServerClient();

  // Fetch real stats from the database
  const [seasonsRes, nightsRes, cardsRes, resourcesRes, attachmentsRes, quizzesRes, majalisRes, pageViewsRes] = await Promise.all([
    supabase.from("seasons").select("id, is_active").limit(1),
    supabase.from("nights").select("id, status"),
    supabase.from("cards").select("id, status"),
    supabase.from("resources").select("id"),
    supabase.from("attachments").select("id"),
    supabase.from("quizzes").select("id, is_enabled"),
    supabase.from("majalis").select("id, is_enabled"),
    supabase.from("page_views").select("session_id", { count: "exact" }),
  ]);

  const nights = nightsRes.data ?? [];
  const cards = cardsRes.data ?? [];
  const activeSeason = seasonsRes.data?.[0]?.is_active ?? false;
  
  // Calculate unique sessions
  const uniqueSessions = new Set((pageViewsRes.data ?? []).map(pv => pv.session_id)).size;

  const stats = {
    totalNights: nights.length,
    publishedNights: nights.filter(n => n.status === 'published').length,
    totalCards: cards.length,
    publishedCards: cards.filter(c => c.status === 'published').length,
    totalResources: resourcesRes.data?.length ?? 0,
    totalAttachments: attachmentsRes.data?.length ?? 0,
    totalQuizzes: quizzesRes.data?.length ?? 0,
    enabledQuizzes: (quizzesRes.data ?? []).filter((q) => q.is_enabled).length,
    totalMajalis: majalisRes.data?.length ?? 0,
    enabledMajalis: (majalisRes.data ?? []).filter((m) => m.is_enabled).length,
    activeSeason,
    totalPageViews: pageViewsRes.count ?? 0,
    uniqueSessions,
  };

  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade">نظرة عامة</h1>
      
      {/* Visitor Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <LiveVisitorsWidget />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">إجمالي الجلسات (الزوار)</p>
          <p className="text-3xl font-bold text-gray-900">{stats.uniqueSessions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">إجمالي مشاهدات الصفحات</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Stat Card 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">الموسم الحالي</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeSeason ? "نشط" : "غير نشط"}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">الليالي</p>
            <p className="text-2xl font-bold text-gray-900">{stats.publishedNights} / {stats.totalNights}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">البطاقات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.publishedCards} / {stats.totalCards}</p>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
             </svg>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">المصادر والمرفقات</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalResources + stats.totalAttachments}</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 font-scheherazade">إجراءات سريعة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">الاختبارات</p>
          <p className="text-xl font-bold">{stats.enabledQuizzes} / {stats.totalQuizzes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">المجالس</p>
          <p className="text-xl font-bold">{stats.enabledMajalis} / {stats.totalMajalis}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/nights/new" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          إضافة ليلة جديدة
        </Link>
        <Link href="/admin/cards" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
             <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          إدارة البطاقات
        </Link>
        <Link href="/admin/sheikh" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          ملف الشيخ
        </Link>
        <Link href="/admin/quizzes/new" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          إنشاء اختبار
        </Link>
        <Link href="/admin/majalis/new" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          إضافة مجلس
        </Link>
        <Link href="/admin/season" className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          إعدادات الموسم
        </Link>
      </div>
    </div>
  );
}
