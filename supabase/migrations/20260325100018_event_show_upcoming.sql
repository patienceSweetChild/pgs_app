-- Toggle: show Upcoming Sessions block on the event session page
alter table public.events
  add column if not exists show_upcoming_sessions boolean not null default true;

comment on column public.events.show_upcoming_sessions is
  'When true, the session detail page shows the Upcoming Sessions carousel.';
