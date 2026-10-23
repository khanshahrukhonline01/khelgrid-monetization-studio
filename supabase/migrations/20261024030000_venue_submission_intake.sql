-- Venue intake foundation: public submissions are private until reviewed.
CREATE TABLE IF NOT EXISTS public.venue_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name text NOT NULL CHECK (length(btrim(venue_name)) BETWEEN 2 AND 160),
  city text NOT NULL CHECK (length(btrim(city)) BETWEEN 2 AND 100),
  area text NOT NULL CHECK (length(btrim(area)) BETWEEN 2 AND 120),
  sports text[] NOT NULL DEFAULT '{}' CHECK (cardinality(sports) BETWEEN 1 AND 20),
  contact_name text NOT NULL CHECK (length(btrim(contact_name)) BETWEEN 2 AND 120),
  contact_phone text NOT NULL CHECK (length(btrim(contact_phone)) BETWEEN 7 AND 30),
  contact_email text NOT NULL CHECK (contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  address text,
  website_url text CHECK (website_url IS NULL OR website_url ~* '^https?://[^[:space:]]+$'),
  opening_hours text,
  booking_method text NOT NULL DEFAULT 'WhatsApp or phone'
    CHECK (booking_method IN ('WhatsApp or phone','Online booking','Walk-in only','Other')),
  notes text CHECK (notes IS NULL OR length(notes) <= 3000),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_review','approved','rejected','needs_changes')),
  review_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS venue_submissions_status_created_idx
  ON public.venue_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS venue_submissions_city_idx
  ON public.venue_submissions (lower(city));

ALTER TABLE public.venue_submissions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.venue_submissions FROM PUBLIC, anon, authenticated;
GRANT INSERT ON TABLE public.venue_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.venue_submissions TO authenticated;

DROP POLICY IF EXISTS venue_submissions_public_submit ON public.venue_submissions;
CREATE POLICY venue_submissions_public_submit
  ON public.venue_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
    AND review_notes IS NULL
  );

DROP POLICY IF EXISTS venue_submissions_admin_read ON public.venue_submissions;
CREATE POLICY venue_submissions_admin_read
  ON public.venue_submissions FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
  ));

DROP POLICY IF EXISTS venue_submissions_admin_update ON public.venue_submissions;
CREATE POLICY venue_submissions_admin_update
  ON public.venue_submissions FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
  ));

CREATE OR REPLACE FUNCTION public.guard_venue_submission_review_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (
    NEW.status IS DISTINCT FROM OLD.status OR
    NEW.review_notes IS DISTINCT FROM OLD.review_notes OR
    NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by OR
    NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only a KhelGrid administrator can change venue submission review fields'
        USING ERRCODE = '42501';
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS venue_submission_review_guard ON public.venue_submissions;
CREATE TRIGGER venue_submission_review_guard
BEFORE UPDATE ON public.venue_submissions
FOR EACH ROW EXECUTE FUNCTION public.guard_venue_submission_review_fields();

COMMENT ON TABLE public.venue_submissions IS
'Private intake queue for venue owner submissions. Submissions are not public/bookable until reviewed and published to public.venues.';
