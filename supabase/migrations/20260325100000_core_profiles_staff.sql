-- Core identity: profiles + staff RBAC
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 255),
  dial_code text check (dial_code is null or char_length(dial_code) <= 8),
  phone text check (phone is null or char_length(phone) <= 20),
  whatsapp boolean,
  citizenship_country text check (citizenship_country is null or char_length(citizenship_country) <= 120),
  preferred_study_country text check (preferred_study_country is null or char_length(preferred_study_country) <= 120),
  study_level text check (study_level is null or char_length(study_level) <= 80),
  field_interest text check (field_interest is null or char_length(field_interest) <= 1000),
  work_experience text check (work_experience is null or char_length(work_experience) <= 1000),
  referral_code text check (referral_code is null or char_length(referral_code) <= 80),
  avatar_path text,
  profile_completed_at timestamptz,
  pgs_code text check (pgs_code is null or pgs_code ~ '^PGS[0-9]{6}$'),
  crm_stream text check (crm_stream is null or crm_stream in ('USMLE','PLAB','AMC','STEM','MBA','Other')),
  crm_target_year integer check (crm_target_year is null or (crm_target_year >= 2000 and crm_target_year <= 2100)),
  crm_stage text not null default 'new' check (crm_stage in ('new','active','on_hold','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('super_admin','admin','mentor','read_only_staff')),
  label text not null check (char_length(label) between 1 and 80),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.staff_permissions (
  id bigint generated always as identity primary key,
  key text not null unique check (key ~ '^[a-z][a-z0-9_.]{2,79}$'),
  label text not null check (char_length(label) between 1 and 120),
  domain text not null check (char_length(domain) between 1 and 60),
  description text not null default ''
);

create table public.staff_role_permissions (
  role_id uuid not null references public.staff_roles (id) on delete cascade,
  permission_id bigint not null references public.staff_permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.staff_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role_key text not null references public.staff_roles (key),
  display_name text not null default '' check (char_length(display_name) <= 255),
  status text not null default 'active' check (status in ('active','suspended','ended')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger staff_profiles_set_updated_at
before update on public.staff_profiles
for each row execute function public.set_updated_at();

create table public.staff_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role_id uuid not null references public.staff_roles (id) on delete cascade,
  assigned_by uuid references auth.users (id),
  assigned_at timestamptz not null default now(),
  unique (user_id, role_id)
);

insert into public.staff_roles (key, label, description) values
  ('super_admin', 'Super Admin', 'Full platform access'),
  ('admin', 'Admin', 'Operations and CMS'),
  ('mentor', 'Mentor', 'Assigned students only'),
  ('read_only_staff', 'Read Only', 'View-only staff access');

insert into public.staff_permissions (key, label, domain) values
  ('overview.read', 'Read dashboard', 'overview'),
  ('catalog.manage', 'Manage catalog', 'catalog'),
  ('cms.publish', 'Publish content', 'cms'),
  ('students.read', 'Read students', 'students'),
  ('students.manage', 'Manage students', 'students'),
  ('students.manage_assigned', 'Manage assigned students', 'students'),
  ('premium.manage', 'Manage premium', 'premium'),
  ('leads.manage', 'Manage leads', 'leads'),
  ('staff.manage', 'Manage staff', 'staff'),
  ('audit.read', 'Read audit logs', 'audit'),
  ('guardians.manage', 'Manage guardians', 'guardians');

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
cross join public.staff_permissions p
where r.key = 'super_admin';

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'overview.read','catalog.manage','cms.publish','students.read','students.manage',
  'premium.manage','leads.manage','audit.read','guardians.manage'
)
where r.key = 'admin';

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'overview.read','students.read','students.manage_assigned','audit.read'
)
where r.key = 'mentor';

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'overview.read','students.read','audit.read'
)
where r.key = 'read_only_staff';

create or replace function public.is_active_staff(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_profiles sp
    where sp.user_id = uid and sp.status = 'active'
  );
$$;

create or replace function public.staff_has_permission(perm_key text, uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles sp
    join public.staff_roles r on r.key = sp.role_key
    join public.staff_role_permissions srp on srp.role_id = r.id
    join public.staff_permissions p on p.id = srp.permission_id
    where sp.user_id = uid
      and sp.status = 'active'
      and p.key = perm_key
  );
$$;

grant execute on function public.is_active_staff(uuid) to authenticated, anon;
grant execute on function public.staff_has_permission(text, uuid) to authenticated, anon;
