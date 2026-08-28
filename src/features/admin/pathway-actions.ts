"use server";

import { revalidatePath } from "next/cache";
import { resolveActorContext, staffHasPermission } from "@/lib/auth/actor-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getPathwayContent,
  PATHWAY_SEED_META,
  type PathwayPageContent,
  type PathwaySlug,
} from "@/features/pathway/page-content";

const WRITABLE_KEYS = [
  "name",
  "slug",
  "template",
  "published",
  "display_order",
  "page_content",
] as const;

async function requirePathwayStaff() {
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
  const candidate = slugify(slug) || "pathway";
  let suffix = 0;
  for (;;) {
    const test = suffix > 0 ? `${candidate}-${suffix}` : candidate;
    let query = supabase.from("pathways").select("id").eq("slug", test);
    if (excludeId != null) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return test;
    suffix += 1;
  }
}

export async function ensurePathwaySeeds() {
  await requirePathwayStaff();
  const supabase = await createSupabaseServerClient();

  for (const meta of PATHWAY_SEED_META) {
    const content = getPathwayContent(meta.slug);
    if (!content) continue;

    const { data: existing } = await supabase
      .from("pathways")
      .select("id, page_content")
      .eq("slug", meta.slug)
      .maybeSingle();

    if (existing?.page_content) continue;

    const row = {
      name: meta.name,
      slug: meta.slug,
      template: meta.template,
      published: meta.slug === "usmle",
      display_order: meta.display_order,
      page_content: content as unknown as Record<string, unknown>,
    };

    if (existing?.id) {
      await supabase
        .from("pathways")
        .update({ page_content: row.page_content })
        .eq("id", existing.id);
    } else {
      await supabase.from("pathways").insert(row);
    }
  }
}

export async function listPathwayRows() {
  await requirePathwayStaff();
  await ensurePathwaySeeds();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pathways")
    .select(
      "id, name, slug, template, published, display_order, page_content, cms_draft",
    )
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...row,
    hasDraft: Boolean(row.cms_draft),
  }));
}

export async function upsertPathwayRow(
  payload: Record<string, unknown>,
  options?: { mode?: "draft" | "publish" },
) {
  await requirePathwayStaff();
  const supabase = await createSupabaseServerClient();
  const id = payload.id != null ? Number(payload.id) : null;
  const rest = pickWritable(payload);
  const mode = options?.mode ?? "draft";

  let currentlyPublished = false;
  if (id != null) {
    const { data: existing, error: existingError } = await supabase
      .from("pathways")
      .select("published")
      .eq("id", id)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    currentlyPublished = Boolean(existing?.published);
  }

  const draftBody: Record<string, unknown> = { ...rest };
  if (id != null) draftBody.id = id;

  if (mode === "draft" && currentlyPublished && id != null) {
    const { error } = await supabase
      .from("pathways")
      .update({ cms_draft: draftBody })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePathwayPaths(String(rest.slug ?? payload.slug ?? ""));
    return {
      id,
      slug: String(rest.slug ?? ""),
      published: true,
      hasDraft: true,
    };
  }

  const nameBase =
    typeof rest.name === "string" && rest.name.trim()
      ? rest.name.trim()
      : "Pathway";
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
    const { error } = await supabase.from("pathways").update(rowWrite).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from("pathways")
      .insert(rowWrite)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    entityId = data?.id != null ? Number(data.id) : null;
  }

  revalidatePathwayPaths(String(rest.slug));
  return {
    id: entityId,
    slug: String(rest.slug),
    published: Boolean(rest.published),
    hasDraft: false,
  };
}

export async function clearPathwayDraft(id: number) {
  await requirePathwayStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("pathways")
    .update({ cms_draft: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pathways");
}

function revalidatePathwayPaths(slug: string) {
  revalidatePath("/admin/pathways");
  if (slug) {
    revalidatePath(`/pathways/${slug}`);
  }
  revalidatePath("/pathways", "layout");
}

export type PathwayRow = {
  id: number;
  name: string;
  slug: string;
  template: "medical" | "nonmedical";
  published: boolean;
  display_order: number;
  page_content: PathwayPageContent | null;
  cms_draft: Record<string, unknown> | null;
  hasDraft?: boolean;
};

export type { PathwaySlug };
