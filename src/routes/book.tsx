import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { VENUES, KHELGRID_SPORTS, KHELGRID_CITIES, type Venue } from "@/data/khelgrid";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  Trophy,
  Calendar,
  Clock,
  Check,
  Bot,
  Sparkles,
  CircleCheck,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookingConfirmationModal } from "@/components/BookingConfirmationModal";
import { VenueDetails } from "@/components/VenueDetails";
import { VenueBookingForm } from "@/components/venue-booking";
import {
  createVenueBooking,
  getVenueBookings,
  cancelVenueBooking,
  type BookingRecord,
} from "@/lib/booking-service";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/book")({
  head: () =>
    buildSeoHead({
      title: "Book Sports Venues, Turfs & Courts Across India · KhelGrid",
      description:
        "Instantly discover, compare, and reserve verified sports turfs, badminton indoor courts, cricket nets, football grounds, and swimming pools across major Indian cities.",
      canonicalPath: "/book",
      keywords:
        "book turf online, badminton court booking, football turf near me, cricket pitch rental, swimming pool hourly booking, sports arena reservations",
      type: "website",
    }),
  component: BookVenues,
});

const TIMES = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

type BookingSelection = { venue: Venue; date: string; time: string | null };

function BookVenues() {
  const [q, setQ] = useState("");
  const [directoryVenues, setDirectoryVenues] = useState<Venue[]>(VENUES);
  const [directorySource, setDirectorySource] = useState<"sample" | "database">("sample");
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [sport, setSport] = useState<string>("All");
  const [city, setCity] = useState<string>("Bengaluru");
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const [selectedVenueForDetails, setSelectedVenueForDetails] = useState<Venue | null>(null);
  const [activeTab, setActiveTab] = useState<"venues" | "slot-booking" | "my-bookings">("venues");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  const loadBookings = useCallback(async () => {
    try {
      const list = await getVenueBookings();
      setBookings(list);
    } catch (e) {
      console.warn("Failed to load bookings", e);
    }
  }, []);

  useEffect(() => {
    loadBookings();
    const handleUpdate = () => {
      loadBookings();
    };
    window.addEventListener("khelgrid_booking_created", handleUpdate);
    return () => {
      window.removeEventListener("khelgrid_booking_created", handleUpdate);
    };
  }, [loadBookings]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    setDirectoryLoading(true);
    supabase
      .from("venues")
      .select("*")
      .is("deleted_at", null)
      .eq("bookable", true)
      .order("featured", { ascending: false })
      .order("name", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Could not load venue directory from Supabase", error);
          setDirectorySource("sample");
          setDirectoryVenues(VENUES);
          return;
        }
        const rows = data ?? [];
        const mapped: Venue[] = rows.map((row) => ({
          id: row.id,
          name: row.name,
          area: row.area,
          city: row.city,
          distanceKm: 0,
          rating: row.reviews_count > 0 ? Number(row.rating ?? 0) : 0,
          reviews: Number(row.reviews_count ?? 0),
          sports: row.sports ?? [],
          pricePerHour: Number(row.price_per_hour ?? 0),
          featured: Boolean(row.featured),
          bookable: Boolean(row.bookable),
          image: row.image_url ?? "",
        }));
        setDirectoryVenues(mapped);
        setDirectorySource("database");
      })
      .catch((error) => {
        if (!active) return;
        console.error("Venue directory request failed", error);
        setDirectorySource("sample");
        setDirectoryVenues(VENUES);
      })
      .finally(() => {
        if (active) setDirectoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const list = useMemo(() => {
    return directoryVenues.filter(
      (v) =>
        (city === "All" || v.city === city) &&
        (sport === "All" || v.sports.includes(sport)) &&
        (q === "" || [v.name, v.area, v.city, ...v.sports].join(" ").toLowerCase().includes(q.toLowerCase())),
    );
  }, [q, sport, city, directoryVenues]);

  const startBooking = (venue: Venue, date = today, time: string | null = null) => {
    setBooking({ venue, date, time });
  };

  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelVenueBooking(bookingId);
    if (success) {
      toast.info("Booking cancelled.");
      loadBookings();
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sports Venues in {city}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover and book turfs, courts, arenas and pools near you.
          </p>
        </div>

        {/* Real-time Schedule Status */}
        <div className="flex items-center gap-2 text-xs bg-muted/60 border border-border/70 rounded-xl p-2 px-3 self-start md:self-auto text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span className="font-medium text-foreground">Live Booking Available</span>
          <span className="text-muted-foreground/60">•</span>
          <span>Instant Court Confirmation</span>
        </div>
      </div>

      <VenueBookingAssistant
        defaultCity={city === "All" ? "Bengaluru" : city}
        defaultDate={today}
        onBook={startBooking}
      />

      {/* Filter Bar */}
      <div className="sticky top-14 z-30 mt-6 -mx-4 border-y border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl sm:top-16 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr,180px,180px]">
          <div className="relative col-span-2 sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by venue name…"
              className="h-11 border-border bg-secondary/40 pl-9"
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-11 border-border bg-secondary/40">
              <MapPin className="mr-1 h-4 w-4 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cities</SelectItem>
              {KHELGRID_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="h-11 border-border bg-secondary/40">
              <Trophy className="mr-1 h-4 w-4 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sports</SelectItem>
              {KHELGRID_SPORTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filter Chips for Delhi DDCA and Top Sports */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium hidden sm:inline">Quick links:</span>
          <button
            onClick={() => {
              setCity("Delhi");
              setSport("Cricket");
            }}
            className={`rounded-full px-3 py-1 font-semibold transition-all border ${
              city === "Delhi" && sport === "Cricket"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
            }`}
          >
            🏏 Delhi · DDCA Arun Jaitley Ground
          </button>
          <button
            onClick={() => {
              setCity("Itanagar");
              setSport("Cricket");
            }}
            className={`rounded-full px-3 py-1 font-semibold transition-all border ${
              city === "Itanagar" && sport === "Cricket"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-sky-500/40 bg-sky-500/5 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10"
            }`}
          >
            🏏 Arunachal · BCCI Yupia Stadium
          </button>
          <button
            onClick={() => setCity("Delhi")}
            className={`rounded-full px-3 py-1 font-medium transition-all border ${
              city === "Delhi" && sport !== "Cricket"
                ? "bg-secondary text-foreground border-foreground/20"
                : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Delhi Venues
          </button>
          <button
            onClick={() => setCity("Itanagar")}
            className={`rounded-full px-3 py-1 font-medium transition-all border ${
              city === "Itanagar" && sport !== "Cricket"
                ? "bg-secondary text-foreground border-foreground/20"
                : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            All Arunachal Venues
          </button>
          <button
            onClick={() => {
              setCity("Jammu");
              setSport("Kho-Kho");
            }}
            className={`rounded-full px-3 py-1 font-semibold transition-all border ${
              city === "Jammu" && sport === "Kho-Kho"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            }`}
          >
            🏃 Jammu · Green Play Field
          </button>
          <button
            onClick={() => {
              setCity("All");
              setSport("Cricket");
            }}
            className={`rounded-full px-3 py-1 font-medium transition-all border ${
              sport === "Cricket" && city !== "Delhi" && city !== "Itanagar"
                ? "bg-secondary text-foreground border-foreground/20"
                : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            Cricket Pitches & Nets
          </button>
          {(city !== "All" || sport !== "All" || q.trim() !== "") && (
            <button
              onClick={() => {
                setCity("All");
                setSport("All");
                setQ("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* BCCI Official Arunachal Pradesh Ranji Trials & Ground Spotlight Banner */}
      {(city === "Itanagar" || city === "All" || sport === "Cricket") && (
        <div className="mt-6 rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-500/10 via-primary/5 to-background p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30 text-[11px] font-bold">
                  🏏 BCCI Domestic Intervention
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] border-emerald-500/40 text-emerald-500 font-medium"
                >
                  Ranji Trophy & Age-Group Trials
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  Yupia, Itanagar (Arunachal Pradesh)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                BCCI to Conduct Trials to Ensure Arunachal Pradesh's Ranji Participation
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Yupia Cricket Stadium & Rajiv Gandhi Stadium in Itanagar are the official
                BCCI-recognized grounds for direct open selection trials by the BCCI-appointed
                3-member independent selection committee (Chairman Satya Gopal Chakraborty) to field
                state teams for Ranji Trophy, C.K. Nayudu Trophy, and Women's state teams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                asChild
                size="sm"
                className="rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm h-9 px-4 shadow-sm"
              >
                <Link to="/trial/t-bcci-arunachal-pradesh-ranji-trials-2026">
                  View BCCI Trial Card →
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full text-xs sm:text-sm h-9 px-3"
              >
                <Link to="/venue/v-bcci-yupia-cricket-ground-itanagar">Yupia Stadium</Link>
              </Button>
              <a
                href="https://www.bcci.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
              >
                bcci.tv <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
              >
                Hindustan Times <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DDCA Official Trials & Ground Spotlight Banner */}
      <div className="mt-4 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-bold">
                🏏 Delhi State Cricket Notice
              </Badge>
              <Badge
                variant="outline"
                className="text-[11px] border-emerald-500/40 text-emerald-500 font-medium"
              >
                Official Selection Venue
              </Badge>
              <span className="text-[11px] text-muted-foreground">Season 2026–27</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials for 2026–27 Season
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Arun Jaitley Stadium & DDCA Practice Complex is the designated venue for Delhi State
              selection trials. Eligible female cricketers born between 01-09-2011 and 31-08-2013
              can submit applications until November 2, 2026.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm h-9 px-4 shadow-sm"
            >
              <Link to="/trial/t-ddca-delhi-womens-u15-cricket-2026">View U-15 Trial Card →</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-full text-xs sm:text-sm h-9 px-3"
            >
              <Link to="/venue/v-ddca-arun-jaitley-stadium-delhi">DDCA Venue Page</Link>
            </Button>
            <a
              href="https://ddca.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
            >
              ddca.in <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-b border-border/60 text-sm">
        <button
          id="tab-venues-browse"
          onClick={() => setActiveTab("venues")}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "venues"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Browse Venues ({list.length})
        </button>
        <button
          id="tab-interactive-slot-booking"
          onClick={() => setActiveTab("slot-booking")}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "slot-booking"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Interactive Slot Booking
          <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-bold">
            New
          </span>
        </button>
        <button
          id="tab-my-bookings"
          onClick={() => setActiveTab("my-bookings")}
          className={`pb-3 font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "my-bookings"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Bookings
          {bookings.length > 0 && (
            <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Interactive Slot Booking Form */}
      {activeTab === "slot-booking" && (
        <div className="mt-6 max-w-4xl mx-auto">
          <VenueBookingForm
            onBookingComplete={() => {
              loadBookings();
            }}
          />
        </div>
      )}

      {/* Tab: Venues Grid */}
      {activeTab === "venues" && (
        <div className="mt-5">
          {directorySource === "sample" && (
            <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
              {isSupabaseConfigured
                ? "Live venue data could not be loaded. Showing sample listings; confirm details directly before visiting or booking."
                : "Showing sample venue listings. Live directory data is not connected in this environment."}
            </p>
          )}
          {directoryLoading && (
            <p role="status" className="mb-3 text-sm text-muted-foreground">Loading venue listings…</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <VenueCard
              key={v.id}
              v={v}
              onBook={() => startBooking(v)}
              onViewDetails={() => setSelectedVenueForDetails(v)}
            />
          ))}
          {list.length === 0 && !directoryLoading && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              {directorySource === "database"
                ? "No published venues are available yet. Venue owners can submit a facility for review."
                : "No venues match your filters."}
              <div className="mt-3">
                <Link to="/list-venue" className="font-semibold text-primary hover:underline">List a sports venue</Link>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Tab: My Bookings */}
      {activeTab === "my-bookings" && (
        <div className="mt-6">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-base font-semibold">No bookings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                Explore venues and turfs near you. When you book a slot, your confirmed reservations
                will appear here.
              </p>
              <Button
                variant="default"
                size="sm"
                className="mt-4"
                onClick={() => setActiveTab("venues")}
              >
                Browse Venues
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-border bg-gradient-card p-5 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Ref: {b.id.slice(-8)}
                      </span>
                      <h3 className="text-base font-bold text-foreground line-clamp-1">
                        {b.venue_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {b.venue_area}, {b.venue_city}
                      </p>
                    </div>
                    <Badge
                      variant={b.status === "cancelled" ? "outline" : "default"}
                      className={
                        b.status === "confirmed"
                          ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                          : b.status === "cancelled"
                            ? "border-destructive text-destructive"
                            : ""
                      }
                    >
                      {b.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/50">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Sport</span>
                      <span className="font-semibold text-foreground">{b.sport}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Date</span>
                      <span className="font-semibold text-foreground">{b.booking_date}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Slot</span>
                      <span className="font-semibold text-foreground">{b.start_time}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Total Paid</span>
                      <span className="font-bold text-primary">₹{b.total_price}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      {b.synced_to_db ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Saved on Device
                        </span>
                      )}
                    </div>
                    {b.status !== "cancelled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive hover:bg-destructive/10 h-8"
                        onClick={() => handleCancelBooking(b.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Booking Dialog */}
      {booking && (
        <BookingDialog
          key={`${booking.venue.id}-${booking.date}-${booking.time}`}
          open={Boolean(booking)}
          onOpenChange={(open) => !open && setBooking(null)}
          venue={booking.venue}
          initialDate={booking.date}
          initialTime={booking.time}
          onBookingSuccess={() => {
            loadBookings();
            setActiveTab("my-bookings");
          }}
        />
      )}

      {/* Full Venue Details Modal */}
      {selectedVenueForDetails && (
        <Dialog
          open={Boolean(selectedVenueForDetails)}
          onOpenChange={(open) => !open && setSelectedVenueForDetails(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-border">
            <VenueDetails
              venue={selectedVenueForDetails}
              onClose={() => setSelectedVenueForDetails(null)}
              onBook={() => {
                loadBookings();
                setSelectedVenueForDetails(null);
                setActiveTab("my-bookings");
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}

function VenueBookingAssistant({
  defaultCity,
  defaultDate,
  onBook,
}: {
  defaultCity: string;
  defaultDate: string;
  onBook: (venue: Venue, date: string, time: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(defaultCity);
  const [sport, setSport] = useState("Football");
  const [date, setDate] = useState(defaultDate);
  const [venueId, setVenueId] = useState("");

  const matches = useMemo(() => {
    return VENUES.filter(
      (venue) => venue.bookable && venue.city === city && venue.sports.includes(sport),
    );
  }, [city, sport]);

  useEffect(() => {
    if (!matches.some((venue) => venue.id === venueId)) setVenueId(matches[0]?.id ?? "");
  }, [matches, venueId]);

  const venue = matches.find((item) => item.id === venueId);
  const slots = venue ? getAvailableSlots(venue, date) : [];

  return (
    <div className="mt-6 rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 via-background to-secondary/30 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Bot className="h-3.5 w-3.5" /> Fast Turf Booking Assistant
          </div>
          <h2 className="text-lg font-bold sm:text-xl">Pick your city, sport and instant slot</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Check real-time court availability and lock in your turf time without back-and-forth
            calls.
          </p>
        </div>
        <Button
          variant={open ? "secondary" : "default"}
          onClick={() => setOpen((prev) => !prev)}
          className="self-start sm:self-auto gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          {open ? "Hide Booking Assistant" : "Find Available Slots"}
        </Button>
      </div>

      {open && (
        <div className="mt-5 space-y-4 border-t border-border/60 pt-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">City</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KHELGRID_CITIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Sport</label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KHELGRID_SPORTS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date</label>
              <Input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-1 h-10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Venue</label>
              <Select value={venueId} onValueChange={setVenueId} disabled={matches.length === 0}>
                <SelectTrigger className="mt-1 h-10">
                  <SelectValue placeholder="Choose venue" />
                </SelectTrigger>
                <SelectContent>
                  {matches.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!venue ? (
            <div className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
              No bookable {sport.toLowerCase()} venue is available in {city} yet. Try another city
              or sport.
            </div>
          ) : (
            <div className="rounded-xl border border-border/70 bg-background/80 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <CircleCheck className="h-4 w-4 text-emerald-500" />
                    {slots.length} slots available at {venue.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {venue.area} · ₹{venue.pricePerHour}/hour
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {slots.map((slot) => (
                  <Button
                    key={slot}
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-medium border-border/80 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => onBook(venue, date, slot)}
                  >
                    <Clock className="mr-1 h-3 w-3" /> {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VenueCard({
  v,
  onBook,
  onViewDetails,
}: {
  v: Venue;
  onBook: () => void;
  onViewDetails: () => void;
}) {
  const isDdcaOrTrialVenue = Boolean(v.trialId || v.id.includes("ddca"));

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5 flex flex-col justify-between ${
        isDdcaOrTrialVenue
          ? "border-primary/50 bg-gradient-to-b from-primary/5 via-card to-card shadow-md shadow-primary/5 hover:border-primary"
          : "border-border bg-gradient-card hover:border-border/80"
      }`}
    >
      <div>
        <div
          className="relative aspect-[16/10] w-full overflow-hidden bg-secondary cursor-pointer group"
          onClick={onViewDetails}
        >
          <img
            src={v.image}
            alt={v.name}
            width={400}
            height={250}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-background/90 text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> View Details
            </span>
          </div>
          {v.featured && (
            <span className="absolute left-3 top-3 rounded-md bg-yellow-500/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm">
              Featured
            </span>
          )}
          {isDdcaOrTrialVenue && (
            <span className="absolute right-3 top-3 rounded-md bg-primary text-primary-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> State Selection
            </span>
          )}
          {!isDdcaOrTrialVenue && v.bookable && (
            <span className="absolute right-3 top-3 rounded-md bg-primary/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
              Bookable
            </span>
          )}
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={onViewDetails}
              className="text-base font-semibold leading-tight hover:text-primary cursor-pointer line-clamp-1"
            >
              {v.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{v.rating}</span>
              <span className="text-muted-foreground">({v.reviews})</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
            {v.area} · ~{v.distanceKm} km
          </p>

          <div className="flex flex-wrap gap-1.5">
            {v.sports.map((s) => (
              <Badge key={s} variant="outline" className="border-border text-[10px] px-2 py-0.5">
                {s}
              </Badge>
            ))}
          </div>

          {/* DDCA Official Trials Integration Notice */}
          {v.trialId && (
            <div className="mt-2.5 rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-primary flex items-center gap-1 text-[11px]">
                  🏏 Active Selection Trials
                </span>
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
                  Season 2026–27
                </span>
              </div>
              <p className="text-[11px] text-foreground font-medium line-clamp-2">
                {v.trialTitle ||
                  "DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials"}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-primary/20">
                <Link
                  to={`/trial/${v.trialId}`}
                  className="font-bold text-primary hover:underline inline-flex items-center gap-0.5 text-[11px]"
                >
                  Apply / View Trial Card →
                </Link>
                {v.officialUrl && (
                  <a
                    href={v.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
                  >
                    ddca.in <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border/50 pt-3">
          <div className="text-xs sm:text-sm flex items-center justify-between sm:justify-start gap-1">
            <span className="text-muted-foreground text-xs">
              {v.pricePerHour === 0 ? "Entry: " : "from "}
            </span>
            <span className="font-bold text-foreground">
              {v.pricePerHour === 0
                ? isDdcaOrTrialVenue
                  ? "Free (State Trials)"
                  : "Free Entry"
                : `₹${v.pricePerHour}`}
            </span>
            {v.pricePerHour > 0 && <span className="text-muted-foreground text-xs">/hr</span>}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {v.trialId && (
              <Button
                asChild
                size="sm"
                className="h-8 text-xs rounded-full px-3 bg-primary text-primary-foreground font-semibold flex-1 sm:flex-initial"
              >
                <Link to={`/trial/${v.trialId}`}>View Trials</Link>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={onViewDetails}
              className="h-8 text-xs px-2.5 rounded-full flex-1 sm:flex-initial"
            >
              Details
            </Button>
            <Button
              size="sm"
              onClick={onBook}
              className="h-8 text-xs rounded-full px-3 flex-1 sm:flex-initial"
            >
              Book Slot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingDialog({
  open,
  onOpenChange,
  venue,
  initialDate,
  initialTime,
  onBookingSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue;
  initialDate: string;
  initialTime: string | null;
  onBookingSuccess?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">{venue.name}</DialogTitle>
          <DialogDescription>
            {venue.area} · {venue.city} · Interactive Slot & Calendar Reservation
          </DialogDescription>
        </DialogHeader>

        <VenueBookingForm
          showVenueSelector={false}
          initialVenueId={venue.id}
          initialSport={venue.sports[0]}
          initialDate={initialDate}
          initialTime={initialTime || undefined}
          onBookingComplete={() => {
            onOpenChange(false);
            if (onBookingSuccess) {
              onBookingSuccess();
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function getAvailableSlots(venue: Venue, date: string) {
  const seed = `${venue.id}-${date}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return TIMES.filter((_, index) => (seed + index * 7) % 5 !== 0);
}
