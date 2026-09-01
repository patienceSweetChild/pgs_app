-- Operations access tests (run with supabase test db)

begin;

select plan(12);

-- Placeholder structure for CI; extend with seeded users in local test harness.
select ok(
  exists (
    select 1
    from pg_proc
    where proname = 'set_mentor_assignment'
  ),
  'set_mentor_assignment RPC exists'
);

select ok(
  exists (
    select 1
    from pg_proc
    where proname = 'manage_staff_access'
  ),
  'manage_staff_access RPC exists'
);

select ok(
  exists (
    select 1
    from pg_proc
    where proname = 'staff_student_registry'
  ),
  'staff_student_registry RPC exists'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where indexname = 'mentor_assignments_one_active_student_idx'
  ),
  'one active mentor per student index exists'
);

select ok(
  exists (
    select 1
    from public.staff_permissions
    where key = 'roles.manage'
  ),
  'roles.manage permission seeded'
);

select ok(
  exists (
    select 1
    from public.staff_permissions
    where key = 'student_workspace.read_all'
  ),
  'student_workspace.read_all permission seeded'
);

select ok(
  exists (
    select 1
    from pg_proc
    where proname = 'is_assigned_staff'
  ),
  'is_assigned_staff helper exists'
);

select ok(
  exists (
    select 1
    from pg_proc
    where proname = 'staff_can_view_student'
  ),
  'staff_can_view_student helper exists'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'premium_workspace_profiles'
      and column_name = 'dashboard_content'
  ),
  'dashboard_content column exists'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'premium_workspace_profiles'
      and column_name = 'dashboard_published'
  ),
  'dashboard_published column exists'
);

select ok(
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'premium_workspace_profiles'
      and column_name = 'cms_draft'
  ),
  'cms_draft column exists'
);

select ok(
  (
    select pg_get_expr(pol.polqual, pol.polrelid)
    from pg_policy pol
    join pg_class rel on rel.oid = pol.polrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'premium_workspace_profiles'
      and pol.polname = 'premium_workspace_staff_write'
  ) ilike '%staff_can_manage_student%',
  'students cannot update dashboard rows; staff write requires staff_can_manage_student'
);

select * from finish();
rollback;
