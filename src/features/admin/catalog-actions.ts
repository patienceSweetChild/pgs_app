"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CatalogEntity = "courses" | "events" | "programs";
export type LifecyclePhase = "live" | "ended" | "archived";

/** Columns the admin CMS may write — must match the DB schema per entity. */
const WRITABLE_COLUMNS: Record<CatalogEntity, readonly string[]> = {
  courses: [
    "title",
    "slug",
    "short_description",
    "description",
    "duration",
    "mode",
    "published",
    "lifecycle_phase",
    "category_id",
    "featured",
    "starts_on",
    "ends_on",
    "display_order",
    "image_asset_id",
    "brochure_asset_id",
  ],
  events: [
    "title",
    "slug",
    "summary",
    "description",
    "host",
    "mode",
    "who_is_it_for",
    "session_topics",
    "what_we_cover",
    "published",
    "lifecycle_phase",
    "category_id",
    "starts_at",
    "ends_at",
    "booking_url",
    "top_label",
    "badge",
    "location_note",
    "display_order",
    "image_asset_id",
    "card_surfaces",
  ],
  programs: [
    "title",
    "slug",
    "short_description",
    "description",
    "badge_text",
    "close_date_text",
    "published",
    "lifecycle_phase",
    "featured",
    "display_order",
    "top_label",
    "learn_more_url",
    "who_is_it_for",
    "session_topics",
    "highlight_1",
    "highlight_2",
    "highlight_3",
    "highlight_4",
    "image_asset_id",
    "brochure_asset_id",
  ],
};

function pickWritable(
  entity: CatalogEntity,
  payload: Record<string, unknown>,
) {
  const allowed = new Set(WRITABLE_COLUMNS[entity]);
  const nullable = new Set([
    "category_id",
    "starts_on",
    "ends_on",
    "starts_at",
    "ends_at",
    "booking_url",
    "learn_more_url",
    "image_asset_id",
    "brochure_asset_id",
  ]);
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key === "id") continue;
    if (!allowed.has(key)) continue;
    if (
      nullable.has(key) &&
      (value === "" ||
        value === undefined ||
        value === null ||
        (key === "category_id" && (value === 0 || value === "0")))
    ) {
      next[key] = null;
    } else if (key === "category_id") {
      next[key] = Number(value);
    } else {
      next[key] = value;
    }
  }
  return next;
}

async function requireCatalogStaff() {
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, "catalog.manage")) {
    throw new Error("Forbidden");
  }
  return actor;
}

export async function listCatalogRows(
  entity: CatalogEntity,
  phase: LifecyclePhase | "all" = "all",
) {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(entity).select("*").order("updated_at", {
    ascending: false,
  });
  if (phase !== "all") {
    query = query.eq("lifecycle_phase", phase);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCatalogCategoryOptions(
  entity: CatalogEntity,
): Promise<{ value: string; label: string }[]> {
  if (entity === "programs") return [];
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const table =
    entity === "events" ? "event_categories" : "course_categories";
  const { data, error } = await supabase
    .from(table)
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    value: String(row.id),
    label: row.name,
  }));
}

export async function upsertCatalogRow(
  entity: CatalogEntity,
  payload: Record<string, unknown>,
) {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const id = payload.id;
  const rest = pickWritable(entity, payload);

  if (id) {
    const { error } = await supabase
      .from(entity)
      .update(rest)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from(entity).insert(rest);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/admin/${entity}`);
  revalidatePath("/purpleevents");
  revalidatePath("/cvreadyprogram");
  revalidatePath("/purpleboard");
  if (entity === "events") {
    revalidatePath("/dashboard");
    revalidatePath("/purpleevents/session");
  }
}

export async function setCatalogPhase(
  entity: CatalogEntity,
  id: number,
  phase: LifecyclePhase,
) {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(entity)
    .update({ lifecycle_phase: phase })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${entity}`);
  if (entity === "events") {
    revalidatePath("/dashboard");
    revalidatePath("/purpleevents");
  }
}
