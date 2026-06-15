import React from "react";
import Link from "next/link";
import { DataTable } from "@/components/admin/DataTable";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "إدارة المصادر | لوحة التحكم",
};

export default async function AdminResourcesPage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*, nights(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
  }

  return (
    <div className="font-kufi space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 font-scheherazade">إدارة المصادر</h1>
        <Link 
          href="/admin/resources/new" 
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-karbala-gold hover:bg-karbala-gold-dark transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          إضافة مصدر جديد
        </Link>
      </div>

      <DataTable
        data={resources || []}
        keyExtractor={(row) => row.id}
        columns={[
          { header: "العنوان", accessor: "title" },
          { header: "الليلة", accessor: (row) => row.nights?.title || "غير محدد" },
          { header: "الرابط", accessor: (row) => <a href={row.url} target="_blank" className="text-blue-600 hover:text-blue-800 underline">عرض الرابط</a> },
          { 
            header: "تاريخ الإضافة", 
            accessor: (row) => new Date(row.created_at).toLocaleDateString("ar-SA")
          },
          {
            header: "إجراءات",
            accessor: (row) => (
              <div className="flex items-center gap-3">
                <Link href={`/admin/resources/${row.id}`} className="text-karbala-gold hover:text-karbala-gold-dark font-medium">
                  تعديل
                </Link>
                <form action={async () => {
                  "use server";
                  const { createActionClient } = await import("@/lib/supabase/action");
                  const adminSupabase = await createActionClient();
                  await adminSupabase.from("resources").delete().eq("id", row.id);
                  revalidatePath("/admin/resources");
                }}>
                  <button type="submit" className="text-red-600 hover:text-red-800 font-medium">
                    حذف
                  </button>
                </form>
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
