import React from "react";
import { MajlisForm } from "@/components/admin/forms/MajlisForm";

export const metadata = { title: "إضافة مجلس | لوحة التحكم" };

export default function NewMajlisPage() {
  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade text-karbala-gold">
        إضافة مجلس جديد
      </h1>
      <MajlisForm />
    </div>
  );
}
