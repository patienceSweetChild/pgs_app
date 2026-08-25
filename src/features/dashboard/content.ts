/** Guest vs signed-in profile — from Figma #userdashboard frames */
export const GUEST_PROFILE = {
  name: "User",
  handle: "@user",
  id: "",
  avatar: "/assets/img/avatar.jpg",
  pathway: "stem PATHWAY",
  premiumLabel: "#purplePremium",
} as const;

export const SIGNED_IN_PROFILE = {
  name: "Rajeev Singh",
  handle: "@rajsingh",
  id: "2123456",
  avatar: "/assets/img/avatar.jpg",
  pathway: "STEM PATHWAY",
  premiumLabel: "#PURPLEPREMIUM",
} as const;

export const TOP_PICKS = [
  {
    title: "Clinical rotation sign up for next batch booking are in progress.",
    tag: "InProgress",
    highlight: "#medical",
    dot: "yellow-bg",
    image: "/assets/img/computer.jpg",
  },
  {
    title: "Clinical rotation sign up for next batch booking are in progress.",
    tag: "InProgress",
    highlight: "#medical",
    dot: "blue-bg",
    image: "/assets/img/computer.jpg",
  },
  {
    title: "Clinical rotation sign up for next batch booking are in progress.",
    tag: "InProgress",
    highlight: "#medical",
    dot: "red-bg",
    image: "/assets/img/computer.jpg",
  },
  {
    title: "Clinical rotation sign up for next batch booking are in progress.",
    tag: "InProgress",
    highlight: "#medical",
    dot: "purple-bg",
    image: "/assets/img/computer.jpg",
  },
  {
    title: "Clinical rotation sign up for next batch booking are in progress.",
    tag: "InProgress",
    highlight: "#medical",
    dot: "yellow-dark-bg",
    image: "/assets/img/computer.jpg",
  },
] as const;

export const ONBOARDING_CHECKS = [
  { label: "Profile Setup Complete", checked: true },
  { label: "University Shortlist Discussed", checked: false },
  { label: "SOP Discussion Done", checked: false },
  { label: "IELTS/GRE Status Confirmed", checked: false },
  { label: "Resume Uploaded", checked: false },
  { label: "LOR Briefed", checked: false },
  { label: "Loan & Finance Discussed", checked: false },
] as const;

export const DOC_TRACKER = [
  { count: "10", label: "SOP Drafts Uploaded", danger: false },
  { count: "03", label: "LORs Uploaded", danger: false },
  { count: "03", label: "Degree Certificate Uploaded", danger: false },
  { count: "03", label: "Graduation Transcript", danger: false },
  { count: "03", label: "Passport Front/Back", danger: false },
  { count: "03", label: "Loan Documents If Applied", danger: false },
  { count: "03", label: "Other Documents", danger: true },
] as const;

export const SHORTLIST = [
  { count: "03", label: "USA - Stream Choice 1" },
  { count: "03", label: "USA- Stream Choice 3" },
] as const;

export const FINALIZED_UNIS = Array.from({ length: 6 }, () => ({
  name: "Univ of washington",
  tag: "#USA",
  image: "/assets/img/uni.jpg",
}));

export const WORKING_ON = [
  { label: "One-on-One Session Booked", badge: "URGENT" as const },
  { label: "One-on-One Session Booked", badge: null },
  {
    label: "One-on-One Session Booked One-on-One Session Booked",
    badge: null,
  },
] as const;

export const FUTURE_TASKS = [
  { label: "One-on-One Session Booked", badge: null },
  { label: "One-on-One Session Booked", badge: "IMP" as const },
  {
    label: "One-on-One Session Booked One-on-One Session Booked",
    badge: null,
  },
] as const;

export const UPCOMING_EVENTS = [
  {
    title: "Visa 101 Webinar",
    date: "SEP 7",
    time: "7 PM IST",
    blurb: "Meet our Visa Counselor (5+ years experience)",
    mode: "Google Meet",
  },
  {
    title: "Visa 101 Webinar",
    date: "SEP 7",
    time: "7 PM IST",
    blurb: "Meet our Visa Counselor (5+ years experience)",
    mode: "Google Meet",
  },
  {
    titleLines: ["Spotlight", "UCL"] as const,
    date: "SEP 7",
    time: "7 PM IST",
    blurb: "Meet our Visa Counselor (5+ years experience)",
    mode: "Google Meet",
  },
] as const;

/** Live feed calendar + chips (from Supabase `events`). */
export type FeedUpcomingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  blurb: string;
  mode: string;
  /** ISO date used to mark the month calendar. */
  startsAt: string | null;
};

/** Per-user dashboard thread — shape matches a future Supabase `comments` row */
export type DashboardComment = {
  id: string;
  authorName: string;
  avatarUrl: string;
  body: string;
  createdAt: string;
  score: number;
  userVote: "up" | "down" | null;
};

export const COMMENTS_SEED: DashboardComment[] = [
  {
    id: "cmt-1",
    authorName: "Jane Doe",
    avatarUrl: "/assets/img/avatar.jpg",
    body: "We are going with your university application. If you have any doubts do let us know. Also on other notes can you update us on your SOP status. Have you made drafts?",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    score: 1,
    userVote: "up",
  },
  {
    id: "cmt-2",
    authorName: "Jane Doe",
    avatarUrl: "/assets/img/avatar.jpg",
    body: "Nice to connect, with the feedback session I could figure out your concerns and the path you are aiming for. We were pleasantly surprised that you started taking right steps already!",
    createdAt: "2025-05-21T10:00:00.000Z",
    score: -1,
    userVote: "down",
  },
  {
    id: "cmt-3",
    authorName: "Priya M.",
    avatarUrl: "/assets/img/avatar.jpg",
    body: "Please upload your latest SOP draft before Friday so we can review it ahead of the next counseling call.",
    createdAt: "2025-05-18T14:30:00.000Z",
    score: 0,
    userVote: null,
  },
  {
    id: "cmt-4",
    authorName: "Jane Doe",
    avatarUrl: "/assets/img/avatar.jpg",
    body: "Your shortlist looks solid. Once LORs are in, we can lock the USA stream choices and move to application forms.",
    createdAt: "2025-05-15T09:00:00.000Z",
    score: 2,
    userVote: null,
  },
  {
    id: "cmt-5",
    authorName: "Counselor Hub",
    avatarUrl: "/assets/img/avatar.jpg",
    body: "Reminder: join the group feedback session this weekend if you still have questions about visa timelines.",
    createdAt: "2025-05-10T16:00:00.000Z",
    score: 0,
    userVote: null,
  },
];
