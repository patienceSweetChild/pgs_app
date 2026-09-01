-- Country page CMS: published content + draft overlay (mirrors events/courses cms_draft pattern)
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS page_content jsonb,
  ADD COLUMN IF NOT EXISTS cms_draft jsonb;

COMMENT ON COLUMN countries.page_content IS 'Published CountryPageContent JSON for /countries/[slug]';
COMMENT ON COLUMN countries.cms_draft IS 'WIP draft overlay when editing a live published country row';
