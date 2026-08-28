/**
 * Maps one events-table row → the 7 public presentation shapes.
 * Shared fields stay in sync; layouts only differ in how they display them.
 */

import type { FeedUpcomingEvent } from "@/features/dashboard/content";
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
  SESSION_PAGE_MOCK,
} from "@/features/purpleevents/content";
import type {
  InternshipCardData,
  ProgramCardData,
  PromoCardData,
} from "@/components/cards/types";
import { splitCmsLines } from "@/components/CmsHtml";
import type { FacilitatorDraft } from "./EventFacilitatorsField";
import { parseFaqDraft } from "./EventFaqField";
import type { TestimonialDraft } from "./EventTestimonialsField";
import {
  DEFAULT_COURSE_BADGE_ICON,
  DEFAULT_EVENT_BADGE_ICON,
  normalizeHex,
} from "@/components/cards/badge-chip-style";
import {
  EVENT_VISUAL_KEYS,
  EVENT_VISUAL_LABELS,
  LEGACY_VISUAL_KEYS,
  PAGE_SURFACE_KEYS,
  type EventVisualKey,
  parseCardSurfaces,
  isCardSurfaceEnabled,
  toggleCardSurface,
} from "@/lib/catalog/card-surfaces";

export {
  EVENT_VISUAL_KEYS,
  EVENT_VISUAL_LABELS,
  type EventVisualKey,
  parseCardSurfaces,
  isCardSurfaceEnabled,
  toggleCardSurface,
};

const FIRE = DEFAULT_COURSE_BADGE_ICON;
const EVENT_FIRE = DEFAULT_EVENT_BADGE_ICON;
const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const DEFAULT_IMG = "/assets/img/tab-img.jpg";
const SAVED_IMG = "/assets/img/saved_4.jpg";
const PROMO_IMG = "/assets/img/saved_1.jpg";
const INTERNSHIP_IMG = "/assets/img/saved_3.jpg";

export type EventDraft = Record<string, unknown>;

