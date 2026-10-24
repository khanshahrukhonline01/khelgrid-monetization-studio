import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatTimeToSQL,
  calculateEndTimeSQL,
  getVenueCourts,
  checkSlotAvailability,
  createVenueBooking,
  holdVenueSlot,
  cancelVenueBooking,
  getVenueBookings,
  resetLocalBookingsForTesting,
} from "./booking-service";

describe("Booking Service - Atomic Transactions & Concurrency", () => {
  beforeEach(() => {
    resetLocalBookingsForTesting();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    vi.clearAllMocks();
  });

  describe("Time Formatting & Math", () => {
    it("converts 12-hour AM/PM times to 24-hour SQL format correctly", () => {
      expect(formatTimeToSQL("06:00 AM")).toBe("06:00:00");
      expect(formatTimeToSQL("12:00 PM")).toBe("12:00:00");
      expect(formatTimeToSQL("01:30 PM")).toBe("13:30:00");
      expect(formatTimeToSQL("07:00 PM")).toBe("19:00:00");
      expect(formatTimeToSQL("12:00 AM")).toBe("00:00:00");
    });

    it("handles already formatted 24-hour strings gracefully", () => {
      expect(formatTimeToSQL("18:00")).toBe("18:00:00");
      expect(formatTimeToSQL("18:00:00")).toBe("18:00:00");
    });

    it("calculates multi-hour slot end times correctly across boundary", () => {
      expect(calculateEndTimeSQL("06:00 AM", 1)).toBe("07:00:00");
      expect(calculateEndTimeSQL("06:00 PM", 2)).toBe("20:00:00");
      expect(calculateEndTimeSQL("11:00 PM", 2)).toBe("01:00:00");
    });
  });

  describe("Venue Courts Fetching", () => {
    it("returns default courts when Supabase is not connected", async () => {
      const courts = await getVenueCourts("v-1", "Football");
      expect(courts).toHaveLength(1);
      expect(courts[0].venue_id).toBe("v-1");
      expect(courts[0].sport).toBe("Football");
      expect(courts[0].is_active).toBe(true);
    });
  });

  describe("Slot Availability Verification", () => {
    it("verifies slot availability for unbooked dates", async () => {
      const availability = await checkSlotAvailability({
        venue_id: "v-1",
        booking_date: "2026-10-05",
        start_time: "06:00 PM",
        duration_hours: 1,
      });

      expect(availability.available).toBe(true);
    });
  });

  describe("Atomic Venue Booking Creation", () => {
    it("creates and records a confirmed venue booking", async () => {
      const result = await createVenueBooking({
        venue: {
          id: "v-1",
          name: "Decathlon Anubhava Arena",
          area: "Yelahanka",
          city: "Bengaluru",
          price_per_hour: 800,
          sports: ["Football", "Badminton"],
        },
        sport: "Football",
        booking_date: "2026-10-10",
        start_time: "06:00 PM",
        duration_hours: 1,
        user_email: "athlete@khelgrid.com",
        user_phone: "+91 9876543210",
      });

      expect(result.success).toBe(true);
      expect(result.booking).toBeDefined();
      expect(result.booking?.id).toContain("KG-BK-");
      expect(result.booking?.total_price).toBe(800);
      expect(result.booking?.status).toBe("confirmed");
      expect(result.booking?.idempotency_key).toBeDefined();

      const savedBookings = await getVenueBookings();
      expect(savedBookings.length).toBeGreaterThan(0);
      expect(savedBookings[0].id).toBe(result.booking?.id);
    });

    it("supports idempotency keys to prevent duplicate booking submissions", async () => {
      const sharedIdempotencyKey = "550e8400-e29b-41d4-a716-446655440000";

      const firstCall = await createVenueBooking({
        venue: {
          id: "v-2",
          name: "Sarjapur Football Turf",
          area: "Sarjapur",
          city: "Bengaluru",
          price_per_hour: 1200,
          sports: ["Football"],
        },
        sport: "Football",
        booking_date: "2026-10-11",
        start_time: "07:00 PM",
        idempotency_key: sharedIdempotencyKey,
        user_email: "player1@khelgrid.com",
      });

      expect(firstCall.success).toBe(true);
      expect(firstCall.booking?.idempotency_key).toBe(sharedIdempotencyKey);
    });
  });

  describe("Atomic Slot Hold & Reservation", () => {
    it.each([undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects missing or invalid court price before creating a hold (price: %s)",
      async (price) => {
        const holdRes = await holdVenueSlot({
          venue_id: "venue-test",
          court_id: "court-test",
          sport: "Badminton",
          booking_date: "2026-11-15",
          start_time: "08:00 AM",
          duration_hours: 1,
          price_per_hour: price,
          user_email: "test@example.invalid",
        });

        expect(holdRes.success).toBe(false);
        expect(holdRes.message).toMatch(/published court price is required/i);
        expect(holdRes.booking_id).toBeUndefined();
      },
    );

    it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
      "rejects invalid duration before creating a hold (duration: %s)",
      async (duration) => {
        const holdRes = await holdVenueSlot({
          venue_id: "venue-test",
          court_id: "court-test",
          sport: "Badminton",
          booking_date: "2026-11-15",
          start_time: "08:00 AM",
          duration_hours: duration,
          price_per_hour: 700,
          user_email: "test@example.invalid",
        });

        expect(holdRes.success).toBe(false);
        expect(holdRes.message).toMatch(/valid booking duration is required/i);
        expect(holdRes.booking_id).toBeUndefined();
      },
    );

    it("holds a venue slot for a checkout session with auto-expiry window", async () => {
      const holdRes = await holdVenueSlot({
        venue_id: "v-1",
        court_id: "court-1",
        sport: "Badminton",
        booking_date: "2026-10-15",
        start_time: "08:00 AM",
        duration_hours: 1,
        price_per_hour: 500,
        user_email: "holding-user@khelgrid.com",
        hold_duration_minutes: 15,
      });

      expect(holdRes.success).toBe(true);
      expect(holdRes.booking_id).toBeDefined();
      expect(holdRes.held_until).toBeDefined();

      const heldUntilTime = new Date(holdRes.held_until!).getTime();
      const now = Date.now();
      expect(heldUntilTime).toBeGreaterThan(now);
    });
  });

  describe("Cancellation & Soft Delete", () => {
    it("cancels an existing booking and updates its state", async () => {
      const createRes = await createVenueBooking({
        venue: {
          id: "v-1",
          name: "Decathlon Anubhava Arena",
          area: "Yelahanka",
          city: "Bengaluru",
          price_per_hour: 800,
          sports: ["Football"],
        },
        sport: "Football",
        booking_date: "2026-10-12",
        start_time: "05:00 PM",
        user_email: "cancel-test@khelgrid.com",
      });

      expect(createRes.success).toBe(true);
      const bookingId = createRes.booking!.id;

      const cancelSuccess = await cancelVenueBooking(bookingId, "Rain disruption");
      expect(cancelSuccess).toBe(true);

      const allBookings = await getVenueBookings();
      const target = allBookings.find((b) => b.id === bookingId);
      expect(target?.status).toBe("cancelled");
    });
  });
});
