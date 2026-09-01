-- Per-event testimonials shown on the session detail page
create table if not exists public.event_testimonials (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events (id) on delete cascade,
  name text not null,
  quote text not null default '',
  role text not null default '',
  location text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  display_order integer not null default 0
);

alter table public.event_testimonials enable row level security;

create policy event_testimonials_public_select on public.event_testimonials
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

create policy event_testimonials_staff_write on public.event_testimonials
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));
