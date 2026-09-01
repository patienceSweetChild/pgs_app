-- Align course visual card_surfaces with the event template set.
alter table public.courses
  alter column card_surfaces set default array[
    'saved_program_full',
    'saved_promo',
    'saved_internship',
    'saved_program_compact',
    'add_to_calendar',
    'events_hero',
    'events_upcoming_card'
  ]::text[];

comment on column public.courses.card_surfaces is
  'Which presentation surfaces this course uses (same keys as events visual templates).';

-- Remap existing rows that still store the old purpleboard / featured keys.
update public.courses
set card_surfaces = array(
  select distinct mapped
  from unnest(card_surfaces) as old_key
  cross join lateral (
    select case old_key
      when 'purpleboard' then 'events_hero'
      when 'purpleboard_closed' then 'events_upcoming_card'
      when 'featured_pick' then 'add_to_calendar'
      when 'feed_chip' then 'add_to_calendar'
      else old_key
    end as mapped
  ) m
  where mapped in (
    'saved_program_full',
    'saved_promo',
    'saved_internship',
    'saved_program_compact',
    'add_to_calendar',
    'events_hero',
    'events_upcoming_card'
  )
)
where card_surfaces && array[
  'purpleboard',
  'purpleboard_closed',
  'featured_pick',
  'feed_chip'
]::text[];
