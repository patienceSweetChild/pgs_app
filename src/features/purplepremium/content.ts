export const PATH_LINKS: {
  label: string;
  href: string;
  multiline?: boolean;
}[] = [
  { label: "USMLE", href: "/pathways/usmle" },
  { label: "PLAB", href: "/pathways/plab" },
  { label: "AMC", href: "/pathways/amc" },
  {
    label: "Masters, STEM UG, MBA & Others",
    href: "/pathways/stem",
    multiline: true,
  },
];

export const STATS = [
  { value: "40%", label: "Stronger Applications" },
  { value: "3x", label: "Profile Boost" },
  { value: "100%", label: "Personalized Support" },
  { value: "10/10", label: "Targeted Roadmaps" },
] as const;

export const TESTIMONIAL_QUOTE =
  "I've picked up a really valuable skill set that makes my CV stand out. I realized you don't always have to keep applying everywhere—you can actually focus on improving your current application, make it stronger and more efficient, and seriously boost your chances of getting selected.";

export const TESTIMONIALS = Array.from({ length: 4 }, () => ({
  image: "/assets/img/selfe.jpg",
  quote: TESTIMONIAL_QUOTE,
  name: "Raina Venkatesh",
  role: "Research Fellow Maryland, USA",
}));

/** partner-1..9 repeated 4× to match the HTML logo grid density */
export const PARTNER_LOGOS = Array.from({ length: 36 }, (_, i) => {
  const n = (i % 9) + 1;
  return `/assets/img/partner-${n}.png`;
});

export const PARTNER_HIGHLIGHTS = [
  "500+ University Tie-ups",
  "20+ years experienced Mentors",
  "Current Student as Mentors",
] as const;

export const MEDICINE_PATHS = ["USMLE", "PLAB", "AMC"] as const;

export const WHY_REASONS = [
  { num: "01", text: "6/10 apply to the wrong programs; wasting a year." },
  {
    num: "02",
    text: "Most don't know how to show off their CV; we help you with it.",
  },
  { num: "03", text: "Deadlines, forms, SOPs? We manage that stress." },
  { num: "04", text: "Deadlines, forms, SOPs? We manage that stress." },
  { num: "05", text: "Deadlines, forms, SOPs? We manage that stress." },
] as const;

export const NO_LIST = [
  "Apply to random programs hoping for the best",
  "Generic SOPs, reused CVs",
  "No idea how much the journey will cost",
  "Confused about timelines, intakes, and deadlines",
  "Burnt out doing it all alone",
  "Spend months just figuring things out",
  "#Medical students often get stuck after exams or even post-license. With long prep timelines and no clear plan, resume, or job match—it's easy to lose years. Restarting later takes serious motivation.",
  "No clue how to get into top STEM or MBA programs #TopUNIs",
  "Struggle to get offer letters",
  "Always second-guessing",
  "No profile-building help",
  "Struggling with scholarships or getting your loan approved?",
] as const;

export const YES_LIST = [
  "Smart university picks tailored to your background, ROI, and success chances",
  "Personalized SOPs, project suggestions, and a CV that stands out",
  "Detailed expense breakdown — from exam fees to till final step #Medical & #AllPaths",
  "Roadmap from day one, with alerts and reminders. So you don't waste time researching everything yourself. #Medical & #AllPaths",
  "Access to experienced mentors and students who are in the same path",
  "Spend weeks actually moving forward with a plan that works. Every form, every application—guided. Just focus on what really matters: your #medical license exams or your uni application #all",
  "Clinical rotation support + interview readiness mapped out #USMLE",
  "University shortlists with scholarship options and pre-interview prep",
  "95% offers within 4 weeks via our university tie-ups",
  "Clarity and confidence at every step",
  "Research projects, workshops, and profile upgrades included #Medical & #AllPaths",
  "Multiple pathways planned based on your goals",
] as const;

export const MARQUEE_TEXT =
  "2 days left to apply for X University with full waiver. We help you prep. Parents welcome on consultation calls. We've helped families just like yours plan with confidence.";

export const CONTACT_STRIP = {
  phone: "91 95665 66298",
  email: "connect@purpleguid.study",
} as const;