function str(row: EventDraft, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function draftBadgeColor(row: EventDraft): string | undefined {
  return normalizeHex(str(row, "badge_color")) ?? undefined;
}

function draftBadgeTextColor(row: EventDraft): string | undefined {
  return normalizeHex(str(row, "badge_text_color")) ?? undefined;
}

function draftBadgeIcon(
  row: EventDraft,
  fallback: string = FIRE,
): string {
  return str(row, "badge_icon_url").trim() || fallback;
}

function lines(text: string): string[] {
  return splitCmsLines(text).map((s) => s.trim()).filter(Boolean);
}

function parseTagsText(value: string, fallback: string[] = []): string[] {
  const fromText = lines(value).map((t) => (t.startsWith("#") ? t : `#${t}`));
  return fromText.length > 0 ? fromText : fallback;
}

function monthDayParts(iso: string | null | undefined): {
  day: string;
  month: string;
  time: string;
} {
  if (!iso) return { day: "--", month: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "--", month: "", time: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-GB", { month: "short", year: "2-digit" }),
    time: d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function feedChipDate(iso: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!iso) return { date: "TBA", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "TBA", time: "" };
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const time = d.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return { date: `${month} ${day}`, time };
}

function closesLabel(iso: string | null | undefined): string {
  if (!iso) return "Closes On\nTBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Closes On\nTBA";
  return `Closes On\n${d.toLocaleString("en-US", { month: "long", day: "numeric" })}`;
}

function promoDate(iso: string | null | undefined): string {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBA";
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

function heroImageUrl(row: EventDraft): string {
  const fromUrl = str(row, "image_url").trim();
  if (fromUrl) return fromUrl;
  return DEFAULT_IMG;
}

function cardImageUrl(row: EventDraft, fallback: string): string {
  const fromUrl = str(row, "image_url").trim();
  if (fromUrl) return fromUrl;
  const assetOnly = str(row, "image_asset_id").trim();
  if (assetOnly) {
    /* URL should already be hydrated on the draft in the editor */
  }
  return fallback;
}

function parseSectionLabels(row: EventDraft): SessionPageLabels {
  const raw = row.section_labels;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as SessionPageLabels;
  }
  return {};
}

function labelOr(
  labels: SessionPageLabels,
  key: keyof SessionPageLabels,
  fallback: string,
): string {
  const v = labels[key];
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

export function eventToUpcomingSession(row: EventDraft): UpcomingSession {
  const topics = lines(str(row, "session_topics"));
  const badge = str(row, "badge");
  const title = str(row, "title").trim() || "Untitled event";
  return {
    id: String(row.id ?? "draft"),
    title,
    start: monthDayParts(str(row, "starts_at") || null),
    end: monthDayParts(str(row, "ends_at") || null),
    whoFor: str(row, "who_is_it_for"),
    topics,
    image: heroImageUrl(row),
    author: str(row, "host"),
    tags: parseTagsText(str(row, "tags_text"), badge ? [badge] : []),
    mode: str(row, "mode"),
    blurb: str(row, "summary"),
  };
}

export function eventToSessionDetail(row: EventDraft): SessionDetail {
  const base = eventToUpcomingSession(row);
  const whoLines = lines(str(row, "who_is_it_for"));
  const topics = lines(str(row, "session_topics"));
  const cover = lines(str(row, "what_we_cover"));
  const benefitsAside = lines(str(row, "benefits_aside"));
  const benefits = lines(str(row, "benefits"));
  const description = str(row, "description").trim();
  const topLabel = str(row, "top_label").trim();
  const note = str(row, "location_note").trim();
  const labels = parseSectionLabels(row);

  const rawFacilitators = Array.isArray(row.facilitators)
    ? row.facilitators
    : [];
  const facilitators = rawFacilitators
    .map((raw) => {
      const f = raw as Record<string, unknown>;
      const name = String(f.name ?? "").trim();
      if (!name) return null;
      return {
        name,
        role: String(f.role ?? ""),
        image:
          String(f.image_url ?? "").trim() || "/assets/img/founder.png",
      };
    })
    .filter(Boolean) as SessionDetail["facilitators"];

  const rawTestimonials = Array.isArray(row.testimonials)
    ? row.testimonials
    : [];
  const testimonials = rawTestimonials
    .map((raw) => {
      const t = raw as Record<string, unknown>;
      const name = String(t.name ?? "").trim();
      const quote = String(t.quote ?? "").trim();
      if (!name && !quote) return null;
      return {
        name: name || "Student",
        quote,
        role: String(t.role ?? ""),
        location: String(t.location ?? ""),
        image:
          String(t.image_url ?? "").trim() || "/assets/img/photo-2.jpg",
      };
    })
    .filter(Boolean) as NonNullable<SessionDetail["testimonials"]>;

  const posterTopics = lines(str(row, "poster_topics"));
  const faqParsed = parseFaqDraft(str(row, "faq_items"));
  const highlightImages = [
    str(row, "highlight_image_1_url").trim(),
    str(row, "highlight_image_2_url").trim(),
    str(row, "highlight_image_3_url").trim(),
  ].filter(Boolean);

  return {
    ...base,
    host: str(row, "host").trim(),
    subtitle: topLabel,
    description,
    whoForLines: whoLines,
    sessionTopics: topics,
    coverItems: cover,
    benefitsAsideLines:
      benefitsAside.length > 0
        ? benefitsAside
        : SESSION_PAGE_MOCK.benefitsAsideLines,
    benefits:
      benefits.length > 0 ? benefits : [...(SESSION_PAGE_MOCK.benefits ?? [])],
    note: note || SESSION_PAGE_MOCK.note,
    about: description,
    facilitators,
    testimonials,
    enrollLabel: str(row, "badge").trim() || "Enroll Now",
    badgeColor: draftBadgeColor(row),
    badgeTextColor: draftBadgeTextColor(row),
    badgeIcon: draftBadgeIcon(row, EVENT_FIRE),
    image: base.image,
    showUpcomingSessions: row.show_upcoming_sessions !== false,
    roadmap: {
      title: str(row, "roadmap_title").trim() || ROADMAP.title,
      body: str(row, "roadmap_body").trim() || ROADMAP.body,
      footer: str(row, "roadmap_footer").trim() || ROADMAP.footer,
    },
    poster: {
      title: str(row, "poster_title").trim() || DOWNLOAD_COPY.title,
      body: str(row, "poster_body").trim() || DOWNLOAD_COPY.body,
      inviteTitle:
        str(row, "poster_invite_title").trim() || DOWNLOAD_COPY.inviteTitle,
      inviteBody:
        str(row, "poster_invite_body").trim() || DOWNLOAD_COPY.inviteBody,
      live: str(row, "poster_live").trim() || DOWNLOAD_COPY.live,
      topics: posterTopics.length > 0 ? posterTopics : [...DOWNLOAD_COPY.topics],
      qrUrl: str(row, "poster_qr_url").trim() || "/assets/img/qr-2.png",
      bgUrl: str(row, "poster_bg_url").trim() || "/assets/img/green-1.png",
    },
    highlights: {
      heading:
        str(row, "highlight_heading").trim() ||
        labelOr(labels, "highlights", DEFAULT_SECTION_LABELS.highlights),
      title:
        str(row, "highlight_title").trim() ||
        SESSION_PAGE_MOCK.highlights?.title ||
        "",
      location:
        str(row, "highlight_location").trim() ||
        SESSION_PAGE_MOCK.highlights?.location ||
        "",
      body:
        str(row, "highlight_body").trim() ||
        SESSION_PAGE_MOCK.highlights?.body ||
        "",
      images:
        highlightImages.length > 0
          ? highlightImages
          : SESSION_PAGE_MOCK.highlights?.images || [],
    },
    cta: {
      eyebrow: str(row, "cta_eyebrow").trim() || "Let's Go",
      title:
        str(row, "cta_title").trim() ||
        labelOr(labels, "cta", DEFAULT_SECTION_LABELS.cta),
      body:
        str(row, "cta_body").trim() ||
        "Let’s chart your study abroad path, together with Team #PGS.",
      buttonLabel: str(row, "cta_button_label").trim() || "Start Your Journey",
      buttonHref: str(row, "cta_button_href").trim() || "/contact",
    },
    faqItems:
      faqParsed.length > 0
        ? faqParsed
        : FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a })),
    labels: {
      ...DEFAULT_SECTION_LABELS,
      ...labels,
    },
  };
}

