export const HERO_STATS = [
  { value: "98%", label: "Match Success" },
  { value: "70+", label: "Medical Specialities" },
] as const;

export const HERO_FEATURES = [
  "Free Consultation",
  "48hr Acceptance",
  "Money Back Guarantee*",
] as const;

export const SUCCESS_STORIES = [
  {
    name: "Dr. Karthik Talukdar",
    detail: "Internal Medicine → John Hopkins University",
  },
  {
    name: "Dr. Raghav Singh",
    detail: "Internal Medicine → John Hopkins University",
  },
  {
    name: "Dr. Raghav Singh",
    detail: "Internal Medicine → John Hopkins University",
  },
  {
    name: "Dr. Vigneshwara Neel",
    detail: "Internal Medicine → John Hopkins University",
  },
  {
    name: "Dr. Abhinav Sastri",
    detail: "Internal Medicine → John Hopkins University",
  },
] as const;

export const LIVE_ACTIVITY = [
  {
    name: "Priya M.",
    line: "Got Clinical at Johns Hopkins #PGS | Batch 3, Class of 2025",
  },
  {
    name: "Priya M.",
    line: "Got observership arroved #PGS | Batch 3, Class of 2025",
  },
  {
    name: "Priya M.",
    line: "Got accepted to Johns Hopkins #PGS | Batch 3, Class of 2025",
  },
] as const;

export const IMG_CHANCES = [
  "See how real medicine is practiced across U.S. hospitals",
  "Work hands-on with real patients and supervising doctors",
  "Understand hospital systems, EMRs, and clinical protocols",
  "Show residency programs you're skilled, focused, and ready",
  "Get U.S. LoRs that truly support your residency journey",
] as const;

export const CLINICAL_ROTATION_BLURB =
  "A clinical rotation is when a medical student or graduate works in a real hospital or clinic as part of their medical training. You rotate through different specialties like internal medicine, surgery, pediatrics, psychiatry, etc., to get hands-on experience with real patients under the guidance of licensed doctors.";

export const IMG_BENEFITS = [
  "Experience with US medical protocols",
  "Understanding of US healthcare delivery system",
  "Networking with attending physicians and residents",
  "Letters of Recommendation from US physicians",
  "Preparation and teamwork skills",
  "Improved medical terminology and skills",
] as const;

export const WHY_PICK_US = [
  {
    title: "Trusted Support",
    body: "With over 15 years of prior clinical placement experience you can trust in our guidance.",
  },
  {
    title: "LoR",
    body: "Earn LoRs on hospital based letterhead from hands-on experiences & academically affiliated physicians.*",
  },
  {
    title: "Visa Guidance",
    body: "Request a Program Acceptance Letter that can support your visa application and get a full refund if denied.",
  },
  {
    title: "Plan Your Visit",
    body: "We'll align with your school's curriculum so you won't have to worry about class schedules clashing with your US rotation.",
  },
  {
    title: "Lower Pricing",
    body: "Smart paperwork, and strong connections, help us lock in your clinical rotations, faster and at a lower cost.",
  },
] as const;

export const BOOKING_STEPS = [
  {
    title: "STEP 1",
    subtitle: "Get Onboard and get to know your rotation options",
    items: [
      'Click the "Secure Your Spot" button on this page to fill out and submit our application form.',
      "After reviewing & verifying your application, we'll send you a link to book a free introductory meeting.",
      "If you are part of #Purple Premium or counselor, all charges & discounts will apply.",
    ],
  },
  {
    title: "STEP 2",
    subtitle: "Schedule & Get Approved",
    items: [
      "This is the part we know your goals and give you rotation suggestions best suited for it.",
      "After our initial meeting, our team will deep dive into your goals and build your personalized rotation plan.",
      "You'll receive a clear detailed list with all the deadlines, compliance needs, and exactly what's included.",
    ],
  },
  {
    title: "STEP 3",
    subtitle: "Lock in your U.S Clinical Experience",
    items: [
      "Once you've reviewed your rotation goals and it feels right for your goals, we'll guide you through securing those spots.",
      "Make sure to review with your counselor and confirm which compliance steps to be done before your journey.",
      "Prep for your journey!",
    ],
  },
] as const;

export const PURPLE_PREMIUM_CHECKLIST = [
  "Get guidance with ECFMG, and other journey related forms, step by step.",
  "Build your CV, plan your journey, and stay organized with our purple #loopboard",
  "Full access to your personal dashboard",
  "Detailed journey roadmap customized for you.",
  "Unlock exclusive access to top-tier clinical rotations",
  "& More",
] as const;

export const PRICING_INCLUDED = [
  "Clinical placement with verified US preceptors",
  "Weekly progress check-ins",
  "Letter of Recommendation (on request)",
  "Visa Support Letter (on request)",
  "VISA application guidance (by #PGS)",
  "Admin & documentation support (by #PGS)",
  "VISA application guidance (by #PGS)",
  "Exclusive access to alumni community & future sessions (by #PGS)",
  "Be added to a prep group* (by #PGS)",
  "& More",
] as const;

export const ROTATION_TYPES = [
  {
    type: "In-Patient Rotation",
    price: "$3000 – $3800",
    involves: "Full-time at a hospital, includes care exposure.",
  },
  {
    type: "Hands-On Rotation",
    price: "$2200 – $3200",
    involves: "Direct patient interaction—clinic or hospital based.",
  },
  {
    type: "Externship",
    price: "$2400 – $3400",
    involves: "Post-graduation USCE.",
  },
  {
    type: "Visa Cost",
    price: "$1800 – $2800",
    involves: "Observe and learn via online hospital interactions.",
  },
] as const;

export const TESTIMONIAL_QUOTE =
  "I've picked up a really valuable skill set that makes my CV stand out. I realized you don't always have to keep applying everywhere—you can actually focus on improving your current application, make it stronger and more efficient, and seriously boost your chances of getting selected.";

export const TESTIMONIALS = Array.from({ length: 4 }, () => ({
  image: "/assets/img/selfe.jpg",
  quote: TESTIMONIAL_QUOTE,
  name: "Raina Venkatesh",
  role: "Research Fellow Maryland, USA",
}));

export const EXPENSE_COPY = {
  heading: "Need a detailed expense breakdown for your journey?",
  inbox: "— we'll send it straight to your inbox.",
  body: "Whether you're just getting started or planning ahead for all three steps, knowing the costs involved can help you make better decisions. From registration fees and travel expenses to prep materials and clinical rotations — we've mapped out the full journey. Just drop a request and get a clear picture of what to expect, without surprises.",
} as const;

export const CONTACT_STRIP = {
  phone: "91 95665 66298",
  email: "connect@purpleguid.study",
  blurb:
    "Reach out on our helpline for fast bookings, expert advice, and answers to all your study abroad questions. We've also got dedicated mentor groups for medical and non-medical courses—so you're always connected to the right people.",
} as const;

export const MODAL_TOGGLES = [
  "How to get US clinical rotations (USCE) ?",
  "Which rotations actually help in Match",
  "Timeline for rotations vs Step exams",
  "My profile strength for USCE",
] as const;
