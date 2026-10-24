import { supabase, isSupabaseConfigured } from "./supabase";
import { VENUES, type Venue } from "@/data/khelgrid";
import type { Database } from "@/types/database";

export interface CourtRecord {
  id: string;
  venue_id: string;
  name: string;
  sport: string;
  surface_type?: string | null;
  price_per_hour?: number | null;
  is_active: boolean;
  booking_enabled?: boolean;
  operating_hours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
}

export interface BookingRecord {
  id: string;
  venue_id: string;
  court_id?: string | null;
  court_name?: string;
  venue_name: string;
  venue_area: string;
  venue_city: string;
  venue_image?: string;
  sport: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  price_per_hour: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  idempotency_key?: string;
  held_until?: string;
  user_email: string;
  user_phone?: string;
  created_at: string;
  synced_to_db: boolean;
}

interface SupabaseBookingJoinedRow {
  id: string;
  venue_id: string;
  court_id?: string | null;
  venues?: {
    name?: string;
    area?: string;
    city?: string;
    image_url?: string;
  } | null;
  sport: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number | string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  idempotency_key?: string | null;
  held_until?: string | null;
  user_email?: string;
  user_phone?: string;
  created_at?: string;
}

/** Compatibility test helper; bookings are no longer stored in browser memory. */
export function resetLocalBookingsForTesting(): void {
  // Intentionally empty: Supabase is the only booking source of truth.
}

/**
 * Converts 12-hour time (e.g. "6:00 PM") to 24-hour SQL format (e.g. "18:00:00")
 */
export function formatTimeToSQL(timeStr: string): string {
  if (!timeStr) return "06:00:00";
  const trimmed = timeStr.trim();

  // If already in 24-hour format
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return "06:00:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

/**
 * Calculate end time given a start time string (e.g. "6:00 PM") and duration hours
 */
export function calculateEndTimeSQL(timeStr: string, durationHours: number = 1): string {
  const sqlStart = formatTimeToSQL(timeStr);
  const [h, m, s] = sqlStart.split(":").map(Number);
  const endHour = (h + durationHours) % 24;
  return `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s || 0).padStart(2, "0")}`;
}

/**
 * Fetch active courts from the database. Empty results mean no courts are published;
 * connection and permission failures are thrown so the UI can distinguish them.
 */
export async function getVenueCourts(venueId: string, sport?: string): Promise<CourtRecord[]> {
  if (!isSupabaseConfigured) {
    throw new Error("Online booking is not configured.");
  }

  let query = supabase
    .from("venue_courts")
    .select("*")
    .eq("venue_id", venueId)
    .eq("is_active", true)
    .eq("booking_enabled", true);

  if (sport) query = query.eq("sport", sport);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load published courts: ${error.message}`);
  return (data ?? []) as CourtRecord[];
}

/**
 * Reads booking records exclusively from Supabase. Browser storage is never merged
 * into booking truth; database failures are surfaced to the calling UI.
 */
export async function getVenueBookings(): Promise<BookingRecord[]> {
  if (!isSupabaseConfigured) throw new Error("Online booking is not configured.");

  const { data, error } = await supabase
    .from("venue_bookings")
    .select("*, venues(name, area, city, image_url)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load bookings: ${error.message}`);

  const rows = (data ?? []) as unknown as SupabaseBookingJoinedRow[];
  return rows.map((item) => {
    const start = formatTimeToSQL(item.start_time);
    const end = formatTimeToSQL(item.end_time);
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const duration = Math.max(1, ((eh * 60 + em) - (sh * 60 + sm) + 1440) % 1440 / 60);
    const total = Number(item.total_price) || 0;
    return {
      id: item.id,
      venue_id: item.venue_id,
      court_id: item.court_id ?? null,
      venue_name: item.venues?.name || "Sports Venue",
      venue_area: item.venues?.area || "",
      venue_city: item.venues?.city || "",
      venue_image: item.venues?.image_url,
      sport: item.sport,
      booking_date: item.booking_date,
      start_time: item.start_time,
      end_time: item.end_time,
      duration_hours: duration,
      price_per_hour: duration > 0 ? total / duration : total,
      total_price: total,
      status: item.status,
      idempotency_key: item.idempotency_key || undefined,
      held_until: item.held_until || undefined,
      user_email: item.user_email || "",
      user_phone: item.user_phone || "",
      created_at: item.created_at || "",
      synced_to_db: true,
    };
  });
}

