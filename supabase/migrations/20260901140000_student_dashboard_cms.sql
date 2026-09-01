-- Per-student dashboard CMS: published snapshot + unpublished WIP draft.
-- Reuses premium_workspace_profiles RLS (student select own row; staff write via
-- staff_can_manage_student). Mentors need media upload for dashboard images.

alter table public.premium_workspace_profiles
  add column if not exists dashboard_content jsonb not null default '{}'::jsonb,
  add column if not exists dashboard_published boolean not null default false,
  add column if not exists cms_draft jsonb;

comment on column public.premium_workspace_profiles.dashboard_content is
  'Last published student dashboard document. Empty until first publish.';
comment on column public.premium_workspace_profiles.dashboard_published is
  'True when dashboard_content is live on /dashboard.';
comment on column public.premium_workspace_profiles.cms_draft is
  'Unpublished CMS WIP. Null when the editor matches the live snapshot.';

-- Workspace staff (admins + assigned mentors) may upload dashboard images.
drop policy if exists media_assets_staff_write on public.media_assets;
create policy media_assets_staff_write on public.media_assets
  for all to authenticated
  using (
    public.staff_has_permission('catalog.manage')
    or public.staff_has_permission('content.manage')
    or public.staff_has_permission('cms.publish')
    or public.staff_has_permission('student_workspace.manage')
    or public.staff_has_permission('student_workspace.manage_all')
    or public.staff_has_permission('students.manage')
  )
  with check (
    public.staff_has_permission('catalog.manage')
    or public.staff_has_permission('content.manage')
    or public.staff_has_permission('cms.publish')
    or public.staff_has_permission('student_workspace.manage')
    or public.staff_has_permission('student_workspace.manage_all')
    or public.staff_has_permission('students.manage')
  );

drop policy if exists "media_staff_insert" on storage.objects;
create policy "media_staff_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.staff_has_permission('cms.publish')
      or public.staff_has_permission('student_workspace.manage')
      or public.staff_has_permission('student_workspace.manage_all')
      or public.staff_has_permission('students.manage')
    )
  );

drop policy if exists "media_staff_update" on storage.objects;
create policy "media_staff_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.staff_has_permission('cms.publish')
      or public.staff_has_permission('student_workspace.manage')
      or public.staff_has_permission('student_workspace.manage_all')
      or public.staff_has_permission('students.manage')
    )
  )
  with check (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.staff_has_permission('cms.publish')
      or public.staff_has_permission('student_workspace.manage')
      or public.staff_has_permission('student_workspace.manage_all')
      or public.staff_has_permission('students.manage')
    )
  );

drop policy if exists "media_staff_delete" on storage.objects;
create policy "media_staff_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.staff_has_permission('cms.publish')
      or public.staff_has_permission('student_workspace.manage')
      or public.staff_has_permission('student_workspace.manage_all')
      or public.staff_has_permission('students.manage')
    )
  );
