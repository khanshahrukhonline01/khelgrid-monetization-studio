-- Phase 1: normalize court pricing and operating-hour data.
-- Existing rows are preserved; missing schedules/prices remain unpublished rather than guessed.
ALTER TABLE public.venue_courts
  ADD COLUMN IF NOT EXISTS operating_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS booking_enabled boolean NOT NULL DEFAULT false;

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS pricing_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS operating_hours_verified_at timestamptz;

ALTER TABLE public.venue_courts
  DROP CONSTRAINT IF EXISTS venue_courts_price_per_hour_positive;
ALTER TABLE public.venue_courts
  ADD CONSTRAINT venue_courts_price_per_hour_positive
  CHECK (price_per_hour IS NULL OR price_per_hour > 0);

ALTER TABLE public.venue_courts
  DROP CONSTRAINT IF EXISTS venue_courts_booking_requires_price;
ALTER TABLE public.venue_courts
  ADD CONSTRAINT venue_courts_booking_requires_price
  CHECK (booking_enabled = false OR (is_active = true AND price_per_hour IS NOT NULL AND price_per_hour > 0));

CREATE OR REPLACE FUNCTION public.validate_venue_operating_hours(p_hours jsonb)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_day text;
  v_day_hours jsonb;
  v_open text;
  v_close text;
BEGIN
  IF p_hours IS NULL OR p_hours = '{}'::jsonb THEN
    RETURN true; -- Empty schedule means hours are not yet supplied; booking must treat as unverified.
  END IF;
  IF jsonb_typeof(p_hours) <> 'object' THEN RETURN false; END IF;

  FOR v_day, v_day_hours IN SELECT key, value FROM jsonb_each(p_hours)
  LOOP
    IF v_day NOT IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday') THEN
      RETURN false;
    END IF;
    IF jsonb_typeof(v_day_hours) <> 'object' THEN RETURN false; END IF;
    IF COALESCE((v_day_hours->>'closed')::boolean, false) THEN
      CONTINUE;
    END IF;
    v_open := v_day_hours->>'open';
    v_close := v_day_hours->>'close';
    IF v_open IS NULL OR v_close IS NULL
       OR v_open !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
       OR v_close !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
       OR v_close <= v_open THEN
      RETURN false;
    END IF;
  END LOOP;
  RETURN true;
EXCEPTION WHEN others THEN
  RETURN false;
END;
$$;

ALTER TABLE public.venue_courts
  DROP CONSTRAINT IF EXISTS venue_courts_operating_hours_valid;
ALTER TABLE public.venue_courts
  ADD CONSTRAINT venue_courts_operating_hours_valid
  CHECK (public.validate_venue_operating_hours(operating_hours));

ALTER TABLE public.venues
  DROP CONSTRAINT IF EXISTS venues_operating_hours_valid;
ALTER TABLE public.venues
  ADD CONSTRAINT venues_operating_hours_valid
  CHECK (public.validate_venue_operating_hours(operating_hours));

CREATE INDEX IF NOT EXISTS venue_courts_bookable_idx
  ON public.venue_courts (venue_id, sport) WHERE is_active = true AND booking_enabled = true;

COMMENT ON COLUMN public.venue_courts.price_per_hour IS 'Verified court-specific hourly rate. NULL means no published rate; never display as free.';
COMMENT ON COLUMN public.venue_courts.operating_hours IS 'JSON object keyed by lowercase weekday, e.g. {"monday":{"open":"06:00","close":"22:00"},"sunday":{"closed":true}}. Empty means not supplied.';
COMMENT ON COLUMN public.venue_courts.booking_enabled IS 'Explicit publication switch. Requires active court and positive court-specific hourly price.';
COMMENT ON COLUMN public.venues.pricing_verified_at IS 'Set only after venue-level pricing has been checked against an authoritative owner/source.';
COMMENT ON COLUMN public.venues.operating_hours_verified_at IS 'Set only after venue operating hours have been confirmed.';
