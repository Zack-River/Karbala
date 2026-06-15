import React from "react";
import { GalleryUploadForm } from "@/components/admin/forms/GalleryUploadForm";
import { createAuthenticatedServerClient } from "@/lib/supabase/server";
import { deleteGalleryImageAction, swapGalleryImagesAction } from "@/lib/actions/gallery";
import Image from "next/image";
import { DeleteImageButton } from "@/components/admin/gallery/DeleteImageButton";

export const metadata = {
  title: "إدارة معرض الصور | لوحة التحكم",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = await createAuthenticatedServerClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto font-kufi">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-scheherazade mb-2">إدارة معرض الصور</h1>
        <p className="text-gray-600">
          يمكنك رفع صور جديدة لمعرض الصور ليتم عرضها للزوار في صفحة المعرض العام.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <GalleryUploadForm />
        </div>

        {/* Existing Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-scheherazade">
              الصور الحالية ({images?.length || 0})
            </h2>
            
            {images && images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || "صورة في المعرض"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <span className="text-white text-xs px-2 text-center truncate w-full">
                        {img.alt_text || "بدون وصف"}
                      </span>
                      <span className="text-white text-xs bg-black/50 px-2 py-1 rounded-full mb-2">
                        ترتيب: {img.sort_order}
                      </span>
                      
                      <div className="flex gap-2 mb-2">
                        {index > 0 && (
                          <form action={async (formData) => { "use server"; await swapGalleryImagesAction(formData); }}>
                            <input type="hidden" name="id1" value={img.id} />
                            <input type="hidden" name="order1" value={img.sort_order} />
                            <input type="hidden" name="id2" value={images[index - 1].id} />
                            <input type="hidden" name="order2" value={images[index - 1].sort_order} />
                            <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white rounded p-1" title="تحريك للأمام (يمين)">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          </form>
                        )}
                        {index < images.length - 1 && (
                          <form action={async (formData) => { "use server"; await swapGalleryImagesAction(formData); }}>
                            <input type="hidden" name="id1" value={img.id} />
                            <input type="hidden" name="order1" value={img.sort_order} />
                            <input type="hidden" name="id2" value={images[index + 1].id} />
                            <input type="hidden" name="order2" value={images[index + 1].sort_order} />
                            <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white rounded p-1" title="تحريك للخلف (يسار)">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                              </svg>
                            </button>
                          </form>
                        )}
                      </div>

                      <form action={async (formData) => { "use server"; await deleteGalleryImageAction(formData); }}>
                        <input type="hidden" name="id" value={img.id} />
                        <input type="hidden" name="image_url" value={img.image_url} />
                        <DeleteImageButton />
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                لا توجد صور في المعرض حالياً.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
