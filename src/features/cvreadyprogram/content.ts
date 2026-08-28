export const HERO = {
  title: "Courses That Actually Count",
  body: "This section covers everything from short-term courses, internships, and clinical visit programs to English language classes, confidence-building sessions, and more. We made this page to help you find things that not only look good on your CV but also actually help you grow, explore new things, and feel more ready for what's next.",
} as const;

export const FILTER_TAGS = [{ id: "all", label: "#all", filter: "" }] as const;

export const SORT_TAGS = [
  { id: "order", label: "#all", sort: "order" },
  { id: "title", label: "#A–Z", sort: "title" },
] as const;

/** client-1..6 for the top partners strip (matches HTML) */
export const PARTNER_LOGOS = Array.from({ length: 6 }, (_, i) => {
  return `/assets/img/client-${i + 1}.png`;
});

export const PROGRAM_INTRO = {
  heading: "'#purpleSelected' Explore Our Most Wanted Course",
  empty:
    "No featured courses yet. Enable a page surface in the visual template (Purple Board or CV Ready).",
} as const;

export const OUR_PROGRAM = {
  headingPrefix: "Discover ",
  headingAccent: "Our Programs",
  searchPlaceholder: "Search programs by name or tags...",
  empty:
    "No programs yet. Enable a page surface in the visual template (Purple Board or CV Ready).",
  sectionLabel: "Section 1",
} as const;

export const STATS = [
  {
    value: "0",
    labelLines: ["Of our students got", "a cv boost with our courses"],
    image: "/assets/img/speech-1.png",
    imageFirst: false,
  },
  {
    value: "100%",
    labelLines: [
      "Of our programs are",
      "created towards student's",
      "profile",
    ],
    image: "/assets/img/speech-2.png",
    imageFirst: true,
  },
] as const;

export const STUDY_JAM = {
  heading: "Begin Your Journey: Explore with a Free #studyJam",
  empty: "No featured programs yet. Add programs in admin.",
} as const;

export const PATH_SECTION = {
  title: "We are mapped for your Education Goals",
  pathTitle: "Discover Your Path",
  image: "/assets/img/outro-program.jpg",
} as const;

export const READY_CTA = {
  caption: "Let's Go",
  title: "Ready to get started?",
  body: "Let's chart your study abroad path, together with Team #PGS.",
  button: "Start Your Journey",
} as const;

export const CONTACT_STRIP = {
  phone: "91 95665 66298",
  email: "connect@purpleguid.study",
  blurb:
    "Reach out on our helpline for fast bookings, expert advice, and answers to all your study abroad questions. We've also got dedicated mentor groups for medical and non-medical courses—so you're always connected to the right people.",
} as const;

/** Mock program cards — empty to match the standalone HTML empty state. */
export const PROGRAMS: {
  title: string;
  tags: string[];
}[] = [];