interface SlotAvailabilityRpcRow {
  court_id: string | null;
  start_time: string;
  end_time: string;
  status: string;
  is_held: boolean;
}

interface AtomicBookingRpcResponse {
  success: boolean;
  already_processed?: boolean;
  booking_id?: string;
  status?: string;
  total_price?: number;
  held_until?: string | null;
  error_code?: string;
  message: string;
}

interface CancelBookingRpcResponse {
  success: boolean;
  booking_id?: string;
  error_code?: string;
  message: string;
}

/**
 * Checks if a specific slot is currently booked or held by an active user.
 * Prioritizes privacy-preserving atomic availability RPC; falls back to direct query.
 */
export async function checkSlotAvailability(params: {
  venue_id: string;
  court_id?: string;
  booking_date: string;
  start_time: string;
  duration_hours?: number;
}): Promise<{ available: boolean; conflictReason?: string }> {
  if (!isSupabaseConfigured) {
    return { available: false, conflictReason: "Online availability is not connected. Please contact the venue directly." };
  }

  const startTimeSQL = formatTimeToSQL(params.start_time);
  const endTimeSQL = calculateEndTimeSQL(params.start_time, params.duration_hours || 1);

  if (!params.court_id) {
    return { available: false, conflictReason: "Select a published court before checking availability." };
  }

  try {
    const { data: rpcData, error: rpcError } = await (
      supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: SlotAvailabilityRpcRow[] | null; error: { message: string } | null }>
    )("get_venue_slot_availability", {
      p_venue_id: params.venue_id,
      p_booking_date: params.booking_date,
      p_court_id: params.court_id,
    });

    if (rpcError || !rpcData) {
      return { available: false, conflictReason: "Live court availability could not be verified. No booking will be submitted; please retry." };
    }

    for (const slot of rpcData) {
      if (startTimeSQL < slot.end_time && endTimeSQL > slot.start_time) {
        return {
          available: false,
          conflictReason: slot.status === "confirmed"
            ? "This court slot is already booked."
            : "This court slot is temporarily held by another customer.",
        };
      }
    }
    return { available: true };
  } catch {
    return { available: false, conflictReason: "Live court availability could not be verified. No booking will be submitted; please retry." };
  }
}

/**
 * Persists a new booking through the database's atomic booking RPC and idempotency checks.
 */
