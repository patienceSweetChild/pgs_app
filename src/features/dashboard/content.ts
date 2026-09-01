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

export type DashboardPreviewIdentity = {
  name: string;
  handle: string;
  id: string;
  avatar: string;
};

/** Live feed calendar + chips (from Supabase `events` / CMS picks). */
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

export type DashboardUpcomingKind = "event" | "course" | "custom";

export type DashboardUpcomingItem = {
  id: string;
  kind: DashboardUpcomingKind;
  catalog_id: string | null;
  title: string;
  date: string;
  time: string;
  blurb: string;
  mode: string;
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

export type DashboardTaskBadge = "URGENT" | "IMP";

export type DashboardTopPick = {
  title: string;
  tag: string;
  highlight: string;
  dot: string;
  image: string;
  image_asset_id: string | null;
};

export type DashboardChecklistItem = { text: string; checked: boolean };

export function onboardingPercentageFromChecklist(
  items: DashboardChecklistItem[],
): number {
  const countable = items.filter((item) => item.text.trim().length > 0);
  if (countable.length === 0) return 0;
  const done = countable.filter((item) => item.checked).length;
  return Math.round((done / countable.length) * 100);
}

export type DashboardTrackerItem = {
  count: string;
  label: string;
  danger: boolean;
};

export type DashboardShortlistItem = { count: string; label: string };

export type DashboardUniCard = {
  name: string;
  tag: string;
  image: string;
  image_asset_id: string | null;
};

export type DashboardTaskItem = {
  label: string;
  badge: DashboardTaskBadge | null;
};

export type DashboardDestination = {
  code: string;
  name: string;
  flag: string;
};

export type StudentDashboardContent = {
  pathway_label: string;
  premium_label: string;
  notes_html: string;
  aspirant: {
    title: string;
    gender: string;
    location: string;
    destinations: DashboardDestination[];
  };
  overview: {
    universities_applied: number;
    offers_received: number;
    tuition_receipt_uploaded: boolean;
    visa_applied: boolean;
  };
  top_picks: DashboardTopPick[];
  onboarding_percentage: number;
  onboarding_checklist: DashboardChecklistItem[];
  feedback_session_title: string;
  feedback_session_items: DashboardChecklistItem[];
  documents_tracker: DashboardTrackerItem[];
  uni_shortlist: DashboardShortlistItem[];
  finalized_unis: DashboardUniCard[];
  currently_working_on: DashboardTaskItem[];
  future_tasks: DashboardTaskItem[];
  comments: DashboardComment[];
  upcoming_events: DashboardUpcomingItem[];
};

const DEFAULT_NOTES =
  "This is the phase where we check your documents, get your applications ready, and start planning your university journey. Got questions or need feedback? Reach out to your counselor anytime—and make sure to join any upcoming sessions we invite you to.";

export function defaultDashboardContent(): StudentDashboardContent {
  const onboarding_checklist = ONBOARDING_CHECKS.map((item) => ({
    text: item.label,
    checked: item.checked,
  }));
  return {
    pathway_label: GUEST_PROFILE.pathway,
    premium_label: GUEST_PROFILE.premiumLabel,
    notes_html: `<p>${DEFAULT_NOTES}</p>`,
    aspirant: {
      title: "MBA Aspirant @class of 2025",
      gender: "Male",
      location: "White Town, Pondicherry",
      destinations: [
        { code: "US", name: "USA", flag: "/assets/img/US.png" },
        { code: "UK", name: "UK", flag: "/assets/img/US.png" },
      ],
    },
    overview: {
      universities_applied: 2,
      offers_received: 2,
      tuition_receipt_uploaded: true,
      visa_applied: true,
    },
    top_picks: TOP_PICKS.map((pick) => ({
      title: pick.title,
      tag: pick.tag,
      highlight: pick.highlight,
      dot: pick.dot,
      image: pick.image,
      image_asset_id: null,
    })),
    onboarding_checklist,
    onboarding_percentage:
      onboardingPercentageFromChecklist(onboarding_checklist),
    feedback_session_title: "June feedback session",
    feedback_session_items: [
      { text: "One-on-One Session Booked", checked: false },
    ],
    documents_tracker: DOC_TRACKER.map((row) => ({
      count: row.count,
      label: row.label,
      danger: row.danger,
    })),
    uni_shortlist: SHORTLIST.map((row) => ({
      count: row.count,
      label: row.label,
    })),
    finalized_unis: FINALIZED_UNIS.map((uni) => ({
      name: uni.name,
      tag: uni.tag,
      image: uni.image,
      image_asset_id: null,
    })),
    currently_working_on: WORKING_ON.map((item) => ({
      label: item.label,
      badge: item.badge,
    })),
    future_tasks: FUTURE_TASKS.map((item) => ({
      label: item.label,
      badge: item.badge,
    })),
    comments: COMMENTS_SEED.map((item) => ({ ...item })),
    upcoming_events: [],
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function str(value: unknown, fallback = "", max = 4000): string {
  if (typeof value !== "string") return fallback;
  return value.slice(0, max);
}

function num(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function bool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

function asTaskBadge(value: unknown): DashboardTaskBadge | null {
  return value === "URGENT" || value === "IMP" ? value : null;
}

export function normalizeDashboardContent(
  raw: unknown,
): StudentDashboardContent {
  const fallback = defaultDashboardContent();
  const row = asRecord(raw);
  if (!row) return fallback;

  const aspirant = asRecord(row.aspirant) ?? {};
  const overview = asRecord(row.overview) ?? {};

  const destinations = Array.isArray(aspirant.destinations)
    ? aspirant.destinations
        .map((item) => {
          const dest = asRecord(item);
          if (!dest) return null;
          return {
            code: str(dest.code, "", 8),
            name: str(dest.name, "", 80),
            flag: str(dest.flag, "/assets/img/US.png", 500),
          };
        })
        .filter((item): item is DashboardDestination => Boolean(item?.name))
    : fallback.aspirant.destinations;

  const topPicks = Array.isArray(row.top_picks)
    ? row.top_picks
        .map((item) => {
          const pick = asRecord(item);
          if (!pick) return null;
          return {
            title: str(pick.title, "", 240),
            tag: str(pick.tag, "InProgress", 80),
            highlight: str(pick.highlight, "", 80),
            dot: str(pick.dot, "yellow-bg", 40),
            image: str(pick.image, "/assets/img/computer.jpg", 500),
            image_asset_id:
              typeof pick.image_asset_id === "string"
                ? pick.image_asset_id
                : null,
          };
        })
        .filter((item): item is DashboardTopPick => Boolean(item))
    : fallback.top_picks;

  const checklist = (value: unknown, fb: DashboardChecklistItem[]) =>
    Array.isArray(value)
      ? value
          .map((item) => {
            const rowItem = asRecord(item);
            if (!rowItem) return null;
            const text = str(rowItem.text ?? rowItem.label, "", 200);
            if (!text) return null;
            return { text, checked: bool(rowItem.checked) };
          })
          .filter((item): item is DashboardChecklistItem => Boolean(item))
      : fb;

  const tracker = Array.isArray(row.documents_tracker)
    ? row.documents_tracker
        .map((item) => {
          const rowItem = asRecord(item);
          if (!rowItem) return null;
          const label = str(rowItem.label, "", 120);
          if (!label) return null;
          return {
            count: str(rowItem.count, "0", 8),
            label,
            danger: bool(rowItem.danger),
          };
        })
        .filter((item): item is DashboardTrackerItem => Boolean(item))
    : fallback.documents_tracker;

  const shortlist = Array.isArray(row.uni_shortlist)
    ? row.uni_shortlist
        .map((item) => {
          const rowItem = asRecord(item);
          if (!rowItem) return null;
          const label = str(rowItem.label, "", 120);
          if (!label) return null;
          return { count: str(rowItem.count, "0", 8), label };
        })
        .filter((item): item is DashboardShortlistItem => Boolean(item))
    : fallback.uni_shortlist;

  const unis = Array.isArray(row.finalized_unis)
    ? row.finalized_unis
        .map((item) => {
          const rowItem = asRecord(item);
          if (!rowItem) return null;
          return {
            name: str(rowItem.name, "", 120),
            tag: str(rowItem.tag, "", 40),
            image: str(rowItem.image, "/assets/img/uni.jpg", 500),
            image_asset_id:
              typeof rowItem.image_asset_id === "string"
                ? rowItem.image_asset_id
                : null,
          };
        })
        .filter((item): item is DashboardUniCard => Boolean(item?.name))
    : fallback.finalized_unis;

  const tasks = (value: unknown, fb: DashboardTaskItem[]) =>
    Array.isArray(value)
      ? value
          .map((item) => {
            if (typeof item === "string") {
              const label = item.trim().slice(0, 240);
              return label ? { label, badge: null } : null;
            }
            const rowItem = asRecord(item);
            if (!rowItem) return null;
            const label = str(rowItem.label, "", 240);
            if (!label) return null;
            return { label, badge: asTaskBadge(rowItem.badge) };
          })
          .filter((item): item is DashboardTaskItem => Boolean(item))
      : fb;

  const onboardingChecklist = checklist(
    row.onboarding_checklist,
    fallback.onboarding_checklist,
  );

  return {
    pathway_label: str(row.pathway_label, fallback.pathway_label, 120),
    premium_label: str(row.premium_label, fallback.premium_label, 80),
    notes_html: str(row.notes_html, fallback.notes_html, 20000),
    aspirant: {
      title: str(aspirant.title, fallback.aspirant.title, 160),
      gender: str(aspirant.gender, fallback.aspirant.gender, 40),
      location: str(aspirant.location, fallback.aspirant.location, 160),
      destinations: destinations.length
        ? destinations
        : fallback.aspirant.destinations,
    },
    overview: {
      universities_applied: num(
        overview.universities_applied,
        fallback.overview.universities_applied,
        0,
        999,
      ),
      offers_received: num(
        overview.offers_received,
        fallback.overview.offers_received,
        0,
        999,
      ),
      tuition_receipt_uploaded: bool(
        overview.tuition_receipt_uploaded,
        fallback.overview.tuition_receipt_uploaded,
      ),
      visa_applied: bool(
        overview.visa_applied,
        fallback.overview.visa_applied,
      ),
    },
    top_picks: topPicks.length ? topPicks : fallback.top_picks,
    onboarding_checklist: onboardingChecklist,
    onboarding_percentage:
      onboardingPercentageFromChecklist(onboardingChecklist),
    feedback_session_title: str(
      row.feedback_session_title,
      fallback.feedback_session_title,
      120,
    ),
    feedback_session_items: checklist(
      row.feedback_session_items,
      fallback.feedback_session_items,
    ),
    documents_tracker: tracker.length ? tracker : fallback.documents_tracker,
    uni_shortlist: shortlist.length ? shortlist : fallback.uni_shortlist,
    finalized_unis: unis.length ? unis : fallback.finalized_unis,
    currently_working_on: tasks(
      row.currently_working_on,
      fallback.currently_working_on,
    ),
    future_tasks: tasks(row.future_tasks, fallback.future_tasks),
    comments: Array.isArray(row.comments)
      ? row.comments
          .map((item) => {
            const rowItem = asRecord(item);
            if (!rowItem) return null;
            const body = str(rowItem.body, "", 4000);
            if (!body) return null;
            return {
              id: str(rowItem.id, `cmt-${Math.random().toString(36).slice(2, 8)}`, 80),
              authorName: str(rowItem.authorName, "Counselor", 80),
              avatarUrl: str(
                rowItem.avatarUrl,
                "/assets/img/avatar.jpg",
                500,
              ),
              body,
              createdAt: str(
                rowItem.createdAt,
                new Date().toISOString(),
                40,
              ),
              score: num(rowItem.score, 0, -999, 999),
              userVote:
                rowItem.userVote === "up" || rowItem.userVote === "down"
                  ? rowItem.userVote
                  : null,
            } satisfies DashboardComment;
          })
          .filter((item): item is DashboardComment => Boolean(item))
      : fallback.comments,
    upcoming_events: Array.isArray(row.upcoming_events)
      ? row.upcoming_events
          .map((item) => {
            const rowItem = asRecord(item);
            if (!rowItem) return null;
            const title = str(rowItem.title, "", 200);
            if (!title) return null;
            const kind =
              rowItem.kind === "course" ||
              rowItem.kind === "event" ||
              rowItem.kind === "custom"
                ? rowItem.kind
                : "custom";
            return {
              id: str(rowItem.id, `up-${Math.random().toString(36).slice(2, 8)}`, 80),
              kind,
              catalog_id:
                typeof rowItem.catalog_id === "string"
                  ? rowItem.catalog_id
                  : null,
              title,
              date: str(rowItem.date, "TBA", 40),
              time: str(rowItem.time, "", 40),
              blurb: str(rowItem.blurb, "", 400),
              mode: str(rowItem.mode, "Online", 80),
              startsAt:
                typeof rowItem.startsAt === "string" ? rowItem.startsAt : null,
            } satisfies DashboardUpcomingItem;
          })
          .filter((item): item is DashboardUpcomingItem => Boolean(item))
      : fallback.upcoming_events,
  };
}

export function upcomingItemsToFeed(
  items: DashboardUpcomingItem[],
): FeedUpcomingEvent[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    time: item.time,
    blurb: item.blurb,
    mode: item.mode,
    startsAt: item.startsAt,
  }));
}

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
