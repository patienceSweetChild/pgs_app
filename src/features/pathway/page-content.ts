/**
 * Full page content schemas for PurplePremium pathway landing pages.
 * Used by public pages, CMS editor, and static fallbacks.
 */

import {
  DASHBOARD_FEATURES as MED_DASHBOARD,
  PATHWAY_BY_ID,
  WHAT_YOU_GET_CHECKLIST,
  WHAT_YOU_GET_FORMS,
  type PathwayId,
} from "./content";
import {
  CV_CHECKLIST,
  DASHBOARD_FEATURES as NONMED_DASHBOARD,
  FAQ_ITEMS,
  MEET_BULLETS,
  OFFER_INCLUDED,
  STUDENT_CAPTION,
  TESTIMONIAL_QUOTE,
  WHY_BUILT_BULLETS,
} from "@/features/purplenonmedical/content";

export type PathwaySlug = "usmle" | "plab" | "amc" | "stem" | "mba";
export type PathwayTemplate = "medical" | "nonmedical";

export const PATHWAY_SLUGS: readonly PathwaySlug[] = [
  "usmle",
  "plab",
  "amc",
  "stem",
  "mba",
] as const;

export const MEDICAL_SLUGS: readonly PathwayId[] = ["usmle", "plab", "amc"];
export const NONMEDICAL_SLUGS: readonly PathwaySlug[] = ["stem", "mba"];

export function isPathwaySlug(value: string): value is PathwaySlug {
  return (PATHWAY_SLUGS as readonly string[]).includes(value);
}

export function templateForSlug(slug: PathwaySlug): PathwayTemplate {
  return (MEDICAL_SLUGS as readonly string[]).includes(slug)
    ? "medical"
    : "nonmedical";
}

export type CvChecklistItem = { dot: string; text: string };

export type PathwayIntroContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeLine: string;
  heroCtaLabel: string;
  heroCtaSubtext: string;
  stepIntoImage: string;
  stepIntoImageAssetId?: string | null;
  stepIntoBadgeLine: string;
  stepIntoTrustLine: string;
  whyBuiltTitle: string;
  whyBuiltSubtitle: string;
  whyBuiltBullets: string[];
  purpleMapHeadline: string;
  purpleMapSubhead: string;
  purpleMapCrossLink: string;
  purpleMapPathTitle: string;
  purpleMapPathSubtext: string;
  purpleMapImage: string;
  purpleMapImageAssetId?: string | null;
  cvTitle: string;
  cvBody: string;
  cvRecruiterTitle: string;
  cvRecruiterSubtext: string;
  cvIntroLine: string;
  cvChecklist: CvChecklistItem[];
  cvCardTitle: string;
  cvCardUnplanned: string;
  cvCardResearched: string;
  cvCardFooter: string;
};

export type PathwayStat = { value: string; label: string; dash: string };
export type PathwayStep = { title: string; detail: string };
export type PathwayFaq = { q: string; a: string };

export type PathwayOfferContent = {
  headline: string;
  subtext: string;
  discountLabel: string;
  wasPrice: string;
  price: string;
  enrollLabel: string;
  includedTitle: string;
  includedIntro: string;
  included: string[];
  footerNote: string;
};

export type PathwayMeetContent = {
  title: string;
  subtext: string;
  bullets: string[];
  cardTitle: string;
  cardSubtitle: string;
  cardBody: string;
  ctaLabel: string;
};

export type PathwayContactContent = {
  phone: string;
  email: string;
  blurb: string;
};

export type PathwayDashboardContent = {
  title: string;
  image: string;
  imageAssetId?: string | null;
  features: string[];
};

export type MedicalTrackContent = {
  sectionLabel: string;
  trackLabel: string;
  trackTitle: string;
  trackIntro: string;
  trackBody: string;
  cardSmartShortlist: string;
  cardRotation: string;
  cardTimeline: string;
  cardCertificates: string;
  bottomHeadline: string;
  bottomBody: string;
  portraitImage: string;
  testimonialQuote: string;
};

export type MedicalPathwaySection = {
  pathParen: string;
  pathIntro: string;
  getToKnowTitle: string;
  gatewayTitle: string;
  gatewayBody: string;
  stats: PathwayStat[];
  steps: PathwayStep[];
  performanceLabel: string;
  performanceNote: string;
  timelineNote: string;
  residencyTitle: string;
  residencyBody: string;
  matchSystemNote: string;
  whatYouGetTitle: string;
  networkHeadline: string;
  networkBody: string;
  formsTitle: string;
  forms: string[];
  prepGroupTitle: string;
  prepGroupBody: string;
  conferenceNote: string;
  checklistTitle: string;
  checklist: string[];
  rotationsTitle: string;
  rotationsSubtext: string;
  visaHelpTitle: string;
  cvHelpTitle: string;
  ctaLabel: string;
};

