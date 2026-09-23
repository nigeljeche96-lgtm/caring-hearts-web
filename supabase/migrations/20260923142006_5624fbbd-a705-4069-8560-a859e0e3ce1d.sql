ALTER VIEW public.public_campaign_donations SET (security_invoker = false);
GRANT SELECT ON public.public_campaign_donations TO anon, authenticated;