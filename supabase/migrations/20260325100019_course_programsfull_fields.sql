-- Programsfull course detail fields (Figma # programs full)
alter table public.courses
  add column if not exists program_type text not null default '',
  add column if not exists badge text not null default '',
  add column if not exists location text not null default '',
  add column if not exists headline text not null default '',
  add column if not exists hero_note text not null default '',
  add column if not exists session_time text not null default '',
  add column if not exists tags_text text not null default '',
  add column if not exists benefits text not null default '',
  add column if not exists partner_logo_asset_id uuid references public.media_assets (id) on delete set null;

comment on column public.courses.program_type is
  'Shown under partner logo as Type (e.g. Certificate).';
comment on column public.courses.badge is
  'Urgency chip on hero (e.g. Filling Fast).';
comment on column public.courses.location is
  'Venue line under Book Your Seat (e.g. RCSEd, Edinburgh).';
comment on column public.courses.headline is
  'Large subtitle beside the date boxes on the hero.';
comment on column public.courses.hero_note is
  'Small supporting line under the headline.';
comment on column public.courses.session_time is
  'Time label under start/end date boxes (e.g. 12pm to 2 pm).';
comment on column public.courses.tags_text is
  'Hero tag pills, one per line (e.g. #UK).';
comment on column public.courses.benefits is
  'Checklist under Program Highlights, one item per line.';
