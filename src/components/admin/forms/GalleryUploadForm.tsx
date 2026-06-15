"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadGalleryImageAction } from "@/lib/actions/gallery";
import { Button } from "@/components/ui/Button";

export function GalleryUploadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadGalleryImageAction(formData);

    if (!result.success) {
      setError(result.error || "حدث خطأ غير معروف أثناء رفع الصورة.");
      setIsSubmitting(false);
    } else {
      // Clear form and navigate or show success
      const form = e.target as HTMLFormElement;
      form.reset();
      setIsSubmitting(false);
      router.refresh();
      setSuccess("تم رفع الصورة وإضافتها للمعرض بنجاح!");
      setTimeout(() => setSuccess(null), 5000); // Auto dismiss after 5s
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm mb-6 transition-all">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-md text-sm mb-6 transition-all flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {success}
        </div>
      )}

      <div>
        <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-2">
          اختر صورة (إلزامي)
        </label>
        <input
          type="file"
          id="image_file"
          name="image_file"
          accept="image/*"
          required
          className="w-full text-sm text-gray-500
            file:mr-0 file:ml-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-karbala-gold file:text-white
            hover:file:bg-karbala-gold/90
            cursor-pointer border border-gray-300 rounded-lg p-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          الحد الأقصى للحجم 5MB. يفضل استخدام الصور بجودة عالية.
        </p>
      </div>

      <div>
        <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-2">
          النص البديل / وصف الصورة (اختياري)
        </label>
        <input
          type="text"
          id="alt_text"
          name="alt_text"
          placeholder="مثال: جانب من الحضور النسائي في الليلة الثالثة"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold outline-none transition-shadow text-sm"
        />
      </div>

      <div>
        <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-2">
          الترتيب (اختياري)
        </label>
        <input
          type="number"
          id="sort_order"
          name="sort_order"
          defaultValue="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-karbala-gold focus:border-karbala-gold outline-none transition-shadow text-sm"
          dir="ltr"
        />
        <p className="mt-1 text-xs text-gray-500">
          الأرقام الأصغر تظهر أولاً.
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-karbala-gold hover:bg-karbala-gold/90 text-white min-w-[120px]"
        >
          {isSubmitting ? "جاري الرفع..." : "رفع الصورة"}
        </Button>
      </div>
    </form>
  );
}