export type MedicalPathwayPageContent = {
  slug: PathwaySlug;
  shortName: string;
  heroBadge: string;
  intro: PathwayIntroContent;
  track: MedicalTrackContent;
  pathway: MedicalPathwaySection;
  counselorQuote: string;
  counselorTag: string;
  documentationTitle: string;
  documentationCta: string;
  documentationInboxNote: string;
  documentationBody: string;
  documentationImage: string;
  documentationImageAssetId?: string | null;
  documentationSideImage: string;
  documentationSideImageAssetId?: string | null;
  dashboard: PathwayDashboardContent;
  offer: PathwayOfferContent;
  meet: PathwayMeetContent;
  faq: PathwayFaq[];
  contact: PathwayContactContent;
};

export type NonMedicalTrackContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  cardSmartShortlist: string;
  cardFeedback: string;
  cardApplications: string;
  cardScholarship: string;
  approachHeadline: string;
  approachBody: string;
  testimonialQuote: string;
  studentName: string;
  studentLabel: string;
  studentCountry: string;
  studentPhoto: string;
};

export type NonMedicalProgramContent = {
  title: string;
  badge: string;
  shortAnswerLabel: string;
  shortAnswer: string;
  realAnswerLabel: string;
  realAnswer: string;
  gettingHeadline: string;
  gettingSubhead: string;
  aiTitle: string;
  aiBody: string;
  pathwayTitle: string;
  pathwayBody: string;
  supportTitle: string;
  supportBody: string;
  communityTitle: string;
  communityBody: string;
  aiTagline: string;
  launchpadHeadline: string;
  universitiesTitle: string;
  universitiesBody1: string;
  universitiesBody2: string;
  universitiesHelp: string;
  profileReviewTitle: string;
  profileReviewCta: string;
  limitedSlotsHeadline: string;
};

export type NonMedicalOfferItem = {
  main: string;
  sub?: string[];
};

export type NonMedicalPathwayPageContent = {
  slug: PathwaySlug;
  shortName: string;
  intro: PathwayIntroContent;
  track: NonMedicalTrackContent;
  program: NonMedicalProgramContent;
  counselorQuote: string;
  counselorTag: string;
  dashboard: PathwayDashboardContent;
  offer: PathwayOfferContent;
  offerIncluded: NonMedicalOfferItem[];
  meet: PathwayMeetContent;
  faq: PathwayFaq[];
  contact: PathwayContactContent;
};

export type PathwayPageContent =
  | MedicalPathwayPageContent
  | NonMedicalPathwayPageContent;

const DEFAULT_INTRO: PathwayIntroContent = {
  heroTitle:
    "Get Into Your Dream University Abroad with a Structured Workflow",
  heroSubtitle:
    "Boost Your Chances of Selection 3X with Smart, Informed University Picks",
  heroBadgeLine: "For Medical, STEM, and More—We've Got You Covered",
  heroCtaLabel: "Set Up a Quick Call",
  heroCtaSubtext:
    "Clear All Your Doubts in 30 Minutes, Figure out your scholarship path.",
  stepIntoImage: "/assets/img/music.png",
  stepIntoBadgeLine: "Masters, STEM\nUG, MBA & Others",
  stepIntoTrustLine:
    "Backed by experience. Trusted by students since 2006 (formerly CEG).",
  whyBuiltTitle: "Why We Built #PurplePremium (And Why It Matters)",
  whyBuiltSubtitle: "The high-stakes medical pathways:",
  whyBuiltBullets: [...WHY_BUILT_BULLETS],
  purpleMapHeadline: "This is where #purplePremium comes in.",
  purpleMapSubhead: "Because not every journey needs the same map. Explore them below.",
  purpleMapCrossLink: "For all from — STEM, Management, Design & More.",
  purpleMapPathTitle: "Your path.\nLet's get started.",
  purpleMapPathSubtext: "",
  purpleMapImage: "/assets/img/play-book-read.png",
  cvTitle: "Getting into a medical pathway that's well-researched matters, a lot.",
  cvBody:
    "Let's be real—studying abroad isn't just \"another phase.\" And it's not just about taking classes. You're chasing that high-paying job, aiming to build a global network, and picking up real skills that actually make you stand out.",
  cvRecruiterTitle: "You need to start thinking like a recruiter.",
  cvRecruiterSubtext: "What are they going to see when they open your CV post-graduation?",
  cvIntroLine: "You guessed it, it's not just about the degree, —it all stacks up.",
  cvChecklist: CV_CHECKLIST.map(({ dot, text }) => ({ dot, text })),
  cvCardTitle: "Study Abroad Pathway",
  cvCardUnplanned: "un-planned",
  cvCardResearched: "well-researched 🙌",
  cvCardFooter:
    "It's about launching your future. You owe it to yourself to do it right. And we're here to make sure you do. #pgs",
};

