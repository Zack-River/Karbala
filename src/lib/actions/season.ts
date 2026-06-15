"use server";

import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function saveSeasonAction(formData: FormData) {
  const id = (formData.get("id") as string) || null;
  const title = formData.get("title") as string;
  const subtitle = (formData.get("subtitle") as string) || null;
  const intro = (formData.get("intro") as string) || null;
  const is_active = formData.get("is_active") === "true";

  const [heroResult, logoResult] = await Promise.all([
    resolveMediaUrl(formData, {
      urlField: "hero_image_url",
      fileField: "hero_image",
      folder: "season/hero",
    }),
    resolveMediaUrl(formData, {
      urlField: "logo_image_url",
      fileField: "logo_image",
      folder: "season/logo",
    }),
  ]);

  if (heroResult.error) {
    return { success: false, error: `فشل رفع صورة الغلاف: ${heroResult.error}` };
  }
  if (logoResult.error) {
    return { success: false, error: `فشل رفع الشعار: ${logoResult.error}` };
  }

  const updateData: Record<string, unknown> = {
    title,
    subtitle,
    intro,
    is_active,
    updated_at: new Date().toISOString(),
  };

  if (heroResult.url) updateData.hero_image = heroResult.url;
  if (logoResult.url) updateData.logo_image = logoResult.url;

  const supabase = await createActionClient();

  if (id) {
    const { data, error } = await persistRowUpdate(
      supabase,
      "seasons",
      id,
      updateData,
      "id, hero_image, logo_image, title"
    );

    if (error) {
      return { success: false, error };
    }

    revalidatePath("/admin/season");
    await revalidatePublicSite();

    return { success: true, data };
  }

  const { data, error } = await supabase
    .from("seasons")
    .insert(updateData)
    .select("id, hero_image, logo_image, title")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "فشل حفظ الموسم في قاعدة البيانات" };
  }

  revalidatePath("/admin/season");
  await revalidatePublicSite();

  return { success: true, data };
}
