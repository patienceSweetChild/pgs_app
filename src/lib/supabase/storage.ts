import type { SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKETS = {
  avatars: "avatars",
  media: "media",
  studentDocuments: "student-documents",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionForMime(mime: string, fallbackName?: string): string {
  const fromName = fallbackName?.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

/** Resolve a stored path or absolute URL to a browser-usable URL. */
export function publicObjectUrl(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  pathOrUrl: string | null | undefined,
): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(pathOrUrl);
  return data.publicUrl || null;
}

export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<{ path: string; publicUrl: string }> {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Avatar must be a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Avatar must be 5 MB or smaller.");
  }

  const ext = extensionForMime(file.type, file.name);
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

export async function uploadMediaAsset(
  supabase: SupabaseClient,
  file: File,
  folder = "uploads",
): Promise<{ path: string; publicUrl: string; bucket: string }> {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const ext = extensionForMime(file.type, file.name);
  const path = `${safeFolder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.media)
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
      cacheControl: "86400",
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.media)
    .getPublicUrl(path);

  return { path, publicUrl: data.publicUrl, bucket: STORAGE_BUCKETS.media };
}

export async function uploadStudentDocument(
  supabase: SupabaseClient,
  studentId: string,
  requirementId: string,
  file: File,
  options?: { maxBytes?: number },
): Promise<{ path: string }> {
  const maxBytes = options?.maxBytes ?? 50 * 1024 * 1024;
  const allowed = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  if (!allowed.has(file.type)) {
    throw new Error("File must be PDF, JPG, PNG, or Word.");
  }
  if (file.size > maxBytes) {
    throw new Error(
      `File must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.`,
    );
  }
  const ext = extensionForMime(file.type, file.name);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const path = `${studentId}/${requirementId}/${Date.now()}-${safeName || `file.${ext}`}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.studentDocuments)
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(error.message);
  return { path };
}

export async function createStudentDocumentSignedUrl(
  supabase: SupabaseClient,
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.studentDocuments)
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
