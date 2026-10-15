-- ==============================================================================
-- Migration: 20261015000004_add_jk_kho_kho_selection_trials.sql
-- Description:
--   Adds backend trial record for J&K Kho-Kho Selection Trials on Oct 19 & 20
--   at Green Play Field, Gandhi Nagar, Jammu for the 45th Junior National Kho-Kho
--   Championship in Gujarat, plus Green Play Field venue record.
-- ==============================================================================

-- 1. Insert or update J&K Kho-Kho Junior National Trial Record
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
    't-jk-kho-kho-junior-national-trials-2026',
    'Kho-Kho Selection Trials on Oct 19 & 20 for 45th Junior National Championship',
    'Jammu and Kashmir Kho-Kho Association (JKKKA) & J&K Sports Council',
    'Kho-Kho',
    'Jammu',
    'Jammu & Kashmir',
    'Green Play Field, Gandhi Nagar, Jammu, Jammu & Kashmir',
    '2026-10-19',
    '02:30 PM',
    '2026-10-19 14:30:00+00',
    0.00,
    40,
    40,
    'State Junior National Selection',
    'Junior Boys & Girls (Born after Nov 25, 2008 / Under-18 as on 25-11-2026)',
    'Boys & Girls',
    'Official J&K Kho-Kho Association Circular',
    'Trials on Oct 19 & 20 at Green Play Field, Gandhi Nagar, Jammu · Report 2:30 PM',
    'New',
    FALSE,
    'https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/',
    'https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/',
    'Daily Excelsior Sports / J&K Kho-Kho Association',
    '[
      {"label": "Daily Excelsior Official News Report", "url": "https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/"},
      {"label": "Kho Kho Federation of India (KKFI)", "url": "https://khokho.org"},
      {"label": "J&K Sports Council", "url": "https://jksportscouncil.in"}
    ]'::JSONB,
    '[
      {"label": "Trial Reporting & District Verification", "date": "Oct 19, 2026 (2:30 PM)", "description": "Reporting of junior boys and girls with consent letters from affiliated district units at Green Play Field, Gandhi Nagar"},
      {"label": "Day 1: Speed, Agility & Running Screening", "date": "Oct 19, 2026", "description": "Dodging, chain formation, and sprint assessment under JKKKA selection committee"},
      {"label": "Day 2: Chasing Drills & Match Trials", "date": "Oct 20, 2026", "description": "Pole dives, sudden turns, tap drills, and match simulations"},
      {"label": "Coaching Camp & J&K Squad Departure", "date": "Nov 01 - Nov 18, 2026", "description": "Intensive coaching camp before participating in the 45th Junior National Kho-Kho Championship in Gujarat (Nov 21-25, 2026)"}
    ]'::JSONB,
    '[
      {"title": "General Secretary", "name": "Jammu and Kashmir Kho-Kho Association", "email": "jkkka.sports@gmail.com", "phone": "+91 191 243 0088"},
      {"title": "Venue Coordinator", "name": "Green Play Field Sports Office, Gandhi Nagar, Jammu", "email": "support@jksportscouncil.in", "phone": "+91 191 254 3945"}
    ]'::JSONB,
    'Open to junior boys and girls residing in Jammu and Kashmir. Participants must be below 18 years of age as of November 25, 2026 (born after 25-11-2008). Players must report with an official consent letter / nomination from their respective affiliated district Kho-Kho units. Selected players will represent Jammu & Kashmir UT in the 45th Junior National Kho-Kho Championship scheduled to be held in Gujarat from November 21 to 25, 2026.',
    ARRAY[
      'Consent letter from the affiliated district Kho-Kho unit of Jammu & Kashmir',
      'Digitized Birth Certificate / 10th Board Certificate proving age under 18 as on 25-11-2026',
      'Domicile Certificate / PRC of Jammu & Kashmir',
      'Aadhaar Card / Government Photo ID Card',
      'School / College Bonafide Certificate',
      'Four recent passport-size color photographs in sports kit',
      'Parent / Guardian consent declaration'
    ]::TEXT[],
    'Two-day state open selection trial evaluated by the JKKKA Technical Committee: Day 1 focuses on physical endurance, dodging agility, footwork speed, and running endurance. Day 2 features chasing techniques (pole dives, sky dives, sudden direction shifts) and full-length match trials at Green Play Field, Gandhi Nagar, Jammu. Top players advance to the official state coaching camp for the 45th Junior National Kho-Kho Championship in Gujarat.',
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

-- 2. Insert or update Green Play Field Jammu in public.venues if table exists
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
        'v-green-play-field-gandhi-nagar-jammu',
        'Green Play Field & Sports Arena',
        'Gandhi Nagar',
        'Jammu',
        1.8,
        4.90,
        128,
        ARRAY['Kho-Kho', 'Football', 'Athletics', 'Kabaddi', 'Volleyball']::TEXT[],
        0.00,
        TRUE,
        TRUE,
        'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=1200&q=80'
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
