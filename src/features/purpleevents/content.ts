export type EventDate = {
  day: string;
  month: string;
  time: string;
};

export type UpcomingSession = {
  id: string;
  title: string;
  start: EventDate;
  end: EventDate;
  whoFor?: string;
  topics?: string[];
  image: string;
  author?: string;
  tags?: string[];
  mode?: string;
  blurb?: string;
};

export type SessionTestimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
};

export type SessionPageLabels = {
  note?: string;
  whatWeCover?: string;
  whoFor?: string;
  sessionTopics?: string;
  facilitators?: string;
  upcoming?: string;
  download?: string;
  highlights?: string;
  cta?: string;
  faq?: string;
  hostPrefix?: string;
};

export type SessionRoadmap = {
  title: string;
  body: string;
  footer: string;
};

export type SessionPoster = {
  title: string;
  body: string;
  inviteTitle: string;
  inviteBody: string;
  live: string;
  topics: string[];
  qrUrl?: string;
  /** Poster panel background image (defaults to green-1.png). */
  bgUrl?: string;
};

export type SessionHighlights = {
  heading: string;
  title: string;
  location: string;
  body: string;
  images: string[];
};

export type SessionCta = {
  eyebrow: string;
  title: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
};

export type SessionFaqItem = {
  q: string;
  a: string;
};

export type SessionDetail = UpcomingSession & {
  host: string;
  subtitle: string;
  description: string;
  whoForLines: string[];
  sessionTopics: string[];
  coverItems: string[];
  /** Green aside lines beside the session perks checklist. */
  benefitsAsideLines?: string[];
  /** Checklist items (Welcome Kit, Live Q&A, …). */
  benefits?: string[];
  note: string;
  about: string;
  facilitators: { name: string; role: string; image: string }[];
  testimonials?: SessionTestimonial[];
  enrollLabel?: string;
  /** Hero enroll chip background (hex). */
  badgeColor?: string;
  /** Hero enroll chip text color (hex). */
  badgeTextColor?: string;
  /** Hero enroll chip GIF / icon URL. */
  badgeIcon?: string;
  /** When false, hide the Upcoming Sessions carousel on the session page. */
  showUpcomingSessions?: boolean;
  roadmap?: SessionRoadmap;
  poster?: SessionPoster;
  highlights?: SessionHighlights;
  cta?: SessionCta;
  faqItems?: SessionFaqItem[];
  labels?: SessionPageLabels;
};

/** Defaults for editable section headings on the public page. */
export const DEFAULT_SECTION_LABELS: Required<SessionPageLabels> = {
  note: "note",
  whatWeCover: "What We’ll Cover in This Session:",
  whoFor: "Who’s It For?",
  sessionTopics: "Session Topics",
  facilitators: "Meet Your Facilitators",
  upcoming: "Upcoming Sessions",
  download: "Download the poster. Share it. Tag us on your fav socials.",
  highlights: "#higlights",
  cta: "Ready to get started?",
  faq: "Frequently Asked Questions",
  hostPrefix: "Host : ",
};

const IMG = {
  tab: "/assets/img/tab-img.jpg",
  saved: "/assets/img/saved_4.jpg",
  hero: "/assets/img/heroImage.png",
  founder: "/assets/img/founder.png",
  photo: "/assets/img/photo-2.jpg",
} as const;

