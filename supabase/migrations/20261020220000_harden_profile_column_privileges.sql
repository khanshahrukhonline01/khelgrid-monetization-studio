-- Restrict profile writes to user-editable fields.
-- Authorization and subscription fields must only be changed by trusted server-side
-- workflows, not directly by browser clients.
--
-- This migration is intentionally additive/restrictive and does not alter data.

REVOKE INSERT, UPDATE ON TABLE public.profiles FROM authenticated;

-- A signed-in user may create their own profile, but cannot self-assign role,
-- verification status, subscription plan, or creation timestamps.
GRANT INSERT (
  id,
  full_name,
  username,
  email,
  phone,
  avatar_url,
  bio,
  city,
  state,
  country,
  metadata,
  updated_at
) ON TABLE public.profiles TO authenticated;

-- A signed-in user may edit ordinary profile details only.
-- role, plan, is_verified, id, and created_at are intentionally excluded.
GRANT UPDATE (
  full_name,
  username,
  email,
  phone,
  avatar_url,
  bio,
  city,
  state,
  country,
  metadata
) ON TABLE public.profiles TO authenticated;

-- Profiles currently have an own-row SELECT policy for authenticated users,
-- and no public-row policy. Remove anonymous table access as defense in depth.
REVOKE SELECT ON TABLE public.profiles FROM anon;
