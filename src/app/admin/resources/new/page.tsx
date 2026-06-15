import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createActionClient } from "@/lib/supabase/action";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";

export const metadata = { title: "إضافة مصدر جديد | لوحة التحكم" };

export default async function NewResourcePage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: nights } = await supabase.from("nights").select("id, title").order("number", { ascending: true });

  async function createResource(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string;
    const night_id = formData.get("night_id") as string;

    const adminSupabase = await createActionClient();
    await adminSupabase.from("resources").insert({
      title,
      url,
      category,
      night_id,
    });

    revalidatePath("/admin/resources");
    redirect("/admin/resources");
  }

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100 font-kufi">
      <h1 className="text-2xl font-bold mb-6 font-scheherazade text-karbala-gold">إضافة مصدر جديد</h1>
      <form action={createResource} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الليلة التابع لها</label>
          <select name="night_id" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold">
            <option value="">-- اختر الليلة --</option>
            {nights?.map(n => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المصدر</label>
          <input type="text" name="title" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الرابط</label>
          <input type="url" name="url" required dir="ltr" className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold text-left" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
          <select name="category" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold">
            <option value="article">مقال</option>
            <option value="book">كتاب</option>
            <option value="video">فيديو</option>
            <option value="website">موقع</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <a href="/admin/resources" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">إلغاء</a>
          <button type="submit" className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors shadow-sm">حفظ المصدر</button>
        </div>
      </form>
    </div>
  );
}
