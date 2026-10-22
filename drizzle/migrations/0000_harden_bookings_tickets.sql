REVOKE EXECUTE ON FUNCTION public.voice_get_bookings(text,text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.voice_cancel_booking(uuid,text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.voice_cancel_booking_by_email(text,date) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.voice_reschedule_booking(uuid,text,date,text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.voice_reschedule_booking_by_email(text,date,date,text) FROM PUBLIC, anon, authenticated;

ALTER TABLE public.event_tickets ALTER COLUMN status SET DEFAULT 'pending';
DROP POLICY IF EXISTS "Anyone can book tickets" ON public.event_tickets;
CREATE POLICY "Anyone can request tickets" ON public.event_tickets FOR INSERT TO anon, authenticated
WITH CHECK (status = 'pending' AND char_length(full_name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 1 AND 255 AND char_length(phone) BETWEEN 1 AND 30 AND ticket_count BETWEEN 1 AND 10 AND total_price >= 0);