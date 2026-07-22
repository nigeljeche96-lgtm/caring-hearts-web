DROP POLICY IF EXISTS "Public can view donations via safe view" ON public.campaign_donations;
REVOKE SELECT ON public.campaign_donations FROM anon;
REVOKE SELECT ON public.campaign_donations FROM authenticated;
GRANT SELECT ON public.public_campaign_donations TO anon, authenticated;