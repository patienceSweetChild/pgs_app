import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  CmsDeadlineRow,
  CmsFact,
  CmsFaq,
  CmsHighlight,
  CmsKeyDate,
  CmsKeyDateGroup,
  CmsLegal,
  CmsNotice,
  CmsPerson,
  CmsPremiumContent,
  CmsSocial,
  CmsStat,
  CmsTestimonial,
  CmsUniversity,
  CmsWeeklyWall,
} from "./cms-types";

export type {
  CmsDeadlineRow,
  CmsFact,
  CmsFaq,
  CmsHighlight,
  CmsKeyDate,
  CmsKeyDateGroup,
  CmsLegal,
  CmsNotice,
  CmsPerson,
  CmsPremiumContent,
  CmsSocial,
  CmsStat,
  CmsTestimonial,
  CmsUniversity,
  CmsWeeklyWall,
} from "./cms-types";

async function sb() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseServerClient();
}

function dateParts(iso: string | null | undefined) {
  if (!iso) return { day: "--", month: "", year: "" };
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: d.toLocaleString("en-GB", { month: "long" }),
    year: String(d.getFullYear()),
  };
}

export async function listPublishedFaqs(): Promise<CmsFaq[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("faqs")
    .select("question, answer, category")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    q: r.question,
    a: r.answer,
    category: r.category || undefined,
  }));
}

export async function listPublishedTestimonials(): Promise<CmsTestimonial[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("testimonials")
    .select("name, role_label, quote")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    name: r.name,
    role: r.role_label || "",
    quote: r.quote,
  }));
}

export async function listContentPeople(
  personType: "founder" | "advisory",
): Promise<CmsPerson[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("content_people")
    .select("name, title, biography")
    .eq("person_type", personType)
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    name: r.name,
    title: r.title || "",
    biography: r.biography || "",
    image: "/assets/img/founder.png",
  }));
}

export async function listPublishedHighlights(): Promise<CmsHighlight[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("highlights")
    .select("title, body")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    title: r.title,
    body: r.body || "",
    image: "/assets/img/g-1.jpg",
  }));
}

export async function listWeeklyWall(): Promise<CmsWeeklyWall[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("weekly_wall_items")
    .select("title, body")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    title: r.title,
    body: r.body || "",
  }));
}

export async function listKeyDates(): Promise<CmsKeyDate[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("key_dates")
    .select("title, occurs_on, description")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => {
    const parts = dateParts(r.occurs_on);
    return {
      title: r.title,
      day: parts.day,
      month: parts.month,
      year: parts.year,
      href: "#",
      tags: [],
      description: r.description || "",
    };
  });
}

export function groupKeyDates(items: CmsKeyDate[]): CmsKeyDateGroup[] {
  const map = new Map<string, CmsKeyDate[]>();
  for (const item of items) {
    const key = (item.month || "tba").slice(0, 3).toLowerCase();
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return Array.from(map.entries()).map(([month, grouped]) => ({
    month,
    items: grouped,
  }));
}

export async function listUrgentDeadlines(): Promise<CmsKeyDate[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("urgent_deadlines")
    .select("title, due_at, description")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => {
    const parts = dateParts(r.due_at);
    return {
      title: r.title,
      day: parts.day,
      month: parts.month,
      year: parts.year,
      href: "#",
      tags: ["#Urgent"],
      description: r.description || "",
    };
  });
}

export function splitDeadlineColumns(items: CmsKeyDate[]): {
  left: CmsDeadlineRow[];
  right: CmsDeadlineRow[];
} {
  const rows: CmsDeadlineRow[] = items.map((item) => ({
    date: [item.day, item.month, item.year].filter(Boolean).join(" "),
    text: item.description || item.title,
  }));
  const mid = Math.ceil(rows.length / 2);
  return { left: rows.slice(0, mid), right: rows.slice(mid) };
}

