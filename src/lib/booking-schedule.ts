import { format } from "date-fns";

export const TO_BE_ARRANGED = "To be arranged by professional";
type Schedule = { session_date: string | null; session_time: string };

export function bookingSchedule(date?: Date, time?: string): Schedule {
  return {
    session_date: date && time ? format(date, "yyyy-MM-dd") : null,
    session_time: date && time ? time : TO_BE_ARRANGED,
  };
}

export function isAwaitingSchedule(booking: Schedule) {
  return !booking.session_date || booking.session_time === TO_BE_ARRANGED;
}

export function upcomingBookingFilter(today: string) {
  // Include legacy requests whose old submission date has already passed.
  return `session_date.gte.${today},session_date.is.null,session_time.eq.${TO_BE_ARRANGED}`;
}