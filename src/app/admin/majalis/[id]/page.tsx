import React from "react";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { MajlisForm } from "@/components/admin/forms/MajlisForm";
import { notFound } from "next/navigation";

export const metadata = { title: "تعديل مجلس | لوحة التحكم" };

export default async function EditMajlisPage({ params }: { params: { id: string } }) {
  const supabase = await createAuthenticatedServerClient();
  const { data: majlis } = await supabase.from("majalis").select("*").eq("id", params.id).single();

  if (!majlis) notFound();

  return (
    <div className="font-kufi">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-scheherazade text-karbala-gold">
        تعديل: {majlis.name}
      </h1>
      <MajlisForm existing={majlis} />
    </div>
  );
}
