-- Additive, non-destructive validation and approval safeguards for KhelGrid listing data.
-- Defense-in-depth for KhelGrid trials and opportunities.
-- Additive and non-destructive. NOT VALID constraints protect new writes without failing
-- deployment because of historical rows; validate legacy data in a separate cleanup phase.

ALTER TABLE public.trials
  ADD CONSTRAINT trials_title_nonblank CHECK (length(btrim(title)) > 0) NOT VALID,
  ADD CONSTRAINT trials_academy_nonblank CHECK (length(btrim(academy_name)) > 0) NOT VALID,
  ADD CONSTRAINT trials_sport_nonblank CHECK (length(btrim(sport)) > 0) NOT VALID,
  ADD CONSTRAINT trials_city_nonblank CHECK (length(btrim(city)) > 0) NOT VALID,
  ADD CONSTRAINT trials_source_url_http CHECK (source_url IS NULL OR source_url ~* '^https?://[^[:space:]]+$') NOT VALID,
  ADD CONSTRAINT trials_apply_url_http CHECK (apply_url IS NULL OR apply_url ~* '^https?://[^[:space:]]+$') NOT VALID,
  ADD CONSTRAINT trials_spots_consistent CHECK (spots_available <= spots_total) NOT VALID,
  ADD CONSTRAINT trials_not_fallback_date CHECK (trial_date <> DATE '2026-12-31') NOT VALID;

ALTER TABLE public.opportunities
  ADD CONSTRAINT opportunities_title_nonblank CHECK (length(btrim(title)) > 0) NOT VALID,
  ADD CONSTRAINT opportunities_source_url_http CHECK (source_url IS NULL OR source_url ~* '^https?://[^[:space:]]+$') NOT VALID,
  ADD CONSTRAINT opportunities_dates_ordered CHECK (start_at IS NULL OR end_at IS NULL OR end_at >= start_at) NOT VALID,
  ADD CONSTRAINT opportunities_capacity_nonnegative CHECK (capacity IS NULL OR capacity >= 0) NOT VALID,
  ADD CONSTRAINT opportunities_fee_nonnegative CHECK (fee >= 0) NOT VALID;

-- Do not allow public/ordinary authenticated clients to approve records merely by
-- writing review_status='approved'. Service-role automation and actual profile admins
-- may approve; AI/import agents should use service-role only for intake, leaving
-- records at needs_review unless a human-admin approval action is intended.
CREATE OR REPLACE FUNCTION public.khelgrid_guard_listing_review_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  is_service_role boolean := coalesce(auth.role(), '') = 'service_role';
  is_profile_admin boolean := false;
BEGIN
  IF NEW.review_status = 'approved'
     AND (TG_OP = 'INSERT' OR OLD.review_status IS DISTINCT FROM NEW.review_status) THEN
    IF auth.uid() IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      ) INTO is_profile_admin;
    END IF;

    IF NOT is_service_role AND NOT is_profile_admin THEN
      RAISE EXCEPTION 'Only an authorized KhelGrid administrator may approve trial/opportunity listings'
        USING ERRCODE = '42501';
    END IF;

    IF NULLIF(btrim(NEW.source_url), '') IS NULL THEN
      RAISE EXCEPTION 'A source_url is required before a listing can be approved'
        USING ERRCODE = '23514';
    END IF;

    IF NEW.last_verified IS NULL THEN
      RAISE EXCEPTION 'last_verified must be set before a listing can be approved'
        USING ERRCODE = '23514';
    END IF;

    IF TG_TABLE_NAME = 'trials' AND NEW.trial_date = DATE '2026-12-31' THEN
      RAISE EXCEPTION 'Fallback trial date must be confirmed before approval'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trials_guard_review_approval ON public.trials;
CREATE TRIGGER trials_guard_review_approval
BEFORE INSERT OR UPDATE OF review_status ON public.trials
FOR EACH ROW EXECUTE FUNCTION public.khelgrid_guard_listing_review_approval();

DROP TRIGGER IF EXISTS opportunities_guard_review_approval ON public.opportunities;
CREATE TRIGGER opportunities_guard_review_approval
BEFORE INSERT OR UPDATE OF review_status ON public.opportunities
FOR EACH ROW EXECUTE FUNCTION public.khelgrid_guard_listing_review_approval();

COMMENT ON FUNCTION public.khelgrid_guard_listing_review_approval() IS
'Prevents unauthorized or source-less approval of KhelGrid trial and opportunity records.';

