/** Static copy/data for home — sourced from standalone-html/home.html */

export const HOME_QUOTE =
  "From your first step to your final admit or medical pathway — our expert counselors guide the entire journey with you.";

export const HOME_STATS = [
  {
    kind: "static" as const,
    value: "4/5",
    label: "of our students built a significantly stronger profile after working with us.",
  },
  {
    kind: "counter" as const,
    to: 90,
    label: "of our students received a confirmed offer letter in just four weeks.*",
  },
  {
    kind: "counter" as const,
    to: 94,
    label: "of our students successfully earned scholarships with our proven strategies.**",
  },
  {
    kind: "counter" as const,
    to: 85,
    label: "of our students earned a spot at one of their top-choice universities.",
    paragraphClass: "mb-15px",
  },
  {
    kind: "counter" as const,
    to: 95,
    label: "of our medical aspirants achieved their USMLE, PLAB, and AMC goals.",
    paragraphClass: "mb-15px",
  },
] as const;

export const HOME_STAT_FOOTNOTES = [
  "*Applicable to our partnered universities.",
  "**Medical professionals typically receive a salary, stipend.",
  "**Scholarships or assistantships for non-medical.",
] as const;

export const HOME_INTRO = {
  eyebrow: "Step into",
  title: "#pgs",
  bodyLead: "#PGS (purpleguide.study) is your go-to admission team for studying abroad.",
  bodyRest:
    " With 20+ years of hands‑on expertise and education counseling, we make your path to top universities and medical careers simple, clear, and results-driven. Our USP? Guiding you toward your goals — and making them happen!",
  image: "/assets/img/football-team.png",
} as const;

export const HOME_DASHBOARD = {
  title: "One of the best parts of #PGS?",
  titleLine2: "The Student Dashboard.",
  gif: "/assets/img/dashboard-gif.png",
  heart: "/assets/img/heart.gif",
  checkIcon: "/assets/img/check-icon.png",
  badge: "Mentor + Dashboard + Admission Counseling — #PGS Advantage",
  whiteCopy:
    "Your full admission guide. Get expert advice, real data, and hands-on support so you can seamlessly turn your goals into admission success.",
  greenCopy:
    "Get real-time updates, mentor feedback, and full progress tracking—every step from Day 1 to your admit. Everything stays mapped, organized, and right here in one place.",
  greenHeading: "Stay on track. Get admitted with confidence.",
} as const;

export const HOME_APPLICATION_CHECKS = [
  "Profile Review",
  "Personalized SOP Guidance",
  "CV Building Support",
] as const;

export const HOME_MEDICAL_CHECKS = [
  "Personalized Study Timelines",
  "Clinical Rotation Placements",
  "Hospital Observerships",
  "Peer Support Communities",
] as const;

export const HOME_EDGE_TILES = [
  { label: "scholarship\nprep", className: "w-150px", align: "text-start" as const },
  { label: "bank \nloans", className: "w-150px", align: "text-center" as const },
  { label: "research roadmap", className: "w-150px", align: "text-center" as const },
  { label: "career sessions", className: "w-150px", align: "text-center" as const },
] as const;

export const HOME_GALLERY = {
  heading:
    "No matter the stage, our team has helped students just like you get to their goal.",
  frame: "/assets/img/Frame-1.png",
  student: {
    image: "/assets/img/photo-3.jpg",
    name: "Ramya Thapar",
    role: "Clinical Rotation",
    school: "John Hopkins University,",
    country: "USA",
    tag: "#USMLE",
  },
  captionCards: [
    {
      image: "/assets/img/photo-2.jpg",
      name: "vilivi p aye",
      subtitle: "#purplePremium student",
      program: "masters",
      tag: "#UK",
    },
    {
      image: "/assets/img/photo-2.jpg",
      name: "vilivi p aye",
      subtitle: "#purplePremium student",
      program: "masters",
      tag: "#UK",
    },
    {
      image: "/assets/img/photo-2.jpg",
      name: "vilivi p aye",
      subtitle: "#purplePremium student",
      program: "masters",
      tag: "#UK",
    },
  ],
  quote:
    "“ Everything changed when I crossed paths with my mentor, Mr. Nilmek of purpleGuide. Back when uncertainty clouded my path, they gave me more than just the right guidance—they offered unwavering support and care at every step. For me, they didn’t just make my dream possible—they made it happen. ”",
} as const;

