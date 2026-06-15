import React from "react";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { AttachmentForm } from "@/components/admin/forms/AttachmentForm";

export const metadata = { title: "إضافة مرفق جديد | لوحة التحكم" };

export default async function NewAttachmentPage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: nights } = await supabase
    .from("nights")
    .select("id, title")
    .order("number", { ascending: true });

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow-sm border border-gray-100 font-kufi">
      <h1 className="text-2xl font-bold mb-6 font-scheherazade text-karbala-gold">إضافة مرفق جديد</h1>
      <AttachmentForm nights={nights ?? []} />
    </div>
  );
}
