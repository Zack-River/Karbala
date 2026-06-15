import React from "react";
import Link from "next/link";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { deleteMajlisAction, toggleMajlisStatusAction } from "@/lib/actions/majlis";

export const metadata = { title: "المجالس | لوحة التحكم" };

export default async function AdminMajalisPage({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = await createAuthenticatedServerClient();
  const filter = searchParams.filter || "all";

  const { data: majalisData } = await supabase
    .from("majalis")
    .select("*")
    .order("sort_order", { ascending: true });

  const majalis = majalisData || [];

  const total = majalis.length;
  const enabledCount = majalis.filter(m => m.is_enabled).length;
  const disabledCount = total - enabledCount;

  const filteredMajalis = majalis.filter(m => {
    if (filter === "enabled") return m.is_enabled;
    if (filter === "disabled") return !m.is_enabled;
    return true;
  });

  return (
    <div className="font-kufi space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-scheherazade text-karbala-gold">
          إدارة المجالس
        </h1>
        <Link
          href="/admin/majalis/new"
          className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors text-sm"
        >
          + إضافة مجلس
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm mb-1">إجمالي المجالس</span>
          <span className="text-2xl font-bold text-gray-900">{total}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm mb-1">المجالس المفعلة</span>
          <span className="text-2xl font-bold text-green-600">{enabledCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm mb-1">المجالس غير المفعلة</span>
          <span className="text-2xl font-bold text-red-600">{disabledCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm inline-flex">
        <Link
          href="/admin/majalis?filter=all"
          className={`px-4 py-2 rounded-md text-sm transition-colors ${filter === "all" ? "bg-karbala-gold text-white" : "text-gray-600 hover:bg-gray-50"}`}
        >
          الكل
        </Link>
        <Link
          href="/admin/majalis?filter=enabled"
          className={`px-4 py-2 rounded-md text-sm transition-colors ${filter === "enabled" ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
        >
          المفعل
        </Link>
        <Link
          href="/admin/majalis?filter=disabled"
          className={`px-4 py-2 rounded-md text-sm transition-colors ${filter === "disabled" ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
        >
          غير المفعل
        </Link>
      </div>

      <DataTable
        data={filteredMajalis}
        keyExtractor={(row) => row.id}
        columns={[
          { header: "اسم المجلس", accessor: "name" },
          { header: "الموقع", accessor: (row) => row.location_description || "—" },
          {
            header: "الحالة",
            accessor: (row) => (
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${row.is_enabled ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                {row.is_enabled ? "مفعل" : "غير مفعل"}
              </span>
            ),
          },
          {
            header: "إجراءات",
            accessor: (row) => (
              <div className="flex items-center gap-4">
                <form action={async () => {
                  "use server";
                  await toggleMajlisStatusAction(row.id, !row.is_enabled);
                }}>
                  <button 
                    type="submit" 
                    className={`text-sm font-medium ${row.is_enabled ? "text-gray-500 hover:text-gray-700" : "text-green-600 hover:text-green-800"}`}
                  >
                    {row.is_enabled ? "تعطيل" : "تفعيل"}
                  </button>
                </form>
                <Link href={`/admin/majalis/${row.id}`} className="text-karbala-gold hover:text-karbala-gold-dark text-sm font-medium">
                  تعديل
                </Link>
                <form action={async () => {
                  "use server";
                  await deleteMajlisAction(row.id);
                }}>
                  <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">
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
