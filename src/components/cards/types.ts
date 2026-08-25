/** CMS-ready card contracts — future CMS maps 1:1 onto these shapes. */

export type CardCol = "full" | "half" | "third";

export type CardDetail = {
  label: string;
  value: string;
};

export type ProgramDeadline = {
  days: string;
  date: string;
  caption?: string;
};

export type ProgramPromo = {
  title: string;
  subtitle: string;
  date: string;
};

type BaseCard = {
  id: string;
  href: string;
  image: string;
  title: string;
  tags: string[];
  /** Initial heart / saved state */
  saved?: boolean;
  /** Bootstrap layout hint from CMS */
  col: CardCol;
};

export type ProgramCardData = BaseCard & {
  type: "program";
  badge?: string;
  badgeIcon?: string;
  logo?: string;
  logoAlt?: string;
  details: CardDetail[];
  variant: "full" | "compact";
  /** PurpleBoard-style countdown rail */
  deadline?: ProgramDeadline;
  /** Saved-mock “Dates Extended” style box */
  promo?: ProgramPromo;
  datesRail?: string;
  qrSrc?: string;
  showDownload?: boolean;
  downloadIcon?: string;
  closed?: string;
};

export type PromoCardData = BaseCard & {
  type: "promo";
  description: string;
  seatBadge?: string;
  seatBadgeIcon?: string;
  overlayBadge?: string;
  closesOn?: string;
  extraTagCount?: number;
};

export type InternshipCardData = BaseCard & {
  type: "internship";
  description: string;
  overlayBadge?: string;
  batchLabel?: string;
};

export type SavedCardData =
  | ProgramCardData
  | PromoCardData
  | InternshipCardData;

export const COL_CLASS: Record<CardCol, string> = {
  full: "col-12 mb-4",
  half: "col-lg-6 col-md-6 mb-4",
  third: "col-lg-4 col-md-6 mb-4",
};
