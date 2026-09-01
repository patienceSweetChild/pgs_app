-- Guardian relationships + security-definer RPCs
create table public.student_guardian_relationships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  guardian_user_id uuid references auth.users (id) on delete set null,
  guardian_email text not null check (char_length(guardian_email) between 5 and 254),
  relationship_label text not null default 'Guardian'
    check (relationship_label in ('Parent','Mother','Father','Guardian','Other')),
  status text not null default 'invited' check (status in ('invited','active','revoked')),
  invited_by uuid references auth.users (id),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger student_guardian_relationships_set_updated_at
before update on public.student_guardian_relationships
for each row execute function public.set_updated_at();

create unique index student_guardian_email_active_uidx
  on public.student_guardian_relationships (student_id, lower(guardian_email))
  where status in ('invited','active');

create or replace function public.accept_pending_guardian_relationships()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
  caller uuid := auth.uid();
  caller_email text;
begin
  if caller is null then
    raise exception 'Not authenticated';
  end if;

  select lower(email) into caller_email from auth.users where id = caller;
  if caller_email is null then
    return 0;
  end if;

  update public.student_guardian_relationships
  set
    guardian_user_id = caller,
    status = 'active',
    accepted_at = coalesce(accepted_at, now()),
    updated_at = now()
  where status = 'invited'
    and lower(guardian_email) = caller_email
    and guardian_user_id is null;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

create or replace function public.guardian_list_students()
returns table (
  relationship_id uuid,
  student_id uuid,
  full_name text,
  relationship_label text,
  is_premium boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  return query
  select
    r.id,
    r.student_id,
    p.full_name,
    r.relationship_label,
    public.student_has_active_premium(r.student_id)
  from public.student_guardian_relationships r
  join public.profiles p on p.id = r.student_id
  where r.guardian_user_id = auth.uid()
    and r.status = 'active';
end;
$$;

create or replace function public.guardian_student_summary(p_student_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed boolean;
  result jsonb;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select exists (
    select 1 from public.student_guardian_relationships r
    where r.guardian_user_id = auth.uid()
      and r.student_id = p_student_id
      and r.status = 'active'
  ) into allowed;

  if not allowed then
    raise exception 'Forbidden';
  end if;

  select jsonb_build_object(
    'student', jsonb_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'crm_stream', p.crm_stream,
      'crm_stage', p.crm_stage,
      'preferred_study_country', p.preferred_study_country
    ),
    'premium', public.student_has_active_premium(p.id),
    'workspace', coalesce(to_jsonb(w), '{}'::jsonb)
  )
  into result
  from public.profiles p
  left join public.premium_workspace_profiles w on w.student_id = p.id
  where p.id = p_student_id;

  return coalesce(result, '{}'::jsonb);
end;
$$;

create or replace function public.staff_invite_guardian(
  p_student_id uuid,
  p_email text,
  p_label text default 'Guardian'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if not public.staff_has_permission('guardians.manage') then
    raise exception 'Forbidden';
  end if;

  insert into public.student_guardian_relationships (
    student_id, guardian_email, relationship_label, invited_by, status
  ) values (
    p_student_id, lower(trim(p_email)), coalesce(nullif(p_label, ''), 'Guardian'), auth.uid(), 'invited'
  )
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function public.accept_pending_guardian_relationships() to authenticated;
grant execute on function public.guardian_list_students() to authenticated;
grant execute on function public.guardian_student_summary(uuid) to authenticated;
grant execute on function public.staff_invite_guardian(uuid, text, text) to authenticated;