export const UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: "10",
    title: "MSc Automotive Engineering Practice",
    start: { day: "18", month: "Jul 26", time: "5:26 pm" },
    end: { day: "24", month: "Jul 26", time: "5:26 pm" },
    whoFor: "test",
    topics: ["test"],
    image: IMG.tab,
    author: "test",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    mode: "#Online",
    blurb: "test",
  },
  {
    id: "9",
    title: "MSc Automotive Engineering Practice",
    start: { day: "07", month: "Jul 26", time: "12:19 pm" },
    end: { day: "09", month: "Jul 26", time: "12:19 pm" },
    whoFor: "test",
    topics: ["test"],
    image: IMG.hero,
    author: "test",
    tags: ["#UK", "#Engineering", "#Scholarship"],
    mode: "#inCampus",
    blurb: "test",
  },
  {
    id: "8",
    title: "Purple Events Latest",
    start: { day: "16", month: "Jul 26", time: "11:25 pm" },
    end: { day: "17", month: "Jul 26", time: "11:25 pm" },
    image: IMG.tab,
    author: "efwc",
    tags: ["#TEAMPGS", "#UK"],
    mode: "#inCampus",
    blurb: "tress",
  },
  {
    id: "7",
    title: "Online study abroad plan meetup",
    start: { day: "28", month: "May 26", time: "1:44 pm" },
    end: { day: "30", month: "May 27", time: "5:44 pm" },
    whoFor:
      "Final-year student?\nRecent grad?\nResearching for masters?\nThis session’s made for you.",
    topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
    image: IMG.hero,
    tags: ["#USA", "#UK", "#Masters"],
    mode: "#Online",
  },
  {
    id: "6",
    title: "Online study abroad plan meetup",
    start: { day: "25", month: "May 26", time: "1:40 pm" },
    end: { day: "22", month: "May 27", time: "1:41 pm" },
    whoFor:
      "Final-year student?\nRecent grad?\nResearching for masters?\nThis session’s made for you.",
    topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
    image: IMG.tab,
    tags: ["#USA", "#UK"],
    mode: "#Online",
  },
  {
    id: "5",
    title: "Online study test",
    start: { day: "23", month: "May 26", time: "4:51 pm" },
    end: { day: "21", month: "May 27", time: "4:51 pm" },
    whoFor:
      "Final-year student?\nRecent grad?\nResearching for masters?\nThis session’s made for you.",
    topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
    image: IMG.hero,
    tags: ["#USA", "#UK"],
    mode: "#Online",
  },
  {
    id: "4",
    title: "Purple Events Latest",
    start: { day: "26", month: "Mar 26", time: "12:07 pm" },
    end: { day: "31", month: "Mar 26", time: "12:07 pm" },
    whoFor: "Final-year student?\nRecent grad? Researching\nfor masters?",
    topics: ["Masters in USA", "UK for graduates"],
    image: IMG.tab,
    tags: ["#TEAMPGS"],
    mode: "#Online",
  },
  {
    id: "3",
    title: "Final Event Testing",
    start: { day: "19", month: "Mar 26", time: "6:00 pm" },
    end: { day: "25", month: "Mar 26", time: "6:01 pm" },
    whoFor: "This is for the students",
    topics: ["topic one", "topic two", "topic three"],
    image: IMG.hero,
    tags: ["#PGS"],
    mode: "#Online",
  },
  {
    id: "2",
    title: "Event 2",
    start: { day: "27", month: "Mar 26", time: "12:50 pm" },
    end: { day: "28", month: "Mar 26", time: "12:51 pm" },
    whoFor: "section description text",
    topics: ["topic1, topic 2"],
    image: IMG.tab,
    tags: ["#Event"],
    mode: "#Online",
  },
  {
    id: "1",
    title: "Test Title",
    start: { day: "26", month: "Mar 26", time: "12:47 pm" },
    end: { day: "26", month: "Mar 26", time: "12:47 pm" },
    whoFor: "Applicants",
    topics: ["Topic 1, Topic 2, Topic 3"],
    image: IMG.hero,
    tags: ["#Test"],
    mode: "#Online",
  },
];

export const SESSION_PERKS = [
  "Welcome Kit",
  "Live Q&A with Expert Counsellors",
  "Tips that you should know",
  "Goal-tracking and reflection chart",
  "Prep templates",
] as const;

export const EVENT_TESTIMONIAL_QUOTE =
  "Everything changed when I crossed paths with my mentor, Mr. Nilmek of purpleGuide. Back when uncertainty clouded my path, they gave me more than just the right guidance—they offered unwavering support and care at every step. For me, they didn't just make my dream possible—they made it happen.";

