import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";

export type UploadResult = {
  url: string | null;
  error: string | null;
};

async function uploadWithClient(
  supabase: SupabaseClient,
  file: File,
  folder: string
): Promise<UploadResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(filename, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(filename);
  return { url: urlData.publicUrl, error: null };
}

export async function uploadFileToStorage(
  file: File,
  folder: string
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { url: null, error: null };
  }

  // 1) Try authenticated admin session (matches storage RLS: authenticated users)
  try {
    const authClient = await createAuthenticatedServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (user) {
      const result = await uploadWithClient(authClient, file, folder);
      if (!result.error) return result;
      console.error("Authenticated storage upload failed:", result.error);
    }
  } catch (err) {
    console.error("Authenticated client upload error:", err);
  }

  // 2) Fallback: service role (bypasses RLS when key is valid)
  try {
    const adminClient = createAdminClient();
    const result = await uploadWithClient(adminClient, file, folder);
    if (!result.error) return result;
    console.error("Service role storage upload failed:", result.error);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل رفع الملف";
    return { url: null, error: message };
  }
}
