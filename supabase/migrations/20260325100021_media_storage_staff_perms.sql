-- Align media bucket write policies with media_assets staff write permissions
-- (catalog.manage | content.manage | cms.publish). Drop loose is_active_staff().

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
    )
  )
  with check (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.staff_has_permission('cms.publish')
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
    )
  );
