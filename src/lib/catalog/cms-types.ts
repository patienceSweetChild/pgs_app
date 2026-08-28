/** Client-safe CMS types and constants (no server imports). */

export type CmsFaq = { q: string; a: string; category?: string };
export type CmsPerson = {
  name: string;
  title: string;
  biography: string;
  image: string;
};
export type CmsTestimonial = {
  name: string;
  role: string;
  quote: string;
  image?: string;
};
export type CmsHighlight = { title: string; body: string; image: string };
export type CmsWeeklyWall = { title: string; body: string; image?: string };
export type CmsKeyDate = {
  title: string;
  day: string;
  month: string;
  year: string;
  href: string;
  tags: string[];
  description?: string;
};
export type CmsKeyDateGroup = {
  month: string;
  items: CmsKeyDate[];
};
export type CmsDeadlineRow = { date: string; text: string };
export type CmsPremiumContent = {
  title: string;
  body: string;
  linkUrl: string;
  mediaUrl?: string;
};
export type CmsStat = { label: string; value: string };
export type CmsFact = { title: string; body: string };
export type CmsSocial = { platform: string; url: string };
export type CmsNotice = { text: string; linkUrl: string | null };
export type CmsLegal = { title: string; body: string };
export type CmsUniversity = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  location: string;
  image?: string;
};

import type { CountryPageContent } from "@/features/countries/content";

export type { CountryPageContent };

export type CmsCountryRow = {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  display_order: number;
  page_content: CountryPageContent | null;
};

import type { PathwayPageContent } from "@/features/pathway/page-content";

export type { PathwayPageContent };

export type CmsPathwayRow = {
  id: number;
  name: string;
  slug: string;
  template: "medical" | "nonmedical";
  published: boolean;
  display_order: number;
  page_content: PathwayPageContent | null;
};

export const SOCIAL_ICON_MAP: Record<string, string> = {
  instagram: "/assets/img/instagram.png",
  facebook: "/assets/img/facebook.png",
  threads: "/assets/img/threads.png",
  youtube: "/assets/img/youtube.png",
  linkedin: "/assets/img/linkdln.png",
  linkdln: "/assets/img/linkdln.png",
};
