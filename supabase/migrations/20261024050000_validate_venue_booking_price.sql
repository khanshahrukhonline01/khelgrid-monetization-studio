-- Enforce server-side venue pricing and booking request validation.
-- Client-supplied totals are checked against published venue/court rates; no payment is taken here.
CREATE OR REPLACE FUNCTION public.book_venue_slot_atomic(
  p_venue_id uuid,
  p_court_id uuid,
  p_sport text,
  p_booking_date date,
  p_start_time time without time zone,
  p_end_time time without time zone,
  p_total_price numeric,
  p_user_email text,
  p_user_phone text,
  p_idempotency_key text,
  p_status text DEFAULT 'pending',
  p_custom_booking_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_booking public.venue_bookings%ROWTYPE;
  v_id uuid;
  v_venue_rate numeric;
  v_court_rate numeric;
  v_rate numeric;
  v_expected numeric;
  v_duration_hours numeric;
BEGIN
  IF p_booking_date < current_date
     OR p_end_time <= p_start_time
     OR p_total_price < 0
     OR p_idempotency_key IS NULL
     OR length(trim(p_idempotency_key)) < 8
     OR NULLIF(trim(p_sport), '') IS NULL
     OR (p_user_email IS NULL AND p_user_phone IS NULL) THEN
    RETURN jsonb_build_object('success',false,'error_code','invalid_request','message','Please check the date, time, contact details and booking request.');
  END IF;

  SELECT v.price_per_hour INTO v_venue_rate
  FROM public.venues v
  WHERE v.id = p_venue_id AND v.bookable = true AND v.deleted_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success',false,'error_code','venue_unavailable','message','This venue is not connected to live booking yet.');
  END IF;

  v_rate := v_venue_rate;
  IF p_court_id IS NOT NULL THEN
    SELECT c.price_per_hour INTO v_court_rate
    FROM public.venue_courts c
    WHERE c.id = p_court_id AND c.venue_id = p_venue_id AND c.is_active = true;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success',false,'error_code','court_unavailable','message','This court is not available for booking.');
    END IF;
    IF v_court_rate IS NOT NULL THEN v_rate := v_court_rate; END IF;
  END IF;

  IF v_rate IS NULL OR v_rate <= 0 THEN
    RETURN jsonb_build_object('success',false,'error_code','price_unavailable','message','This venue has not published a valid hourly price yet. No booking was created.');
  END IF;

  v_duration_hours := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 3600.0;
  IF v_duration_hours <= 0 OR v_duration_hours > 24 THEN
    RETURN jsonb_build_object('success',false,'error_code','invalid_duration','message','The selected booking duration is invalid.');
  END IF;

  v_expected := round(v_rate * v_duration_hours, 2);
  IF round(p_total_price, 2) <> v_expected THEN
    RETURN jsonb_build_object('success',false,'error_code','price_mismatch','expected_total',v_expected,'message','The displayed price has changed. Refresh venue pricing and try again.');
  END IF;

  SELECT * INTO v_booking
  FROM public.venue_bookings
  WHERE idempotency_key = p_idempotency_key
  LIMIT 1;
  IF FOUND THEN
    RETURN jsonb_build_object('success',true,'already_processed',true,'booking_id',v_booking.id,'status',v_booking.status,'total_price',v_booking.total_price,'held_until',v_booking.held_until,'message','This booking request was already processed.');
  END IF;

  BEGIN
    INSERT INTO public.venue_bookings(
      id,venue_id,court_id,user_id,user_email,user_phone,sport,booking_date,
      start_time,end_time,total_price,status,idempotency_key,held_until
    ) VALUES (
      COALESCE(p_custom_booking_id,gen_random_uuid()),p_venue_id,p_court_id,auth.uid(),
      NULLIF(trim(p_user_email),''),NULLIF(trim(p_user_phone),''),trim(p_sport),
      p_booking_date,p_start_time,p_end_time,v_expected,'pending',p_idempotency_key,NULL
    ) RETURNING id INTO v_id;
  EXCEPTION
    WHEN exclusion_violation THEN
      RETURN jsonb_build_object('success',false,'error_code','slot_conflict','message','This slot was just reserved by another player. Please select another slot.');
    WHEN unique_violation THEN
      SELECT * INTO v_booking FROM public.venue_bookings WHERE idempotency_key=p_idempotency_key LIMIT 1;
      IF FOUND THEN
        RETURN jsonb_build_object('success',true,'already_processed',true,'booking_id',v_booking.id,'status',v_booking.status,'total_price',v_booking.total_price,'held_until',v_booking.held_until,'message','This booking request was already processed.');
      END IF;
      RETURN jsonb_build_object('success',false,'error_code','duplicate_request','message','This booking request could not be processed twice.');
  END;

  RETURN jsonb_build_object('success',true,'booking_id',v_id,'status','pending','total_price',v_expected,'held_until',NULL,'message','Booking request recorded online; contact the venue to confirm acceptance.');
END;
$function$;

REVOKE ALL ON FUNCTION public.book_venue_slot_atomic(uuid,uuid,text,date,time without time zone,time without time zone,numeric,text,text,text,text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.book_venue_slot_atomic(uuid,uuid,text,date,time without time zone,time without time zone,numeric,text,text,text,text,uuid) TO authenticated;
COMMENT ON FUNCTION public.book_venue_slot_atomic(uuid,uuid,text,date,time without time zone,time without time zone,numeric,text,text,text,text,uuid) IS
'Atomically creates pending booking requests with server-validated published pricing, valid bookable venue/court checks, idempotency, and slot conflict handling. No payment is taken.';
