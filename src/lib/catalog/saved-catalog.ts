import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  publicObjectUrl,
  STORAGE_BUCKETS,
  type StorageBucket,
} from "@/lib/supabase/storage";
import {
  DEFAULT_COURSE_BADGE_ICON,
  DEFAULT_EVENT_BADGE_ICON,
} from "@/components/cards/badge-chip-style";
import type { CatalogRow } from "@/lib/catalog/card-mappers";

type MediaJoin = { bucket: string; path: string } | null;

function asMediaJoin(value: unknown): MediaJoin {
  if (!value) return null;
  if (Array.isArray(value)) {
    const first = value[0] as { bucket?: string; path?: string } | undefined;
    if (!first?.path) return null;
    return { bucket: first.bucket || "", path: first.path };
  }
  const row = value as { bucket?: string; path?: string };
  if (!row.path) return null;
  return { bucket: row.bucket || "", path: row.path };
}

function resolveMedia(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  media: MediaJoin,
  fallback: string,
): string {
  if (!media?.path) return fallback;
  const bucket = (media.bucket || STORAGE_BUCKETS.media) as StorageBucket;
  return publicObjectUrl(supabase, bucket, media.path) || fallback;
}

const COURSE_MEDIA_SELECT =
  "*, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path)";

const EVENT_MEDIA_SELECT =
  "*, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path)";

export async function hydrateCourseRowForSave(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  row: Record<string, unknown>,
): Promise<CatalogRow> {
  let hydrated = row;
  if (!row.image_asset && !row.badge_icon_asset) {
    const { data } = await supabase
      .from("courses")
      .select(COURSE_MEDIA_SELECT)
      .eq("id", row.id)
      .maybeSingle();
    if (data) hydrated = data as Record<string, unknown>;
  }
  return {
    ...hydrated,
    image_url: resolveMedia(
      supabase,
      asMediaJoin(hydrated.image_asset),
      "/assets/img/saved_4.jpg",
    ),
    badge_icon_url: resolveMedia(
      supabase,
      asMediaJoin(hydrated.badge_icon_asset),
      DEFAULT_COURSE_BADGE_ICON,
    ),
  };
}

export async function hydrateEventRowForSave(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  row: Record<string, unknown>,
): Promise<CatalogRow> {
  let hydrated = row;
  if (!row.image_asset && !row.badge_icon_asset) {
    const { data } = await supabase
      .from("events")
      .select(EVENT_MEDIA_SELECT)
      .eq("id", row.id)
      .maybeSingle();
    if (data) hydrated = data as Record<string, unknown>;
  }
  return {
    ...hydrated,
    image_url: resolveMedia(
      supabase,
      asMediaJoin(hydrated.image_asset),
      "/assets/img/saved_1.jpg",
    ),
    badge_icon_url: resolveMedia(
      supabase,
      asMediaJoin(hydrated.badge_icon_asset),
      DEFAULT_EVENT_BADGE_ICON,
    ),
  };
}

export { mapRowToSavedCard } from "@/lib/catalog/card-mappers";
