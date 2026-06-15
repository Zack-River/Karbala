"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createMajlisAction, updateMajlisAction } from "@/lib/actions/majlis";
import type { Majlis } from "@/types/database";

interface MajlisFormProps {
  existing?: Majlis;
}

export function MajlisForm({ existing }: MajlisFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("is_enabled", (e.currentTarget.elements.namedItem("is_enabled") as HTMLInputElement).checked.toString());
    if (existing) formData.append("id", existing.id);

    const result = existing
      ? await updateMajlisAction(formData)
      : await createMajlisAction(formData);

    if (result.success) {
      router.push("/admin/majalis");
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-kufi bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">اسم المجلس *</label>
        <input type="text" name="name" defaultValue={existing?.name} required className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
        <input type="text" name="address" defaultValue={existing?.address || ""} className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">وصف الموقع</label>
        <input type="text" name="location_description" defaultValue={existing?.location_description || ""} className="w-full px-3 py-2 border rounded-md" placeholder="مثل: بغداد — الكرخ" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">رابط خرائط Google *</label>
        <input type="url" name="google_maps_url" defaultValue={existing?.google_maps_url} required className="w-full px-3 py-2 border rounded-md" dir="ltr" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ترتيب العرض</label>
        <input type="number" name="sort_order" defaultValue={existing?.sort_order ?? 0} min="0" className="w-full px-3 py-2 border rounded-md" />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="is_enabled" defaultChecked={existing?.is_enabled ?? true} className="w-4 h-4 text-karbala-gold focus:ring-karbala-gold" />
        <span className="text-sm text-gray-700">تفعيل المجلس (إظهاره للجمهور)</span>
      </label>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <a href="/admin/majalis" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">إلغاء</a>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark disabled:opacity-70">
          {loading ? "جاري الحفظ..." : existing ? "حفظ التعديلات" : "إضافة المجلس"}
        </button>
      </div>
    </form>
  );
}
