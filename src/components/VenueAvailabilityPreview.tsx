import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCw, CircleCheck, CircleX, CircleHelp } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type SlotRow = { start_time: string; end_time: string; status: string; is_held?: boolean };
type Court = { id: string; name: string; sport: string; price_per_hour: number | null };
const SLOT_STARTS = Array.from({ length: 17 }, (_, index) => String(index + 6).padStart(2, "0") + ":00:00");
function displayTime(value: string) {
  const parts = value.split(":");
  const hour = Number(parts[0]);
  return String(hour % 12 || 12) + ":" + (parts[1] || "00") + " " + (hour >= 12 ? "PM" : "AM");
}
export function VenueAvailabilityPreview({ venueId, pricePerHour }: { venueId: string; pricePerHour: number }) {
  const today = useMemo(() => {
    const date = new Date();
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }, []);
  const [date, setDate] = useState(today);
  const [courts, setCourts] = useState<Court[]>([]);
  const [availabilityByCourt, setAvailabilityByCourt] = useState<Record<string, SlotRow[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!isSupabaseConfigured) {
        setAvailabilityByCourt(null);
        setError("Live availability is not connected for this venue yet. Please contact the venue to confirm a time.");
        return;
      }
      setLoading(true); setError(null); setRows(null); setSelectedTime(null);
      try {
        const courtResult = await supabase
          .from("venue_courts")
          .select("id, name, sport, price_per_hour")
          .eq("venue_id", venueId)
          .eq("is_active", true);
        if (courtResult.error) throw new Error(courtResult.error.message);
        const activeCourts = (courtResult.data ?? []) as Court[];
        if (activeCourts.length === 0) {
          if (active) {
            setCourts([]);
            setAvailabilityByCourt(null);
            setError("This venue has not published any active courts or pitches for online booking yet. Please contact the venue to confirm availability.");
          }
          return;
        }
        const rpc = supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<{ data: SlotRow[] | null; error: { message: string } | null }>;
        const availabilityResults = await Promise.all(activeCourts.map(async (court) => {
          const result = await rpc("get_venue_slot_availability", {
            p_venue_id: venueId, p_booking_date: date, p_court_id: court.id,
          });
          if (result.error || !result.data) throw new Error(result.error?.message || "Availability could not be verified.");
          return [court.id, result.data] as const;
        }));
        if (active) {
          setCourts(activeCourts);
          setAvailabilityByCourt(Object.fromEntries(availabilityResults));
        }
      } catch {
        if (active) setError("We couldn't verify live slots for this date. Please contact the venue before travelling.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [venueId, date]);
  const slots = useMemo(() => {
    if (!availabilityByCourt) return [];
    return SLOT_STARTS.map((start) => {
      const hour = Number(start.slice(0, 2));
      const end = String(hour + 1).padStart(2, "0") + ":00:00";
      const availableCourtIds = courts
        .filter((court) => !(availabilityByCourt[court.id] ?? []).some((row) => start < row.end_time && end > row.start_time))
        .map((court) => court.id);
      return { start, end, availableCourtIds, available: availableCourtIds.length > 0 };
    });
  }, [availabilityByCourt, courts]);
  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader className="pb-3"><div className="flex flex-wrap items-start justify-between gap-3"><div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plan your game</p>
        <CardTitle className="mt-1 text-xl">Check date &amp; time slots</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">Checks active venue courts against KhelGrid booking records.</p>
      </div>{pricePerHour > 0 && <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">₹{pricePerHour.toLocaleString("en-IN")}/hr listed</span>}</div></CardHeader>
      <CardContent className="space-y-4">
        <label className="flex max-w-xs flex-col gap-1.5 text-sm font-medium"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Select date</span>
          <input type="date" value={date} min={today} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm" />
        </label>
        {loading && <p className="flex items-center gap-2 text-sm text-muted-foreground"><RefreshCw className="h-4 w-4 animate-spin" /> Checking current bookings…</p>}
        {error && <p role="status" className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-muted-foreground"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{error}</p>}
        {!loading && !error && rows && <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{slots.map((slot) => {
            const selected = selectedTime === slot.start;
            return <button key={slot.start} type="button" disabled={!slot.available} aria-pressed={selected} onClick={() => { setSelectedTime(selected ? null : slot.start); setSelectedCourtId(selected ? null : slot.availableCourtIds[0] ?? null); }}
              className={"flex min-h-16 items-center justify-between gap-2 rounded-xl border p-3 text-left transition-colors " + (!slot.available ? "cursor-not-allowed border-border bg-muted/60 text-muted-foreground opacity-70" : selected ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-emerald-600/30 bg-emerald-600/5 hover:border-emerald-600/70")}>
              <span className="min-w-0"><span className="block text-sm font-semibold">{displayTime(slot.start)}</span><span className="mt-0.5 block text-xs">{!slot.available ? "Booked / held" : selected ? "Selected" : slot.availableCourtIds.length + " court" + (slot.availableCourtIds.length === 1 ? "" : "s") + " free"}</span></span>
              {slot.available ? <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleX className="h-4 w-4 shrink-0" />}
            </button>;
          })}</div>
          {selectedTime && <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">Selected: <strong>{displayTime(selectedTime)}</strong> on {date}</p>
            <a href={"/book?venue=" + encodeURIComponent(venueId) + "&date=" + encodeURIComponent(date) + "&time=" + encodeURIComponent(selectedTime.slice(0, 5)) + (selectedCourtId ? "&court=" + encodeURIComponent(selectedCourtId) : "")} className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">Continue to booking</a>
          </div>}
          <p className="text-xs text-muted-foreground">Slots are one hour long and show whether any active court has no overlapping booking record. The venue must maintain its active courts and opening hours; final availability must be rechecked when a booking is submitted.</p>
        </>}
      </CardContent>
    </Card>
  );
}
