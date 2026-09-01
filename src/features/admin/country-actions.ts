"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicObjectUrl, STORAGE_BUCKETS, type StorageBucket } from "@/lib/supabase/storage";
import {
  COUNTRY_SLUGS,
  getCountryContent,
  mapCatalogRowToShortTermCourse,
  type CountryPageContent,
  type ShortTermCourse,
} from "@/features/countries/content";

const WRITABLE_KEYS = [
  "name",
  "slug",
  "iso_code",
  "dial_code",
  "published",
  "display_order",
  "page_content",
] as const;

async function requireCountryStaff() {
  const actor = await resolveActorContext();
  const ok =
    actor.staff &&
    (staffHasPermission(actor.staff, "content.manage") ||
      staffHasPermission(actor.staff, "catalog.manage") ||
      staffHasPermission(actor.staff, "cms.publish"));
  if (!ok) throw new Error("Forbidden");
  return actor;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickWritable(payload: Record<string, unknown>) {
  const next: Record<string, unknown> = {};
  for (const key of WRITABLE_KEYS) {
    if (!(key in payload)) continue;
    let value = payload[key];
    if (key === "display_order") {
      value =
        value === "" || value === null || value === undefined
          ? 0
          : Number(value);
    } else if (key === "published") {
      value = Boolean(value);
    } else if ((key === "iso_code" || key === "dial_code") && value === "") {
      value = null;
    }
    next[key] = value;
  }
  return next;
}

async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  slug: string,
  excludeId?: number | null,
) {
  const candidate = slugify(slug) || "country";
  let suffix = 0;
  for (;;) {
    const test = suffix > 0 ? `${candidate}-${suffix}` : candidate;
    let query = supabase.from("countries").select("id").eq("slug", test);
    if (excludeId != null) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return test;
    suffix += 1;
  }
}

/** Upsert seed rows for known country slugs when page_content is missing. */
export async function ensureCountrySeeds() {
  await requireCountryStaff();
  const supabase = await createSupabaseServerClient();

  for (let i = 0; i < COUNTRY_SLUGS.length; i += 1) {
    const slug = COUNTRY_SLUGS[i];
    const content = getCountryContent(slug);
    if (!content) continue;

    const { data: existing } = await supabase
      .from("countries")
      .select("id, page_content")
      .eq("slug", slug)
      .maybeSingle();

    if (existing?.page_content) continue;

    const row = {
      name: content.name,
      slug,
      published: slug === "usa",
      display_order: i,
      page_content: content as unknown as Record<string, unknown>,
    };

    if (existing?.id) {
      await supabase
        .from("countries")
        .update({ page_content: row.page_content })
        .eq("id", existing.id);
    } else {
      await supabase.from("countries").insert(row);
    }
  }
}

export async function listCountryRows() {
  await requireCountryStaff();
  await ensureCountrySeeds();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("countries")
    .select("id, name, slug, iso_code, dial_code, published, display_order, page_content, cms_draft")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...row,
    hasDraft: Boolean(row.cms_draft),
  }));
}

export async function upsertCountryRow(
  payload: Record<string, unknown>,
  options?: { mode?: "draft" | "publish" },
) {
  await requireCountryStaff();
  const supabase = await createSupabaseServerClient();
  const id = payload.id != null ? Number(payload.id) : null;
  const rest = pickWritable(payload);
  const mode = options?.mode ?? "draft";

  let currentlyPublished = false;
  if (id != null) {
    const { data: existing, error: existingError } = await supabase
      .from("countries")
      .select("published")
      .eq("id", id)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    currentlyPublished = Boolean(existing?.published);
  }

  const draftBody: Record<string, unknown> = {
    ...rest,
    hero_flag_asset_id: payload.hero_flag_asset_id ?? null,
    hero_desktop_asset_id: payload.hero_desktop_asset_id ?? null,
    hero_mobile_asset_id: payload.hero_mobile_asset_id ?? null,
    hero_flag_url: payload.hero_flag_url ?? "",
    hero_desktop_url: payload.hero_desktop_url ?? "",
    hero_mobile_url: payload.hero_mobile_url ?? "",
  };
  if (id != null) draftBody.id = id;

  if (mode === "draft" && currentlyPublished && id != null) {
    const { error } = await supabase
      .from("countries")
      .update({ cms_draft: draftBody })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidateCountryPaths(String(rest.slug ?? payload.slug ?? ""));
    return { id, slug: String(rest.slug ?? ""), published: true, hasDraft: true };
  }

  const nameBase =
    typeof rest.name === "string" && rest.name.trim()
      ? rest.name.trim()
      : "Country";
  rest.slug = await ensureUniqueSlug(
    supabase,
    typeof rest.slug === "string" && rest.slug.trim()
      ? rest.slug
      : slugify(nameBase),
    id,
  );
  rest.published = mode === "publish";

  const rowWrite: Record<string, unknown> = {
    ...rest,
    cms_draft: null,
  };

  let entityId = id;
  if (id != null) {
    const { error } = await supabase.from("countries").update(rowWrite).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("countries")
      .insert(rowWrite)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id != null ? Number(data.id) : null;
  }

  revalidateCountryPaths(String(rest.slug));
  return {
    id: entityId,
    slug: String(rest.slug),
    published: Boolean(rest.published),
    hasDraft: false,
  };
}

export async function clearCountryDraft(id: number) {
  await requireCountryStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("countries")
    .update({ cms_draft: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/countries");
}

function revalidateCountryPaths(slug: string) {
  revalidatePath("/admin/countries");
  revalidatePath("/explorecountries");
  if (slug) {
    revalidatePath(`/countries/${slug}`);
  }
  revalidatePath("/countries", "layout");
}

export async function listCountryCoursePickerOptions(): Promise<
  ShortTermCourse[]
> {
  await requireCountryStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, duration, mode, badge, tags_text, image_asset:media_assets!image_asset_id(bucket, path)",
    )
    .order("title", { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => {
    const media = Array.isArray(row.image_asset)
      ? row.image_asset[0]
      : row.image_asset;
    const image =
      media && typeof media === "object" && "path" in media && media.path
        ? publicObjectUrl(
            supabase,
            ((media as { bucket?: string }).bucket ||
              STORAGE_BUCKETS.media) as StorageBucket,
            String((media as { path: string }).path),
          )
        : "";
    return mapCatalogRowToShortTermCourse({
      ...row,
      image: image || undefined,
    });
  });
}

export type CountryRow = {
  id: number;
  name: string;
  slug: string;
  iso_code: string | null;
  dial_code: string | null;
  published: boolean;
  display_order: number;
  page_content: CountryPageContent | null;
  cms_draft: Record<string, unknown> | null;
  hasDraft?: boolean;
};
