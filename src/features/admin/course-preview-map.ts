/**
 * Maps one courses-table row → the same visual template shapes as events
 * + Programsfull standalone CourseDetail.
 */

import type {
  InternshipCardData,
  ProgramCardData,
  PromoCardData,
} from "@/components/cards/types";
import type { FeedUpcomingEvent } from "@/features/dashboard/content";
import type {
  SessionDetail,
  UpcomingSession,
} from "@/features/purpleevents/content";
import type {
  CourseDetail,
  CoursePageLabels,
} from "@/features/programsfull/content";
import {
  COURSE_FAQ_TABS,
  COURSE_PAGE_MOCK,
  DEFAULT_COURSE_SECTION_LABELS,
  parseCourseFacts,
  parseCourseFaqs,
} from "@/features/programsfull/content";
import { splitCmsLines } from "@/components/CmsHtml";
import {
  DEFAULT_COURSE_BADGE_ICON,
  normalizeHex,
} from "@/components/cards/badge-chip-style";
import {
  COURSE_VISUAL_KEYS,
  COURSE_VISUAL_LABELS,
  LEGACY_VISUAL_KEYS,
  PAGE_SURFACE_KEYS,
  type CourseVisualKey,
  parseCardSurfaces,
  isCardSurfaceEnabled,
  toggleCardSurface,
} from "@/lib/catalog/card-surfaces";

export {
  COURSE_VISUAL_KEYS,
  COURSE_VISUAL_LABELS,
  type CourseVisualKey,
  parseCardSurfaces as parseCourseCardSurfaces,
  isCardSurfaceEnabled as isCourseCardSurfaceEnabled,
  toggleCardSurface as toggleCourseCardSurface,
};

const FIRE = DEFAULT_COURSE_BADGE_ICON;
const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const PROMO_IMG = "/assets/img/saved_1.jpg";
const INTERNSHIP_IMG = "/assets/img/saved_3.jpg";
const SAVED_IMG = "/assets/img/saved_4.jpg";
const DEFAULT_IMG = "/assets/img/library.jpg";

export type CourseDraft = Record<string, unknown>;

function str(row: CourseDraft, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function draftBadgeColor(row: CourseDraft): string | undefined {
  return normalizeHex(str(row, "badge_color")) ?? undefined;
}

function draftBadgeTextColor(row: CourseDraft): string | undefined {
  return normalizeHex(str(row, "badge_text_color")) ?? undefined;
}

function draftBadgeIcon(row: CourseDraft): string {
  return str(row, "badge_icon_url").trim() || FIRE;
}

function datePartsFromIso(iso: string | null | undefined, fallbackTime = "") {
  if (!iso) return { day: "--", month: "", time: fallbackTime };
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return { day: "--", month: "", time: fallbackTime };
  const mo = d.toLocaleString("en-US", { month: "short" });
  const yr = d.toLocaleString("en-GB", { year: "2-digit" });
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: `${mo} ${yr}`,
    time: fallbackTime,
  };
}

function parseTags(row: CourseDraft): string[] {
  const fromText = splitCmsLines(str(row, "tags_text"))
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
  if (fromText.length) return fromText;
  const mode = str(row, "mode");
  const tags = [mode ? (mode.startsWith("#") ? mode : `#${mode}`) : ""].filter(
    Boolean,
  );
  if (row.featured) tags.push("#Featured");
  return tags.length ? tags : [...COURSE_PAGE_MOCK.tags];
}

function closesLabel(iso: string | null | undefined): string {
  if (!iso) return "Closes On\nTBA";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Closes On\nTBA";
  return `Closes On\n${d.toLocaleString("en-US", { month: "long", day: "numeric" })}`;
}

function feedChipDate(
  iso: string | null | undefined,
  fallbackTime = "",
): { date: string; time: string } {
  if (!iso) return { date: "TBA", time: fallbackTime };
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return { date: "TBA", time: fallbackTime };
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const time =
    fallbackTime ||
    d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  return { date: `${month} ${day}`, time };
}

function courseDetailHref(row: CourseDraft): string {
  const id = row.id;
  if (id == null || id === "" || id === "draft") return "#";
  return `/programsfull/program/${id}`;
}

function courseTags(row: CourseDraft): string[] {
  return parseTags(row);
}

function courseBadge(row: CourseDraft): string {
  return str(row, "badge") || (row.featured ? "Featured" : "Open");
}

