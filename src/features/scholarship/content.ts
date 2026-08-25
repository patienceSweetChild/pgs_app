export const EXAMPLE_SCHOLARSHIPS = [
  { label: "India–USA:", name: "Fulbright-Nehru Master's Fellowship" },
  { label: "India–UK:", name: "Chevening Scholarship" },
  { label: "India–Japan:", name: "MEXT (Monbukagakusho) Scholarship" },
] as const;

export const SCENARIO_CARDS = [
  {
    n: "1",
    question:
      "I have top grades and extracurriculars, is there a way to cover full tuition?",
    note: "Most universities do. We help you apply for in-house scholarships too!",
  },
  {
    n: "2",
    question: "I scored well, but can’t afford full tuition.",
    note: "You might qualify for a need-based or partial fee waiver scholarship.",
  },
  {
    n: "3",
    question:
      "I’ve done community service and volunteering, does that count?",
    note: "You might qualify for a need-based or partial fee waiver scholarship.",
  },
  {
    n: "4",
    question:
      "I’m applying to a specific university. Do they have their own scholarships?",
    note: "Most universities do. We help you apply for in-house scholarships too!",
  },
  {
    n: "5",
    question: "I have a sports/art background. Can I apply for that?",
    note: "Yes, some schools offer sports, cultural, or talent-based scholarships.",
  },
  {
    n: "6",
    question:
      "I already got an admit. Is it too late to apply for scholarships?",
    note: "Not always, we’ll check post-admit and rolling deadlines for you.",
  },
] as const;

export const PROCESS_CHECKLIST = [
  "Analyze your academic background, work experience (if any), and achievements",
  "Create a target list of scholarships",
  "Create a timeline for each scholarship deadline",
  "Help tailor each application to specific scholarship requirements",
  "Connect you with previous scholarship recipients",
  "Track application progress and deadlines",
  "Address any concerns or roadblocks",
  "& More",
] as const;

export const APPLICATION_STEPS = [
  {
    title: "Step 1",
    body: "Get Onboard and get to know your scholarship options",
    bodyClass: "min-ht-115px mb-0 fs-19 lh-25 fw-500 text-black w-80 text-start",
    items: [{ text: "Profile evaluation", className: "fs-12 lh-16 w-70" }],
  },
  {
    title: "Step 2",
    body: "Shortlist & Mentor Discussion",
    bodyClass: "h-100px fs-20 lh-25 fw-500 text-black w-80 text-start mb-0",
    items: [
      {
        text: "Shortlist top 5 scholarships options.",
        className: "fs-18 lh-22 w-100",
      },
      {
        text: "Add more across different scholarship types, not just struck on above 5.",
        className: "fs-18 lh-22 w-100",
      },
    ],
  },
  {
    title: "Step 3",
    body: "Apply, track & Wait",
    bodyClass: "h-100px fs-20 lh-25 fw-500 text-black w-80 text-start mb-0",
    items: [
      { text: "Prepare application & docs", className: "fs-18 lh-22 w-100" },
      {
        text: "Make sure you are covering all the eligible points.",
        className: "fs-18 lh-22 w-100",
      },
      { text: "Prep for the results!", className: "fs-18 lh-22 w-100" },
    ],
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I’ve picked up a really valuable skill set that makes my CV stand out. I realized you don’t always have to keep applying everywhere—you can actually focus on improving your current application, make it stronger and more efficient, and seriously boost your chances of getting selected.",
    name: "Raina Venkatesh",
    role: "Research Fellow Maryland, USA",
    image: "/assets/img/selfe.jpg",
  },
  {
    quote:
      "I’ve picked up a really valuable skill set that makes my CV stand out. I realized you don’t always have to keep applying everywhere—you can actually focus on improving your current application, make it stronger and more efficient, and seriously boost your chances of getting selected.",
    name: "Raina Venkatesh",
    role: "Research Fellow Maryland, USA",
    image: "/assets/img/selfe.jpg",
  },
  {
    quote:
      "I’ve picked up a really valuable skill set that makes my CV stand out. I realized you don’t always have to keep applying everywhere—you can actually focus on improving your current application, make it stronger and more efficient, and seriously boost your chances of getting selected.",
    name: "Raina Venkatesh",
    role: "Research Fellow Maryland, USA",
    image: "/assets/img/selfe.jpg",
  },
] as const;

export const FAQ_TABS = [
  { id: "tab_1", label: "The Basics" },
  { id: "tab_2", label: "Application Process" },
  { id: "tab_3", label: "Application timeline" },
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

export const FAQ_TAB_PLACEHOLDERS = {
  tab_2: "Programme Learning Experience",
  tab_3: "Refund Policy/Financials",
} as const;

export const TIP_SLIDES = [
  {
    tag: "SOP Flow",
    body: "Don’t start your SOP with your academic history — start with why this dream matters to you. Story > Stats.",
  },
  {
    tag: "SOP Flow",
    body: "Don’t start your SOP with your academic history — start with why this dream matters to you. Story > Stats.",
  },
  {
    tag: "SOP Flow",
    body: "Don’t start your SOP with your academic history — start with why this dream matters to you. Story > Stats.",
  },
] as const;

export const MODAL_COUNTRIES = [
  { value: "1", label: "USA" },
  { value: "2", label: "India" },
] as const;

export const MODAL_LEVELS = [
  { value: "1", label: "Master’s" },
  { value: "2", label: "Master’s - 1" },
] as const;
