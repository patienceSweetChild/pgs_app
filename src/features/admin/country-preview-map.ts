/**
 * Maps countries-table row → CountryPageContent for live preview and public pages.
 */

import {
  getCountryContent,
  USA_CONTENT,
  type CountryPageContent,
  type CountryTab,
  type CountrySlug,
} from "@/features/countries/content";

export type CountryDraft = Record<string, unknown>;

export type CountryTopTabId =
  | "page"
  | "study101"
  | "cost"
  | "visa"
  | "shortTerm"
  | "scholarships"
  | "tracks";

export const COUNTRY_TOP_TABS: ReadonlyArray<{
  id: CountryTopTabId;
  label: string;
}> = [
  { id: "page", label: "Page" },
  { id: "study101", label: "Study 101" },
  { id: "cost", label: "Study Cost" },
  { id: "visa", label: "Visa 101" },
  { id: "shortTerm", label: "Short-Term Courses" },
  { id: "scholarships", label: "Scholarships" },
  { id: "tracks", label: "Popular Study Tracks" },
] as const;

export const COUNTRY_EDIT_SECTIONS: ReadonlyArray<{
  id: string;
  label: string;
  tab: CountryTopTabId;
}> = [
  { id: "hero", label: "Hero", tab: "page" },
  { id: "intro", label: "Intro", tab: "page" },
  { id: "meta", label: "Meta", tab: "page" },
  { id: "study101-stats", label: "Stats", tab: "study101" },
  { id: "study101-sidebar", label: "Sidebar links", tab: "study101" },
  { id: "study101-why", label: "Why study", tab: "study101" },
  { id: "study101-overview", label: "Quick overview", tab: "study101" },
  { id: "study101-reasons", label: "Why students choose", tab: "study101" },
  { id: "study101-stem", label: "STEM", tab: "study101" },
  { id: "study101-usmle", label: "USMLE", tab: "study101" },
  { id: "study101-nonstr", label: "Non-STEM", tab: "study101" },
  { id: "cost-stats", label: "Stats", tab: "cost" },
  { id: "cost-sidebar", label: "Sidebar links", tab: "cost" },
  { id: "cost-budgeting", label: "Budgeting 101", tab: "cost" },
  { id: "cost-spend", label: "What students spend", tab: "cost" },
  { id: "cost-pgs-banner", label: "#PGS banner", tab: "cost" },
  { id: "cost-premium", label: "PurplePremium CTA", tab: "cost" },
  { id: "visa-stats", label: "Funding stats", tab: "visa" },
  { id: "visa-sidebar", label: "Sidebar links", tab: "visa" },
  { id: "visa-types", label: "Visa types", tab: "visa" },
  { id: "visa-docs", label: "Documents", tab: "visa" },
  { id: "visa-steps", label: "Application steps", tab: "visa" },
  { id: "visa-dosdonts", label: "Do's & Don'ts", tab: "visa" },
  { id: "visa-help", label: "Help CTA", tab: "visa" },
  { id: "shortTerm-stats", label: "Stats", tab: "shortTerm" },
  { id: "shortTerm-sidebar", label: "Sidebar links", tab: "shortTerm" },
  { id: "shortTerm-intro", label: "Intro", tab: "shortTerm" },
  { id: "shortTerm-courses", label: "Courses", tab: "shortTerm" },
  { id: "shortTerm-contact", label: "Contact CTA", tab: "shortTerm" },
  { id: "scholarships-stats", label: "Stats", tab: "scholarships" },
  { id: "scholarships-sidebar", label: "Sidebar links", tab: "scholarships" },
  { id: "scholarships-intro", label: "Intro", tab: "scholarships" },
  { id: "scholarships-table", label: "Scholarship table", tab: "scholarships" },
  { id: "scholarships-guide", label: "Apply guide", tab: "scholarships" },
  { id: "tracks-stats", label: "Stats", tab: "tracks" },
  { id: "tracks-sidebar", label: "Sidebar links", tab: "tracks" },
  { id: "tracks-intro", label: "Intro", tab: "tracks" },
  { id: "tracks-tables", label: "Track tables", tab: "tracks" },
  { id: "tracks-punchline", label: "Punchline", tab: "tracks" },
] as const;

