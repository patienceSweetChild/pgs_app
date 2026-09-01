-- Per-event card / surface selection for CMS visual templates.
-- null/missing in app = treat as all (legacy). Explicit empty array = none selected.

alter table public.events
  add column if not exists card_surfaces text[] not null default array[
    'saved_program_full',
    'saved_promo',
    'saved_internship',
    'saved_program_compact',
    'add_to_calendar',
    'events_hero',
    'events_upcoming_card'
  ]::text[];

comment on column public.events.card_surfaces is
  'Which presentation surfaces this event uses: saved cards, add to calendar, events hero, upcoming card.';
