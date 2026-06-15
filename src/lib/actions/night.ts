"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function createNightAction(formData: FormData) {
  const number = parseInt(formData.get("number") as string);
  const title = formData.get("title") as string;
  const short_description = formData.get("short_description") as string;
  const teaser = formData.get("teaser") as string;
  const central_idea = formData.get("central_idea") as string;
  const why_important = formData.get("why_important") as string;
  const status = formData.get("status") as "draft" | "published";

  const topicsJson = formData.get("topics") as string;
  const versesJson = formData.get("verses") as string;
  const narrationsJson = formData.get("narrations") as string;

  try {
    const supabase = await createActionClient();

    const { data: season } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    if (!season) {
      return { success: false, error: "No active season found. Please create a season first." };
    }

    const [coverResult, audioResult, pdfResult] = await Promise.all([
      resolveMediaUrl(formData, {
        urlField: "cover_image_url",
        fileField: "cover_image",
        folder: "nights/covers",
      }),
      resolveMediaUrl(formData, {
        urlField: "audio_file_url",
        fileField: "audio_file",
        folder: "nights/audio",
      }),
      resolveMediaUrl(formData, {
        urlField: "pdf_file_url",
        fileField: "pdf_file",
        folder: "nights/pdfs",
      }),
    ]);

    const uploadErrors = [
      coverResult.error && `الغلاف: ${coverResult.error}`,
      audioResult.error && `الصوت: ${audioResult.error}`,
      pdfResult.error && `PDF: ${pdfResult.error}`,
    ].filter(Boolean);

    if (uploadErrors.length > 0) {
      return { success: false, error: `فشل رفع الملفات — ${uploadErrors.join(" | ")}` };
    }

    const { data: night, error: nightError } = await supabase
      .from("nights")
      .insert({
        season_id: season.id,
        number,
        title,
        short_description,
        teaser,
        central_idea,
        why_important,
        status,
        slug: `night-${number}`,
        cover_image: coverResult.url,
        audio_file: audioResult.url,
        pdf_file: pdfResult.url,
      })
      .select("id, cover_image, audio_file, pdf_file")
      .single();

    if (nightError) throw nightError;
    if (!night) throw new Error("فشل حفظ الليلة في قاعدة البيانات");

    const nightId = night.id;

    if (topicsJson) {
      const topics = JSON.parse(topicsJson);
      if (topics.length > 0) {
        const topicsToInsert = topics.map((t: any, i: number) => ({
          night_id: nightId,
          title: t.title,
          content: t.content,
          sort_order: i + 1,
        }));
        const { error } = await supabase.from("topics").insert(topicsToInsert);
        if (error) throw error;
      }
    }

    if (versesJson) {
      const verses = JSON.parse(versesJson);
      if (verses.length > 0) {
        const versesToInsert = verses.map((v: any, i: number) => ({
          night_id: nightId,
          content: v.content,
          surah_name: v.surah_name,
          verse_number: v.verse_number,
          sort_order: i + 1,
        }));
        const { error } = await supabase.from("verses").insert(versesToInsert);
        if (error) throw error;
      }
    }

    if (narrationsJson) {
      const narrations = JSON.parse(narrationsJson);
      if (narrations.length > 0) {
        const narrationsToInsert = narrations.map((n: any, i: number) => ({
          night_id: nightId,
          content: n.content,
          source: n.source,
          sort_order: i + 1,
        }));
        const { error } = await supabase.from("narrations").insert(narrationsToInsert);
        if (error) throw error;
      }
    }

    revalidatePath("/admin/nights");
    revalidatePath(`/karbala/night/night-${number}`);
    await revalidatePublicSite();

    return { success: true, nightId };
  } catch (error: any) {
    console.error("Error creating night:", error);
    return { success: false, error: error.message };
  }
}