export function sectionsForTab(tabId: CountryTopTabId) {
  return COUNTRY_EDIT_SECTIONS.filter((s) => s.tab === tabId);
}

export function topTabsForDraft(draft: CountryDraft) {
  const content = parsePageContent(draft);
  const study101 = content.tabs.find((t) => t.id === "study101");
  const tracks = content.tabs.find((t) => t.id === "tracks");
  return COUNTRY_TOP_TABS.map((tab) => {
    if (tab.id === "study101" && study101) {
      return { ...tab, label: study101.label };
    }
    if (tab.id === "tracks" && tracks) {
      return { ...tab, label: tracks.label };
    }
    const match = content.tabs.find((t) => t.id === tab.id);
    if (match && tab.id !== "page") {
      return { ...tab, label: match.label };
    }
    return tab;
  });
}

function str(row: CountryDraft, key: string, fallback = ""): string {
  const v = row[key];
  if (v == null) return fallback;
  return String(v);
}

function parsePageContent(row: CountryDraft): CountryPageContent {
  const raw = row.page_content;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CountryPageContent;
  }
  const slug = str(row, "slug", "usa") as CountrySlug;
  return getCountryContent(slug) ?? USA_CONTENT;
}

export function countryMockDraft(): CountryDraft {
  const content = structuredClone(USA_CONTENT);
  return {
    name: "",
    slug: "",
    iso_code: null,
    dial_code: null,
    published: false,
    display_order: 0,
    page_content: content,
    hero_flag_asset_id: null,
    hero_desktop_asset_id: null,
    hero_mobile_asset_id: null,
    hero_flag_url: content.hero.flagImage,
    hero_desktop_url: content.hero.desktopImage,
    hero_mobile_url: content.hero.mobileImage,
  };
}

export function countryToDetail(row: CountryDraft): CountryPageContent {
  const base = parsePageContent(row);
  const slug = (str(row, "slug", base.slug) || base.slug) as CountrySlug;
  const name = str(row, "name", base.name) || base.name;
  const flagUrl = str(row, "hero_flag_url", base.hero.flagImage);
  const desktopUrl = str(row, "hero_desktop_url", base.hero.desktopImage);
  const mobileUrl = str(row, "hero_mobile_url", base.hero.mobileImage);

  return {
    ...base,
    slug,
    name,
    study101Label:
      base.tabs.find((t) => t.id === "study101")?.label ?? `${name} Study 101`,
    flagCode: base.flagCode,
    hero: {
      flagImage: flagUrl || base.hero.flagImage,
      desktopImage: desktopUrl || base.hero.desktopImage,
      mobileImage: mobileUrl || base.hero.mobileImage,
    },
    intro: { ...base.intro },
    tabs: base.tabs.map((tab) => ({ ...tab })) as CountryTab[],
  };
}

export function getTabFromDraft<T extends CountryTab["id"]>(
  draft: CountryDraft,
  tabId: T,
): Extract<CountryTab, { id: T }> | undefined {
  const content = parsePageContent(draft);
  return content.tabs.find((t) => t.id === tabId) as
    | Extract<CountryTab, { id: T }>
    | undefined;
}

export function patchPageContent(
  draft: CountryDraft,
  patch: Partial<CountryPageContent> | ((prev: CountryPageContent) => CountryPageContent),
): CountryDraft {
  const prev = parsePageContent(draft);
  const next =
    typeof patch === "function"
      ? patch(prev)
      : { ...prev, ...patch };
  return { ...draft, page_content: next };
}

export function patchTab<T extends CountryTab["id"]>(
  draft: CountryDraft,
  tabId: T,
  patch: Partial<Extract<CountryTab, { id: T }>>,
): CountryDraft {
  return patchPageContent(draft, (prev) => ({
    ...prev,
    tabs: prev.tabs.map((tab) =>
      tab.id === tabId ? ({ ...tab, ...patch } as CountryTab) : tab,
    ),
  }));
}

export function parsePageContentFromRow(row: CountryDraft): CountryPageContent {
  return parsePageContent(row);
}
