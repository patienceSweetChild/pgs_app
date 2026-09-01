import {
  isCrmStage,
  isCrmStream,
  parseCrmTargetYear,
  type CrmStage,
  type CrmStream,
} from "@/lib/operations/student-crm";

export const PGS_JOIN_TIMEZONE = "Asia/Kolkata";
export const REGISTRY_PAGE_SIZE = 25;
export const REGISTRY_SAVED_VIEW_MAX = 20;
export const REGISTRY_STUDY_LEVELS = [
  "UG",
  "PG",
  "PhD",
  "Post MBBS",
  "Medical Student",
] as const;

export type RegistryPlan = "Premium" | "Standard";
export type RegistryCompletion = "Complete" | "Incomplete";
export type RegistryPlanFilter = "premium" | "standard";
export type RegistryStudyLevel = (typeof REGISTRY_STUDY_LEVELS)[number];

export type StudentRegistryRow = {
  id: string;
  pgsCode: string;
  fullName: string;
  studyLevel: string | null;
  stream: CrmStream | null;
  targetYear: number | null;
  stage: CrmStage;
  plan: RegistryPlan;
  mentorName: string;
  mentorId: string | null;
  joinedAt: string;
  completion: RegistryCompletion;
  canOpenWorkspace: boolean;
  totalCount: number;
  preferredStudyCountry?: string | null;
};

export type StudentRegistryResult = {
  rows: StudentRegistryRow[];
  totalCount: number;
  page: number;
  pageSize: number;
  error: boolean;
};

export type NormalizedRegistryQuery = {
  q: string | null;
  plan: RegistryPlanFilter | null;
  mentor: string | null;
  studyLevel: RegistryStudyLevel | null;
  stream: CrmStream | null;
  targetYear: number | null;
  stage: CrmStage | null;
  tag: string | null;
  completion: "complete" | "incomplete" | null;
  joined: string | null;
  sort: string | null;
  page: number;
  view: string | null;
};

export type RegistrySavedView = {
  id: string;
  name: string;
  query: NormalizedRegistryQuery;
};

export type RegistryMentorOption = {
  id: string;
  displayName: string;
  roleKey: string | null;
};

export type RegistryQueryCapabilities = {
  allowOrgFilters: boolean;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function registryPage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseRegistryQuery(
  input: Record<string, string | string[] | undefined>,
  capabilities: RegistryQueryCapabilities,
): NormalizedRegistryQuery {
  const q = (firstParam(input.q) ?? "").trim().replace(/[%_\\]/g, "").slice(0, 80);
  const planRaw = firstParam(input.plan);
  const plan = planRaw === "premium" || planRaw === "standard" ? planRaw : null;
  const mentorValue = firstParam(input.mentor)?.trim().toLowerCase() ?? "";
  const mentor = capabilities.allowOrgFilters
    ? mentorValue === "assigned" ||
      mentorValue === "unassigned" ||
      UUID_PATTERN.test(mentorValue)
      ? mentorValue
      : null
    : null;
  const studyLevel = REGISTRY_STUDY_LEVELS.includes(
    firstParam(input.study_level) as RegistryStudyLevel,
  )
    ? (firstParam(input.study_level) as RegistryStudyLevel)
    : null;
  const stream = isCrmStream(firstParam(input.stream) ?? null)
    ? (firstParam(input.stream) as CrmStream)
    : null;
  const stage = isCrmStage(firstParam(input.stage) ?? null)
    ? (firstParam(input.stage) as CrmStage)
    : null;
  const completionRaw = firstParam(input.completion);
  const completion =
    completionRaw === "complete" || completionRaw === "incomplete"
      ? completionRaw
      : null;
  let joined: string | null = null;
  if (capabilities.allowOrgFilters) {
    const joinedRaw = firstParam(input.joined);
    if (joinedRaw === "this_month") joined = "this_month";
    else if (joinedRaw && /^[0-9]{4}$/.test(joinedRaw)) joined = joinedRaw;
  }

  return {
    q: q || null,
    plan,
    mentor,
    studyLevel,
    stream,
    targetYear: parseCrmTargetYear(firstParam(input.target_year) ?? null),
    stage,
    tag:
      firstParam(input.tag) && UUID_PATTERN.test(firstParam(input.tag)!)
        ? firstParam(input.tag)!.toLowerCase()
        : null,
    completion,
    joined,
    sort: firstParam(input.sort) || null,
    page: registryPage(firstParam(input.page)),
    view:
      firstParam(input.view) && UUID_PATTERN.test(firstParam(input.view)!)
        ? firstParam(input.view)!.toLowerCase()
        : null,
  };
}

export function registrySavedQueryFromNormalized(
  query: NormalizedRegistryQuery,
): Record<string, string> {
  const saved: Record<string, string> = {};
  if (query.q) saved.q = query.q;
  if (query.plan) saved.plan = query.plan;
  if (query.mentor) saved.mentor = query.mentor;
  if (query.studyLevel) saved.study_level = query.studyLevel;
  if (query.stream) saved.stream = query.stream;
  if (query.targetYear) saved.target_year = String(query.targetYear);
  if (query.stage) saved.stage = query.stage;
  if (query.tag) saved.tag = query.tag;
  if (query.completion) saved.completion = query.completion;
  if (query.joined) saved.joined = query.joined;
  if (query.sort) saved.sort = query.sort;
  return saved;
}

export function parseSavedRegistryQuery(
  value: unknown,
  capabilities: RegistryQueryCapabilities,
): NormalizedRegistryQuery {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const asString = (key: string) =>
    typeof record[key] === "string" ? (record[key] as string) : undefined;
  return parseRegistryQuery(
    {
      q: asString("q"),
      plan: asString("plan"),
      mentor: asString("mentor"),
      study_level: asString("study_level"),
      stream: asString("stream"),
      target_year: asString("target_year"),
      stage: asString("stage"),
      tag: asString("tag"),
      completion: asString("completion"),
      joined: asString("joined"),
      sort: asString("sort"),
    },
    capabilities,
  );
}

export function registryQueryHasFilters(query: NormalizedRegistryQuery): boolean {
  return Boolean(
    query.plan ||
      query.mentor ||
      query.studyLevel ||
      query.stream ||
      query.targetYear ||
      query.stage ||
      query.tag ||
      query.completion ||
      query.joined,
  );
}

export function registryHref(
  query: NormalizedRegistryQuery,
  options?: { includePage?: boolean; includeView?: boolean },
): string {
  const params = new URLSearchParams(registrySavedQueryFromNormalized(query));
  if (options?.includePage && query.page > 1) params.set("page", String(query.page));
  if (options?.includeView && query.view) params.set("view", query.view);
  const search = params.toString();
  return search ? `/ops/students?${search}` : "/ops/students";
}

export function omitRegistryFilter(
  query: NormalizedRegistryQuery,
  key: keyof NormalizedRegistryQuery,
): NormalizedRegistryQuery {
  return { ...query, [key]: null, page: 1, view: null };
}

export function registryJoinYearOptions(now = new Date()): number[] {
  const year = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: PGS_JOIN_TIMEZONE,
      year: "numeric",
    }).format(now),
  );
  const years: number[] = [];
  for (let current = year; current >= year - 4; current -= 1) years.push(current);
  return years;
}

export function formatRegistryJoinedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PGS_JOIN_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
