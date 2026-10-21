-- Phase 1: venue owner submissions for KhelGrid discovery.
-- Public visitors may submit a listing for review, but cannot read or publish submissions.
CREATE TABLE IF NOT EXISTS public.venue_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name TEXT NOT NULL CHECK (char_length(trim(venue_name)) BETWEEN 2 AND 160),
  city TEXT NOT NULL CHECK (char_length(trim(city)) BETWEEN 2 AND 100),
  area TEXT NOT NULL CHECK (char_length(trim(area)) BETWEEN 2 AND 160),
  sports TEXT[] NOT NULL DEFAULT '{}',
  contact_name TEXT NOT NULL CHECK (char_length(trim(contact_name)) BETWEEN 2 AND 120),
  contact_phone TEXT NOT NULL CHECK (char_length(trim(contact_phone)) BETWEEN 7 AND 30),
  contact_email TEXT NOT NULL CHECK (char_length(trim(contact_email)) BETWEEN 5 AND 254),
  address TEXT,
  website_url TEXT,
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  opening_hours TEXT,
  booking_method TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_submissions_status_created
  ON public.venue_submissions (status, created_at DESC);

ALTER TABLE public.venue_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit venues for review" ON public.venue_submissions;
CREATE POLICY "Public can submit venues for review"
  ON public.venue_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND reviewed_by IS NULL AND reviewed_at IS NULL);

DROP POLICY IF EXISTS "Admins can review venue submissions" ON public.venue_submissions;
CREATE POLICY "Admins can review venue submissions"
  ON public.venue_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_current_user_admin());

DROP POLICY IF EXISTS "Admins can update venue submissions" ON public.venue_submissions;
CREATE POLICY "Admins can update venue submissions"
  ON public.venue_submissions
  FOR UPDATE
  TO authenticated
  USING (public.is_current_user_admin())
  WITH CHECK (public.is_current_user_admin());

COMMENT ON TABLE public.venue_submissions IS
  'Unpublished owner-submitted venue details awaiting KhelGrid moderation.';
