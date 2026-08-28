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
      {
        label: "About",
        value: `${course.perkTitle}\n${course.perkDetail}`,
      },
      { label: "Location", value: course.duration },
      { label: "Mode", value: "On Campus" },
    ],
    variant: "full",
    datesRail: "Dates You Should Be Aware off.",
    promo: {
      title: "Deadline In",
      subtitle: `${course.deadlineDays}\ndays`,
      date: course.deadlineDate.replace(/^\*/, ""),
    },
    ctaLabel: "Learn More",
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
    href: "/programsfull",
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
    href: "/programsfull",
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
    href: "/programsfull",
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
    href: "/programsfull",
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
    href: "/programsfull",
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