export function factsToSlides(facts: CmsFact[], size = 5): string[][] {
  const lines = facts.map((f) => f.body || f.title).filter(Boolean);
  if (lines.length === 0) return [];
  const slides: string[][] = [];
  for (let i = 0; i < lines.length; i += size) {
    slides.push(lines.slice(i, i + size));
  }
  return slides;
}

export function statsToBlocks(stats: CmsStat[]): {
  title: string;
  rows: string[];
}[] {
  const byLabel = new Map<string, string[]>();
  for (const s of stats) {
    const title = s.label.startsWith("#") ? s.label : `#${s.label}`;
    const rows = byLabel.get(title) ?? [];
    rows.push(s.value);
    byLabel.set(title, rows);
  }
  return Array.from(byLabel.entries()).map(([title, rows]) => ({ title, rows }));
}

export async function listPgsStats(): Promise<CmsStat[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("pgs_stats")
    .select("label, value_text")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    label: r.label,
    value: r.value_text,
  }));
}

export async function listStudyAbroadFacts(): Promise<CmsFact[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("study_abroad_facts")
    .select("title, body")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    title: r.title,
    body: r.body || "",
  }));
}

export async function listSocialLinks(): Promise<CmsSocial[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("site_social_links")
    .select("platform, url")
    .eq("published", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    platform: r.platform,
    url: r.url,
  }));
}

export async function listActiveMarquee(): Promise<CmsNotice[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("site_notices")
    .select("text, link_url")
    .eq("notice_type", "marquee")
    .eq("active", true)
    .order("display_order", { ascending: true });
  return (data ?? []).map((r) => ({
    text: r.text,
    linkUrl: r.link_url,
  }));
}

export async function getLegalDocument(
  documentType: "privacy" | "terms" | "refund",
): Promise<CmsLegal | null> {
  const client = await sb();
  if (!client) return null;
  const { data } = await client
    .from("legal_documents")
    .select("title, body")
    .eq("document_type", documentType)
    .eq("status", "published")
    .maybeSingle();
  if (!data) return null;
  return { title: data.title, body: data.body || "" };
}

export async function listPublishedUniversities(): Promise<CmsUniversity[]> {
  const client = await sb();
  if (!client) return [];
  const { data } = await client
    .from("universities")
    .select("id, name, slug, summary, location")
    .eq("published", true)
    .order("name", { ascending: true });
  return (data ?? []).map((r) => ({
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    summary: r.summary || "",
    location: r.location || "",
  }));
}

export async function getUnivMeetSlots() {
  const client = await sb();
  if (!client) return null;
  const { data } = await client
    .from("university_meeting_slots")
    .select("label, starts_at, booking_url, course_id")
    .eq("published", true)
    .order("display_order", { ascending: true })
    .limit(2);
  if (!data || data.length === 0) return null;

  const toSlot = (row: (typeof data)[0] | undefined) => {
    if (!row?.starts_at) {
      return { date: "--", month: "" };
    }
    const d = new Date(row.starts_at);
    return {
      date: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleString("en-GB", { month: "short", year: "2-digit" }),
    };
  };

  const a = toSlot(data[0]);
  const b = toSlot(data[1] ?? data[0]);
  return {
    slot1_date: a.date,
    slot1_month: a.month,
    slot2_date: b.date,
    slot2_month: b.month,
    course_id: data[0]?.course_id ?? null,
    href: data[0]?.booking_url || "/cvreadyprogram",
  };
}

export async function getPublishedPremiumContent(
  key: "video" | "meetup",
): Promise<CmsPremiumContent | null> {
  const client = await sb();
  if (!client) return null;
  const { data } = await client
    .from("premium_content_settings")
    .select("title, body, link_url")
    .eq("key", key)
    .eq("published", true)
    .maybeSingle();
  if (!data) return null;
  return {
    title: data.title || "",
    body: data.body || "",
    linkUrl: data.link_url || "",
  };
}
