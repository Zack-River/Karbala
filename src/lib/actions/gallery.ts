"use server";

import { createActionClient } from "@/lib/supabase/action";
import { resolveMediaUrl } from "@/lib/media/form-data";
import { revalidatePath } from "next/cache";
import { revalidatePublicSite } from "@/lib/revalidate";

export async function uploadGalleryImageAction(formData: FormData) {
  const alt_text = formData.get("alt_text") as string;
  const sort_order_str = formData.get("sort_order") as string;
  const sort_order = parseInt(sort_order_str, 10) || 0;

  // Upload image to the 'gallery' bucket
  const imageResult = await resolveMediaUrl(formData, {
    urlField: "image_url_hidden", // not used here as we don't have preuploaded for new
    fileField: "image_file",
    folder: "gallery",
  });

  if (imageResult.error) {
    return { success: false, error: `فشل رفع الصورة: ${imageResult.error}` };
  }

  if (!imageResult.url) {
    return { success: false, error: "لم يتم العثور على صورة لرفعها." };
  }

  const supabase = await createActionClient();

  const { error } = await supabase.from("gallery_images").insert({
    image_url: imageResult.url,
    alt_text: alt_text || null,
    sort_order,
  });

  if (error) {
    return { success: false, error: `فشل حفظ البيانات في القاعدة: ${error.message}` };
  }

  // Revalidate gallery pages
  revalidatePath("/admin/gallery");
  revalidatePath("/karbala/gallery");
  await revalidatePublicSite();

  return { success: true };
}

export async function deleteGalleryImageAction(formData: FormData) {
  const id = formData.get("id") as string;
  const image_url = formData.get("image_url") as string;

  if (!id) {
    return { success: false, error: "معرف الصورة مفقود" };
  }

  const supabase = await createActionClient();

  // If there's an image_url, extract the file path to delete from storage
  if (image_url) {
    // The url looks like: https://.../storage/v1/object/public/gallery/path/to/file.jpg
    const match = image_url.match(/\/storage\/v1\/object\/public\/gallery\/(.+)$/);
    if (match && match[1]) {
      const filePath = match[1];
      const { error: storageError } = await supabase.storage.from("gallery").remove([filePath]);
      if (storageError) {
        console.error("Failed to delete image from storage:", storageError);
        // We continue to delete the DB row even if storage delete fails
      }
    }
  }

  // Delete from database
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) {
    return { success: false, error: `فشل الحذف من القاعدة: ${error.message}` };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/karbala/gallery");
  await revalidatePublicSite();

  return { success: true };
}

export async function swapGalleryImagesAction(formData: FormData) {
  const id1 = formData.get("id1") as string;
  const order1Str = formData.get("order1") as string;
  const id2 = formData.get("id2") as string;
  const order2Str = formData.get("order2") as string;

  if (!id1 || !id2) return { success: false, error: "معرفات الصور مفقودة" };

  const order1 = parseInt(order1Str, 10);
  const order2 = parseInt(order2Str, 10);

  const supabase = await createActionClient();

  // Try using the RPC transaction first
  const { error: rpcError } = await supabase.rpc("swap_gallery_image_orders", {
    p_id1: id1,
    p_id2: id2,
    p_order1: order1,
    p_order2: order2,
  });

  if (rpcError) {
    // If the function doesn't exist (e.g. migration not run yet), fallback to separate updates
    if (rpcError.code === "42883" || rpcError.message?.includes("function does not exist")) {
      const { error: error1 } = await supabase.from("gallery_images").update({ sort_order: order2 }).eq("id", id1);
      if (error1) return { success: false, error: "فشل تحديث ترتيب الصورة الأولى" };
      
      const { error: error2 } = await supabase.from("gallery_images").update({ sort_order: order1 }).eq("id", id2);
      if (error2) return { success: false, error: "فشل تحديث ترتيب الصورة الثانية" };
    } else {
      return { success: false, error: "فشل تبديل الصور في قاعدة البيانات" };
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/karbala/gallery");
  await revalidatePublicSite();

  return { success: true };
}