export const HOME_PREMIUM_PATHS = [
  {
    href: "/purpleusme",
    title: "USMLE - ",
    subtitle: "United States Medical Licensing Examination",
    body: "Start your USMLE journey with a plan that actually works. Stay on track with mentor feedback, peer groups, and a roadmap built just for you.",
  },
  {
    href: "/purpleamc",
    title: "AMC - ",
    subtitle: "Australian Medical Council exams",
    body: "This is the section where we guide you through the AMC journey. From roadmap to profile review, we help you plan each step toward practicing in Australia.",
  },
  {
    href: "/purpleplab",
    title: "PLAB - ",
    subtitle: "Professional and Linguistic Assessments Board test",
    body: "PLAB has shifted from a popular option to a highly competitive path even after licensing — we guide you from prep to post-job steps, starting before PLAB 1.",
  },
  {
    href: "/purpleusme",
    title: "USMLE - ",
    subtitle: "CLINICAL ROTATION",
    body: "Hands-on clinical experience in the USA , tied to your USMLE journey. We connect you with verified hospitals, guide your documents, and support visa steps.",
  },
] as const;

export const HOME_PREMIUM_STEM = {
  href: "/purplepremiumhome",
  titles: ["STEM", "MASTERS", "LAW", "MBA", "OTHERS"] as const,
  body: "This is the section where we help you plan your study abroad right. If you're aiming for a good university, we look at your profile, take your inputs, and get advice from our mentors to build a proper plan. It’s all about making your study abroad journey well-guided, well-researched, and worth it.",
} as const;

export const HOME_ABOUT_TEASER = {
  body: "PurpleGuide.study was built from real stories, not just strategy. What began as a search for answers became our mission to mentor students the right way. Over the years, we’ve guided students through study choices, career calls, and big leaps. Now, we're the platform we wish we had when we started off!",
  image: "/assets/img/doctor.png",
} as const;