const DEFAULT_OFFER: Omit<PathwayOfferContent, "headline" | "includedIntro" | "included"> = {
  subtext:
    "Every student's journey takes time, attention, and real mentorship. That's why we limit the number of students each batch - so our experts can actually guide, not just supervise.",
  discountLabel: "35% off",
  wasPrice: "was ₹ 509,999",
  price: "₹ 65,0000",
  enrollLabel: "Enroll Now",
  includedTitle: "What's Included when you sign up:",
  footerNote:
    "You get full access for a year—and even after that, we're still here when you need us. From Step 1 to Step 2, we've got the tools, tips, and real guidance to back you up.",
};

const DEFAULT_MEET: Omit<PathwayMeetContent, "bullets"> = {
  title: "Got questions about #purplePremium?",
  subtext: "Let's clear them in one quick call.",
  cardTitle: "MEET + GREET",
  cardSubtitle: "With an Expert",
  cardBody: "Check the available slots & book your appointment.",
  ctaLabel: "Schedule Now",
};

const DEFAULT_CONTACT: PathwayContactContent = {
  phone: "91 95665 66298",
  email: "connect@purpleguide.study",
  blurb:
    "Reach out on our helpline for fast bookings, expert advice, and answers to all your study abroad questions. We've also got dedicated mentor groups for medical and non-medical courses—so you're always connected to the right people.",
};

const DEFAULT_DASHBOARD: PathwayDashboardContent = {
  title: "Unlock the full power of your personalized dashboard with Purple Premium",
  image: "/assets/img/restro-img.jpg",
  features: [...MED_DASHBOARD],
};

function buildMedicalPathwaySection(
  slug: PathwayId,
): MedicalPathwaySection {
  const base = PATHWAY_BY_ID[slug];
  return {
    pathParen: base.pathParen,
    pathIntro:
      "This is where real mentorship kicks in, aka #purplePremium for Medical. Let's show you how.",
    getToKnowTitle: base.getToKnowTitle,
    gatewayTitle: base.gatewayTitle,
    gatewayBody: base.gatewayBody,
    stats: base.stats.map((s) => ({ ...s })),
    steps: base.steps.map((s) => ({ ...s })),
    performanceLabel: "Performance Data",
    performanceNote: "(2024* Passing%)",
    timelineNote: "This pathway will tak 2-3 years of your time to complete",
    residencyTitle: "Residency or Fellowship:",
    residencyBody:
      "Whether you stop at residency or chase a specialty you're part of the system.",
    matchSystemNote:
      "The U.S. Match system is one of the most organized and transparent residency processes worldwide.",
    whatYouGetTitle: `What you get with #PurplePremium for your ${base.shortName} journey`,
    networkHeadline: "Network. De-stress. Stand Out.",
    networkBody:
      "From the moment you decide to take this path, we'll help you build your plan, choose the right resources, guide you through registrations, visa steps, and even get you invites to prestigious medical meetups in the U.S. ❤️",
    formsTitle: "📌 We guide you through all the important forms",
    forms: [...WHAT_YOU_GET_FORMS],
    prepGroupTitle: "Be added to a prep group",
    prepGroupBody:
      "As students join, we group them with peers on a similar path—so they can share strategies, stay motivated, and grow together.",
    conferenceNote:
      "As part of your profile-building, you'll have the opportunity to showcase your research poster at medical conferences in the U.S. and we'll guide you through every step.",
    checklistTitle: "we get you a major checklist to get you on your path",
    checklist: [...WHAT_YOU_GET_CHECKLIST],
    rotationsTitle: "Get Matched for Clinical Rotations",
    rotationsSubtext: "Exclusive discounts for purplePremium students,",
    visaHelpTitle: "VISA application help",
    cvHelpTitle: "Help in building your CV",
    ctaLabel: `Step into the ${base.shortName} grind—with #purplePremium`,
  };
}

