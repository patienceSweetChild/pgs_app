-- Per-event page blocks: note roadmap, poster/share, highlights, CTA, FAQ, editable labels
alter table public.events
  add column if not exists roadmap_title text not null default '',
  add column if not exists roadmap_body text not null default '',
  add column if not exists roadmap_footer text not null default '',
  add column if not exists poster_title text not null default '',
  add column if not exists poster_body text not null default '',
  add column if not exists poster_invite_title text not null default '',
  add column if not exists poster_invite_body text not null default '',
  add column if not exists poster_live text not null default '',
  add column if not exists poster_topics text not null default '',
  add column if not exists poster_qr_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists highlight_heading text not null default '',
  add column if not exists highlight_title text not null default '',
  add column if not exists highlight_location text not null default '',
  add column if not exists highlight_body text not null default '',
  add column if not exists highlight_image_1_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists highlight_image_2_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists highlight_image_3_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists cta_eyebrow text not null default '',
  add column if not exists cta_title text not null default '',
  add column if not exists cta_body text not null default '',
  add column if not exists cta_button_label text not null default '',
  add column if not exists cta_button_href text not null default '',
  add column if not exists faq_items text not null default '',
  add column if not exists section_labels jsonb not null default '{}'::jsonb;

comment on column public.events.roadmap_title is
  'Title beside the sticky Note box on the session page.';
comment on column public.events.poster_qr_asset_id is
  'QR image shown on the download/share poster.';
comment on column public.events.faq_items is
  'FAQ lines: Question||Answer (one per line), same format as courses.';
comment on column public.events.section_labels is
  'Editable section heading overrides shown on the public events page.';
