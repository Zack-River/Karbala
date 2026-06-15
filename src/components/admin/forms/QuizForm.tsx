"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveQuizAction } from "@/lib/actions/quiz";
import type { Night, QuizWithQuestions } from "@/types/database";

interface QuestionDraft {
  question: string;
  answers: { text: string; is_correct: boolean }[];
}

interface QuizFormProps {
  nights: Pick<Night, "id" | "number" | "title">[];
  existing?: QuizWithQuestions & { night_id: string };
}

export function QuizForm({ nights, existing }: QuizFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialQuestions: QuestionDraft[] = existing?.questions.map((q) => ({
    question: q.question,
    answers: q.answers.map((a) => ({ text: a.answer_text, is_correct: a.is_correct ?? false })),
  })) ?? [{ question: "", answers: [{ text: "", is_correct: true }, { text: "", is_correct: false }] }];

  const [questions, setQuestions] = useState<QuestionDraft[]>(initialQuestions);

  const addQuestion = () => {
    if (questions.length >= 10) return;
    setQuestions([...questions, { question: "", answers: [{ text: "", is_correct: true }, { text: "", is_correct: false }] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateAnswer = (qIndex: number, aIndex: number, field: string, value: string | boolean) => {
    const updated = [...questions];
    const answers = [...updated[qIndex].answers];
    if (field === "is_correct" && value === true) {
      answers.forEach((a, i) => { answers[i] = { ...a, is_correct: i === aIndex }; });
    } else {
      answers[aIndex] = { ...answers[aIndex], [field]: value };
    }
    updated[qIndex] = { ...updated[qIndex], answers };
    setQuestions(updated);
  };

  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ text: "", is_correct: false });
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("questions", JSON.stringify(questions.filter((q) => q.question.trim())));

    const opensAtStr = formData.get("opens_at") as string;
    if (opensAtStr) formData.set("opens_at", new Date(opensAtStr).toISOString());

    const closesAtStr = formData.get("closes_at") as string;
    if (closesAtStr) formData.set("closes_at", new Date(closesAtStr).toISOString());

    const result = await saveQuizAction(formData);
    if (result.success) {
      router.push("/admin/quizzes");
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ");
      setLoading(false);
    }
  };

  const toLocalISOString = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const opensAtDefault = toLocalISOString(existing?.opens_at);
  const closesAtDefault = toLocalISOString(existing?.closes_at);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-kufi bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {existing && <input type="hidden" name="id" value={existing.id} />}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الليلة</label>
          <select
            name="night_id"
            defaultValue={existing?.night_id}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-karbala-gold focus:border-karbala-gold"
          >
            <option value="">-- اختر ليلة --</option>
            {nights.map((n) => (
              <option key={n.id} value={n.id}>الليلة {n.number}: {n.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الاختبار (اختياري)</label>
          <input type="text" name="title" defaultValue={existing?.title || ""} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ ووقت الفتح</label>
          <input type="datetime-local" name="opens_at" defaultValue={opensAtDefault} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ ووقت الإغلاق</label>
          <input type="datetime-local" name="closes_at" defaultValue={closesAtDefault} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">مدة الاختبار (بالدقائق)</label>
          <input type="number" name="duration_minutes" defaultValue={existing?.duration_minutes || ""} min="1" className="w-full px-3 py-2 border rounded-md" placeholder="مثال: 15" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رسالة تحفيزية (اختياري)</label>
          <input type="text" name="motivational_message" defaultValue={existing?.motivational_message || ""} className="w-full px-3 py-2 border rounded-md" placeholder="تُعرض بعد إرسال الإجابات" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="is_enabled" defaultChecked={existing?.is_enabled ?? false} className="w-4 h-4 text-karbala-gold focus:ring-karbala-gold" />
        <span className="text-sm text-gray-700">تفعيل الاختبار</span>
      </label>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-scheherazade text-lg text-karbala-gold">الأسئلة ({questions.length}/10)</h3>
          <button
            type="button"
            onClick={addQuestion}
            disabled={questions.length >= 10}
            className="text-sm text-karbala-gold hover:underline disabled:opacity-50"
          >
            + إضافة سؤال
          </button>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
              <label className="text-sm font-medium text-gray-700">سؤال {qIndex + 1}</label>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm hover:underline">
                  حذف
                </button>
              )}
            </div>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
              placeholder="نص السؤال"
            />

            <div className="space-y-2">
              {q.answers.map((a, aIndex) => (
                <div key={aIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={a.is_correct}
                    onChange={() => updateAnswer(qIndex, aIndex, "is_correct", true)}
                    className="text-karbala-gold focus:ring-karbala-gold"
                  />
                  <input
                    type="text"
                    value={a.text}
                    onChange={(e) => updateAnswer(qIndex, aIndex, "text", e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    placeholder={`خيار ${aIndex + 1}`}
                  />
                </div>
              ))}
              <button type="button" onClick={() => addAnswer(qIndex)} className="text-sm text-gray-500 hover:underline">
                + إضافة خيار
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-6 bg-karbala-gold text-white rounded-md hover:bg-karbala-gold-dark transition-colors disabled:opacity-70"
        >
          {loading ? "جاري الحفظ..." : existing ? "حفظ التعديلات" : "إنشاء الاختبار"}
        </button>
      </div>
    </form>
  );
}
