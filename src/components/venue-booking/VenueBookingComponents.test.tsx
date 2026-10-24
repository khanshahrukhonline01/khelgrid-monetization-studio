import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueBookingCalendar } from "./VenueBookingCalendar";
import { VenueSlotSelector } from "./VenueSlotSelector";
import { VenueBookingForm } from "./VenueBookingForm";
import type { CourtFacility, CourtSlot } from "@/types/venue-booking";

describe("VenueBookingCalendar Component", () => {
  it("renders calendar month header and navigation", () => {
    const html = renderToString(
      <VenueBookingCalendar
        selectedDate="2026-09-22"
        onSelectDate={vi.fn()}
        venueName="Decathlon Anubhava"
      />,
    );

    expect(html).toContain("Select Booking Date");
    expect(html).toContain("Decathlon Anubhava");
    expect(html).toContain("Quick:");
    expect(html).toContain("Today");
    expect(html).toContain("Mon");
    expect(html).toContain("Sun");
  });

  it("explains that live availability is checked after date selection", () => {
    const html = renderToString(
      <VenueBookingCalendar selectedDate="2026-09-22" onSelectDate={vi.fn()} />,
    );

    expect(html).toContain("Select a date to check live court availability");
    expect(html).toContain("Past / Closed");
    expect(html).toContain("Selected:");
    expect(html).not.toContain("Fast Filling");
  });
});

describe("VenueSlotSelector Component", () => {
  const mockCourts: CourtFacility[] = [
    {
      id: "court-1",
      name: "Football Pitch 1",
      sport: "Football",
      surface: "FIFA 50mm Monofilament Turf",
      isIndoor: false,
      hasFloodlights: true,
    },
    {
      id: "court-2",
      name: "Football Pitch 2",
      sport: "Football",
      surface: "FIFA 50mm Monofilament Turf",
      isIndoor: false,
      hasFloodlights: true,
    },
  ];

  const mockSlots: CourtSlot[] = [
    {
      id: "slot-1",
      courtId: "court-1",
      courtName: "Football Pitch 1",
      time: "06:00 AM",
      endTime: "07:00 AM",
      period: "morning",
      basePrice: 600,
      finalPrice: 510,
      status: "available",
      isPeak: false,
      isDiscounted: true,
      discountPercent: 15,
      remainingCapacity: 3,
    },
    {
      id: "slot-2",
      courtId: "court-1",
      courtName: "Football Pitch 1",
      time: "07:00 PM",
      endTime: "08:00 PM",
      period: "evening",
      basePrice: 600,
      finalPrice: 690,
      status: "selected",
      isPeak: true,
      isDiscounted: false,
      remainingCapacity: 2,
    },
  ];

  it("renders sports pills, courts, duration, and time slots", () => {
    const html = renderToString(
      <VenueSlotSelector
        sports={["Football", "Cricket"]}
        selectedSport="Football"
        onSelectSport={vi.fn()}
        courts={mockCourts}
        selectedCourtId="court-1"
        onSelectCourt={vi.fn()}
        slots={mockSlots}
        selectedSlotTime="07:00 PM"
        onSelectSlot={vi.fn()}
        durationHours={1}
        onDurationChange={vi.fn()}
        periodFilter="all"
        onPeriodFilterChange={vi.fn()}
      />,
    );

    expect(html).toContain("Select Sport");
    expect(html).toContain("Football Pitch 1");
    expect(html).toContain("Booking Duration");
    expect(html).toContain("Available Time Slots");
    expect(html).toContain("06:00 AM");
    expect(html).toContain("07:00 PM");
    expect(html).toContain("Slot Confirmed:");
    expect(html).toContain("Football Pitch 1");
    expect(html).toContain("Ready to proceed");
  });
});

describe("VenueBookingForm Component", () => {
  it("renders comprehensive booking form with pricing and player details", () => {
    const html = renderToString(<VenueBookingForm />);

    expect(html).toContain("Interactive Slot Booking");
    expect(html).toContain("Select Booking Date");
    expect(html).toContain("Optional Add-ons &amp; Equipment");
    expect(html).toContain("Player &amp; Contact Information");
    expect(html).toContain("Price Calculation Breakdown");
    expect(html).toContain("Total Payable Amount");
  });
});