export function getMedicalPathwayContent(
  slug: PathwaySlug,
): MedicalPathwayPageContent | null {
  if (!(MEDICAL_SLUGS as readonly string[]).includes(slug)) return null;
  const id = slug as PathwayId;
  const base = PATHWAY_BY_ID[id];
  const intro = structuredClone(DEFAULT_INTRO);
  if (slug !== "usmle") {
    intro.stepIntoBadgeLine = base.heroBadge;
  }

  return {
    slug,
    shortName: base.shortName,
    heroBadge: base.heroBadge,
    intro,
    track: {
      sectionLabel: "MEDICAL PATHWAY",
      trackLabel: base.trackLabel,
      trackTitle: base.trackTitle,
      trackIntro: base.trackIntro,
      trackBody: base.trackBody,
      cardSmartShortlist: "Smart shortlisting\n+\nProfile deep-dive",
      cardRotation:
        "Observation or rotation training that aligns with the medical system you're aiming for",
      cardTimeline:
        "And a timeline that doesn't burn you out or waste years",
      cardCertificates: "Pathway-relevant certificate\ncourses",
      bottomHeadline:
        "Yes, the competition is global, but so are the rewards —stay sharp and go claim yours.",
      bottomBody:
        "We've worked closely with students who've taken this path—and yeah, it definitely takes commitment. But with the right mentor and a clear plan, it makes all the difference. That's why we've built a solid approach for each pathway, helping our students stay on track and move forward with confidence.",
      portraitImage: "/assets/img/step.png",
      testimonialQuote: TESTIMONIAL_QUOTE,
    },
    pathway: buildMedicalPathwaySection(id),
    counselorQuote:
      "From your first step to your final admit or medical pathway — our expert counselors guide the entire journey with you.",
    counselorTag: "purpleguide.study",
    documentationTitle: "DOCUMENTATION\nREQUIREMENTS FOR\nUSCE",
    documentationCta: "Request it here",
    documentationInboxNote: "— we'll send it straight to your inbox.",
    documentationBody:
      "Whether you're just getting started or planning ahead for all three steps, knowing the costs involved can help you make better decisions. From registration fees and travel expenses to prep materials and clinical rotations — we've mapped out the full journey. Just drop a request and get a clear picture of what to expect, without surprises.",
    documentationImage: "/assets/img/doctor.png",
    documentationSideImage: "/assets/img/insta-girl.png",
    dashboard: { ...DEFAULT_DASHBOARD, features: [...MED_DASHBOARD] },
    offer: {
      ...DEFAULT_OFFER,
      headline: base.offerHeadline,
      includedIntro: `A 10-point journey built by seeing what ${base.shortName} aspirants really go through—and what kind of support actually makes a difference.`,
      included: [...base.included],
    },
    meet: {
      ...DEFAULT_MEET,
      bullets: [
        base.meetFitLine,
        "Talk about your profile (and yep, you might just score a discount depending on your journey stage)",
        "Figure out how to start a roadmap from exactly where you stand",
        'Got a "what if" or "how do I"? Clear it over the call',
      ],
    },
    faq: base.faq.map((f) => ({ ...f })),
    contact: { ...DEFAULT_CONTACT },
  };
}

