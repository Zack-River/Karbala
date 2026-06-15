"use server";

import { createActionClient } from "@/lib/supabase/action";
import { persistRowUpdate } from "@/lib/media/db-persist";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function createMajlisAction(formData: FormData) {
  const supabase = await createActionClient();

  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || null;
  const location_description = (formData.get("location_description") as string) || null;
  const google_maps_url = formData.get("google_maps_url") as string;
  const is_enabled = formData.get("is_enabled") === "true";
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  try {
    const { error } = await supabase.from("majalis").insert({
      name,
      address,
      location_description,
      google_maps_url,
      is_enabled,
      sort_order,
    });
    if (error) throw error;

    revalidatePath("/admin/majalis");
    await revalidatePublicSite();
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return { success: false, error: message };
  }
}

export async function updateMajlisAction(formData: FormData) {
  const supabase = await createActionClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const address = (formData.get("address") as string) || null;
  const location_description = (formData.get("location_description") as string) || null;
  const google_maps_url = formData.get("google_maps_url") as string;
  const is_enabled = formData.get("is_enabled") === "true";
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  try {
    const { error } = await persistRowUpdate(supabase, "majalis", id, {
      name,
      address,
      location_description,
      google_maps_url,
      is_enabled,
      sort_order,
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(error);

    revalidatePath("/admin/majalis");
    await revalidatePublicSite();
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return { success: false, error: message };
  }
}

export async function deleteMajlisAction(id: string) {
  const supabase = await createActionClient();
  const { error } = await supabase.from("majalis").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/majalis");
  await revalidatePublicSite();
  return { success: true };
}

export async function toggleMajlisStatusAction(id: string, is_enabled: boolean) {
  const supabase = await createActionClient();
  const { error } = await persistRowUpdate(supabase, "majalis", id, {
    is_enabled,
    updated_at: new Date().toISOString(),
  });

  if (error) return { success: false, error };

  revalidatePath("/admin/majalis");
  await revalidatePublicSite();
  return { success: true };
}
