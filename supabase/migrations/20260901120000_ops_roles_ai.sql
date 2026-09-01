-- Ops roles, saved views, notifications, and AI permission.
-- Safe to re-run: drops known check constraints, then upserts roles/grants.

alter table public.staff_roles drop constraint if exists staff_roles_key_check;
alter table public.staff_profiles drop constraint if exists staff_profiles_role_check;
alter table public.staff_profiles drop constraint if exists staff_profiles_role_key_check;

do $$
declare
  rec record;
begin
  for rec in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'staff_roles'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%key%'
  loop
    execute format('alter table public.staff_roles drop constraint if exists %I', rec.conname);
  end loop;
end $$;

update public.staff_roles
set key = 'viewer',
    label = 'Viewer',
    description = 'Student-facing visibility. Same default view as guardian and student.'
where key in ('read_only_staff', 'viewer');

update public.staff_profiles
set role_key = 'viewer'
where role_key in ('read_only_staff');

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'staff_profiles'
      and column_name = 'role'
  ) then
    execute $sql$update public.staff_profiles set role = 'viewer' where role in ('read_only_staff')$sql$;
  end if;
end $$;

insert into public.staff_permissions(key, label, domain, description)
values
  ('ai.analyze', 'AI analysis', 'operations', 'Ask PGS about authorized operations data.')
on conflict (key) do nothing;

insert into public.staff_roles(key, label, description)
values
  ('super_admin', 'Super Admin', 'All approved operational and staff-governance permissions.'),
  ('admin', 'Admin', 'Day-to-day student and operations.'),
  ('mentor', 'Mentor / Counselor', 'Assigned-student workspace operations only.'),
  ('viewer', 'Viewer', 'Student-facing visibility. Same default view as guardian and student.'),
  ('guardian', 'Guardian', 'Portal actor with student-facing visibility.'),
  ('student', 'Student', 'Student dashboard actor with student-facing visibility.')
on conflict (key) do update
set label = excluded.label,
    description = excluded.description;

alter table public.staff_roles
  add constraint staff_roles_key_check
  check (key in ('super_admin', 'admin', 'mentor', 'viewer', 'guardian', 'student'));

insert into public.staff_role_permissions(role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p
  on p.key in ('student_workspace.read', 'documents.manage', 'notifications.manage')
where r.key in ('viewer', 'guardian', 'student')
  and not exists (
    select 1
    from public.staff_role_permissions existing
    where existing.role_id = r.id
      and existing.permission_id = p.id
  );

insert into public.staff_role_permissions(role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key = 'ai.analyze'
where r.key in ('super_admin', 'admin')
  and not exists (
    select 1
    from public.staff_role_permissions existing
    where existing.role_id = r.id
      and existing.permission_id = p.id
  );

create table if not exists public.staff_registry_saved_views (
  id uuid primary key default gen_random_uuid(),
  staff_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  query jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists staff_registry_saved_views_owner_name_key
  on public.staff_registry_saved_views (staff_user_id, lower(name));

alter table public.staff_registry_saved_views enable row level security;

grant select, insert, update, delete on public.staff_registry_saved_views to authenticated;

drop policy if exists "staff manage own registry views" on public.staff_registry_saved_views;
create policy "staff manage own registry views"
on public.staff_registry_saved_views
for all
to authenticated
using ((select auth.uid()) = staff_user_id)
with check ((select auth.uid()) = staff_user_id);

create table if not exists public.staff_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null default 'notice',
  title text not null default 'Notification',
  body text not null default '',
  student_id uuid,
  destination_path text,
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists staff_notifications_recipient_created_idx
  on public.staff_notifications (recipient_user_id, created_at desc);

create index if not exists staff_notifications_unread_idx
  on public.staff_notifications (recipient_user_id)
  where read_at is null and archived_at is null;

alter table public.staff_notifications enable row level security;

grant select, update on public.staff_notifications to authenticated;

drop policy if exists "staff read own notifications" on public.staff_notifications;
create policy "staff read own notifications"
on public.staff_notifications
for select
to authenticated
using ((select auth.uid()) = recipient_user_id);

drop policy if exists "staff update own notifications" on public.staff_notifications;
create policy "staff update own notifications"
on public.staff_notifications
for update
to authenticated
using ((select auth.uid()) = recipient_user_id)
with check ((select auth.uid()) = recipient_user_id);
