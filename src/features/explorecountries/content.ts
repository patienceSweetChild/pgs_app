export type CountryOption = {
  id: string;
  label: string;
  /** Display lines for the featured “study in …” title */
  countryLines: string[];
  href: string;
};

export const PRIMARY_COUNTRIES: CountryOption[] = [
  {
    id: "usa",
    label: "USA",
    countryLines: ["united", "states"],
    href: "/countries/usa",
  },
  {
    id: "uk",
    label: "UK",
    countryLines: ["united", "kingdom"],
    href: "/countries/uk",
  },
  {
    id: "nz",
    label: "nz",
    countryLines: ["new", "zealand"],
    href: "/countries/nz",
  },
  {
    id: "aus",
    label: "aus",
    countryLines: ["australia"],
    href: "/countries/aus",
  },
  {
    id: "can",
    label: "CAN",
    countryLines: ["canada"],
    href: "/countries/canada",
  },
];

export const SECONDARY_COUNTRIES: CountryOption[] = [
  {
    id: "ger",
    label: "ger",
    countryLines: ["germany"],
    href: "/countries/germany",
  },
  {
    id: "fra",
    label: "fra",
    countryLines: ["france"],
    href: "/countries/france",
  },
  {
    id: "mur",
    label: "mur",
    countryLines: ["mauritius"],
    href: "/countries/mauritius",
  },
  {
    id: "europe",
    label: "europe",
    countryLines: ["europe"],
    href: "/countries/europe",
  },
  {
    id: "others",
    label: "others",
    countryLines: ["others"],
    href: "/countries/others",
  },
];

export const FEATURE_BULLETS = [
  "Recommended QBanks, review books.",
  "Suggested mocks for your stage.",
  "Clinical Rotation Package",
] as const;

/** partner-1..9 repeated 4× to match the HTML logo grid density */
export const PARTNER_LOGOS = Array.from({ length: 36 }, (_, i) => {
  const n = (i % 9) + 1;
  return `/assets/img/partner-${n}.png`;
});

export const PARTNER_HIGHLIGHTS = [
  "500+ University Tie-ups",
  "20+ years experienced Mentors",
  "Current Student as Mentors",
] as const;

export const MEDICINE_PATHS = ["USMLE", "PLAB", "AMC"] as const;

export const CONTACT_STRIP = {
  phone: "91 95665 66298",
  email: "connect@purpleguid.study",
} as const;
