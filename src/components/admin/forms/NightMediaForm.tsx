"use client";

import React, { useState } from "react";
import { updateNightMediaAction } from "@/lib/actions/media";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";
import type { Night } from "@/types/database";

interface NightMediaFormProps {
  night: Pick<
    Night,
    | "id"
    | "slug"
    | "number"
    | "title"
    | "cover_image"
    | "audio_file"
    | "pdf_file"
    | "video_file"
    | "video_url"
    | "show_audio"
    | "show_video"
  >;
}

export function NightMediaForm({ night }: NightMediaFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.append("id", night.id);
    formData.append("slug", night.slug);
    formData.append("show_audio", (e.currentTarget.elements.namedItem("show_audio") as HTMLInputElement).checked.toString());
    formData.append("show_video", (e.currentTarget.elements.namedItem("show_video") as HTMLInputElement).checked.toString());

    const result = await updateNightMediaAction(formData);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-kufi bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-scheherazade text-karbala-gold">الوسائط والملفات</h2>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-md border border-green-200">تم الحفظ بنجاح</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">صورة الغلاف</label>
          {night.cover_image && (
            <p className="text-xs text-gray-500 mb-2">الصورة الحالية: <a href={night.cover_image} target="_blank" rel="noopener noreferrer" className="text-karbala-gold">عرض</a></p>
          )}
          <MediaUrlUploader
            name="cover_image"
            urlFieldName="cover_image_url"
            folder="nights/covers"
            label="رفع صورة الغلاف"
            accept="image/*"
            currentUrl={night.cover_image}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ملخص PDF</label>
          {night.pdf_file && (
            <p className="text-xs text-gray-500 mb-2">الملف الحالي: <a href={night.pdf_file} target="_blank" rel="noopener noreferrer" className="text-karbala-gold">عرض</a></p>
          )}
          <MediaUrlUploader
            name="pdf_file"
            urlFieldName="pdf_file_url"
            folder="nights/pdfs"
            label="رفع ملف PDF"
            accept="application/pdf"
            currentUrl={night.pdf_file}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ملف صوتي</label>
          {night.audio_file && (
            <p className="text-xs text-gray-500 mb-2">الملف الحالي: <a href={night.audio_file} target="_blank" rel="noopener noreferrer" className="text-karbala-gold">عرض</a></p>
          )}
          <MediaUrlUploader
            name="audio_file"
            urlFieldName="audio_url"
            folder="nights/audio"
            label="رفع ملف صوتي"
            accept="audio/*"
            currentUrl={night.audio_file}
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" name="show_audio" defaultChecked={night.show_audio !== false} className="w-4 h-4 text-karbala-gold" />
            <span className="text-sm text-gray-700">إظهار الصوت في صفحة الليلة</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ملف فيديو</label>
          {night.video_file && (
            <p className="text-xs text-gray-500 mb-2">الملف الحالي: <a href={night.video_file} target="_blank" rel="noopener noreferrer" className="text-karbala-gold">عرض</a></p>
          )}
          <MediaUrlUploader
            name="video_file"
            urlFieldName="video_file_url"
            folder="nights/video"
            label="رفع ملف فيديو"
            accept="video/*"
            currentUrl={night.video_file}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">رابط فيديو خارجي (YouTube / Vimeo)</label>
          <input
            type="url"
            name="video_url"
            defaultValue={night.video_url || ""}
            className="w-full px-3 py-2 border rounded-md"
            dir="ltr"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" name="show_video" defaultChecked={night.show_video !== false} className="w-4 h-4 text-karbala-gold" />
            <span className="text-sm text-gray-700">إظهار الفيديو في صفحة الليلة</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "حفظ الوسائط"}
        </button>
      </div>
    </form>
  );
}
