-- Course page blocks + saved-card chrome (mirrors event page blocks / card chrome)
alter table public.courses
  add column if not exists section_labels jsonb not null default '{}'::jsonb,
  add column if not exists benefits_aside text not null default '',
  add column if not exists brochure_title text not null default '',
  add column if not exists brochure_body text not null default '',
  add column if not exists brochure_badge text not null default '',
  add column if not exists gallery_image_1_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists gallery_image_2_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists gallery_image_3_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists accreditation_logos text not null default '',
  add column if not exists card_dates_rail text not null default '',
  add column if not exists card_promo_title text not null default '',
  add column if not exists card_promo_subtitle text not null default '',
  add column if not exists card_promo_date text not null default '',
  add column if not exists card_cta_label text not null default '';

comment on column public.courses.section_labels is
  'Editable section heading overrides shown on the public Programsfull page.';
comment on column public.courses.benefits_aside is
  'Aside copy beside the benefits list.';
comment on column public.courses.brochure_title is
  'Title for the downloadable brochure block.';
comment on column public.courses.brochure_body is
  'Body copy for the downloadable brochure block.';
comment on column public.courses.brochure_badge is
  'Badge text on the brochure block.';
comment on column public.courses.gallery_image_1_asset_id is
  'First Programsfull gallery image.';
comment on column public.courses.gallery_image_2_asset_id is
  'Second Programsfull gallery image.';
comment on column public.courses.gallery_image_3_asset_id is
  'Third Programsfull gallery image.';
comment on column public.courses.accreditation_logos is
  'Accreditation logo image URLs (one per line).';
comment on column public.courses.card_dates_rail is
  'Yellow vertical rail copy on saved program cards.';
comment on column public.courses.card_promo_title is
  'Promo badge title (e.g. Dates Extended). Use \\n for line breaks.';
comment on column public.courses.card_promo_subtitle is
  'Promo badge inner text (e.g. Check With US). Use \\n for line breaks.';
comment on column public.courses.card_promo_date is
  'Promo date under the badge; empty falls back to ends_on / starts_on.';
comment on column public.courses.card_cta_label is
  'Learn More (or custom) CTA label on cards.';
