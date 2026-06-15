import { uploadFileToStorage } from "@/lib/storage";

/** Read a pre-uploaded media URL from a hidden form field */
export function getMediaUrlFromForm(
  formData: FormData,
  urlField: string
): string | null {
  const value = formData.get(urlField);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Resolve media URL: prefer client-preuploaded URL, fallback to server-side file upload.
 */
export async function resolveMediaUrl(
  formData: FormData,
  options: {
    urlField: string;
    fileField: string;
    folder: string;
  }
): Promise<{ url: string | null; error: string | null }> {
  const preUploaded = getMediaUrlFromForm(formData, options.urlField);
  if (preUploaded) {
    return { url: preUploaded, error: null };
  }

  const fileValue = formData.get(options.fileField);
  if (fileValue instanceof File && fileValue.size > 0) {
    return uploadFileToStorage(fileValue, options.folder);
  }

  return { url: null, error: null };
}
