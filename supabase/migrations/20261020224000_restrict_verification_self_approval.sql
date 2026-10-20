-- Prevent owners from self-approving academies or organizer verification.
-- RLS limits rows to the current owner; column privileges limit which fields
-- that owner may create or change. Trusted review workflows should use a
-- server-side service role or dedicated audited RPC for protected fields.

-- Academy owners may edit public listing details, not verification or rating state.
REVOKE INSERT, UPDATE ON TABLE public.academies FROM authenticated;

GRANT INSERT (
  owner_profile_id,
  name,
  slug,
  description,
  sport_ids,
  city,
  state,
  address,
  latitude,
  longitude,
  phone,
  email,
  website,
  logo_url,
  facilities
) ON TABLE public.academies TO authenticated;

GRANT UPDATE (
  name,
  slug,
  description,
  sport_ids,
  city,
  state,
  address,
  latitude,
  longitude,
  phone,
  email,
  website,
  logo_url,
  facilities
) ON TABLE public.academies TO authenticated;

-- A requester may submit verification documents but must not be able to set
-- status, reviewer_note, reviewed_at, or expiry fields through the browser API.
REVOKE INSERT, UPDATE ON TABLE public.organizer_verifications FROM authenticated;

GRANT INSERT (
  profile_id,
  academy_id,
  verification_type,
  documents
) ON TABLE public.organizer_verifications TO authenticated;

GRANT UPDATE (
  documents
) ON TABLE public.organizer_verifications TO authenticated;
