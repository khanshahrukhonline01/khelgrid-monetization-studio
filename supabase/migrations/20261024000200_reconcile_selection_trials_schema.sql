-- Additive reconciliation for frontend-required trial fields.
-- Existing records are preserved; no mock or unverified trials are inserted.

ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS age_category text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS verified_label text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS urgency_text text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS timelines jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS organizer_contacts jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS apply_url text;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS is_government_quota boolean NOT NULL DEFAULT false;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS quota_details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS fts tsvector;

ALTER TABLE public.trial_applications ADD COLUMN IF NOT EXISTS sports_cv_data jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_trials_sport_city ON public.trials (sport, city);
CREATE INDEX IF NOT EXISTS idx_trials_trial_date ON public.trials (trial_date);
CREATE INDEX IF NOT EXISTS idx_trials_status_date ON public.trials (status, trial_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trials_venue_id ON public.trials (venue_id);
CREATE INDEX IF NOT EXISTS idx_trials_fts ON public.trials USING GIN (fts);
CREATE INDEX IF NOT EXISTS idx_trial_apps_trial_id ON public.trial_applications (trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_apps_user_id ON public.trial_applications (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_trial_apps_one_per_user_trial
  ON public.trial_applications (trial_id, user_id) WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.khelgrid_trials_search_vector()
RETURNS trigger LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  NEW.fts := to_tsvector('simple',
    coalesce(NEW.title,'') || ' ' || coalesce(NEW.academy_name,'') || ' ' ||
    coalesce(NEW.sport,'') || ' ' || coalesce(NEW.city,'') || ' ' || coalesce(NEW.state,''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_trials_search_vector ON public.trials;
CREATE TRIGGER set_trials_search_vector
BEFORE INSERT OR UPDATE OF title, academy_name, sport, city, state
ON public.trials FOR EACH ROW EXECUTE FUNCTION public.khelgrid_trials_search_vector();

UPDATE public.trials
SET fts = to_tsvector('simple',
    coalesce(title,'') || ' ' || coalesce(academy_name,'') || ' ' ||
    coalesce(sport,'') || ' ' || coalesce(city,'') || ' ' || coalesce(state,''))
WHERE fts IS NULL;

CREATE OR REPLACE FUNCTION public.khelgrid_trials_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_trials_updated_at ON public.trials;
CREATE TRIGGER set_trials_updated_at BEFORE UPDATE ON public.trials
FOR EACH ROW EXECUTE FUNCTION public.khelgrid_trials_set_updated_at();

DROP TRIGGER IF EXISTS set_trial_applications_updated_at ON public.trial_applications;
CREATE TRIGGER set_trial_applications_updated_at BEFORE UPDATE ON public.trial_applications
FOR EACH ROW EXECUTE FUNCTION public.khelgrid_trials_set_updated_at();

ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS trials_public_read ON public.trials;
CREATE POLICY trials_public_read ON public.trials
FOR SELECT TO anon, authenticated USING (deleted_at IS NULL);

DROP POLICY IF EXISTS trial_applications_owner_read ON public.trial_applications;
CREATE POLICY trial_applications_owner_read ON public.trial_applications
FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS trial_applications_owner_insert ON public.trial_applications;
CREATE POLICY trial_applications_owner_insert ON public.trial_applications
FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

GRANT SELECT ON public.trials TO anon, authenticated;
GRANT SELECT, INSERT ON public.trial_applications TO authenticated;
