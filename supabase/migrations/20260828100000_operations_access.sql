-- Operations portal: permissions, assignment helpers, RPCs, RLS tightening

insert into public.staff_permissions (key, label, domain) values
  ('student_workspace.read_all', 'Read all student workspaces', 'students'),
  ('student_workspace.manage_all', 'Manage all student workspaces', 'students'),
  ('student_workspace.read', 'Read assigned student workspaces', 'students'),
  ('student_workspace.manage', 'Manage assigned student workspaces', 'students'),
  ('mentor_assignments.manage', 'Manage mentor assignments', 'students'),
  ('roles.manage', 'Manage staff roles', 'staff'),
  ('staff.read', 'Read staff directory', 'staff'),
  ('staff_targets.read', 'Read staff targets', 'ops'),
  ('staff_targets.manage', 'Manage own staff targets', 'ops'),
  ('staff_targets.manage_all', 'Manage all staff targets', 'ops')
on conflict (key) do nothing;

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'student_workspace.read_all','student_workspace.manage_all',
  'mentor_assignments.manage','roles.manage','staff.read',
  'staff_targets.read','staff_targets.manage','staff_targets.manage_all'
)
where r.key = 'super_admin'
on conflict do nothing;

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'student_workspace.read_all','student_workspace.manage_all',
  'mentor_assignments.manage','staff.read',
  'staff_targets.read','staff_targets.manage','staff_targets.manage_all'
)
where r.key = 'admin'
on conflict do nothing;

insert into public.staff_role_permissions (role_id, permission_id)
select r.id, p.id
from public.staff_roles r
join public.staff_permissions p on p.key in (
  'student_workspace.read','student_workspace.manage',
  'staff_targets.read','staff_targets.manage'
)
where r.key = 'mentor'
on conflict do nothing;

alter table public.mentor_assignments
  add column if not exists reason text,
  add column if not exists ended_by uuid references auth.users (id);

create unique index if not exists mentor_assignments_one_active_student_idx
  on public.mentor_assignments (student_id)
  where status = 'active';

create or replace function public.is_assigned_staff(
  target_student uuid,
  uid uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mentor_assignments ma
    where ma.student_id = target_student
      and ma.mentor_id = uid
      and ma.status = 'active'
  );
$$;

create or replace function public.is_assignable_handler(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles sp
    where sp.user_id = target_user
      and sp.status = 'active'
      and sp.role_key in ('mentor', 'admin', 'super_admin')
  );
$$;

