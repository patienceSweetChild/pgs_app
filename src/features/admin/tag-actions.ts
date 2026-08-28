"use server";

import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type EventTagKind = "tag" | "mode" | "badge";

export type CatalogTagRow = {
  id: string;
  name: string;
  slug: string;
  tag_type: string;
};

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/#/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function kindToTagTypes(kind: EventTagKind): string[] {
  if (kind === "tag") return ["general", "tag"];
  return [kind];
}

function kindToInsertType(kind: EventTagKind): string {
  if (kind === "tag") return "general";
  return kind;
}

async function requireCatalogStaff() {
  const actor = await resolveActorContext();
  if (!actor.staff || !staffHasPermission(actor.staff, "catalog.manage")) {
    throw new Error("Forbidden");
  }
  return actor;
}

function mapRow(row: {
  id: string | number;
  name: string;
  slug: string;
  tag_type: string;
}): CatalogTagRow {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    tag_type: row.tag_type,
  };
}

/** Staff-gated list of catalog tags; optionally filtered by EventTagKind. */
export async function listCatalogTags(
  kind?: EventTagKind,
): Promise<CatalogTagRow[]> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("catalog_tags")
    .select("id, name, slug, tag_type")
    .order("name", { ascending: true });

  if (kind) {
    query = query.in("tag_type", kindToTagTypes(kind));
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

/** Create a published catalog tag, or return the existing row on slug conflict. */
export async function createCatalogTag({
  label,
  kind,
}: {
  label: string;
  kind: EventTagKind;
}): Promise<CatalogTagRow> {
  await requireCatalogStaff();
  const name = label.trim().replace(/^#+/, "").trim();
  if (!name) throw new Error("Label required");
  const slug = slugify(name);
  if (!slug) throw new Error("Invalid label");

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: lookupError } = await supabase
    .from("catalog_tags")
    .select("id, name, slug, tag_type")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  if (existing) return mapRow(existing);

  const { data, error } = await supabase
    .from("catalog_tags")
    .insert({
      name,
      slug,
      tag_type: kindToInsertType(kind),
      published: true,
    })
    .select("id, name, slug, tag_type")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: raced, error: raceError } = await supabase
        .from("catalog_tags")
        .select("id, name, slug, tag_type")
        .eq("slug", slug)
        .maybeSingle();
      if (raceError) throw new Error(raceError.message);
      if (raced) return mapRow(raced);
    }
    throw new Error(error.message);
  }

  return mapRow(data);
}
