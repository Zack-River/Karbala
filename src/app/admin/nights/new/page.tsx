import React from "react";
import { NightForm } from "@/components/admin/forms/NightForm";
import Link from "next/link";

export const metadata = {
  title: "إضافة ليلة جديدة | لوحة التحكم",
};

export default function NewNightPage() {
  return (
    <div className="max-w-5xl mx-auto font-kufi">
      <div className="mb-8">
        <Link href="/admin/nights" className="text-sm text-gray-500 hover:text-karbala-gold mb-4 inline-block">
          &rarr; العودة إلى قائمة الليالي
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 font-scheherazade">إضافة ليلة جديدة</h1>
        <p className="text-gray-500 mt-2">قم بإدخال بيانات الليلة، يمكنك إضافة المحاور، الشواهد، والروايات في الأسفل.</p>
      </div>

      <NightForm />
    </div>
  );
}
