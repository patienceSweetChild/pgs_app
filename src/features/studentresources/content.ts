export const LAST_UPDATED = "*Last updated on 15th March, 2026";

export type KeyDate = {
  title: string;
  tags: string[];
  day: string;
  month: string;
  year: string;
  href: string;
};

export type KeyDateGroup = {
  month: string;
  items: KeyDate[];
};

export const KEY_DATE_GROUPS: KeyDateGroup[] = [
  {
    month: "aug",
    items: [
      {
        title: "CAT REGISTRATION",
        tags: ["#UK", "#Medicine", "#MCAT"],
        day: "15th",
        month: "august",
        year: "2025",
        href: "https://example.com/mcat",
      },
      {
        title: "UCAS OPEN",
        tags: ["#UK", "#Undergrad"],
        day: "1st",
        month: "august",
        year: "2025",
        href: "https://www.ucas.com",
      },
      {
        title: "DAAD Scholarship Deadline",
        tags: ["#Germany", "#Scholarship"],
        day: "20th",
        month: "august",
        year: "2025",
        href: "https://www.daad.de",
      },
      {
        title: "GRE Test Window Opens",
        tags: ["#USA", "#GRE"],
        day: "28th",
        month: "august",
        year: "2025",
        href: "#",
      },
    ],
  },
  {
    month: "oct",
    items: [
      {
        title: "Common App Opens",
        tags: ["#USA", "#Undergrad"],
        day: "1st",
        month: "october",
        year: "2025",
        href: "https://www.commonapp.org",
      },
      {
        title: "USMLE Step 1 Registration",
        tags: ["#USMLE", "#Medicine"],
        day: "10th",
        month: "october",
        year: "2025",
        href: "#",
      },
      {
        title: "UK Postgrad Applications Open",
        tags: ["#UK", "#Masters"],
        day: "15th",
        month: "october",
        year: "2025",
        href: "#",
      },
    ],
  },
  {
    month: "sep",
    items: [
      {
        title: "MBA Round 1 Deadlines (US)",
        tags: ["#USA", "#MBA"],
        day: "15th",
        month: "september",
        year: "2025",
        href: "#",
      },
      {
        title: "IELTS Test Date",
        tags: ["#IELTS", "#UK", "#Australia"],
        day: "21st",
        month: "september",
        year: "2025",
        href: "https://www.ielts.org",
      },
      {
        title: "Chevening Scholarship Opens",
        tags: ["#UK", "#Scholarship"],
        day: "1st",
        month: "september",
        year: "2025",
        href: "https://www.chevening.org",
      },
    ],
  },
];

export const DEADLINE_LEFT = [
  { date: "MARCH 26-28", text: "What's Happening (description)" },
  { date: "July30", text: "TrER" },
  {
    date: "July 15–31, 2025",
    text: "Final mentor booking window for Fall 2025 intake.",
  },
  {
    date: "August 1–10, 2025",
    text: "Uni shortlist & profile review calls (Round 1).",
  },
  {
    date: "August 15, 2025",
    text: "Fall 2025 application support kicks off.",
  },
  {
    date: "September 1, 2025",
    text: "Early-bird scholarship deadline (USA/UK).",
  },
  {
    date: "September 10, 2025",
    text: "Last chance to upgrade to PurplePremium for fall 2025 batch.",
  },
] as const;

export const DEADLINE_RIGHT = [
  { date: "October 5, 2025", text: "Visa sessions for Jan 2026 start." },
  {
    date: "October 20, 2025",
    text: "Final date to submit LOR/SOP drafts.",
  },
  {
    date: "November 1, 2025",
    text: "Scholarship Application Review Day (Live).",
  },
  { date: "November 10, 2025", text: "Instagram Mentor AMA Week." },
  {
    date: "December 1, 2025",
    text: "Lock-in date for Jan 2026 uni apps.",
  },
  {
    date: "December 15, 2025",
    text: "Last date for UK January intake applications.",
  },
  {
    date: "January 5, 2026",
    text: "Winter semester visa document submission deadline.",
  },
] as const;

export const FACT_SLIDES = [
  [
    "Rome offers €520/month to medical students — find out how to qualify with your mentor.",
    "With one SOP, you can apply to 5 DAAD universities",
    "In Australia, postgrads can start part-time internships from Week 1",
    "After clearing AMC Part 1, you can start clinical observerships in Australia without waiting for Part 2",
    "USMLE hands-on rotations fill up months in advance, early planning is key",
  ],
  [
    "Italy offers €520/month to medical students — find out how to qualify with your mentor.",
    "With one SOP, you can apply to 6 DAAD universities",
    "In Australia, postgrads can start part-time internships from Week 1",
    "After clearing AMC Part 1, you can start clinical observerships in Australia without waiting for Part 2",
    "USMLE hands-on rotations fill up months in advance, early planning is key",
  ],
] as const;

export const STATS_BLOCKS = [
  {
    title: "#mba",
    rows: [
      "Top 3 applied-to programs this month: MSc CS, MBA Finance, MBBS Italy.",
      "Visa slots filling fastest in Germany & UK.",
      "Round 1 MBA deadlines: 47% of PGS users submitted before the priority window.",
      "GMAT waiver approvals up 30% for applicants with strong work experience profiles.",
      "UK MBA applications up 18% compared to same period last year.",
    ],
  },
  {
    title: "#stem",
    rows: [
      "74 students just finished their SOP drafts this week.",
      "Top 3 applied-to programs this month: MSc CS, MEng Robotics, MS Data Science.",
      "Visa slots filling fastest for Germany & Netherlands.",
      "DAAD application support sessions are fully booked for the next 2 weeks.",
      "Early applicants to TU Munich reported 40% faster processing this cycle.",
    ],
  },
  {
    title: "#usmle",
    rows: [
      "Top 3 applied-to programs this month: MSc CS, MBA Finance, MBBS Italy.",
      "Visa slots filling fastest in Germany & UK.",
      "USMLE Step 1 pass rate for PGS mentored students at 94% this quarter.",
      "Clinical rotation slots for Q1 2026 are 80% full.",
      "Match rate for IMG applicants using our LOR toolkit up 22% YoY.",
    ],
  },
] as const;

export const FAQ_TABS = [
  { id: "tab_1", label: "Programme Details" },
  { id: "tab_2", label: "Programme Learning Experience" },
  { id: "tab_3", label: "Refund Policy/Financials" },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Who can apply for scholarships?",
    a: "Scholarships are available for students and professionals looking to study abroad, whether you're pursuing undergraduate, graduate, or professional development programs. Each scholarship has specific eligibility criteria based on academic background, field of study, and career goals.",
  },
  {
    q: "Are scholarships 100% guaranteed?",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
] as const;
