import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { EVENTS, type SportEvent, KHELGRID_SPORTS, KHELGRID_CITIES } from "@/data/khelgrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  EventFilters,
  filterSportEvents,
  DEFAULT_EVENT_FILTERS,
  type EventFilterState,
  EVENT_SPORT_ICONS,
} from "@/components/events/EventFilters";
import { TournamentFAQ } from "@/components/events/TournamentFAQ";
import { TournamentCountdown } from "@/components/events/TournamentCountdown";
import { SaveForLaterButton } from "@/components/events/SaveForLaterButton";
import { useSavedEvents } from "@/components/events/useSavedEvents";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  Share2,
  CheckCircle2,
  Phone,
  FileText,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  HelpCircle,
  Award,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/events")({
  head: () =>
    buildSeoHead({
      title: "Sports Tournaments, Leagues & Championships in India · KhelGrid",
      description:
        "Compete in amateur, corporate, and championship tournaments across India. Register teams for cricket leagues, futsal cups, badminton opens, and marathon runs.",
      canonicalPath: "/events",
      keywords:
        "sports tournaments India, corporate cricket league, badminton championship, open football tournament, weekend sports competitions, futsal cup",
      type: "website",
    }),
  component: EventsPage,
});

export function EventsPage() {
  const [allEvents, setAllEvents] = useState<SportEvent[]>(EVENTS);
  const [filters, setFilters] = useState<EventFilterState>(DEFAULT_EVENT_FILTERS);
  const { savedIds, savedCount, isSaved, toggleSave, clearSaved } = useSavedEvents();

  // Modal states
  const [registeringEvent, setRegisteringEvent] = useState<SportEvent | null>(null);
  const [rulesEvent, setRulesEvent] = useState<SportEvent | null>(null);
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    event: SportEvent;
    ticketId: string;
    teamName: string;
  } | null>(null);

  // Team Registration Form State
  const [regForm, setRegForm] = useState({
    type: "team" as "team" | "solo",
    teamName: "",
    captainName: "",
    phone: "",
    email: "",
    playerCount: "6",
    jerseyColor: "Navy Blue",
    notes: "",
  });

  // Host Tournament Form State
  const [hostForm, setHostForm] = useState({
    title: "",
    sport: "Cricket",
    city: "Bengaluru",
    area: "",
    venue: "",
    date: "Sat, Jul 18",
    time: "8:00 AM",
    entryFee: "1000",
    prizePool: "₹50,000 + Trophies",
    totalSpots: "16",
    format: "Knockout (10 Overs)",
    category: "Weekend Cup" as SportEvent["category"],
    scope: "Local" as SportEvent["scope"],
    teamFormat: "Small Teams (5-7)" as SportEvent["teamFormat"],
    organizerName: "",
    organizerPhone: "",
    perks: "Live CricHeroes Scoring, Refreshments, Medals",
  });

  // Sport counts
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of allEvents) {
      counts[e.sport] = (counts[e.sport] || 0) + 1;
    }
    return counts;
  }, [allEvents]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allEvents.length,
      upcoming: allEvents.filter((e) => e.status !== "Completed").length,
      registration_open: allEvents.filter((e) => e.spotsLeft > 0 && e.status !== "Sold Out").length,
      local: allEvents.filter(
        (e) => e.scope === "Local" || (!e.scope && e.category !== "Championship"),
      ).length,
      national: allEvents.filter(
        (e) =>
          e.scope === "National" ||
          (!e.scope &&
            (e.category === "Championship" ||
              e.title.toLowerCase().includes("national") ||
              e.title.toLowerCase().includes("premier") ||
              e.title.toLowerCase().includes("all-india"))),
      ).length,
      "Weekend Cup": allEvents.filter((e) => e.category === "Weekend Cup").length,
      "Corporate League": allEvents.filter((e) => e.category === "Corporate League").length,
      Championship: allEvents.filter((e) => e.category === "Championship").length,
      "Youth & Grassroots": allEvents.filter((e) => e.category === "Youth & Grassroots").length,
    };
    return counts;
  }, [allEvents]);

  // Filtered tournament list
  const filteredEvents = useMemo(() => {
    return filterSportEvents(allEvents, filters, savedIds);
  }, [allEvents, filters, savedIds]);

  // Group events by date for Calendar / Timeline view
  const eventsByDate = useMemo(() => {
    const map: Record<string, SportEvent[]> = {};
    for (const e of filteredEvents) {
      if (!map[e.date]) {
        map[e.date] = [];
      }
      map[e.date].push(e);
    }
    return map;
  }, [filteredEvents]);

  const handleReset = () => {
    setFilters(DEFAULT_EVENT_FILTERS);
    toast.info("All tournament filters reset");
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Tournament search link copied to clipboard!");
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!regForm.captainName.trim() || !regForm.phone.trim()) {
      toast.error("Please provide captain name and contact number");
      return;
    }

    if (regForm.type === "team" && !regForm.teamName.trim()) {
      toast.error("Please enter your team squad name");
      return;
    }

    const ticketId = `KG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Deduct spot in local state
    setAllEvents((prev) =>
      prev.map((item) =>
        item.id === registeringEvent.id
          ? { ...item, spotsLeft: Math.max(0, item.spotsLeft - 1) }
          : item,
      ),
    );

    setRegistrationSuccess({
      event: registeringEvent,
      ticketId,
      teamName: regForm.type === "team" ? regForm.teamName : `${regForm.captainName} (Solo)`,
    });

    toast.success(`Slot confirmed for ${registeringEvent.title}!`);
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostForm.title.trim() || !hostForm.venue.trim() || !hostForm.organizerName.trim()) {
      toast.error("Please fill in tournament name, venue, and organizer name");
      return;
    }

    const newEvent: SportEvent = {
      id: `custom-${Date.now()}`,
      title: hostForm.title.trim(),
      sport: hostForm.sport,
      city: hostForm.city,
      area: hostForm.area.trim() || hostForm.city,
      venue: hostForm.venue.trim(),
      date: hostForm.date.trim(),
      time: hostForm.time.trim(),
      entryFee: Number(hostForm.entryFee) || 0,
      spotsLeft: Number(hostForm.totalSpots) || 12,
      totalSpots: Number(hostForm.totalSpots) || 12,
      format: hostForm.format.trim(),
      prizePool: hostForm.prizePool.trim(),
      category: hostForm.category,
      scope: hostForm.scope || "Local",
      status: "Registration Open",
      teamFormat: hostForm.teamFormat,
      skillLevel: "Open / All Levels",
      organizer: {
        name: hostForm.organizerName.trim(),
        verified: true,
        contact: hostForm.organizerPhone.trim(),
      },
      perks: hostForm.perks
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      rulesHighlights: [
        "Standard federation rules apply",
        "Official match balls provided",
        "Reporting time 30 mins prior to match",
      ],
      registrationDeadline: `${hostForm.date}, 06:00 PM`,
      image:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    };

    setAllEvents((prev) => [newEvent, ...prev]);
    setHostModalOpen(false);
    toast.success("Tournament published successfully to KhelGrid!");

    // Reset host form
    setHostForm({
      title: "",
      sport: "Cricket",
      city: "Bengaluru",
      area: "",
      venue: "",
      date: "Sat, Jul 18",
      time: "8:00 AM",
      entryFee: "1000",
      prizePool: "₹50,000 + Trophies",
      totalSpots: "16",
      format: "Knockout (10 Overs)",
      category: "Weekend Cup",
      scope: "Local",
      teamFormat: "Small Teams (5-7)",
      organizerName: "",
      organizerPhone: "",
      perks: "Live Scoring, Refreshments, Medals",
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-6 py-5 sm:py-8 space-y-6">
      {/* 1. TOP HEADER & TOURNAMENT STATS STRIP */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Trophy className="h-4 w-4" />
            <span>KhelGrid Tournament Arena</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Pan-India Competitive Circuit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Sports Tournaments &amp; Weekend Leagues
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Compete in corporate trophies, weekend cash cups, futsal showdowns &amp; grassroots
            opens. Track live brackets, reserve team slots, and climb the player leaderboard.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            variant={filters.onlySaved ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilters((prev) => ({ ...prev, onlySaved: !prev.onlySaved }))}
            className={cn(
              "h-8.5 gap-1.5 text-xs font-semibold cursor-pointer border transition-all",
              filters.onlySaved
                ? "border-amber-400 bg-amber-500 text-white hover:bg-amber-600 font-bold"
                : "border-border/80 hover:border-amber-500/50 text-foreground",
            )}
            title={
              filters.onlySaved
                ? "Showing shortlisted tournaments (click to show all)"
                : "View your saved tournaments shortlist"
            }
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5",
                filters.onlySaved ? "fill-white text-white" : "text-amber-500 fill-amber-500/30",
              )}
            />
            <span>Shortlist ({savedCount})</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8.5 gap-1.5 text-xs font-semibold border-border/80 cursor-pointer"
            title="Share tournament search link"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Share</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setHostModalOpen(true)}
            className="h-8.5 gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Host Tournament</span>
          </Button>
        </div>
      </div>

      {/* 2. STATS CALLOUT STRIP */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 rounded-2xl border border-border/70 bg-card/50 p-3 sm:p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-foreground leading-none">
              {allEvents.length}+ Events
            </div>
            <div className="text-[11px] text-muted-foreground truncate">Live Competitions</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
            <Award className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-foreground leading-none">
              ₹5.5L+
            </div>
            <div className="text-[11px] text-muted-foreground truncate">Cash Prize Pools</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-foreground leading-none">
              Verified Referees
            </div>
            <div className="text-[11px] text-muted-foreground truncate">Certified Umpires</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500">
            <Users className="h-4 w-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="text-sm sm:text-base font-extrabold text-foreground leading-none">
              Solo &amp; Team
            </div>
            <div className="text-[11px] text-muted-foreground truncate">Open Slot Formats</div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-FACET FILTER SUITE */}
      <EventFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        totalFiltered={filteredEvents.length}
        totalAvailable={allEvents.length}
        sportCounts={sportCounts}
        categoryCounts={categoryCounts}
        savedCount={savedCount}
        onOpenHostModal={() => setHostModalOpen(true)}
      />

      {/* 4. TOURNAMENT LISTINGS: GRID VIEW, LIST VIEW, OR CALENDAR ROADMAP */}
      {filteredEvents.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-2xl border border-dashed border-border/80 bg-card p-8 sm:p-12 text-center space-y-4 w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            {filters.onlySaved ? (
              <Bookmark className="h-6 w-6 text-amber-500 fill-amber-500/20" />
            ) : (
              <Trophy className="h-6 w-6" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {filters.onlySaved ? "No Saved Tournaments Yet" : "No Tournaments Found"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              {filters.onlySaved
                ? "Click the bookmark icon or 'Save for Later' button on any tournament card to shortlist competitions, coordinate with your squad, and track live countdown deadlines."
                : "We couldn't find any competitions matching your selected category, sport, city, or budget. Try selecting another category or check upcoming fixtures across India."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {filters.onlySaved && (
              <Button
                type="button"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, onlySaved: false }))}
                className="gap-1.5 text-xs bg-primary text-primary-foreground cursor-pointer font-bold"
              >
                🏆 Browse All Tournaments
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                setFilters({ ...DEFAULT_EVENT_FILTERS, category: "registration_open" })
              }
              className="gap-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
            >
              ⚡ View Registration Open
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setFilters({ ...DEFAULT_EVENT_FILTERS, category: "upcoming" })}
              className="gap-1.5 text-xs bg-primary text-primary-foreground cursor-pointer"
            >
              📅 View All Upcoming Events
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...DEFAULT_EVENT_FILTERS, category: "local" })}
              className="gap-1.5 text-xs cursor-pointer"
            >
              📍 Local Cups
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...DEFAULT_EVENT_FILTERS, category: "national" })}
              className="gap-1.5 text-xs cursor-pointer"
            >
              🇮🇳 National Circuits
            </Button>
          </div>
        </div>
      ) : filters.view === "list" ? (
        /* LIST VIEW */
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs w-full divide-y divide-border/60">
          {filteredEvents.map((e) => {
            const isFillingFast = e.spotsLeft <= 3 && e.spotsLeft > 0;
            return (
              <div
                key={e.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={e.image}
                      alt={e.title}
                      width={80}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-20 rounded-xl object-cover bg-secondary"
                    />
                    <div className="absolute top-1 right-1">
                      <SaveForLaterButton
                        eventId={e.id}
                        eventTitle={e.title}
                        isSaved={isSaved(e.id)}
                        onToggle={() => toggleSave(e)}
                        variant="icon-badge"
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-primary flex items-center gap-1">
                        {EVENT_SPORT_ICONS[e.sport] || "🏆"} {e.sport}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {e.venue}, {e.city}
                      </span>
                      {e.scope && (
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold",
                            e.scope === "National"
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                          )}
                        >
                          {e.scope === "National" ? "🇮🇳 National Circuit" : "📍 Local Cup"}
                        </span>
                      )}
                      {e.category && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-foreground border border-border/60">
                          {e.category}
                        </span>
                      )}
                      {isFillingFast && (
                        <span className="rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 text-[10px] border border-amber-500/20">
                          ⚡ Only {e.spotsLeft} spots left!
                        </span>
                      )}
                      {e.spotsLeft > 0 && !isFillingFast && (
                        <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-1.5 py-0.5 text-[10px] border border-emerald-500/20">
                          ✓ Registration Open
                        </span>
                      )}
                      {e.spotsLeft <= 0 && (
                        <span className="rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 text-[10px] border border-rose-500/20">
                          ✕ Sold Out
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                      {e.title}
                    </h3>

                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-foreground font-medium">
                        <Calendar className="h-3 w-3 text-muted-foreground" /> {e.date}
                      </span>
                      <span>·</span>
                      <span>{e.time}</span>
                      <span>·</span>
                      <span>{e.format}</span>
                      {e.prizePool && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                            <Trophy className="h-3 w-3" /> {e.prizePool}
                          </span>
                        </>
                      )}
                      <span>·</span>
                      <TournamentCountdown
                        eventId={e.id}
                        deadline={e.registrationDeadline}
                        eventDate={e.date}
                        spotsLeft={e.spotsLeft}
                        status={e.status}
                        variant="compact"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-extrabold text-foreground">
                      {e.entryFee === 0 ? (
                        <span className="text-emerald-500 font-bold">Free Entry</span>
                      ) : (
                        `₹${e.entryFee.toLocaleString("en-IN")}`
                      )}
                      {e.entryFee > 0 && (
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {" "}
                          / entry
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {e.spotsLeft > 0 ? `${e.spotsLeft} slots left` : "Full House"}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SaveForLaterButton
                      eventId={e.id}
                      eventTitle={e.title}
                      isSaved={isSaved(e.id)}
                      onToggle={() => toggleSave(e)}
                      variant="compact"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRulesEvent(e)}
                      className="h-8.5 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Rules
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setRegisteringEvent(e)}
                      disabled={e.spotsLeft <= 0}
                      className="h-8.5 px-3 text-xs font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
                    >
                      {e.spotsLeft <= 0 ? "Slots Full" : "Register Slot"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : filters.view === "calendar" ? (
        /* CALENDAR / TIMELINE ROADMAP VIEW */
        <div className="space-y-6 w-full">
          {Object.entries(eventsByDate).map(([dateStr, dayEvents]) => (
            <div key={dateStr} className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{dateStr}</span>
                </div>
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground font-mono">
                  {dayEvents.length} fixture{dayEvents.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3.5 transition-all hover:border-primary/40 shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary flex items-center gap-1">
                          {EVENT_SPORT_ICONS[e.sport] || "🏆"} {e.sport}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {e.scope && (
                            <span
                              className={cn(
                                "text-[10px] font-bold px-1.5 py-0.2 rounded border",
                                e.scope === "National"
                                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                              )}
                            >
                              {e.scope === "National" ? "🇮🇳 National" : "📍 Local"}
                            </span>
                          )}
                          <span className="flex items-center gap-1 font-mono text-muted-foreground">
                            <Clock className="h-3 w-3" /> {e.time}
                          </span>
                          <SaveForLaterButton
                            eventId={e.id}
                            eventTitle={e.title}
                            isSaved={isSaved(e.id)}
                            onToggle={() => toggleSave(e)}
                            variant="icon"
                            className="h-6 w-6"
                          />
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-foreground line-clamp-1">{e.title}</h4>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate">
                          {e.venue}, {e.city}
                        </span>
                      </div>

                      {e.prizePool && (
                        <div className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" />
                          <span>Prize: {e.prizePool}</span>
                        </div>
                      )}

                      <TournamentCountdown
                        eventId={e.id}
                        deadline={e.registrationDeadline}
                        eventDate={e.date}
                        spotsLeft={e.spotsLeft}
                        status={e.status}
                        variant="strip"
                        className="py-1 text-[10px]"
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-foreground">
                        {e.entryFee === 0 ? "Free" : `₹${e.entryFee}`}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          {" "}
                          · {e.spotsLeft} spots left
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <SaveForLaterButton
                          eventId={e.id}
                          eventTitle={e.title}
                          isSaved={isSaved(e.id)}
                          onToggle={() => toggleSave(e)}
                          variant="compact"
                          className="h-7.5 px-2 text-[11px]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setRulesEvent(e)}
                          className="h-7.5 px-2 text-[11px]"
                        >
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setRegisteringEvent(e)}
                          disabled={e.spotsLeft <= 0}
                          className="h-7.5 px-3 text-[11px] font-bold bg-primary text-primary-foreground"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {filteredEvents.map((e) => {
            const isFillingFast = e.spotsLeft <= 3 && e.spotsLeft > 0;
            const isFree = e.entryFee === 0;

            return (
              <div
                key={e.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  {/* Media Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                    <img
                      src={e.image}
                      alt={e.title}
                      width={400}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pr-10">
                      <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                        {e.sport}
                      </span>
                      {e.scope === "National" && (
                        <span className="rounded-md bg-indigo-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20 shadow-xs">
                          🇮🇳 National
                        </span>
                      )}
                      {e.scope === "Local" && (
                        <span className="rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20 shadow-xs">
                          📍 Local Cup
                        </span>
                      )}
                      {e.category && (
                        <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                          {e.category}
                        </span>
                      )}
                      {isFree && (
                        <span className="rounded-md bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          Free Entry
                        </span>
                      )}
                    </div>

                    {/* Top-Right Save for Later Floating Button */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <SaveForLaterButton
                        eventId={e.id}
                        eventTitle={e.title}
                        isSaved={isSaved(e.id)}
                        onToggle={() => toggleSave(e)}
                        variant="icon-badge"
                      />
                    </div>

                    {/* Bottom Media Text: Date, Countdown, and Spots Warning */}
                    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs gap-1.5">
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{e.date}</span>
                        <span className="opacity-75">· {e.time}</span>
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <TournamentCountdown
                          eventId={e.id}
                          deadline={e.registrationDeadline}
                          eventDate={e.date}
                          spotsLeft={e.spotsLeft}
                          status={e.status}
                          variant="badge"
                        />
                        {isFillingFast ? (
                          <span className="rounded bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-black animate-pulse">
                            {e.spotsLeft} left!
                          </span>
                        ) : e.spotsLeft <= 0 ? (
                          <span className="rounded bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            Sold Out
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-500/90 backdrop-blur-md px-1.5 py-0.2 text-[10px] font-bold text-white">
                            Open
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <h3 className="text-base font-bold leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {e.title}
                    </h3>

                    {/* Organizer & Location */}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                        <span className="font-semibold text-foreground truncate">
                          {e.organizer?.name || "KhelGrid Verified Organizer"}
                        </span>
                        {e.organizer?.verified && (
                          <ShieldCheck
                            className="h-3.5 w-3.5 text-emerald-500 shrink-0"
                            title="Verified Organizer"
                          />
                        )}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate">
                          {e.venue}, {e.city}
                        </span>
                      </div>
                    </div>

                    {/* Format & Prize Pool Callout */}
                    <div className="pt-2 border-t border-border/50 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Format:</span>
                        <span className="font-medium text-foreground">{e.format}</span>
                      </div>

                      {e.prizePool && (
                        <div className="flex items-center justify-between font-semibold text-amber-500">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            <span>Prize Pool:</span>
                          </span>
                          <span>{e.prizePool}</span>
                        </div>
                      )}
                    </div>

                    {/* Perks tag cloud */}
                    {e.perks && e.perks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {e.perks.slice(0, 2).map((perk) => (
                          <span
                            key={perk}
                            className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] text-muted-foreground font-medium truncate max-w-[170px]"
                          >
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Registration Deadline Countdown Bar */}
                    <div className="pt-1.5">
                      <TournamentCountdown
                        eventId={e.id}
                        deadline={e.registrationDeadline}
                        eventDate={e.date}
                        spotsLeft={e.spotsLeft}
                        status={e.status}
                        variant="strip"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    <div>
                      <div className="text-base font-extrabold text-foreground leading-none">
                        {isFree ? (
                          <span className="text-emerald-500">Free</span>
                        ) : (
                          `₹${e.entryFee.toLocaleString("en-IN")}`
                        )}
                        {!isFree && (
                          <span className="text-[11px] font-normal text-muted-foreground">
                            {" "}
                            / entry
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {e.spotsLeft > 0 ? `${e.spotsLeft} spots available` : "Registration Closed"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <SaveForLaterButton
                        eventId={e.id}
                        eventTitle={e.title}
                        isSaved={isSaved(e.id)}
                        onToggle={() => toggleSave(e)}
                        variant="compact"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setRulesEvent(e)}
                        className="h-8.5 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        title="View rules and match schedule"
                      >
                        Rules
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setRegisteringEvent(e)}
                        disabled={e.spotsLeft <= 0}
                        className="h-8.5 px-3.5 text-xs font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
                      >
                        {e.spotsLeft <= 0 ? "Full" : "Register"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collapsible FAQ Section: Registration & Eligibility */}
      <TournamentFAQ onOpenHostModal={() => setHostModalOpen(true)} />

      {/* 5. TEAM / SOLO REGISTRATION MODAL */}
      {registeringEvent && (
        <Dialog open={!!registeringEvent} onOpenChange={(o) => !o && setRegisteringEvent(null)}>
          <DialogContent className="max-w-md rounded-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
            {registrationSuccess ? (
              /* Success View */
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Registration Confirmed!</h3>
                  <p className="text-xs text-muted-foreground">
                    Your slot for{" "}
                    <span className="font-semibold text-foreground">
                      {registrationSuccess.event.title}
                    </span>{" "}
                    has been locked.
                  </p>
                </div>

                <div className="rounded-xl border border-border/80 bg-secondary/30 p-3.5 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tournament Pass:</span>
                    <span className="font-mono font-bold text-primary">
                      {registrationSuccess.ticketId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Squad / Participant:</span>
                    <span className="font-semibold text-foreground">
                      {registrationSuccess.teamName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue:</span>
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      {registrationSuccess.event.venue}, {registrationSuccess.event.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reporting Time:</span>
                    <span className="font-semibold text-foreground">
                      {registrationSuccess.event.date} · {registrationSuccess.event.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setRegisteringEvent(null);
                      setRegistrationSuccess(null);
                    }}
                    className="w-full text-xs font-bold bg-primary text-primary-foreground"
                  >
                    Done &amp; View All Fixtures
                  </Button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <>
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span>Tournament Entry Registration</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    {registeringEvent.title} · {registeringEvent.date}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRegistrationSubmit} className="space-y-3.5 py-1">
                  {/* Entry Type Toggle: Squad vs Solo */}
                  <div className="flex rounded-xl bg-secondary/50 p-1 border border-border/60">
                    <button
                      type="button"
                      onClick={() => setRegForm({ ...regForm, type: "team" })}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                        regForm.type === "team"
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Team / Squad Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegForm({ ...regForm, type: "solo" })}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                        regForm.type === "solo"
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Solo / Free Agent
                    </button>
                  </div>

                  {regForm.type === "team" && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        Team / Club Name
                      </label>
                      <input
                        required
                        value={regForm.teamName}
                        onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                        placeholder="e.g. Indiranagar Strikers FC"
                        className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        {regForm.type === "team" ? "Captain Full Name" : "Participant Full Name"}
                      </label>
                      <input
                        required
                        value={regForm.captainName}
                        onChange={(e) => setRegForm({ ...regForm, captainName: e.target.value })}
                        placeholder="e.g. Rohit Sharma"
                        className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">
                        WhatsApp / Mobile
                      </label>
                      <input
                        required
                        type="tel"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Squad Size</label>
                      <select
                        value={regForm.playerCount}
                        onChange={(e) => setRegForm({ ...regForm, playerCount: e.target.value })}
                        className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                      >
                        <option value="2">2 Players (Doubles)</option>
                        <option value="5">5 Players (Futsal / Hoops)</option>
                        <option value="6">6 Players (Box Cricket)</option>
                        <option value="7">7 Players (7v7)</option>
                        <option value="11">11+ Players (Full Squad)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Jersey Color</label>
                      <input
                        value={regForm.jerseyColor}
                        onChange={(e) => setRegForm({ ...regForm, jerseyColor: e.target.value })}
                        placeholder="e.g. Navy Blue / Yellow"
                        className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">
                      Special Instructions / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={regForm.notes}
                      onChange={(e) => setRegForm({ ...regForm, notes: e.target.value })}
                      placeholder="Mention preferred match slot, player dietary preferences, or medical notes..."
                      className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Summary Callout */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-foreground font-bold">
                      <span>Total Registration Fee:</span>
                      <span className="text-sm">
                        {registeringEvent.entryFee === 0
                          ? "Free Entry"
                          : `₹${registeringEvent.entryFee}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Guaranteed minimum 2 matches. Live scoring &amp; official match balls
                      provided.
                    </p>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRegisteringEvent(null)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="text-xs font-bold bg-primary text-primary-foreground"
                    >
                      Confirm Slot Reservation
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* 6. TOURNAMENT RULES & FIXTURES MODAL */}
      {rulesEvent && (
        <Dialog open={!!rulesEvent} onOpenChange={(o) => !o && setRulesEvent(null)}>
          <DialogContent className="max-w-lg rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Tournament Rules &amp; Schedule</span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                {rulesEvent.title} · {rulesEvent.sport}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Registration Deadline Countdown Banner */}
              <TournamentCountdown
                eventId={rulesEvent.id}
                deadline={rulesEvent.registrationDeadline}
                eventDate={rulesEvent.date}
                spotsLeft={rulesEvent.spotsLeft}
                status={rulesEvent.status}
                variant="banner"
              />

              {/* Prize & Perks Box */}
              {rulesEvent.prizePool && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                  <div className="font-bold text-foreground flex items-center gap-1.5 text-amber-500">
                    <Trophy className="h-4 w-4" />
                    <span>Prize Distribution</span>
                  </div>
                  <p className="text-foreground/90 font-medium">{rulesEvent.prizePool}</p>
                </div>
              )}

              {/* Rules Highlights */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                  Official Tournament Regulations
                </h4>
                <ul className="space-y-1.5 text-muted-foreground">
                  {rulesEvent.rulesHighlights && rulesEvent.rulesHighlights.length > 0 ? (
                    rulesEvent.rulesHighlights.map((r) => (
                      <li key={r} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>
                          Standard national federation playing rules apply for all matches.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>Reporting time is 30 minutes prior to scheduled match slot.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>
                          Appropriate sport shoes &amp; sports kit mandatory for court/turf entry.
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Schedule Rounds Preview */}
              {rulesEvent.schedulePreview && rulesEvent.schedulePreview.length > 0 && (
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                    Fixture Roadmap
                  </h4>
                  <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden">
                    {rulesEvent.schedulePreview.map((s) => (
                      <div
                        key={s.round}
                        className="flex items-center justify-between p-2.5 bg-card/60"
                      >
                        <span className="font-semibold text-foreground">{s.round}</span>
                        <span className="font-mono text-muted-foreground text-[11px]">
                          {s.matchTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Contact */}
              <div className="rounded-xl border border-border/80 bg-secondary/30 p-3 space-y-1">
                <span className="font-semibold text-foreground">Official Organizer:</span>
                <p className="text-muted-foreground">
                  {rulesEvent.organizer?.name || "KhelGrid Verified Guild"}
                </p>
                {rulesEvent.organizer?.contact && (
                  <p className="text-primary font-mono text-[11px]">
                    Direct Support: {rulesEvent.organizer.contact}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60">
              <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <SaveForLaterButton
                  eventId={rulesEvent.id}
                  eventTitle={rulesEvent.title}
                  isSaved={isSaved(rulesEvent.id)}
                  onToggle={() => toggleSave(rulesEvent)}
                  variant="button"
                />

                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRulesEvent(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setRulesEvent(null);
                      setRegisteringEvent(rulesEvent);
                    }}
                    className="text-xs font-bold bg-primary text-primary-foreground"
                  >
                    Register for this Tournament
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 7. HOST / PUBLISH TOURNAMENT MODAL */}
      <Dialog open={hostModalOpen} onOpenChange={setHostModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              <span>Host a Tournament on KhelGrid</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Publish your weekend cup or corporate league to reach thousands of competitive
              athletes across India.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleHostSubmit} className="space-y-3.5 py-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Tournament Title</label>
              <input
                required
                value={hostForm.title}
                onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                placeholder="e.g. Bangalore Monsoon Futsal Trophy"
                className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Sport</label>
                <select
                  value={hostForm.sport}
                  onChange={(e) => setHostForm({ ...hostForm, sport: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {KHELGRID_SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">City</label>
                <select
                  value={hostForm.city}
                  onChange={(e) => setHostForm({ ...hostForm, city: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {KHELGRID_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Venue Name</label>
                <input
                  required
                  value={hostForm.venue}
                  onChange={(e) => setHostForm({ ...hostForm, venue: e.target.value })}
                  placeholder="e.g. AstroTurf Arena"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Area / Locality</label>
                <input
                  value={hostForm.area}
                  onChange={(e) => setHostForm({ ...hostForm, area: e.target.value })}
                  placeholder="e.g. Koramangala"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Tournament Date</label>
                <input
                  value={hostForm.date}
                  onChange={(e) => setHostForm({ ...hostForm, date: e.target.value })}
                  placeholder="e.g. Sat, Jul 18"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Start Time</label>
                <input
                  value={hostForm.time}
                  onChange={(e) => setHostForm({ ...hostForm, time: e.target.value })}
                  placeholder="e.g. 8:00 AM"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Entry Fee (₹)</label>
                <input
                  type="number"
                  value={hostForm.entryFee}
                  onChange={(e) => setHostForm({ ...hostForm, entryFee: e.target.value })}
                  placeholder="0 for Free"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Prize Pool</label>
                <input
                  value={hostForm.prizePool}
                  onChange={(e) => setHostForm({ ...hostForm, prizePool: e.target.value })}
                  placeholder="e.g. ₹50,000 + Trophies"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Organizer / Club Name
                </label>
                <input
                  required
                  value={hostForm.organizerName}
                  onChange={(e) => setHostForm({ ...hostForm, organizerName: e.target.value })}
                  placeholder="e.g. Apex Sports Club"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Contact WhatsApp</label>
                <input
                  value={hostForm.organizerPhone}
                  onChange={(e) => setHostForm({ ...hostForm, organizerPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Tournament Category</label>
                <select
                  value={hostForm.category}
                  onChange={(e) =>
                    setHostForm({
                      ...hostForm,
                      category: e.target.value as SportEvent["category"],
                    })
                  }
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  <option value="Weekend Cup">Weekend Cup</option>
                  <option value="Corporate League">Corporate League</option>
                  <option value="Championship">Championship</option>
                  <option value="Youth & Grassroots">Youth & Grassroots</option>
                  <option value="Community Open">Community Open</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Circuit Scope</label>
                <select
                  value={hostForm.scope}
                  onChange={(e) =>
                    setHostForm({
                      ...hostForm,
                      scope: e.target.value as SportEvent["scope"],
                    })
                  }
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  <option value="Local">📍 Local &amp; City Turf Cup</option>
                  <option value="National">🇮🇳 National / State Championship</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Perks &amp; Highlights (comma-separated)
              </label>
              <input
                value={hostForm.perks}
                onChange={(e) => setHostForm({ ...hostForm, perks: e.target.value })}
                placeholder="Live Scoring, Energy Drinks, Official Referees, Medals"
                className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setHostModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground"
              >
                Publish Tournament
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default EventsPage;
