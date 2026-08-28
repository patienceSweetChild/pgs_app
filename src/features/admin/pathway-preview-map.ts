/**
 * Maps pathways-table row → page content for live preview and public pages.
 */

import {
  getMedicalPathwayContent,
  getNonMedicalPathwayContent,
  getPathwayContent,
  templateForSlug,
  type MedicalPathwayPageContent,
  type NonMedicalPathwayPageContent,
  type PathwayPageContent,
  type PathwaySlug,
  type PathwayTemplate,
} from "@/features/pathway/page-content";

export type PathwayDraft = Record<string, unknown>;

export type PathwayTopTabId = "intro" | "track" | "pathway" | "closing";

export const MEDICAL_TOP_TABS: ReadonlyArray<{
  id: PathwayTopTabId;
  label: string;
}> = [
  { id: "intro", label: "Intro" },
  { id: "track", label: "Track" },
  { id: "pathway", label: "Pathway" },
  { id: "closing", label: "Closing" },
] as const;

export const NONMEDICAL_TOP_TABS: ReadonlyArray<{
  id: PathwayTopTabId;
  label: string;
}> = [
  { id: "intro", label: "Intro" },
  { id: "track", label: "Track" },
  { id: "pathway", label: "Program" },
  { id: "closing", label: "Closing" },
] as const;

export const MEDICAL_EDIT_SECTIONS: ReadonlyArray<{
  id: string;
  label: string;
  tab: PathwayTopTabId;
}> = [
  { id: "hero", label: "Hero", tab: "intro" },
  { id: "step-into", label: "Step into", tab: "intro" },
  { id: "why-built", label: "Why built", tab: "intro" },
  { id: "purple-map", label: "Purple map", tab: "intro" },
  { id: "cv-checklist", label: "CV checklist", tab: "intro" },
  { id: "track-main", label: "Medical track", tab: "track" },
  { id: "track-testimonial", label: "Testimonial", tab: "track" },
  { id: "path-intro", label: "Path intro", tab: "pathway" },
  { id: "get-to-know", label: "Get to know", tab: "pathway" },
  { id: "what-you-get", label: "What you get", tab: "pathway" },
  { id: "counselor", label: "Counselor quote", tab: "closing" },
  { id: "documentation", label: "USCE docs", tab: "closing" },
  { id: "dashboard", label: "Dashboard", tab: "closing" },
  { id: "offer", label: "Offer & pricing", tab: "closing" },
  { id: "meet-greet", label: "Meet & greet", tab: "closing" },
  { id: "faq", label: "FAQ", tab: "closing" },
  { id: "contact", label: "Contact strip", tab: "closing" },
] as const;

export const NONMEDICAL_EDIT_SECTIONS: ReadonlyArray<{
  id: string;
  label: string;
  tab: PathwayTopTabId;
}> = [
  { id: "hero", label: "Hero", tab: "intro" },
  { id: "step-into", label: "Step into", tab: "intro" },
  { id: "why-built", label: "Why built", tab: "intro" },
  { id: "purple-map", label: "Purple map", tab: "intro" },
  { id: "cv-checklist", label: "CV checklist", tab: "intro" },
  { id: "track-deadlines", label: "Deadlines track", tab: "track" },
  { id: "track-student", label: "Student caption", tab: "track" },
  { id: "program-main", label: "What is PurplePremium", tab: "pathway" },
  { id: "program-pillars", label: "Support pillars", tab: "pathway" },
  { id: "universities", label: "Universities CTA", tab: "pathway" },
  { id: "counselor", label: "Counselor quote", tab: "closing" },
  { id: "dashboard", label: "Dashboard", tab: "closing" },
  { id: "offer", label: "Offer & pricing", tab: "closing" },
  { id: "meet-greet", label: "Meet & greet", tab: "closing" },
  { id: "faq", label: "FAQ", tab: "closing" },
  { id: "contact", label: "Contact strip", tab: "closing" },
] as const;

export function sectionsForTemplate(template: PathwayTemplate, tabId: PathwayTopTabId) {
  const sections =
    template === "medical" ? MEDICAL_EDIT_SECTIONS : NONMEDICAL_EDIT_SECTIONS;
  return sections.filter((s) => s.tab === tabId);
}

export function allSectionsForTemplate(template: PathwayTemplate) {
  return template === "medical" ? MEDICAL_EDIT_SECTIONS : NONMEDICAL_EDIT_SECTIONS;
}

export function topTabsForTemplate(template: PathwayTemplate) {
  return template === "medical" ? MEDICAL_TOP_TABS : NONMEDICAL_TOP_TABS;
}

function str(row: PathwayDraft, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function parseTemplate(row: PathwayDraft): PathwayTemplate {
  const t = row.template;
  if (t === "medical" || t === "nonmedical") return t;
  const slug = str(row, "slug", "usmle") as PathwaySlug;
  return templateForSlug(slug);
}

function parsePageContent(row: PathwayDraft): PathwayPageContent {
  const raw = row.page_content;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as PathwayPageContent;
  }
  const slug = str(row, "slug", "usmle") as PathwaySlug;
  return getPathwayContent(slug) ?? getMedicalPathwayContent("usmle")!;
}

export function pathwayMockDraft(template: PathwayTemplate = "medical"): PathwayDraft {
  const slug: PathwaySlug = template === "medical" ? "usmle" : "stem";
  const content = getPathwayContent(slug);
  return {
    name: "",
    slug: "",
    template,
    published: false,
    display_order: 0,
    page_content: content,
  };
}

export function pathwayToDetail(row: PathwayDraft): PathwayPageContent {
  const base = parsePageContent(row);
  const slug = (str(row, "slug", base.slug) || base.slug) as PathwaySlug;
  return { ...structuredClone(base), slug };
}

export function pathwayToMedicalDetail(
  row: PathwayDraft,
): MedicalPathwayPageContent {
  const detail = pathwayToDetail(row);
  if ("pathway" in detail) return detail;
  const slug = (detail.slug ?? "usmle") as PathwaySlug;
  return getMedicalPathwayContent(slug) ?? getMedicalPathwayContent("usmle")!;
}

export function pathwayToNonMedicalDetail(
  row: PathwayDraft,
): NonMedicalPathwayPageContent {
  const detail = pathwayToDetail(row);
  if ("program" in detail) return detail;
  const slug = (detail.slug ?? "stem") as PathwaySlug;
  return getNonMedicalPathwayContent(slug) ?? getNonMedicalPathwayContent("stem")!;
}

export function patchPageContent(
  draft: PathwayDraft,
  patch:
    | Partial<PathwayPageContent>
    | ((prev: PathwayPageContent) => PathwayPageContent),
): PathwayDraft {
  const prev = parsePageContent(draft);
  const next =
    typeof patch === "function"
      ? patch(prev)
      : ({ ...prev, ...patch } as PathwayPageContent);
  return { ...draft, page_content: next };
}

export function parsePageContentFromRow(row: PathwayDraft): PathwayPageContent {
  return parsePageContent(row);
}

export function getTemplateFromDraft(draft: PathwayDraft): PathwayTemplate {
  return parseTemplate(draft);
}

export function previewKindForDraft(
  draft: PathwayDraft,
): "pathway-medical" | "pathway-nonmedical" {
  return parseTemplate(draft) === "medical"
    ? "pathway-medical"
    : "pathway-nonmedical";
}
