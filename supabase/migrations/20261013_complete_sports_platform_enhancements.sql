-- ==============================================================================
-- KhelGrid Supabase Migration: Complete Sports Platform Enhancements
-- Migration: 20261013_complete_sports_platform_enhancements.sql
-- Features:
--   1. Flexible trials identifier schema (supports both UUIDs & semantic IDs like t-crpf-...)
--   2. Rich trial metadata (sources, timelines, organizer contacts, apply_url, govt quota)
--   3. Enhanced Full-Text Search (FTS) with rank ordering across sports, locations, & tags
--   4. User saved opportunities (cross-device bookmarking with RLS)
--   5. Feedback & bug ticketing system with telemetry metadata
--   6. Venue reviews & automated rating calculation triggers
--   7. Optimized RPC functions for trials search, bookmark sync, and statistics
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TRIALS IDENTIFIER & RICH METADATA EXTENSION
-- ------------------------------------------------------------------------------

-- Safely convert trials.id and referencing columns to TEXT so both UUIDs and
-- official string IDs (e.g. 't-crpf-meritorious-sportspersons-recruitment-2026') are supported.
DO $$
BEGIN
  -- Drop constraints if they exist
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'trial_applications_trial_id_fkey') THEN
    ALTER TABLE public.trial_applications DROP CONSTRAINT trial_applications_trial_id_fkey;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'notification_queue_trial_id_fkey') THEN
    ALTER TABLE public.notification_queue DROP CONSTRAINT notification_queue_trial_id_fkey;
  END IF;

  -- Alter column types
  ALTER TABLE public.trials ALTER COLUMN id TYPE TEXT USING id::text;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'trial_applications' AND column_name = 'trial_id') THEN
    ALTER TABLE public.trial_applications ALTER COLUMN trial_id TYPE TEXT USING trial_id::text;
    ALTER TABLE public.trial_applications ADD CONSTRAINT trial_applications_trial_id_fkey FOREIGN KEY (trial_id) REFERENCES public.trials(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notification_queue' AND column_name = 'trial_id') THEN
    ALTER TABLE public.notification_queue ALTER COLUMN trial_id TYPE TEXT USING trial_id::text;
    ALTER TABLE public.notification_queue ADD CONSTRAINT notification_queue_trial_id_fkey FOREIGN KEY (trial_id) REFERENCES public.trials(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add rich metadata columns to trials
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

-- Update full text search vector generation
CREATE OR REPLACE FUNCTION public.generate_trials_fts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fts = setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.sport, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(NEW.academy_name, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(NEW.city, '')), 'B') ||
            setweight(to_tsvector('english', coalesce(NEW.state, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(NEW.tag, '')), 'C') ||
            setweight(to_tsvector('english', coalesce(NEW.eligibility, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_trials_fts_update ON public.trials;
CREATE TRIGGER trg_trials_fts_update
BEFORE INSERT OR UPDATE ON public.trials
FOR EACH ROW
EXECUTE FUNCTION public.generate_trials_fts();

-- Create performant indexes
CREATE INDEX IF NOT EXISTS idx_trials_is_govt_quota ON public.trials(is_government_quota);
CREATE INDEX IF NOT EXISTS idx_trials_state ON public.trials(state);
CREATE INDEX IF NOT EXISTS idx_trials_badge ON public.trials(badge);
CREATE INDEX IF NOT EXISTS idx_trials_apply_url ON public.trials(apply_url);

-- ------------------------------------------------------------------------------
-- 2. SAVED OPPORTUNITIES TABLE (CROSS-DEVICE BOOKMARKS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    trial_id TEXT NOT NULL REFERENCES public.trials(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_email, trial_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_opps_user_email ON public.saved_opportunities(user_email);
CREATE INDEX IF NOT EXISTS idx_saved_opps_trial_id ON public.saved_opportunities(trial_id);

ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Permissive policy for read and upsert by email or owner
DROP POLICY IF EXISTS "Public select own saved opportunities" ON public.saved_opportunities;
CREATE POLICY "Public select own saved opportunities"
ON public.saved_opportunities FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public insert own saved opportunities" ON public.saved_opportunities;
CREATE POLICY "Public insert own saved opportunities"
ON public.saved_opportunities FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete own saved opportunities" ON public.saved_opportunities;
CREATE POLICY "Public delete own saved opportunities"
ON public.saved_opportunities FOR DELETE
USING (true);

-- ------------------------------------------------------------------------------
-- 3. FEEDBACK & BUG REPORTING TICKETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT,
    type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'general')),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'normal' CHECK (severity IN ('low', 'normal', 'high', 'urgent')),
    device_info JSONB DEFAULT '{}'::JSONB,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_tickets_type ON public.feedback_tickets(type);
CREATE INDEX IF NOT EXISTS idx_feedback_tickets_status ON public.feedback_tickets(status);
CREATE INDEX IF NOT EXISTS idx_feedback_tickets_created_at ON public.feedback_tickets(created_at DESC);

ALTER TABLE public.feedback_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert feedback" ON public.feedback_tickets;
CREATE POLICY "Allow public insert feedback"
ON public.feedback_tickets FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users select own feedback" ON public.feedback_tickets;
CREATE POLICY "Allow users select own feedback"
ON public.feedback_tickets FOR SELECT
USING (
    user_id = auth.uid() OR 
    (auth.jwt() ->> 'email' IS NOT NULL AND user_email = auth.jwt() ->> 'email') OR
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- ------------------------------------------------------------------------------
-- 4. VENUE REVIEWS TABLE & RATING AUTO-AGGREGATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venue_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    comment TEXT,
    sport TEXT,
    verified_booking BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_reviews_venue_id ON public.venue_reviews(venue_id);

ALTER TABLE public.venue_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select venue reviews" ON public.venue_reviews;
CREATE POLICY "Public select venue reviews"
ON public.venue_reviews FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow insert venue reviews" ON public.venue_reviews;
CREATE POLICY "Allow insert venue reviews"
ON public.venue_reviews FOR INSERT
WITH CHECK (true);

-- Function to recalculate venue rating and reviews count automatically
CREATE OR REPLACE FUNCTION public.recalculate_venue_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_venue_id UUID;
    v_avg_rating NUMERIC(3, 2);
    v_total_reviews INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_venue_id := OLD.venue_id;
    ELSE
        target_venue_id := NEW.venue_id;
    END IF;

    SELECT 
        coalesce(round(avg(rating)::numeric, 1), 0.0),
        count(*)::integer
    INTO v_avg_rating, v_total_reviews
    FROM public.venue_reviews
    WHERE venue_id = target_venue_id;

    UPDATE public.venues
    SET rating = v_avg_rating,
        reviews_count = v_total_reviews,
        updated_at = NOW()
    WHERE id = target_venue_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_venue_reviews_aggregation ON public.venue_reviews;
CREATE TRIGGER trg_venue_reviews_aggregation
AFTER INSERT OR UPDATE OR DELETE ON public.venue_reviews
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_venue_rating();

-- ------------------------------------------------------------------------------
-- 5. RPC FUNCTIONS FOR SEARCH, STATISTICS, AND BOOKMARKS
-- ------------------------------------------------------------------------------

-- Search trials with rank ordering and query highlights
CREATE OR REPLACE FUNCTION public.search_trials(
    p_query TEXT DEFAULT NULL,
    p_sport TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    academy_name TEXT,
    sport TEXT,
    city TEXT,
    state TEXT,
    venue_name TEXT,
    trial_date DATE,
    reporting_time TEXT,
    fee NUMERIC,
    spots_total INTEGER,
    spots_available INTEGER,
    tag TEXT,
    eligibility TEXT,
    required_documents TEXT[],
    selection_process TEXT,
    registration_deadline TIMESTAMPTZ,
    source_url TEXT,
    source_label TEXT,
    sources JSONB,
    timelines JSONB,
    organizer_contacts JSONB,
    apply_url TEXT,
    is_government_quota BOOLEAN,
    status TEXT,
    badge TEXT,
    urgency_text TEXT,
    verified_label TEXT,
    rank_score REAL
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        t.academy_name,
        t.sport,
        t.city,
        t.state,
        t.venue_name,
        t.trial_date,
        t.reporting_time,
        t.fee,
        t.spots_total,
        t.spots_available,
        t.tag,
        t.eligibility,
        t.required_documents,
        t.selection_process,
        t.registration_deadline,
        t.source_url,
        t.source_label,
        t.sources,
        t.timelines,
        t.organizer_contacts,
        t.apply_url,
        t.is_government_quota,
        t.status,
        t.badge,
        t.urgency_text,
        t.verified_label,
        CASE 
            WHEN p_query IS NOT NULL AND length(trim(p_query)) > 0 THEN
                ts_rank_cd(t.fts, websearch_to_tsquery('english', trim(p_query)))
            ELSE 1.0::REAL
        END AS rank_score
    FROM public.trials t
    WHERE t.status IN ('active', 'upcoming')
      AND t.deleted_at IS NULL
      AND (
          p_sport IS NULL OR p_sport = '' OR p_sport ILIKE 'all%' OR
          lower(t.sport) = lower(trim(p_sport))
      )
      AND (
          p_city IS NULL OR p_city = '' OR p_city ILIKE 'all%' OR
          lower(t.city) = lower(trim(p_city))
      )
      AND (
          p_category IS NULL OR p_category = '' OR p_category ILIKE 'all%' OR
          lower(t.tag) ILIKE '%' || lower(trim(p_category)) || '%' OR
          (p_category ILIKE '%govt%' AND t.is_government_quota = TRUE)
      )
      AND (
          p_query IS NULL OR length(trim(p_query)) = 0 OR
          t.fts @@ websearch_to_tsquery('english', trim(p_query)) OR
          t.title ILIKE '%' || trim(p_query) || '%' OR
          t.academy_name ILIKE '%' || trim(p_query) || '%' OR
          t.sport ILIKE '%' || trim(p_query) || '%' OR
          t.city ILIKE '%' || trim(p_query) || '%'
      )
    ORDER BY 
        rank_score DESC,
        t.trial_date ASC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

-- Global trials statistical summary RPC
CREATE OR REPLACE FUNCTION public.get_trials_summary_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_total_trials INTEGER;
    v_active_trials INTEGER;
    v_govt_quota_trials INTEGER;
    v_total_vacancies INTEGER;
    v_sports_count INTEGER;
    v_cities_count INTEGER;
BEGIN
    SELECT 
        count(*),
        count(*) FILTER (WHERE status = 'active'),
        count(*) FILTER (WHERE is_government_quota = TRUE),
        coalesce(sum(spots_total), 0),
        count(DISTINCT sport),
        count(DISTINCT city)
    INTO 
        v_total_trials,
        v_active_trials,
        v_govt_quota_trials,
        v_total_vacancies,
        v_sports_count,
        v_cities_count
    FROM public.trials
    WHERE deleted_at IS NULL;

    RETURN jsonb_build_object(
        'total_trials', v_total_trials,
        'active_trials', v_active_trials,
        'govt_quota_trials', v_govt_quota_trials,
        'total_vacancies', v_total_vacancies,
        'distinct_sports', v_sports_count,
        'distinct_cities', v_cities_count,
        'generated_at', NOW()
    );
END;
$$;

-- Bookmark toggle RPC
CREATE OR REPLACE FUNCTION public.toggle_saved_opportunity(
    p_user_email TEXT,
    p_trial_id TEXT,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.saved_opportunities
        WHERE user_email = lower(trim(p_user_email)) AND trial_id = p_trial_id
    ) INTO v_exists;

    IF v_exists THEN
        DELETE FROM public.saved_opportunities
        WHERE user_email = lower(trim(p_user_email)) AND trial_id = p_trial_id;

        RETURN jsonb_build_object(
            'success', true,
            'is_saved', false,
            'trial_id', p_trial_id
        );
    ELSE
        INSERT INTO public.saved_opportunities (user_email, trial_id, notes)
        VALUES (lower(trim(p_user_email)), p_trial_id, p_notes)
        ON CONFLICT (user_email, trial_id) DO NOTHING;

        RETURN jsonb_build_object(
            'success', true,
            'is_saved', true,
            'trial_id', p_trial_id
        );
    END IF;
END;
$$;
