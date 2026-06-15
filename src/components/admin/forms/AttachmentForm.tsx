"use client";

import React, { useState } from "react";
import { createAttachmentAction } from "@/lib/actions/attachment";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";

interface AttachmentFormProps {
  nights: { id: string; title: string }[];
}

export function AttachmentForm({ nights }: AttachmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createAttachmentAction(formData);

    if (result && "success" in result && !result.success) {
      setError(result.error || "حدث خطأ");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">الليلة التابعة لها *</label>
        <select name="night_id" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
          <option value="">-- اختر ليلة --</option>
          {nights.map((n) => (
            <option key={n.id} value={n.id}>{n.title}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">المرفق يظهر فقط في صفحة الليلة المختارة</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المرفق</label>
        <input type="text" name="title" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">نوع المرفق</label>
        <select name="type" required className="w-full border-gray-300 rounded-md shadow-sm p-2 border mb-4">
          <option value="pdf">ملف PDF</option>
          <option value="audio">صوتي</option>
          <option value="image">صورة</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">حالة النشر</label>
        <select name="status" defaultValue="published" className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
          <option value="published">منشور (يظهر للجمهور)</option>
          <option value="draft">مسودة (مخفي)</option>
        </select>
      </div>

      <MediaUrlUploader
        name="file"
        urlFieldName="file_url"
        folder="attachments"
        label="ملف المرفق"
        accept="*/*"
        description="ارفع الملف أولاً ثم احفظ"
      />

      <div className="flex justify-end gap-3 pt-4">
        <a href="/admin/attachments" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          إلغاء
        </a>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark disabled:opacity-70"
        >
          {loading ? "جاري الحفظ..." : "حفظ المرفق"}
        </button>
      </div>
    </form>
  );
}
