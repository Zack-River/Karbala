"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { updateCardAction } from "@/lib/actions/card";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";
import { CARD_TYPE_LABELS, CARD_IMAGE_POSITION_LABELS } from "@/constants";
import type { Card } from "@/types/database";

export default function EditCardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [nights, setNights] = useState<{ id: string; number: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("cards").select("*").eq("id", params.id).single(),
      supabase.from("nights").select("id, number, title").order("number", { ascending: true }),
    ]).then(([cardRes, nightsRes]) => {
      setCard(cardRes.data);
      setNights(nightsRes.data ?? []);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!card) return;
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("id", card.id);
    formData.append("slug", card.slug);
    formData.append("featured", (e.currentTarget.elements.namedItem("featured") as HTMLInputElement).checked.toString());
    formData.append("downloadable", (e.currentTarget.elements.namedItem("downloadable") as HTMLInputElement).checked.toString());

    const result = await updateCardAction(formData);
    if (result.success) {
      router.push("/admin/cards");
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ");
      setSaving(false);
    }
  };

  if (loading) return <p className="font-kufi text-gray-500">جاري التحميل...</p>;
  if (!card) return <p className="font-kufi text-gray-500">البطاقة غير موجودة</p>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100 font-kufi">
      <h1 className="text-2xl font-bold mb-6 font-scheherazade text-karbala-gold">تعديل بطاقة: {card.title}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
          <select name="type" defaultValue={card.type} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            {Object.entries(CARD_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
          <input type="text" name="title" defaultValue={card.title} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
          <textarea name="content" rows={4} defaultValue={card.content || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (المصدر أو التوضيح)</label>
          <input type="text" name="seo_description" defaultValue={card.seo_description || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
        </div>

        {card.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt={card.title} className="w-32 h-32 object-cover rounded-lg border mb-2" />
        )}
        <MediaUrlUploader
          name="image"
          urlFieldName="image_url"
          folder="cards"
          label="تحديث الصورة (اختياري)"
          accept="image/*"
          currentUrl={card.image}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">موضع الصورة</label>
          <select name="image_position" defaultValue={card.image_position || "top"} className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            {Object.entries(CARD_IMAGE_POSITION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الليلة التابعة لها (اختياري)</label>
          <select name="night_id" defaultValue={card.night_id || ""} className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            <option value="">-- بدون ليلة --</option>
            {nights.map((n) => (
              <option key={n.id} value={n.id}>الليلة {n.number}: {n.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
          <select name="status" defaultValue={card.status} required className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="featured" defaultChecked={card.featured} className="rounded border-gray-300 text-karbala-gold" />
            بطاقة مميزة
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="downloadable" defaultChecked={card.downloadable} className="rounded border-gray-300 text-karbala-gold" />
            قابلة للتحميل
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <a href="/admin/cards" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">إلغاء</a>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark disabled:opacity-70">
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </form>
    </div>
  );
}
