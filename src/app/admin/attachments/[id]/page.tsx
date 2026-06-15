"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { updateAttachmentAction } from "@/lib/actions/attachment";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";
import type { Attachment } from "@/types/database";

export default function EditAttachmentPage({ params }: { params: { id: string } }) {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [nights, setNights] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("attachments").select("*").eq("id", params.id).single(),
      supabase.from("nights").select("id, title").order("number", { ascending: true }),
    ]).then(([attRes, nightsRes]) => {
      setAttachment(attRes.data);
      setNights(nightsRes.data ?? []);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!attachment) return;
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("id", attachment.id);

    const result = await updateAttachmentAction(formData);
    if (result && "success" in result && !result.success) {
      setError(result.error || "حدث خطأ");
      setSaving(false);
    }
  };

  if (loading) return <p className="font-kufi text-gray-500">جاري التحميل...</p>;
  if (!attachment) return <p className="font-kufi text-gray-500">المرفق غير موجود</p>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100 font-kufi">
      <h1 className="text-2xl font-bold mb-6 font-scheherazade text-karbala-gold">تعديل مرفق</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الليلة التابعة لها *</label>
          <select name="night_id" defaultValue={attachment.night_id} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            <option value="">-- اختر ليلة --</option>
            {nights.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المرفق</label>
          <input type="text" name="title" defaultValue={attachment.title} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رابط الملف الحالي</label>
          <input
            type="url"
            name="file_url"
            defaultValue={attachment.file_url}
            required
            dir="ltr"
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-left"
          />
        </div>

        <MediaUrlUploader
          name="file"
          urlFieldName="uploaded_file_url"
          folder="attachments"
          label="استبدال الملف (اختياري)"
          accept="*/*"
          currentUrl={attachment.file_url}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع المرفق</label>
          <select name="type" defaultValue={attachment.type} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            <option value="pdf">ملف PDF</option>
            <option value="audio">صوتي</option>
            <option value="image">صورة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">حالة النشر</label>
          <select name="status" defaultValue={attachment.status} className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            <option value="published">منشور (يظهر للجمهور)</option>
            <option value="draft">مسودة (مخفي)</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <a href="/admin/attachments" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">إلغاء</a>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark disabled:opacity-70">
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}
