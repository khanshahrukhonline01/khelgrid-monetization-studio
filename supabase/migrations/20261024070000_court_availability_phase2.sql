-- Phase 2: court-specific availability and booking validation.
-- Applied to Supabase project kzklkkminrhjlmzupanl.
CREATE OR REPLACE FUNCTION public.get_venue_slot_availability(p_venue_id uuid,p_booking_date date,p_court_id uuid DEFAULT NULL)
RETURNS TABLE(court_id uuid,start_time time without time zone,end_time time without time zone,status text,is_held boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp
AS $body$
BEGIN
 RETURN QUERY
 SELECT b.court_id,b.start_time,b.end_time,b.status,
        (b.status='pending' AND b.held_until IS NOT NULL AND b.held_until>now())
 FROM public.venue_bookings b
 WHERE b.venue_id=p_venue_id AND b.booking_date=p_booking_date
   AND p_court_id IS NOT NULL AND b.court_id=p_court_id
   AND b.status IN ('pending','confirmed') AND b.deleted_at IS NULL
   AND (b.status='confirmed' OR (b.status='pending' AND b.held_until IS NOT NULL AND b.held_until>now()));
END;
$body$;

-- The booking RPC also requires a selected, enabled court; validates the published
-- court rate and verified venue operating hours; checks overlaps; and creates pending requests only.
-- Its current definition is verified directly in Supabase after migration application.
