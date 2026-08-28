export type CourseDateParts = {
  day: string;
  month: string;
  time: string;
};

export type CourseFact = { title: string; body: string };

export type CourseTestimonial = {
  quote: string;
  name: string;
  role: string;
  location: string;
  image: string;
};

export type CourseFaqItem = {
  q: string;
  a: string;
  tab?: string;
};

export type CoursePageLabels = {
  whoFor?: string;
  programTopics?: string;
  programDescription?: string;
  highlights?: string;
  benefitsAside?: string;
  brochureTitle?: string;
  brochureBody?: string;
  awarding?: string;
  rankings?: string;
  accreditation?: string;
  howToApply?: string;
  eligibility?: string;
  whyItMatters?: string;
  enrollmentFee?: string;
  feeIncludes?: string;
  learners?: string;
  faq?: string;
};

export const DEFAULT_COURSE_SECTION_LABELS: Required<CoursePageLabels> = {
  whoFor: "Who’s It For?",
  programTopics: "Program Topics",
  programDescription: "Program\nDescription",
  highlights: "explore Program Highlights",
  benefitsAside: "And a few more to\nmake sure you're on\nthe right part.",
  brochureTitle: "Need a downloadable course copy?",
  brochureBody: "Grab the brochure and dive into the details.",
  awarding: "Learn more about the awarding body",
  rankings: "Rankings & Reputation",
  accreditation: "Accreditation and Membership",
  howToApply: "How to Apply",
  eligibility: "Eligibility",
  whyItMatters: "Why It Matters",
  enrollmentFee: "Enrollment Fee",
  feeIncludes: "What’s Included",
  learners: "From our learners",
  faq: "Frequently Asked Questions",
};

export type CourseDetail = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  partnerLogo: string;
  brochureUrl?: string;
  brochureTitle?: string;
  brochureBody?: string;
  brochureBadge?: string;
  mode: string;
  duration: string;
  programType: string;
  badge: string;
  /** Hero badge chip background (hex). */
  badgeColor?: string;
  /** Hero badge chip text color (hex). */
  badgeTextColor?: string;
  /** Hero badge chip GIF / icon URL. */
  badgeIcon?: string;
  location: string;
  headline: string;
  heroNote: string;
  sessionTime: string;
  featured: boolean;
  tags: string[];
  whoFor: string;
  whoForLines: string[];
  sessionTopics: string[];
  highlights: string[];
  benefits: string[];
  benefitsAside?: string;
  bookingUrl?: string;
  start: CourseDateParts;
  end: CourseDateParts;
  startsOn?: string;
  endsOn?: string;
  /** Awarding body */
  awardingBodyIntro: string;
  awardingBodyFacts: CourseFact[];
  awardingBodyRankings: string;
  awardingBodyImage: string;
  accreditationLogos: string[];
  /** How to apply */
  applyIntro: string;
  eligibility: string[];
  /** Certificate */
  certificateHeading: string;
  certificateWhy: string[];
  /** Gallery */
  galleryTitle: string;
  galleryBlurb: string;
  galleryLocation: string;
  galleryBody: string;
  galleryImages: string[];
  /** Enrollment fee */
  feeAmount: string;
  feeSubtitle: string;
  feeBadge: string;
  feeNote: string;
  feeIncludes: string[];
  otherExpenseLabel: string;
  otherExpenseAmount: string;
  paymentMethods: string;
  /** Learners */
  learnersIntro: string;
  testimonials: CourseTestimonial[];
  /** FAQ */
  faqTabs: { id: string; label: string }[];
  faqItems: CourseFaqItem[];
  /** Editable section headings / asides */
  labels?: CoursePageLabels;
};

const CAMPUS = "/assets/img/purpleboard/campus.jpg";
const LOGO = "/assets/img/purpleboard/rcsed-logo.jpg";
const RCSED = "/assets/img/rcrsed.jpg";
const PHOTO = "/assets/img/photo-2.jpg";

export const COURSE_FAQ_TABS = [
  { id: "tab_1", label: "Programme Details" },
  { id: "tab_2", label: "Programme Learning Experience" },
  { id: "tab_3", label: "Refund Policy/Financials" },
] as const;

