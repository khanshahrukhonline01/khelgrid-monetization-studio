-- KhelGrid Selection Trials & Combines
-- Initial additive tables; later migration reconciles frontend-required fields.
-- No seed data: official trial records must be sourced and verified separately.

CREATE TABLE IF NOT EXISTS public.trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  academy_name text NOT NULL,
  title text NOT NULL,
  sport text NOT NULL,
  city text NOT NULL,
  state text,
  venue_name text,
  trial_date date NOT NULL,
  reporting_time text,
  fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  spots_total integer NOT NULL DEFAULT 0 CHECK (spots_total >= 0),
  spots_available integer NOT NULL DEFAULT 0 CHECK (spots_available >= 0),
  tag text NOT NULL DEFAULT 'Open',
  age_category text,
  gender text,
  verified_label text,
  urgency_text text,
  badge text,
  eligibility text,
  required_documents text[] NOT NULL DEFAULT '{}',
  selection_process text,
  registration_deadline timestamptz,
  source_url text,
  source_label text,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  timelines jsonb NOT NULL DEFAULT '[]'::jsonb,
  organizer_contacts jsonb NOT NULL DEFAULT '[]'::jsonb,
  apply_url text,
  is_government_quota boolean NOT NULL DEFAULT false,
  quota_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_verified timestamptz,
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('active','upcoming','completed','cancelled')),
  deleted_at timestamptz,
  fts tsvector,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trial_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_id uuid NOT NULL REFERENCES public.trials(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  athlete_name text NOT NULL,
  athlete_age integer CHECK (athlete_age IS NULL OR athlete_age BETWEEN 1 AND 120),
  playing_position text,
  contact_phone text NOT NULL,
  contact_email text,
  sports_cv_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','shortlisted','rejected','attended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
