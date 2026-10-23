import { useState, useMemo, useCallback, useEffect } from "react";
import { VENUES, type Venue } from "@/data/khelgrid";
import { calculateEndTimeSQL, createVenueBooking, formatTimeToSQL, getVenueBookings, getVenueCourts, type BookingRecord } from "@/lib/booking-service";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
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
  initialVenue?: Venue;
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
    if (options.initialVenue?.id === selectedVenueId) return options.initialVenue;
    return VENUES.find((v) => v.id === selectedVenueId) || VENUES[0];
  }, [selectedVenueId, options.initialVenue]);

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
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsLoadError, setBookingsLoadError] = useState<string | null>(null);
  const [availabilityRows, setAvailabilityRows] = useState<Array<{ start_time: string; end_time: string; status: string; is_held: boolean }> | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [courtsLoading, setCourtsLoading] = useState(false);

  // Update selected sport if current sport is not supported by newly selected venue
  useEffect(() => {
    if (venue && !venue.sports.includes(selectedSport)) {
      setSelectedSport(venue.sports[0] || "Football");
    }
  }, [venue, selectedSport]);

  // Booking truth comes only from Supabase; never silently fall back to browser storage.
  const refreshBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsLoadError(null);
    try {
      const records = await getVenueBookings();
      setExistingBookings(records);
    } catch (loadError) {
      setExistingBookings([]);
      setBookingsLoadError(loadError instanceof Error ? loadError.message : "Bookings could not be loaded.");
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  // Use only courts explicitly published for this venue. Never invent courts.
  const [courts, setCourts] = useState<CourtFacility[]>([]);

  useEffect(() => {
    let active = true;
    setCourts([]);
    setSelectedCourtId("");
    setAvailabilityRows(null);
    setAvailabilityError(null);
    if (!isSupabaseConfigured || !venue?.id) {
      setAvailabilityError("Online booking is not connected here yet. Please contact the venue directly.");
      return () => { active = false; };
    }
    setCourtsLoading(true);
    getVenueCourts(venue.id, selectedSport)
      .then((records) => {
        if (!active) return;
        const mapped: CourtFacility[] = records.map((record) => ({
          id: record.id,
          name: record.name,
          sport: record.sport,
          surface: record.surface_type || "Surface details not provided",
          isIndoor: /indoor|covered/i.test(record.surface_type || ""),
          hasFloodlights: false,
          pricePerHour: record.price_per_hour,
        }));
        setCourts(mapped);
        setSelectedCourtId(mapped[0]?.id || "");
        if (mapped.length === 0) setAvailabilityError("This venue has not published an active court or pitch for online booking. Please contact the venue to confirm a reservation.");
      })
      .catch(() => {
        if (active) setAvailabilityError("We could not load this venue's published courts. Please contact the venue to confirm a reservation.");
      })
      .finally(() => { if (active) setCourtsLoading(false); });
    return () => { active = false; };
  }, [venue?.id, selectedSport]);

  useEffect(() => {
    let active = true;
    setAvailabilityRows(null);
    if (!isSupabaseConfigured || !venue?.id || !selectedCourtId) {
      setAvailabilityLoading(false);
      return () => { active = false; };
    }
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    const rpc = supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{
      data: Array<{ start_time: string; end_time: string; status: string; is_held: boolean }> | null;
      error: { message: string } | null;
    }>;
    rpc("get_venue_slot_availability", {
      p_venue_id: venue.id,
      p_booking_date: selectedDate,
      p_court_id: selectedCourtId,
    })
      .then(({ data, error: rpcError }) => {
        if (!active) return;
        if (rpcError || !data) {
          setAvailabilityRows(null);
          setAvailabilityError("Live slot conflicts could not be checked. Please refresh or contact the venue before booking.");
          return;
        }
        setAvailabilityRows(data);
        setAvailabilityError(null);
      })
      .catch(() => {
        if (active) {
          setAvailabilityRows(null);
          setAvailabilityError("Live slot conflicts could not be checked. Please refresh or contact the venue before booking.");
        }
      })
      .finally(() => { if (active) setAvailabilityLoading(false); });
    return () => { active = false; };
  }, [venue?.id, selectedDate, selectedCourtId]);

  // Keep the selected court valid as published courts load or change.
  useEffect(() => {
    if (courts.length === 0) {
      if (selectedCourtId) setSelectedCourtId("");
      return;
    }
    if (!courts.some((court) => court.id === selectedCourtId)) setSelectedCourtId(courts[0].id);
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

  // Show slots only after the live conflict check succeeds. No seeded/fake availability.
  const slots: CourtSlot[] = useMemo(() => {
    if (!isSupabaseConfigured || courts.length === 0 || !selectedCourtId || availabilityRows === null) return [];
    const baseRate = courts.find((court) => court.id === selectedCourtId)?.pricePerHour ?? venue.pricePerHour ?? 0;
    return DEFAULT_HOURS.map((hour, index) => {
      const startSQL = formatTimeToSQL(hour.time);
      const endSQL = calculateEndTimeSQL(hour.time, durationHours);
      const hasConflict = availabilityRows.some((booking) => startSQL < booking.end_time && endSQL > booking.start_time);
      // Use the published venue rate; do not invent peak surcharges or discounts.
      const status: CourtSlot["status"] = hasConflict ? "booked" : selectedSlotTime === hour.time ? "selected" : "available";
      return {
        id: `slot-${index}-${hour.time.replace(/[^a-zA-Z0-9]/g, "")}`,
        courtId: selectedCourtId,
        courtName: courts.find((court) => court.id === selectedCourtId)?.name || "Court",
        time: hour.time,
        endTime: calculateSlotEndTime(hour.time, durationHours),
        period: hour.period,
        basePrice: baseRate,
        finalPrice: baseRate,
        status,
        isPeak: false,
        isDiscounted: false,
        discountPercent: undefined,
        remainingCapacity: hasConflict ? 0 : 1,
      };
    });
  }, [venue, selectedCourtId, durationHours, selectedSlotTime, courts, availabilityRows, calculateSlotEndTime]);

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
    const baseRate = courts.find((court) => court.id === selectedCourtId)?.pricePerHour ?? venue.pricePerHour ?? 0;
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
    // KhelGrid does not charge a platform or convenience fee in this phase.
    const taxesAndFees = 0;
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
  }, [venue, courts, selectedCourtId, selectedSlot, durationHours, selectedAddonIds]);

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
    if (!isSupabaseConfigured || !selectedCourtId || availabilityRows === null || availabilityError) {
      setError(availabilityError || "Live booking is unavailable until this venue publishes courts and its slot schedule.");
      return { success: false, error: availabilityError || "Live booking is unavailable." };
    }

    if (!selectedSlotTime || !selectedSlot || selectedSlot.status === "booked") {
      setError("Please choose a slot that has no recorded booking conflict.");
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
        court_id: selectedCourtId,
        court_name: courts.find((court) => court.id === selectedCourtId)?.name,
        sport: selectedSport,
        booking_date: selectedDate,
        start_time: selectedSlotTime,
        duration_hours: durationHours,
        user_email: customer.email || "guest@khelgrid.com",
        user_phone: customer.phone,
        total_price: priceBreakdown.grandTotal,
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
    selectedSlot,
    selectedCourtId,
    courts,
    availabilityRows,
    availabilityError,
    customer,
    venue,
    selectedSport,
    selectedDate,
    durationHours,
    priceBreakdown.grandTotal,
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
    courtsLoading,
    bookingsLoading,
    bookingsLoadError,
    availabilityLoading,
    availabilityError,

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
