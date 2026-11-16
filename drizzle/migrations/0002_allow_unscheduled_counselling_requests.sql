ALTER TABLE public.bookings ALTER COLUMN session_date DROP NOT NULL;
DROP POLICY "Validated inserts on bookings" ON public.bookings;
CREATE POLICY "Validated inserts on bookings" ON public.bookings FOR INSERT TO public WITH CHECK (
 char_length(full_name) > 0 AND char_length(full_name) <= 200
 AND char_length(email) > 0 AND char_length(email) <= 255
 AND char_length(phone) > 0 AND char_length(phone) <= 30
 AND char_length(provider_name) > 0 AND char_length(session_type) > 0
 AND char_length(session_time) > 0
 AND (session_date IS NOT NULL OR (session_time = 'To be arranged by professional' AND status = 'upcoming'))
);
COMMENT ON COLUMN public.bookings.session_date IS 'Actual session date agreed with the professional; NULL while scheduling is pending.';