function cardImageUrl(row: CourseDraft, fallback: string): string {
  const fromUrl = str(row, "image_url").trim();
  if (fromUrl) return fromUrl;
  return fallback;
}

function promoDate(iso: string | null | undefined): string {
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

function parseSectionLabels(row: CourseDraft): CoursePageLabels {
  const raw = row.section_labels;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CoursePageLabels;
  }
  return {};
}

/** Standalone Programsfull detail page — falls back to COURSE_PAGE_MOCK */
export function courseToDetail(row: CourseDraft): CourseDetail {
  const mock = COURSE_PAGE_MOCK;
  const labels = parseSectionLabels(row);
  const who = str(row, "who_is_it_for");
  const topics = splitCmsLines(str(row, "session_topics"));
  const benefits = splitCmsLines(str(row, "benefits"));
  const highlights = [
    str(row, "highlight_1"),
    str(row, "highlight_2"),
    str(row, "highlight_3"),
    str(row, "highlight_4"),
  ]
    .map((s) => s.trim())
    .filter(Boolean);
  const booking = str(row, "booking_url");
  const sessionTime = str(row, "session_time").trim() || mock.sessionTime;
  const startsOn = str(row, "starts_on");
  const endsOn = str(row, "ends_on");
  const start = startsOn
    ? datePartsFromIso(startsOn, sessionTime)
    : mock.start;
  const end = endsOn ? datePartsFromIso(endsOn, sessionTime) : mock.end;
  const partnerLogo =
    str(row, "partner_logo_url").trim() ||
    str(row, "image_url").trim() ||
    mock.partnerLogo;
  const image =
    str(row, "image_url").trim() ||
    (str(row, "image_asset_id") ? DEFAULT_IMG : mock.image);
  const galleryFromDraft = [
    str(row, "gallery_image_1_url").trim(),
    str(row, "gallery_image_2_url").trim(),
    str(row, "gallery_image_3_url").trim(),
  ].filter(Boolean);
  const accreditationFromDraft = splitCmsLines(str(row, "accreditation_logos"))
    .map((s) => s.trim())
    .filter(Boolean);
  const benefitsAside =
    str(row, "benefits_aside").trim() ||
    labels.benefitsAside?.trim() ||
    DEFAULT_COURSE_SECTION_LABELS.benefitsAside;
  const brochureTitle =
    str(row, "brochure_title").trim() ||
    labels.brochureTitle?.trim() ||
    DEFAULT_COURSE_SECTION_LABELS.brochureTitle;
  const brochureBody =
    str(row, "brochure_body").trim() ||
    labels.brochureBody?.trim() ||
    DEFAULT_COURSE_SECTION_LABELS.brochureBody;

  return {
    id: String(row.id ?? "draft"),
    title: str(row, "title").trim() || mock.title,
    shortDescription:
      str(row, "short_description").trim() || mock.shortDescription,
    description: str(row, "description").trim() || mock.description,
    image,
    partnerLogo,
    brochureUrl: str(row, "brochure_url") || undefined,
    brochureTitle,
    brochureBody,
    brochureBadge: str(row, "brochure_badge").trim() || undefined,
    mode: str(row, "mode").trim() || mock.mode,
    duration: str(row, "duration").trim() || mock.duration,
    programType: str(row, "program_type").trim() || mock.programType,
    badge: str(row, "badge").trim() || mock.badge,
    badgeColor: draftBadgeColor(row),
    badgeTextColor: draftBadgeTextColor(row),
    badgeIcon: draftBadgeIcon(row),
    location: str(row, "location").trim() || mock.location,
    headline: str(row, "headline").trim() || mock.headline,
    heroNote: str(row, "hero_note").trim() || mock.heroNote,
    sessionTime,
    featured: Boolean(row.featured),
    tags: parseTags(row),
    whoFor: who || mock.whoFor,
    whoForLines: splitCmsLines(who).length
      ? splitCmsLines(who)
      : mock.whoForLines,
    sessionTopics: topics.length ? topics : mock.sessionTopics,
    highlights: highlights.length ? highlights : mock.highlights,
    benefits: benefits.length ? benefits : mock.benefits,
    benefitsAside,
    bookingUrl: booking || undefined,
    start: { ...start, time: sessionTime },
    end: { ...end, time: sessionTime },
    startsOn: startsOn || mock.startsOn,
    endsOn: endsOn || mock.endsOn,
    awardingBodyIntro:
      str(row, "awarding_body_intro").trim() || mock.awardingBodyIntro,
    awardingBodyFacts: (() => {
      const facts = parseCourseFacts(str(row, "awarding_body_facts"));
      return facts.length ? facts : mock.awardingBodyFacts;
    })(),
    awardingBodyRankings:
      str(row, "awarding_body_rankings").trim() || mock.awardingBodyRankings,
    awardingBodyImage:
      str(row, "awarding_body_image_url").trim() || mock.awardingBodyImage,
    accreditationLogos: accreditationFromDraft.length
      ? accreditationFromDraft
      : mock.accreditationLogos,
    applyIntro: str(row, "apply_intro").trim() || mock.applyIntro,
    eligibility: (() => {
      const list = splitCmsLines(str(row, "eligibility"));
      return list.length ? list : mock.eligibility;
    })(),
    certificateHeading:
      str(row, "certificate_heading").trim() || mock.certificateHeading,
    certificateWhy: (() => {
      const list = splitCmsLines(str(row, "certificate_why"));
      return list.length ? list : mock.certificateWhy;
    })(),
    galleryTitle: str(row, "gallery_title").trim() || mock.galleryTitle,
    galleryBlurb: str(row, "gallery_blurb").trim() || mock.galleryBlurb,
    galleryLocation:
      str(row, "gallery_location").trim() || mock.galleryLocation,
    galleryBody: str(row, "gallery_body").trim() || mock.galleryBody,
    galleryImages: galleryFromDraft.length
      ? galleryFromDraft
      : mock.galleryImages,
    feeAmount: str(row, "fee_amount").trim() || mock.feeAmount,
    feeSubtitle: str(row, "fee_subtitle").trim() || mock.feeSubtitle,
    feeBadge: str(row, "fee_badge").trim() || mock.feeBadge,
    feeNote: str(row, "fee_note").trim() || mock.feeNote,
    feeIncludes: (() => {
      const list = splitCmsLines(str(row, "fee_includes"));
      return list.length ? list : mock.feeIncludes;
    })(),
    otherExpenseLabel:
      str(row, "other_expense_label").trim() || mock.otherExpenseLabel,
    otherExpenseAmount:
      str(row, "other_expense_amount").trim() || mock.otherExpenseAmount,
    paymentMethods:
      str(row, "payment_methods").trim() || mock.paymentMethods,
    learnersIntro: str(row, "learners_intro").trim() || mock.learnersIntro,
    testimonials: (() => {
      const raw = Array.isArray(row.testimonials) ? row.testimonials : [];
      const mapped = raw
        .map((item) => {
          const t = item as Record<string, unknown>;
          const name = String(t.name ?? "").trim();
          const quote = String(t.quote ?? "").trim();
          if (!name && !quote) return null;
          return {
            name: name || "Student",
            quote: quote || mock.testimonials[0]?.quote || "",
            role: String(t.role ?? ""),
            location: String(t.location ?? ""),
            image:
              String(t.image_url ?? "").trim() ||
              "/assets/img/photo-2.jpg",
          };
        })
        .filter(Boolean) as CourseDetail["testimonials"];
      return mapped.length ? mapped : mock.testimonials;
    })(),
    faqTabs: [...COURSE_FAQ_TABS],
    faqItems: (() => {
      const parsed = parseCourseFaqs(str(row, "faq_items"));
      return parsed.length ? parsed : mock.faqItems;
    })(),
    labels: {
      ...DEFAULT_COURSE_SECTION_LABELS,
      ...labels,
    },
  };
}

