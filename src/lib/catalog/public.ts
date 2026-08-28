import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  publicObjectUrl,
  STORAGE_BUCKETS,
  type StorageBucket,
} from "@/lib/supabase/storage";
import type {
  SessionDetail,
  SessionPageLabels,
  UpcomingSession,
} from "@/features/purpleevents/content";
import {
  DEFAULT_SECTION_LABELS,
  DOWNLOAD_COPY,
  FAQ_ITEMS,
  ROADMAP,
} from "@/features/purpleevents/content";
import type { CourseDetail, CoursePageLabels } from "@/features/programsfull/content";
import {
  COURSE_FAQ_TABS,
  COURSE_PAGE_MOCK,
  DEFAULT_COURSE_SECTION_LABELS,
  parseCourseFacts,
  parseCourseFaqs,
} from "@/features/programsfull/content";
import type { ProgramCardData } from "@/components/cards/types";
import type { InternshipCardData, PromoCardData } from "@/components/cards/types";
import type { FeedUpcomingEvent } from "@/features/dashboard/content";
import { splitCmsLines } from "@/components/CmsHtml";
import {
  DEFAULT_COURSE_BADGE_ICON,
  DEFAULT_EVENT_BADGE_ICON,
  normalizeHex,
} from "@/components/cards/badge-chip-style";
import { matchesCardSurface, type PageSurfaceKey } from "@/lib/catalog/card-surfaces";
import {
  mapCvReadyFeaturedCourse,
  mapCvReadyFeaturedEvent,
  mapCvReadyProgramCourse,
  mapCvReadyProgramEvent,
  mapPurpleboardCourse,
  mapPurpleboardEvent,
  saveCardId,
  type CatalogRow,
} from "@/lib/catalog/card-mappers";

export type LifecyclePhase = "live" | "ended" | "archived";

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

function monthDayParts(iso: string | null): {
  day: string;
  month: string;
  time: string;
} {
  if (!iso) return { day: "--", month: "", time: "" };
  const d = new Date(iso);
  const mo = d.toLocaleString("en-US", { month: "short" });
  const yr = d.toLocaleString("en-GB", { year: "2-digit" });
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: `${mo} ${yr}`,
    time: d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
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

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    if (seen.has(tag)) return false;
    seen.add(tag);
    return true;
  });
}

