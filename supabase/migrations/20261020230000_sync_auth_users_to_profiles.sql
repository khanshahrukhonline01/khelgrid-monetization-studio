-- Keep the Auth identity and the public profile row in sync.
-- Role, plan and verification status are deliberately not sourced from user metadata.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    city,
    role,
    plan,
    is_verified,
    metadata
  )
  VALUES (
    NEW.id,
    NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')), ''),
    NEW.email,
    NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data ->> 'phone', '')), ''),
    NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data ->> 'city', '')), ''),
    'athlete',
    'free',
    false,
    jsonb_build_object(
      'requested_role', COALESCE(NEW.raw_user_meta_data ->> 'role', 'athlete'),
      'primary_sport', COALESCE(NEW.raw_user_meta_data ->> 'primary_sport', 'Cricket'),
      'created_by', 'auth_trigger'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user_profile();

-- Backfill only missing profiles. Existing profile records are preserved.
INSERT INTO public.profiles (id, full_name, email, phone, city, role, plan, is_verified, metadata)
SELECT
  u.id,
  NULLIF(BTRIM(COALESCE(u.raw_user_meta_data ->> 'full_name', '')), ''),
  u.email,
  NULLIF(BTRIM(COALESCE(u.raw_user_meta_data ->> 'phone', '')), ''),
  NULLIF(BTRIM(COALESCE(u.raw_user_meta_data ->> 'city', '')), ''),
  'athlete',
  'free',
  false,
  jsonb_build_object(
    'requested_role', COALESCE(u.raw_user_meta_data ->> 'role', 'athlete'),
    'primary_sport', COALESCE(u.raw_user_meta_data ->> 'primary_sport', 'Cricket'),
    'created_by', 'auth_backfill'
  )
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
