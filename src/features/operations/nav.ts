export type OpsNavItem = {
  href: string;
  label: string;
  permission?: string;
  anyOf?: string[];
  exact?: boolean;
  mentorHidden?: boolean;
};

export const OPS_NAV: OpsNavItem[] = [
  { href: "/ops", label: "Scoreboard", permission: "overview.read", exact: true },
  {
    href: "/ops/students",
    label: "Students",
    anyOf: ["students.read", "student_workspace.read", "student_workspace.read_all"],
  },
  { href: "/ops/work", label: "Targets", permission: "staff_targets.read" },
  { href: "/ops/team", label: "Team", permission: "staff.read", mentorHidden: true },
  {
    href: "/ops/notifications",
    label: "Notifications",
    anyOf: ["overview.read", "notifications.manage"],
  },
  {
    href: "/ops/activity",
    label: "Activity",
    permission: "audit.read",
    mentorHidden: true,
  },
];
