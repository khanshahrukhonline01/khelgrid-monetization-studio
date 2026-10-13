-- ==============================================================================
-- KhelGrid Supabase Database Seed Data
-- Run this in your Supabase SQL Editor to populate venues, trials, coaching programs,
-- reviews, and sample bookings with full production-grade metadata.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SEED VENUES ACROSS MAJOR INDIAN CITIES
-- ------------------------------------------------------------------------------
INSERT INTO public.venues (id, name, slug, area, city, address, sports, amenities, price_per_hour, rating, reviews_count, featured, bookable, image_url, contact_phone, contact_email)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Play Arena Sarjapur',
    'play-arena-sarjapur',
    'Sarjapur Road',
    'Bengaluru',
    'Sy No 75, Central Jail Road, Opp Silverwood Regency, Kasavanahalli, Bengaluru, Karnataka 560035',
    ARRAY['Football', 'Badminton', 'Cricket', 'Swimming', 'Tennis'],
    ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'Pro Shop'],
    1200.00,
    4.8,
    342,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    '+91 99000 99911',
    'sarjapur@playarena.in'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Decathlon Anubhava Arena',
    'decathlon-anubhava-arena',
    'Yelahanka',
    'Bengaluru',
    'Airport Road, Bellahalli Cross, Yelahanka, Bengaluru, Karnataka 560064',
    ARRAY['Football', 'Basketball', 'Badminton', 'Cricket', 'Skating'],
    ARRAY['Floodlights', 'Free Parking', 'Changing Rooms', 'Decathlon Store', 'Water Station'],
    950.00,
    4.7,
    215,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    '+91 80 4646 5000',
    'anubhava@decathlon.in'
  ),
  (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Dribble Football Turf',
    'dribble-football-turf',
    'Indiranagar',
    'Bengaluru',
    '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    ARRAY['Football', 'Box Cricket'],
    ARRAY['FIFA 2-Star Turf', 'Floodlights', 'Bibs & Balls Provided', 'Restroom', 'Locker Room'],
    1400.00,
    4.9,
    410,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    '+91 98450 12345',
    'bookings@dribbleturf.com'
  ),
  (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Siri Fort Sports Complex',
    'siri-fort-sports-complex',
    'August Kranti Marg',
    'Delhi NCR',
    'Siri Fort Institutional Area, August Kranti Marg, New Delhi 110049',
    ARRAY['Badminton', 'Tennis', 'Squash', 'Swimming', 'Table Tennis'],
    ARRAY['Olympic Standard Courts', 'Coaching Academy', 'Locker Rooms', 'Cafeteria', 'Ample Parking'],
    650.00,
    4.6,
    580,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    '+91 11 2649 7482',
    'sirifort@dda.gov.in'
  ),
  (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    'Vasant Kunj Turf & Arena',
    'vasant-kunj-turf',
    'Vasant Kunj',
    'Delhi NCR',
    'Pocket 8, Sector C, Vasant Kunj, New Delhi 110070',
    ARRAY['Football', 'Cricket'],
    ARRAY['Floodlights', 'Dressing Room', 'Water Dispenser', 'Seating Stands'],
    1100.00,
    4.5,
    148,
    FALSE,
    TRUE,
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    '+91 98110 56789',
    'vkarena@khelgrid.com'
  ),
  (
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    'Padel & Turf Club Bandra',
    'padel-turf-bandra',
    'Bandra West',
    'Mumbai',
    'Carter Road, Bandra West, Mumbai, Maharashtra 400050',
    ARRAY['Football', 'Padel', 'Badminton'],
    ARRAY['Sea-facing Cafe', 'Valet Parking', 'Air-Conditioned Lounge', 'Showers'],
    1800.00,
    4.9,
    620,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    '+91 98200 11223',
    'bandraturf@khelgrid.com'
  ),
  (
    'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    'Gachibowli Stadium Astro Turf',
    'gachibowli-stadium-turf',
    'Gachibowli',
    'Hyderabad',
    'Old Mumbai Highway, Gachibowli, Hyderabad, Telangana 500032',
    ARRAY['Football', 'Athletics', 'Hockey', 'Badminton'],
    ARRAY['National Standard Track', 'Dressing Rooms', 'VIP Pavilion', 'First Aid'],
    1350.00,
    4.8,
    430,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    '+91 40 2300 0011',
    'sports@telangana.gov.in'
  ),
  (
    'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    'Koramangala Indoor Badminton Hub',
    'koramangala-badminton-hub',
    'Koramangala 4th Block',
    'Bengaluru',
    '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    ARRAY['Badminton', 'Table Tennis'],
    ARRAY['Wooden Synthetic Courts', 'AC Lounge', 'Yonex Stringing Service', 'Lockers'],
    550.00,
    4.7,
    195,
    FALSE,
    TRUE,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    '+91 80 2553 4455',
    'koramangala@badmintonhub.in'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sports = EXCLUDED.sports,
  amenities = EXCLUDED.amenities,
  price_per_hour = EXCLUDED.price_per_hour,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  image_url = EXCLUDED.image_url;

-- ------------------------------------------------------------------------------
-- 2. SEED REAL-WORLD NATIONAL & STATE TRIALS (CRPF, STATE ASSOCIATIONS, SAI)
-- ------------------------------------------------------------------------------
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
  status = EXCLUDED.status;

-- ------------------------------------------------------------------------------
-- 3. SEED COACHING PROGRAMS
-- ------------------------------------------------------------------------------
INSERT INTO public.coaching_programs (id, venue_id, title, coach_name, sport, city, area, level, price_per_month, rating, reviews_count, image_url)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Pro Touch Football Development Center',
    'Coach Rajesh Nair (AFC A License)',
    'Football',
    'Bengaluru',
    'Indiranagar',
    'Intermediate',
    3500.00,
    4.9,
    88,
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Smash Point Elite Badminton Academy',
    'Coach Sunita Verma (Ex-National Player)',
    'Badminton',
    'Delhi NCR',
    'August Kranti Marg',
    'All Levels',
    4200.00,
    4.8,
    114,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SEED SAMPLE USER PROFILE, ACHIEVEMENTS & MEMBERSHIP
-- ------------------------------------------------------------------------------
INSERT INTO public.user_profiles (id, full_name, email, phone, avatar_url, primary_sport, secondary_sports, city, age_category, playing_position, bio, skill_level, membership_tier)
VALUES
  (
    '77777777-7777-7777-7777-777777777777',
    'Arjun Mehta',
    'arjun.mehta@khelgrid.com',
    '+91 98765 43210',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'Cricket',
    ARRAY['Badminton', 'Football'],
    'Bengaluru',
    'U-19',
    'Top-Order Batsman & Right-Arm Off-Break',
    'Passionate top-order batsman & athletic fielder. Represented Karnataka Zonal U-17 team. Aiming for Ranji Trophy state trials and BCCI junior screening.',
    'State Level',
    'pro'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sports_achievements (id, user_email, title, sport, category, level, organization, year, position_rank, description, verified, verification_badge, certificate_url)
VALUES
  (
    '88888888-8888-8888-8888-888888888888',
    'arjun.mehta@khelgrid.com',
    'Gold Medal · Karnataka State Inter-District U-19 Championship',
    'Cricket',
    'tournament',
    'State',
    'Karnataka State Cricket Association (KSCA)',
    2025,
    'Champions · 1st Place',
    'Scored 114* off 82 balls in the final against Mysuru Zone at M. Chinnaswamy auxiliary grounds.',
    TRUE,
    'KSCA Verified Official',
    'https://khelgrid.com/verify/cert/ksca-u19-2025-098'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_memberships (id, user_email, plan_name, tier, status, sport, venue_name, valid_from, valid_until, auto_renew, perks, allocated_hours_per_month, used_hours_this_month, price_paid)
VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'arjun.mehta@khelgrid.com',
    'KhelGrid Pro Athlete Annual Pass',
    'pro',
    'active',
    'Cricket & Multi-Sport',
    'All Partner Venues Across Bengaluru',
    NOW(),
    NOW() + INTERVAL '1 year',
    TRUE,
    ARRAY[
      'Unlimited verified trial applications across India',
      '12 complimentary floodlit court hours every month',
      'Priority instant confirmation at 40+ partner sports hubs',
      'Direct recruiter profile showcasing with verified scout badges'
    ],
    12,
    4,
    4999.00
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 5. SEED SAMPLE SAVED OPPORTUNITIES & FEEDBACK TICKETS
-- ------------------------------------------------------------------------------
INSERT INTO public.saved_opportunities (user_email, trial_id, notes)
VALUES
  ('arjun.mehta@khelgrid.com', 't-crpf-meritorious-sportspersons-recruitment-2026', 'Applied online on rect.crpf.gov.in. Preparing physical standard test measurements.'),
  ('arjun.mehta@khelgrid.com', 't-kca-u14-cricket-trials-kanpur-2026', 'Tracking selection list results for junior squad.')
ON CONFLICT (user_email, trial_id) DO NOTHING;

INSERT INTO public.venue_reviews (venue_id, user_name, rating, comment, sport, verified_booking)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Rohan Sharma', 5.0, 'Top-tier turf condition with excellent LED floodlights and clean showers.', 'Football', TRUE),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Neha Kulkarni', 4.5, 'Spacious badminton courts with Yonex mats. Easy parking.', 'Badminton', TRUE),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Aditya Verma', 5.0, 'Best 5v5 turf in Indiranagar. Great ball rebound and cushioning.', 'Football', TRUE)
ON CONFLICT DO NOTHING;

-- End of Seed Data
