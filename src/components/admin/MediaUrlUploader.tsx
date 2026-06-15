"use client";

import React, { useRef, useState } from "react";
import { uploadMediaFromBrowser } from "@/lib/media/client-upload";

interface MediaUrlUploaderProps {
  label: string;
  name: string;
  urlFieldName: string;
  folder: string;
  accept: string;
  description?: string;
  currentUrl?: string | null;
  onUploaded?: (url: string) => void;
}

export function MediaUrlUploader({
  label,
  name,
  urlFieldName,
  folder,
  accept,
  description,
  currentUrl,
  onUploaded,
}: MediaUrlUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeUrl = uploadedUrl || currentUrl || "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setFileName(file.name);

    const { url, error: uploadError } = await uploadMediaFromBrowser(file, folder);

    if (uploadError || !url) {
      setError(uploadError || "فشل رفع الملف");
      setUploadedUrl(null);
      setUploading(false);
      return;
    }

    setUploadedUrl(url);
    onUploaded?.(url);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {activeUrl && (
        <p className="text-xs text-green-700 mb-2 break-all">
          ✓ جاهز للحفظ: {activeUrl}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer ${
          uploading
            ? "border-karbala-gold bg-yellow-50 opacity-70"
            : fileName || activeUrl
              ? "border-karbala-gold bg-yellow-50"
              : "border-gray-300 hover:border-karbala-gold bg-gray-50"
        }`}
      >
        <div className="space-y-1 text-center">
          {uploading ? (
            <p className="text-sm text-karbala-gold">جاري الرفع...</p>
          ) : fileName ? (
            <>
              <svg className="mx-auto h-12 w-12 text-karbala-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-900 font-medium mt-2">تم الرفع: {fileName}</p>
              <span className="text-xs text-karbala-gold-dark block">انقر لتغيير الملف</span>
            </>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-karbala-gold font-medium">انقر لاختيار ملف</span>
              {description && <p className="text-xs text-gray-500">{description}</p>}
            </>
          )}
        </div>
      </div>

      {/* Hidden: URL passed to server action on save */}
      <input type="hidden" name={urlFieldName} value={uploadedUrl || ""} />

      {/* Keep file input for accessibility; upload happens on select */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
