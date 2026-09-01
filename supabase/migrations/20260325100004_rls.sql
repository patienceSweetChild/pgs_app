-- Row Level Security policies (default deny + explicit grants)

alter table public.profiles enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.staff_role_permissions enable row level security;
alter table public.staff_role_assignments enable row level security;
alter table public.media_assets enable row level security;
alter table public.course_categories enable row level security;
alter table public.event_categories enable row level security;
alter table public.courses enable row level security;
alter table public.events enable row level security;
alter table public.event_facilitators enable row level security;
alter table public.programs enable row level security;
alter table public.saved_courses enable row level security;
alter table public.saved_programs enable row level security;
alter table public.premium_plans enable row level security;
alter table public.premium_applications enable row level security;
alter table public.premium_entitlements enable row level security;
alter table public.premium_workspace_profiles enable row level security;
alter table public.mentor_assignments enable row level security;
alter table public.enquiries enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.student_guardian_relationships enable row level security;

-- Profiles
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.staff_has_permission('students.read'));

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.staff_has_permission('students.manage'))
  with check (id = auth.uid() or public.staff_has_permission('students.manage'));

-- Staff tables (read for active staff)
create policy staff_profiles_select on public.staff_profiles
  for select to authenticated
  using (user_id = auth.uid() or public.staff_has_permission('staff.manage') or public.is_active_staff());

create policy staff_profiles_manage on public.staff_profiles
  for all to authenticated
  using (public.staff_has_permission('staff.manage'))
  with check (public.staff_has_permission('staff.manage'));

create policy staff_roles_select on public.staff_roles
  for select to authenticated using (public.is_active_staff());

create policy staff_permissions_select on public.staff_permissions
  for select to authenticated using (public.is_active_staff());

create policy staff_role_permissions_select on public.staff_role_permissions
  for select to authenticated using (public.is_active_staff());

create policy staff_role_assignments_select on public.staff_role_assignments
  for select to authenticated
  using (user_id = auth.uid() or public.staff_has_permission('staff.manage'));

-- Catalog public read (published + live only)
create policy courses_public_select on public.courses
  for select to anon, authenticated
  using (
    (published = true and lifecycle_phase = 'live')
    or public.staff_has_permission('catalog.manage')
  );

create policy courses_staff_write on public.courses
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy events_public_select on public.events
  for select to anon, authenticated
  using (
    (published = true and lifecycle_phase = 'live')
    or public.staff_has_permission('catalog.manage')
  );

create policy events_staff_write on public.events
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy event_facilitators_public_select on public.event_facilitators
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = event_id
        and (
          (e.published = true and e.lifecycle_phase = 'live')
          or public.staff_has_permission('catalog.manage')
        )
    )
  );

create policy event_facilitators_staff_write on public.event_facilitators
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy programs_public_select on public.programs
  for select to anon, authenticated
  using (
    (published = true and lifecycle_phase = 'live')
    or public.staff_has_permission('catalog.manage')
  );

create policy programs_staff_write on public.programs
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy course_categories_public_select on public.course_categories
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));

create policy course_categories_staff_write on public.course_categories
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy event_categories_public_select on public.event_categories
  for select to anon, authenticated
  using (published = true or public.staff_has_permission('catalog.manage'));

create policy event_categories_staff_write on public.event_categories
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

create policy media_assets_select on public.media_assets
  for select to anon, authenticated using (true);

create policy media_assets_staff_write on public.media_assets
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));

-- Saves
create policy saved_courses_own on public.saved_courses
  for all to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy saved_programs_own on public.saved_programs
  for all to authenticated
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Premium
create policy premium_plans_select on public.premium_plans
  for select to authenticated using (active = true or public.staff_has_permission('premium.manage'));

create policy premium_applications_select on public.premium_applications
  for select to authenticated
  using (student_id = auth.uid() or public.staff_has_permission('premium.manage'));

create policy premium_applications_insert on public.premium_applications
  for insert to authenticated
  with check (student_id = auth.uid());

create policy premium_applications_staff_update on public.premium_applications
  for update to authenticated
  using (public.staff_has_permission('premium.manage'))
  with check (public.staff_has_permission('premium.manage'));

create policy premium_entitlements_select on public.premium_entitlements
  for select to authenticated
  using (student_id = auth.uid() or public.staff_has_permission('premium.manage'));

create policy premium_entitlements_staff_write on public.premium_entitlements
  for all to authenticated
  using (public.staff_has_permission('premium.manage'))
  with check (public.staff_has_permission('premium.manage'));

create policy premium_workspace_select on public.premium_workspace_profiles
  for select to authenticated
  using (
    student_id = auth.uid()
    or public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
  );

create policy premium_workspace_staff_write on public.premium_workspace_profiles
  for all to authenticated
  using (
    public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
  )
  with check (
    public.staff_has_permission('students.manage')
    or public.staff_has_permission('students.manage_assigned')
  );

create policy mentor_assignments_select on public.mentor_assignments
  for select to authenticated
  using (
    mentor_id = auth.uid()
    or student_id = auth.uid()
    or public.staff_has_permission('students.manage')
  );

create policy mentor_assignments_staff_write on public.mentor_assignments
  for all to authenticated
  using (public.staff_has_permission('students.manage'))
  with check (public.staff_has_permission('students.manage'));

-- Leads: anon insert, staff manage
create policy enquiries_insert on public.enquiries
  for insert to anon, authenticated
  with check (true);

create policy enquiries_staff on public.enquiries
  for select to authenticated
  using (public.staff_has_permission('leads.manage'));

create policy enquiries_staff_update on public.enquiries
  for update to authenticated
  using (public.staff_has_permission('leads.manage'))
  with check (public.staff_has_permission('leads.manage'));

create policy lead_submissions_insert on public.lead_submissions
  for insert to anon, authenticated
  with check (true);

create policy lead_submissions_staff on public.lead_submissions
  for select to authenticated
  using (public.staff_has_permission('leads.manage'));

-- Audit
create policy admin_audit_logs_select on public.admin_audit_logs
  for select to authenticated
  using (public.staff_has_permission('audit.read'));

create policy admin_audit_logs_insert on public.admin_audit_logs
  for insert to authenticated
  with check (public.is_active_staff());

-- Guardians: RLS on, no direct table policies for clients (RPC-only)
-- Staff may select/manage via permission for invite UI listing
create policy guardian_rels_staff_select on public.student_guardian_relationships
  for select to authenticated
  using (public.staff_has_permission('guardians.manage'));

create policy guardian_rels_staff_update on public.student_guardian_relationships
  for update to authenticated
  using (public.staff_has_permission('guardians.manage'))
  with check (public.staff_has_permission('guardians.manage'));
