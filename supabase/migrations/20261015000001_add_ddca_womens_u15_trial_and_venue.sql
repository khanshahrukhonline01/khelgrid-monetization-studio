-- ==============================================================================
-- Migration: 20261015000001_add_ddca_womens_u15_trial_and_venue.sql
-- Description:
--   Adds backend trial record for DDCA Invites Applications for Delhi Women’s
--   U-15 Team Open Trials for 2026–27 Season (State cricket trials at Arun Jaitley
--   Stadium & DDCA Ground, Delhi) and associates it with the DDCA venue record.
-- ==============================================================================

-- 1. Insert or update DDCA Delhi Women's U-15 Open Selection Trial record
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
    't-ddca-delhi-womens-u15-cricket-2026',
    'DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials for 2026–27 Season',
    'Delhi & District Cricket Association (DDCA)',
    'Cricket',
    'Delhi',
    'Delhi',
    'Arun Jaitley Stadium & DDCA Practice Complex, Feroz Shah Kotla, Delhi',
    '2026-11-05',
    '07:30 AM',
    '2026-11-02 23:59:00+00',
    0.00,
    60,
    60,
    'BCCI State Selection',
    'Women U-15 (Born 01-09-2011 to 31-08-2013)',
    'Women / Girls',
    'Verified DDCA State Cricket Circular',
    'Applications Open for 2026–27 Domestic Season · Closes Nov 2',
    'New',
    FALSE,
    'https://ddca.in',
    'https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820',
    'Deccan Chronicle / DDCA Official Circular',
    '[
      {"label": "Deccan Chronicle Official Report", "url": "https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820"},
      {"label": "DDCA Official Portal", "url": "https://ddca.in"}
    ]'::JSONB,
    '[
      {"label": "Registration & Application Window", "date": "Oct 15 - Nov 02, 2026", "description": "Submission of physical/online registration forms with digitized MCD birth certificate and school bonafide certificate"},
      {"label": "Document & Age Verification", "date": "Nov 03 - Nov 04, 2026", "description": "Verification of date of birth and Delhi NCR residency proofs by DDCA verification committee"},
      {"label": "Open Net Trials (Phase 1)", "date": "Nov 05 - Nov 10, 2026", "description": "Batting, bowling, and wicket-keeping skill tests under Junior Women Selection Committee at Arun Jaitley Stadium"},
      {"label": "Fitness Drills & Match Simulations (Phase 2)", "date": "Nov 12 - Nov 16, 2026", "description": "Yo-Yo and sprint tests, match simulations and tactical evaluation"},
      {"label": "Final Delhi U-15 Squad Announcement", "date": "Nov 20, 2026", "description": "Announcement of final Delhi team and reserves for BCCI Women''s U-15 One Day Trophy"}
    ]'::JSONB,
    '[
      {"title": "DDCA Cricket Operations", "name": "Junior Selection Committee, Delhi & District Cricket Association", "email": "cricketops@ddca.in", "phone": "+91 11 2331 9323"},
      {"title": "DDCA Stadium Office", "name": "Arun Jaitley Stadium, Feroz Shah Kotla Ground, Delhi", "email": "support@ddca.in", "phone": "+91 11 2331 4220"}
    ]'::JSONB,
    'Female cricketers born on or between 01-09-2011 and 31-08-2013 (U-15 category for BCCI Domestic Cricket Season 2026–27). Applicants must be studying in a recognized Delhi school or residing in Delhi NCR for at least 3 years with valid documentation.',
    ARRAY[
      'Digitized Birth Certificate issued by MCD / competent municipal authority (registered within 3 years of birth)',
      'School Bonafide Certificate / School Photo ID Card stating Date of Birth from a recognized Delhi school',
      'Address Proof of Delhi NCR (Aadhaar Card / Passport / Voter ID of parents)',
      'Medical Fitness Certificate from registered MBBS medical practitioner',
      'Four recent passport-size color photographs in cricket white kit',
      'Parent / Guardian consent declaration form for state trial participation'
    ]::TEXT[],
    'Open net trial evaluation by DDCA Junior Women Selection Committee covering batting technique, bowling accuracy/pace/spin, agility in wicket-keeping, followed by fitness screening and intra-squad practice matches at Arun Jaitley Stadium.',
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

-- 2. Insert or update DDCA Venue record in public.venues if table exists
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
    VALUES (
      'v-ddca-arun-jaitley-stadium-delhi',
      'Arun Jaitley Stadium & DDCA Cricket Complex',
      'Feroz Shah Kotla, Bahadur Shah Zafar Marg',
      'Delhi',
      0.8,
      4.96,
      520,
      ARRAY['Cricket', 'Box Cricket', 'Fitness & Conditioning', 'Net Practice']::TEXT[],
      0.00,
      TRUE,
      TRUE,
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80'
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
