import type { SavedCardData } from "@/components/cards/types";

/** Profile header mock — mirrors dashboard signed-in shape for CMS later */
export const SAVED_PROFILE = {
  name: "Rajeev Singh",
  handle: "@rajeevsingh",
  id: "2123456",
  avatar: "/assets/img/avatar.jpg",
  pathway: "STEM PATHWAY",
  premiumLabel: "#PURPLEPREMIUM",
} as const;

const CAMPUS = "/assets/img/purpleboard/campus.jpg";
const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const QR = "/assets/img/purpleboard/qr.png";
const FIRE = "/assets/img/purpleboard/fire.gif";

/**
 * Flat CMS-shaped feed. Each item declares `type` + `col`;
 * SavedFeed maps cols → Bootstrap grid.
 */
export const SAVED_ITEMS: SavedCardData[] = [
  {
    id: "saved-program-1",
    type: "program",
    col: "full",
    href: "/cvreadyprogram",
    image: CAMPUS,
    title: "MSC AUTOMOTIVE ENGINEERING PRACTISE",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    saved: true,
    badge: "Filling Fast",
    badgeIcon: FIRE,
    logo: LOGO,
    logoAlt: "The Royal College of Surgeons of Edinburgh",
    details: [
      { label: "Duration", value: "2 years" },
      { label: "Perks", value: "Scholarship\nup to GBP 3000" },
    ],
    variant: "full",
    promo: {
      title: "Dates\nExtended",
      subtitle: "Check\nWith US",
      date: "15th June 2023",
    },
    qrSrc: QR,
    showDownload: true,
  },
  {
    id: "saved-promo-1",
    type: "promo",
    col: "third",
    href: "/studentresources",
    image: "/assets/img/saved_1.jpg",
    title: "SOP GUIDANCE PROGRAM FOR APPLICANTS",
    description:
      "Build a top-tier SOP in 3 days with our guided writing challenge.",
    tags: ["#TEAMPGS", "#all"],
    saved: false,
    seatBadge: "Last 10 Spots",
    seatBadgeIcon: "/assets/img/purpleboard/fire.gif",
    overlayBadge: "Start Free",
    closesOn: "Closes On\nJune 30",
  },
  {
    id: "saved-promo-2",
    type: "promo",
    col: "third",
    href: "/studentresources",
    image: "/assets/img/saved_2.jpg",
    title: "SOP GUIDANCE PROGRAM FOR APPLICANTS",
    description:
      "Build a top-tier SOP in 3 days with our guided writing challenge.",
    tags: ["#TEAMPGS", "#all"],
    saved: false,
    seatBadge: "Last 10 Spots",
    seatBadgeIcon: "/assets/img/purpleboard/fire.gif",
    overlayBadge: "Start Free",
    closesOn: "Closes On\nJune 30",
  },
  {
    id: "saved-promo-3",
    type: "promo",
    col: "third",
    href: "/studentresources",
    image: "/assets/img/saved_3.jpg",
    title: "SOP GUIDANCE PROGRAM FOR APPLICANTS",
    description:
      "Build a top-tier SOP in 3 days with our guided writing challenge.",
    tags: ["#TEAMPGS", "#all"],
    saved: false,
    seatBadge: "Last 10 Spots",
    seatBadgeIcon: "/assets/img/purpleboard/fire.gif",
    overlayBadge: "Start Free",
    closesOn: "Closes On\nJune 30",
  },
  {
    id: "saved-internship-1",
    type: "internship",
    col: "half",
    href: "/countries/usa",
    image: "/assets/img/half-cut-girl.png",
    title: "Harvard Internship",
    description:
      "Harvard Internship Harvard Harvard Internship Harvard Harvard Internship Harvard.",
    tags: ["#US"],
    saved: true,
    batchLabel: "OUR 3RD BATCH",
  },
  {
    id: "saved-internship-2",
    type: "internship",
    col: "half",
    href: "/countries/usa",
    image: "/assets/img/half-cut-girl.png",
    title: "Harvard Internship",
    description:
      "Harvard Internship Harvard Harvard Internship Harvard Harvard Internship Harvard.",
    tags: ["#US"],
    saved: true,
    batchLabel: "OUR 3RD BATCH",
  },
  {
    id: "saved-clinical-1",
    type: "program",
    col: "full",
    href: "/usmlerotation",
    image: "/assets/img/saved_4.jpg",
    title: "Outpatient US Clinical Experience in Psychiatry",
    tags: ["#USA", "#Clinical"],
    saved: false,
    badge: "Filling Fast",
    badgeIcon: FIRE,
    logo: LOGO,
    logoAlt: "In-person",
    details: [
      { label: "Location", value: "Atlanta, USA" },
      { label: "Specialty", value: "Psychiatry" },
    ],
    variant: "compact",
  },
];
