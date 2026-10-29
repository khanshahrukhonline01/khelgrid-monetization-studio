-- KhelGrid production trials catalogue: SAI November 2026 selection trials.
-- Source basis: three SAI-branded flyers supplied by the user on 2026-10-30.
-- The supplied PDFs do not provide direct public notice URLs. Keep review_status=needs_review
-- and do not claim verified/free or invent registration links.
-- fee is legacy NOT NULL, so fee=0 is accompanied by fee_label; UI must treat this label as unknown, not free.

begin;

alter table public.trials
  add column if not exists fee_label text;

insert into public.trials (
  external_id, academy_name, title, sport, city, state, venue_name, trial_date,
  reporting_time, fee, fee_label, spots_total, spots_available, tag, age_category,
  gender, verified_label, urgency_text, badge, eligibility, required_documents,
  selection_process, registration_deadline, source_url, source_label, sources,
  timelines, organizer_contacts, apply_url, is_government_quota, last_verified,
  status, review_status, review_notes
)
values
(
  'sai-stc-padma-hazaribagh-archery-hockey-trials-2026',
  'Sports Authority of India (SAI) — Sports Training Centre, Padma',
  'SAI STC Padma Hazaribagh Selection Trials — Archery & Hockey',
  'Archery, Hockey', 'Hazaribagh', 'Jharkhand',
  'SAI Sports Training Centre, Padma, Hazaribagh, Jharkhand 825411',
  '2026-11-02', null, 0, 'Fee not stated in flyer; confirm with SAI',
  0, 0, 'SAI Selection Trial', '12–14 years as of 31 March 2026; outstanding athletes up to 16 may be considered',
  'Boys & girls', null,
  'Sessions: 2–4, 10–12 and 17–19 November 2026',
  'New',
  'The flyer says candidates should have won medals or participated in national/state/district competitions during the last three years.',
  array['Date-of-birth proof', 'Achievement certificates', 'Educational certificates', 'Passport-size photograph', 'Original documents and photocopies'],
  'Selection under prevailing SAI guidelines through prescribed sports fitness and skill tests.',
  null, null, 'User-provided SAI flyer (received 30 Oct 2026; direct public notice URL not supplied)',
  '[]'::jsonb,
  '[{"label":"Session 1","date":"2–4 November 2026"},{"label":"Session 2","date":"10–12 November 2026"},{"label":"Session 3","date":"17–19 November 2026"}]'::jsonb,
  '[]'::jsonb, null, false, null, 'upcoming', 'needs_review',
  'Based on user-supplied flyer only. No direct public notice URL supplied; fee unknown. Confirm session, eligibility and logistics with SAI STC Padma.'
),
(
  'sai-stc-ranchi-hockey-selection-trials-2026',
  'Sports Authority of India (SAI) — Sports Training Centre, Ranchi',
  'SAI Sports Training Centre Ranchi — Hockey Selection Trials',
  'Hockey', 'Ranchi', 'Jharkhand',
  'Gate 16, Birsa Munda Football Stadium, SAI Sports Training Centre, Ranchi',
  '2026-11-11', '07:00 AM', 0, 'Fee not stated in flyer; confirm with SAI',
  0, 0, 'SAI Selection Trial', '12–14 years; exceptional talent up to 16 may be considered',
  'Boys & girls; residential selection',
  null, 'Reporting at 07:00 AM; registration listed for 11 November only',
  'New',
  'The flyer lists age 12–14 years and says exceptional talent up to 16 may be considered.',
  array['Two passport-size photographs', 'Original Aadhaar and photocopy', 'Date-of-birth proof', 'Medical fitness certificate', 'Sports achievement certificates', 'School bonafide document'],
  'Selection trial at the stated venue. The flyer says boarding/lodging is not provided during the selection trial; benefits are described after selection.',
  null, null, 'User-provided SAI flyer (received 30 Oct 2026; direct public notice URL not supplied)',
  '[]'::jsonb,
  '[{"label":"Reporting","date":"11 November 2026, 07:00 AM"},{"label":"Selection trials","date":"11–12 November 2026"},{"label":"Registration","date":"11 November 2026 only"}]'::jsonb,
  '[]'::jsonb, null, false, null, 'upcoming', 'needs_review',
  'Based on user-supplied flyer only. No direct public notice URL supplied; fee unknown. Confirm eligibility and registration arrangements with SAI STC Ranchi.'
),
(
  'sai-ncoe-bhopal-judo-selection-trials-2026',
  'Sports Authority of India (SAI) — National Centre of Excellence, Bhopal',
  'SAI NCOE Bhopal — Judo Open Selection Trials',
  'Judo', 'Bhopal', 'Madhya Pradesh',
  'SAI Central Regional Centre, Bhopal, Madhya Pradesh',
  '2026-11-11', null, 0, 'Fee not stated in flyer; confirm with SAI',
  0, 0, 'SAI Selection Trial', '15–18, 19–24, and above 26 years (as stated on flyer)',
  'As stated in flyer; categories vary by age group',
  null, 'Reporting 11 November; trials and bouts 12–14 November 2026',
  'New',
  'Eligibility thresholds differ by age group and require qualifying national/state/international judo results. Read the supplied flyer carefully; it contains separate criteria for each age category.',
  array['Four passport-size photographs', 'Original Aadhaar and photocopy', 'Date-of-birth proof', 'Medical fitness certificate', 'Sports achievement certificates', 'School bonafide document'],
  'Open selection trials and bouts. Weight categories are shown on the flyer. No TA/DA, boarding, or lodging is provided during selection.',
  null, null, 'User-provided SAI flyer (received 30 Oct 2026; direct public notice URL not supplied)',
  '[]'::jsonb,
  '[{"label":"Reporting","date":"11 November 2026"},{"label":"Selection trials and bouts","date":"12–14 November 2026"}]'::jsonb,
  '[]'::jsonb, null, false, null, 'upcoming', 'needs_review',
  'Based on user-supplied flyer only. No direct public notice URL supplied; fee unknown. Registration QR was not decoded; confirm eligibility and registration with SAI NCOE Bhopal.'
)
on conflict (external_id) where external_id is not null do update set
  academy_name = excluded.academy_name,
  title = excluded.title,
  sport = excluded.sport,
  city = excluded.city,
  state = excluded.state,
  venue_name = excluded.venue_name,
  trial_date = excluded.trial_date,
  reporting_time = excluded.reporting_time,
  fee = excluded.fee,
  fee_label = excluded.fee_label,
  age_category = excluded.age_category,
  gender = excluded.gender,
  urgency_text = excluded.urgency_text,
  eligibility = excluded.eligibility,
  required_documents = excluded.required_documents,
  selection_process = excluded.selection_process,
  source_url = excluded.source_url,
  source_label = excluded.source_label,
  sources = excluded.sources,
  timelines = excluded.timelines,
  review_notes = excluded.review_notes,
  updated_at = now();

commit;