export const HOME_FAQ = [
  {
    q: "How to shortlist unis that actually match your profile",
    a: "More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.",
  },
  {
    q: "Avoid common SOP/LOR mistakes that cost students",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
  {
    q: "Avoid common SOP/LOR mistakes that cost students",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
  {
    q: "Learn how our team supports you through it all",
    a: "We deliver customized marketing campaign to use your audience to make a positive move.",
  },
] as const;

export const STUDY_JOURNEY_OPTIONS = {
  youare: ["Parent", "Student", "Mentor"],
  medical1: ["USMLE", "AMC", "PLAB"],
  masters: ["MBA", "STEM", "Law", "CSE", "Others"],
  undergrad: ["Business", "STEM", "Law", "Others"],
  medical2: ["Specialities", "Physiotherapy", "Nursing", "Others"],
  country: ["Done a bit", "I am doing as a group", "I am starting my journey"],
  medicalpath: [
    "1st or 2nd Year",
    "3rd to Final Year",
    "Internship",
    "Working",
    "Others",
  ],
  masterpath: ["Studying", "Graduated", "Working", "Others"],
  undergradpath: ["12th", "11th", "10th or less"],
  plan: [
    "2025",
    "2026",
    "2027",
    "Guide me in choosing my intake schedule",
  ],
  countries: [
    "USA",
    "UK",
    "CANADA",
    "AUSTRALIA",
    "NEW ZEALAND",
    "EUROPE",
    "Not sure yet - need help deciding",
  ],
} as const;

export const NEWS_CARDS = [
  {
    logo: "/assets/img/lvmint.png",
    quote:
      '"Sequoia India joins 126 crores round in overseas education startup Leap"',
  },
  {
    logo: "/assets/img/tc.png",
    quote:
      '"Leap raises $55 million to help Indian students study abroad"',
  },
  {
    logo: "/assets/img/et.png",
    quote: "Leap raises 40 crores led by Sequoia India",
  },
] as const;

export const MASTERCLASS_TABS = [
  { id: "study_abroad", label: "study abroad masterclass" },
  { id: "online_meet_event", label: "online meet event" },
  { id: "new_visit", label: "uni visit @ecr" },
] as const;

export type MasterclassTabId = (typeof MASTERCLASS_TABS)[number]["id"];

export type MasterclassCard = {
  title: string;
  subtitle: string;
  who: string[];
  topics: string[];
  startLabel: { day: string; month: string; time: string; mode?: string };
  endLabel: { day: string; month: string; time: string; host?: string };
  image: string;
  accordion: { q: string; a: string }[];
};

export const MASTERCLASS_BY_TAB: Record<MasterclassTabId, MasterclassCard> = {
  study_abroad: {
    title: "Online study abroad plan meetup.",
    subtitle:
      "This Session Is Designed for MBA, Master’s & Engineering Applicants",
    who: [
      "Final-year student?",
      "Recent grad? Researching for masters?",
      "This session’s made for you.",
    ],
    topics: ["Masters in USA UK for graduates", "How to prepare your finances"],
    startLabel: { day: "31", month: "Dec 25", time: "12:00 pm", mode: "Online" },
    endLabel: { day: "31", month: "Dec 25", time: "2:00 pm", host: "Team #PGS" },
    image: "/assets/img/tab-img.jpg",
    accordion: [
      {
        q: "How to shortlist unis that actually match your profile",
        a: "More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.",
      },
      {
        q: "Avoid common SOP/LOR mistakes that cost students",
        a: "Learn what reviewers look for and how to fix weak essays before you submit.",
      },
      {
        q: "Visa timelines explained, when to do what",
        a: "A practical timeline so you don’t miss deposits, CAS/I-20, or interview windows.",
      },
    ],
  },
  online_meet_event: {
    title: "Live online counsellor meet.",
    subtitle:
      "This Session Is Designed for Students Ready to Ask Direct Questions",
    who: [
      "Stuck between countries or pathways?",
      "Need a second opinion on your shortlist?",
      "Join the live Q&A with mentors.",
    ],
    topics: [
      "Profile review live with mentors",
      "Deadlines & documents checklist",
      "Medical vs STEM path clarity",
    ],
    startLabel: { day: "15", month: "Jan 26", time: "6:00 pm", mode: "Online" },
    endLabel: { day: "15", month: "Jan 26", time: "7:30 pm", host: "Mentors" },
    image: "/assets/img/tab-img.jpg",
    accordion: [
      {
        q: "What happens in an online meet?",
        a: "Short briefing, open Q&A, and optional 1:1 follow-up slots with counsellors.",
      },
      {
        q: "Do I need documents ready?",
        a: "Bring your latest CV and a rough country/path preference — that’s enough to start.",
      },
      {
        q: "Is it free?",
        a: "Yes — online meet events are free. Premium mentoring is optional afterward.",
      },
    ],
  },
  new_visit: {
    title: "University visit @ ECR campus tour.",
    subtitle: "This Session Is Designed for Students Exploring Campus & Culture",
    who: [
      "Want to feel a campus before applying?",
      "Parents joining the decision?",
      "Meet partner uni reps in person.",
    ],
    topics: [
      "Campus walkthrough & housing tips",
      "Admission requirements on-ground",
      "Scholarship & intake windows",
    ],
    startLabel: { day: "22", month: "Feb 26", time: "10:00 am", mode: "On-site" },
    endLabel: { day: "22", month: "Feb 26", time: "1:00 pm", host: "#PGS @ ECR" },
    image: "/assets/img/tab-img.jpg",
    accordion: [
      {
        q: "Where do we meet?",
        a: "Assembly point details are emailed after you RSVP — typically near the ECR partner campus.",
      },
      {
        q: "Can parents attend?",
        a: "Yes. Uni visit sessions are open to students and accompanying parents.",
      },
      {
        q: "What should I bring?",
        a: "ID, notepad questions, and any offer/conditional letter if you already have one.",
      },
    ],
  },
};
