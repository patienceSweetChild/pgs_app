-- PurplePremium pathway pages CMS (mirrors countries page_content + cms_draft pattern)
CREATE TABLE IF NOT EXISTS pathways (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  template text NOT NULL CHECK (template IN ('medical', 'nonmedical')),
  published boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  page_content jsonb,
  cms_draft jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE pathways IS 'PurplePremium pathway landing pages (/pathways/[slug])';
COMMENT ON COLUMN pathways.page_content IS 'Published MedicalPathwayPageContent or NonMedicalPathwayPageContent JSON';
COMMENT ON COLUMN pathways.cms_draft IS 'WIP draft overlay when editing a live published pathway row';