/** Prefill a new event form with the public mock session page. */
export function eventMockDraft(): EventDraft {
  const mock = SESSION_PAGE_MOCK;
  const facilitators: FacilitatorDraft[] = mock.facilitators.map((f) => ({
    name: f.name,
    role: f.role,
    biography: "",
    image_asset_id: null,
    image_url: f.image,
  }));
  const testimonials: TestimonialDraft[] = (mock.testimonials ?? []).map(
    (t) => ({
      name: t.name,
      quote: t.quote,
      role: t.role,
      location: t.location,
      image_asset_id: null,
      image_url: t.image,
    }),
  );

  return {
    title: mock.title,
    slug: "",
    summary: mock.blurb ?? "",
    description: mock.description,
    host: mock.host,
    top_label: mock.subtitle,
    badge: mock.enrollLabel ?? "Enroll Now",
    tags_text: (mock.tags ?? []).join("\n"),
    location: "Online",
    location_note: mock.note,
    show_upcoming_sessions: true,
    mode: mock.mode ?? "#Online",
    starts_at: "2026-05-28T13:44:00",
    ends_at: "2026-05-30T17:44:00",
    booking_url: "",
    who_is_it_for: mock.whoForLines.join("\n"),
    session_topics: mock.sessionTopics.join("\n"),
    what_we_cover: mock.coverItems.join("\n"),
    benefits_aside: (mock.benefitsAsideLines ?? []).join("\n"),
    benefits: (mock.benefits ?? []).join("\n"),
    roadmap_title: mock.roadmap?.title ?? ROADMAP.title,
    roadmap_body: mock.roadmap?.body ?? ROADMAP.body,
    roadmap_footer: mock.roadmap?.footer ?? ROADMAP.footer,
    poster_title: mock.poster?.title ?? DOWNLOAD_COPY.title,
    poster_body: mock.poster?.body ?? DOWNLOAD_COPY.body,
    poster_invite_title: mock.poster?.inviteTitle ?? DOWNLOAD_COPY.inviteTitle,
    poster_invite_body: mock.poster?.inviteBody ?? DOWNLOAD_COPY.inviteBody,
    poster_live: mock.poster?.live ?? DOWNLOAD_COPY.live,
    poster_topics: (mock.poster?.topics ?? [...DOWNLOAD_COPY.topics]).join("\n"),
    poster_qr_asset_id: null,
    poster_qr_url: mock.poster?.qrUrl ?? "/assets/img/qr-2.png",
    poster_bg_asset_id: null,
    poster_bg_url: mock.poster?.bgUrl ?? "/assets/img/green-1.png",
    highlight_heading: mock.highlights?.heading ?? DEFAULT_SECTION_LABELS.highlights,
    highlight_title: mock.highlights?.title ?? "",
    highlight_location: mock.highlights?.location ?? "",
    highlight_body: mock.highlights?.body ?? "",
    highlight_image_1_asset_id: null,
    highlight_image_2_asset_id: null,
    highlight_image_3_asset_id: null,
    highlight_image_1_url: mock.highlights?.images?.[0] ?? "",
    highlight_image_2_url: mock.highlights?.images?.[1] ?? "",
    highlight_image_3_url: mock.highlights?.images?.[2] ?? "",
    cta_eyebrow: mock.cta?.eyebrow ?? "Let's Go",
    cta_title: mock.cta?.title ?? DEFAULT_SECTION_LABELS.cta,
    cta_body: mock.cta?.body ?? "",
    cta_button_label: mock.cta?.buttonLabel ?? "Start Your Journey",
    cta_button_href: mock.cta?.buttonHref ?? "/contact",
    faq_items: (mock.faqItems ?? []).map((f) => `${f.q}||${f.a}`).join("\n"),
    section_labels: { ...DEFAULT_SECTION_LABELS, ...(mock.labels ?? {}) },
    card_dates_rail: "Dates You Should Be Aware off.",
    card_promo_title: "Dates\nExtended",
    card_promo_subtitle: "Check\nWith US",
    card_promo_date: "",
    card_cta_label: "Learn More",
    display_order: 0,
    published: false,
    lifecycle_phase: "live",
    image_asset_id: null,
    category_id: "",
    card_surfaces: [...LEGACY_VISUAL_KEYS, ...PAGE_SURFACE_KEYS],
    facilitators,
    testimonials,
  };
}

