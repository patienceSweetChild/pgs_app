-- Premium entitlements, applications, leads, mentor assignments
create table public.premium_plans (
  code text primary key check (char_length(code) between 1 and 40),
  label text not null,
  duration_months integer not null check (duration_months between 1 and 120),
  active boolean not null default true
);

insert into public.premium_plans (code, label, duration_months) values
  ('purple_premium_12', 'PurplePremium 12 months', 12),
  ('purple_premium_6', 'PurplePremium 6 months', 6);

create table public.premium_applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  plan_code text not null default 'purple_premium_12' references public.premium_plans (code),
  notes text not null default '',
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger premium_applications_set_updated_at
before update on public.premium_applications
for each row execute function public.set_updated_at();

create table public.premium_entitlements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('active','revoked','expired')),
  source text not null check (source in ('admin_grant','payment','legacy_purchase')),
  plan_code text not null references public.premium_plans (code),
  duration_months integer not null check (duration_months between 1 and 120),
  approved_at timestamptz not null default now(),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  revoked_at timestamptz,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

create index premium_entitlements_active_idx
  on public.premium_entitlements (student_id)
  where status = 'active';

create table public.premium_workspace_profiles (
  student_id uuid primary key references public.profiles (id) on delete cascade,
  pathway_label text not null default '',
  intake_label text not null default '',
  universities_applied integer not null default 0,
  offers_received integer not null default 0,
  visa_status text not null default '',
  tuition_receipt_uploaded boolean,
  onboarding_percentage smallint check (onboarding_percentage is null or (onboarding_percentage between 0 and 100)),
  feedback_session_title text not null default '',
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

create table public.mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'active' check (status in ('active','ended')),
  assigned_at timestamptz not null default now(),
  assigned_by uuid not null references auth.users (id),
  ended_at timestamptz,
  unique (mentor_id, student_id, status)
);

create table public.enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  mobile text not null default '',
  message text not null default '',
  reply boolean not null default false,
  reply_message text not null default '',
  created_at timestamptz not null default now()
);

create table public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  modal_type text not null default 'applicant',
  name text not null,
  email text not null,
  phone text not null default '',
  checklist_items jsonb not null default '[]'::jsonb,
  planning_to_study text not null default '',
  source_page text not null default '/',
  created_at timestamptz not null default now()
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  actor_role text,
  target_user_id uuid references public.profiles (id),
  entity text not null,
  entity_id text,
  action text not null,
  description text not null default '',
  changes jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create or replace function public.student_has_active_premium(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.premium_entitlements pe
    where pe.student_id = uid
      and pe.status = 'active'
      and pe.starts_at <= now()
      and pe.ends_at > now()
  );
$$;

grant execute on function public.student_has_active_premium(uuid) to authenticated, anon;
