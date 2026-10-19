import { supabase, isSupabaseConfigured } from "./supabase";
import { VENUES, type Venue } from "@/data/playo";
import type { Database } from "@/types/database";

export interface CourtRecord {
  id: string;
  venue_id: string;
  name: string;
  sport: string;
  surface_type?: string | null;
  price_per_hour?: number | null;
  is_active: boolean;
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

const STORAGE_KEY = "khelgrid_venue_bookings";
let memoryBookings: BookingRecord[] = [];

/**
 * Resets memory bookings (primarily for test isolation)
 */
export function resetLocalBookingsForTesting(): void {
  memoryBookings = [];
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
 * Fetch courts for a given venue, with sensible fallback for offline/unconfigured environments.
 */
export async function getVenueCourts(venueId: string, sport?: string): Promise<CourtRecord[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from("venue_courts")
        .select("*")
        .eq("venue_id", venueId)
        .eq("is_active", true);

      if (sport) {
        query = query.eq("sport", sport);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as CourtRecord[];
      }
    } catch (e) {
      console.warn("Could not fetch venue courts from database", e);
    }
  }

  // Fallback default court
  return [
    {
      id: `${venueId}-court-1`,
      venue_id: venueId,
      name: "Court 1 / Main Pitch",
      sport: sport || "Multi-Sport",
      surface_type: "Standard Pro Surface",
      is_active: true,
    },
  ];
}

/**
 * Retrieves all user venue bookings. Merges Supabase remote records with local storage.
 */
export async function getVenueBookings(): Promise<BookingRecord[]> {
  const localList: BookingRecord[] = [];

  // Load from localStorage first, falling back to memoryBookings
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localList.push(...JSON.parse(stored));
      } else {
        localList.push(...memoryBookings);
      }
    } catch (e) {
      console.warn("Failed to load bookings from localStorage", e);
      localList.push(...memoryBookings);
    }
  } else {
    localList.push(...memoryBookings);
  }

  // If Supabase is configured, fetch live records and merge
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("venue_bookings")
        .select("*, venues(name, area, city, image_url)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as SupabaseBookingJoinedRow[];
        const dbBookings: BookingRecord[] = rows.map((item) => ({
          id: item.id,
          venue_id: item.venue_id,
          court_id: item.court_id,
          venue_name: item.venues?.name || "Sports Venue",
          venue_area: item.venues?.area || "Area",
          venue_city: item.venues?.city || "City",
          venue_image: item.venues?.image_url,
          sport: item.sport,
          booking_date: item.booking_date,
          start_time: item.start_time,
          end_time: item.end_time,
          duration_hours: 1,
          price_per_hour: Number(item.total_price),
          total_price: Number(item.total_price),
          status: item.status,
          idempotency_key: item.idempotency_key || undefined,
          held_until: item.held_until || undefined,
          user_email: item.user_email || "guest@khelgrid.com",
          user_phone: item.user_phone || "",
          created_at: item.created_at || new Date().toISOString(),
          synced_to_db: true,
        }));

        // Merge DB and local (DB takes precedence by id)
        const dbMap = new Map(dbBookings.map((b) => [b.id, b]));
        const merged = [...dbBookings];

        for (const local of localList) {
          if (!dbMap.has(local.id)) {
            merged.push(local);
          }
        }
        return merged;
      }
    } catch (err) {
      console.warn("Error fetching bookings from Supabase:", err);
    }
  }

  return localList;
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
    return { available: true };
  }

  const startTimeSQL = formatTimeToSQL(params.start_time);
  const endTimeSQL = calculateEndTimeSQL(params.start_time, params.duration_hours || 1);

  try {
    // 1. First attempt privacy-preserving RPC (doesn't expose customer PII to other users)
    const { data: rpcData, error: rpcError } = await (
      supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: SlotAvailabilityRpcRow[] | null; error: { message: string } | null }>
    )("get_venue_slot_availability", {
      p_venue_id: params.venue_id,
      p_booking_date: params.booking_date,
      p_court_id: params.court_id || null,
    });

    if (!rpcError && rpcData) {
      for (const slot of rpcData) {
        const isOverlap = startTimeSQL < slot.end_time && endTimeSQL > slot.start_time;
        if (isOverlap) {
          return {
            available: false,
            conflictReason:
              slot.status === "confirmed"
                ? "This slot is already booked."
                : "This slot is temporarily held by another customer completing payment.",
          };
        }
      }
      return { available: true };
    }
  } catch (rpcErr) {
    console.warn("Availability RPC check fallback to query:", rpcErr);
  }

  try {
    // 2. Fallback to direct table query
    const { data: existingBookings, error } = await supabase
      .from("venue_bookings")
      .select("id, start_time, end_time, status, held_until")
      .eq("venue_id", params.venue_id)
      .eq("booking_date", params.booking_date)
      .in("status", ["confirmed", "pending"])
      .is("deleted_at", null);

    if (error || !existingBookings) {
      return { available: true };
    }

    const now = new Date();

    for (const b of existingBookings) {
      // If pending but held_until has expired, ignore
      if (b.status === "pending" && b.held_until) {
        if (new Date(b.held_until) < now) continue;
      }

      // Check time overlap: (startA < endB) and (endA > startB)
      const isOverlap = startTimeSQL < b.end_time && endTimeSQL > b.start_time;
      if (isOverlap) {
        return {
          available: false,
          conflictReason:
            b.status === "confirmed"
              ? "This slot is already booked."
              : "This slot is temporarily held by another customer completing payment.",
        };
      }
    }

    return { available: true };
  } catch (err) {
    console.warn("Error checking slot availability:", err);
    return { available: true };
  }
}

