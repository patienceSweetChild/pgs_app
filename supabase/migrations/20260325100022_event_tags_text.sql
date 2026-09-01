-- Freeform multi-tags for events (newline-separated), matching courses.tags_text
alter table public.events
  add column if not exists tags_text text not null default '';
