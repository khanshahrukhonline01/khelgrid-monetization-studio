import { useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Trophy,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  CalendarDays,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRIALS, type Trial } from "@/data/trials";
import { getRealtimeOpportunityBadge, getTrialEndDate } from "@/lib/opportunity-badge";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { toast } from "sonner";

export const SPORT_FILTER_CHIPS = [
  { id: "All", label: "All Sports", icon: Trophy },
  { id: "Cricket", label: "Cricket" },
  { id: "Football", label: "Football" },
  { id: "Badminton", label: "Badminton" },
  { id: "Athletics", label: "Athletics" },
  { id: "Hockey", label: "Hockey" },
  { id: "Tennis", label: "Tennis" },
  { id: "Wrestling", label: "Wrestling" },
] as const;

export function getSportBadgeStyle(sport: string) {
  switch (sport.toLowerCase()) {
    case "cricket":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "football":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "badminton":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    case "athletics":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "hockey":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "tennis":
      return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
    case "wrestling":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function HomeOpportunitiesSection({ trials = TRIALS }: { trials?: readonly Trial[] }) {
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const [selectedSportFilter, setSelectedSportFilter] = useState<string>("All");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeScrollIndex, setActiveScrollIndex] = useState(0);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  const discoveryStats = useMemo(() => {
    const upcomingTrials = trials.filter((trial) => {
      const match = trial.date.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2}(?:[–-]\\d{1,2})?,?\\s+2026/i);
      if (!match) return true;
      const parsed = Date.parse(match[0].replace(/[–-]/, " ").replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+(\\d{1,2})\\s+(\\d{4})/i, "$1 $2, $3"));
      return Number.isNaN(parsed) || parsed >= Date.now() - 86400000;
    });
    return {
      opportunities: upcomingTrials.length,
      sports: new Set(upcomingTrials.map((trial) => trial.sport.trim()).filter(Boolean)).size,
      cities: new Set(upcomingTrials.map((trial) => trial.city.trim()).filter(Boolean)).size,
      venues: new Set(upcomingTrials.map((trial) => trial.venue?.trim()).filter((venue): venue is string => Boolean(venue))).size,
    };
  }, [trials]);

  const currentTrials = useMemo(
    () => trials.filter((trial) => {
      const endDate = getTrialEndDate(trial.date);
      return Boolean(endDate && endDate.getTime() >= Date.now());
    }),
    [trials],
  );

  const filteredOpportunities = useMemo(() => {
    if (selectedSportFilter === "All") {
      return currentTrials;
    }
    return currentTrials.filter((t) => t.sport.toLowerCase() === selectedSportFilter.toLowerCase());
  }, [selectedSportFilter, currentTrials]);

  const handleOpportunitiesScroll = () => {
    if (!opportunitiesRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = opportunitiesRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
    const cardWidth = 292;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveScrollIndex(Math.max(0, Math.min(index, filteredOpportunities.length - 1)));
  };

  const scrollOpportunities = (direction: "left" | "right") => {
    if (opportunitiesRef.current) {
      const scrollAmount = 300;
      opportunitiesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (opportunitiesRef.current) {
      opportunitiesRef.current.scrollTo({
        left: index * 292,
        behavior: "smooth",
      });
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://www.khelgrid.com";
    const shareUrl = `${origin}/trial/${trial.id}`;
    const text = `🏆 *${trial.sport.toUpperCase()} ${trial.listingType === "competition" ? "SCHOOL GAMES FIXTURE" : "TRIAL NOTICE"}: ${trial.title}*\n\n📍 *Academy:* ${trial.academy}, ${trial.city}\n🗓️ *Date:* ${trial.date}\n🎟️ *Fee/entry:* ${trial.feeLabel || (trial.fee === 0 ? "Free Entry" : "₹" + trial.fee)}\n🛡️ *Verification:* ${trial.verifiedLabel || "Verified Organizer"}\n🎯 *Eligibility:* ${trial.ageCategory || "Open"} · ${trial.gender || "All"}\n\n👉 *${trial.listingType === "competition" ? "View details & official calendar" : "View details & registration"}:* ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp to share trial notice!");
  };

  const handleToggleBookmark = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const currentlySaved = isSaved(trial.id);
    toggleSaved(trial.id);
    if (!currentlySaved) {
      toast.success(`Saved "${trial.title}" to your shortlist`);
    } else {
      toast.info(`Removed "${trial.title}" from saved trials`);
    }
  };

  return (
    <section
      id="trials-opportunities"
      aria-label="Latest sports trials and opportunities"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      {/* Section Header with Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="latest-opportunities-heading"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Latest opportunities
            </h2>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
              aria-label="Verified listings only"
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Verified Listings
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:hidden"
              aria-hidden="true"
            >
              Swipe ↔
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Official athlete tryouts, trial applications, age cutoffs & verified organizer badges
            across India.
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <a
              href="#sports-news-section"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary/85 hover:text-primary transition-colors"
            >
              <span>Follow live match scores & tournament wire on KhelWire</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex items-center gap-1.5"
            role="group"
            aria-label="Carousel navigation controls"
          >
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30 cursor-pointer"
              onClick={() => scrollOpportunities("left")}
              disabled={!canScrollLeft}
              aria-label="Previous opportunity cards"
              aria-controls="opportunities-carousel"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30 cursor-pointer"
              onClick={() => scrollOpportunities("right")}
              disabled={!canScrollRight}
              aria-label="Next opportunity cards"
              aria-controls="opportunities-carousel"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <Link
            to="/calendar"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-border/80 bg-card px-2.5 py-1 text-foreground hover:bg-secondary hover:text-primary transition shadow-xs"
            aria-label="View Sports Selection Trials Calendar"
          >
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span>Calendar</span>
          </Link>
          <Link
            to="/search"
            className="text-sm font-semibold text-primary hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label={`Browse all ${trials.length} sports opportunities`}
          >
            Browse all ({trials.length}) →
          </Link>
        </div>
      </div>

      {/* Compact discovery stats: derived from the current trial dataset, never hard-coded totals. */}
      <div
        aria-label="Sports opportunity statistics"
        className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {[
          { label: "Upcoming opportunities", value: discoveryStats.opportunities, icon: CalendarDays },
          { label: "Sports", value: discoveryStats.sports, icon: Trophy },
          { label: "Cities", value: discoveryStats.cities, icon: MapPin },
          { label: "Venues listed", value: discoveryStats.venues, icon: MapPin },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3 shadow-xs"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xl font-bold tabular-nums leading-tight">{stat.value}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{stat.label}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Sport Filter Chips with tablist accessibility */}
      <div
        role="tablist"
        aria-label="Filter opportunities by sport"
        className="-mx-4 mt-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-2 pt-1 no-scrollbar sm:mx-0 sm:flex-wrap"
      >
        {SPORT_FILTER_CHIPS.map((chip) => {
          const count =
            chip.id === "All"
              ? trials.length
              : trials.filter((t) => t.sport.toLowerCase() === chip.id.toLowerCase()).length;
          const isActive = selectedSportFilter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              id={`filter-tab-${chip.id.toLowerCase()}`}
              aria-selected={isActive}
              aria-controls="opportunities-carousel"
              onClick={() => {
                setSelectedSportFilter(chip.id);
                if (opportunitiesRef.current) {
                  opportunitiesRef.current.scrollTo({ left: 0, behavior: "smooth" });
                }
              }}
              className={`group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground active:scale-95"
              }`}
            >
              <span>{chip.label}</span>
              <span
                aria-label={`${count} available`}
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live region announcing filtered count to screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {filteredOpportunities.length} opportunities for{" "}
        {selectedSportFilter === "All" ? "all sports" : selectedSportFilter}
      </div>

      {/* Horizontally movable opportunities carousel */}
      <div
        id="opportunities-carousel"
        ref={opportunitiesRef}
        onScroll={handleOpportunitiesScroll}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Latest sports opportunities and trials"
        className="-mx-4 mt-3 flex gap-3.5 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory scroll-smooth focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:p-0 lg:grid-cols-4"
      >
        {filteredOpportunities.map((trial, index) => {
          const saved = isSaved(trial.id);
          const sportStyle = getSportBadgeStyle(trial.sport);
          const initials = getInitials(trial.academy);
          const statusBadge = getRealtimeOpportunityBadge(trial);
          const cardTitleId = `trial-title-${trial.id}`;
          const cardDescId = `trial-meta-${trial.id}`;

          return (
            <article
              key={trial.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Opportunity ${index + 1} of ${filteredOpportunities.length}: ${trial.title}${statusBadge ? ` (${statusBadge.label})` : ""}`}
              aria-labelledby={cardTitleId}
              aria-describedby={cardDescId}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button") || target.closest("a")) return;
                if (trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
                  navigate({
                    to: "/search",
                    search: {
                      q: "CRPF",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                      trialId: trial.id,
                    },
                    hash: "crpf-recruitment-notification-card",
                  });
                } else {
                  navigate({
                    to: "/search",
                    search: {
                      q: trial.title,
                      sport:
                        trial.sport && trial.sport !== "Multi-Discipline Sports Quota"
                          ? trial.sport
                          : "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                      trialId: trial.id,
                    },
                    hash: `trial-card-${trial.id}`,
                  });
                }
              }}
              className={`group relative flex w-[82vw] max-w-[310px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-border/80 bg-gradient-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg active:scale-[0.99] sm:w-auto sm:shrink cursor-pointer select-auto ${
                statusBadge?.isExpired ? "opacity-80 grayscale-[0.25]" : ""
              }`}
            >
              <div>
                {/* Top Organizer Branding, Status Badge & Action Bar */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${sportStyle}`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {trial.academy}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{trial.verifiedLabel || "Verified"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark & WhatsApp Share Actions */}
                  <div
                    className="flex items-center gap-1 shrink-0"
                    role="group"
                    aria-label={`Actions for ${trial.title}`}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, trial)}
                      title={saved ? "Remove from saved" : "Bookmark trial"}
                      aria-label={
                        saved
                          ? `Remove ${trial.title} from saved trials`
                          : `Save ${trial.title} to bookmarks`
                      }
                      aria-pressed={saved}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                        saved
                          ? "border-primary bg-primary text-primary-foreground shadow-xs"
                          : "border-border/80 bg-background/80 text-muted-foreground hover:border-primary/50 hover:text-primary"
                      }`}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleWhatsAppShare(e, trial)}
                      title="Share notice on WhatsApp"
                      aria-label={`Share trial notice for ${trial.title} on WhatsApp`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:text-emerald-400 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                {statusBadge && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadge.style}`}
                      aria-label={`Status: ${statusBadge.label}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusBadge.dotStyle}`}
                        aria-hidden="true"
                      />
                      <statusBadge.icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>{statusBadge.label}</span>
                    </span>
                    {statusBadge.sublabel && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {statusBadge.sublabel}
                      </span>
                    )}
                  </div>
                )}

                {/* Trial Title */}
                <h3
                  id={cardTitleId}
                  className={`${statusBadge ? "mt-2" : "mt-3"} line-clamp-2 text-sm font-bold text-foreground transition-colors group-hover:text-primary`}
                >
                  <Link
                    to="/search"
                    search={{
                      q:
                        trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                          ? "CRPF"
                          : trial.title,
                      sport:
                        trial.sport && trial.sport !== "Multi-Discipline Sports Quota"
                          ? trial.sport
                          : "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                      trialId: trial.id,
                    }}
                    hash={
                      trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                        ? "crpf-recruitment-notification-card"
                        : `trial-card-${trial.id}`
                    }
                    className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                    aria-label={`${trial.title}, organized by ${trial.academy}`}
                  >
                    {trial.title}
                  </Link>
                </h3>

                {/* Category & Eligibility Tags */}
                <div
                  id={cardDescId}
                  className="mt-2.5 flex flex-wrap items-center gap-1.5"
                  aria-label="Trial categories and eligibility"
                >
                  <span className="inline-flex items-center rounded-md bg-secondary/90 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                    {trial.sport}
                  </span>
                  {trial.ageCategory && (
                    <span
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                      aria-label={`Age category: ${trial.ageCategory}`}
                    >
                      {trial.ageCategory}
                    </span>
                  )}
                  {trial.gender && (
                    <span
                      className="inline-flex items-center rounded-md border border-border/80 bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      aria-label={`Gender eligibility: ${trial.gender}`}
                    >
                      {trial.gender}
                    </span>
                  )}
                </div>

                {/* Urgency Alert */}
                {trial.urgencyText && (
                  <div
                    role="status"
                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"
                    aria-label={`Urgency alert: ${trial.urgencyText}`}
                  >
                    <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{trial.urgencyText}</span>
                  </div>
                )}
              </div>

              {/* Card Footer with Location, Date & Fee */}
              <div className="mt-4 border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" aria-hidden="true" />
                    <span className="max-w-[110px] truncate" aria-label={`Location: ${trial.city}`}>
                      {trial.city}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground/80">
                    <CalendarDays
                      className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                      aria-hidden="true"
                    />
                    <span aria-label={`Date: ${trial.date}`}>{trial.date}</span>
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div>
                    {trial.fee === 0 ? (
                      <span
                        className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                        aria-label="Registration fee: Free entry"
                      >
                        Free entry
                      </span>
                    ) : (
                      <span
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-foreground"
                        aria-label={`Registration fee: ₹${trial.fee}`}
                      >
                        ₹{trial.fee}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {trial.id === "t-delhi-doe-softball-u19-open-selection-trials-2026" && (
                      <a
                        href="https://www.edudel.nic.in/mis/misadmin/frmCircular_pdf_File.aspx?id=010000005694A6333B84699ED65AAE19E4F7E47AD6796C10562B4A7E04AEB181FC8B058C5FFA6899461896FDD205855CBF4A1DFD"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10 cursor-pointer"
                        aria-label="Open official Delhi Education softball trial circular PDF"
                      >
                        <span>Official Notice</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026" && (
                      <a
                        href="https://rect.crpf.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                        aria-label="Apply online directly on CRPF official recruitment portal"
                      >
                        <span>Apply</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <Link
                      to="/search"
                      search={{
                        q:
                          trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                            ? "CRPF"
                            : trial.title,
                        sport:
                          trial.sport && trial.sport !== "Multi-Discipline Sports Quota"
                            ? trial.sport
                            : "All Sports",
                        city: "All Locations",
                        sort: "Soonest",
                        free: false,
                        trialId: trial.id,
                      }}
                      hash={
                        trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                          ? "crpf-recruitment-notification-card"
                          : `trial-card-${trial.id}`
                      }
                      className={`inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs ${
                        statusBadge?.isExpired
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-primary"
                      }`}
                      aria-label={`View full details for ${trial.title}${statusBadge?.isExpired ? " (Registration Closed)" : ""}`}
                    >
                      {statusBadge?.isExpired ? "View Archive" : "Details"}{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile Carousel Pagination Dots */}
      <div
        className="mt-3 flex items-center justify-between px-1 sm:hidden"
        role="group"
        aria-label="Carousel pagination"
      >
        <span className="text-[11px] font-medium text-muted-foreground" aria-live="polite">
          Showing {filteredOpportunities.length} opportunities · Swipe horizontally
        </span>

        <div
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Opportunity slide indicators"
        >
          {filteredOpportunities.slice(0, Math.min(6, filteredOpportunities.length)).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeScrollIndex === i}
              aria-label={`Go to slide ${i + 1} of ${Math.min(6, filteredOpportunities.length)}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                activeScrollIndex === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
