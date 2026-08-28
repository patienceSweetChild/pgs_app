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
    "university_id",
    "featured",
    "starts_on",
    "ends_on",
    "display_order",
    "image_asset_id",
    "brochure_asset_id",
    "card_surfaces",
    "who_is_it_for",
    "session_topics",
    "highlight_1",
    "highlight_2",
    "highlight_3",
    "highlight_4",
    "booking_url",
    "program_type",
    "badge",
    "badge_color",
    "badge_text_color",
    "badge_icon_asset_id",
    "location",
    "headline",
    "hero_note",
    "session_time",
    "tags_text",
    "benefits",
    "partner_logo_asset_id",
    "awarding_body_intro",
    "awarding_body_facts",
    "awarding_body_rankings",
    "awarding_body_image_asset_id",
    "apply_intro",
    "eligibility",
    "certificate_heading",
    "certificate_why",
    "gallery_title",
    "gallery_blurb",
    "gallery_location",
    "gallery_body",
    "fee_amount",
    "fee_subtitle",
    "fee_badge",
    "fee_note",
    "fee_includes",
    "other_expense_label",
    "other_expense_amount",
    "payment_methods",
    "learners_intro",
    "faq_items",
    "section_labels",
    "benefits_aside",
    "brochure_title",
    "brochure_body",
    "brochure_badge",
    "gallery_image_1_asset_id",
    "gallery_image_2_asset_id",
    "gallery_image_3_asset_id",
    "accreditation_logos",
    "card_dates_rail",
    "card_promo_title",
    "card_promo_subtitle",
    "card_promo_date",
    "card_cta_label",
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
    "benefits",
    "benefits_aside",
    "published",
    "lifecycle_phase",
    "category_id",
    "starts_at",
    "ends_at",
    "booking_url",
    "top_label",
    "badge",
    "badge_color",
    "badge_text_color",
    "badge_icon_asset_id",
    "location",
    "location_note",
    "show_upcoming_sessions",
    "display_order",
    "image_asset_id",
    "card_surfaces",
    "tags_text",
    "roadmap_title",
    "roadmap_body",
    "roadmap_footer",
    "poster_title",
    "poster_body",
    "poster_invite_title",
    "poster_invite_body",
    "poster_live",
    "poster_topics",
    "poster_qr_asset_id",
    "poster_bg_asset_id",
    "highlight_heading",
    "highlight_title",
    "highlight_location",
    "highlight_body",
    "highlight_image_1_asset_id",
    "highlight_image_2_asset_id",
    "highlight_image_3_asset_id",
    "cta_eyebrow",
    "cta_title",
    "cta_body",
    "cta_button_label",
    "cta_button_href",
    "faq_items",
    "section_labels",
    "card_dates_rail",
    "card_promo_title",
    "card_promo_subtitle",
    "card_promo_date",
    "card_cta_label",
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
    "university_id",
  ],
};

function pickWritable(
  entity: CatalogEntity,
  payload: Record<string, unknown>,
) {
  const allowed = new Set(WRITABLE_COLUMNS[entity]);
  const nullable = new Set([
    "category_id",
    "university_id",
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
        ((key === "category_id" || key === "university_id") &&
          (value === 0 || value === "0")))
    ) {
      next[key] = null;
    } else if (key === "category_id" || key === "university_id") {
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

function slugifyCatalogValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueCatalogSlug(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  entity: CatalogEntity,
  desired: string,
  excludeId?: number | null,
): Promise<string> {
  const base = slugifyCatalogValue(desired) || entity.slice(0, -1);
  let candidate = base;
  let n = 2;
  while (n < 1000) {
    let query = supabase
      .from(entity)
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeId != null && Number.isFinite(excludeId)) {
      query = query.neq("id", excludeId);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/** Unique slug for a new draft (title-based); safe for the editable Slug field. */
export async function suggestCatalogSlug(
  entity: CatalogEntity,
  title: string,
): Promise<string> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  return ensureUniqueCatalogSlug(
    supabase,
    entity,
    title || entity.slice(0, -1),
    null,
  );
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

export async function listCatalogUniversityOptions(): Promise<
  { value: string; label: string }[]
> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("universities")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    value: String(row.id),
    label: row.name,
  }));
}

export async function listEventFacilitators(eventId: number): Promise<
  {
    name: string;
    role: string;
    biography: string;
    image_asset_id: string | null;
    image_url: string;
  }[]
> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_facilitators")
    .select(
      "name, role, biography, image_asset_id, image_asset:media_assets(bucket, path)",
    )
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);

  const { publicObjectUrl, STORAGE_BUCKETS } = await import(
    "@/lib/supabase/storage"
  );
  type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

  return (data ?? []).map((row) => {
    const media = Array.isArray(row.image_asset)
      ? (row.image_asset[0] as { bucket?: string; path?: string } | undefined)
      : (row.image_asset as { bucket?: string; path?: string } | null);
    const bucket = (media?.bucket || STORAGE_BUCKETS.media) as StorageBucket;
    const url =
      media?.path
        ? publicObjectUrl(supabase, bucket, media.path) ||
          "/assets/img/founder.png"
        : "/assets/img/founder.png";
    return {
      name: row.name || "",
      role: row.role || "",
      biography: row.biography || "",
      image_asset_id: row.image_asset_id
        ? String(row.image_asset_id)
        : null,
      image_url: url,
    };
  });
}