export const EVENT_TESTIMONIALS: SessionTestimonial[] = [
  {
    quote: EVENT_TESTIMONIAL_QUOTE,
    name: "VILIVI P AYE",
    role: "#purplePremium student",
    location: "#UK",
    image: IMG.photo,
  },
  {
    quote: EVENT_TESTIMONIAL_QUOTE,
    name: "VILIVI P AYE",
    role: "#purplePremium student",
    location: "#UK",
    image: IMG.photo,
  },
];

export const ROADMAP = {
  title: "Walk away with a clear roadmap for your study abroad journey.",
  body: "Get tips, avoid common mistakes, and boost your admit chances to top UK universities—plus crack scholarships, SOPs, and ROI planning like a pro.",
  footer:
    "More sessions coming up for Medical aspirants & for STEAM streams connect with our counselors to get started. Get your seat locked.",
} as const;

export const DOWNLOAD_COPY = {
  title: "Download the poster. Share it. Tag us on your fav socials.",
  body: "Help us spread the word, and you might just win a Purple Hamper and get free guidance on one research project. Become a #PurpleAmbassador.",
  inviteTitle: "for aspirants",
  inviteBody:
    "Designed for Master’s, MBA, and Engineering aspirants planning to study abroad.",
  live: "Live on Zoom",
  topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
} as const;

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

/** Default session page content used for admin live preview / new-event seed. */
export const SESSION_PAGE_MOCK: SessionDetail = {
  id: "mock",
  title: "Online study abroad plan meetup",
  start: { day: "28", month: "May 26", time: "1:44 pm" },
  end: { day: "30", month: "May 27", time: "5:44 pm" },
  whoFor:
    "Final-year student?\nRecent grad?\nResearching for masters?\nThis session’s made for you.",
  topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
  image: IMG.saved,
  author: "#teamPGS",
  tags: ["#USA", "#UK", "#Masters"],
  mode: "#Online",
  blurb:
    "Live session for masters & STEAM aspirants planning study abroad.",
  host: "#teamPGS",
  subtitle: "Study abroad planning meetup",
  description:
    "Plan your study abroad journey with #teamPGS — tips, scholarships, SOPs, and ROI.",
  whoForLines: [
    "Final-year student?",
    "Recent grad?",
    "Researching for masters?",
    "This session’s made for you.",
  ],
  sessionTopics: [
    "Masters in USA UK for graduates",
    "How to prepare your finances",
  ],
  coverItems: [
    "Welcome & agenda",
    "Country shortlist framework",
    "Scholarship timeline",
    "SOP pitfalls to avoid",
  ],
  benefitsAsideLines: [
    "Final-year student?",
    "Recent grad?",
    "Researching for masters?",
  ],
  benefits: [...SESSION_PERKS],
  note: "This is a tailor made event for Masters, engineering & Mba Aspirants",
  about:
    "Plan your study abroad journey with #teamPGS — tips, scholarships, SOPs, and ROI.",
  facilitators: [
    { name: "Vidhi", role: "Lead Counsellor", image: IMG.founder },
    { name: "Nilmek", role: "Mentor", image: IMG.founder },
  ],
  testimonials: [EVENT_TESTIMONIALS[0]],
  enrollLabel: "Enroll Now",
  showUpcomingSessions: true,
  roadmap: {
    title: ROADMAP.title,
    body: ROADMAP.body,
    footer: ROADMAP.footer,
  },
  poster: {
    title: DOWNLOAD_COPY.title,
    body: DOWNLOAD_COPY.body,
    inviteTitle: DOWNLOAD_COPY.inviteTitle,
    inviteBody: DOWNLOAD_COPY.inviteBody,
    live: DOWNLOAD_COPY.live,
    topics: [...DOWNLOAD_COPY.topics],
    qrUrl: "/assets/img/qr-2.png",
    bgUrl: "/assets/img/green-1.png",
  },
  highlights: {
    heading: DEFAULT_SECTION_LABELS.highlights,
    title:
      "Students, in action —presenting their posters at an international medical conference.",
    location: "Washington, D.C.",
    body: "Our NETWORK students* had a great time presenting their posters at an international medical conference—meeting med students from the U.S. and future doctors from around the world. It was solid exposure, good conversations, yep—definitely a strong addition to their resume.",
    images: [
      "/assets/img/g-1.jpg",
      "/assets/img/g-3.jpg",
      "/assets/img/g-3.jpg",
    ],
  },
  cta: {
    eyebrow: "Let's Go",
    title: "Ready to get started?",
    body: "Let’s chart your study abroad path, together with Team #PGS.",
    buttonLabel: "Start Your Journey",
    buttonHref: "/contact",
  },
  faqItems: FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a })),
  labels: { ...DEFAULT_SECTION_LABELS },
};

