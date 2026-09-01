-- Mini CRM for operations student/staff profile pages (adapted from pgs-v3)

alter table public.profiles
  add column if not exists crm_stream text,
  add column if not exists crm_target_year integer;

alter table public.profiles
  drop constraint if exists profiles_crm_stream_check,
  drop constraint if exists profiles_crm_target_year_check;

alter table public.profiles
  add constraint profiles_crm_stream_check
    check (crm_stream is null or crm_stream in ('USMLE','PLAB','AMC','STEM','MBA','Other')),
  add constraint profiles_crm_target_year_check
    check (crm_target_year is null or (crm_target_year >= 2000 and crm_target_year <= 2100));

create table if not exists public.student_crm_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 40),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 2 and 40),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.student_crm_tag_links (
  student_id uuid not null references public.profiles(id) on delete cascade,
  tag_id uuid not null references public.student_crm_tags(id) on delete cascade,
  attached_by uuid references auth.users(id) on delete set null,
  attached_at timestamptz not null default now(),
  primary key (student_id, tag_id)
);

create index if not exists student_crm_tag_links_tag_idx on public.student_crm_tag_links (tag_id);

alter table public.student_crm_tags enable row level security;
alter table public.student_crm_tag_links enable row level security;
revoke all on table public.student_crm_tags from public, anon, authenticated;
revoke all on table public.student_crm_tag_links from public, anon, authenticated;

