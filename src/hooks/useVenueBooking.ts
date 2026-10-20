import { useState, useMemo, useCallback, useEffect } from "react";
import { VENUES, type Venue } from "@/data/khelgrid";
import { createVenueBooking, getVenueBookings, type BookingRecord } from "@/lib/booking-service";
import type {
  CourtFacility,
  CourtSlot,
  BookingAddon,
  CustomerInfo,
  BookingPriceBreakdown,
  SlotPeriod,
} from "@/types/venue-booking";
import { format, addHours, parse, isValid, startOfToday } from "date-fns";

export const STANDARD_ADDONS: BookingAddon[] = [
  {
    id: "addon-equipment",
    name: "Pro Sports Kit / Rackets",
    description: "2 Premium rackets/bats & approved match balls/shuttles",
    price: 150,
    iconName: "trophy",
    category: "equipment",
  },
  {
    id: "addon-bibs",
    name: "Team Bibs & Marker Cones",
    description: "Set of 10 fluorescent team bibs for match play",
    price: 100,
    iconName: "shield",
    category: "equipment",
  },
  {
    id: "addon-hydration",
    name: "Hydration & Energy Pack",
    description: "Chilled mineral water (4x) & isotonic energy drinks",
    price: 120,
    iconName: "zap",
    category: "beverage",
  },
  {
    id: "addon-referee",
    name: "Certified Match Referee",
    description: "Official referee / court umpire for competitive games",
    price: 350,
    iconName: "sparkles",
    category: "service",
  },
];

const DEFAULT_HOURS = [
  { time: "06:00 AM", period: "morning" as const, peak: false, discount: 15 },
  { time: "07:00 AM", period: "morning" as const, peak: false, discount: 15 },
  { time: "08:00 AM", period: "morning" as const, peak: false, discount: 10 },
  { time: "09:00 AM", period: "morning" as const, peak: false, discount: 0 },
  { time: "10:00 AM", period: "morning" as const, peak: false, discount: 0 },
  { time: "11:00 AM", period: "morning" as const, peak: false, discount: 0 },
  { time: "12:00 PM", period: "afternoon" as const, peak: false, discount: 10 },
  { time: "01:00 PM", period: "afternoon" as const, peak: false, discount: 10 },
  { time: "02:00 PM", period: "afternoon" as const, peak: false, discount: 10 },
  { time: "03:00 PM", period: "afternoon" as const, peak: false, discount: 0 },
  { time: "04:00 PM", period: "afternoon" as const, peak: false, discount: 0 },
  { time: "05:00 PM", period: "evening" as const, peak: true, discount: 0 },
  { time: "06:00 PM", period: "evening" as const, peak: true, discount: 0 },
  { time: "07:00 PM", period: "evening" as const, peak: true, discount: 0 },
  { time: "08:00 PM", period: "evening" as const, peak: true, discount: 0 },
  { time: "09:00 PM", period: "night" as const, peak: true, discount: 0 },
  { time: "10:00 PM", period: "night" as const, peak: false, discount: 0 },
  { time: "11:00 PM", period: "night" as const, peak: false, discount: 15 },
];

export interface UseVenueBookingOptions {
  initialVenueId?: string;
  initialSport?: string;
  initialDate?: string;
  initialTime?: string;
  initialCourtId?: string;
}