export const FEATURED_SESSION: SessionDetail = {
  ...SESSION_PAGE_MOCK,
  ...UPCOMING_SESSIONS[0],
  host: "#teamPGS",
  subtitle: SESSION_PAGE_MOCK.subtitle,
  description: SESSION_PAGE_MOCK.description,
  whoForLines: SESSION_PAGE_MOCK.whoForLines,
  sessionTopics: SESSION_PAGE_MOCK.sessionTopics,
  coverItems: SESSION_PAGE_MOCK.coverItems,
  note: SESSION_PAGE_MOCK.note,
  about: SESSION_PAGE_MOCK.about,
  facilitators: SESSION_PAGE_MOCK.facilitators,
  testimonials: SESSION_PAGE_MOCK.testimonials,
  enrollLabel: "Enroll Now",
  image: IMG.saved,
  showUpcomingSessions: true,
  roadmap: SESSION_PAGE_MOCK.roadmap,
  poster: SESSION_PAGE_MOCK.poster,
  highlights: SESSION_PAGE_MOCK.highlights,
  cta: SESSION_PAGE_MOCK.cta,
  faqItems: SESSION_PAGE_MOCK.faqItems,
  labels: SESSION_PAGE_MOCK.labels,
};

const SESSION_OVERRIDES: Partial<Record<string, Partial<SessionDetail>>> = {
  "10": FEATURED_SESSION,
  "7": {
    whoForLines: [
      "Final-year student?",
      "Recent grad?",
      "Researching for masters?",
      "This session’s made for you.",
    ],
    sessionTopics: [
      "Masters in USA UK for graduates",
      "How to prepare your finances",
    ],
    subtitle: "Study abroad planning meetup",
    note: "Tailored for masters & STEAM aspirants",
    about: "Plan your study abroad journey with #teamPGS.",
  },
};

export function getSessionById(id: string): SessionDetail {
  const base = UPCOMING_SESSIONS.find((s) => s.id === id) ?? UPCOMING_SESSIONS[0];
  const override = SESSION_OVERRIDES[id] ?? {};
  return {
    ...base,
    host: "#teamPGS",
    subtitle: base.title,
    description: base.blurb ?? base.whoFor ?? "Session details",
    whoForLines: (base.whoFor ?? "Applicants").split("\n"),
    sessionTopics: base.topics ?? [],
    coverItems: base.topics ?? ["Session overview"],
    note:
      "This is a tailor made event for Masters, engineering & Mba Aspirants",
    about: base.blurb ?? "test",
    facilitators: [
      { name: base.author ?? "test", role: "Facilitator", image: IMG.founder },
    ],
    enrollLabel: "Enroll Now",
    image: base.image || IMG.saved,
    roadmap: SESSION_PAGE_MOCK.roadmap,
    poster: SESSION_PAGE_MOCK.poster,
    highlights: SESSION_PAGE_MOCK.highlights,
    cta: SESSION_PAGE_MOCK.cta,
    faqItems: SESSION_PAGE_MOCK.faqItems,
    labels: SESSION_PAGE_MOCK.labels,
    ...override,
  };
}

export const SOCIAL_SHARE = [
  { href: "#", src: "/assets/img/outline-wp.png", alt: "WhatsApp" },
  { href: "#", src: "/assets/img/outline-messager.png", alt: "Messenger" },
  { href: "#", src: "/assets/img/outline-insta.png", alt: "Instagram" },
  { href: "#", src: "/assets/img/outline-facebook.png", alt: "Facebook" },
] as const;
