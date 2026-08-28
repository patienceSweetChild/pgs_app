export type OpsNavItem = {
  href: string;
  label: string;
  permission: string;
  exact?: boolean;
  mentorHidden?: boolean;
};

export const OPS_NAV: OpsNavItem[] = [
  { href: "/ops", label: "Scoreboard", permission: "overview.read", exact: true },
  { href: "/ops/students", label: "Students", permission: "overview.read" },
  { href: "/ops/work", label: "Work", permission: "staff_targets.read" },
  { href: "/ops/team", label: "Team", permission: "staff.read", mentorHidden: true },
  { href: "/ops/access", label: "Access", permission: "mentor_assignments.manage" },
  {
    href: "/ops/activity",
    label: "Activity",
    permission: "audit.read",
    mentorHidden: true,
  },
];