/** Prefill new course form + preview with the Figma mock page */
export function courseMockDraft(): CourseDraft {
  const mock = COURSE_PAGE_MOCK;
  return {
    title: mock.title,
    slug: "",
    short_description: mock.shortDescription,
    description: mock.description,
    duration: mock.duration,
    mode: mock.mode,
    program_type: mock.programType,
    badge: mock.badge,
    location: mock.location,
    headline: mock.headline,
    hero_note: mock.heroNote,
    session_time: mock.sessionTime,
    tags_text: mock.tags.join("\n"),
    benefits: mock.benefits.join("\n"),
    who_is_it_for: mock.whoForLines.join("\n"),
    session_topics: mock.sessionTopics.join("\n"),
    highlight_1: mock.highlights[0] ?? "",
    highlight_2: mock.highlights[1] ?? "",
    highlight_3: mock.highlights[2] ?? "",
    highlight_4: mock.highlights[3] ?? "",
    booking_url: "",
    starts_on: mock.startsOn ?? "2025-12-31",
    ends_on: mock.endsOn ?? "2026-01-01",
    display_order: 0,
    published: true,
    featured: true,
    lifecycle_phase: "live",
    image_asset_id: null,
    brochure_asset_id: null,
    partner_logo_asset_id: null,
    awarding_body_image_asset_id: null,
    category_id: "",
    university_id: "",
    card_surfaces: [...LEGACY_VISUAL_KEYS, ...PAGE_SURFACE_KEYS],
    awarding_body_intro: mock.awardingBodyIntro,
    awarding_body_facts: mock.awardingBodyFacts
      .map((f) => (f.body ? `${f.title}||${f.body}` : f.title))
      .join("\n"),
    awarding_body_rankings: mock.awardingBodyRankings,
    apply_intro: mock.applyIntro,
    eligibility: mock.eligibility.join("\n"),
    certificate_heading: mock.certificateHeading,
    certificate_why: mock.certificateWhy.join("\n"),
    gallery_title: mock.galleryTitle,
    gallery_blurb: mock.galleryBlurb,
    gallery_location: mock.galleryLocation,
    gallery_body: mock.galleryBody,
    gallery_image_1_asset_id: null,
    gallery_image_2_asset_id: null,
    gallery_image_3_asset_id: null,
    gallery_image_1_url: mock.galleryImages[0] ?? "",
    gallery_image_2_url: mock.galleryImages[1] ?? "",
    gallery_image_3_url: mock.galleryImages[2] ?? "",
    fee_amount: mock.feeAmount,
    fee_subtitle: mock.feeSubtitle,
    fee_badge: mock.feeBadge,
    fee_note: mock.feeNote,
    fee_includes: mock.feeIncludes.join("\n"),
    other_expense_label: mock.otherExpenseLabel,
    other_expense_amount: mock.otherExpenseAmount,
    payment_methods: mock.paymentMethods,
    learners_intro: mock.learnersIntro,
    faq_items: mock.faqItems
      .map((f) => `${f.tab || "tab_1"}||${f.q}||${f.a}`)
      .join("\n"),
    section_labels: { ...DEFAULT_COURSE_SECTION_LABELS },
    benefits_aside: DEFAULT_COURSE_SECTION_LABELS.benefitsAside,
    brochure_title: DEFAULT_COURSE_SECTION_LABELS.brochureTitle,
    brochure_body: DEFAULT_COURSE_SECTION_LABELS.brochureBody,
    brochure_badge: "",
    accreditation_logos: mock.accreditationLogos.join("\n"),
    card_dates_rail: "Dates You Should Be Aware off.",
    card_promo_title: "Dates\nExtended",
    card_promo_subtitle: "Check\nWith US",
    card_promo_date: "",
    card_cta_label: "Learn More",
    testimonials: mock.testimonials.map((t) => ({
      name: t.name,
      quote: t.quote,
      role: t.role,
      location: t.location,
      image_asset_id: null,
      image_url: t.image,
    })),
  };
}