export async function createVenueBooking(params: {
  venue: {
    id: string;
    name: string;
    area: string;
    city: string;
    price_per_hour: number;
    sports: string[];
    image_url?: string;
  };
  court_id?: string;
  court_name?: string;
  sport: string;
  booking_date: string;
  start_time: string;
  duration_hours?: number;
  court_price_per_hour: number;
  total_price?: number;
  user_email?: string;
  user_phone?: string;
  idempotency_key?: string;
}): Promise<{
  success: boolean;
  booking?: BookingRecord;
  message: string;
}> {
  const duration = params.duration_hours || 1;
  const totalPrice = params.total_price ?? params.court_price_per_hour * duration;
  const startTimeSQL = formatTimeToSQL(params.start_time);
  const endTimeSQL = calculateEndTimeSQL(params.start_time, duration);

  // Generate an idempotency key if not supplied
  const idempotencyKey =
    params.idempotency_key ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `key-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Verify availability before proceeding
  const availability = await checkSlotAvailability({
    venue_id: params.venue.id,
    court_id: params.court_id,
    booking_date: params.booking_date,
    start_time: params.start_time,
    duration_hours: duration,
  });

  if (!availability.available) {
    return {
      success: false,
      message:
        availability.conflictReason ||
        "The selected court slot is no longer available. Please pick another time.",
    };
  }

  const bookingId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, "0").slice(-12)}`;

  const bookingRecord: BookingRecord = {
    id: bookingId,
    venue_id: params.venue.id,
    court_id: params.court_id || null,
    court_name: params.court_name || "Main Court",
    venue_name: params.venue.name,
    venue_area: params.venue.area,
    venue_city: params.venue.city,
    venue_image: params.venue.image_url,
    sport: params.sport,
    booking_date: params.booking_date,
    start_time: params.start_time,
    end_time: endTimeSQL,
    duration_hours: duration,
    price_per_hour: params.court_price_per_hour,
    total_price: totalPrice,
    status: "pending",
    idempotency_key: idempotencyKey,
    user_email: params.user_email || "guest@khelgrid.com",
    user_phone: params.user_phone || "",
    created_at: new Date().toISOString(),
    synced_to_db: false,
  };

  // 1. Persist to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      // Only venues published in the live directory can be booked. Never promote sample cards into database venues.
      const { data: existingVenue, error: venueLookupError } = await supabase
        .from("venues")
        .select("id")
        .eq("id", params.venue.id)
        .maybeSingle();

      if (venueLookupError || !existingVenue) {
        return {
          success: false,
          message: "This is a sample listing or is not connected to live booking yet. Please contact the venue directly.",
        };
      }

      // 1A. Attempt Atomic RPC Booking with Advisory Lock & Pessimistic Concurrency
      let atomicCompleted = false;
      try {
        const { data: rpcRes, error: rpcError } = await (
          supabase.rpc as unknown as (
            fn: string,
            args: Record<string, unknown>,
          ) => Promise<{ data: AtomicBookingRpcResponse | null; error: { message: string } | null }>
        )("book_venue_slot_atomic", {
          p_venue_id: params.venue.id,
          p_court_id: params.court_id || null,
          p_sport: bookingRecord.sport,
          p_booking_date: bookingRecord.booking_date,
          p_start_time: startTimeSQL,
          p_end_time: endTimeSQL,
          p_total_price: totalPrice,
          p_user_email: bookingRecord.user_email,
          p_user_phone: bookingRecord.user_phone,
          p_idempotency_key: idempotencyKey,
          p_status: "pending",
          p_custom_booking_id: bookingId,
        });

        if (!rpcError && rpcRes) {
          atomicCompleted = true;
          if (!rpcRes.success) {
            return {
              success: false,
              message:
                rpcRes.message ||
                "Conflict detected: This slot was just reserved by another player. Please select another slot.",
            };
          }
          if (rpcRes.booking_id) {
            bookingRecord.id = rpcRes.booking_id;
          }
          bookingRecord.synced_to_db = true;
        }
      } catch (rpcErr) {
        console.warn("Atomic RPC booking invocation fallback:", rpcErr);
      }

      // Never fall back to a non-atomic insert: it can race and double-book a slot.
      if (!atomicCompleted) {
        return {
          success: false,
          message: "The booking protection service is unavailable. No reservation was created. Please retry shortly.",
        };
      }
    } catch (dbErr: unknown) {
      const errObj = dbErr as { code?: string; message?: string } | null;
      if (errObj?.code === "23P01") {
        return {
          success: false,
          message:
            "Conflict detected: This slot was just reserved by another player. Please select another slot.",
        };
      }
      console.warn("Supabase booking insert warning:", dbErr);
      return { success: false, message: "The booking could not be saved online. No reservation has been confirmed. Please try again or contact the venue." };
    }
  } else {
    return { success: false, message: "Online booking is not connected in this environment. Please contact the venue directly." };
  }

  // Notify active views; persisted booking data is always re-read from Supabase.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("khelgrid_booking_created", { detail: bookingRecord }));
  }

  return {
    success: true,
    booking: bookingRecord,
    message: bookingRecord.synced_to_db
      ? "Booking request recorded online; contact the venue to confirm acceptance."
      : "Booking request saved on this device; online confirmation is unavailable.",
  };
}

/**
 * Holds a venue slot atomically for checkout (temporary lock with auto-expiry).
 */