export function eventToFeedChip(row: EventDraft): FeedUpcomingEvent {
  const chip = feedChipDate(str(row, "starts_at") || null);
  return {
    id: String(row.id ?? "draft"),
    title: str(row, "title", "Untitled event"),
    date: chip.date,
    time: chip.time,
    blurb: str(row, "summary") || str(row, "top_label") || str(row, "host"),
    mode: str(row, "mode") || "Online",
    startsAt: str(row, "starts_at") || null,
  };
}

/** Saved list — program full card */
export function eventToProgramFull(row: EventDraft): ProgramCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  const summary = str(row, "summary");
  const fallback = [mode, badge]
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: "#",
    image: cardImageUrl(row, SAVED_IMG),
    title: str(row, "title", "Untitled event"),
    tags: parseTagsText(str(row, "tags_text"), fallback),
    saved: true,
    badge: badge || undefined,
    badgeIcon: badge ? draftBadgeIcon(row) : undefined,
    badgeColor: badge ? draftBadgeColor(row) : undefined,
    badgeTextColor: badge ? draftBadgeTextColor(row) : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event host",
    details: [
      {
        label: "About",
        value: summary || str(row, "description") || "—",
      },
      {
        label: "Location",
        value: str(row, "location") || mode || "—",
      },
      {
        label: "Mode",
        value: mode || "—",
      },
    ],
    variant: "full",
    datesRail:
      str(row, "card_dates_rail").trim() ||
      "Dates You Should Be Aware off.",
    promo: {
      title: str(row, "card_promo_title").trim() || "Dates\nExtended",
      subtitle: str(row, "card_promo_subtitle").trim() || "Check\nWith US",
      date:
        str(row, "card_promo_date").trim() ||
        promoDate(str(row, "starts_at") || null),
    },
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

/** Saved list — promo / SOP-style third card */
export function eventToPromoCard(row: EventDraft): PromoCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  return {
    id: String(row.id ?? "draft"),
    type: "promo",
    col: "third",
    href: "#",
    image: cardImageUrl(row, PROMO_IMG),
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: parseTagsText(str(row, "tags_text"), [
      mode ? `#${mode}` : "#event",
      "#TEAMPGS",
    ].filter(Boolean)),
    saved: false,
    seatBadge: badge || undefined,
    seatBadgeIcon: badge ? draftBadgeIcon(row) : undefined,
    seatBadgeColor: badge ? draftBadgeColor(row) : undefined,
    seatBadgeTextColor: badge ? draftBadgeTextColor(row) : undefined,
    overlayBadge: str(row, "top_label") || "Start Free",
    closesOn: closesLabel(str(row, "ends_at") || str(row, "starts_at") || null),
  };
}

/** Saved list — internship / short country-style half card */
export function eventToInternshipCard(row: EventDraft): InternshipCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  return {
    id: String(row.id ?? "draft"),
    type: "internship",
    col: "half",
    href: "#",
    image: cardImageUrl(row, INTERNSHIP_IMG),
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: parseTagsText(str(row, "tags_text"), [
      mode ? `#${mode}` : "#event",
    ]),
    saved: true,
    overlayBadge: badge || undefined,
    batchLabel: str(row, "top_label") || (mode ? mode.toUpperCase() : "LIVE EVENT"),
  };
}

/** Saved list — program compact card */
export function eventToProgramCompact(row: EventDraft): ProgramCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  const fallback = [mode, badge]
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: "#",
    image: cardImageUrl(row, SAVED_IMG),
    title: str(row, "title", "Untitled event"),
    tags: parseTagsText(str(row, "tags_text"), fallback),
    saved: false,
    badge: badge || undefined,
    badgeIcon: badge ? draftBadgeIcon(row) : undefined,
    badgeColor: badge ? draftBadgeColor(row) : undefined,
    badgeTextColor: badge ? draftBadgeTextColor(row) : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event",
    details: [
      {
        label: "Location",
        value: str(row, "location") || "Online",
      },
      {
        label: "Host",
        value: str(row, "host") || "—",
      },
    ],
    variant: "compact",
  };
}

