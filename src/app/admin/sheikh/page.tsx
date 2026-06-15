"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { updateSheikhAction } from "@/lib/actions/sheikh";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";
import type { SheikhProfile } from "@/types/database";

export default function AdminSheikhPage() {
  const [profile, setProfile] = useState<SheikhProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadProfile = async () => {
    const { data } = await supabase.from("sheikh_profile").select("*").limit(1).single();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set(
      "is_visible",
      (e.currentTarget.elements.namedItem("is_visible") as HTMLInputElement).checked.toString()
    );

    const result = await updateSheikhAction(formData);
    if (result.success) {
      setSuccess(true);
      await loadProfile();
    } else {
      setError(result.error || "حدث خطأ");
    }
    setSaving(false);
  };

  if (loading) {
    return <p className="font-kufi text-gray-500">جاري التحميل...</p>;
  }

  const emptyProfile: SheikhProfile = {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "سماحة الشيخ جعفر الصويلح",
    image: "/sheikh-profile.jpg",
    is_visible: true,
    created_at: "",
    updated_at: "",
  };

  const activeProfile = profile ?? emptyProfile;

  return (
    <div className="max-w-2xl font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 font-scheherazade text-karbala-gold">
        ملف الشيخ
      </h1>
      <p className="text-gray-500 mb-8">
        {profile
          ? "ارفع الصورة أولاً (ستُحفظ في التخزين)، ثم اضغط «حفظ التغييرات» لتحديث قاعدة البيانات."
          : "لم يُنشأ ملف الشيخ بعد — املأ البيانات واضغط «حفظ» لإنشاء السجل في قاعدة البيانات."}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md border border-green-200 mb-4">
          تم الحفظ بنجاح — تم تحديث قاعدة البيانات
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <input type="hidden" name="id" value={activeProfile.id} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشيخ</label>
          <input
            type="text"
            name="name"
            defaultValue={activeProfile.name}
            required
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:border-karbala-gold focus:ring-karbala-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">صورة الشيخ</label>
          {activeProfile.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeProfile.image}
              alt={activeProfile.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-karbala-gold"
            />
          )}
          <MediaUrlUploader
            name="image"
            urlFieldName="image_url"
            folder="sheikh"
            label="رفع صورة جديدة"
            accept="image/*"
            currentUrl={activeProfile.image}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_visible"
            defaultChecked={activeProfile.is_visible}
            className="w-4 h-4 text-karbala-gold focus:ring-karbala-gold rounded"
          />
          <span className="text-sm text-gray-700">إظهار قسم الشيخ في الصفحة الرئيسية</span>
        </label>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors disabled:opacity-70"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
