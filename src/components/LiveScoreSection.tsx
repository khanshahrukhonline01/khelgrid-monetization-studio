import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { type LiveMatchUpdate } from "@/data/liveSports";
import { useLiveSportsUpdates } from "@/lib/live-sports-api";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Flame,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Share2,
  ExternalLink,
  TableProperties,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function CricketWicketsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m14 7 3-3a1.5 1.5 0 0 1 2 2l-3 3" />
      <path d="m13 8-7.5 7.5a2.5 2.5 0 0 0 3.5 3.5L16.5 11.5" />
      <line x1="18" y1="14" x2="18" y2="21" />
      <line x1="21" y1="15" x2="21" y2="21" />
      <line x1="15" y1="16" x2="15" y2="21" />
      <line x1="14" y1="14" x2="22" y2="14" />
    </svg>
  );
}

function SportBadgeIcon({ sport, className = "h-4 w-4" }: { sport: string; className?: string }) {
  if (sport === "Cricket") return <CricketWicketsIcon className={className} />;
  if (sport === "Football") return <span className="text-sm">⚽</span>;
  if (sport === "Badminton") return <span className="text-sm">🏸</span>;
  if (sport === "Kabaddi") return <span className="text-sm">🤼</span>;
  if (sport === "Hockey") return <span className="text-sm">🏑</span>;
  if (sport === "Tennis") return <span className="text-sm">🎾</span>;
  return <Activity className={className} />;
}

const SPORT_FILTERS = ["All", "Cricket", "Football", "Tennis"] as const;

