"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createNightAction } from "@/lib/actions/night";
import { MediaUrlUploader } from "@/components/admin/MediaUrlUploader";

export function NightForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic lists state
  const [topics, setTopics] = useState([{ title: "", content: "" }]);
  const [verses, setVerses] = useState([{ content: "", surah_name: "", verse_number: "" }]);
  const [narrations, setNarrations] = useState([{ content: "", source: "" }]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Add dynamic lists as JSON strings
    // Filter out completely empty entries
    const validTopics = topics.filter(t => t.title || t.content);
    const validVerses = verses.filter(v => v.content);
    const validNarrations = narrations.filter(n => n.content);

    formData.append("topics", JSON.stringify(validTopics));
    formData.append("verses", JSON.stringify(validVerses));
    formData.append("narrations", JSON.stringify(validNarrations));

    const result = await createNightAction(formData);
    
    if (result.success) {
      router.push("/admin/nights");
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ أثناء الحفظ");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-kufi">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* 1. Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-scheherazade border-b pb-2">المعلومات الأساسية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الليلة</label>
            <input type="number" name="number" required min="1" max="30" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حالة النشر</label>
            <select name="status" className="w-full px-3 py-2 border rounded-md">
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الليلة</label>
            <input type="text" name="title" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف قصير</label>
            <textarea name="short_description" rows={2} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      </div>

      {/* 2. Educational Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-scheherazade border-b pb-2">المحتوى المعرفي</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">جملة تشويقية (Teaser)</label>
            <input type="text" name="teaser" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الفكرة المركزية</label>
            <textarea name="central_idea" rows={3} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">لماذا هذا الموضوع مهم؟</label>
            <textarea name="why_important" rows={3} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      </div>

      {/* 3. Media Uploads */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-scheherazade border-b pb-2">الوسائط والملفات</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MediaUrlUploader
            name="cover_image"
            urlFieldName="cover_image_url"
            folder="nights/covers"
            label="صورة الغلاف"
            accept="image/*"
            description="JPG, PNG, WEBP"
          />
          <MediaUrlUploader
            name="audio_file"
            urlFieldName="audio_file_url"
            folder="nights/audio"
            label="التسجيل الصوتي"
            accept="audio/mp3,audio/mpeg,audio/wav,audio/*"
            description="ملف MP3 للمحاضرة"
          />
          <MediaUrlUploader
            name="pdf_file"
            urlFieldName="pdf_file_url"
            folder="nights/pdfs"
            label="ملخص PDF"
            accept="application/pdf"
            description="ملف PDF للتحميل"
          />
        </div>
      </div>

      {/* 4. Topics Builder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-900 font-scheherazade">محاور الليلة</h2>
          <button 
            type="button" 
            onClick={() => setTopics([...topics, { title: "", content: "" }])}
            className="text-sm text-karbala-gold hover:text-karbala-gold-dark font-medium"
          >
            + إضافة محور
          </button>
        </div>
        
        <div className="space-y-6">
          {topics.map((topic, index) => (
            <div key={index} className="p-4 bg-gray-50 border border-gray-100 rounded-md relative group">
              <button 
                type="button" 
                onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                حذف
              </button>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">عنوان المحور {index + 1}</label>
                <input 
                  type="text" 
                  value={topic.title} 
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[index].title = e.target.value;
                    setTopics(newTopics);
                  }}
                  className="w-full px-3 py-2 border rounded-md" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">محتوى المحور (HTML مدعوم)</label>
                <textarea 
                  rows={4}
                  value={topic.content} 
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[index].content = e.target.value;
                    setTopics(newTopics);
                  }}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm ltr" 
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Verses & Narrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verses */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-900 font-scheherazade">الشواهد القرآنية</h2>
            <button 
              type="button" 
              onClick={() => setVerses([...verses, { content: "", surah_name: "", verse_number: "" }])}
              className="text-sm text-karbala-gold hover:text-karbala-gold-dark font-medium"
            >
              + إضافة آية
            </button>
          </div>
          
          <div className="space-y-4">
            {verses.map((verse, index) => (
              <div key={index} className="p-3 bg-gray-50 border border-gray-100 rounded-md relative group">
                <button type="button" onClick={() => setVerses(verses.filter((_, i) => i !== index))} className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100">حذف</button>
                <textarea rows={2} placeholder="الآية الكريمة" value={verse.content} onChange={(e) => { const v = [...verses]; v[index].content = e.target.value; setVerses(v); }} className="w-full px-2 py-1 border rounded-md mb-2 text-sm" />
                <div className="flex gap-2">
                  <input type="text" placeholder="اسم السورة" value={verse.surah_name} onChange={(e) => { const v = [...verses]; v[index].surah_name = e.target.value; setVerses(v); }} className="flex-1 px-2 py-1 border rounded-md text-sm" />
                  <input type="text" placeholder="رقم الآية" value={verse.verse_number} onChange={(e) => { const v = [...verses]; v[index].verse_number = e.target.value; setVerses(v); }} className="w-24 px-2 py-1 border rounded-md text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-900 font-scheherazade">الروايات والأحاديث</h2>
            <button 
              type="button" 
              onClick={() => setNarrations([...narrations, { content: "", source: "" }])}
              className="text-sm text-karbala-gold hover:text-karbala-gold-dark font-medium"
            >
              + إضافة رواية
            </button>
          </div>
          
          <div className="space-y-4">
            {narrations.map((narration, index) => (
              <div key={index} className="p-3 bg-gray-50 border border-gray-100 rounded-md relative group">
                <button type="button" onClick={() => setNarrations(narrations.filter((_, i) => i !== index))} className="absolute top-2 left-2 text-red-500 opacity-0 group-hover:opacity-100">حذف</button>
                <textarea rows={2} placeholder="نص الرواية" value={narration.content} onChange={(e) => { const n = [...narrations]; n[index].content = e.target.value; setNarrations(n); }} className="w-full px-2 py-1 border rounded-md mb-2 text-sm" />
                <input type="text" placeholder="المصدر (مثل: الكافي، بحار الأنوار)" value={narration.source} onChange={(e) => { const n = [...narrations]; n[index].source = e.target.value; setNarrations(n); }} className="w-full px-2 py-1 border rounded-md text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-karbala-gold hover:bg-karbala-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-karbala-gold transition-colors disabled:opacity-70"
        >
          {loading ? "جاري الحفظ..." : "حفظ بيانات الليلة"}
        </button>
      </div>
    </form>
  );
}
