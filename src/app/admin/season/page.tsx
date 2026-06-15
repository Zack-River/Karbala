"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { saveSeasonAction } from "@/lib/actions/season";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";
import Image from "next/image";

type SeasonData = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  hero_image: string | null;
  logo_image: string | null;
  is_active: boolean;
};

export default function SeasonAdminPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SeasonData>({
    id: "",
    title: "الموسم الأول — ١٣ ليلة معرفية",
    subtitle: "رحلة معرفية في الوعي الحسيني",
    intro: "موسم معرفي يهدف إلى إثراء الوعي الحسيني من خلال محاضرات ومحتوى تعليمي متميز",
    hero_image: null,
    logo_image: null,
    is_active: true,
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .single();
      if (data) setFormData(data as SeasonData);
    }
    load();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const form = new FormData(e.currentTarget);
    form.set("id", formData.id);
    form.set("is_active", formData.is_active.toString());
    if (formData.hero_image) form.set("hero_image_url", formData.hero_image);
    if (formData.logo_image) form.set("logo_image_url", formData.logo_image);

    const result = await saveSeasonAction(form);

    setSaving(false);

    if (!result.success) {
      setError(result.error || "فشل الحفظ");
      return;
    }

    if (result.data) {
      setFormData((prev) => ({
        ...prev,
        ...result.data,
        hero_image: (result.data as SeasonData).hero_image ?? prev.hero_image,
        logo_image: (result.data as SeasonData).logo_image ?? prev.logo_image,
      }));
    }

    setSuccess("تم حفظ بيانات الموسم بنجاح!");
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="font-kufi max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade">إدارة الموسم</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-medium text-gray-900">حالة الموسم</h3>
            <p className="text-sm text-gray-500">تفعيل أو تعطيل عرض هذا الموسم للجمهور.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              className="sr-only peer"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-karbala-gold/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-karbala-gold ltr:peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full" />
            <span className="mr-3 text-sm font-medium text-gray-900">
              {formData.is_active ? "نشط" : "غير نشط"}
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الموسم</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-karbala-gold focus:border-karbala-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-karbala-gold focus:border-karbala-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مقدمة الموسم</label>
            <textarea
              name="intro"
              rows={3}
              value={formData.intro}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-karbala-gold focus:border-karbala-gold"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">الوسائط</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صورة الغلاف (Hero)</label>
              {formData.hero_image && (
                <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2 h-32">
                  <Image src={formData.hero_image} alt="Hero" fill className="object-cover" />
                </div>
              )}
              <MediaUrlUploader
                name="hero_image"
                urlFieldName="hero_image_url"
                folder="season/hero"
                label="رفع صورة الغلاف"
                accept="image/png,image/jpeg,image/webp"
                currentUrl={formData.hero_image}
                onUploaded={(url) => setFormData((prev) => ({ ...prev, hero_image: url }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الشعار (Logo)</label>
              {formData.logo_image && (
                <div className="relative rounded-md overflow-hidden border border-gray-200 mb-2 h-32 bg-gray-100 flex items-center justify-center">
                  <Image src={formData.logo_image} alt="Logo" fill className="object-contain p-2" />
                </div>
              )}
              <MediaUrlUploader
                name="logo_image"
                urlFieldName="logo_image_url"
                folder="season/logo"
                label="رفع الشعار"
                accept="image/png,image/svg+xml,image/webp"
                currentUrl={formData.logo_image}
                onUploaded={(url) => setFormData((prev) => ({ ...prev, logo_image: url }))}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors disabled:opacity-70"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