export async function holdVenueSlot(params: {
  venue_id: string;
  court_id?: string;
  sport?: string;
  booking_date: string;
  start_time: string;
  duration_hours?: number;
  price_per_hour?: number;
  user_email?: string;
  user_phone?: string;
  idempotency_key?: string;
  hold_duration_minutes?: number;
}): Promise<{
  success: boolean;
  booking_id?: string;
  held_until?: string | null;
  message: string;
}> {
  const duration = params.duration_hours || 1;
  // Never create a hold using a guessed/default rate. The caller must pass a
  // published positive court rate; the database RPC revalidates it atomically.
  if (!Number.isFinite(params.price_per_hour) || (params.price_per_hour ?? 0) <= 0) {
    return {
      success: false,
      message: "A published court price is required before a slot can be held. No hold was created.",
    };
  }
  if (!Number.isFinite(duration) || duration <= 0) {
    return {
      success: false,
      message: "A valid booking duration is required before a slot can be held. No hold was created.",
    };
  }
  const totalPrice = params.price_per_hour * duration;
  const startTimeSQL = formatTimeToSQL(params.start_time);
  const endTimeSQL = calculateEndTimeSQL(params.start_time, duration);
  const idempotencyKey =
    params.idempotency_key ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `hold-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  if (isSupabaseConfigured) {
    try {
      const { data: rpcRes, error: rpcError } = await (
        supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: AtomicBookingRpcResponse | null; error: { message: string } | null }>
      )("hold_venue_slot_atomic", {
        p_venue_id: params.venue_id,
        p_court_id: params.court_id || null,
        p_sport: params.sport || "Multi-Sport",
        p_booking_date: params.booking_date,
        p_start_time: startTimeSQL,
        p_end_time: endTimeSQL,
        p_total_price: totalPrice,
        p_user_email: params.user_email || null,
        p_user_phone: params.user_phone || null,
        p_idempotency_key: idempotencyKey,
        p_hold_duration_minutes: params.hold_duration_minutes || 10,
      });

      if (!rpcError && rpcRes) {
        return {
          success: rpcRes.success,
          booking_id: rpcRes.booking_id,
          held_until: rpcRes.held_until,
          message: rpcRes.message,
        };
      }
    } catch (err) {
      console.warn("Hold slot RPC error:", err);
    }
  }

  return {
    success: false,
    message: "The live slot-hold service is unavailable. No slot has been reserved. Please retry shortly.",
  };
}

/**
 * Cancel an existing booking (soft delete / status change with atomic RPC support)
 */
export async function cancelVenueBooking(bookingId: string, reason?: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  if (isSupabaseConfigured) {
    // 1. Attempt atomic cancellation RPC
    let rpcSuccess = false;
    try {
      const { data, error } = await (
        supabase.rpc as unknown as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: CancelBookingRpcResponse | null; error: { message: string } | null }>
      )("cancel_venue_booking_atomic", {
        p_booking_id: bookingId,
        p_reason: reason || null,
      });

      if (!error && data?.success) {
        rpcSuccess = true;
      }
    } catch (rpcErr) {
      console.warn("Cancel atomic RPC failed, falling back to direct update:", rpcErr);
    }

    if (!rpcSuccess) {
      try {
        await supabase
          .from("venue_bookings")
          .update({
            status: "cancelled",
            deleted_at: new Date().toISOString(),
          })
          .eq("id", bookingId);
      } catch (e) {
        console.warn("Direct cancel update error:", e);
      }
    }
  }

  return true;
}

/**
 * Lightweight real-time slot subscription (Supabase Free Tier friendly).
 * Listens only to bookings for a specific venue on a specific date to conserve message quotas.
 */
export function subscribeToVenueSlots(
  venueId: string,
  bookingDate: string,
  onSlotChanged: () => void,
): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const channelName = `venue_slots_${venueId.slice(0, 8)}_${bookingDate}`;
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "venue_bookings",
        filter: `venue_id=eq.${venueId}`,
      },
      () => {
        onSlotChanged();
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Helper to seed all default KhelGrid venues and courts directly into the connected Supabase database
 */
export async function seedAllVenuesToDatabase(): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, count: 0, error: "Supabase anon key is not configured yet." };
  }

  try {
    const venuesToInsert = VENUES.map((v) => ({
      id: v.id,
      name: v.name,
      slug: v.id,
      area: v.area,
      city: v.city,
      address: `${v.area}, ${v.city}`,
      sports: v.sports,
      amenities: ["Floodlights", "Changing Rooms", "Parking", "Drinking Water"],
      price_per_hour: v.pricePerHour,
      rating: v.rating,
      reviews_count: v.reviews,
      featured: Boolean(v.featured),
      bookable: Boolean(v.bookable),
      image_url: v.image,
      contact_phone: "+91 98765 43210",
      contact_email: "support@khelgrid.com",
    }));

    const { error: venueError } = await supabase
      .from("venues")
      .upsert(venuesToInsert, { onConflict: "id" });

    if (venueError) {
      return { success: false, count: 0, error: venueError.message };
    }

    // Also populate default courts for all seeded venues
    const courtsToInsert = VENUES.flatMap((v) =>
      v.sports.slice(0, 2).map((sport, index) => ({
        id: `${v.id}-court-${index + 1}`,
        venue_id: v.id,
        name: `${v.name} - ${sport} Court ${index + 1}`,
        sport: sport,
        surface_type: "Tournament Grade Turf / Wooden",
        price_per_hour: v.pricePerHour,
        is_active: true,
      })),
    );

    await supabase.from("venue_courts").upsert(courtsToInsert, { onConflict: "id" });

    return { success: true, count: venuesToInsert.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to seed venues";
    return { success: false, count: 0, error: message };
  }
}
