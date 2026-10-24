import { beforeEach, describe, expect, it, vi } from "vitest";

type MockRow = Record<string, any>;

const { state, supabaseMock } = vi.hoisted(() => {
  const state = {
    bookings: [] as MockRow[],
    courts: [] as MockRow[],
    availabilityRows: [] as MockRow[],
    availabilityError: null as { message: string } | null,
    venueExists: true,
    venueLookupError: null as { message: string } | null,
    bookingFailure: null as { success: boolean; message: string } | null,
    holdFailure: null as { success: boolean; message: string } | null,
    cancelSuccess: true,
  };

  const from = vi.fn((table: string) => {
    const builder: Record<string, any> = {};
    builder.select = vi.fn(() => builder);
    builder.eq = vi.fn(() => builder);
    builder.is = vi.fn(() => builder);
    builder.order = vi.fn(() => builder);
    builder.update = vi.fn(() => builder);
    builder.maybeSingle = vi.fn(async () => ({
      data: table === "venues" && state.venueExists ? { id: "venue-1" } : null,
      error: state.venueLookupError,
    }));
    // Supabase query builders are thenable; this lets await work without a live database.
    builder.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve({
        data:
          table === "venue_courts"
            ? state.courts
            : table === "venue_bookings"
              ? state.bookings.filter((booking) => !booking.deleted_at)
              : null,
        error: null,
      }).then(resolve, reject);
    return builder;
  });

  const rpc = vi.fn(async (functionName: string, args: Record<string, any>) => {
    if (functionName === "get_venue_slot_availability") {
      return { data: state.availabilityRows, error: state.availabilityError };
    }

    if (functionName === "book_venue_slot_atomic") {
      if (state.bookingFailure) {
        return { data: state.bookingFailure, error: null };
      }

      const prior = state.bookings.find(
        (booking) => booking.idempotency_key === args.p_idempotency_key,
      );
      if (prior) {
        return {
          data: {
            success: true,
            already_processed: true,
            booking_id: prior.id,
            status: prior.status,
            total_price: prior.total_price,
            message: "Booking request was already processed.",
          },
          error: null,
        };
      }

      const row: MockRow = {
        id: args.p_custom_booking_id,
        venue_id: args.p_venue_id,
        court_id: args.p_court_id,
        sport: args.p_sport,
        booking_date: args.p_booking_date,
        start_time: args.p_start_time,
        end_time: args.p_end_time,
        total_price: args.p_total_price,
        status: args.p_status ?? "pending",
        idempotency_key: args.p_idempotency_key,
        user_email: args.p_user_email,
        user_phone: args.p_user_phone,
        created_at: new Date().toISOString(),
        deleted_at: null,
        venues: {
          name: "Decathlon Anubhava Arena",
          area: "Yelahanka",
          city: "Bengaluru",
          image_url: null,
        },
      };
      state.bookings.unshift(row);
      return {
        data: {
          success: true,
          booking_id: row.id,
          status: row.status,
          total_price: row.total_price,
          message: "Booking request recorded.",
        },
        error: null,
      };
    }

    if (functionName === "hold_venue_slot_atomic") {
      if (state.holdFailure) return { data: state.holdFailure, error: null };
      return {
        data: {
          success: true,
          booking_id: "hold-123",
          held_until: new Date(Date.now() + (args.p_hold_duration_minutes ?? 10) * 60_000).toISOString(),
          message: "Slot held.",
        },
        error: null,
      };
    }

    if (functionName === "cancel_venue_booking_atomic") {
      if (!state.cancelSuccess) {
        return { data: { success: false, message: "Cancellation failed." }, error: null };
      }
      const booking = state.bookings.find((item) => item.id === args.p_booking_id);
      if (booking) {
        booking.status = "cancelled";
        booking.deleted_at = new Date().toISOString();
      }
      return {
        data: { success: true, booking_id: args.p_booking_id, message: "Booking cancelled." },
        error: null,
      };
    }

    return { data: null, error: { message: `Unexpected RPC: ${functionName}` } };
  });

  return {
    state,
    supabaseMock: {
      from,
      rpc,
      channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() })),
      removeChannel: vi.fn(),
    },
  };
});

vi.mock("./supabase", () => ({
  supabase: supabaseMock,
  isSupabaseConfigured: true,
}));

import {
  calculateEndTimeSQL,
  cancelVenueBooking,
  checkSlotAvailability,
  createVenueBooking,
  formatTimeToSQL,
  getVenueBookings,
  getVenueCourts,
  holdVenueSlot,
  resetLocalBookingsForTesting,
} from "./booking-service";

const venue = {
  id: "venue-1",
  name: "Decathlon Anubhava Arena",
  area: "Yelahanka",
  city: "Bengaluru",
  price_per_hour: 800,
  sports: ["Football", "Badminton"],
};

