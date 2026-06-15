"use client";

import { supabase } from "@/lib/supabase/client";
import type { UploadResult } from "@/lib/storage";

export async function uploadMediaFromBrowser(
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { url: null, error: null };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filename, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(filename);
  return { url: urlData.publicUrl, error: null };
}
