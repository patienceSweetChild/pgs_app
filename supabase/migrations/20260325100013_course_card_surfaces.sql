-- Per-course card / surface selection for CMS visual templates.
-- null/missing in app = treat as all (legacy). Explicit empty array = none selected.

alter table public.courses
  add column if not exists card_surfaces text[] not null default array[
    'saved_program_full',
    'saved_promo',
    'saved_internship',
    'saved_program_compact',
    'purpleboard',
    'purpleboard_closed',
    'featured_pick'
  ]::text[];

comment on column public.courses.card_surfaces is
  'Which presentation surfaces this course uses: saved cards, purple board, featured pick.';
