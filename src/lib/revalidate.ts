"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function revalidateNightById(nightId: string | null | undefined) {
  if (!nightId) return;

  const supabase = createServerClient();
  const { data } = await supabase
    .from("nights")
    .select("slug")
    .eq("id", nightId)
    .single();

  if (data?.slug) {
    revalidatePath(`/karbala/night/${data.slug}`);
    revalidatePath(`/karbala/night/${data.slug}/quiz`);
  }
}

export async function revalidatePublicSite() {
  revalidatePath("/karbala");
  revalidatePath("/karbala/cards");
  revalidatePath("/karbala/majalis");
}
