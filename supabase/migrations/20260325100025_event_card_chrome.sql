-- Editable chrome on saved-list program cards (dates rail + promo box + CTA)
alter table public.events
  add column if not exists card_dates_rail text not null default '',
  add column if not exists card_promo_title text not null default '',
  add column if not exists card_promo_subtitle text not null default '',
  add column if not exists card_promo_date text not null default '',
  add column if not exists card_cta_label text not null default '';

comment on column public.events.card_dates_rail is
  'Yellow vertical rail copy on saved program cards.';
comment on column public.events.card_promo_title is
  'Promo badge title (e.g. Dates Extended). Use \\n for line breaks.';
comment on column public.events.card_promo_subtitle is
  'Promo badge inner text (e.g. Check With US). Use \\n for line breaks.';
comment on column public.events.card_promo_date is
  'Promo date under the badge; empty falls back to starts_at.';
comment on column public.events.card_cta_label is
  'Learn More (or custom) CTA label on cards.';
