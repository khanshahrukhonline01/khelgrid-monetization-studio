-- ==============================================================================
-- Migration: 20261015000003_add_bcci_arunachal_ranji_trials_and_venues.sql
-- Description:
--   Adds backend trial record for BCCI to conduct trials to ensure Arunachal
--   Pradesh's Ranji participation (Ranji Trophy, Col. C.K. Nayudu, Senior Women's T20),
--   plus BCCI-recognized venues in Itanagar (Yupia Cricket Stadium and Rajiv Gandhi Stadium).
-- ==============================================================================

-- 1. Insert or update BCCI Arunachal Pradesh Ranji Trial Record
INSERT INTO public.trials (
  id,
  title,
  academy_name,
  sport,
  city,
  state,
  venue_name,
  trial_date,
  reporting_time,
  registration_deadline,
  fee,
  spots_total,
  spots_available,
  tag,
  age_category,
  gender,
  verified_label,
  urgency_text,
  badge,
  is_government_quota,
  apply_url,
  source_url,
  source_label,
  sources,
  timelines,
  organizer_contacts,
  eligibility,
  required_documents,
  selection_process,
  status
)
VALUES
  (
    't-bcci-arunachal-pradesh-ranji-trials-2026',
    'BCCI to Conduct Trials to Ensure Arunachal Pradesh''s Ranji Participation',
    'Board of Control for Cricket in India (BCCI)',
    'Cricket',
    'Itanagar',
    'Arunachal Pradesh',
    'Yupia Cricket Ground & Rajiv Gandhi Stadium, Itanagar, Arunachal Pradesh',
    '2026-11-01',
    '08:00 AM',
    '2026-10-31 23:59:00+00',
    0.00,
    80,
    80,
    'BCCI National State Combine',
    'Senior Men (Ranji Trophy), U-23 (C.K. Nayudu), Senior Women & Age Groups',
    'Men & Women',
    'Direct BCCI Apex Council & Independent Selection Committee',
    'BCCI Appointed Committee · Direct Open Trials to Field State Teams',
    'New',
    FALSE,
    'https://www.bcci.tv/domestic',
    'https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html',
    'Hindustan Times Sports / Official BCCI Domestic Notification',
    '[
      {"label": "Hindustan Times Special Report", "url": "https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html"},
      {"label": "BCCI Official Website (bcci.tv)", "url": "https://www.bcci.tv"},
      {"label": "BCCI Domestic Cricket Circulars", "url": "https://www.bcci.tv/domestic"}
    ]'::JSONB,
    '[
      {"label": "BCCI Open Call & Registration Window", "date": "Oct 15 - Oct 31, 2026", "description": "Open call advertised across public media by BCCI for cricketers with Arunachal Pradesh domicile / registration"},
      {"label": "Phase 1: Open Net Trials & Skill Assessment", "date": "Nov 01 - Nov 05, 2026", "description": "Independent Selection Committee (Satya Gopal Chakraborty, Jayanta Chowdhury, Deep Bora) evaluates players at Yupia Cricket Ground"},
      {"label": "Phase 2: Match Simulations & Fitness Screenings", "date": "Nov 07 - Nov 12, 2026", "description": "Intra-squad practice matches monitored by BCCI Apex Council Convener M. Khairul Jamal Majumdar"},
      {"label": "Final Ranji & State Squad Announcement", "date": "Nov 18, 2026", "description": "Official announcement of Arunachal Pradesh Senior Men Ranji Trophy and age-group squads to prevent tournament forfeit"}
    ]'::JSONB,
    '[
      {"title": "BCCI Independent Selection Committee Convener", "name": "M. Khairul Jamal Majumdar (BCCI Apex Council Member)", "email": "domesticcricket@bcci.tv", "phone": "+91 22 2289 8800"},
      {"title": "Selection Committee Chairman", "name": "Satya Gopal Chakraborty (Former Assam First-Class Cricketer)", "email": "operations@bcci.tv", "phone": "+91 360 221 2100"},
      {"title": "BCCI Headquarters", "name": "Cricket Centre, Wankhede Stadium, D-Road, Churchgate, Mumbai", "email": "contact@bcci.tv", "phone": "+91 22 6759 8800"}
    ]'::JSONB,
    'Open to all bona fide cricketers residing or studying in Arunachal Pradesh with valid Domicile / Permanent Resident Certificate (PRC) or prior state BCCI player registration. Trials cover multiple categories: Senior Men (Ranji Trophy), Men''s U-23 (Col. C.K. Nayudu Trophy), Senior Women''s T20, and Under-16/Under-19 junior tournaments. Selections are strictly merit-based, conducted directly by the BCCI-appointed independent 3-member panel to insulate players from local association administrative deadlocks.',
    ARRAY[
      'Permanent Resident Certificate (PRC) of Arunachal Pradesh / Domicile Certificate issued by District Commissioner',
      'Digitized Birth Certificate registered with statutory municipal/panchayat authority',
      'BCCI Player Registration Card / Prior State Representation Certificates (if applicable)',
      'Aadhaar Card / Government Photo ID Card (showing Arunachal Pradesh address)',
      'School / College Bonafide Certificate for age-group participants',
      'Medical Fitness Certificate from a certified physician',
      'Four passport-size color photographs in official cricket whites'
    ]::TEXT[],
    'Direct, neutral, transparent assessment by BCCI-appointed independent panel: 1) Open skill assessment nets for batting, pace bowling, spin bowling, and wicket-keeping; 2) Physical fitness and agility testing; 3) Multi-day practice match simulations at Yupia Cricket Stadium under BCCI Apex Council observers to select the official squads for the 2026–27 domestic season.',
    'active'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  academy_name = EXCLUDED.academy_name,
  sport = EXCLUDED.sport,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  venue_name = EXCLUDED.venue_name,
  trial_date = EXCLUDED.trial_date,
  reporting_time = EXCLUDED.reporting_time,
  registration_deadline = EXCLUDED.registration_deadline,
  fee = EXCLUDED.fee,
  spots_total = EXCLUDED.spots_total,
  spots_available = EXCLUDED.spots_available,
  tag = EXCLUDED.tag,
  age_category = EXCLUDED.age_category,
  gender = EXCLUDED.gender,
  verified_label = EXCLUDED.verified_label,
  urgency_text = EXCLUDED.urgency_text,
  badge = EXCLUDED.badge,
  is_government_quota = EXCLUDED.is_government_quota,
  apply_url = EXCLUDED.apply_url,
  source_url = EXCLUDED.source_url,
  source_label = EXCLUDED.source_label,
  sources = EXCLUDED.sources,
  timelines = EXCLUDED.timelines,
  organizer_contacts = EXCLUDED.organizer_contacts,
  eligibility = EXCLUDED.eligibility,
  required_documents = EXCLUDED.required_documents,
  selection_process = EXCLUDED.selection_process,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. Insert or update BCCI recognized venues in public.venues if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'venues') THEN
    INSERT INTO public.venues (
      id,
      name,
      area,
      city,
      distance_km,
      rating,
      reviews_count,
      sports,
      price_per_hour,
      featured,
      bookable,
      image_url
    )
    VALUES
      (
        'v-bcci-yupia-cricket-ground-itanagar',
        'Yupia Cricket Stadium & BCCI Regional Coaching Hub',
        'Yupia, Papum Pare District',
        'Itanagar',
        3.2,
        4.92,
        168,
        ARRAY['Cricket', 'Box Cricket', 'Net Practice', 'Fitness & Conditioning']::TEXT[],
        0.00,
        TRUE,
        TRUE,
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
      ),
      (
        'v-bcci-rajiv-gandhi-stadium-naharlagun',
        'Rajiv Gandhi Stadium BCCI Recognized Cricket Arena',
        'Naharlagun Sports Complex',
        'Itanagar',
        4.5,
        4.88,
        142,
        ARRAY['Cricket', 'Athletics', 'Fitness & Conditioning']::TEXT[],
        0.00,
        TRUE,
        TRUE,
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80'
      )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      area = EXCLUDED.area,
      city = EXCLUDED.city,
      rating = EXCLUDED.rating,
      reviews_count = EXCLUDED.reviews_count,
      sports = EXCLUDED.sports,
      price_per_hour = EXCLUDED.price_per_hour,
      featured = EXCLUDED.featured,
      bookable = EXCLUDED.bookable,
      image_url = EXCLUDED.image_url;
  END IF;
END $$;
