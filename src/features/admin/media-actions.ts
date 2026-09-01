"use server";

import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  publicObjectUrl,
  STORAGE_BUCKETS,
  type StorageBucket,
} from "@/lib/supabase/storage";

async function requireMediaStaff() {
  const actor = await resolveActorContext();
  const ok =
    actor.staff &&
    (staffHasPermission(actor.staff, "catalog.manage") ||
      staffHasPermission(actor.staff, "content.manage") ||
      staffHasPermission(actor.staff, "cms.publish") ||
      staffHasPermission(actor.staff, "student_workspace.manage") ||
      staffHasPermission(actor.staff, "student_workspace.manage_all") ||
      staffHasPermission(actor.staff, "students.manage"));
  if (!ok) throw new Error("Forbidden");
  return actor;
}

export type MediaAssetPreview = {
  id: string;
  publicUrl: string;
  mimeType: string;
  path: string;
  bucket: string;
};

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_BYTES = 20 * 1024 * 1024;

function assertSafeMediaPath(raw: string): string {
  const path = raw.replace(/^\/+/, "").trim();
  if (
    !path ||
    path.includes("..") ||
    path.includes("\\") ||
    path.includes("\0") ||
    !/^[a-zA-Z0-9][a-zA-Z0-9/_-]*\.[a-z0-9]{2,5}$/.test(path)
  ) {
    throw new Error("Invalid media path.");
  }
  return path;
}

/**
 * Registers a file already uploaded to the public `media` bucket by the
 * browser client. Does not accept file bytes (avoids Next body-size limits).
 */
export async function registerCmsMediaAsset(input: {
  path: string;
  mimeType: string;
  byteSize: number;
  altText?: string;
}): Promise<MediaAssetPreview> {
  const actor = await requireMediaStaff();
  const path = assertSafeMediaPath(input.path);
  const mimeType = String(input.mimeType || "").trim().toLowerCase();
  const byteSize = Number(input.byteSize);

  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error("Unsupported file type.");
  }
  if (!Number.isFinite(byteSize) || byteSize <= 0 || byteSize > MAX_BYTES) {
    throw new Error("Invalid file size.");
  }

  const supabase = await createSupabaseServerClient();
  const bucket = STORAGE_BUCKETS.media;

  const slash = path.lastIndexOf("/");
  const dir = slash >= 0 ? path.slice(0, slash) : "";
  const fileName = slash >= 0 ? path.slice(slash + 1) : path;
  const { data: listed, error: listError } = await supabase.storage
    .from(bucket)
    .list(dir || undefined, { search: fileName, limit: 20 });

  if (listError) throw new Error(listError.message);
  if (!listed?.some((obj) => obj.name === fileName)) {
    throw new Error("Uploaded file not found in storage.");
  }

  const altText = String(input.altText || "").slice(0, 200);
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      bucket,
      path,
      alt_text: altText,
      mime_type: mimeType,
      byte_size: Math.round(byteSize),
      created_by: actor.userId,
    })
    .select("id, bucket, path, mime_type")
    .single();

  if (error) throw new Error(error.message);

  const publicUrl = publicObjectUrl(supabase, bucket, path) ?? "";

  return {
    id: data.id as string,
    publicUrl,
    mimeType: String(data.mime_type ?? mimeType),
    path: String(data.path),
    bucket: String(data.bucket),
  };
}

export async function getMediaAssetPreview(
  id: string | null | undefined,
): Promise<MediaAssetPreview | null> {
  if (!id) return null;
  await requireMediaStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, bucket, path, mime_type")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const bucket = (data.bucket || STORAGE_BUCKETS.media) as StorageBucket;
  const publicUrl =
    publicObjectUrl(supabase, bucket, data.path as string) ?? "";

  return {
    id: data.id as string,
    publicUrl,
    mimeType: String(data.mime_type ?? ""),
    path: String(data.path),
    bucket: String(data.bucket),
  };
}
