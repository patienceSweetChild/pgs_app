-- Course detail page fields (OG Programsfull / program-detail)
alter table public.courses
  add column if not exists who_is_it_for text not null default '',
  add column if not exists session_topics text not null default '',
  add column if not exists highlight_1 text not null default '',
  add column if not exists highlight_2 text not null default '',
  add column if not exists highlight_3 text not null default '',
  add column if not exists highlight_4 text not null default '',
  add column if not exists booking_url text;
