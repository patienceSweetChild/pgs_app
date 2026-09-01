-- Background image for the download/share poster block
alter table public.events
  add column if not exists poster_bg_asset_id uuid references public.media_assets (id) on delete set null;

comment on column public.events.poster_bg_asset_id is
  'Background image for the download/share poster (defaults to green-1.png).';
