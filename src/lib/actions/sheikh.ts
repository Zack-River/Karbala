"use server";

import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

const SHEIKH_PROFILE_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

export async function updateSheikhAction(formData: FormData) {
  const id = (formData.get("id") as string) || SHEIKH_PROFILE_ID;
  const name = formData.get("name") as string;
  const is_visible = formData.get("is_visible") === "true";

  const { url: image, error: uploadError } = await resolveMediaUrl(formData, {
    urlField: "image_url",
    fileField: "image",
    folder: "sheikh",
  });

  if (uploadError) {
    return { success: false, error: `فشل رفع الصورة: ${uploadError}` };
  }

  const rowData: Record<string, unknown> = {
    id,
    name,
    is_visible,
    image: image || "/sheikh-profile.jpg",
    updated_at: new Date().toISOString(),
  };

  const supabase = await createActionClient();

  const { data: existing } = await supabase
    .from("sheikh_profile")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existing) {
    const updateData: Record<string, unknown> = {
      name,
      is_visible,
      updated_at: new Date().toISOString(),
    };
    if (image) updateData.image = image;

    const { data, error } = await persistRowUpdate(
      supabase,
      "sheikh_profile",
      id,
      updateData,
      "id, image, name"
    );

    if (error) {
      return { success: false, error };
    }

    revalidatePath("/admin/sheikh");
    await revalidatePublicSite();

    return { success: true, image: data?.image as string | undefined };
  }

  const { data, error } = await supabase
    .from("sheikh_profile")
    .insert(rowData)
    .select("id, image, name")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "فشل إنشاء ملف الشيخ في قاعدة البيانات" };
  }

  revalidatePath("/admin/sheikh");
  await revalidatePublicSite();

  return { success: true, image: data.image as string | undefined };
}