/** Default filled mock — admin preview + unpublished fallback (Figma Surgery Week). */
export const COURSE_PAGE_MOCK: CourseDetail = {
  id: "mock",
  title: "SURGERY WEEK IN RCSED - SCOTLAND UK JULY 2025",
  shortDescription:
    "#PGS in partnership with the Royal College of Surgeons Edinburgh (RCSEd), Scotland, UK, presents an intensive Surgery Week for aspiring surgeons",
  description:
    "Planning a career in General Surgery, Ortho, or A&E? This hands-on program teaches you the must-know surgical skills, safe plaster techniques, and key anatomy essentials. Learn from expert surgeons and ortho techs, get real-time feedback, and earn a certificate that adds real value to your profile.",
  image: CAMPUS,
  partnerLogo: LOGO,
  brochureUrl: undefined,
  mode: "#inCampus",
  duration: "7 Days",
  programType: "Certificate",
  badge: "Filling Fast",
  location: "RCSEd, Edinburgh, Scotland, UK",
  headline:
    "A One-Week Surgical Program for Medical Students and Young Doctors",
  heroNote:
    "More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.",
  sessionTime: "12pm to 2 pm",
  featured: true,
  tags: ["#UK", "#Medical"],
  whoFor:
    "Medical Intern?\nMBBS Grad? Preparing for PG? Those interested in General Surgery, Orthopaedics, or A&E Medicine\nThis program is for you.",
  whoForLines: [
    "Medical Intern?",
    "MBBS Grad? Preparing for PG? Those interested in General Surgery, Orthopaedics, or A&E Medicine",
    "This program is for you.",
  ],
  sessionTopics: ["Consultant-led practical workshop on surgery."],
  highlights: [
    "Hands-on training in instrument handling, knot-tying, suturing, fine tissue manipulation, wound care, diathermy.",
    "Expert consultants deliver both theory and practice, blending anatomical precision with safe surgical techniques.",
    "Includes plaster application, non-operative fracture care pitfalls, led by orthopedic experts and plaster technicians.",
    "One-to-one supervision, formative assessments, and a participation certificate upon completion.",
  ],
  benefits: [
    "Exclusive surgical exposure at RCSEd",
    "Delivered by skilled consultant surgeons",
    "Early-stage surgical skill-building",
    "Global certification from RCSEd",
    "Small group focus ensures personalized attention",
  ],
  bookingUrl: undefined,
  start: { day: "31", month: "Dec 25", time: "12pm to 2 pm" },
  end: { day: "01", month: "Jan 26", time: "12pm to 2 pm" },
  startsOn: "2025-12-31",
  endsOn: "2026-01-01",
  awardingBodyIntro:
    "This program is officially awarded by The Royal College of Surgeons of Edinburgh (RCSEd), a globally recognized institution known for its academic standards and real-world relevance.",
  awardingBodyFacts: [
    {
      title: "Founded in 1505",
      body: "One of the oldest surgical colleges in the world, with over 500 years of history.",
    },
    {
      title: "Home of the UK’s First Surgical Trainer Faculty",
      body: "",
    },
    {
      title: "Expert-Led Training & Exams",
      body: "Offers MRCS, dental, anatomy, perioperative care, and surgical trainer certifications.",
    },
    {
      title: "Global Reach",
      body: "Over 33,000 members worldwide in 100+ countries.",
    },
  ],
  awardingBodyRankings:
    "<p>Edinburgh’s Surgeons' Hall and RCSEd are touted globally as among the top surgical colleges—one of the world’s oldest and most respected surgical institutions.</p><p>Is backed by royal charter since 1778—recognized by global health systems and regulators.</p>",
  awardingBodyImage: RCSED,
  accreditationLogos: [
    "/assets/img/logo-1.png",
    "/assets/img/logo-2.png",
    "/assets/img/logo-3.png",
    "/assets/img/logo-4.png",
    "/assets/img/logo-5.png",
  ],
  applyIntro:
    "The admission process for the 1-week surgical program can be completed in the following ways:",
  eligibility: [
    "MBBS Students",
    "Medical Interns",
    "Surgeons aiming for global exposure",
    "Candidates preparing for global pathways",
  ],
  certificateHeading:
    "Upon successful completion, you’ll be awarded a certificate by RCSEd",
  certificateWhy: [
    "Marks your hands-on surgical training & skill",
    "Recognized by hospitals & recruiters globally",
    "Adds real weight to your CV",
  ],
  galleryTitle: "#higlights",
  galleryBlurb:
    "Students, in action\npresenting their posters\nat an international medical\nconference.",
  galleryLocation: "Washington, D.C.",
  galleryBody:
    "Our NETWORK students* had a great time presenting their posters at an international medical conference—meeting med students from the U.S. and future doctors from around the world. It was solid exposure, good conversations, and yep, definitely a strong addition to their resume.",
  galleryImages: [
    "/assets/img/programsfull/highlight-1.png",
    "/assets/img/programsfull/highlight-2.png",
    "/assets/img/programsfull/highlight-3.png",
  ],
  feeAmount: "GBP 1500",
  feeSubtitle: "Surgery Week at RCSEd, Scotland",
  feeBadge: "Includes Full program access",
  feeNote: "Early Bird Price",
  feeIncludes: [
    "Intensive hands-on training at RCSEd",
    "Live sessions with global surgical experts",
    "Official RCSEd Certificate upon completion",
    "Study materials & surgical exam prep content",
    "VISA application guidance (by #PGS)",
    "Exclusive access to alumni community & future sessions (by #PGS)",
    "Be added to a prep group* (by #PGS)",
    "15% app platform fee (By KPIQI)",
  ],
  otherExpenseLabel: "Visa Help + Stay",
  otherExpenseAmount: "GBP 200",
  paymentMethods: "Pay via Credit/Debit Card, UPI, or Bank Transfer",
  learnersIntro:
    "Also at #PGS, we believe that with the right prep, skills, and a solid game plan, most students 3x their portfolios and gain real-world skills along the way.",
  testimonials: [
    {
      quote:
        "I've picked up a really valuable skill set that makes my CV stand out. The hands-on labs and feedback from consultants were exactly what I needed before applying abroad.",
      name: "Raima Venkatesh",
      role: "Research Fellow",
      location: "Maryland, USA",
      image: PHOTO,
    },
    {
      quote:
        "Surgery Week gave me clarity on Ortho vs General Surgery pathways. Small groups meant I actually practiced every skill — not just watched.",
      name: "Arjun Mehta",
      role: "MBBS Grad",
      location: "Mumbai, India",
      image: PHOTO,
    },
    {
      quote:
        "The RCSEd certificate and the network I built in one week were worth more than any online course I've done. Highly recommend for PG aspirants.",
      name: "Sofia Almeida",
      role: "Medical Intern",
      location: "Lisbon, Portugal",
      image: PHOTO,
    },
  ],
  faqTabs: [...COURSE_FAQ_TABS],
  faqItems: [
    {
      tab: "tab_1",
      q: "Who is this program for?",
      a: "This program is aimed at medical professionals and students, who wish to get a global exposure and also can use as a valuable addition to your CV.",
    },
    {
      tab: "tab_1",
      q: "What kind of certification will I get after completion of this course?",
      a: "Upon successful completion you receive a participation certificate awarded by The Royal College of Surgeons of Edinburgh (RCSEd).",
    },
    {
      tab: "tab_1",
      q: "Is prior surgical experience required?",
      a: "No. The week is designed for early-stage skill-building — MBBS students, interns, and early post-grads are welcome.",
    },
    {
      tab: "tab_2",
      q: "What does a typical day look like?",
      a: "Expect consultant-led labs, plaster workshops, anatomy refreshers, and formative feedback in small groups.",
    },
    {
      tab: "tab_3",
      q: "What is the refund policy?",
      a: "Refunds follow the timeline published at enrollment. Early bird seats may have different cut-offs — check with your counsellor.",
    },
  ],
};

export function emptyCourseDetail(id = "draft"): CourseDetail {
  return {
    ...COURSE_PAGE_MOCK,
    id,
  };
}

export function getCourseById(id: string): CourseDetail {
  return { ...COURSE_PAGE_MOCK, id };
}

/** Parse "Title||Body" lines into facts */
export function parseCourseFacts(raw: string): CourseFact[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("||");
      return { title: (title || "").trim(), body: rest.join("||").trim() };
    })
    .filter((f) => f.title);
}

/** Parse FAQ lines: tabId||Question||Answer */
export function parseCourseFaqs(raw: string): CourseFaqItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("||");
      if (parts.length >= 3) {
        return {
          tab: parts[0].trim() || "tab_1",
          q: parts[1].trim(),
          a: parts.slice(2).join("||").trim(),
        };
      }
      if (parts.length === 2) {
        return { tab: "tab_1", q: parts[0].trim(), a: parts[1].trim() };
      }
      return { tab: "tab_1", q: line, a: "" };
    })
    .filter((f) => f.q);
}
