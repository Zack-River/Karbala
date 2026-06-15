"use server";

import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidateNightById, revalidatePublicSite } from "@/lib/revalidate";
import { redirect } from "next/navigation";

export async function createAttachmentAction(formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const night_id = formData.get("night_id") as string;
  const status = (formData.get("status") as string) || "published";

  if (!night_id) {
    return { success: false, error: "يجب اختيار الليلة التابعة للمرفق" };
  }

  const { url: file_url, error: uploadError } = await resolveMediaUrl(formData, {
    urlField: "file_url",
    fileField: "file",
    folder: "attachments",
  });

  if (uploadError) {
    return { success: false, error: `فشل رفع الملف: ${uploadError}` };
  }

  if (!file_url) {
    return { success: false, error: "يجب رفع ملف المرفق أولاً" };
  }

  const supabase = await createActionClient();
  const { data, error } = await supabase
    .from("attachments")
    .insert({
      title,
      file_url,
      type,
      night_id,
      status,
    })
    .select("id, file_url, night_id, status")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "فشل حفظ المرفق في قاعدة البيانات" };
  }

  revalidatePath("/admin/attachments");
  await revalidateNightById(night_id);
  await revalidatePublicSite();

  redirect("/admin/attachments");
}

export async function updateAttachmentAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const night_id = formData.get("night_id") as string;
  const status = (formData.get("status") as string) || "published";

  const file_url =
    (formData.get("file_url") as string)?.trim() ||
    (await resolveMediaUrl(formData, {
      urlField: "uploaded_file_url",
      fileField: "file",
      folder: "attachments",
    })).url;

  if (!night_id) {
    return { success: false, error: "يجب اختيار الليلة التابعة للمرفق" };
  }

  if (!file_url) {
    return { success: false, error: "رابط الملف مطلوب" };
  }

  const supabase = await createActionClient();
  const { error } = await persistRowUpdate(supabase, "attachments", id, {
    title,
    file_url,
    type,
    night_id,
    status,
    updated_at: new Date().toISOString(),
  }, "id, file_url, night_id, status");

  if (error) {
    return { success: false, error };
  }

  revalidatePath("/admin/attachments");
  await revalidateNightById(night_id);
  await revalidatePublicSite();

  redirect("/admin/attachments");
}