/** Saved list — program full */
export function courseToProgramFull(row: CourseDraft): ProgramCardData {
  const summary = str(row, "short_description") || str(row, "description");
  const mode = str(row, "mode");
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: courseDetailHref(row),
    image: cardImageUrl(row, SAVED_IMG),
    title: str(row, "title", "Untitled course"),
    tags: courseTags(row),
    saved: true,
    badge: courseBadge(row),
    badgeIcon: draftBadgeIcon(row),
    badgeColor: draftBadgeColor(row),
    badgeTextColor: draftBadgeTextColor(row),
    logo: LOGO,
    logoAlt: "Course",
    details: [
      {
        label: "About",
        value: summary || "—",
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
        promoDate(str(row, "ends_on") || str(row, "starts_on") || null) ||
        closesLabel(str(row, "ends_on") || null).replace("Closes On\n", ""),
    },
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

/** Saved list — promo card */
export function courseToPromoCard(row: CourseDraft): PromoCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "promo",
    col: "third",
    href: courseDetailHref(row),
    image: cardImageUrl(row, PROMO_IMG),
    title: str(row, "title", "Untitled course"),
    description: str(row, "short_description") || str(row, "description"),
    tags: courseTags(row),
    saved: false,
    seatBadge: courseBadge(row),
    seatBadgeIcon: draftBadgeIcon(row),
    seatBadgeColor: draftBadgeColor(row),
    seatBadgeTextColor: draftBadgeTextColor(row),
    overlayBadge: str(row, "mode") || "Start Free",
    closesOn: closesLabel(str(row, "ends_on") || str(row, "starts_on") || null),
  };
}

