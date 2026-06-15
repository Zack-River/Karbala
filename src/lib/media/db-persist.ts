import type { SupabaseClient } from "@supabase/supabase-js";

export async function persistRowUpdate(
  supabase: SupabaseClient,
  table: string,
  id: string,
  updateData: Record<string, unknown>,
  select = "id"
): Promise<{ data: Record<string, unknown> | null; error: string | null }> {
  const { data, error } = await supabase
    .from(table)
    .update(updateData)
    .eq("id", id)
    .select(select)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return {
      data: null,
      error: "لم يتم العثور على السجل أو فشل الحفظ — تحقق من الصلاحيات",
    };
  }

  return { data: data as unknown as Record<string, unknown>, error: null };
}