function parseTagsText(
  value: string | null | undefined,
  fallback: string[] = [],
): string[] {
  const fromText = dedupeTags(
    splitCmsLines(value)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`)),
  );
  return fromText.length > 0 ? fromText : dedupeTags(fallback);
}

const CARD_COURSE_SELECT =
  "id, title, slug, short_description, description, duration, mode, location, badge, badge_color, badge_text_color, featured, tags_text, starts_on, ends_on, card_surfaces, card_dates_rail, card_promo_title, card_promo_subtitle, card_promo_date, card_cta_label, display_order, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path)";

const CARD_EVENT_SELECT =
  "id, title, summary, description, mode, location, host, badge, badge_color, badge_text_color, tags_text, starts_at, ends_at, top_label, card_surfaces, card_dates_rail, card_promo_title, card_promo_subtitle, card_promo_date, card_cta_label, display_order, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path)";

function hydrateCourseRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  row: Record<string, unknown>,
): CatalogRow {
  return {
    ...row,
    image_url: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      "/assets/img/purpleboard/campus.jpg",
    ),
    badge_icon_url: resolveMedia(
      supabase,
      asMediaJoin(row.badge_icon_asset),
      DEFAULT_COURSE_BADGE_ICON,
    ),
  };
}

function hydrateEventRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  row: Record<string, unknown>,
): CatalogRow {
  return {
    ...row,
    image_url: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      "/assets/img/saved_1.jpg",
    ),
    badge_icon_url: resolveMedia(
      supabase,
      asMediaJoin(row.badge_icon_asset),
      DEFAULT_EVENT_BADGE_ICON,
    ),
  };
}

async function listSurfaceCards<T>(
  surface: PageSurfaceKey,
  mapCourse: (row: CatalogRow, saved?: boolean) => T,
  mapEvent: (row: CatalogRow, saved?: boolean) => T,
  savedKeys: Set<string> = new Set(),
): Promise<T[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const [coursesRes, eventsRes] = await Promise.all([
    supabase
      .from("courses")
      .select(CARD_COURSE_SELECT)
      .eq("published", true)
      .eq("lifecycle_phase", "live")
      .order("display_order", { ascending: true }),
    supabase
      .from("events")
      .select(CARD_EVENT_SELECT)
      .eq("published", true)
      .eq("lifecycle_phase", "live")
      .order("display_order", { ascending: true }),
  ]);

  if (coursesRes.error) {
    console.error("listSurfaceCards courses", coursesRes.error.message);
  }
  if (eventsRes.error) {
    console.error("listSurfaceCards events", eventsRes.error.message);
  }

  const cards: T[] = [];

  for (const row of coursesRes.data ?? []) {
    if (!matchesCardSurface(row, surface)) continue;
    const hydrated = hydrateCourseRow(supabase, row as Record<string, unknown>);
    const id = saveCardId("course", hydrated.id as string | number);
    cards.push(mapCourse(hydrated, savedKeys.has(id)));
  }

  for (const row of eventsRes.data ?? []) {
    if (!matchesCardSurface(row, surface)) continue;
    const hydrated = hydrateEventRow(supabase, row as Record<string, unknown>);
    const id = saveCardId("event", hydrated.id as string | number);
    cards.push(mapEvent(hydrated, savedKeys.has(id)));
  }

  return cards;
}

export async function listPurpleboardCards(
  savedKeys: Set<string> = new Set(),
): Promise<ProgramCardData[]> {
  return listSurfaceCards(
    "purpleboard",
    mapPurpleboardCourse,
    mapPurpleboardEvent,
    savedKeys,
  );
}

export async function listCvReadyFeatured(
  savedKeys: Set<string> = new Set(),
): Promise<InternshipCardData[]> {
  return listSurfaceCards(
    "cvready_featured",
    mapCvReadyFeaturedCourse,
    mapCvReadyFeaturedEvent,
    savedKeys,
  );
}

export async function listCvReadyPrograms(
  savedKeys: Set<string> = new Set(),
): Promise<PromoCardData[]> {
  return listSurfaceCards(
    "cvready_programs",
    mapCvReadyProgramCourse,
    mapCvReadyProgramEvent,
    savedKeys,
  );
}

export { saveCardId };

export async function listLiveEvents(): Promise<UpcomingSession[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, starts_at, ends_at, who_is_it_for, session_topics, mode, summary, host, badge, tags_text, image_asset:media_assets!image_asset_id(bucket, path)",
    )
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("display_order", { ascending: true })
    .order("starts_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    title: row.title,
    start: monthDayParts(row.starts_at),
    end: monthDayParts(row.ends_at),
    whoFor: row.who_is_it_for || undefined,
    topics: row.session_topics
      ? splitCmsLines(row.session_topics)
      : undefined,
    image: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      "/assets/img/tab-img.jpg",
    ),
    author: row.host || undefined,
    tags: parseTagsText(row.tags_text, row.badge ? [row.badge] : []),
    mode: row.mode || undefined,
    blurb: row.summary || undefined,
  }));
}

export async function getLiveEventById(
  id: string,
): Promise<SessionDetail | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;

  const { data: row } = await supabase
    .from("events")
    .select(
      "id, title, starts_at, ends_at, who_is_it_for, session_topics, mode, summary, description, host, badge, badge_color, badge_text_color, tags_text, what_we_cover, benefits, benefits_aside, top_label, location_note, show_upcoming_sessions, roadmap_title, roadmap_body, roadmap_footer, poster_title, poster_body, poster_invite_title, poster_invite_body, poster_live, poster_topics, highlight_heading, highlight_title, highlight_location, highlight_body, cta_eyebrow, cta_title, cta_body, cta_button_label, cta_button_href, faq_items, section_labels, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path), poster_qr_asset:media_assets!poster_qr_asset_id(bucket, path), poster_bg_asset:media_assets!poster_bg_asset_id(bucket, path), highlight_image_1_asset:media_assets!highlight_image_1_asset_id(bucket, path), highlight_image_2_asset:media_assets!highlight_image_2_asset_id(bucket, path), highlight_image_3_asset:media_assets!highlight_image_3_asset_id(bucket, path)",
    )
    .eq("id", numericId)
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .maybeSingle();

  if (!row) return null;

  const { data: facilitators } = await supabase
    .from("event_facilitators")
    .select("name, role, image_asset:media_assets(bucket, path)")
    .eq("event_id", row.id)
    .order("display_order", { ascending: true });

  const { data: testimonials } = await supabase
    .from("event_testimonials")
    .select(
      "name, quote, role, location, image_asset:media_assets(bucket, path)",
    )
    .eq("event_id", row.id)
    .order("display_order", { ascending: true });

  const whoLines = splitCmsLines(row.who_is_it_for);
  const topics = splitCmsLines(row.session_topics);
  const cover = splitCmsLines(row.what_we_cover);
  const benefitsAside = splitCmsLines(row.benefits_aside);
  const benefits = splitCmsLines(row.benefits);
  const posterTopics = splitCmsLines(row.poster_topics);
  const faqItems = parseCourseFaqs(row.faq_items || "").map((f) => ({
    q: f.q,
    a: f.a,
  }));
  const labelsRaw =
    row.section_labels &&
    typeof row.section_labels === "object" &&
    !Array.isArray(row.section_labels)
      ? (row.section_labels as SessionPageLabels)
      : {};
  const labels: SessionPageLabels = {
    ...DEFAULT_SECTION_LABELS,
    ...labelsRaw,
  };
  const highlightImages = [
    resolveMedia(
      supabase,
      asMediaJoin(row.highlight_image_1_asset),
      "",
    ),
    resolveMedia(
      supabase,
      asMediaJoin(row.highlight_image_2_asset),
      "",
    ),
    resolveMedia(
      supabase,
      asMediaJoin(row.highlight_image_3_asset),
      "",
    ),
  ].filter(Boolean);

  return {
    id: String(row.id),
    title: row.title,
    start: monthDayParts(row.starts_at),
    end: monthDayParts(row.ends_at),
    whoFor: row.who_is_it_for || undefined,
    topics,
    image: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      "/assets/img/tab-img.jpg",
    ),
    author: row.host || undefined,
    tags: parseTagsText(row.tags_text, row.badge ? [row.badge] : []),
    mode: row.mode || undefined,
    blurb: row.summary || undefined,
    host: row.host || "",
    // Keep hero fields 1:1 — summary is for cards/listings only
    subtitle: row.top_label || "",
    description: row.description || "",
    whoForLines: whoLines,
    sessionTopics: topics,
    coverItems: cover,
    benefitsAsideLines: benefitsAside,
    benefits,
    note: row.location_note || "",
    about: row.description || "",
    facilitators: (facilitators ?? []).map((f) => ({
      name: f.name,
      role: f.role,
      image: resolveMedia(
        supabase,
        asMediaJoin(f.image_asset),
        "/assets/img/founder.png",
      ),
    })),
    testimonials: (testimonials ?? []).map((t) => ({
      name: t.name,
      quote: t.quote,
      role: t.role,
      location: t.location || "",
      image: resolveMedia(
        supabase,
        asMediaJoin(t.image_asset),
        "/assets/img/photo-2.jpg",
      ),
    })),
    enrollLabel: (row.badge ? String(row.badge).trim() : "") || "Enroll Now",
    badgeColor: normalizeHex(row.badge_color) ?? undefined,
    badgeTextColor: normalizeHex(row.badge_text_color) ?? undefined,
    badgeIcon: resolveMedia(
      supabase,
      asMediaJoin(row.badge_icon_asset),
      DEFAULT_EVENT_BADGE_ICON,
    ),
    showUpcomingSessions: row.show_upcoming_sessions !== false,
    roadmap: {
      title: row.roadmap_title || ROADMAP.title,
      body: row.roadmap_body || ROADMAP.body,
      footer: row.roadmap_footer || ROADMAP.footer,
    },
    poster: {
      title: row.poster_title || DOWNLOAD_COPY.title,
      body: row.poster_body || DOWNLOAD_COPY.body,
      inviteTitle: row.poster_invite_title || DOWNLOAD_COPY.inviteTitle,
      inviteBody: row.poster_invite_body || DOWNLOAD_COPY.inviteBody,
      live: row.poster_live || DOWNLOAD_COPY.live,
      topics:
        posterTopics.length > 0 ? posterTopics : [...DOWNLOAD_COPY.topics],
      qrUrl:
        resolveMedia(
          supabase,
          asMediaJoin(row.poster_qr_asset),
          "/assets/img/qr-2.png",
        ) || "/assets/img/qr-2.png",
      bgUrl:
        resolveMedia(
          supabase,
          asMediaJoin(row.poster_bg_asset),
          "/assets/img/green-1.png",
        ) || "/assets/img/green-1.png",
    },
    highlights: {
      heading:
        row.highlight_heading ||
        labels.highlights ||
        DEFAULT_SECTION_LABELS.highlights,
      title: row.highlight_title || "",
      location: row.highlight_location || "",
      body: row.highlight_body || "",
      images: highlightImages,
    },
    cta: {
      eyebrow: row.cta_eyebrow || "Let's Go",
      title: row.cta_title || labels.cta || DEFAULT_SECTION_LABELS.cta,
      body:
        row.cta_body ||
        "Let’s chart your study abroad path, together with Team #PGS.",
      buttonLabel: row.cta_button_label || "Start Your Journey",
      buttonHref: row.cta_button_href || "/contact",
    },
    faqItems:
      faqItems.length > 0
        ? faqItems
        : FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a })),
    labels,
  };
}

export async function listLivePrograms(): Promise<ProgramCardData[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("programs")
    .select(
      "id, title, slug, short_description, badge_text, close_date_text, highlight_1, highlight_2, top_label, image_asset:media_assets(bucket, path)",
    )
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("display_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: String(row.id),
    type: "program" as const,
    href: `/programsfull#${row.slug}`,
    image: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      "/assets/img/saved_4.jpg",
    ),
    title: row.title,
    tags: row.badge_text ? [row.badge_text] : [],
    col: "half" as const,
    details: [
      row.highlight_1
        ? { label: "Highlight", value: row.highlight_1 }
        : { label: "About", value: row.short_description || "—" },
      row.close_date_text
        ? { label: "Closes", value: row.close_date_text }
        : { label: "Status", value: "Open" },
    ].filter(Boolean),
    variant: "compact" as const,
    badge: row.badge_text || row.top_label || undefined,
  }));
}

