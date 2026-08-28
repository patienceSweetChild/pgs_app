export const CRM_STREAMS = ["USMLE", "PLAB", "AMC", "STEM", "MBA", "Other"] as const;
export const CRM_STAGES = ["new", "active", "on_hold", "closed"] as const;
export type CrmStream = (typeof CRM_STREAMS)[number];
export type CrmStage = (typeof CRM_STAGES)[number];
export const CRM_STAGE_LABELS: Record<CrmStage, string> = {
  new: "New",
  active: "Active",
  on_hold: "On hold",
  closed: "Closed",
};
export const CRM_RESERVED_TAG_SLUGS = [
  "premium",
  "standard",
  "assigned",
  "unassigned",
  "usmle",
  "plab",
  "amc",
  "stem",
  "mba",
  "other",
] as const;

export type StudentCrmTag = {
  id: string;
  name: string;
  slug: string;
};

export type StudentCrmProfile = {
  id: string;
  pgsCode: string;
  fullName: string;
  studyLevel: string | null;
  preferredStudyCountry: string | null;
  stream: CrmStream | null;
  targetYear: number | null;
  stage: CrmStage;
  joinedAt: string;
  joinYear: number;
  plan: "Premium" | "Standard";
  mentorName: string;
  mentorId: string | null;
  canOpenWorkspace: boolean;
  canMutate: boolean;
  tags: StudentCrmTag[];
};

export function isCrmStream(value: string | null | undefined): value is CrmStream {
  return Boolean(value && CRM_STREAMS.includes(value as CrmStream));
}

export function isCrmStage(value: string | null | undefined): value is CrmStage {
  return Boolean(value && CRM_STAGES.includes(value as CrmStage));
}

export function derivedCrmGroups(
  profile: Pick<StudentCrmProfile, "plan" | "stream" | "targetYear" | "mentorName">,
): string[] {
  const groups = [profile.plan === "Premium" ? "#Premium" : "#Standard"];
  if (profile.stream) groups.push(`#${profile.stream}`);
  if (profile.targetYear) groups.push(`#${profile.targetYear}`);
  if (profile.mentorName && profile.mentorName !== "Unassigned") {
    groups.push(`${profile.mentorName}'s students`);
  }
  return groups;
}

export function parseCrmTargetYear(
  value: string | number | null | undefined,
): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 2000 && value <= 2100 ? value : null;
  }
  if (!value || !/^[0-9]{4}$/.test(String(value))) return null;
  const year = Number(value);
  return year >= 2000 && year <= 2100 ? year : null;
}

export function crmJoinYear(iso: string): number {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
    }).format(new Date(iso)),
  );
}

export function crmTargetYearOptions(now = new Date(), selected?: number | null): number[] {
  const current = crmJoinYear(now.toISOString());
  const years = new Set<number>();
  for (let year = current; year <= current + 6; year += 1) years.add(year);
  if (selected && selected >= 2000 && selected <= 2100) years.add(selected);
  return [...years].sort((left, right) => left - right);
}

export function formatRegistryJoinedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
  }).format(new Date(iso));
}

export function registryPlanTone(plan: string): "accent" | "default" {
  return plan === "Premium" ? "accent" : "default";
}
