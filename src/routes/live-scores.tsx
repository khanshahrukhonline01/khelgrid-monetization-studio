import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import { useLiveScores } from "@/hooks/useLiveScores";
import { buildSeoHead } from "@/lib/seo";
import { playScoreChime } from "@/lib/sports-audio";
import { InFeedAd, ResponsiveAd } from "@/components/ads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Radio,
  Activity,
  Flame,
  Search,
  RefreshCw,
  Volume2,
  VolumeX,
  Star,
  Share2,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  X,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LIVE_PAGE_SPORTS = [
  { name: "All Sports", icon: "▦" },
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Hockey", icon: "🏑" },
  { name: "Tennis", icon: "🎾" },
  { name: "Badminton", icon: "🏸" },
  { name: "Basketball", icon: "🏀" },
  { name: "Volleyball", icon: "🏐" },
  { name: "Kabaddi", icon: "🤼" },
  { name: "Athletics", icon: "🏃" },
  { name: "Table Tennis", icon: "🏓" },
  { name: "Boxing", icon: "🥊" },
  { name: "Wrestling", icon: "🤼‍♂️" },
  { name: "Archery", icon: "🏹" },
  { name: "Shooting", icon: "🎯" },
  { name: "Swimming", icon: "🏊" },
  { name: "Cycling", icon: "🚴" },
  { name: "Golf", icon: "⛳" },
  { name: "Rugby", icon: "🏉" },
  { name: "Esports", icon: "🎮" },
] as const;

export const Route = createFileRoute("/live-scores")({
  head: () =>
    buildSeoHead({
      title: "Live Cricket Scores & Match Center · KhelGrid",
      description:
        "Track live cricket scores, ball-by-ball updates, upcoming international fixtures, WPL, and ICC qualifiers with real-time updates on KhelGrid.",
      canonicalPath: "/live-scores",
      keywords:
        "live cricket scores India, cricket live match today, India vs West Indies live, WPL live score, ICC cricket world cup league 2, KhelGrid cricket match center",
      type: "website",
    }),
  component: LiveScoresPage,
});

type CricketFormat = "All" | "T20" | "ODI" | "Test" | "WPL";
type StatusFilter = "ALL" | "LIVE" | "UPCOMING" | "RECENT";
type ViewMode = "grid" | "list";

const CRICKET_FORMATS: { id: CricketFormat; label: string; icon: string }[] = [
  { id: "All", label: "All Cricket", icon: "🏏" },
  { id: "T20", label: "T20 Matches", icon: "⚡" },
  { id: "ODI", label: "ODI Matches", icon: "🏆" },
  { id: "Test", label: "Test Series", icon: "🛡️" },
  { id: "WPL", label: "WPL 2026", icon: "🌟" },
];

const SUGGESTED_CRICKET_FILTERS: { label: string; query: string }[] = [
  { label: "West Indies Tour of India 2026", query: "West Indies Tour of India 2026" },
  { label: "India vs West Indies", query: "India West Indies" },
  { label: "Australia Tour of South Africa", query: "Australia South Africa" },
  {
    label: "ICC Men's Cricket World Cup League 2",
    query: "ICC Men's Cricket World Cup League 2",
  },
  { label: "Asia Qualifier", query: "Asia Qualifier" },
  { label: "WPL 2026", query: "WPL" },
  { label: "Sri Lanka Tour of Pakistan", query: "Sri Lanka Tour of Pakistan" },
  { label: "Afghanistan vs Bangladesh", query: "Afghanistan Bangladesh" },
];

const CRICKET_NOTICE_INFO = {
  title: "Live Cricket Matches · Official Schedules & Real-Time Tracking",
  desc: "Listing all scheduled international bilateral tours, ICC Men's Cricket World Cup League 2, T20 Asia Qualifiers, and Women's Premier League (WPL) matches today. Click any match card to view detailed match information, venue, timings, and series status.",
  icon: "🏏",
};

const PINNED_STORAGE_KEY = "khelgrid_pinned_live_matches";
const SOUND_STORAGE_KEY = "khelgrid_live_scores_sound";

