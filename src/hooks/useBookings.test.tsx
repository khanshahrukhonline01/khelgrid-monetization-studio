import { describe, it, expect, beforeEach, vi } from "vitest";
import React, { useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useBookings, type CreateBookingParams } from "./useBookings";
import { resetLocalBookingsForTesting, type BookingRecord } from "@/lib/booking-service";

const bookingServiceMocks = vi.hoisted(() => {
  let records: any[] = [];

  return {
    resetLocalBookingsForTesting: vi.fn(() => {
      records = [];
    }),
    getVenueBookings: vi.fn(async () => records),
    createVenueBooking: vi.fn(async (params: any) => {
      const duration = params.duration_hours ?? 1;
      const pricePerHour = params.venue.price_per_hour;
      const booking: any = {
        id: "KG-BK-HOOK-CREATED",
        venue_id: params.venue.id,
        court_id: params.court_id ?? null,
        venue_name: params.venue.name,
        venue_area: params.venue.area,
        venue_city: params.venue.city,
        sport: params.sport,
        booking_date: params.booking_date,
        start_time: params.start_time,
        end_time: "09:00:00",
        duration_hours: duration,
        price_per_hour: pricePerHour,
        total_price: pricePerHour * duration,
        status: "pending",
        user_email: params.user_email ?? "guest@khelgrid.com",
        user_phone: params.user_phone ?? "",
        created_at: "2026-10-24T00:00:00.000Z",
        synced_to_db: true,
      };
      records = [booking, ...records];
      return { success: true, booking, message: "Mock atomic booking persisted." };
    }),
    cancelVenueBooking: vi.fn(async (bookingId: string) => {
      const exists = records.some((record) => record.id === bookingId);
      if (exists) {
        records = records.map((record) =>
          record.id === bookingId ? { ...record, status: "cancelled" } : record,
        );
      }
      return exists;
    }),
    holdVenueSlot: vi.fn(async () => ({
      success: false,
      message: "No mock hold was created.",
    })),
    checkSlotAvailability: vi.fn(async () => ({ available: true })),
  };
});

vi.mock("@/lib/booking-service", () => bookingServiceMocks);

const sampleBooking: BookingRecord = {
  id: "KG-BK-TEST-1",
  venue_id: "v-1",
  venue_name: "Decathlon Anubhava",
  venue_area: "Yelahanka",
  venue_city: "Bengaluru",
  sport: "Football",
  booking_date: "2026-10-10",
  start_time: "06:00:00",
  end_time: "07:00:00",
  duration_hours: 1,
  price_per_hour: 800,
  total_price: 800,
  status: "confirmed",
  user_email: "test@khelgrid.com",
  created_at: new Date().toISOString(),
  synced_to_db: false,
};

function TestBookingsConsumer({
  initialBookings = [],
  venueIdFilter,
}: {
  initialBookings?: BookingRecord[];
  venueIdFilter?: string;
}) {
  const { bookings, isLoading, isCreating, error } = useBookings({
    autoFetch: false,
    initialBookings,
    venueIdFilter,
  });

  return (
    <div>
      <span id="booking-count">{bookings.length}</span>
      <span id="loading-state">{String(isLoading)}</span>
      <span id="creating-state">{String(isCreating)}</span>
      <span id="error-state">{error || "none"}</span>
      <div id="booking-ids">
        {bookings.map((b) => (
          <span key={b.id} className="booking-item">
            {`${b.id}:${b.status}`}
          </span>
        ))}
      </div>
    </div>
  );
}

describe("useBookings Custom Hook", () => {
  beforeEach(() => {
    resetLocalBookingsForTesting();
    vi.clearAllMocks();
  });

  it("initializes with provided options and default states", () => {
    const html = renderToString(<TestBookingsConsumer initialBookings={[sampleBooking]} />);

    expect(html).toContain('id="booking-count">1<');
    expect(html).toContain('id="loading-state">false<');
    expect(html).toContain('id="creating-state">false<');
    expect(html).toContain('id="error-state">none<');
    expect(html).toContain("KG-BK-TEST-1:confirmed");
  });

  it("filters bookings when venueIdFilter is specified", () => {
    const venue2Booking: BookingRecord = {
      ...sampleBooking,
      id: "KG-BK-TEST-2",
      venue_id: "v-2",
    };

    const html = renderToString(
      <TestBookingsConsumer initialBookings={[sampleBooking, venue2Booking]} venueIdFilter="v-2" />,
    );

    expect(html).toContain('id="booking-count">2<');
  });

  it("exposes fetchBookings, createBooking, and cancelBooking functions", async () => {
    let hookResult: ReturnType<typeof useBookings> | null = null;

    function Harness() {
      hookResult = useBookings({ autoFetch: false });
      return null;
    }

    renderToString(<Harness />);
    expect(hookResult).toBeDefined();
    expect(typeof hookResult!.fetchBookings).toBe("function");
    expect(typeof hookResult!.createBooking).toBe("function");
    expect(typeof hookResult!.cancelBooking).toBe("function");
    expect(typeof hookResult!.holdSlot).toBe("function");
    expect(typeof hookResult!.checkAvailability).toBe("function");
  });

  it("creates a booking and persists it through the booking service", async () => {
    let hookResult: ReturnType<typeof useBookings> | null = null;

    function Harness() {
      hookResult = useBookings({ autoFetch: false });
      return null;
    }

    renderToString(<Harness />);

    const newBookingParams: CreateBookingParams = {
      venue: {
        id: "v-1",
        name: "Decathlon Arena",
        area: "Yelahanka",
        city: "Bengaluru",
        price_per_hour: 700,
        sports: ["Badminton"],
      },
      sport: "Badminton",
      booking_date: "2026-10-12",
      start_time: "07:00 AM",
      duration_hours: 1,
      user_email: "athlete@khelgrid.com",
    };

    const result = await hookResult!.createBooking(newBookingParams);
    expect(result.success).toBe(true);
    expect(result.booking).toBeDefined();
    expect(result.booking?.sport).toBe("Badminton");
    expect(result.booking?.total_price).toBe(700);

    const fetched = await hookResult!.fetchBookings();
    expect(fetched.some((b) => b.id === result.booking?.id)).toBe(true);
  });

  it("cancels a booking successfully", async () => {
    let hookResult: ReturnType<typeof useBookings> | null = null;

    function Harness() {
      hookResult = useBookings({ autoFetch: false });
      return null;
    }

    renderToString(<Harness />);

    const createRes = await hookResult!.createBooking({
      venue: {
        id: "v-1",
        name: "Decathlon Arena",
        area: "Yelahanka",
        city: "Bengaluru",
        price_per_hour: 700,
        sports: ["Badminton"],
      },
      sport: "Badminton",
      booking_date: "2026-10-14",
      start_time: "08:00 AM",
    });

    const bookingId = createRes.booking!.id;
    const cancelRes = await hookResult!.cancelBooking(bookingId, "Rain");
    expect(cancelRes).toBe(true);

    const updatedList = await hookResult!.fetchBookings();
    const target = updatedList.find((b) => b.id === bookingId);
    expect(target?.status).toBe("cancelled");
  });
});
