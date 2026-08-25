import type { ProgramCardData } from "@/components/cards/types";

export type BoardCourse = {
  id: string;
  title: string;
  duration: string;
  perkTitle: string;
  perkDetail: string;
  tags: string[];
  badge: string;
  deadlineDays: string;
  deadlineDate: string;
  closed?: string;
  href: string;
};

const BOARD_CAMPUS = "/assets/img/purpleboard/campus.jpg";
const BOARD_LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const BOARD_QR = "/assets/img/purpleboard/qr.png";

export function boardCourseToProgramCard(course: BoardCourse): ProgramCardData {
  return {
    id: course.id,
    type: "program",
    col: "full",
    href: course.href,
    image: BOARD_CAMPUS,
    title: course.title,
    tags: course.tags,
    badge: course.badge,
    logo: BOARD_LOGO,
    logoAlt: "The Royal College of Surgeons of Edinburgh",
    details: [
      { label: "Duration", value: course.duration },
      { label: "Perks", value: `${course.perkTitle}\n${course.perkDetail}` },
    ],
    variant: "full",
    deadline: {
      days: course.deadlineDays,
      date: course.deadlineDate,
    },
    qrSrc: BOARD_QR,
    showDownload: true,
    closed: course.closed,
  };
}

export const BOARD_COURSES: BoardCourse[] = [
  {
    id: "open-1",
    title: "MSc Automotive Engineering Practise",
    duration: "2 years",
    perkTitle: "Scholarship",
    perkDetail: "up to GBP 3000",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    badge: "Filling Fast",
    deadlineDays: "24",
    deadlineDate: "*28th June 2025",
    href: "/cvreadyprogram",
  },
  {
    id: "closed-1",
    title: "MSc Automotive Engineering Practise",
    duration: "2 years",
    perkTitle: "Scholarship",
    perkDetail: "up to GBP 3000",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    badge: "Filling Fast",
    deadlineDays: "24",
    deadlineDate: "*28th June 2025",
    closed: "Closed on June 15 – 46 students registered",
    href: "/cvreadyprogram",
  },
  {
    id: "open-2",
    title: "MSc Automotive Engineering Practise",
    duration: "2 years",
    perkTitle: "Scholarship",
    perkDetail: "up to GBP 3000",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    badge: "Filling Fast",
    deadlineDays: "24",
    deadlineDate: "*28th June 2025",
    href: "/cvreadyprogram",
  },
  {
    id: "closed-2",
    title: "MSc Automotive Engineering Practise",
    duration: "2 years",
    perkTitle: "Scholarship",
    perkDetail: "up to GBP 3000",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    badge: "Filling Fast",
    deadlineDays: "24",
    deadlineDate: "*28th June 2025",
    closed: "Closed on June 15 – 46 students registered",
    href: "/cvreadyprogram",
  },
  {
    id: "open-3",
    title: "MSc Automotive Engineering Practise",
    duration: "2 years",
    perkTitle: "Scholarship",
    perkDetail: "up to GBP 3000",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    badge: "Filling Fast",
    deadlineDays: "24",
    deadlineDate: "*28th June 2025",
    href: "/cvreadyprogram",
  },
];

export const WEEKLY_WALL = [
  { title: "Krishna got 50% scholarship at Coventry" },
  { title: "Rhea cracked IMAT mock with 82%" },
  { title: "Siddharth got 3 admits in 2 weeks!" },
  { title: "Siddharth got 3 admits in 2 weeks!" },
  { title: "Siddharth got 3 admits in 2 weeks!" },
  { title: "Siddharth got 3 admits in 2 weeks!" },
  { title: "Siddharth got 3 admits in 2 weeks!" },
] as const;

export const BOARD_HERO = {
  title: "#purpleboard",
  body: "Here you'll find all the important openings you need to know. Check out scholarships, discounts, and special perks before they close. Act early so you don't miss your chance. Stay updated and make the most of every opportunity.",
  searchPlaceholder: "Search Programs Here",
} as const;
