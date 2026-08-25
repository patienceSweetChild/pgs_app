export type PathwayId = "usmle" | "amc" | "plab";

export type PathwayContent = {
  id: PathwayId;
  route: string;
  shortName: string;
  heroBadge: string;
  trackLabel: string;
  trackTitle: string;
  trackIntro: string;
  trackBody: string;
  getToKnowTitle: string;
  pathParen: string;
  gatewayTitle: string;
  gatewayBody: string;
  offerHeadline: string;
  meetFitLine: string;
  stats: { value: string; label: string; dash: string }[];
  steps: { title: string; detail: string }[];
  faq: { q: string; a: string }[];
  included: string[];
};

const SHARED_FAQ = [
  {
    q: "How should I plan my study abroad journey for a smooth experience?",
    a: "More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.",
  },
  {
    q: "How should I plan my study abroad journey for a smooth experience?",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
  {
    q: "How should I plan my study abroad journey for a smooth experience?",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
  {
    q: "How should I plan my study abroad journey for a smooth experience?",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
] as const;

const SHARED_INCLUDED = [
  "A well-researched journey checklist with recommended books, Qbanks & Miro planning board",
  "We guide you through all the important forms",
  "Monthly 1:1 feedback sessions",
  "Conference invites in the USA (yep, poster chances too)",
  "Help building a CV that stands out",
  "VISA application guidance",
  "Help in preparing your clinical rotation journey",
  "Be added to a prep group*",
  "Plan & publish your research as a team*",
  "& More",
] as const;

export const PATHWAY_BY_ID: Record<PathwayId, PathwayContent> = {
  usmle: {
    id: "usmle",
    route: "/purpleusme",
    shortName: "USMLE",
    heroBadge: "Masters, STEM UG, MBA & Others",
    trackLabel: "track 1 -",
    trackTitle: "USMLE pathway",
    trackIntro:
      "USMLE prep isn’t just another step like a college application. It’s a full journey that takes time, strategy, and the right guidance.",
    trackBody:
      "This isn’t a last-minute hustle. It’s intense, competitive, and needs solid planning right from day one. You’re not just applying—you’re entering a long game that needs:",
    getToKnowTitle: "USME",
    pathParen: "(USMLE path)",
    gatewayTitle: "🧩 It’s a gateway to Residency in the U.S.",
    gatewayBody:
      "Its a three-step exam that evaluates whether an IMG is ready to practice medicine or enter residency in the U.S. It tests your knowledge, clinical reasoning, and communication skills across Step 1, Step 2 CK, and Step 3 (optional before residency but required after). For IMGs, clearing USMLE is just one part—you’ll also need ECFMG certification, U.S. clinical experience, and a strong profile to match into a residency program through ERAS. It’s a long journey, but totally doable with the right guidance and planning.",
    offerHeadline: "START YOUR USMLE JOURNEY WITH #PURPLEPREMIUM",
    meetFitLine: "Find out if it’s the right fit for your USMLE prep",
    stats: [
      { value: "70%", label: "step 1", dash: "160" },
      { value: "84%", label: "step 2", dash: "190" },
      { value: "85%", label: "step 3", dash: "200" },
    ],
    steps: [
      {
        title: "Step 1",
        detail: "One-day exam\nSeven 60-minute blocks\nUpto 280 MCQ",
      },
      {
        title: "Step 2 CK",
        detail: "One-day exam\nEight 60-minute blocks\nUpto 318 MCQ",
      },
      {
        title: "Step 3",
        detail:
          "Two-day exam\nDay 1 : 6 x 60-minute blocks\nDay 2 : 6 x 45-minute blocks",
      },
    ],
    faq: [...SHARED_FAQ],
    included: [...SHARED_INCLUDED],
  },
  amc: {
    id: "amc",
    route: "/purpleamc",
    shortName: "AMC",
    heroBadge: "For #AMC",
    trackLabel: "track 1 -",
    trackTitle: "AMC pathway",
    trackIntro:
      "AMC prep isn’t just another step like a college application. It’s a full journey that takes time, strategy, and the right guidance.",
    trackBody:
      "This isn’t a last-minute hustle. It’s intense, competitive, and needs solid planning right from day one. You’re not just applying—you’re entering a long game that needs:",
    getToKnowTitle: "AMC",
    pathParen: "(AMC path)",
    gatewayTitle: "🧩 It’s a gateway to practicing medicine in Australia.",
    gatewayBody:
      "The AMC pathway evaluates whether an international medical graduate is ready to practice in Australia. With the right roadmap, profile review, and mentorship, you can plan each step toward registration and clinical practice.",
    offerHeadline: "START YOUR AMC JOURNEY WITH #PURPLEPREMIUM",
    meetFitLine: "Find out if it’s the right fit for your AMC prep",
    stats: [
      { value: "70%", label: "CAT MCQ", dash: "160" },
      { value: "84%", label: "Clinical", dash: "190" },
      { value: "85%", label: "Workplace", dash: "200" },
    ],
    steps: [
      {
        title: "AMC MCQ",
        detail: "Computer adaptive exam\nCore medical knowledge",
      },
      {
        title: "Clinical",
        detail: "Clinical assessment\nStations & skills",
      },
      {
        title: "Pathway",
        detail: "Registration steps\nWorkplace readiness",
      },
    ],
    faq: [...SHARED_FAQ],
    included: [...SHARED_INCLUDED],
  },
  plab: {
    id: "plab",
    route: "/purpleplab",
    shortName: "PLAB",
    heroBadge: "For #PLAB",
    trackLabel: "track 1 -",
    trackTitle: "PLAB pathway",
    trackIntro:
      "PLAB prep isn’t just another step like a college application. It’s a full journey that takes time, strategy, and the right guidance.",
    trackBody:
      "This isn’t a last-minute hustle. It’s intense, competitive, and needs solid planning right from day one. You’re not just applying—you’re entering a long game that needs:",
    getToKnowTitle: "plab",
    pathParen: "(PLAB path)",
    gatewayTitle: "🧩 It’s a gateway to practicing medicine in the U.K.",
    gatewayBody:
      "PLAB has shifted from a popular option to a highly competitive path even after licensing. We guide you from prep to post-job steps, starting before PLAB 1, with mentor feedback and a clear roadmap.",
    offerHeadline: "START YOUR PLAB JOURNEY WITH #PURPLEPREMIUM",
    meetFitLine: "Find out if it’s the right fit for your PLAB prep",
    stats: [
      { value: "70%", label: "PLAB 1", dash: "160" },
      { value: "84%", label: "PLAB 2", dash: "190" },
      { value: "85%", label: "GMC", dash: "200" },
    ],
    steps: [
      {
        title: "PLAB 1",
        detail: "Written exam\nApplied knowledge",
      },
      {
        title: "PLAB 2",
        detail: "OSCE-style stations\nClinical skills",
      },
      {
        title: "GMC",
        detail: "Registration\nJob search support",
      },
    ],
    faq: [...SHARED_FAQ],
    included: [...SHARED_INCLUDED],
  },
};

export const DASHBOARD_FEATURES = [
  "Track Your Personalized\nJourney Map",
  "Every draft,\nchecklist,\nand to-do",
  "Direct Notes\nfrom\nMentors",
  "See what\nthey need\nto do next",
  "Real-Time\nUniversity\nDeadlines",
] as const;

export const WHAT_YOU_GET_FORMS = [
  "ECFMG account setup",
  "Form 186 (identity verification)",
  "USMLE application",
  "OASIS portal walk-throughs",
] as const;

export const WHAT_YOU_GET_CHECKLIST = [
  "Recommended QBanks, review books.",
  "Suggested mocks for your stage.",
  "Personalized Journey Map",
  "Miro board planning",
] as const;