export function getNonMedicalPathwayContent(
  slug: PathwaySlug,
): NonMedicalPathwayPageContent | null {
  if (!(NONMEDICAL_SLUGS as readonly string[]).includes(slug)) return null;
  const shortName = slug === "mba" ? "MBA" : "STEM";
  const trackTitle =
    slug === "mba"
      ? "MBA & Management Deadlines Sneak Up Fast"
      : "Study Abroad Deadlines Sneak Up Fast";

  return {
    slug,
    shortName,
    intro: structuredClone(DEFAULT_INTRO),
    track: {
      sectionLabel: "MEDICAL PATHWAY",
      title: trackTitle,
      subtitle: "Fall 2025 Is Already Ticking",
      body: "If you haven't sorted your profile, picked your countries and unis, or planned your SOP yet… hey, no stress—but it's definitely time to move!",
      ctaLabel: "Start Your #purplePremium Journey",
      cardSmartShortlist: "Smart shortlisting\n+\nProfile deep-dive",
      cardFeedback: "Book feedback sessions",
      cardApplications: "Fast-tracked\napplications\n+\nResult-driven SOP",
      cardScholarship: "Scholarship alerts\n+\nKey Checklists\nCountry-wise steps\n+\nVisa status",
      approachHeadline: "Simple, clear, useful",
      approachBody:
        "Using our experience, feedback from students who made it, and insights from thousands of real applications—we've built an approach that puts you, the student, at the center ❤️",
      testimonialQuote: TESTIMONIAL_QUOTE,
      studentName: STUDENT_CAPTION.name,
      studentLabel: STUDENT_CAPTION.label,
      studentCountry: STUDENT_CAPTION.country,
      studentPhoto: "/assets/img/photo-2.jpg",
    },
    program: {
      title: "What Is #purplePremium?",
      badge: "for non medical",
      shortAnswerLabel: "Short answer?",
      shortAnswer: "It's your full study abroad counseling service.",
      realAnswerLabel: "Real answer?",
      realAnswer:
        'It\'s the only support system you\'ll need to get from "Where do I start?" to "I just landed at my dream university.',
      gettingHeadline: "Here's what you're getting out of it—",
      gettingSubhead: "(And this is where we stand out)",
      aiTitle: "🎯 1. AI + Human Profile Analysis",
      aiBody:
        "Our custom-built AI agents go through your CV, goals, and requirements—quickly identifying strengths, concerns, and what else can boost your profile. Then our experienced counselors step in to cross-check those insights, verify them against your documents, and build a detailed profile tailored for your journey—bringing human expertise where it counts.",
      pathwayTitle: "🧩 2. A Pathway Made Just for You",
      pathwayBody:
        "We don't believe in one-size-fits-all. You'll either be guided through one of our proven admission pathways or we'll design a custom route that fits your academic goals, timelines, and personal preferences.",
      supportTitle: "📌 3. End-to-End Support for Your Study Abroad Journey—Every Step, Covered.",
      supportBody:
        "#purplePremium isn't just about helping with the application. We'll be with you every step of the way—from shortlisting universities to help craft your SOP, guiding you through visa steps, and even helping with your packing list. All the way until you're settled in at your university—and beyond that, if you ever need us.",
      communityTitle: "🌍 4. A Growing Student Community",
      communityBody:
        "we're building a secure forum where students can connect, share their journeys, and support one another—created for all our past, present, and future students. As a #purplePremium student, you'll be among the first to join, at no extra cost.",
      aiTagline: "We use AI to assist—not replace—real experience.",
      launchpadHeadline:
        "Whatever your stream; design, STEM, or management —this is your launchpad.",
      universitiesTitle: "If you're aiming for one of those globally ranked universities",
      universitiesBody1:
        "You already know it's a whole different game. Grades and test scores aren't enough. They're after originality, leadership, depth, and purpose. In short: the full package.",
      universitiesBody2: "We'll help you build exactly that—step by step.",
      universitiesHelp: "",
      profileReviewTitle:
        "Get your profile reviewed for entry into world-class institutions.",
      profileReviewCta: "Evaluate Your Profile Today",
      limitedSlotsHeadline: "We open limited slots each month",
    },
    counselorQuote:
      "From your first step to your final admit or medical pathway — our expert counselors guide the entire journey with you.",
    counselorTag: "purpleguide.study",
    dashboard: { ...DEFAULT_DASHBOARD, features: [...NONMED_DASHBOARD] },
    offer: {
      ...DEFAULT_OFFER,
      headline: `START YOUR ${shortName} JOURNEY WITH #PURPLEPREMIUM`,
      includedIntro: `A 10-point journey built by seeing what ${shortName} aspirants really go through—and what kind of support actually makes a difference.`,
      included: OFFER_INCLUDED.map((item) => item.main),
    },
    offerIncluded: OFFER_INCLUDED.map((item) => ({
      main: item.main,
      sub: "sub" in item && item.sub ? [...item.sub] : undefined,
    })),
    meet: {
      ...DEFAULT_MEET,
      bullets: [...MEET_BULLETS],
    },
    faq: FAQ_ITEMS.map((f) => ({ q: f.q, a: f.a })),
    contact: { ...DEFAULT_CONTACT },
  };
}

export function getPathwayContent(slug: PathwaySlug): PathwayPageContent | null {
  const template = templateForSlug(slug);
  if (template === "medical") return getMedicalPathwayContent(slug);
  return getNonMedicalPathwayContent(slug);
}

export const PATHWAY_SEED_META: ReadonlyArray<{
  slug: PathwaySlug;
  name: string;
  template: PathwayTemplate;
  display_order: number;
}> = [
  { slug: "usmle", name: "USMLE", template: "medical", display_order: 0 },
  { slug: "plab", name: "PLAB", template: "medical", display_order: 1 },
  { slug: "amc", name: "AMC", template: "medical", display_order: 2 },
  { slug: "stem", name: "STEM", template: "nonmedical", display_order: 3 },
  { slug: "mba", name: "MBA", template: "nonmedical", display_order: 4 },
];
