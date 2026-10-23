-- Remove permissive legacy policies from the older sports-entities migration.
DROP POLICY IF EXISTS "Users can view their own trial applications" ON public.trial_applications;
DROP POLICY IF EXISTS "Users can submit trial applications" ON public.trial_applications;
DROP POLICY IF EXISTS trial_applications_public_read ON public.trial_applications;
DROP POLICY IF EXISTS trial_applications_public_insert ON public.trial_applications;

-- Trial listings are public; application/contact data is private.
REVOKE ALL ON TABLE public.trial_applications FROM anon;
REVOKE ALL ON TABLE public.trial_applications FROM PUBLIC;
GRANT SELECT, INSERT ON TABLE public.trial_applications TO authenticated;

DROP POLICY IF EXISTS trials_public_read ON public.trials;
CREATE POLICY trials_public_read ON public.trials
FOR SELECT TO anon, authenticated USING (deleted_at IS NULL);

DROP POLICY IF EXISTS trial_applications_owner_read ON public.trial_applications;
CREATE POLICY trial_applications_owner_read ON public.trial_applications
FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS trial_applications_owner_insert ON public.trial_applications;
CREATE POLICY trial_applications_owner_insert ON public.trial_applications
FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

GRANT SELECT ON TABLE public.trials TO anon, authenticated;
