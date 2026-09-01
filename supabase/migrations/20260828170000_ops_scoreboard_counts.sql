-- Fast scoreboard count for premium students without an active mentor assignment.

create or replace function public.ops_count_premium_unassigned()
returns bigint
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.staff_has_permission('student_workspace.read_all') then
    raise exception 'forbidden';
  end if;

  return (
    select count(distinct pe.student_id)::bigint
    from public.premium_entitlements pe
    where pe.status = 'active'
      and not exists (
        select 1
        from public.mentor_assignments ma
        where ma.student_id = pe.student_id
          and ma.status = 'active'
      )
  );
end;
$$;

grant execute on function public.ops_count_premium_unassigned() to authenticated;