create or replace function public.ops_crm_slug(raw text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(
    regexp_replace(regexp_replace(lower(trim(coalesce(raw, ''))), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'),
    ''
  );
$$;

create or replace function public.ops_crm_slug_is_reserved(slug text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select slug in ('premium','standard','assigned','unassigned','usmle','plab','amc','stem','mba','other')
    or slug ~ '^[0-9]{4}$';
$$;

create or replace function public.ops_can_access_registry_student(target_student uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null or target_student is null then
    return false;
  end if;
  if not exists (select 1 from public.profiles p where p.id = target_student) then
    return false;
  end if;
  if public.staff_has_permission('student_workspace.read_all', actor)
    or public.staff_has_permission('students.read', actor) then
    return true;
  end if;
  if public.staff_has_permission('student_workspace.read', actor)
    and public.is_assigned_staff(target_student, actor) then
    return true;
  end if;
  return false;
end;
$$;

create or replace function public.ops_can_mutate_student_crm(target_student uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
begin
  if actor is null or target_student is null then
    return false;
  end if;
  if not public.ops_can_access_registry_student(target_student) then
    return false;
  end if;
  if public.staff_has_permission('student_workspace.manage_all', actor) then
    return true;
  end if;
  if public.staff_has_permission('student_workspace.manage', actor)
    and public.is_assigned_staff(target_student, actor) then
    return true;
  end if;
  return false;
end;
$$;

create or replace function public.staff_student_crm_profile(target_student uuid)
returns table(
  id uuid,
  pgs_code text,
  full_name text,
  study_level text,
  preferred_study_country text,
  crm_stream text,
  crm_target_year integer,
  crm_stage text,
  created_at timestamptz,
  plan text,
  mentor_name text,
  mentor_id uuid,
  can_open_workspace boolean,
  can_mutate_crm boolean,
  tags jsonb
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.ops_can_access_registry_student(target_student) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  return query
  select
    p.id,
    coalesce(p.pgs_code, left(p.id::text, 8)),
    p.full_name,
    p.study_level,
    p.preferred_study_country,
    p.crm_stream,
    p.crm_target_year,
    coalesce(p.crm_stage, 'new'),
    p.created_at,
    case when public.student_has_active_premium(p.id) then 'Premium' else 'Standard' end,
    coalesce(mentor.display_name, 'Unassigned'),
    mentor.user_id,
    public.staff_can_view_student(p.id, auth.uid()),
    public.ops_can_mutate_student_crm(p.id),
    coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug) order by t.name)
      from public.student_crm_tag_links l
      join public.student_crm_tags t on t.id = l.tag_id
      where l.student_id = p.id
    ), '[]'::jsonb)
  from public.profiles p
  left join lateral (
    select sp.display_name, sp.user_id
    from public.mentor_assignments ma
    join public.staff_profiles sp on sp.user_id = ma.mentor_id
    where ma.student_id = p.id and ma.status = 'active'
    order by ma.assigned_at desc nulls last, ma.id desc
    limit 1
  ) mentor on true
  where p.id = target_student;
end;
$$;

create or replace function public.staff_list_student_crm_tags()
returns table(id uuid, name text, slug text)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.staff_has_permission('overview.read') then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  return query
  select t.id, t.name, t.slug
  from public.student_crm_tags t
  order by t.name;
end;
$$;

create or replace function public.set_student_crm_facts(
  target_student uuid,
  next_stream text default null,
  next_target_year integer default null,
  next_stage text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_stream text;
  current_year integer;
  current_stage text;
  safe_stream text;
  safe_year integer;
  safe_stage text;
begin
  if not public.ops_can_mutate_student_crm(target_student) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select p.crm_stream, p.crm_target_year, coalesce(p.crm_stage, 'new')
    into current_stream, current_year, current_stage
  from public.profiles p
  where p.id = target_student
  for update;
  if not found then
    raise exception 'student profile not found';
  end if;

  safe_stream := case
    when next_stream is null or btrim(next_stream) = '' then null
    when next_stream in ('USMLE','PLAB','AMC','STEM','MBA','Other') then next_stream
    else current_stream
  end;
  safe_year := case
    when next_target_year is null or next_target_year = 0 then null
    when next_target_year between 2000 and 2100 then next_target_year
    else current_year
  end;
  safe_stage := case
    when next_stage is null or btrim(next_stage) = '' then current_stage
    when next_stage in ('new','active','on_hold','closed') then next_stage
    else current_stage
  end;

  update public.profiles
  set crm_stream = safe_stream,
      crm_target_year = safe_year,
      crm_stage = safe_stage
  where id = target_student;

  if current_stage is distinct from safe_stage then
    perform public.write_ops_audit_event(
      'student.crm_stage_changed',
      auth.uid(),
      'student',
      target_student::text,
      'succeeded',
      jsonb_build_object('previous_status', current_stage, 'new_status', safe_stage)
    );
  end if;
end;
$$;

create or replace function public.create_student_crm_tag(tag_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  slug text;
  created uuid;
begin
  if not public.staff_has_permission('student_workspace.manage_all') then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  slug := public.ops_crm_slug(tag_name);
  if slug is null or char_length(slug) < 2 then
    raise exception 'invalid tag' using errcode = '22023';
  end if;
  if public.ops_crm_slug_is_reserved(slug) then
    raise exception 'reserved tag' using errcode = '22023';
  end if;
  insert into public.student_crm_tags(name, slug, created_by)
  values (btrim(tag_name), slug, auth.uid())
  returning id into created;
  return created;
exception
  when unique_violation then
    raise exception 'tag exists' using errcode = '23505';
end;
$$;

create or replace function public.attach_student_crm_tag(target_student uuid, target_tag uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.ops_can_mutate_student_crm(target_student) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if not exists (select 1 from public.student_crm_tags t where t.id = target_tag) then
    raise exception 'tag not found' using errcode = 'P0002';
  end if;
  insert into public.student_crm_tag_links(student_id, tag_id, attached_by)
  values (target_student, target_tag, auth.uid())
  on conflict do nothing;
end;
$$;

create or replace function public.detach_student_crm_tag(target_student uuid, target_tag uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.ops_can_mutate_student_crm(target_student) then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  delete from public.student_crm_tag_links
  where student_id = target_student
    and tag_id = target_tag;
end;
$$;

grant execute on function public.staff_student_crm_profile(uuid) to authenticated;
grant execute on function public.staff_list_student_crm_tags() to authenticated;
grant execute on function public.set_student_crm_facts(uuid, text, integer, text) to authenticated;
grant execute on function public.create_student_crm_tag(text) to authenticated;
grant execute on function public.attach_student_crm_tag(uuid, uuid) to authenticated;
grant execute on function public.detach_student_crm_tag(uuid, uuid) to authenticated;
