export const HERO_SIDEBAR = {
  image: "/assets/img/library.jpg",
  text: "Get matched with student loan offers that work for you.",
  cta: "Check Your Eligibility",
} as const;

export const HERO_CHECKS = [
  "Check your eligibility on your own terms.",
  "Explore & compare top banks and NBFCs in one go",
  "We’ve got funding tie-ups based on your requirement and destination",
  "We cover 50+ countries including UK, USA, Australia, Germany & more",
  "& More",
] as const;

export const PARTNER_LOGOS = [
  { src: "/assets/img/Spotify.png", alt: "Spotify" },
  { src: "/assets/img/Google-2.png", alt: "Google" },
  { src: "/assets/img/Pinterest.png", alt: "Pinterest" },
  { src: "/assets/img/Stripe.png", alt: "Stripe" },
  { src: "/assets/img/Reddit.png", alt: "Reddit" },
] as const;

/** Repeated to match the HTML marquee density */
export const PARTNER_LOGO_TRACK = [
  ...PARTNER_LOGOS,
  ...PARTNER_LOGOS,
  PARTNER_LOGOS[2],
  PARTNER_LOGOS[3],
  PARTNER_LOGOS[4],
  PARTNER_LOGOS[0],
] as const;

export const FUNDING_SECTION = {
  titleLines: ["Your study plan’s ready.", "Is your funding too ?"],
  paragraphs: [
    "Sorting out your finances for studying abroad isn’t always simple.",
    "Sorting out your finances for studying abroad isn’t always simple. Whether you’ve got some funds ready or plan to repay after landing a job,",
    "With rising conversion rates and high overseas tuition, even students who’ve saved up find themselves needing a little extra support. And for those relying on loans, blindly applying without a game plan usually leads to delays, rejections, or poor interest terms.",
  ],
  boldLeadIn: "it’s still a big step.",
  teamLead:
    "That’s why we at #PGS built a dedicated funding support team to",
  checks: [
    "Understand your eligibility",
    "Plan your finances smartly (not just apply randomly)",
    "Get access to both secured and unsecured loans",
    "Whether you're partially funded, fully funded, or exploring loan options",
  ],
} as const;

export const STATS_BOX = {
  title: "Join Thousands Who Secured Their Study Abroad Loan",
  stats: [
    {
      value: "₹50L+",
      label: "Loans Sanctioned",
      sub: "This Month",
    },
    {
      value: "9.85%",
      label: "Avg Interest Rate",
      sub: "Secured + Unsecured",
    },
  ],
} as const;

export const LINKS_SETUP = {
  titleLines: ["Not sure where", "to begin?"],
  cta: "Talk to our funding team today!",
  href: "/contact",
} as const;

export const FAQ_ITEMS = [
  {
    q: "How should I plan my study abroad journey for a smooth experience?",
    a: "More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.More sessions coming up for Medical & STEM aspirants — reach out to our counsellors.",
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

export const LOAN_GOALS = [
  "Am I eligible for a loan?",
  "How much loan can I get?",
  "Do I need a co-applicant?",
  "What country you are planning to study?",
] as const;

export const COUNTRY_OPTIONS = [
  { value: "1", label: "USA" },
  { value: "2", label: "India" },
] as const;

export const MODAL_COPY = {
  subLabel: "loan check 101",
  tagline: "Not sure if you’ll get a study abroad loan? Check your eligibility ",
  boostDesktop: ["get the", "boost", "your", "deserves"],
  boostMobile: "get the boost your PREP deserves",
  aimLabel: "What are you aiming to sort out?",
  countryLabel: "What country you are planning to study?",
  cta: "GET MY CHECKLIST",
  successTitle: "You're all set!",
  successBody: "Your personalised checklist is on its way.\nCheck your inbox soon.",
} as const;

export const SUCCESS_MODAL = {
  title: "you’re in",
  nextTitle: "Here’s what happens next:",
  nextBody:
    "We review your profile Estimate your approval chances Match you with suitable lenders",
  advisor: "A PGS advisor will contact you shortly",
  stripLines: [
    "Need to sort out the study journey?",
    "Book a free 15min clarity call",
  ],
} as const;
