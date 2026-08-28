export type AdminNavItem = {
  href: string;
  label: string;
  exact?: boolean;
  superAdminOnly?: boolean;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavItem[];
};

/** Mirrors E:\pgs\purpleguide\pgs_admin sidebar (header.php). */
export const ADMIN_NAV: Array<AdminNavItem | AdminNavGroup> = [
  { href: "/admin", label: "Dashboard", exact: true },
  {
    id: "users",
    label: "Users",
    items: [
      { href: "/admin/users", label: "Users List" },
      { href: "/admin/premium", label: "PurplePremium Applications" },
      { href: "/admin/premium-dashboard", label: "Premium Dashboard" },
      { href: "/admin/logs", label: "Logs" },
    ],
  },
  { href: "/admin/staff", label: "Admins", superAdminOnly: true },
  {
    id: "events",
    label: "Event Management",
    items: [
      { href: "/admin/event-categories", label: "Event Category" },
      { href: "/admin/events", label: "Events" },
    ],
  },
  {
    id: "courses",
    label: "Courses Management",
    items: [
      { href: "/admin/course-categories", label: "Courses Category" },
      { href: "/admin/courses", label: "Courses" },
    ],
  },
  { href: "/admin/universities", label: "University Management" },
  { href: "/admin/countries", label: "Countries" },
  { href: "/admin/pathways", label: "Pathways" },
  { href: "/admin/programs", label: "Discover Our Programs" },
  { href: "/admin/study-journey", label: "Study abroad journey" },
  { href: "/admin/univmeet", label: "#univMeet Dates" },
  {
    id: "student-resources",
    label: "Student Resources",
    items: [
      { href: "/admin/student-resources/key-dates", label: "Key Dates" },
      {
        href: "/admin/student-resources/urgent-deadlines",
        label: "Urgent Deadlines",
      },
      { href: "/admin/student-resources/subscribers", label: "Subscribers" },
      { href: "/admin/student-resources/settings", label: "Settings" },
      { href: "/admin/student-resources/pgs-stats", label: "PGS Stats" },
      {
        href: "/admin/student-resources/study-abroad-facts",
        label: "Study Abroad Facts",
      },
    ],
  },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
  {
    id: "about",
    label: "About Page",
    items: [
      { href: "/admin/about/founder", label: "Meet The Founder" },
      { href: "/admin/about/advisory", label: "Advisory Team" },
    ],
  },
  { href: "/admin/weekly-wall", label: "Weekly Wall" },
  { href: "/admin/highlights", label: "Highlights" },
  { href: "/admin/legal/privacy", label: "Privacy Policy" },
  { href: "/admin/legal/terms", label: "Terms Conditions" },
  { href: "/admin/legal/refund", label: "Refund Policy" },
  { href: "/admin/social", label: "Social Media Links" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/leads", label: "Modal Submissions" },
  { href: "/admin/marquee", label: "Marquee" },
  { href: "/admin/premium-content/meetup", label: "Premium Meetup Card" },
  { href: "/admin/premium-content/video", label: "Premium Hero Video" },
  { href: "/admin/profile", label: "Profile" },
];
