DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Validated public subscriptions" ON public.newsletter_subscribers
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(email) BETWEEN 5 AND 255
  AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  AND is_active = true
);