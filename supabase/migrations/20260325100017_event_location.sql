-- Event venue / location (separate from sticky note)
alter table public.events
  add column if not exists location text not null default '';

comment on column public.events.location is
  'Venue or location shown on event cards (e.g. Online, Zoom, campus).';
