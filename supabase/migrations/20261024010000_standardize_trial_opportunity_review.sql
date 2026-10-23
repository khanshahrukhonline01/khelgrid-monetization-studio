-- Additive, provider-portable review/provenance fields for trials and opportunities.
-- Existing records are preserved. Apply once to the Supabase PostgreSQL database.
-- If migrating providers, translate this SQL to the destination's migration format and test first.

ALTER TABLE public.trials
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'needs_review',
  ADD COLUMN IF NOT EXISTS review_notes text;

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_label text,
  ADD COLUMN IF NOT EXISTS last_verified timestamptz,
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'needs_review',
  ADD COLUMN IF NOT EXISTS review_notes text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'trials_review_status_check') THEN
    ALTER TABLE public.trials ADD CONSTRAINT trials_review_status_check
      CHECK (review_status IN ('needs_review', 'approved', 'rejected', 'expired'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_review_status_check') THEN
    ALTER TABLE public.opportunities ADD CONSTRAINT opportunities_review_status_check
      CHECK (review_status IN ('needs_review', 'approved', 'rejected', 'expired'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS trials_external_id_unique
  ON public.trials (external_id) WHERE external_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS opportunities_external_id_unique
  ON public.opportunities (external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS trials_review_status_date_idx
  ON public.trials (review_status, trial_date);
CREATE INDEX IF NOT EXISTS opportunities_review_status_deadline_idx
  ON public.opportunities (review_status, registration_deadline);

UPDATE public.trials
SET review_notes = concat_ws('; ',
  CASE WHEN NULLIF(btrim(source_url), '') IS NULL THEN 'Missing source URL' END,
  CASE WHEN last_verified IS NULL THEN 'No verification timestamp' END,
  CASE WHEN trial_date = DATE '2026-12-31' THEN 'Fallback date needs confirmation' END
)
WHERE review_status = 'needs_review'
  AND (NULLIF(btrim(source_url), '') IS NULL OR last_verified IS NULL OR trial_date = DATE '2026-12-31');