async function replaceEventFacilitators(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: number,
  facilitators: unknown,
) {
  if (!Array.isArray(facilitators)) return;

  const { error: delError } = await supabase
    .from("event_facilitators")
    .delete()
    .eq("event_id", eventId);
  if (delError) throw new Error(delError.message);

  const rows = facilitators
    .map((raw, index) => {
      const row = raw as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      if (!name) return null;
      return {
        event_id: eventId,
        name,
        role: String(row.role ?? ""),
        biography: String(row.biography ?? ""),
        image_asset_id: row.image_asset_id
          ? String(row.image_asset_id)
          : null,
        display_order: index,
      };
    })
    .filter(
      (row): row is NonNullable<typeof row> => row != null,
    );

  if (rows.length === 0) return;

  const { error: insError } = await supabase
    .from("event_facilitators")
    .insert(rows);
  if (insError) throw new Error(insError.message);
}

export async function listEventTestimonials(eventId: number): Promise<
  {
    name: string;
    quote: string;
    role: string;
    location: string;
    image_asset_id: string | null;
    image_url: string;
  }[]
> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_testimonials")
    .select(
      "name, quote, role, location, image_asset_id, image_asset:media_assets(bucket, path)",
    )
    .eq("event_id", eventId)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);

  const { publicObjectUrl, STORAGE_BUCKETS } = await import(
    "@/lib/supabase/storage"
  );
  type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

  return (data ?? []).map((row) => {
    const media = Array.isArray(row.image_asset)
      ? (row.image_asset[0] as { bucket?: string; path?: string } | undefined)
      : (row.image_asset as { bucket?: string; path?: string } | null);
    const bucket = (media?.bucket || STORAGE_BUCKETS.media) as StorageBucket;
    const url = media?.path
      ? publicObjectUrl(supabase, bucket, media.path) ||
        "/assets/img/photo-2.jpg"
      : "/assets/img/photo-2.jpg";
    return {
      name: row.name || "",
      quote: row.quote || "",
      role: row.role || "",
      location: row.location || "",
      image_asset_id: row.image_asset_id ? String(row.image_asset_id) : null,
      image_url: url,
    };
  });
}

async function replaceEventTestimonials(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  eventId: number,
  testimonials: unknown,
) {
  if (!Array.isArray(testimonials)) return;

  const { error: delError } = await supabase
    .from("event_testimonials")
    .delete()
    .eq("event_id", eventId);
  if (delError) throw new Error(delError.message);

  const rows = testimonials
    .map((raw, index) => {
      const row = raw as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      const quote = String(row.quote ?? "").trim();
      if (!name && !quote) return null;
      return {
        event_id: eventId,
        name: name || "Student",
        quote,
        role: String(row.role ?? ""),
        location: String(row.location ?? ""),
        image_asset_id: row.image_asset_id
          ? String(row.image_asset_id)
          : null,
        display_order: index,
      };
    })
    .filter(
      (row): row is NonNullable<typeof row> => row != null,
    );

  if (rows.length === 0) return;

  const { error: insError } = await supabase
    .from("event_testimonials")
    .insert(rows);
  if (insError) throw new Error(insError.message);
}

export async function listCourseTestimonials(courseId: number): Promise<
  {
    name: string;
    quote: string;
    role: string;
    location: string;
    image_asset_id: string | null;
    image_url: string;
  }[]
> {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("course_testimonials")
    .select(
      "name, quote, role, location, image_asset_id, image_asset:media_assets(bucket, path)",
    )
    .eq("course_id", courseId)
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);

  const { publicObjectUrl, STORAGE_BUCKETS } = await import(
    "@/lib/supabase/storage"
  );
  type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

  return (data ?? []).map((row) => {
    const media = Array.isArray(row.image_asset)
      ? (row.image_asset[0] as { bucket?: string; path?: string } | undefined)
      : (row.image_asset as { bucket?: string; path?: string } | null);
    const bucket = (media?.bucket || STORAGE_BUCKETS.media) as StorageBucket;
    const url = media?.path
      ? publicObjectUrl(supabase, bucket, media.path) ||
        "/assets/img/photo-2.jpg"
      : "/assets/img/photo-2.jpg";
    return {
      name: row.name || "",
      quote: row.quote || "",
      role: row.role || "",
      location: row.location || "",
      image_asset_id: row.image_asset_id ? String(row.image_asset_id) : null,
      image_url: url,
    };
  });
}