function promoDateFromIso(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${day}${suffix} ${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`;
}

export async function listLiveCourses(): Promise<ProgramCardData[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, slug, short_description, duration, mode, location, badge, badge_color, badge_text_color, featured, tags_text, starts_on, ends_on, card_dates_rail, card_promo_title, card_promo_subtitle, card_promo_date, card_cta_label, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path)",
    )
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("listLiveCourses", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const fallback = [row.mode, row.duration].filter(Boolean) as string[];
    const promoDate =
      (row.card_promo_date ? String(row.card_promo_date).trim() : "") ||
      promoDateFromIso(row.ends_on || row.starts_on || null);
    return {
      id: String(row.id),
      type: "program" as const,
      href: `/programsfull/program/${row.id}`,
      image: resolveMedia(
        supabase,
        asMediaJoin(row.image_asset),
        "/assets/img/library.jpg",
      ),
      title: row.title,
      tags: parseTagsText(row.tags_text, fallback),
      col: "half" as const,
      details: [
        { label: "Mode", value: row.mode || "—" },
        {
          label: "Duration",
          value: row.duration || row.short_description || "—",
        },
      ],
      variant: "full" as const,
      badge: row.badge || (row.featured ? "Featured" : undefined),
      badgeColor: normalizeHex(row.badge_color) ?? undefined,
      badgeTextColor: normalizeHex(row.badge_text_color) ?? undefined,
      badgeIcon: resolveMedia(
        supabase,
        asMediaJoin(row.badge_icon_asset),
        DEFAULT_COURSE_BADGE_ICON,
      ),
      datesRail:
        (row.card_dates_rail ? String(row.card_dates_rail).trim() : "") ||
        "Dates You Should Be Aware off.",
      promo: {
        title:
          (row.card_promo_title ? String(row.card_promo_title).trim() : "") ||
          "Dates\nExtended",
        subtitle:
          (row.card_promo_subtitle
            ? String(row.card_promo_subtitle).trim()
            : "") || "Check\nWith US",
        date: promoDate,
      },
      ctaLabel:
        (row.card_cta_label ? String(row.card_cta_label).trim() : "") ||
        "Learn More",
    };
  });
}

export async function getLiveCourseById(
  id: string,
): Promise<CourseDetail | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;

  const { data: row, error } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, description, duration, mode, featured, starts_on, ends_on, who_is_it_for, session_topics, highlight_1, highlight_2, highlight_3, highlight_4, booking_url, program_type, badge, badge_color, badge_text_color, location, headline, hero_note, session_time, tags_text, benefits, benefits_aside, brochure_title, brochure_body, brochure_badge, awarding_body_intro, awarding_body_facts, awarding_body_rankings, accreditation_logos, apply_intro, eligibility, certificate_heading, certificate_why, gallery_title, gallery_blurb, gallery_location, gallery_body, fee_amount, fee_subtitle, fee_badge, fee_note, fee_includes, other_expense_label, other_expense_amount, payment_methods, learners_intro, faq_items, section_labels, image_asset:media_assets!image_asset_id(bucket, path), badge_icon_asset:media_assets!badge_icon_asset_id(bucket, path), brochure_asset:media_assets!brochure_asset_id(bucket, path), partner_logo_asset:media_assets!partner_logo_asset_id(bucket, path), awarding_body_image_asset:media_assets!awarding_body_image_asset_id(bucket, path), gallery_image_1_asset:media_assets!gallery_image_1_asset_id(bucket, path), gallery_image_2_asset:media_assets!gallery_image_2_asset_id(bucket, path), gallery_image_3_asset:media_assets!gallery_image_3_asset_id(bucket, path)",
    )
    .eq("id", numericId)
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .maybeSingle();

  if (error) {
    console.error("getLiveCourseById", error.message);
    return null;
  }

  if (!row) return null;

  const { data: testimonials } = await supabase
    .from("course_testimonials")
    .select(
      "name, quote, role, location, image_asset:media_assets(bucket, path)",
    )
    .eq("course_id", row.id)
    .order("display_order", { ascending: true });

  const mock = COURSE_PAGE_MOCK;
  const whoLines = splitCmsLines(row.who_is_it_for);
  const topics = splitCmsLines(row.session_topics);
  const benefits = splitCmsLines(row.benefits);
  const highlights = [
    row.highlight_1,
    row.highlight_2,
    row.highlight_3,
    row.highlight_4,
  ]
    .map((v) => (v ? String(v).trim() : ""))
    .filter(Boolean);

  const mode = row.mode || "";
  const tags = parseTagsText(
    row.tags_text,
    [
      mode ? (mode.startsWith("#") ? mode : `#${mode}`) : "#Course",
      row.featured ? "#Featured" : "",
    ].filter(Boolean),
  );

  const brochure = asMediaJoin(row.brochure_asset);
  const brochureUrl = brochure?.path
    ? resolveMedia(supabase, brochure, "")
    : undefined;

  const labelsRaw =
    row.section_labels &&
    typeof row.section_labels === "object" &&
    !Array.isArray(row.section_labels)
      ? (row.section_labels as CoursePageLabels)
      : {};
  const labels: CoursePageLabels = {
    ...DEFAULT_COURSE_SECTION_LABELS,
    ...labelsRaw,
  };

  const accreditationFromCms = splitCmsLines(row.accreditation_logos)
    .map((s) => s.trim())
    .filter(Boolean);
  const galleryFromCms = [
    resolveMedia(supabase, asMediaJoin(row.gallery_image_1_asset), ""),
    resolveMedia(supabase, asMediaJoin(row.gallery_image_2_asset), ""),
    resolveMedia(supabase, asMediaJoin(row.gallery_image_3_asset), ""),
  ].filter(Boolean);

  const benefitsAside =
    (row.benefits_aside ? String(row.benefits_aside).trim() : "") ||
    labels.benefitsAside ||
    DEFAULT_COURSE_SECTION_LABELS.benefitsAside;
  const brochureTitle =
    (row.brochure_title ? String(row.brochure_title).trim() : "") ||
    labels.brochureTitle ||
    DEFAULT_COURSE_SECTION_LABELS.brochureTitle;
  const brochureBody =
    (row.brochure_body ? String(row.brochure_body).trim() : "") ||
    labels.brochureBody ||
    DEFAULT_COURSE_SECTION_LABELS.brochureBody;
  const brochureBadge = row.brochure_badge
    ? String(row.brochure_badge).trim()
    : undefined;

  const sessionTime = row.session_time || mock.sessionTime;
  const start = monthDayParts(
    row.starts_on ? `${row.starts_on}T12:00:00` : null,
  );
  const end = monthDayParts(row.ends_on ? `${row.ends_on}T12:00:00` : null);
  const facts = parseCourseFacts(row.awarding_body_facts || "");
  const faqItems = parseCourseFaqs(row.faq_items || "");
  const mappedTestimonials = (testimonials ?? []).map((t) => ({
    name: t.name,
    quote: t.quote,
    role: t.role,
    location: t.location || "",
    image: resolveMedia(
      supabase,
      asMediaJoin(t.image_asset),
      "/assets/img/photo-2.jpg",
    ),
  }));

  return {
    id: String(row.id),
    title: row.title || mock.title,
    shortDescription: row.short_description || mock.shortDescription,
    description: row.description || row.short_description || mock.description,
    image: resolveMedia(
      supabase,
      asMediaJoin(row.image_asset),
      mock.image,
    ),
    partnerLogo: resolveMedia(
      supabase,
      asMediaJoin(row.partner_logo_asset),
      mock.partnerLogo,
    ),
    brochureUrl: brochureUrl || undefined,
    brochureTitle,
    brochureBody,
    brochureBadge: brochureBadge || undefined,
    mode: mode || mock.mode,
    duration: row.duration || mock.duration,
    programType: row.program_type || mock.programType,
    badge: row.badge || mock.badge,
    badgeColor: normalizeHex(row.badge_color) ?? undefined,
    badgeTextColor: normalizeHex(row.badge_text_color) ?? undefined,
    badgeIcon: resolveMedia(
      supabase,
      asMediaJoin(row.badge_icon_asset),
      DEFAULT_COURSE_BADGE_ICON,
    ),
    location: row.location || mock.location,
    headline: row.headline || mock.headline,
    heroNote: row.hero_note || mock.heroNote,
    sessionTime,
    featured: Boolean(row.featured),
    tags: tags.length ? tags : mock.tags,
    whoFor: row.who_is_it_for || mock.whoFor,
    whoForLines: whoLines.length ? whoLines : mock.whoForLines,
    sessionTopics: topics.length ? topics : mock.sessionTopics,
    highlights: highlights.length ? highlights : mock.highlights,
    benefits: benefits.length ? benefits : mock.benefits,
    benefitsAside,
    bookingUrl: row.booking_url || undefined,
    start: row.starts_on
      ? { ...start, time: sessionTime || start.time }
      : mock.start,
    end: row.ends_on ? { ...end, time: sessionTime || end.time } : mock.end,
    startsOn: row.starts_on || mock.startsOn,
    endsOn: row.ends_on || mock.endsOn,
    awardingBodyIntro: row.awarding_body_intro || mock.awardingBodyIntro,
    awardingBodyFacts: facts.length ? facts : mock.awardingBodyFacts,
    awardingBodyRankings:
      row.awarding_body_rankings || mock.awardingBodyRankings,
    awardingBodyImage: resolveMedia(
      supabase,
      asMediaJoin(row.awarding_body_image_asset),
      mock.awardingBodyImage,
    ),
    accreditationLogos: accreditationFromCms.length
      ? accreditationFromCms
      : mock.accreditationLogos,
    applyIntro: row.apply_intro || mock.applyIntro,
    eligibility: (() => {
      const list = splitCmsLines(row.eligibility);
      return list.length ? list : mock.eligibility;
    })(),
    certificateHeading: row.certificate_heading || mock.certificateHeading,
    certificateWhy: (() => {
      const list = splitCmsLines(row.certificate_why);
      return list.length ? list : mock.certificateWhy;
    })(),
    galleryTitle: row.gallery_title || mock.galleryTitle,
    galleryBlurb: row.gallery_blurb || mock.galleryBlurb,
    galleryLocation: row.gallery_location || mock.galleryLocation,
    galleryBody: row.gallery_body || mock.galleryBody,
    galleryImages: galleryFromCms.length
      ? galleryFromCms
      : mock.galleryImages,
    feeAmount: row.fee_amount || mock.feeAmount,
    feeSubtitle: row.fee_subtitle || mock.feeSubtitle,
    feeBadge: row.fee_badge || mock.feeBadge,
    feeNote: row.fee_note || mock.feeNote,
    feeIncludes: (() => {
      const list = splitCmsLines(row.fee_includes);
      return list.length ? list : mock.feeIncludes;
    })(),
    otherExpenseLabel: row.other_expense_label || mock.otherExpenseLabel,
    otherExpenseAmount: row.other_expense_amount || mock.otherExpenseAmount,
    paymentMethods: row.payment_methods || mock.paymentMethods,
    learnersIntro: row.learners_intro || mock.learnersIntro,
    testimonials: mappedTestimonials.length
      ? mappedTestimonials
      : mock.testimonials,
    faqTabs: [...COURSE_FAQ_TABS],
    faqItems: faqItems.length ? faqItems : mock.faqItems,
    labels,
  };
}

function feedChipDate(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "TBA", time: "" };
  const d = new Date(iso);
  const month = d
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = d.getDate();
  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date: `${month} ${day}`, time };
}

/** Published live events for the feed calendar + chips. */
export async function listFeedUpcomingEvents(): Promise<FeedUpcomingEvent[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, starts_at, summary, mode, host, top_label")
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("starts_at", { ascending: true })
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const chip = feedChipDate(row.starts_at);
    return {
      id: String(row.id),
      title: row.title,
      date: chip.date,
      time: chip.time,
      blurb: row.summary || row.top_label || row.host || "",
      mode: row.mode || "Online",
      startsAt: row.starts_at,
    };
  });
}
