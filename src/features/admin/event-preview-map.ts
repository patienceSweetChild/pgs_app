/**
 * Maps one events-table row → the 7 public presentation shapes.
 * Shared fields stay in sync; layouts only differ in how they display them.
 */

import type { FeedUpcomingEvent } from "@/features/dashboard/content";
import type {
  SessionDetail,
  UpcomingSession,
} from "@/features/purpleevents/content";
import type {
  InternshipCardData,
  ProgramCardData,
  PromoCardData,
} from "@/components/cards/types";

const FIRE = "/assets/img/purpleboard/fire.gif";
const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const DEFAULT_IMG = "/assets/img/tab-img.jpg";
const SAVED_IMG = "/assets/img/saved_4.jpg";
const PROMO_IMG = "/assets/img/saved_1.jpg";
const INTERNSHIP_IMG = "/assets/img/half-cut-girl.png";

export type EventDraft = Record<string, unknown>;

function str(row: EventDraft, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function lines(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
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

export function eventToUpcomingSession(row: EventDraft): UpcomingSession {
  const topics = lines(str(row, "session_topics"));
  const badge = str(row, "badge");
  return {
    id: String(row.id ?? "draft"),
    title: str(row, "title", "Untitled event"),
    start: monthDayParts(str(row, "starts_at") || null),
    end: monthDayParts(str(row, "ends_at") || null),
    whoFor: str(row, "who_is_it_for") || undefined,
    topics: topics.length ? topics : undefined,
    image: DEFAULT_IMG,
    author: str(row, "host") || undefined,
    tags: badge ? [badge] : undefined,
    mode: str(row, "mode") || undefined,
    blurb: str(row, "summary") || undefined,
  };
}

export function eventToSessionDetail(row: EventDraft): SessionDetail {
  const base = eventToUpcomingSession(row);
  const whoLines = lines(str(row, "who_is_it_for"));
  const topics = lines(str(row, "session_topics"));
  const cover = lines(str(row, "what_we_cover"));
  const summary = str(row, "summary");
  const description = str(row, "description") || summary;
  return {
    ...base,
    host: str(row, "host") || base.author || "",
    subtitle: str(row, "top_label") || summary,
    description,
    whoForLines: whoLines.length
      ? whoLines
      : ["Final-year student?", "Recent grad?", "This session’s made for you."],
    sessionTopics: topics,
    coverItems: cover,
    note: str(row, "location_note"),
    about: description,
    facilitators: [],
    enrollLabel: str(row, "badge") || "Enroll Now",
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
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: "#",
    image: SAVED_IMG,
    title: str(row, "title", "Untitled event"),
    tags: [mode, badge].filter(Boolean).map((t) => (t.startsWith("#") ? t : `#${t}`)),
    saved: true,
    badge: badge || undefined,
    badgeIcon: badge ? FIRE : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event host",
    details: [
      {
        label: "About",
        value: summary || str(row, "description") || "—",
      },
      {
        label: "Mode",
        value: mode || "—",
      },
    ],
    variant: "full",
    promo: {
      title: "Dates\nExtended",
      subtitle: "Check\nWith US",
      date: promoDate(str(row, "starts_at") || null),
    },
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
    image: PROMO_IMG,
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: [mode ? `#${mode}` : "#event", "#TEAMPGS"].filter(Boolean),
    saved: false,
    seatBadge: badge || undefined,
    seatBadgeIcon: badge ? FIRE : undefined,
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
    image: INTERNSHIP_IMG,
    title: str(row, "title", "Untitled event"),
    description: str(row, "summary") || str(row, "description"),
    tags: [mode ? `#${mode}` : "#event"],
    saved: true,
    overlayBadge: badge || undefined,
    batchLabel: str(row, "top_label") || (mode ? mode.toUpperCase() : "LIVE EVENT"),
  };
}

/** Saved list — program compact card */
export function eventToProgramCompact(row: EventDraft): ProgramCardData {
  const badge = str(row, "badge");
  const mode = str(row, "mode");
  return {
    id: String(row.id ?? "draft"),
    type: "program",
    col: "full",
    href: "#",
    image: SAVED_IMG,
    title: str(row, "title", "Untitled event"),
    tags: [mode, badge].filter(Boolean).map((t) => (t.startsWith("#") ? t : `#${t}`)),
    saved: false,
    badge: badge || undefined,
    badgeIcon: badge ? FIRE : undefined,
    logo: LOGO,
    logoAlt: str(row, "host") || "Event",
    details: [
      {
        label: "Location",
        value: str(row, "location_note") || "Online",
      },
      {
        label: "Host",
        value: str(row, "host") || "—",
      },
    ],
    variant: "compact",
  };
}

export const EVENT_VISUAL_KEYS = [
  "saved_program_full",
  "saved_promo",
  "saved_internship",
  "saved_program_compact",
  "add_to_calendar",
  "events_hero",
  "events_upcoming_card",
] as const;

export type EventVisualKey = (typeof EVENT_VISUAL_KEYS)[number];

export const EVENT_VISUAL_LABELS: Record<EventVisualKey, string> = {
  saved_program_full: "Saved list — program (full)",
  saved_promo: "Saved list — promo card",
  saved_internship: "Saved list — internship card",
  saved_program_compact: "Saved list — program (compact)",
  add_to_calendar: "add to calendar",
  events_hero: "Events page — top / featured",
  events_upcoming_card: "Events page — upcoming session card",
};

const VISUAL_KEY_SET = new Set<string>(EVENT_VISUAL_KEYS);

/** Selected surfaces for an event. Missing/null → all (legacy). Empty → none. */
export function parseCardSurfaces(row: EventDraft): EventVisualKey[] {
  const raw = row.card_surfaces;
  if (raw == null) return [...EVENT_VISUAL_KEYS];
  if (!Array.isArray(raw)) return [...EVENT_VISUAL_KEYS];
  if (raw.length === 0) return [];
  const keys = raw
    .map((v) => String(v))
    // Legacy key from earlier drafts
    .map((v) => (v === "feed_chip" ? "add_to_calendar" : v))
    .filter((v): v is EventVisualKey => VISUAL_KEY_SET.has(v));
  return keys;
}

export function isCardSurfaceEnabled(
  row: EventDraft,
  key: EventVisualKey,
): boolean {
  return parseCardSurfaces(row).includes(key);
}

export function toggleCardSurface(
  row: EventDraft,
  key: EventVisualKey,
  enabled: boolean,
): EventDraft {
  const current = new Set(parseCardSurfaces(row));
  if (enabled) current.add(key);
  else current.delete(key);
  // Keep stable order matching EVENT_VISUAL_KEYS
  const next = EVENT_VISUAL_KEYS.filter((k) => current.has(k));
  return { ...row, card_surfaces: next };
}
