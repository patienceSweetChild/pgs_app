-- Ops / CRM / notifications / lead extras / guardians already present
create table if not exists public.study_journey_enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  pathway text not null default '',
  message text not null default '',
  replied boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.deadline_subscriptions (
  id bigint generated always as identity primary key,
  email text not null,
  source_page text not null default '/',
  created_at timestamptz not null default now()
);

create table if not exists public.lead_triage_notes (
  id uuid primary key default gen_random_uuid(),
  lead_table text not null check (lead_table in (
    'enquiries','lead_submissions','study_journey_enquiries','deadline_subscriptions'
  )),
  lead_id text not null,
  body text not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  title text not null,
  body text not null default '',
  section text,
  reference_type text,
  reference_id text,
  destination_path text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  recipient_kind text not null default 'student' check (recipient_kind in ('student','staff')),
  recipient_user_id uuid not null references auth.users (id) on delete cascade,
  archived_at timestamptz,
  dedupe_key text
);

create table if not exists public.staff_targets (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null references public.staff_profiles (user_id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open','in_progress','done','cancelled')),
  due_at timestamptz,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_registry_saved_views (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null references public.staff_profiles (user_id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.student_crm_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.student_crm_tag_links (
  student_id uuid not null references public.profiles (id) on delete cascade,
  tag_id uuid not null references public.student_crm_tags (id) on delete cascade,
  attached_by uuid references auth.users (id),
  attached_at timestamptz not null default now(),
  primary key (student_id, tag_id)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  event_type text not null,
  actor_user_id uuid references auth.users (id),
  actor_kind text not null check (actor_kind in ('anonymous','student','staff','system')),
  target_type text,
  target_id text,
  outcome text not null check (outcome in ('succeeded','denied','failed')),
  source_subsystem text not null,
  metadata jsonb not null default '{}'::jsonb,
  request_id text
);

-- Align admin_audit_logs with richer shape if columns missing
alter table public.admin_audit_logs
  add column if not exists domain text,
  add column if not exists entity_type text,
  add column if not exists old_values jsonb not null default '{}'::jsonb,
  add column if not exists new_values jsonb not null default '{}'::jsonb,
  add column if not exists reason text;

-- Extra staff permissions used by expanded modules
insert into public.staff_permissions (key, label, domain)
values
  ('documents.manage', 'Manage student documents', 'documents'),
  ('workspace.manage', 'Manage premium workspace', 'workspace'),
  ('notifications.manage', 'Manage notifications', 'notifications'),
  ('content.manage', 'Manage CMS content modules', 'cms')
on conflict (key) do nothing;

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
cross join public.staff_permissions p
where r.key = 'super_admin'
  and not exists (
    select 1 from public.staff_role_permissions srp
    where srp.role_id = r.id and srp.permission_id = p.id
  );

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'documents.manage','workspace.manage','notifications.manage','content.manage'
)
where r.key = 'admin'
  and not exists (
    select 1 from public.staff_role_permissions srp
    where srp.role_id = r.id and srp.permission_id = p.id
  );

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in ('documents.manage','workspace.manage')
where r.key = 'mentor'
  and not exists (
    select 1 from public.staff_role_permissions srp
    where srp.role_id = r.id and srp.permission_id = p.id
  );