create or replace function public.staff_can_view_student(
  target_student uuid,
  uid uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.student_has_active_premium(target_student)
    and (
      public.staff_has_permission('student_workspace.read_all', uid)
      or (
        public.staff_has_permission('student_workspace.read', uid)
        and public.is_assigned_staff(target_student, uid)
      )
      or public.staff_has_permission('students.manage', uid)
      or (
        public.staff_has_permission('students.manage_assigned', uid)
        and public.is_assigned_staff(target_student, uid)
      )
    );
$$;

create or replace function public.staff_can_manage_student(
  target_student uuid,
  uid uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.student_has_active_premium(target_student)
    and (
      public.staff_has_permission('student_workspace.manage_all', uid)
      or (
        public.staff_has_permission('student_workspace.manage', uid)
        and public.is_assigned_staff(target_student, uid)
      )
      or public.staff_has_permission('students.manage', uid)
      or (
        public.staff_has_permission('students.manage_assigned', uid)
        and public.is_assigned_staff(target_student, uid)
      )
    );
$$;

create or replace function public.write_ops_audit_event(
  p_event_type text,
  p_actor_user_id uuid,
  p_target_type text,
  p_target_id text,
  p_outcome text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  event_id uuid;
begin
  insert into public.audit_events (
    event_type,
    actor_user_id,
    actor_kind,
    target_type,
    target_id,
    outcome,
    source_subsystem,
    metadata
  ) values (
    p_event_type,
    p_actor_user_id,
    case when p_actor_user_id is null then 'system' else 'staff' end,
    p_target_type,
    p_target_id,
    p_outcome,
    'operations',
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into event_id;
  return event_id;
end;
$$;

create or replace function public.set_mentor_assignment(
  target_student uuid,
  target_mentor uuid,
  target_active boolean,
  event_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  assignment_id uuid;
  previous_mentor uuid;
begin
  if not public.staff_has_permission('mentor_assignments.manage') then
    raise exception 'forbidden';
  end if;
  if not exists (select 1 from public.profiles where id = target_student) then
    raise exception 'student not found';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_student::text, 0));

  select mentor_id into previous_mentor
  from public.mentor_assignments
  where student_id = target_student and status = 'active'
  for update;

  if target_active then
    if not public.student_has_active_premium(target_student) then
      raise exception 'active Premium required';
    end if;
    if not public.is_assignable_handler(target_mentor) then
      raise exception 'mentor unavailable';
    end if;
    if previous_mentor = target_mentor then
      select id into assignment_id
      from public.mentor_assignments
      where student_id = target_student and status = 'active'
      limit 1;
      return assignment_id;
    end if;
    if previous_mentor is not null then
      update public.mentor_assignments
      set status = 'ended',
          ended_at = now(),
          ended_by = auth.uid(),
          reason = coalesce(event_reason, reason)
      where student_id = target_student and status = 'active';
    end if;
    insert into public.mentor_assignments (
      mentor_id, student_id, assigned_by, status, reason
    ) values (
      target_mentor, target_student, auth.uid(), 'active', event_reason
    )
    returning id into assignment_id;
  else
    update public.mentor_assignments
    set status = 'ended',
        ended_at = now(),
        ended_by = auth.uid(),
        reason = event_reason
    where student_id = target_student
      and mentor_id = target_mentor
      and status = 'active'
    returning id into assignment_id;
    if assignment_id is null then
      raise exception 'active assignment not found';
    end if;
  end if;

  perform public.write_ops_audit_event(
    case when target_active then 'mentor.assigned' else 'mentor.unassigned' end,
    auth.uid(),
    'student',
    target_student::text,
    'succeeded',
    jsonb_build_object(
      'assignment_id', assignment_id,
      'mentor_id', target_mentor,
      'previous_mentor_id', previous_mentor,
      'reason', event_reason
    )
  );

  return assignment_id;
end;
$$;

create or replace function public.manage_staff_access(
  target_user uuid,
  target_role text,
  target_active boolean,
  target_status text default 'active',
  target_display_name text default '',
  event_reason text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_role_id uuid;
  assignment_id uuid;
  previous_role text;
  canonical_role text := case when target_role = 'viewer' then 'read_only_staff' else target_role end;
begin
  if not public.staff_has_permission('roles.manage') then
    raise exception 'forbidden';
  end if;
  if target_user = auth.uid() then
    raise exception 'self role changes are forbidden';
  end if;
  if target_status not in ('active', 'suspended', 'ended') then
    raise exception 'invalid staff status';
  end if;
  if canonical_role not in ('super_admin','admin','mentor','read_only_staff') then
    raise exception 'invalid staff role';
  end if;
  if not exists (select 1 from auth.users where id = target_user) then
    raise exception 'staff identity not found';
  end if;

  select role_key into previous_role
  from public.staff_profiles
  where user_id = target_user;

  if previous_role = 'super_admin'
    and target_active
    and (canonical_role <> 'super_admin' or target_status <> 'active')
    and not exists (
      select 1 from public.staff_profiles sp
      where sp.user_id <> target_user
        and sp.role_key = 'super_admin'
        and sp.status = 'active'
    ) then
    raise exception 'the final active super admin cannot be removed';
  end if;

  select id into selected_role_id
  from public.staff_roles
  where key = canonical_role;

  if target_active then
    insert into public.staff_profiles (user_id, role_key, display_name, status, created_by)
    values (
      target_user,
      canonical_role,
      left(trim(coalesce(target_display_name, '')), 255),
      target_status,
      auth.uid()
    )
    on conflict (user_id) do update set
      role_key = canonical_role,
      display_name = case
        when trim(coalesce(target_display_name, '')) <> ''
          then left(trim(target_display_name), 255)
        else public.staff_profiles.display_name
      end,
      status = target_status,
      updated_at = now();

    insert into public.staff_role_assignments (user_id, role_id, assigned_by)
    values (target_user, selected_role_id, auth.uid())
    on conflict (user_id, role_id) do nothing
    returning id into assignment_id;
  else
    update public.staff_profiles
    set status = 'ended', updated_at = now()
    where user_id = target_user;
    update public.mentor_assignments
    set status = 'ended', ended_at = now(), ended_by = auth.uid()
    where mentor_id = target_user and status = 'active';
  end if;

  perform public.write_ops_audit_event(
    case when target_active then 'staff.role_changed' else 'staff.access_revoked' end,
    auth.uid(),
    'staff_user',
    target_user::text,
    'succeeded',
    jsonb_build_object(
      'previous_role', previous_role,
      'new_role', canonical_role,
      'status', target_status,
      'reason', event_reason
    )
  );

  return coalesce(assignment_id, target_user);
end;
$$;

create or replace function public.staff_people_directory()
returns table (
  user_id uuid,
  display_name text,
  status text,
  role_key text,
  assigned_student_count integer,
  invite_pending boolean,
  has_student_profile boolean,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.staff_has_permission('staff.read') then
    raise exception 'forbidden';
  end if;

  return query
  select
    sp.user_id,
    sp.display_name,
    sp.status,
    sp.role_key,
    (
      select count(*)::integer
      from public.mentor_assignments ma
      where ma.mentor_id = sp.user_id and ma.status = 'active'
    ) as assigned_student_count,
    (
      sp.status = 'active'
      and u.email_confirmed_at is null
      and u.last_sign_in_at is null
      and not exists (select 1 from public.profiles p where p.id = sp.user_id)
    ) as invite_pending,
    exists (select 1 from public.profiles p where p.id = sp.user_id) as has_student_profile,
    sp.created_at
  from public.staff_profiles sp
  join auth.users u on u.id = sp.user_id
  order by lower(coalesce(sp.display_name, '')), sp.created_at desc;
end;
$$;

create or replace function public.staff_access_detail(target_user uuid)
returns table (
  user_id uuid,
  display_name text,
  status text,
  role_key text,
  assigned_student_count integer,
  invite_pending boolean,
  has_student_profile boolean,
  created_at timestamptz,
  permission_keys text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.staff_has_permission('staff.read') then
    raise exception 'forbidden';
  end if;

  return query
  select
    d.user_id,
    d.display_name,
    d.status,
    d.role_key,
    d.assigned_student_count,
    d.invite_pending,
    d.has_student_profile,
    d.created_at,
    coalesce((
      select array_agg(p.key order by p.key)
      from public.staff_roles r
      join public.staff_role_permissions srp on srp.role_id = r.id
      join public.staff_permissions p on p.id = srp.permission_id
      where r.key = d.role_key
    ), '{}'::text[]) as permission_keys
  from public.staff_people_directory() d
  where d.user_id = target_user;
end;
$$;

create or replace function public.staff_student_registry(
  search_text text default null,
  plan_filter text default null,
  mentor_filter text default null,
  crm_stage_filter text default null,
  page_offset integer default 0,
  page_size integer default 25
)
returns table (
  id uuid,
  full_name text,
  crm_stage text,
  preferred_study_country text,
  created_at timestamptz,
  plan text,
  mentor_name text,
  mentor_id uuid,
  can_open_workspace boolean,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  safe_offset integer := greatest(coalesce(page_offset, 0), 0);
  safe_limit integer := least(greatest(coalesce(page_size, 25), 1), 100);
  assigned_only boolean := false;
  allow_org_filters boolean := false;
  safe_search text := left(trim(coalesce(search_text, '')), 80);
begin
  if actor is null then
    raise exception 'not authorized';
  end if;

  if public.staff_has_permission('student_workspace.read_all') then
    assigned_only := false;
    allow_org_filters := true;
  elsif public.staff_has_permission('student_workspace.read')
    and exists (
      select 1 from public.staff_profiles sp
      where sp.user_id = actor and sp.role_key = 'mentor' and sp.status = 'active'
    ) then
    assigned_only := true;
  elsif public.staff_has_permission('students.read') then
    assigned_only := false;
  else
    raise exception 'not authorized';
  end if;

  return query
  with scoped as (
    select
      p.id,
      p.full_name,
      p.crm_stage,
      p.preferred_study_country,
      p.created_at,
      case when public.student_has_active_premium(p.id) then 'Premium' else 'Standard' end as plan,
      coalesce(mentor.display_name, 'Unassigned') as mentor_name,
      mentor.user_id as mentor_id,
      public.staff_can_view_student(p.id, actor) as can_open_workspace
    from public.profiles p
    left join lateral (
      select sp.display_name, sp.user_id
      from public.mentor_assignments ma
      join public.staff_profiles sp on sp.user_id = ma.mentor_id
      where ma.student_id = p.id and ma.status = 'active'
      order by ma.assigned_at desc
      limit 1
    ) mentor on true
    where (
      not assigned_only
      or exists (
        select 1 from public.mentor_assignments ma
        where ma.student_id = p.id and ma.mentor_id = actor and ma.status = 'active'
      )
    )
    and (
      safe_search = ''
      or p.full_name ilike '%' || safe_search || '%'
      or p.preferred_study_country ilike '%' || safe_search || '%'
    )
    and (
      plan_filter is null
      or plan_filter = 'all'
      or (plan_filter = 'premium' and public.student_has_active_premium(p.id))
      or (plan_filter = 'standard' and not public.student_has_active_premium(p.id))
    )
    and (
      not allow_org_filters
      or mentor_filter is null
      or mentor_filter = 'all'
      or (mentor_filter = 'unassigned' and mentor.user_id is null)
      or (mentor_filter = 'assigned' and mentor.user_id is not null)
      or mentor.user_id::text = mentor_filter
    )
    and (
      crm_stage_filter is null
      or crm_stage_filter = 'all'
      or p.crm_stage = crm_stage_filter
    )
  ),
  counted as (
    select s.*, count(*) over () as total_count
    from scoped s
    order by s.created_at desc
    offset safe_offset
    limit safe_limit
  )
  select * from counted;
end;
$$;

grant execute on function public.is_assigned_staff(uuid, uuid) to authenticated;
grant execute on function public.is_assignable_handler(uuid) to authenticated;
grant execute on function public.staff_can_view_student(uuid, uuid) to authenticated;
grant execute on function public.staff_can_manage_student(uuid, uuid) to authenticated;
grant execute on function public.set_mentor_assignment(uuid, uuid, boolean, text) to authenticated;
grant execute on function public.manage_staff_access(uuid, text, boolean, text, text, text) to authenticated;
grant execute on function public.staff_people_directory() to authenticated;
grant execute on function public.staff_access_detail(uuid) to authenticated;
grant execute on function public.staff_student_registry(text, text, text, text, integer, integer) to authenticated;

-- RLS tightening for assignment-scoped access
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (
    id = auth.uid()
    or public.staff_has_permission('students.read')
    or public.staff_has_permission('student_workspace.read_all')
    or (
      public.staff_has_permission('student_workspace.read')
      and public.is_assigned_staff(id)
    )
    or (
      public.staff_has_permission('students.manage_assigned')
      and public.is_assigned_staff(id)
    )
  );

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (
    id = auth.uid()
    or public.staff_has_permission('students.manage')
    or public.staff_has_permission('student_workspace.manage_all')
    or (
      public.staff_has_permission('student_workspace.manage')
      and public.is_assigned_staff(id)
    )
    or (
      public.staff_has_permission('students.manage_assigned')
      and public.is_assigned_staff(id)
    )
  )
  with check (
    id = auth.uid()
    or public.staff_has_permission('students.manage')
    or public.staff_has_permission('student_workspace.manage_all')
    or (
      public.staff_has_permission('student_workspace.manage')
      and public.is_assigned_staff(id)
    )
    or (
      public.staff_has_permission('students.manage_assigned')
      and public.is_assigned_staff(id)
    )
  );

drop policy if exists premium_workspace_select on public.premium_workspace_profiles;
create policy premium_workspace_select on public.premium_workspace_profiles
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  );

drop policy if exists premium_workspace_staff_write on public.premium_workspace_profiles;
create policy premium_workspace_staff_write on public.premium_workspace_profiles
  for all to authenticated
  using (public.staff_can_manage_student(student_id))
  with check (public.staff_can_manage_student(student_id));

drop policy if exists mentor_assignments_select on public.mentor_assignments;
create policy mentor_assignments_select on public.mentor_assignments
  for select to authenticated
  using (
    mentor_id = auth.uid()
    or student_id = auth.uid()
    or public.staff_has_permission('mentor_assignments.manage')
    or public.staff_has_permission('students.manage')
  );

drop policy if exists mentor_assignments_staff_write on public.mentor_assignments;
create policy mentor_assignments_staff_write on public.mentor_assignments
  for all to authenticated
  using (public.staff_has_permission('mentor_assignments.manage'))
  with check (public.staff_has_permission('mentor_assignments.manage'));

drop policy if exists staff_profiles_select on public.staff_profiles;
create policy staff_profiles_select on public.staff_profiles
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.staff_has_permission('staff.read')
    or public.staff_has_permission('roles.manage')
    or public.is_active_staff()
  );

drop policy if exists staff_profiles_manage on public.staff_profiles;
create policy staff_profiles_manage on public.staff_profiles
  for all to authenticated
  using (public.staff_has_permission('roles.manage'))
  with check (public.staff_has_permission('roles.manage'));

alter table public.audit_events enable row level security;
drop policy if exists audit_events_staff_read on public.audit_events;
create policy audit_events_staff_read on public.audit_events
  for select to authenticated
  using (public.staff_has_permission('audit.read'));

alter table public.staff_targets enable row level security;
drop policy if exists staff_targets_select on public.staff_targets;
create policy staff_targets_select on public.staff_targets
  for select to authenticated
  using (
    staff_user_id = auth.uid()
    or public.staff_has_permission('staff_targets.manage_all')
    or public.staff_has_permission('staff_targets.read')
  );

drop policy if exists staff_targets_write on public.staff_targets;
create policy staff_targets_write on public.staff_targets
  for all to authenticated
  using (
    (staff_user_id = auth.uid() and public.staff_has_permission('staff_targets.manage'))
    or public.staff_has_permission('staff_targets.manage_all')
  )
  with check (
    (staff_user_id = auth.uid() and public.staff_has_permission('staff_targets.manage'))
    or public.staff_has_permission('staff_targets.manage_all')
  );

grant execute on function public.write_ops_audit_event(text, uuid, text, text, text, jsonb) to authenticated;