export function useVenueBooking(options: UseVenueBookingOptions = {}) {
  const todayStr = useMemo(() => format(startOfToday(), "yyyy-MM-dd"), []);

  // 1. Core local state
  const [selectedVenueId, setSelectedVenueId] = useState<string>(
    options.initialVenueId || VENUES[0]?.id || "v-1",
  );

  const venue: Venue = useMemo(() => {
    return VENUES.find((v) => v.id === selectedVenueId) || VENUES[0];
  }, [selectedVenueId]);

  const [selectedSport, setSelectedSport] = useState<string>(
    options.initialSport || venue.sports[0] || "Football",
  );

  const [selectedDate, setSelectedDate] = useState<string>(options.initialDate || todayStr);

  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    options.initialCourtId || "court-1",
  );

  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(
    options.initialTime || null,
  );

  const [durationHours, setDurationHours] = useState<number>(1);
  const [periodFilter, setPeriodFilter] = useState<SlotPeriod>("all");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    playerCount: 4,
    teamName: "",
    specialRequests: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<BookingRecord[]>([]);

  // Update selected sport if current sport is not supported by newly selected venue
  useEffect(() => {
    if (venue && !venue.sports.includes(selectedSport)) {
      setSelectedSport(venue.sports[0] || "Football");
    }
  }, [venue, selectedSport]);

  // Load existing bookings from local storage / service
  const refreshBookings = useCallback(async () => {
    try {
      const records = await getVenueBookings();
      setExistingBookings(records);
    } catch {
      // Local fallback
    }
  }, []);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  // Generate dynamic courts based on the selected sport and venue
  const courts: CourtFacility[] = useMemo(() => {
    const sportName = selectedSport;
    let surfaceType = "Synthetic Turf";
    let isIndoor = false;

    if (sportName.includes("Badminton")) {
      surfaceType = "BWF Approved Synthetic Wooden Mat";
      isIndoor = true;
    } else if (sportName.includes("Football")) {
      surfaceType = "FIFA Certified 50mm Monofilament Turf";
      isIndoor = false;
    } else if (sportName.includes("Cricket")) {
      surfaceType = "High-Density Polypropylene AstroTurf Net";
      isIndoor = false;
    } else if (sportName.includes("Tennis")) {
      surfaceType = "Plexipave Acrylic Hard Court";
      isIndoor = false;
    } else if (sportName.includes("Basketball")) {
      surfaceType = "Maple Hardwood Indoor Court";
      isIndoor = true;
    } else if (sportName.includes("Swimming")) {
      surfaceType = "Olympic Spec Heated Pool (25m)";
      isIndoor = true;
    }

    return [
      {
        id: "court-1",
        name: `${sportName} Court 1 (Main Arena)`,
        sport: sportName,
        surface: surfaceType,
        isIndoor,
        hasFloodlights: true,
      },
      {
        id: "court-2",
        name: `${sportName} Court 2 (Side Wing)`,
        sport: sportName,
        surface: surfaceType,
        isIndoor,
        hasFloodlights: true,
      },
      {
        id: "court-3",
        name: `${sportName} Court 3 (Practice Court)`,
        sport: sportName,
        surface: surfaceType,
        isIndoor,
        hasFloodlights: false,
      },
    ];
  }, [selectedSport]);

  // Ensure valid selected court
  useEffect(() => {
    if (!courts.some((c) => c.id === selectedCourtId)) {
      setSelectedCourtId(courts[0]?.id || "court-1");
    }
  }, [courts, selectedCourtId]);

  // Calculate dynamic endTime based on duration
  const calculateSlotEndTime = useCallback((startTimeStr: string, duration: number) => {
    try {
      const parsed = parse(startTimeStr, "hh:mm a", new Date());
      if (isValid(parsed)) {
        const end = addHours(parsed, duration);
        return format(end, "hh:mm a");
      }
    } catch {
      // Fallback
    }
    return startTimeStr;
  }, []);

  // Generate slots for selected venue, date, and court
  const slots: CourtSlot[] = useMemo(() => {
    const baseRate = venue.pricePerHour || 600;

    // Seed deterministic availability per venue + date + court
    const seed = `${venue.id}-${selectedDate}-${selectedCourtId}`
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return DEFAULT_HOURS.map((h, index) => {
      const slotEndTime = calculateSlotEndTime(h.time, durationHours);

      // Check if slot has already been booked in local storage / database
      const isBookedInDb = existingBookings.some((b) => {
        return (
          b.status !== "cancelled" &&
          b.venue_id === venue.id &&
          b.booking_date === selectedDate &&
          b.start_time.trim().toLowerCase() === h.time.trim().toLowerCase()
        );
      });

      // Deterministic pseudo-booked pattern for realism if not already booked
      const isSeedBooked = (seed + index * 11) % 7 === 0;
      const isBooked = isBookedInDb || isSeedBooked;

      // Deterministic fast-filling flag
      const isFastFilling = !isBooked && (seed + index * 5) % 4 === 0;

      // Price calculation
      let slotBase = baseRate;
      if (h.peak) {
        slotBase = Math.round(baseRate * 1.15); // +15% peak surcharge
      } else if (h.discount > 0) {
        slotBase = Math.round(baseRate * (1 - h.discount / 100)); // discount
      }

      let status: CourtSlot["status"] = "available";
      if (isBooked) {
        status = "booked";
      } else if (selectedSlotTime === h.time) {
        status = "selected";
      } else if (isFastFilling) {
        status = "fast_filling";
      }

      return {
        id: `slot-${index}-${h.time.replace(/[^a-zA-Z0-9]/g, "")}`,
        courtId: selectedCourtId,
        courtName: courts.find((c) => c.id === selectedCourtId)?.name || "Court 1",
        time: h.time,
        endTime: slotEndTime,
        period: h.period,
        basePrice: baseRate,
        finalPrice: slotBase,
        status,
        isPeak: h.peak,
        isDiscounted: h.discount > 0,
        discountPercent: h.discount > 0 ? h.discount : undefined,
        remainingCapacity: isBooked ? 0 : isFastFilling ? 1 : 3,
      };
    });
  }, [
    venue,
    selectedDate,
    selectedCourtId,
    durationHours,
    selectedSlotTime,
    existingBookings,
    calculateSlotEndTime,
    courts,
  ]);

  // Filtered slots by time of day (morning, afternoon, evening, night)
  const filteredSlots = useMemo(() => {
    if (periodFilter === "all") return slots;
    return slots.filter((s) => s.period === periodFilter);
  }, [slots, periodFilter]);

  // Selected slot object
  const selectedSlot = useMemo(() => {
    if (!selectedSlotTime) return null;
    return slots.find((s) => s.time === selectedSlotTime) || null;
  }, [slots, selectedSlotTime]);

  // Calculate detailed price breakdown
  const priceBreakdown: BookingPriceBreakdown = useMemo(() => {
    const baseRate = venue.pricePerHour || 600;
    const slotRate = selectedSlot ? selectedSlot.finalPrice : baseRate;
    const courtTotal = slotRate * durationHours;

    let peakSurcharge = 0;
    let offPeakDiscount = 0;

    if (selectedSlot?.isPeak) {
      peakSurcharge = Math.round(baseRate * 0.15 * durationHours);
    } else if (selectedSlot?.isDiscounted && selectedSlot.discountPercent) {
      offPeakDiscount = Math.round(baseRate * (selectedSlot.discountPercent / 100) * durationHours);
    }

    const addonsTotal = selectedAddonIds.reduce((sum, id) => {
      const addon = STANDARD_ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.price : 0);
    }, 0);

    const subtotal = courtTotal + addonsTotal;
    // Platform fee + convenience GST
    const taxesAndFees = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxesAndFees;

    return {
      baseRatePerHour: baseRate,
      durationHours,
      courtTotal,
      peakSurcharge,
      offPeakDiscount,
      addonsTotal,
      subtotal,
      taxesAndFees,
      grandTotal,
    };
  }, [venue, selectedSlot, durationHours, selectedAddonIds]);

  // Addon toggle
  const toggleAddon = useCallback((addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId],
    );
  }, []);

  // Update customer information
  const updateCustomer = useCallback((fields: Partial<CustomerInfo>) => {
    setCustomer((prev) => ({ ...prev, ...fields }));
  }, []);

  // Confirm booking
  const confirmBooking = useCallback(async (): Promise<{
    success: boolean;
    booking?: BookingRecord;
    error?: string;
  }> => {
    if (!selectedSlotTime) {
      setError("Please choose an available time slot before continuing.");
      return { success: false, error: "Please choose an available time slot." };
    }

    if (!customer.fullName.trim()) {
      setError("Please provide your full name for the booking.");
      return { success: false, error: "Please provide your full name." };
    }

    if (!customer.phone.trim()) {
      setError("Please provide your contact phone number.");
      return { success: false, error: "Please provide your contact phone number." };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await createVenueBooking({
        venue: {
          id: venue.id,
          name: venue.name,
          area: venue.area,
          city: venue.city,
          price_per_hour: venue.pricePerHour,
          sports: venue.sports,
          image_url: venue.image,
        },
        sport: selectedSport,
        booking_date: selectedDate,
        start_time: selectedSlotTime,
        duration_hours: durationHours,
        user_email: customer.email || "guest@khelgrid.com",
        user_phone: customer.phone,
      });

      if (res.success && res.booking) {
        setBookingSuccess(res.booking);
        // Refresh local bookings list so the slot immediately reflects as booked
        await refreshBookings();
        return { success: true, booking: res.booking };
      } else {
        throw new Error(res.message || "Failed to reserve slot.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Booking reservation failed.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedSlotTime,
    customer,
    venue,
    selectedSport,
    selectedDate,
    durationHours,
    refreshBookings,
  ]);

  // Reset booking form
  const resetForm = useCallback(() => {
    setSelectedSlotTime(null);
    setSelectedAddonIds([]);
    setBookingSuccess(null);
    setError(null);
  }, []);

  return {
    // Venue & Sport
    selectedVenueId,
    setSelectedVenueId,
    venue,
    allVenues: VENUES,
    selectedSport,
    setSelectedSport,
    availableSports: venue.sports,

    // Date & Calendar
    selectedDate,
    setSelectedDate,
    todayStr,

    // Courts & Facilities
    courts,
    selectedCourtId,
    setSelectedCourtId,

    // Slots
    slots,
    filteredSlots,
    selectedSlotTime,
    setSelectedSlotTime,
    selectedSlot,
    durationHours,
    setDurationHours,
    periodFilter,
    setPeriodFilter,

    // Addons
    addons: STANDARD_ADDONS,
    selectedAddonIds,
    toggleAddon,

    // Customer
    customer,
    updateCustomer,

    // Calculations
    priceBreakdown,

    // Submission & State
    isSubmitting,
    bookingSuccess,
    error,
    confirmBooking,
    resetForm,
    refreshBookings,
  };
}