export function LiveScoresPage() {
  const [selectedFormat, setSelectedFormat] = useState<CricketFormat>("All");
  const [selectedPageSport, setSelectedPageSport] = useState("All Sports");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeModalMatch, setActiveModalMatch] = useState<LiveMatchUpdate | null>(null);

  // Sound alert preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Pinned / Favorite match IDs
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(PINNED_STORAGE_KEY);
        if (saved) return new Set(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    return new Set<string>();
  });

  // Real live sports feed hook
  const {
    matches: liveMatches,
    allMatches,
    isLiveFeedConnected,
    lastUpdated,
    sourceSummary,
    refresh: refreshLiveScores,
  } = useLiveScores({
    refreshIntervalMs: 30000,
    enableSimulation: false,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active matches combined from live feed and catalog
  const matchesState = useMemo(() => {
    if (liveMatches && liveMatches.length > 0) {
      return liveMatches as unknown as LiveMatchUpdate[];
    }
    return LIVE_SPORTS_UPDATES;
  }, [liveMatches]);

  // Save pinned matches
  const togglePin = (matchId: string, matchTitle: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      const isPinned = next.has(matchId);
      if (isPinned) {
        next.delete(matchId);
        toast.info(`Unpinned ${matchTitle}`);
      } else {
        next.add(matchId);
        toast.success(`Pinned ${matchTitle} to top`);
        if (soundEnabled) playScoreChime();
      }
      try {
        localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playScoreChime();
        toast.success("Audio alerts enabled for live score updates");
      } else {
        toast.info("Audio alerts muted");
      }
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Connected manual refresh: pulls live sports updates from providers
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshLiveScores(true);
      toast.success("Live scores updated", {
        description: `Loaded latest matches from ${sourceSummary || "official live feeds"}.`,
      });
      if (soundEnabled) playScoreChime();
    } catch {
      toast.error("Could not refresh live scores", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshLiveScores, sourceSummary, soundEnabled]);

  // Filter calculations
  const filteredMatches = useMemo(() => {
    return matchesState.filter((match) => {
      // 0. Sport Filter
      if (selectedPageSport !== "All Sports") {
        if (match.sport.toLowerCase() !== selectedPageSport.toLowerCase()) {
          return false;
        }
      }

      // 1. Cricket Format (applies when viewing Cricket or All Sports)
      if (
        selectedFormat !== "All" &&
        (match.sport === "Cricket" || selectedPageSport === "Cricket")
      ) {
        if (
          selectedFormat === "T20" &&
          !match.tournament.includes("T20") &&
          !match.stage?.includes("T20") &&
          !match.matchInfo?.includes("T20")
        ) {
          return false;
        }
        if (
          selectedFormat === "ODI" &&
          !match.tournament.includes("League 2") &&
          !match.stage?.includes("ODI") &&
          !match.matchInfo?.includes("ODI")
        ) {
          return false;
        }
        if (
          selectedFormat === "Test" &&
          !match.stage?.includes("Test") &&
          !match.tournament.includes("Test") &&
          !match.matchInfo?.includes("Test")
        ) {
          return false;
        }
        if (
          selectedFormat === "WPL" &&
          !match.tournament.includes("WPL") &&
          !match.tournament.includes("Women")
        ) {
          return false;
        }
      }

      // 2. Status
      if (selectedStatus !== "ALL" && match.status !== selectedStatus) {
        return false;
      }

      // 3. Favorites only
      if (onlyFavorites && !pinnedIds.has(match.id)) {
        return false;
      }

      // 4. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);
        const searchable = [
          match.tournament,
          match.stage || "",
          match.matchInfo || "",
          match.teamA.name,
          match.teamA.code,
          match.teamB.name,
          match.teamB.code,
          match.highlight,
          match.statusText || "",
          match.venueOrOvers || "",
          match.liveTime || "",
          match.sport,
        ]
          .join(" ")
          .toLowerCase();

        const matchesAllWords = words.every((word) => searchable.includes(word));
        if (!searchable.includes(q) && !matchesAllWords) return false;
      }

      return true;
    });
  }, [matchesState, selectedPageSport, selectedFormat, selectedStatus, onlyFavorites, pinnedIds, searchQuery]);

  // Separate pinned matches that match filter criteria
  const { pinnedMatches, regularMatches } = useMemo(() => {
    const pinned: LiveMatchUpdate[] = [];
    const regular: LiveMatchUpdate[] = [];

    for (const m of filteredMatches) {
      if (pinnedIds.has(m.id)) {
        pinned.push(m);
      } else {
        regular.push(m);
      }
    }

    return { pinnedMatches: pinned, regularMatches: regular };
  }, [filteredMatches, pinnedIds]);

  // Counts by cricket format
  const formatCounts = useMemo(() => {
    const counts: Record<CricketFormat, number> = {
      All: matchesState.length,
      T20: 0,
      ODI: 0,
      Test: 0,
      WPL: 0,
    };
    for (const m of matchesState) {
      if (
        m.tournament.includes("T20") ||
        m.stage?.includes("T20") ||
        m.matchInfo?.includes("T20")
      ) {
        counts.T20++;
      }
      if (
        m.tournament.includes("League 2") ||
        m.stage?.includes("ODI") ||
        m.matchInfo?.includes("ODI")
      ) {
        counts.ODI++;
      }
      if (
        m.stage?.includes("Test") ||
        m.tournament.includes("Test") ||
        m.matchInfo?.includes("Test")
      ) {
        counts.Test++;
      }
      if (m.tournament.includes("WPL") || m.tournament.includes("Women")) {
        counts.WPL++;
      }
    }
    return counts;
  }, [matchesState]);

  // Live match total
  const liveCount = useMemo(() => {
    return matchesState.filter((m) => m.status === "LIVE").length;
  }, [matchesState]);

  // Share match
  const handleShareMatch = async (match: LiveMatchUpdate) => {
    const shareText = `[LIVE] ${match.teamA.code} vs ${match.teamB.code} (${match.tournament}) · Check live scores on KhelGrid`;
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "https://www.khelgrid.com/live-scores";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${match.teamA.name} vs ${match.teamB.name} · KhelGrid Cricket Live`,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Match shared successfully!");
        return;
      } catch {
        // fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast.success("Score copied to clipboard!");
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  const getSportEmoji = (sport: string) => {
    switch (sport.toLowerCase()) {
      case "football":
        return "⚽";
      case "basketball":
        return "🏀";
      case "badminton":
        return "🏸";
      case "hockey":
        return "🏑";
      case "tennis":
        return "🎾";
      case "kabaddi":
        return "🤼";
      case "cricket":
      default:
        return "🏏";
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full flex-1 pb-16 sm:pb-24">
      {/* Horizontal sports selector sits directly below the global top navigation. */}
      <nav
        aria-label="Browse live sports"
        className="w-full border-b border-border/70 bg-background/95"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain py-2 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory sm:py-2.5"
            role="list"
          >
            {LIVE_PAGE_SPORTS.map((sport) => {
              const isSelected = selectedPageSport === sport.name;
              return (
                <button
                  key={sport.name}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedPageSport(sport.name);
                  }}
                  className={cn(
                    "flex shrink-0 min-w-[68px] snap-start flex-col items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-[76px] sm:px-3 sm:py-2 sm:text-xs cursor-pointer",
                    isSelected
                      ? "bg-emerald-600/10 text-emerald-700 ring-1 ring-emerald-600/25 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span aria-hidden="true" className="text-xl leading-6">
                    {sport.icon}
                  </span>
                  <span className="whitespace-nowrap">{sport.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-4 px-3 sm:space-y-6 sm:px-6 lg:px-8">
        {/* Search-first layout: keep the sports selector immediately above search. */}
        <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs sm:rounded-3xl sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search teams, tournaments or matches…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-2xl pl-10 pr-9 text-xs sm:text-sm bg-background/80 border-border/80 shadow-xs focus-visible:ring-primary"
                aria-label="Search teams, tournaments or matches"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
              {isLiveFeedConnected && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live Feed</span>
                  {lastUpdated && (
                    <span className="text-[10px] text-muted-foreground">({lastUpdated})</span>
                  )}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="gap-1.5 text-xs font-semibold rounded-xl border-border/80 transition-all cursor-pointer"
                title="Refresh live match scores"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
                />
                <span>{isRefreshing ? "Updating..." : "Refresh"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSound}
                className={cn(
                  "gap-1.5 text-xs font-semibold rounded-xl border-border/80 transition-all cursor-pointer",
                  soundEnabled &&
                    "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                )}
                title={soundEnabled ? "Mute audio alerts" : "Enable sound chimes on score changes"}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4 text-emerald-500" />
                    <span>Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <span>Muted</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
            <span className="mr-1 text-[11px] font-semibold text-muted-foreground">
              Quick Filters:
            </span>
            {SUGGESTED_CRICKET_FILTERS.map((chip) => {
              const isActive = searchQuery.toLowerCase() === chip.query.toLowerCase();
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSearchQuery(isActive ? "" : chip.query)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all cursor-pointer border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-secondary/70 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
          {searchQuery && (
            <div className="flex items-center justify-between border-t border-border/40 pt-2 text-xs text-muted-foreground">
              <span>
                Found <strong>{filteredMatches.length}</strong> match
                {filteredMatches.length === 1 ? "" : "es"} matching &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="font-semibold hover:text-foreground"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
        {/* 3. CRICKET FORMAT CATEGORY RAILS */}
        <div className="space-y-3">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 touch-scroll-rail">
            {CRICKET_FORMATS.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              const count = formatCounts[fmt.id] || 0;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border-border/80 bg-card text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  <span>{fmt.icon}</span>
                  <span>{fmt.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cricket Live Score Notice Banner (No Google link) */}
          <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 sm:p-4 text-xs">
            <span className="text-2xl shrink-0">{CRICKET_NOTICE_INFO.icon}</span>
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm">{CRICKET_NOTICE_INFO.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{CRICKET_NOTICE_INFO.desc}</p>
            </div>
          </div>

          {/* 3. SUB-FILTER BAR: STATUS + SEARCH + VIEW MODE */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-card/60 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:p-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
              {(
                [
                  { id: "ALL", label: "All Matches" },
                  { id: "LIVE", label: "Live Matches", isLive: true },
                  { id: "UPCOMING", label: "Upcoming" },
                  { id: "RECENT", label: "Recent Results" },
                ] as const
              ).map((tab) => {
                const isSelected = selectedStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedStatus(tab.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isSelected
                        ? "bg-secondary text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    {tab.isLive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View mode toggle; search is kept in one place above to avoid duplicate controls. */}
            <div className="flex items-center justify-end gap-2">
              <div className="flex items-center rounded-xl border border-border/80 bg-background/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors cursor-pointer",
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-lg transition-colors cursor-pointer",
                    viewMode === "list"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. PINNED MATCHES SECTION (if any) */}
        {pinnedMatches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Pinned Matches ({pinnedMatches.length})
              </h2>
            </div>

            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3",
              )}
            >
              {pinnedMatches.map((match) => (
                <MatchScoreCard
                  key={match.id}
                  match={match}
                  isPinned={true}
                  onTogglePin={() => togglePin(match.id, match.tournament)}
                  onOpenDetails={() => setActiveModalMatch(match)}
                  onShare={() => handleShareMatch(match)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. MAIN MATCH CARDS FEED */}
        <div className="space-y-4">
          {pinnedMatches.length > 0 && regularMatches.length > 0 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                All Matches ({regularMatches.length})
              </h2>
            </div>
          )}

          {regularMatches.length === 0 && pinnedMatches.length === 0 ? (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center space-y-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary/80 text-muted-foreground">
                <Activity className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-foreground">No matches found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  No sports matches match your current filters. Try changing your sport or status
                  filter, or clearing search query.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSport("All");
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                  setOnlyFavorites(false);
                }}
                className="rounded-xl font-semibold"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-3",
              )}
            >
              {regularMatches.map((match, idx) => (
                <div key={match.id} className="contents">
                  <MatchScoreCard
                    match={match}
                    isPinned={false}
                    onTogglePin={() => togglePin(match.id, match.tournament)}
                    onOpenDetails={() => setActiveModalMatch(match)}
                    onShare={() => handleShareMatch(match)}
                    viewMode={viewMode}
                  />
                  {/* Subtle in-feed ad insertion after 6th match */}
                  {idx === 5 && (
                    <div className={cn(viewMode === "grid" ? "col-span-full py-2" : "py-2")}>
                      <InFeedAd adSlot="liveScoresInFeed" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. SPONSORED BANNER */}
        <div className="pt-2">
          <ResponsiveAd adSlot="liveScoresBottomBanner" minHeight={90} />
        </div>

        {/* 7. LIVE SPORTS FAQ & ECOSYSTEM CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 rounded-3xl border border-border/80 bg-card p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-foreground">
                KhelGrid Live Cricket Coverage & FAQ
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  How often are live cricket scores updated?
                </h3>
                <p>
                  Scores refresh automatically every 30 seconds from official national and
                  international cricket syndication feeds. You can click &quot;Sync&quot; at any
                  moment to trigger an immediate live re-validation.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  Which cricket tournaments are covered?
                </h3>
                <p>
                  International bilateral tours (India vs West Indies, Australia vs South Africa,
                  Sri Lanka Tour of Pakistan), ICC Men&apos;s Cricket World Cup League 2, ICC T20
                  World Cup Asia Qualifiers, and Women&apos;s Premier League (WPL 2026).
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 space-y-1">
                <h3 className="font-bold text-foreground text-xs sm:text-sm">
                  Can I pin my favorite cricket matches?
                </h3>
                <p>
                  Yes! Click the star icon on any match card. Pinned matches remain pinned at the
                  very top of your feed across sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Launchpad to other KhelGrid features */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Play & Compete
              </span>
              <h3 className="text-lg font-bold text-foreground">Inspired by the live action?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Step onto the turf yourself! Discover nearby amateur games, book sports venues, or
                register for upcoming tournaments.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to="/play"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Find Casual Pickup Games</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                to="/book"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Book Turf & Courts</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
              <Link
                to="/events"
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 p-2.5 text-xs font-semibold text-foreground hover:border-primary transition"
              >
                <span>Tournaments & Leagues</span>
                <ChevronRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 8. INTERACTIVE MATCH CENTER MODAL */}
      {activeModalMatch && (
        <Dialog
          open={Boolean(activeModalMatch)}
          onOpenChange={(open) => !open && setActiveModalMatch(null)}
        >
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏏</span>
                  <div>
                    <DialogTitle className="text-base sm:text-lg font-extrabold text-foreground">
                      {activeModalMatch.tournament}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      {activeModalMatch.stage || "Official Match"} ·{" "}
                      {activeModalMatch.venueOrOvers || "Cricket Stadium"}
                    </DialogDescription>
                  </div>
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold",
                    activeModalMatch.status === "LIVE"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : activeModalMatch.status === "UPCOMING"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {activeModalMatch.status === "LIVE" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                  {activeModalMatch.status}
                </span>
              </div>
            </DialogHeader>

            {/* Scorecard Hero for Cricket */}
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏏</span>
                  <h4 className="font-extrabold text-foreground text-sm sm:text-base">
                    Official Cricket Match Center
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ball-by-ball updates, squad information, tournament fixtures, and venue overview.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 divide-x divide-border/60 border-t border-border/40 pt-3">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <span>{activeModalMatch.teamA.flag || "🏏"}</span>
                    <span>{activeModalMatch.teamA.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {activeModalMatch.teamA.code}
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {activeModalMatch.teamA.score}
                    </span>
                  </div>
                </div>
                <div className="pl-4 space-y-0.5">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <span>{activeModalMatch.teamB.flag || "🏏"}</span>
                    <span>{activeModalMatch.teamB.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      {activeModalMatch.teamB.code}
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {activeModalMatch.teamB.score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-card p-3 border border-border/60 text-xs">
                <span className="font-bold text-primary mr-1.5">Match Timing & Status:</span>
                <span className="text-foreground">
                  {activeModalMatch.statusText || activeModalMatch.highlight}
                </span>
              </div>
            </div>

            {/* Match Information Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Venue / Timing</span>
                </span>
                <span className="font-semibold text-foreground text-right truncate max-w-[240px]">
                  {activeModalMatch.liveTime || "Stadium Arena"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Series & Format</span>
                </span>
                <span className="font-semibold text-foreground">
                  {activeModalMatch.matchInfo || activeModalMatch.stage || "Bilateral Tour"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 p-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  <span>Data Attribution</span>
                </span>
                <span className="font-semibold text-foreground">
                  {activeModalMatch.source || "Official Cricket Match Center"}
                </span>
              </div>
            </div>

            {/* Footer Modal Actions (No external Google redirect) */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShareMatch(activeModalMatch)}
                className="gap-1.5 text-xs rounded-xl cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Score</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setActiveModalMatch(null)}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface MatchScoreCardProps {
  match: LiveMatchUpdate;
  isPinned: boolean;
  onTogglePin: () => void;
  onOpenDetails: () => void;
  onShare: () => void;
  viewMode: ViewMode;
}

function MatchScoreCard({
  match,
  isPinned,
  onTogglePin,
  onOpenDetails,
  onShare,
  viewMode,
}: MatchScoreCardProps) {
  const isLive = match.status === "LIVE";
  const isUpcoming = match.status === "UPCOMING";

  const sportIcon =
    match.sport === "Football"
      ? "⚽"
      : match.sport === "Basketball"
        ? "🏀"
        : match.sport === "Badminton"
          ? "🏸"
          : match.sport === "Hockey"
            ? "🏑"
            : match.sport === "Tennis"
              ? "🎾"
              : match.sport === "Kabaddi"
                ? "🤼"
                : "🏏";

  const renderBadge = (team: { name: string; logo?: string; flag?: string }) => {
    if (team.logo) {
      return <img src={team.logo} alt="" className="h-4 w-4 object-contain inline-block shrink-0" />;
    }
    return <span>{team.flag || sportIcon}</span>;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // If user clicked inside an action button (e.g. pin, share), don't trigger details modal
    if (target.closest("button.action-btn") || target.closest("a")) {
      return;
    }
    onOpenDetails();
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs transition-all hover:border-primary/80 hover:ring-2 hover:ring-primary/20 hover:shadow-md cursor-pointer"
      >
        {/* Left: Tournament + Teams */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xl shrink-0">{sportIcon}</span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
              <span className="font-bold text-foreground truncate">{match.tournament}</span>
              {match.stage && <span className="text-primary font-semibold">· {match.stage}</span>}
              {match.venueOrOvers && !match.stage?.includes(match.venueOrOvers) && (
                <span className="font-mono text-muted-foreground font-medium">
                  ({match.venueOrOvers})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-foreground">
                <span className="flex items-center gap-1.5">
                  {renderBadge(match.teamA)}
                  <span>{match.teamA.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({match.teamA.code})
                  </span>
                </span>
                <span className="text-muted-foreground font-normal">vs</span>
                <span className="flex items-center gap-1.5">
                  {renderBadge(match.teamB)}
                  <span>{match.teamB.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({match.teamB.code})
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails();
                }}
                className="action-btn inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-xs cursor-pointer"
              >
                <span>View Match Info</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Status badge + Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
              isLive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isUpcoming
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
            {match.status}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className="action-btn p-1.5 text-muted-foreground hover:text-amber-500 transition-colors rounded-lg cursor-pointer"
              title={isPinned ? "Unpin match" : "Pin match to top"}
            >
              <Star className={cn("h-4 w-4", isPinned && "fill-amber-500 text-amber-500")} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="action-btn p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg cursor-pointer"
              title="Share score"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              className="action-btn inline-flex items-center gap-1 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <span>Details</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs transition-all hover:border-primary/80 hover:ring-2 hover:ring-primary/20 hover:shadow-md cursor-pointer"
    >
      {/* Top Header: Tournament, Stage & Pin */}
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5 text-[11px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm shrink-0">{sportIcon}</span>
            <span
              className="font-bold text-foreground truncate max-w-[190px]"
              title={match.tournament}
            >
              {match.tournament}
            </span>
          </div>
          {match.stage && (
            <p
              className="text-primary font-semibold text-[11px] truncate mt-0.5"
              title={match.stage}
            >
              {match.stage}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.2 text-[10px] font-bold",
              isLive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : isUpcoming
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                  : "bg-secondary text-muted-foreground",
            )}
          >
            {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
            {match.status}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="action-btn p-1 text-muted-foreground hover:text-amber-500 transition-colors rounded-lg cursor-pointer ml-1"
            title={isPinned ? "Unpin match" : "Pin match to top"}
          >
            <Star className={cn("h-3.5 w-3.5", isPinned && "fill-amber-500 text-amber-500")} />
          </button>
        </div>
      </div>

      {/* Middle: Teams & Scores */}
      <div className="py-3.5 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-foreground">
            <span className="flex items-center gap-2 truncate">
              <span className="shrink-0">{renderBadge(match.teamA)}</span>
              <span className="truncate" title={match.teamA.name}>
                {match.teamA.name}
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-mono uppercase">
                {match.teamA.code}
              </span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {match.teamA.score}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-foreground">
            <span className="flex items-center gap-2 truncate">
              <span className="shrink-0">{renderBadge(match.teamB)}</span>
              <span className="truncate" title={match.teamB.name}>
                {match.teamB.name}
              </span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-mono uppercase">
                {match.teamB.code}
              </span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {match.teamB.score}
              </span>
            </div>
          </div>
        </div>

        {/* Action button to open match center */}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="action-btn flex items-center justify-center gap-1.5 w-full rounded-xl border border-primary/40 bg-primary/10 py-2.5 px-3 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-xs cursor-pointer"
        >
          <span>View Match Center</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Commentary Highlight Banner */}
      <div className="rounded-xl bg-secondary/50 p-2.5 text-[11px] space-y-1 mb-3">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
          <span className="truncate">{match.venueOrOvers || match.sport}</span>
          <span className="truncate">{match.liveTime || "Live"}</span>
        </div>
        <p className="font-medium text-foreground/90 text-xs line-clamp-1">
          {match.statusText || match.highlight}
        </p>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="action-btn inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition cursor-pointer"
        >
          <Share2 className="h-3 w-3" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="action-btn inline-flex items-center gap-1 text-xs font-bold rounded-lg px-2.5 py-1 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
        >
          <span>Match Details</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export default LiveScoresPage;
