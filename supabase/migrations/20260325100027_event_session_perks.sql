-- Session perks block between "What we cover" and Facilitators on the events page
alter table public.events
  add column if not exists benefits text not null default '',
  add column if not exists benefits_aside text not null default '';

comment on column public.events.benefits is
  'Checklist items beside the green aside (one per line).';
comment on column public.events.benefits_aside is
  'Green aside copy beside the session perks checklist (newlines become line breaks).';
