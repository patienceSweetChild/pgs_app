export type UnivMeetConfig = {
  slot1_date: string;
  slot1_month: string;
  slot2_date: string;
  slot2_month: string;
  course_id?: number | null;
  href: string;
};

/** Mock #univMeet slots until backend API exists. */
export const UNIVMEET: UnivMeetConfig = {
  slot1_date: "20",
  slot1_month: "Aug 26",
  slot2_date: "29",
  slot2_month: "Aug 29",
  course_id: null,
  href: "/programsfull",
};

export const SIDEBAR_LINKS = [
  {
    href: "/studentresources",
    label: "#datesDeadlines",
    icon: "/assets/img/loading-icon.png",
    requiresAuth: false,
  },
  {
    href: "/feed_track_progress",
    label: "Track Your Progress",
    icon: "/assets/img/loading-icon.png",
    requiresAuth: false,
  },
  {
    href: "/purpleboard",
    label: "#purpleboard",
    icon: "/assets/img/loading-icon.png",
    requiresAuth: true,
  },
  {
    href: "/upload_your_doc",
    label: "Upload Your Docs",
    icon: "/assets/img/upload-icon.png",
    requiresAuth: false,
  },
  {
    href: "/finance",
    label: "#purpleFinance Hub",
    icon: "/assets/img/finance-icon.png",
    requiresAuth: false,
  },
  {
    href: "/scholarship",
    label: "#purpleScholarship Hub",
    icon: "/assets/img/scholar-icon.png",
    requiresAuth: false,
  },
  {
    href: "/cvreadyprogram",
    label: "CV-Ready Programs",
    icon: "/assets/img/cvready-icon.png",
    requiresAuth: false,
  },
] as const;
