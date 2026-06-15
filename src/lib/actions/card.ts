"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidateNightById, revalidatePublicSite } from "@/lib/revalidate";
import type { CardType, CardImagePosition } from "@/types/database";

export async function createCardAction(formData: FormData) {
  const type = formData.get("type") as CardType;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const seo_description = formData.get("seo_description") as string;
  const night_id = (formData.get("night_id") as string) || null;
  const status = formData.get("status") as "draft" | "published";
  const featured = formData.get("featured") === "true";
  const downloadable = formData.get("downloadable") === "true";
  const image_position = (formData.get("image_position") as CardImagePosition) || "top";
  const slug = `${type}-${Date.now()}`;

  try {
    const { url: image, error: uploadError } = await resolveMediaUrl(formData, {
      urlField: "image_url",
      fileField: "image",
      folder: "cards",
    });

    if (uploadError) {
      return { success: false, error: `فشل رفع الصورة: ${uploadError}` };
    }

    const supabase = await createActionClient();
    const { data, error } = await supabase
      .from("cards")
      .insert({
        type,
        title,
        content,
        seo_description,
        night_id: night_id || null,
        status,
        featured,
        downloadable,
        slug,
        image,
        image_position,
        sort_order: 1,
      })
      .select("id, image")
      .single();

    if (error) throw error;
    if (!data) throw new Error("فشل حفظ البطاقة في قاعدة البيانات");

    revalidatePath("/admin/cards");
    revalidatePath("/karbala/cards");
    await revalidateNightById(night_id);
    await revalidatePublicSite();

    return { success: true };
  } catch (error: any) {
    console.error("Error creating card:", error);
    return { success: false, error: error.message };
  }
}

export async function updateCardAction(formData: FormData) {
  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const type = formData.get("type") as CardType;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const seo_description = formData.get("seo_description") as string;
  const night_id = (formData.get("night_id") as string) || null;
  const status = formData.get("status") as "draft" | "published";
  const featured = formData.get("featured") === "true";
  const downloadable = formData.get("downloadable") === "true";
  const image_position = (formData.get("image_position") as CardImagePosition) || "top";

  try {
    const { url: image, error: uploadError } = await resolveMediaUrl(formData, {
      urlField: "image_url",
      fileField: "image",
      folder: "cards",
    });

    if (uploadError) {
      return { success: false, error: `فشل رفع الصورة: ${uploadError}` };
    }

    const updateData: Record<string, unknown> = {
      type,
      title,
      content,
      seo_description,
      night_id: night_id || null,
      status,
      featured,
      downloadable,
      image_position,
      updated_at: new Date().toISOString(),
    };

    if (image) updateData.image = image;

    const supabase = await createActionClient();
    const { error } = await persistRowUpdate(supabase, "cards", id, updateData, "id, image");

    if (error) {
      return { success: false, error };
    }

    revalidatePath("/admin/cards");
    revalidatePath("/karbala/cards");
    revalidatePath(`/karbala/cards/${slug}`);
    await revalidateNightById(night_id);
    await revalidatePublicSite();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
