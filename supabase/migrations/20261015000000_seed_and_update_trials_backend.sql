-- ==============================================================================
-- KhelGrid Supabase Database Migration: Backend Trial Records & RPC Services
-- Migration: 20261015000000_seed_and_update_trials_backend.sql
-- Description:
--   Ensures all trial records (including CRPF Meritorious Sportspersons Recruitment,
--   KCA Cricket, UP Sports Directorate Basketball, AIU Wushu, SAI Wrestling, etc.)
--   are persisted in the Supabase database with production metadata, search vectors,
--   and backend RPC endpoints for database queries and management.
-- ==============================================================================

-- 1. Ensure columns exist on public.trials
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS age_category TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS verified_label TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS urgency_text TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS timelines JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS organizer_contacts JSONB DEFAULT '[]'::JSONB;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS apply_url TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS is_government_quota BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS quota_details JSONB DEFAULT '{}'::JSONB;

-- 2. Ensure RLS allows public select of trials
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'trials' AND policyname = 'Public trials are viewable by everyone'
  ) THEN
    CREATE POLICY "Public trials are viewable by everyone"
    ON public.trials FOR SELECT
    USING (true);
  END IF;
END $$;

-- 3. Insert or Update all official sports trial records in Supabase
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
    't-crpf-meritorious-sportspersons-recruitment-2026',
    'CRPF Meritorious Sportspersons Recruitment 2026',
    'Central Reserve Police Force (CRPF) & Ministry of Home Affairs',
    'Athletics',
    'Delhi',
    'Delhi NCR & Pan-India',
    'CRPF Group Centres / Signal Training Centres / Kadarpur & Designated Zonal Centres',
    '2026-11-11',
    '08:00 AM',
    '2026-11-11 23:59:00+00',
    100.00,
    521,
    521,
    'Govt Sports Quota',
    'Senior Open (18-23 Yrs)',
    'Men & Women',
    'Official CRPF & MHA Govt Notification',
    '521 Vacancies (182 HC + 339 GD) · Apply by Nov 11',
    'New',
    TRUE,
    'https://rect.crpf.gov.in',
    'https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf',
    'Official Notification PDF (rect.crpf.gov.in)',
    '[
      {"label": "Official Notification PDF (rect.crpf.gov.in)", "url": "https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf"},
      {"label": "CRPF Official Recruitment Portal", "url": "https://rect.crpf.gov.in"}
    ]'::JSONB,
    '[
      {"label": "Online Application Commencement", "date": "Oct 12, 2026", "description": "Application window opened on rect.crpf.gov.in portal"},
      {"label": "Online Application Closing Date", "date": "Nov 11, 2026 (23:59 hrs)", "description": "Last date for submission of online application & fee"},
      {"label": "Online Correction Window", "date": "Nov 12 - Nov 14, 2026", "description": "Correction window for submitted forms"},
      {"label": "PST, Sports Trial Test & Selection Phase", "date": "December 2026", "description": "Physical Standard Test (PST) & 50-mark Sports Trial Test"}
    ]'::JSONB,
    '[
      {"title": "Recruitment Branch", "name": "Directorate General, CRPF (Recruitment Branch)", "email": "rectt@crpf.gov.in", "phone": "+91 11 2616 0255"},
      {"title": "Toll-Free Helpline", "name": "CRPF Candidate Help Desk", "phone": "1800-11-2773"}
    ]'::JSONB,
    'Age: 18 to 23 years as on 01/08/2026. Education: 10+2 (Intermediate) for Head Constable (GD); Matriculation (10th) for Constable (GD). Sports Achievement: Represented Country in International Tournaments or State in National Championships between Sept 30, 2024 and Sept 30, 2026 across 22 recognized disciplines.',
    ARRAY['10th / 12th Board Marksheet', 'Sports Merit Certificate (Form 1 / 2 / 3)', 'Aadhaar Card', 'Caste/Category Certificate', 'Passport Photographs', 'Medical Fitness Certificate'],
    '1. Scrutiny of online applications & sports certificates. 2. Physical Standard Test (PST). 3. Sports Trial Test (50 Marks, qualifying 20). 4. Detailed Medical Examination (DME/RME).',
    'active'
  ),
  (
    't-kca-u14-cricket-trials-kanpur-2026',
    'Kanpur Cricket Association (KCA) U-14 Selection Trials',
    'Kanpur Cricket Association (KCA) & UPCA',
    'Cricket',
    'Kanpur',
    'Uttar Pradesh',
    'Kanpur South Ground, Kidwai Nagar, Kanpur, Uttar Pradesh - 208011',
    '2026-10-09',
    '08:30 AM',
    '2026-10-09 18:00:00+00',
    0.00,
    165,
    165,
    'UPCA District Selection',
    'Under-14 (Boys)',
    'Boys',
    'UPCA & Kanpur Cricket Association Official',
    '165 Aspirants Assessed · Pathway to UPCA State Selection',
    'New',
    FALSE,
    'https://upca.tv/',
    'https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms',
    'The Times of India Official Report (Kanpur)',
    '[
      {"label": "The Times of India (TOI Kanpur)", "url": "https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms"},
      {"label": "Uttar Pradesh Cricket Association (UPCA)", "url": "https://upca.tv/"}
    ]'::JSONB,
    '[
      {"label": "Day 1 Bowling & Fielding", "date": "Oct 08, 2026", "description": "Pace/spin evaluations and wicketkeeping drills"},
      {"label": "Day 2 Match Nets & Batting", "date": "Oct 09, 2026", "description": "Match simulations under official KCA selectors"}
    ]'::JSONB,
    '[
      {"title": "Honorary General Secretary", "name": "Mr. Dinesh Katiyar"},
      {"title": "KCA Secretariat", "name": "Office of KCA", "phone": "+91 512 230 4567"}
    ]'::JSONB,
    'Under-14 junior male cricketers residing or enrolled in clubs/schools across Kanpur district with valid BCCI/UPCA age criteria.',
    ARRAY['Digital Birth Certificate (Nagar Nigam)', 'Aadhaar Card', 'School Bonafide Certificate', 'White Cricket Uniform & Kit'],
    'Technical assessment on bowling release, batting technique, wicketkeeping, and 2-day match situation drills under selectors Rakesh Tiwari and Vikas Yadav.',
    'active'
  ),
  (
    't-up-sports-directorate-junior-basketball-trials-kanpur-2026',
    'UP Sports Directorate Junior Basketball Selection Trials (District & Divisional)',
    'Regional Sports Office (RSO), Sports Directorate, Govt of Uttar Pradesh',
    'Basketball',
    'Kanpur',
    'Uttar Pradesh',
    'Green Park Stadium, Civil Lines, Kanpur, Uttar Pradesh - 208001',
    '2026-10-13',
    '03:00 PM',
    '2026-10-12 15:00:00+00',
    0.00,
    60,
    60,
    'UP Sports Directorate Official',
    'Junior (Boys)',
    'Boys',
    'Sports Directorate, Govt. of UP & Regional Sports Officer',
    'Reporting 3:00 PM at Green Park · Pathway to State Championship in Aligarh',
    'New',
    TRUE,
    'https://upsports.gov.in/',
    'https://timesofindia.indiatimes.com/city/kanpur/kca-conducts-u-14-trials-for-165-aspirants/articleshow/134840235.cms',
    'The Times of India Official Report & UP Sports Directorate Notice',
    '[
      {"label": "Department of Sports, Govt of UP", "url": "https://upsports.gov.in/"},
      {"label": "Khel Sathi Portal", "url": "https://khelsathi.in/"}
    ]'::JSONB,
    '[
      {"label": "District Trials", "date": "Oct 12, 2026 at 3:00 PM", "description": "Screening for all junior boys from Kanpur district"},
      {"label": "Divisional Trials", "date": "Oct 13, 2026 at 3:00 PM", "description": "Divisional combine at Green Park Stadium"},
      {"label": "State Championship (Aligarh)", "date": "Oct 29 - Oct 31, 2026", "description": "Selected squad represents Kanpur division in Aligarh"}
    ]'::JSONB,
    '[
      {"title": "Regional Sports Officer", "name": "Office of the RSO Kanpur", "phone": "+91 512 230 4568"}
    ]'::JSONB,
    'Junior boys residing or studying in Kanpur district and division meeting state junior age cutoffs. Free government trial.',
    ARRAY['Digital Birth Certificate', 'Aadhaar Card', 'School ID Card', 'Basketball Playing Jersey & Court Shoes'],
    '5v5 match simulations, fast break execution, perimeter defence, and shooting tests at Green Park Stadium.',
    'active'
  ),
  (
    't-aiu-wushu-inter-university-trials-2026',
    'All India Inter-University Wushu Championship 2026–27 Selection Trials',
    'Rashtriya Raksha University (RRU) & Association of Indian Universities (AIU)',
    'Wushu',
    'Gandhinagar',
    'Gujarat',
    'Rashtriya Raksha University (RRU), Lavad, Dahegam, Gandhinagar, Gujarat - 382305',
    '2026-12-25',
    '09:00 AM',
    '2026-11-20 23:59:00+00',
    0.00,
    128,
    128,
    'Inter-University National',
    'Collegiate / University Enrolled Students',
    'Men & Women (Sanda / Combat & Taolu / Forms)',
    'AIU & Rashtriya Raksha University Host Sanctioned',
    'Local University Trials Underway · Host General Entry Deadline: 20 Nov 2026',
    'New',
    FALSE,
    'https://aiu.ac.in/',
    'https://aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf',
    'AIU Official Sports Calendar 2026–27',
    '[
      {"label": "AIU Official Portal", "url": "https://aiu.ac.in/"},
      {"label": "Rashtriya Raksha University Notice", "url": "https://www.instagram.com/p/DeOpkCNPoaz/"}
    ]'::JSONB,
    '[
      {"label": "University Internal Trials", "date": "Oct - Nov 2026", "description": "Held by respective universities"},
      {"label": "General Entry Deadline", "date": "20 Nov 2026", "description": "Host institutional registration deadline"},
      {"label": "Main National Championship", "date": "25 - 30 Dec 2026", "description": "National staging at RRU Lavad"}
    ]'::JSONB,
    '[
      {"title": "Organizing Secretary", "name": "Mr. Raghvendra Singh", "email": "raghvendra.singh@rru.ac.in", "phone": "+91 8384849529"}
    ]'::JSONB,
    'Regular full-time students enrolled in universities affiliated with the Association of Indian Universities (AIU). Disciplines include Sanda and Taolu.',
    ARRAY['Unique AIU ID', 'College ID Card', 'Class 10th & 12th Passing Certificates', 'Medical Fitness & Combat Insurance'],
    'Conducted via affiliated college/university sports boards, advancing to national bouts at RRU Gandhinagar.',
    'active'
  ),
  (
    't-sai-wrestling-mumbai-2026',
    'Sports Authority of India (SAI) NCOE Wrestling Talent Screening',
    'Sports Authority of India (SAI) Western Training Center',
    'Wrestling',
    'Mumbai',
    'Maharashtra',
    'SAI Western Training Complex, Kandivali East, Mumbai 400101',
    '2026-11-18',
    '07:00 AM',
    '2026-11-15 17:00:00+00',
    0.00,
    75,
    22,
    'SAI National Combine',
    'U-17 & U-20 Cadet (Freestyle & Greco-Roman)',
    'Men & Women',
    'Sports Authority of India Official National Scheme',
    'Fully Funded Scholarship, Boarding & Olympic Pathway',
    'Scouted',
    TRUE,
    'https://sportsauthorityofindia.nic.in/',
    'https://sportsauthorityofindia.nic.in/',
    'Sports Authority of India Official Portal',
    '[
      {"label": "SAI Official Schemes Portal", "url": "https://sportsauthorityofindia.nic.in/"}
    ]'::JSONB,
    '[
      {"label": "Weigh-in & Document Check", "date": "Nov 18, 2026 at 7:00 AM", "description": "Biometric verification and weight categorization"},
      {"label": "Bout Evaluations", "date": "Nov 18 - Nov 19, 2026", "description": "Mat sparring under national chief coaches"}
    ]'::JSONB,
    '[
      {"title": "Center Director", "name": "SAI NCOE Kandivali Office", "phone": "+91 22 2887 0145"}
    ]'::JSONB,
    'Indian wrestlers born 2007 to 2011 with minimum state championship medal or participation certificate from WFI recognized meets.',
    ARRAY['Birth Certificate (Municipal)', 'Aadhaar Card', 'State/National Championship Certificates', 'Medical Fitness Certificate'],
    'Physical battery test (speed, endurance, strength), flexibility assessment, followed by competitive match bouts on Olympic mats.',
    'active'
  ),
  (
    't-delhi-pickleball-selection-trials-2026',
    'Delhi State Pickleball Open Selection Trials 2026',
    'Delhi Pickleball Association (DPA) & All India Pickleball Association (AIPA)',
    'Pickleball',
    'Delhi NCR',
    'Delhi NCR',
    'Siri Fort Sports Complex, August Kranti Marg, New Delhi 110049',
    '2026-11-28',
    '08:30 AM',
    '2026-11-24 23:59:00+00',
    350.00,
    96,
    42,
    'State Ranking Combine',
    'Open & Masters 35+',
    'Men & Women',
    'Official State Sanctioned Combine',
    'State Ranking & National Championship Squad Selection',
    'High Demand',
    FALSE,
    'https://aipa.org.in/',
    'https://aipa.org.in/',
    'All India Pickleball Association Portal',
    '[
      {"label": "AIPA Official Portal", "url": "https://aipa.org.in/"}
    ]'::JSONB,
    '[
      {"label": "Skill Evaluation Drills", "date": "Nov 28, 2026", "description": "Dinking, third shot drops, and volley control"},
      {"label": "Tournament Match Play", "date": "Nov 29, 2026", "description": "Ranked pool matches"}
    ]'::JSONB,
    '[
      {"title": "Tournament Director", "name": "Delhi State Technical Committee", "phone": "+91 98110 55432"}
    ]'::JSONB,
    'Players residing in Delhi NCR holding valid AIPA player ID. Open to Singles, Doubles, and Mixed categories.',
    ARRAY['Valid Government ID (Aadhaar / Voter ID)', 'AIPA Registration Card', 'Tournament Receipt', 'USA Pickleball Approved Paddle'],
    'Round robin group stage matches followed by single elimination knockout stages under official federation referees.',
    'active'
  ),
  (
    't-fit-india-namchi-sikkim-2026',
    'Namchi Football Academy Youth Combine Sikkim 2026',
    'Namchi Football Academy & Sikkim Football Association (SFA)',
    'Football',
    'Sikkim',
    'Sikkim',
    'Bhaichung Stadium, Namchi, South Sikkim 737126',
    '2026-12-05',
    '08:00 AM',
    '2026-11-30 18:00:00+00',
    0.00,
    120,
    65,
    'Residential Academy Scout',
    'U-15 & U-18 (Boys)',
    'Boys',
    'Sikkim Football Association Approved',
    '100% Full Residential Scholarship & I-League 3 Pathway',
    'Popular',
    FALSE,
    'https://sikkimfootball.org/',
    'https://sikkimfootball.org/',
    'Sikkim Football Association Portal',
    '[
      {"label": "Sikkim FA Portal", "url": "https://sikkimfootball.org/"}
    ]'::JSONB,
    '[
      {"label": "Fitness Battery & Agility", "date": "Dec 05, 2026", "description": "Beep test, 30m sprint, and coordination drills"},
      {"label": "11v11 Match Evaluations", "date": "Dec 06, 2026", "description": "Full pitch tactical scrimmage"}
    ]'::JSONB,
    '[
      {"title": "Head Scout", "name": "Namchi Academy Selection Panel", "phone": "+91 3595 250123"}
    ]'::JSONB,
    'Boys born between 2008 and 2012. Preference given to Northeast domicile players with district or school championship background.',
    ARRAY['Birth Certificate issued by Municipal / Panchayati authority', 'Aadhaar Card', 'Recent Passport Photos (4 copies)', 'Moulded Cleats & Shin Guards'],
    'Day 1 agility and technical battery; Day 2 tactical scrimmage at Bhaichung Stadium under AFC A-Licensed coaches.',
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

