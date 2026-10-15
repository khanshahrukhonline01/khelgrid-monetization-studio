-- ==============================================================================
-- Migration: 20261015000002_add_khel_maharan_assam_trial.sql
-- Description:
--   Adds backend trial record for Khel Maharan 3.0 (Government of Assam Department
--   of Sports & Youth Welfare) grassroots competitions commencing November 7, 2026
--   across all 35 districts of Assam, featuring Shoushab Krida Samaroh Under-12
--   scholarships and Open 12+ categories in 10 sports.
-- ==============================================================================

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
    't-khel-maharan-3-assam-2026',
    'Khel Maharan 3.0 to Begin on November 7, Registration Opens Across Assam',
    'Department of Sports & Youth Welfare, Government of Assam',
    'Athletics',
    'Guwahati',
    'Assam',
    'Gram Panchayat & Ward Grounds to Sarusajai Sports Complex & Indira Gandhi Athletic Stadium, Guwahati',
    '2026-11-07',
    '07:00 AM',
    '2026-11-06 23:59:00+00',
    0.00,
    15000,
    15000,
    'Assam Govt Grassroots Combine',
    'Under-12 (Shoushab Krida Samaroh with Scholarship) & 12+ Open Categories',
    'Boys & Girls / Men & Women',
    'Official Assam State Government Sports Initiative',
    'Competitions Begin Nov 7 · Free Registration Open Across All 35 Districts',
    'New',
    TRUE,
    'https://khelmaharan.com/khel',
    'https://www.nktv.in/khel-maharan-3-0-to-begin-on-november-7-registration-opens-across-assam/',
    'NKTV National News / Sports & Youth Welfare Govt of Assam',
    '[
      {"label": "NKTV News Report (Khel Maharan 3.0)", "url": "https://www.nktv.in/khel-maharan-3-0-to-begin-on-november-7-registration-opens-across-assam/"},
      {"label": "Khel Maharan Official Portal", "url": "https://khelmaharan.com/khel"},
      {"label": "Directorate of Sports & Youth Welfare Assam", "url": "https://dsya.assam.gov.in"}
    ]'::JSONB,
    '[
      {"label": "Statewide Online & Offline Registration", "date": "Oct 15 - Nov 06, 2026", "description": "Free registration on khelmaharan.com/khel and designated Gaon Panchayat / Ward offices across 35 districts"},
      {"label": "Gram Panchayat & Urban Ward Competitions (Level 1)", "date": "Nov 07 - Nov 18, 2026", "description": "Grassroots heats across all village panchayats and municipal wards in 10 sports disciplines"},
      {"label": "Assembly Constituency (LAC) Competitions (Level 2)", "date": "Nov 22 - Nov 30, 2026", "description": "Inter-panchayat winners battle for legislative constituency titles"},
      {"label": "District Championships (Level 3)", "date": "Dec 05 - Dec 15, 2026", "description": "Top athletes compete for district representation across all 35 districts of Assam"},
      {"label": "State Mega Finals & SAI Talent Scouting", "date": "Dec 20 - Dec 28, 2026", "description": "State Grand Finale at Sarusajai Sports Complex Guwahati, with SAI scouts & state scholarship distribution"}
    ]'::JSONB,
    '[
      {"title": "Directorate of Sports & Youth Welfare", "name": "Government of Assam, Dispur", "email": "dsyawassam@gmail.com", "phone": "+91 361 223 7277"},
      {"title": "Khel Maharan Central Helpdesk", "name": "Sarusajai Sports Complex, Guwahati, Assam", "email": "support@khelmaharan.com", "phone": "+91 361 213 0088"}
    ]'::JSONB,
    'Open to all permanent residents of Assam and students studying in recognized schools, colleges, and sports institutions across all 35 districts of Assam. Two primary streams: Khel Maharan for participants aged 12 and above, and Shoushab Krida Samaroh for children under 12 years (with special sports scholarships for grassroots talents). Participants can register in Athletics, Football, Volleyball, Kabaddi, Swimming, Chess, Cycling, Yogasana, Aquathlon, and Boxing.',
    ARRAY[
      'Aadhaar Card / Voter ID of Parent / Permanent Resident Certificate (PRC) of Assam',
      'Birth Certificate issued by Municipal / Village Registrar (compulsory for Under-12 Shoushab Krida Samaroh category)',
      'Student Bonafide Certificate / School Photo ID Card from an institution in Assam',
      'Medical Fitness Certificate from registered doctor (for contact sports: Boxing, Kabaddi, Aquathlon)',
      'Two recent passport-size color photographs',
      'Parent / Guardian consent declaration for participants under 18 years of age'
    ]::TEXT[],
    'Progressive multi-tier grassroots pyramid across Assam: 1) Gram Panchayat / Ward tournament heats -> 2) Legislative Assembly Constituency (LAC) championships -> 3) District championships across 35 districts -> 4) State Grand Finale at Sarusajai Sports Complex, Guwahati. State medalists and outstanding Under-12 athletes receive Assam Sports Scholarships, state academy berths, and direct scouting into Sports Authority of India (SAI) training centers.',
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
