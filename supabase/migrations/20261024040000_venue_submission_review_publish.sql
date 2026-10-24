-- Secure admin review and publication workflow for venue submissions.
CREATE OR REPLACE FUNCTION public.review_venue_submission(
  p_submission_id uuid,
  p_status text,
  p_review_notes text DEFAULT NULL,
  p_publish boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_submission public.venue_submissions%ROWTYPE;
  v_venue_id uuid;
  v_slug text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only a KhelGrid administrator can review venue submissions'
      USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('in_review','approved','rejected','needs_changes') THEN
    RAISE EXCEPTION 'Invalid review status' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_submission
  FROM public.venue_submissions
  WHERE id = p_submission_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Venue submission not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.venue_submissions
  SET status = p_status,
      review_notes = NULLIF(btrim(p_review_notes), ''),
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_submission_id;

  IF p_publish THEN
    IF p_status <> 'approved' THEN
      RAISE EXCEPTION 'A venue must be approved before publication' USING ERRCODE = '23514';
    END IF;
    IF v_submission.address IS NULL OR btrim(v_submission.address) = '' THEN
      RAISE EXCEPTION 'Add and verify the full address before publishing this venue' USING ERRCODE = '23514';
    END IF;
    IF v_submission.booking_method NOT IN ('Online booking','WhatsApp or phone') THEN
      RAISE EXCEPTION 'Confirm a supported booking method before publishing' USING ERRCODE = '23514';
    END IF;

    v_slug := trim(both '-' from regexp_replace(lower(v_submission.venue_name || '-' || v_submission.city || '-' || substr(v_submission.id::text,1,8)), '[^a-z0-9]+', '-', 'g'));
    INSERT INTO public.venues (
      name, slug, area, city, address, sports, price_per_hour, rating, reviews_count,
      featured, bookable, contact_phone, contact_email, operating_hours, booking_policies
    ) VALUES (
      v_submission.venue_name, v_slug, v_submission.area, v_submission.city,
      v_submission.address, v_submission.sports, 0, NULL, 0, false,
      true, v_submission.contact_phone, v_submission.contact_email,
      jsonb_build_object('description', COALESCE(v_submission.opening_hours, '')),
      jsonb_build_object('booking_method', v_submission.booking_method, 'requires_venue_confirmation', true)
    )
    RETURNING id INTO v_venue_id;
  END IF;

  RETURN v_venue_id;
END;
$$;

REVOKE ALL ON FUNCTION public.review_venue_submission(uuid,text,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_venue_submission(uuid,text,text,boolean) TO authenticated;
COMMENT ON FUNCTION public.review_venue_submission(uuid,text,text,boolean) IS
'Admin-only venue submission review and optional publication. Published venue has no guessed price/rating and requires address and supported booking method.';