describe("Booking service — atomic transactions and concurrency", () => {
  beforeEach(() => {
    resetLocalBookingsForTesting();
    state.bookings = [];
    state.courts = [
      {
        id: "court-1",
        venue_id: venue.id,
        name: "Football Court 1",
        sport: "Football",
        price_per_hour: 800,
        is_active: true,
        booking_enabled: true,
      },
    ];
    state.availabilityRows = [];
    state.availabilityError = null;
    state.venueExists = true;
    state.venueLookupError = null;
    state.bookingFailure = null;
    state.holdFailure = null;
    state.cancelSuccess = true;
    vi.clearAllMocks();
  });

  describe("time formatting and calculations", () => {
    it("converts AM/PM times to SQL time", () => {
      expect(formatTimeToSQL("06:00 AM")).toBe("06:00:00");
      expect(formatTimeToSQL("12:00 PM")).toBe("12:00:00");
      expect(formatTimeToSQL("01:30 PM")).toBe("13:30:00");
      expect(formatTimeToSQL("07:00 PM")).toBe("19:00:00");
      expect(formatTimeToSQL("12:00 AM")).toBe("00:00:00");
    });

    it("preserves already-formatted 24-hour times", () => {
      expect(formatTimeToSQL("18:00")).toBe("18:00:00");
      expect(formatTimeToSQL("18:00:00")).toBe("18:00:00");
    });

    it("calculates end times, including across midnight", () => {
      expect(calculateEndTimeSQL("06:00 AM", 1)).toBe("07:00:00");
      expect(calculateEndTimeSQL("06:00 PM", 2)).toBe("20:00:00");
      expect(calculateEndTimeSQL("11:00 PM", 2)).toBe("01:00:00");
    });
  });

  describe("published courts", () => {
    it("returns active, booking-enabled courts from the database query", async () => {
      await expect(getVenueCourts(venue.id, "Football")).resolves.toEqual(state.courts);
      expect(supabaseMock.from).toHaveBeenCalledWith("venue_courts");
    });

    it("surfaces a court lookup database error", async () => {
      const query = supabaseMock.from("venue_courts");
      query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
        Promise.resolve({ data: null, error: { message: "permission denied" } }).then(resolve, reject);

      await expect(getVenueCourts(venue.id)).rejects.toThrow("Could not load published courts");
    });
  });

  describe("slot availability", () => {
    it("reports an unoccupied published court slot as available", async () => {
      const result = await checkSlotAvailability({
        venue_id: venue.id,
        court_id: "court-1",
        booking_date: "2026-11-05",
        start_time: "06:00 PM",
        duration_hours: 1,
      });

      expect(result.available).toBe(true);
      expect(supabaseMock.rpc).toHaveBeenCalledWith("get_venue_slot_availability", {
        p_venue_id: venue.id,
        p_booking_date: "2026-11-05",
        p_court_id: "court-1",
      });
    });

    it("fails closed when a court has an overlapping confirmed booking", async () => {
      state.availabilityRows = [
        {
          court_id: "court-1",
          start_time: "18:00:00",
          end_time: "19:00:00",
          status: "confirmed",
          is_held: false,
        },
      ];

      const result = await checkSlotAvailability({
        venue_id: venue.id,
        court_id: "court-1",
        booking_date: "2026-11-05",
        start_time: "06:30 PM",
        duration_hours: 1,
      });

      expect(result.available).toBe(false);
      expect(result.conflictReason).toContain("already booked");
    });

    it("fails closed if the live availability service returns an error", async () => {
      state.availabilityError = { message: "RPC unavailable" };

      const result = await checkSlotAvailability({
        venue_id: venue.id,
        court_id: "court-1",
        booking_date: "2026-11-05",
        start_time: "06:00 PM",
        duration_hours: 1,
      });

      expect(result.available).toBe(false);
      expect(result.conflictReason).toContain("could not be verified");
    });

    it("requires a selected court before checking availability", async () => {
      const result = await checkSlotAvailability({
        venue_id: venue.id,
        booking_date: "2026-11-05",
        start_time: "06:00 PM",
        duration_hours: 1,
      });

      expect(result.available).toBe(false);
      expect(result.conflictReason).toContain("Select a published court");
    });
  });

  describe("atomic booking creation", () => {
    it("creates a pending booking through the atomic RPC and reads it back", async () => {
      const result = await createVenueBooking({
        venue,
        court_id: "court-1",
        court_name: "Football Court 1",
        sport: "Football",
        booking_date: "2026-11-10",
        start_time: "06:00 PM",
        duration_hours: 1,
        court_price_per_hour: 800,
        user_email: "athlete@khelgrid.com",
        user_phone: "+91 9876543210",
      });

      expect(result.success).toBe(true);
      expect(result.booking).toBeDefined();
      expect(result.booking?.id).toBeTruthy();
      expect(result.booking?.total_price).toBe(800);
      expect(result.booking?.status).toBe("pending");
      expect(result.booking?.idempotency_key).toBeTruthy();
      expect(supabaseMock.rpc).toHaveBeenCalledWith(
        "book_venue_slot_atomic",
        expect.objectContaining({
          p_venue_id: venue.id,
          p_court_id: "court-1",
          p_total_price: 800,
          p_status: "pending",
        }),
      );

      const savedBookings = await getVenueBookings();
      expect(savedBookings).toHaveLength(1);
      expect(savedBookings[0].id).toBe(result.booking?.id);
      expect(savedBookings[0].synced_to_db).toBe(true);
    });

    it("passes idempotency keys to the atomic service and avoids duplicate records", async () => {
      const idempotencyKey = "550e8400-e29b-41d4-a716-446655440000";
      const params = {
        venue,
        court_id: "court-1",
        sport: "Football",
        booking_date: "2026-11-11",
        start_time: "07:00 PM",
        court_price_per_hour: 800,
        idempotency_key: idempotencyKey,
        user_email: "player1@khelgrid.com",
      };

      const first = await createVenueBooking(params);
      const second = await createVenueBooking(params);

      expect(first.success).toBe(true);
      expect(second.success).toBe(true);
      expect(first.booking?.idempotency_key).toBe(idempotencyKey);
      expect(second.booking?.id).toBe(first.booking?.id);
      expect(state.bookings).toHaveLength(1);
    });

    it("rejects sample or unpublished venues", async () => {
      state.venueExists = false;

      const result = await createVenueBooking({
        venue,
        court_id: "court-1",
        sport: "Football",
        booking_date: "2026-11-12",
        start_time: "06:00 PM",
        court_price_per_hour: 800,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("sample listing");
      expect(state.bookings).toHaveLength(0);
    });

    it("does not create a booking if the atomic RPC rejects the reservation", async () => {
      state.bookingFailure = { success: false, message: "Slot conflict" };

      const result = await createVenueBooking({
        venue,
        court_id: "court-1",
        sport: "Football",
        booking_date: "2026-11-13",
        start_time: "06:00 PM",
        court_price_per_hour: 800,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Slot conflict");
      expect(state.bookings).toHaveLength(0);
    });
  });

  describe("atomic slot holds", () => {
    it("creates a temporary hold with an expiry returned by the server", async () => {
      const result = await holdVenueSlot({
        venue_id: venue.id,
        court_id: "court-1",
        sport: "Badminton",
        booking_date: "2026-11-15",
        start_time: "08:00 AM",
        duration_hours: 1,
        price_per_hour: 500,
        user_email: "holding-user@khelgrid.com",
        hold_duration_minutes: 15,
      });

      expect(result.success).toBe(true);
      expect(result.booking_id).toBe("hold-123");
      expect(new Date(result.held_until!).getTime()).toBeGreaterThan(Date.now());
      expect(supabaseMock.rpc).toHaveBeenCalledWith(
        "hold_venue_slot_atomic",
        expect.objectContaining({ p_total_price: 500, p_hold_duration_minutes: 15 }),
      );
    });

    it("rejects a hold without a published positive price", async () => {
      const result = await holdVenueSlot({
        venue_id: venue.id,
        court_id: "court-1",
        booking_date: "2026-11-15",
        start_time: "08:00 AM",
        price_per_hour: 0,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("published court price");
      expect(supabaseMock.rpc).not.toHaveBeenCalled();
    });

    it("rejects a hold when the server rejects it", async () => {
      state.holdFailure = { success: false, message: "Court is not bookable" };

      const result = await holdVenueSlot({
        venue_id: venue.id,
        court_id: "court-1",
        booking_date: "2026-11-15",
        start_time: "08:00 AM",
        price_per_hour: 500,
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("not bookable");
    });
  });

  describe("cancellation", () => {
    it("cancels via the atomic RPC", async () => {
      state.bookings = [
        {
          id: "booking-1",
          venue_id: venue.id,
          status: "pending",
          deleted_at: null,
          idempotency_key: "existing-key",
        },
      ];

      await expect(cancelVenueBooking("booking-1", "Rain disruption")).resolves.toBe(true);
      expect(supabaseMock.rpc).toHaveBeenCalledWith("cancel_venue_booking_atomic", {
        p_booking_id: "booking-1",
        p_reason: "Rain disruption",
      });
      expect(state.bookings[0].status).toBe("cancelled");
    });
  });
});
