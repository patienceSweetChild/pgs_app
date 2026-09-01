-- Allow CMS content staff to create media_assets (storage already allows content.manage)
drop policy if exists media_assets_staff_write on public.media_assets;

create policy media_assets_staff_write on public.media_assets
  for all to authenticated
  using (
    public.staff_has_permission('catalog.manage')
    or public.staff_has_permission('content.manage')
    or public.staff_has_permission('cms.publish')
  )
  with check (
    public.staff_has_permission('catalog.manage')
    or public.staff_has_permission('content.manage')
    or public.staff_has_permission('cms.publish')
  );