-- 4. Create or replace backend RPC function to upsert trial records from backend
CREATE OR REPLACE FUNCTION public.upsert_backend_trial_record(
  p_trial JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id TEXT;
BEGIN
  v_id := p_trial->>'id';
  IF v_id IS NULL OR trim(v_id) = '' THEN
    v_id := 't-' || gen_random_uuid()::text;
  END IF;

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
  VALUES (
    v_id,
    p_trial->>'title',
    coalesce(p_trial->>'academy_name', p_trial->>'academy'),
    p_trial->>'sport',
    p_trial->>'city',
    p_trial->>'state',
    coalesce(p_trial->>'venue_name', p_trial->>'venue'),
    coalesce((p_trial->>'trial_date')::date, CURRENT_DATE + INTERVAL '14 days'),
    p_trial->>'reporting_time',
    (p_trial->>'registration_deadline')::timestamptz,
    coalesce((p_trial->>'fee')::numeric, 0.00),
    coalesce((p_trial->>'spots_total')::int, (p_trial->>'spots')::int, 50),
    coalesce((p_trial->>'spots_available')::int, (p_trial->>'spots')::int, 50),
    coalesce(p_trial->>'tag', 'Open'),
    p_trial->>'age_category',
    p_trial->>'gender',
    p_trial->>'verified_label',
    p_trial->>'urgency_text',
    p_trial->>'badge',
    coalesce((p_trial->>'is_government_quota')::boolean, false),
    p_trial->>'apply_url',
    p_trial->>'source_url',
    p_trial->>'source_label',
    coalesce(p_trial->'sources', '[]'::jsonb),
    coalesce(p_trial->'timelines', '[]'::jsonb),
    coalesce(p_trial->'organizer_contacts', '[]'::jsonb),
    p_trial->>'eligibility',
    CASE 
      WHEN jsonb_typeof(p_trial->'required_documents') = 'array' THEN 
        ARRAY(SELECT jsonb_array_elements_text(p_trial->'required_documents'))
      ELSE '{}'::text[]
    END,
    p_trial->>'selection_process',
    coalesce(p_trial->>'status', 'active')
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

  RETURN jsonb_build_object(
    'success', true,
    'trial_id', v_id,
    'message', 'Trial record successfully updated in Supabase database'
  );
END;
$$;
