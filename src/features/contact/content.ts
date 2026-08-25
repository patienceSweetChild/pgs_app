export const CONTACT_HERO_BG =
  "https://myoneapply.com/wp-content/uploads/2022/01/3.jpg";

export const CONTACT_OFFICES = [
  {
    title: "India Office",
    body: "Anmol Residency (Near: Uttarakhand Jal Vidyut Nigam Ltd), Phase 2/42/1 Maharani Bagh, G.M.S Road, Ballupur Chowk Dehradun - 248001",
    variant: "address" as const,
  },
  {
    title: "India Office",
    body: "Anmol Residency (Near: Uttarakhand Jal Vidyut Nigam Ltd), Phase 2/42/1 Maharani Bagh, G.M.S Road, Ballupur Chowk Dehradun - 248001",
    variant: "linked" as const,
    href: "tel:1800222000",
  },
  {
    title: "Contact",
    variant: "phones" as const,
    phones: [
      { label: "8266812702", href: "tel:8266812702" },
      { label: "7302658242", href: "tel:7302658242" },
    ],
    email: { label: "info@myoneapply.com", href: "mailto:info@myoneapply.com" },
  },
  {
    title: "United Kingdom Office",
    body: "50 Princes Street, Ipswich, Suffolk, IP1 1RJ, United Kingdom",
    variant: "address" as const,
    narrow: true,
  },
] as const;

export const CONTACT_SERVICES = [
  { value: "usmle", label: "USMLE pathway" },
  { value: "amc", label: "AMC pathway" },
  { value: "plab", label: "PLAB pathway" },
  { value: "stem", label: "Masters / STEM / MBA" },
  { value: "general", label: "General enquiry" },
] as const;

export const CONTACT_SOCIAL = [
  {
    className: "facebook",
    href: "https://www.facebook.com/",
    icon: "fa-brands fa-facebook-f",
  },
  {
    className: "dribbble",
    href: "http://www.dribbble.com",
    icon: "fa-brands fa-dribbble",
  },
  {
    className: "twitter",
    href: "http://www.twitter.com",
    icon: "fa-brands fa-twitter",
  },
  {
    className: "instagram",
    href: "http://www.instagram.com",
    icon: "fa-brands fa-instagram",
  },
  {
    className: "linkedin",
    href: "http://www.linkedin.com",
    icon: "fa-brands fa-linkedin-in",
  },
] as const;

export const CONTACT_MAP_EMBED =
  "https://www.google.com/maps?q=30.330749,78.010058&z=18&hl=en&output=embed";
