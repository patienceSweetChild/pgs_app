export const OPERATIONS_ACTIVITY_DOMAINS = [
  "staff",
  "staff_targets",
  "assignments",
  "premium",
  "premium_workspace",
  "documents",
  "notifications",
  "catalog",
  "content",
  "cms",
  "leads",
  "settings",
  "auth",
] as const;

export type OperationsActivityDomain = (typeof OPERATIONS_ACTIVITY_DOMAINS)[number];

export type OperationsActivityItem = {
  id: string;
  occurredAt: string;
  eventType: string;
  eventLabel: string;
  actorLabel: string;
  targetLabel: string;
  targetType: string | null;
  outcome: string;
  sourceSubsystem: string;
  destinationPath: string | null;
};

const EVENT_LABELS: Record<string, string> = {
  "staff.invited": "Staff access invited",
  "staff.created": "Staff account created",
  "staff.role_changed": "Staff role changed",
  "staff.suspended": "Staff access suspended",
  "staff.reactivated": "Staff access reactivated",
  "staff.access_revoked": "Staff access revoked",
  "staff.role_permissions.updated": "Role permissions updated",
  "assignment.assigned": "Mentor assignment created",
  "premium.granted": "Premium granted",
  "premium.revoked": "Premium revoked",
  "premium.reactivated": "Premium reactivated",
  "staff_target.created": "Staff target created",
  "staff_target.status_changed": "Staff target status changed",
};

export function operationsActivityEventLabel(eventType: string): string {
  if (EVENT_LABELS[eventType]) return EVENT_LABELS[eventType];
  return eventType
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part,
    )
    .join(" ");
}

export function normalizeOperationsActivityDomain(
  value: unknown,
): OperationsActivityDomain | null {
  return typeof value === "string" &&
    (OPERATIONS_ACTIVITY_DOMAINS as readonly string[]).includes(value)
    ? (value as OperationsActivityDomain)
    : null;
}

export function operationsActivityDomainLabel(domain: string): string {
  if (domain === "staff_targets") return "Staff targets";
  if (domain === "premium_workspace") return "Premium workspace";
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}
