"use server";

import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function updateNightMediaAction(formData: FormData) {
  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const video_url = (formData.get("video_url") as string) || null;
  const show_audio = formData.get("show_audio") === "true";
  const show_video = formData.get("show_video") === "true";

  const [coverResult, audioResult, pdfResult, videoResult] = await Promise.all([
    resolveMediaUrl(formData, {
      urlField: "cover_image_url",
      fileField: "cover_image",
      folder: "nights/covers",
    }),
    resolveMediaUrl(formData, {
      urlField: "audio_url",
      fileField: "audio_file",
      folder: "nights/audio",
    }),
    resolveMediaUrl(formData, {
      urlField: "pdf_file_url",
      fileField: "pdf_file",
      folder: "nights/pdfs",
    }),
    resolveMediaUrl(formData, {
      urlField: "video_file_url",
      fileField: "video_file",
      folder: "nights/video",
    }),
  ]);

  if (coverResult.error) {
    return { success: false, error: `فشل رفع صورة الغلاف: ${coverResult.error}` };
  }
  if (audioResult.error) {
    return { success: false, error: `فشل رفع الملف الصوتي: ${audioResult.error}` };
  }
  if (pdfResult.error) {
    return { success: false, error: `فشل رفع ملف PDF: ${pdfResult.error}` };
  }
  if (videoResult.error) {
    return { success: false, error: `فشل رفع ملف الفيديو: ${videoResult.error}` };
  }

  const updateData: Record<string, unknown> = {
    video_url: video_url || null,
    show_audio,
    show_video,
    updated_at: new Date().toISOString(),
  };

  if (coverResult.url) updateData.cover_image = coverResult.url;
  if (audioResult.url) updateData.audio_file = audioResult.url;
  if (pdfResult.url) updateData.pdf_file = pdfResult.url;
  if (videoResult.url) updateData.video_file = videoResult.url;

  const supabase = await createActionClient();
  const { error } = await persistRowUpdate(
    supabase,
    "nights",
    id,
    updateData,
    "id, cover_image, audio_file, pdf_file, video_file, video_url"
  );

  if (error) {
    return { success: false, error };
  }

  revalidatePath("/admin/nights");
  revalidatePath(`/karbala/night/${slug}`);
  revalidatePath(`/karbala/night/${slug}/quiz`);
  await revalidatePublicSite();

  return { success: true };
}
