import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createActionClient } from "@/lib/supabase/action";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { NightMediaForm } from "@/components/admin/forms/NightMediaForm";

export const metadata = { title: "تعديل ليلة | لوحة التحكم" };

export default async function EditNightPage({ params }: { params: { id: string } }) {
  const supabase = await createAuthenticatedServerClient();
  
  // Fetch night data
  const { data: night } = await supabase
    .from("nights")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!night) notFound();

  async function updateNight(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const teaser = formData.get("teaser") as string;
    const central_idea = formData.get("central_idea") as string;
    const why_important = formData.get("why_important") as string;
    const quote = formData.get("quote") as string;
    const quote_author = formData.get("quote_author") as string;
    const reflection_question = formData.get("reflection_question") as string;
    const practical_step = formData.get("practical_step") as string;
    const status = formData.get("status") as string;

    const actionClient = await createActionClient();
    const { error } = await persistRowUpdate(actionClient, "nights", params.id, {
      title,
      short_description,
      teaser,
      central_idea,
      why_important,
      quote,
      quote_author,
      reflection_question,
      practical_step,
      status,
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(error);

    const { revalidatePublicSite } = await import("@/lib/revalidate");
    revalidatePath("/admin/nights");
    revalidatePath(`/karbala/night/${night.slug}`);
    revalidatePath(`/karbala/night/${night.slug}/quiz`);
    await revalidatePublicSite();
    redirect("/admin/nights");
  }

  return (
    <div className="max-w-3xl bg-white p-8 rounded-lg shadow-sm border border-gray-100 font-kufi">
      <h1 className="text-2xl font-bold mb-6 font-scheherazade text-karbala-gold">تعديل الليلة {night.number}: {night.title}</h1>
      <form action={updateNight} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
          <input type="text" name="title" defaultValue={night.title} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف القصير</label>
          <textarea name="short_description" rows={2} defaultValue={night.short_description || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التشويق</label>
          <textarea name="teaser" rows={3} defaultValue={night.teaser || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الفكرة المركزية</label>
          <textarea name="central_idea" rows={3} defaultValue={night.central_idea || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">لماذا هذه الليلة مهمة؟</label>
          <textarea name="why_important" rows={3} defaultValue={night.why_important || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاقتباس المحوري</label>
            <textarea name="quote" rows={2} defaultValue={night.quote || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مصدر الاقتباس</label>
            <input type="text" name="quote_author" defaultValue={night.quote_author || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">سؤال للتأمل</label>
          <textarea name="reflection_question" rows={2} defaultValue={night.reflection_question || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">خطوة عملية</label>
          <textarea name="practical_step" rows={2} defaultValue={night.practical_step || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
          <select name="status" defaultValue={night.status} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold">
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="hidden">مخفي</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <a href="/admin/nights" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">إلغاء</a>
          <button type="submit" className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors shadow-sm">حفظ التعديلات</button>
        </div>
      </form>

      <NightMediaForm night={night} />
    </div>
  );
}