async function replaceCourseTestimonials(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  courseId: number,
  testimonials: unknown,
) {
  if (!Array.isArray(testimonials)) return;

  const { error: delError } = await supabase
    .from("course_testimonials")
    .delete()
    .eq("course_id", courseId);
  if (delError) throw new Error(delError.message);

  const rows = testimonials
    .map((raw, index) => {
      const row = raw as Record<string, unknown>;
      const name = String(row.name ?? "").trim();
      const quote = String(row.quote ?? "").trim();
      if (!name && !quote) return null;
      return {
        course_id: courseId,
        name: name || "Student",
        quote,
        role: String(row.role ?? ""),
        location: String(row.location ?? ""),
        image_asset_id: row.image_asset_id
          ? String(row.image_asset_id)
          : null,
        display_order: index,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  if (rows.length === 0) return;

  const { error: insError } = await supabase
    .from("course_testimonials")
    .insert(rows);
  if (insError) throw new Error(insError.message);
}

export async function upsertCatalogRow(
  entity: CatalogEntity,
  payload: Record<string, unknown>,
  options?: { mode?: "draft" | "publish" },
) {
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const id = payload.id;
  const rest = pickWritable(entity, payload);
  const facilitators = payload.facilitators;
  const testimonials = payload.testimonials;
  const mode = options?.mode ?? "draft";

  let entityId: number | null = id != null ? Number(id) : null;

  let currentlyPublished = false;
  if (entityId != null && (entity === "events" || entity === "courses")) {
    const { data: existing, error: existingError } = await supabase
      .from(entity)
      .select("published")
      .eq("id", entityId)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    currentlyPublished = Boolean(existing?.published);
  }

  /** Live row: stash WIP in cms_draft only — do not touch live columns or published. */
  if (
    mode === "draft" &&
    currentlyPublished &&
    entityId != null &&
    (entity === "events" || entity === "courses")
  ) {
    const draftBody: Record<string, unknown> = {
      ...rest,
      id: entityId,
      published: true,
    };
    if (entity === "events") {
      draftBody.facilitators = Array.isArray(facilitators) ? facilitators : [];
      draftBody.testimonials = Array.isArray(testimonials) ? testimonials : [];
    }
    if (entity === "courses") {
      draftBody.testimonials = Array.isArray(testimonials) ? testimonials : [];
    }

    const { error } = await supabase
      .from(entity)
      .update({ cms_draft: draftBody })
      .eq("id", entityId);
    if (error) throw new Error(error.message);

    revalidatePath(`/admin/${entity}`);
    return {
      id: entityId,
      slug: String(draftBody.slug ?? rest.slug ?? ""),
      published: true,
      hasDraft: true,
    };
  }

  const titleBase =
    typeof rest.title === "string" && rest.title.trim()
      ? rest.title
      : entity.slice(0, -1);
  const slugBase =
    typeof rest.slug === "string" && rest.slug.trim()
      ? rest.slug
      : titleBase;
  rest.slug = await ensureUniqueCatalogSlug(
    supabase,
    entity,
    slugBase,
    entityId,
  );

  if (entity === "events" || entity === "courses") {
    rest.published = mode === "publish";
  }

  const rowWrite: Record<string, unknown> = { ...rest };
  if (entity === "events" || entity === "courses") {
    rowWrite.cms_draft = null;
  }

  if (id) {
    const { error } = await supabase
      .from(entity)
      .update(rowWrite)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from(entity)
      .insert(rowWrite)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    if (data?.id != null) {
      entityId = Number(data.id);
    }
  }

  if (entity === "events" && entityId != null) {
    await replaceEventFacilitators(supabase, entityId, facilitators);
    await replaceEventTestimonials(supabase, entityId, testimonials);
  }
  if (entity === "courses" && entityId != null) {
    await replaceCourseTestimonials(supabase, entityId, testimonials);
  }

  revalidatePath(`/admin/${entity}`);
  revalidatePath("/purpleevents");
  revalidatePath("/programsfull");
  revalidatePath("/cvreadyprogram");
  revalidatePath("/purpleboard");
  if (entity === "events") {
    revalidatePath("/dashboard");
    revalidatePath("/purpleevents/session");
  }
  if (entity === "courses") {
    revalidatePath("/programsfull/program");
  }

  return {
    id: entityId,
    slug: String(rest.slug ?? ""),
    published: Boolean(rest.published),
    hasDraft: false,
  };
}

/** Drop WIP draft on a live row and leave live columns unchanged. */
export async function clearCatalogDraft(
  entity: CatalogEntity,
  id: number,
) {
  if (entity !== "events" && entity !== "courses") {
    throw new Error("Drafts are only supported for events and courses");
  }
  await requireCatalogStaff();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(entity)
    .update({ cms_draft: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${entity}`);
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
    revalidatePath("/purpleevents/session");
  }
  if (entity === "courses") {
    revalidatePath("/purpleboard");
    revalidatePath("/programsfull");
    revalidatePath("/programsfull/program");
  }
}