/**
 * Persists a new booking to Supabase and localStorage with double-booking safety and idempotency.
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
  user_email?: string;
  user_phone?: string;
  idempotency_key?: string;
}): Promise<{
  success: boolean;
  booking?: BookingRecord;
  message: string;
}> {
  const duration = params.duration_hours || 1;
  const totalPrice = params.venue.price_per_hour * duration;
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

  const bookingId = `KG-BK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

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
    price_per_hour: params.venue.price_per_hour,
    total_price: totalPrice,
    status: "confirmed",
    idempotency_key: idempotencyKey,
    user_email: params.user_email || "guest@khelgrid.com",
    user_phone: params.user_phone || "",
    created_at: new Date().toISOString(),
    synced_to_db: false,
  };

  // 1. Persist to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      // First ensure the venue exists in the database
      const { data: existingVenue } = await supabase
        .from("venues")
        .select("id")
        .eq("id", params.venue.id)
        .maybeSingle();

      if (!existingVenue) {
        await supabase.from("venues").upsert({
          id: params.venue.id,
          name: params.venue.name,
          area: params.venue.area,
          city: params.venue.city,
          sports: params.venue.sports,
          price_per_hour: params.venue.price_per_hour,
          image_url: params.venue.image_url || null,
          bookable: true,
          rating: 4.8,
          reviews_count: 24,
        });
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
          p_status: "confirmed",
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

      // 1B. Fallback to direct insertion if atomic RPC is unavailable
      if (!atomicCompleted) {
        const { data: inserted, error } = await supabase
          .from("venue_bookings")
          .insert({
            id: bookingId,
            venue_id: params.venue.id,
            court_id: params.court_id || null,
            sport: bookingRecord.sport,
            booking_date: bookingRecord.booking_date,
            start_time: startTimeSQL,
            end_time: endTimeSQL,
            total_price: totalPrice,
            status: "confirmed",
            idempotency_key: idempotencyKey,
            user_email: bookingRecord.user_email,
            user_phone: bookingRecord.user_phone,
          })
          .select()
          .single();

        if (error) {
          // Check for double booking exclusion violation (Postgres error 23P01)
          if (error.code === "23P01" || error.message.includes("no_overlapping_bookings")) {
            return {
              success: false,
              message:
                "Conflict detected: This slot was just reserved by another player. Please select another slot.",
            };
          }
          console.warn("Supabase booking insert error:", error);
        } else if (inserted) {
          bookingRecord.synced_to_db = true;
        }
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
    }
  }

  // 2. Always persist to memoryBookings and localStorage for instant client durability
  memoryBookings = [bookingRecord, ...memoryBookings.filter((b) => b.id !== bookingRecord.id)];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list: BookingRecord[] = stored ? JSON.parse(stored) : [];
      list.unshift(bookingRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("khelgrid_booking_created", { detail: bookingRecord }));
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }
  }

  return {
    success: true,
    booking: bookingRecord,
    message: bookingRecord.synced_to_db
      ? "Booking confirmed and synced to cloud"
      : "Booking confirmed and saved to your device",
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
  const totalPrice = (params.price_per_hour || 500) * duration;
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

  // Local fallback
  return {
    success: true,
    booking_id: `KG-HOLD-${Date.now()}`,
    held_until: new Date(Date.now() + (params.hold_duration_minutes || 10) * 60000).toISOString(),
    message: "Slot held locally for checkout.",
  };
}

/**
 * Cancel an existing booking (soft delete / status change with atomic RPC support)
 */
export async function cancelVenueBooking(bookingId: string, reason?: string): Promise<boolean> {
  memoryBookings = memoryBookings.map((b) =>
    b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
  );
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const list: BookingRecord[] = JSON.parse(stored);
        const updated = list.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("khelgrid_booking_created"));
      }
    } catch (e) {
      console.warn("LocalStorage cancel update error:", e);
    }
  }

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
