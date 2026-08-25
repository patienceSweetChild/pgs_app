export const IMPORTANT_ALERTS = [
  "LOR is pending",
  "Two UNIs have proved CAS!",
  "Have to submit application by 28th June, 2025",
] as const;

export const DRAFT_METER = [
  "SOP drafts",
  "Mentor checking Visa Checklist for You",
  "On Final Draft of your cover letter",
] as const;

export const REVIEW_QUEUE = [
  { label: "Scholarship Essay Reviewed", checked: true },
  { label: "Internship Application - King’s College London", checked: false },
  { label: "Waiting on LOR Feedback", checked: false },
  { label: "Waiting on LOR Feedback", checked: false },
] as const;

export const COUNSELOR_NOTES = [
  "Passport needs clearer scan – reupload",
  "LOR missing signature – resend",
  "Degree PDF is password protected – please unlock",
  "Degree PDF is password protected – please unlock",
] as const;

export const JOURNEY_MAP = [
  {
    title: "Twilio integration",
    important: true,
    bullets: [
      "Deck theme as per brand guidelines.",
      "Limit to 12 slides.",
      "Use images from image bank only.",
      "Divide amongst presenters. (Not more than two.)",
    ],
  },
  {
    title: "Twilio integration",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    title: "Twilio integration",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    title: "Twilio integration",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    title: "Delegate tasks for next week.",
    body: "Create new note via SMS. Support text, audio, links, and media.",
    plain: true,
  },
] as const;

export const IN_PROGRESS = [
  {
    kind: "green" as const,
    body: "Log-in extra hours on company portal. Refer your personal Notion database for hours worked.",
  },
  {
    kind: "purple" as const,
    title: "Twilio integration",
    bullets: [
      "Deck theme as per brand guidelines.",
      "Limit to 12 slides.",
      "Use images from image bank only.",
      "Divide amongst presenters. (Not more than two.)",
    ],
  },
] as const;

export const DRAFT_PHASE = [
  {
    kind: "purple" as const,
    title: "Twilio integration",
    bullets: [
      "Deck theme as per brand guidelines.",
      "Limit to 12 slides.",
      "Use images from image bank only.",
      "Divide amongst presenters. (Not more than two.)",
    ],
  },
  {
    kind: "pink" as const,
    title: "Twilio integration",
    body: "Log-in extra hours on company portal. Refer your personal Notion database for hours worked.",
  },
  {
    kind: "plain" as const,
    title: "Delegate tasks for next week.",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    kind: "plain" as const,
    title: "Delegate tasks for next week.",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    kind: "plain" as const,
    title: "Delegate tasks for next week.",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    kind: "plain" as const,
    title: "Delegate tasks for next week.",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
] as const;

export const COMPLETED = [
  {
    kind: "image" as const,
    title: "Gear up for Mt. Fuji!",
    image: "/assets/img/complete-notes.png",
  },
  {
    kind: "dark" as const,
    title: "IELTS exam",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    kind: "green" as const,
    title: "Twilio integration",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
  {
    kind: "green" as const,
    title: "Twilio integration",
    body: "Create new note via SMS. Support text, audio, links, and media.",
  },
] as const;

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

export const RESOURCE_DROP = [
  "Visa Docs Checklist",
  "Sample SOP for STEM",
  "pre-journey checklist",
] as const;
