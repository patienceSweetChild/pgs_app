export type StudentRegistryRow = {
  id: string;
  full_name: string;
  crm_stage: string;
  preferred_study_country: string | null;
  created_at: string;
  plan: string;
  mentor_name: string;
  mentor_id: string | null;
  can_open_workspace: boolean;
  total_count: number;
};

export type RegistryQuery = {
  search?: string;
  plan?: string;
  mentor?: string;
  crmStage?: string;
  page?: number;
  pageSize?: number;
};

export function registryHref(query: RegistryQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("q", query.search);
  if (query.plan && query.plan !== "all") params.set("plan", query.plan);
  if (query.mentor && query.mentor !== "all") params.set("mentor", query.mentor);
  if (query.crmStage && query.crmStage !== "all")
    params.set("stage", query.crmStage);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  const search = params.toString();
  return search ? `/ops/students?${search}` : "/ops/students";
}