/** Saved list — internship card */
export function courseToInternshipCard(row: CourseDraft): InternshipCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "internship",
    col: "half",
    href: courseDetailHref(row),
    image: cardImageUrl(row, INTERNSHIP_IMG),
    title: str(row, "title", "Untitled course"),
    description: str(row, "short_description") || str(row, "description"),
    tags: courseTags(row),
    saved: true,
    overlayBadge: courseBadge(row),
    batchLabel: (str(row, "mode") || "COURSE").toUpperCase(),
  };
}

/** Saved list — program compact */
export function courseToProgramCompact(row: CourseDraft): ProgramCardData {
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: courseDetailHref(row),
    image: cardImageUrl(row, SAVED_IMG),
    title: str(row, "title", "Untitled course"),
    tags: courseTags(row),
    saved: false,
    badge: courseBadge(row),
    badgeIcon: draftBadgeIcon(row),
    badgeColor: draftBadgeColor(row),
    badgeTextColor: draftBadgeTextColor(row),
    logo: LOGO,
    logoAlt: "Course",
    details: [
      { label: "Location", value: str(row, "location") || "—" },
      { label: "Duration", value: str(row, "duration") || "—" },
    ],
    variant: "compact",
    ctaLabel: str(row, "card_cta_label").trim() || "Learn More",
  };
}

/** Feed / add-to-calendar chip (same shape as events) */
export function courseToFeedChip(row: CourseDraft): FeedUpcomingEvent {
  const sessionTime = str(row, "session_time");
  const chip = feedChipDate(str(row, "starts_on") || null, sessionTime);
  return {
    id: String(row.id ?? "draft"),
    title: str(row, "title", "Untitled course"),
    date: chip.date,
    time: chip.time,
    blurb:
      str(row, "short_description") ||
      str(row, "headline") ||
      str(row, "hero_note"),
    mode: str(row, "mode") || "Online",
    startsAt: str(row, "starts_on") || null,
  };
}

/** Upcoming session card preview (same DOM as events) */
export function courseToUpcomingSession(row: CourseDraft): UpcomingSession {
  const mock = COURSE_PAGE_MOCK;
  const topics = splitCmsLines(str(row, "session_topics"));
  const sessionTime = str(row, "session_time") || mock.sessionTime;
  const start = datePartsFromIso(str(row, "starts_on") || null, sessionTime);
  const end = datePartsFromIso(str(row, "ends_on") || null, sessionTime);
  const image =
    str(row, "image_url") ||
    (typeof row.image === "string" ? row.image : "") ||
    DEFAULT_IMG;
  return {
    id: String(row.id ?? "draft"),
    title: str(row, "title").trim() || mock.title,
    start,
    end,
    whoFor: str(row, "who_is_it_for") || mock.whoFor,
    topics: topics.length ? topics : mock.sessionTopics,
    image,
    author: str(row, "location") || undefined,
    tags: courseTags(row),
    mode: str(row, "mode") || mock.mode,
    blurb: str(row, "short_description") || mock.shortDescription,
  };
}

/** Hero / featured preview (same DOM as events) */
export function courseToSessionDetail(row: CourseDraft): SessionDetail {
  const mock = COURSE_PAGE_MOCK;
  const base = courseToUpcomingSession(row);
  const whoLines = splitCmsLines(str(row, "who_is_it_for"));
  const topics = splitCmsLines(str(row, "session_topics"));
  return {
    ...base,
    host: str(row, "location") || mock.location,
    subtitle: str(row, "headline") || mock.headline,
    description:
      str(row, "description") ||
      str(row, "short_description") ||
      mock.description,
    whoForLines: whoLines.length ? whoLines : mock.whoForLines,
    sessionTopics: topics.length ? topics : mock.sessionTopics,
    coverItems: [],
    note: str(row, "hero_note") || mock.heroNote,
    about:
      str(row, "description") ||
      str(row, "short_description") ||
      mock.description,
    facilitators: [],
    testimonials: [],
    enrollLabel: str(row, "badge") || mock.badge,
    badgeColor: draftBadgeColor(row),
    badgeTextColor: draftBadgeTextColor(row),
    badgeIcon: draftBadgeIcon(row),
  };
}

