-- RPC used by auth experience, actor context, and admin/ops views.
-- Remote may already define this with a parameter default; drop first to avoid 42P13.
drop function if exists public.student_has_active_premium(uuid);

create or replace function public.student_has_active_premium(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.premium_entitlements pe
    where pe.student_id = uid
      and pe.status = 'active'
      and pe.ends_at > now()
  );
$$;

grant execute on function public.student_has_active_premium(uuid) to authenticated, anon;