export function LiveScoreSection() {
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [activeMatchModal, setActiveMatchModal] = useState<LiveMatchUpdate | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { matches, loading, error, fetchedAt, stale } = useLiveSportsUpdates();

  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredMatches = useMemo(() => {
    if (selectedSport === "All") return matches;
    return matches.filter((m) => m.sport.toLowerCase() === selectedSport.toLowerCase());
  }, [matches, selectedSport]);

  const liveMatchesCount = useMemo(() => {
    return matches.filter((m) => m.status === "LIVE").length;
  }, [matches]);

  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 340;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(index, filteredMatches.length - 1));
  }, [filteredMatches.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, filteredMatches]);

  const scroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleShare = async (e: React.MouseEvent, match: LiveMatchUpdate) => {
    e.stopPropagation();
    const shareText = `${match.tournament} · ${match.teamA.code} (${match.teamA.score}) vs ${match.teamB.code} (${match.teamB.score}) · Live on KhelGrid`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Live Match Score",
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      toast.success("Match score copied to clipboard!");
    }
  };

  return (
    <section
      id="live-scores"
      aria-labelledby="live-scores-heading"
      className="mt-8 border-t border-border/60 pt-6 sm:mt-10 sm:pt-8"
    >
      {/* Header Container matching user's design with bold title and orange underline bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative inline-block">
              <h2
                id="live-scores-heading"
                className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
              >
                Live Score
              </h2>
              {/* Distinctive Orange Underline Indicator from Screenshot */}
              <div className="mt-1.5 h-1 w-14 rounded-full bg-amber-500 shadow-xs shadow-amber-500/40" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
              </span>
              <span>{liveMatchesCount} Live</span>
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Provider-sourced cricket, football, and tennis scores and match status.
          </p>
          <p className="mt-1 text-xs text-muted-foreground" role="status">
            {loading ? "Checking connected sports providers…" : error ? error : stale ? "Showing cached provider data; refresh may be delayed." : fetchedAt ? `Provider data updated ${new Date(fetchedAt).toLocaleString()}.` : "Live feed not connected. No sample scores are displayed."}
          </p>
        </div>

        {/* Right side: Sport Filter Pills & Carousel Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sport Filter Chips */}
          <div
            role="tablist"
            aria-label="Filter live scores by sport"
            className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-full border border-border/70 bg-card/60 p-0.5"
          >
            {SPORT_FILTERS.map((sport) => {
              const active = selectedSport === sport;
              return (
                <button
                  key={sport}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedSport(sport)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30"
              aria-label="Scroll left in live scores"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full border-border/80 bg-background/80 disabled:opacity-30"
              aria-label="Scroll right in live scores"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live Matches Horizontal Scroll Reel (Matching Image Layout) */}
      <div
        ref={carouselRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Live sports matches"
        className="-mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:p-0 lg:grid-cols-3"
      >
        {filteredMatches.map((match, idx) => {
          const isCricket = match.sport === "Cricket";
          const matchLabel = match.matchInfo || `${match.stage || "Match"} • ${match.tournament}`;

          return (
            <article
              key={match.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Match ${idx + 1} of ${filteredMatches.length}: ${matchLabel}`}
              onClick={() => setActiveMatchModal(match)}
              className="group relative flex w-[86vw] min-w-[280px] max-w-[360px] shrink-0 snap-start flex-col justify-between rounded-2xl border border-[#232938] bg-[#141822] p-4 sm:p-5 text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl cursor-pointer sm:w-auto sm:shrink"
            >
              <div>
                {/* Top Row: Sport Icon + Match Title + Live Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-400 group-hover:text-amber-400 transition-colors">
                      <SportBadgeIcon sport={match.sport} className="h-4 w-4 shrink-0" />
                    </span>
                    <span className="truncate text-xs font-medium text-slate-300">
                      {matchLabel}
                    </span>
                  </div>

                  {match.status === "LIVE" ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0a2618] border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400 tracking-wider">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      <span>LIVE</span>
                    </span>
                  ) : match.status === "RECENT" ? (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      RESULT
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold">
                      UPCOMING
                    </span>
                  )}
                </div>

                {/* Teams & Scores Block (Exact Visual Hierarchy of Image) */}
                <div className="mt-3.5 space-y-2.5">
                  {/* Team A */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-sm shadow-xs overflow-hidden border border-white/10">
                        {match.teamA.flag || match.teamA.code.charAt(0)}
                      </div>
                      <span className="truncate text-sm font-bold text-slate-100">
                        {match.teamA.code}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold tracking-tight text-white">
                      {match.teamA.score}
                    </span>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold text-sm shadow-xs overflow-hidden border border-white/10">
                        {match.teamB.flag || match.teamB.code.charAt(0)}
                      </div>
                      <span className="truncate text-sm font-bold text-slate-100">
                        {match.teamB.code}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-semibold tracking-tight text-slate-300">
                      {match.teamB.score}
                    </span>
                  </div>
                </div>

                {/* Status Text (e.g. BBZ elected to bowl, Stumps: Day 2, Match Abandoned) */}
                <div className="mt-4 pt-1">
                  <p className="text-xs text-slate-400 font-medium line-clamp-1">
                    {match.statusText || match.highlight}
                  </p>
                </div>
              </div>

              {/* Card Footer: Schedule > and Points Table > */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMatchModal(match);
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span>Schedule</span>
                  <span aria-hidden="true">›</span>
                </button>

                <div className="flex items-center gap-3">
                  {match.hasPointsTable !== false && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMatchModal(match);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <span>Points Table</span>
                      <span aria-hidden="true">›</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleShare(e, match)}
                    title="Share match score"
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mobile Slide Dot Indicators */}
      <div
        className="mt-3 flex items-center justify-center gap-1.5 sm:hidden"
        role="tablist"
        aria-label="Live match indicators"
      >
        {filteredMatches.slice(0, 6).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={activeSlideIndex === i}
            aria-label={`Go to live match ${i + 1}`}
            onClick={() => {
              const el = carouselRef.current;
              if (!el) return;
              const cards = el.querySelectorAll<HTMLElement>("article");
              if (cards[i]) {
                cards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
              }
            }}
            className={`h-1.5 rounded-full transition-all ${
              activeSlideIndex === i ? "w-5 bg-amber-500" : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Dedicated Interactive Match Center Dialog (when user clicks any match card or Schedule / Points Table) */}
      <Dialog
        open={Boolean(activeMatchModal)}
        onOpenChange={(open) => !open && setActiveMatchModal(null)}
      >
        {activeMatchModal && (
          <DialogContent className="max-w-xl rounded-2xl bg-[#141822] text-white border border-[#232938] p-5 sm:p-6 shadow-2xl">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <SportBadgeIcon sport={activeMatchModal.sport} className="h-4 w-4" />
                  <span>{activeMatchModal.tournament}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a2618] border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  ● LIVE
                </span>
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                {activeMatchModal.teamA.name} ({activeMatchModal.teamA.code}) vs{" "}
                {activeMatchModal.teamB.name} ({activeMatchModal.teamB.code})
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300">
                {activeMatchModal.matchInfo || activeMatchModal.stage} · {activeMatchModal.liveTime}
              </DialogDescription>
            </DialogHeader>

            {/* Scorecard Overview */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeMatchModal.teamA.flag || "🏏"}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeMatchModal.teamA.name}</h4>
                    <span className="text-[11px] text-slate-400">Batting 1st</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-extrabold text-amber-400">
                    {activeMatchModal.teamA.score}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeMatchModal.teamB.flag || "🏏"}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{activeMatchModal.teamB.name}</h4>
                    <span className="text-[11px] text-slate-400">Bowling / 2nd Inning</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-semibold text-slate-300">
                    {activeMatchModal.teamB.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Match State & Venue Info */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Match Status
                </span>
                <p className="mt-1 font-semibold text-slate-200">
                  {activeMatchModal.statusText || activeMatchModal.highlight}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Overs / Period
                </span>
                <p className="mt-1 font-semibold text-slate-200 font-mono">
                  {activeMatchModal.venueOrOvers || "In Play"}
                </p>
              </div>
            </div>

            {/* Highlights Feed */}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5">
              <h5 className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Live Commentary Highlight</span>
              </h5>
              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
                {activeMatchModal.highlight}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
              <Link
                to="/events"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline"
              >
                <span>Full Tournament Fixtures</span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveMatchModal(null)}
                className="border-white/20 bg-transparent text-white hover:bg-white/10 text-xs"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
