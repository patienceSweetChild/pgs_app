import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  SessionDetail,
  UpcomingSession,
} from "@/features/purpleevents/content";
import type { ProgramCardData } from "@/components/cards/types";
import type { FeedUpcomingEvent } from "@/features/dashboard/content";

export type LifecyclePhase = "live" | "ended" | "archived";

function monthDayParts(iso: string | null): {
  day: string;
  month: string;
  time: string;
} {
  if (!iso) return { day: "--", month: "", time: "" };
  const d = new Date(iso);
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

export async function listLiveEvents(): Promise<UpcomingSession[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, starts_at, ends_at, who_is_it_for, session_topics, mode, summary, host, badge",
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
      ? row.session_topics.split("\n").filter(Boolean)
      : undefined,
    image: "/assets/img/tab-img.jpg",
    author: row.host || undefined,
    tags: row.badge ? [row.badge] : undefined,
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
      "id, title, starts_at, ends_at, who_is_it_for, session_topics, mode, summary, description, host, badge, what_we_cover, top_label",
    )
    .eq("id", numericId)
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .maybeSingle();

  if (!row) return null;

  const { data: facilitators } = await supabase
    .from("event_facilitators")
    .select("name, role")
    .eq("event_id", row.id)
    .order("display_order", { ascending: true });

  const whoLines = row.who_is_it_for
    ? row.who_is_it_for.split("\n").filter(Boolean)
    : [];
  const topics = row.session_topics
    ? row.session_topics.split("\n").filter(Boolean)
    : [];
  const cover = row.what_we_cover
    ? row.what_we_cover.split("\n").filter(Boolean)
    : [];

  return {
    id: String(row.id),
    title: row.title,
    start: monthDayParts(row.starts_at),
    end: monthDayParts(row.ends_at),
    whoFor: row.who_is_it_for || undefined,
    topics,
    image: "/assets/img/tab-img.jpg",
    author: row.host || undefined,
    tags: row.badge ? [row.badge] : undefined,
    mode: row.mode || undefined,
    blurb: row.summary || undefined,
    host: row.host || "",
    subtitle: row.top_label || row.summary || "",
    description: row.description || row.summary || "",
    whoForLines: whoLines,
    sessionTopics: topics,
    coverItems: cover,
    note: "",
    about: row.description || "",
    facilitators: (facilitators ?? []).map((f) => ({
      name: f.name,
      role: f.role,
      image: "/assets/img/founder.png",
    })),
  };
}

export async function listLivePrograms(): Promise<ProgramCardData[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("programs")
    .select(
      "id, title, slug, short_description, badge_text, close_date_text, highlight_1, highlight_2",
    )
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("display_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: String(row.id),
    type: "program" as const,
    href: `/cvreadyprogram#${row.slug}`,
    image: "/assets/img/saved_4.jpg",
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
    badge: row.badge_text || undefined,
  }));
}

export async function listLiveCourses(): Promise<ProgramCardData[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, slug, short_description, duration, mode, ends_on")
    .eq("published", true)
    .eq("lifecycle_phase", "live")
    .order("display_order", { ascending: true });

  return (data ?? []).map((row) => ({
    id: String(row.id),
    type: "program" as const,
    href: `/purpleboard#${row.slug}`,
    image: "/assets/img/library.jpg",
    title: row.title,
    tags: [row.mode, row.duration].filter(Boolean),
    col: "half" as const,
    details: [
      { label: "Mode", value: row.mode || "—" },
      { label: "Duration", value: row.duration || "—" },
    ],
    variant: "compact" as const,
  }));
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
