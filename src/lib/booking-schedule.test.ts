import { describe, expect, it } from "vitest";
import { bookingSchedule, isAwaitingSchedule, upcomingBookingFilter } from "./booking-schedule";

describe("professional-arranged counselling requests", () => {
  it("does not invent a session date for a new request", () => {
    expect(bookingSchedule()).toEqual({ session_date: null, session_time: "To be arranged by professional" });
  });
  it("retains pending requests after the day they were submitted", () => {
    expect(upcomingBookingFilter("2026-11-17")).toBe("session_date.gte.2026-11-17,session_date.is.null,session_time.eq.To be arranged by professional");
  });
  it("treats legacy submission dates as unscheduled rather than reschedulable", () => {
    expect(isAwaitingSchedule({ session_date: "2026-11-16", session_time: "To be arranged by professional" })).toBe(true);
  });
  it("preserves genuine scheduled appointments", () => {
    const schedule = bookingSchedule(new Date(2026, 10, 20), "09:00");
    expect(schedule).toEqual({ session_date: "2026-11-20", session_time: "09:00" });
    expect(isAwaitingSchedule(schedule)).toBe(false);
  });
});