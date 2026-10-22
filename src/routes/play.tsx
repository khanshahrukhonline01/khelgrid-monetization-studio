import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import { GAMES, KHELGRID_SPORTS, KHELGRID_CITIES } from "@/data/khelgrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Clock,
  Trophy,
  Users,
  Zap,
  Plus,
  Search,
  CheckCircle2,
  Share2,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Filter,
  X,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { InFeedAd, ResponsiveAd } from "@/components/ads";
import type { EnrichedGame, PlayerRosterItem, PlayDateFilter } from "@/components/play/types";
import { HostGameModal } from "@/components/play/HostGameModal";
import { GameDetailsModal } from "@/components/play/GameDetailsModal";
import { PlayEditorialGuide } from "@/components/play/PlayEditorialGuide";
import { PlayFAQ } from "@/components/play/PlayFAQ";
import { PlaySEO } from "@/components/play/PlaySEO";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/play")({
  head: () =>
    buildSeoHead({
      title: "Find Players & Join Pickup Sports Games Near You · KhelGrid Play",
      description:
        "Discover amateur football, badminton, box cricket, pickleball, and basketball pickup games near you. Match by skill level, join active slots, or host your own casual game across Indian cities.",
      canonicalPath: "/play",
      keywords:
        "pickup games India, casual football turf Bengaluru, badminton games Mumbai, box cricket Delhi NCR, pickleball Hyderabad, sports player matching, amateur sports community, split turf costs",
      type: "website",
    }),
  component: PlayPage,
});

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

// Initial enriched games list from default khelgrid data
const INITIAL_GAMES: EnrichedGame[] = GAMES.map((g) => ({
  ...g,
  description: `Join friendly ${g.skillLevel.toLowerCase()} ${g.sport} pickup action at ${g.venue}, ${g.city}. Please carry appropriate sports attire and arrive 15 minutes before the start time.`,
  rules: [
    "Fair play and respectful communication mandatory.",
    "Non-marking shoes for indoor wooden courts; turf shoes for synthetic grass.",
    "Equal rotation for all players.",
  ],
  equipmentProvided: ["Match ball / Shuttles", "Training bibs (pinnies)"],
  equipmentNeeded: ["Hydration bottle", "Appropriate footwear", "Personal kit"],
  players: [
    {
      id: `host-${g.id}`,
      name: g.host,
      role: "Host & Organizer",
      skillLevel: g.skillLevel,
      joinedAt: "Created slot",
      isHost: true,
    },
  ],
}));

function PlayPage() {
  const [games, setGames] = useState<EnrichedGame[]>(INITIAL_GAMES);
  const [joinedGameIds, setJoinedGameIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "my-games">("all");
  const [sport, setSport] = useState("All");
  const [city, setCity] = useState("All");
  const [level, setLevel] = useState("All");
  const [dateFilter, setDateFilter] = useState<PlayDateFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<EnrichedGame | null>(null);

  // Load persisted hosted games and joined IDs from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedHosted = localStorage.getItem("khelgrid_hosted_games_v1");
        const storedJoined = localStorage.getItem("khelgrid_joined_game_ids_v1");

        const parsedHosted: EnrichedGame[] = storedHosted ? JSON.parse(storedHosted) : [];
        const parsedJoined: string[] = storedJoined ? JSON.parse(storedJoined) : [];

        setJoinedGameIds(parsedJoined);

        if (parsedHosted.length > 0) {
          // Merge user hosted games at the top
          setGames((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const newOnes = parsedHosted.filter((g) => !existingIds.has(g.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (err) {
        console.warn("Error reading play state from localStorage", err);
      }
    }
  }, []);

  const handleGameCreated = (newGame: EnrichedGame) => {
    setGames((prev) => [newGame, ...prev]);
    setJoinedGameIds((prev) => {
      const updated = [...prev, newGame.id];
      if (typeof window !== "undefined") {
        localStorage.setItem("khelgrid_joined_game_ids_v1", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleJoinGame = (gameId: string, player: PlayerRosterItem) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const currentPlayers = g.players || [];
          return {
            ...g,
            joined: Math.min(g.capacity, g.joined + 1),
            players: [...currentPlayers, player],
          };
        }
        return g;
      }),
    );

    setJoinedGameIds((prev) => {
      const updated = Array.from(new Set([...prev, gameId]));
      if (typeof window !== "undefined") {
        localStorage.setItem("khelgrid_joined_game_ids_v1", JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedGameForDetails && selectedGameForDetails.id === gameId) {
      setSelectedGameForDetails((prev) =>
        prev
          ? {
              ...prev,
              joined: Math.min(prev.capacity, prev.joined + 1),
              players: [...(prev.players || []), player],
            }
          : null,
      );
    }
  };

  const handleLeaveGame = (gameId: string, playerId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          const currentPlayers = g.players || [];
          return {
            ...g,
            joined: Math.max(1, g.joined - 1),
            players: currentPlayers.filter((p) => p.id !== playerId),
          };
        }
        return g;
      }),
    );

    setJoinedGameIds((prev) => {
      const updated = prev.filter((id) => id !== gameId);
      if (typeof window !== "undefined") {
        localStorage.setItem("khelgrid_joined_game_ids_v1", JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedGameForDetails && selectedGameForDetails.id === gameId) {
      setSelectedGameForDetails((prev) =>
        prev
          ? {
              ...prev,
              joined: Math.max(1, prev.joined - 1),
              players: (prev.players || []).filter((p) => p.id !== playerId),
            }
          : null,
      );
    }
  };

  // Quick category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    games.forEach((g) => {
      counts[g.sport] = (counts[g.sport] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Filtered games list
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // Tab filter
      if (activeTab === "my-games") {
        const isJoined = joinedGameIds.includes(g.id) || g.isUserHosted;
        if (!isJoined) return false;
      }

      // City filter
      if (city !== "All" && g.city !== city) return false;

      // Sport filter
      if (sport !== "All" && g.sport !== sport) return false;

      // Level filter
      if (level !== "All" && g.skillLevel !== level) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          g.venue.toLowerCase().includes(q) ||
          g.sport.toLowerCase().includes(q) ||
          g.host.toLowerCase().includes(q) ||
          (g.area && g.area.toLowerCase().includes(q)) ||
          g.city.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Date / Open Spots Quick Filter
      if (dateFilter === "open" && g.joined >= g.capacity) {
        return false;
      }

      return true;
    });
  }, [games, activeTab, joinedGameIds, city, sport, level, searchQuery, dateFilter]);

  const hasActiveFilters =
    sport !== "All" ||
    city !== "All" ||
    level !== "All" ||
    dateFilter !== "all" ||
    searchQuery !== "";

  const clearAllFilters = useCallback(() => {
    setSport("All");
    setCity("All");
    setLevel("All");
    setDateFilter("all");
    setSearchQuery("");
  }, []);

  return (
    <div id="play-main-content" className="min-w-0 flex-1">
      {/* Schema.org Structured Data */}
      <PlaySEO />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        {/* Header Section */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">
                  Community Sports Matches
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Real-time amateur player matching
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Find Players. Join Pickup Games.
              </h1>
              <p className="mt-1 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Connect with nearby athletes for recreational football, badminton, box cricket, and
                pickleball games. Verified skill matching, fair court cost splitting, and zero
                markups.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                id="play-host-game-btn"
                className="rounded-full font-medium shadow-sm gap-1.5"
                onClick={() => setHostModalOpen(true)}
              >
                <Plus className="h-4 w-4" /> Host a Game
              </Button>
            </div>
          </div>

          {/* Tab Navigation: All Games vs My RSVPs */}
          <div className="flex items-center gap-2 border-b border-border/70 pt-2" role="tablist">
            <button
              id="play-tab-all"
              role="tab"
              aria-selected={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "all"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All Open Games</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-normal">
                {games.length}
              </span>
            </button>

            <button
              id="play-tab-my-games"
              role="tab"
              aria-selected={activeTab === "my-games"}
              onClick={() => setActiveTab("my-games")}
              className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "my-games"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>My Hosted & Joined Slots</span>
              {joinedGameIds.length > 0 && (
                <span className="rounded-full bg-primary/20 text-primary px-2 py-0.5 text-[11px] font-bold">
                  {joinedGameIds.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Search & Filter Controls */}
        <section id="play-filter-controls" className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="play-search-input"
                placeholder="Search by venue name, area, or host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-card/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* City Filter */}
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="play-city-select" className="h-10 w-full sm:w-[160px] bg-card/60">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder="City" />
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

            {/* Sport Filter */}
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger id="play-sport-select" className="h-10 w-full sm:w-[160px] bg-card/60">
                <Trophy className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sports</SelectItem>
                {KHELGRID_SPORTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s} ({categoryCounts[s] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="play-level-select" className="h-10 w-full sm:w-[160px] bg-card/60">
                <Zap className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l} {l !== "All" ? "Level" : "Levels"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground font-medium mr-1">Quick Filter:</span>
              <button
                id="quick-filter-all"
                onClick={() => setDateFilter("all")}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  dateFilter === "all"
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "border-border/70 text-muted-foreground hover:bg-secondary"
                }`}
              >
                All Matches
              </button>
              <button
                id="quick-filter-open"
                onClick={() => setDateFilter("open")}
                className={`px-3 py-1 rounded-full border transition-colors ${
                  dateFilter === "open"
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "border-border/70 text-muted-foreground hover:bg-secondary"
                }`}
              >
                Spots Available Only
              </button>
            </div>

            {hasActiveFilters && (
              <button
                id="play-clear-filters-btn"
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* Games Counter Banner */}
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-3">
          <span>
            Showing <strong>{filteredGames.length}</strong> pickup game
            {filteredGames.length === 1 ? "" : "s"}
            {city !== "All" ? ` in ${city}` : ""}
            {sport !== "All" ? ` for ${sport}` : ""}
          </span>
          <span className="hidden sm:inline">Click any game to inspect roster & confirm spot</span>
        </div>

        {/* Games Card Grid */}
        <section id="play-games-grid" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((g, idx) => {
            const isJoined = joinedGameIds.includes(g.id);
            const full = g.joined >= g.capacity;
            const spotsLeft = Math.max(0, g.capacity - g.joined);
            const pct = Math.min(100, Math.round((g.joined / g.capacity) * 100));

            return (
              <div key={g.id} className="flex flex-col">
                <div
                  id={`game-card-${g.id}`}
                  className={`flex flex-col justify-between rounded-2xl border bg-gradient-card p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5 shadow-sm h-full ${
                    isJoined ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-border"
                  }`}
                >
                  <div>
                    {/* Top Badges & Cost */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className="bg-primary/15 border-primary/40 text-primary font-semibold text-xs">
                          {g.sport}
                        </Badge>
                        <Badge variant="outline" className="border-border text-[10px]">
                          {g.skillLevel}
                        </Badge>
                        {isJoined && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Joined
                          </Badge>
                        )}
                        {g.isUserHosted && (
                          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px]">
                            Your Slot
                          </Badge>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-foreground">
                          ₹{g.costPerPlayer}
                        </div>
                        <div className="text-[10px] text-muted-foreground">per player</div>
                      </div>
                    </div>

                    {/* Venue & Host Title */}
                    <h3 className="mt-3 text-base font-bold tracking-tight text-foreground line-clamp-1">
                      {g.venue}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hosted by <span className="font-medium text-foreground">{g.host}</span>
                    </p>

                    {/* Match Meta Information */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-secondary/30 p-2.5 rounded-xl border border-border/40">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{g.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{g.time}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5 truncate">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {g.area ? `${g.area}, ` : ""}
                          {g.city}
                        </span>
                      </div>
                    </div>

                    {/* Capacity & Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <strong>{g.joined}</strong>/{g.capacity} joined
                        </span>
                        <span
                          className={`font-medium ${
                            full
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {full ? "Roster Full" : `${spotsLeft} spots open`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full transition-all duration-300 ${
                            full ? "bg-amber-500" : "bg-primary"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-2 border-t border-border/60 flex items-center gap-2">
                    <Button
                      id={`game-view-roster-btn-${g.id}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setSelectedGameForDetails(g)}
                    >
                      Inspect Roster
                    </Button>
                    <Button
                      id={`game-join-btn-${g.id}`}
                      size="sm"
                      className={`flex-1 text-xs font-medium ${
                        isJoined ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                      }`}
                      onClick={() => setSelectedGameForDetails(g)}
                    >
                      {isJoined ? "Manage RSVP" : full ? "View Slot" : "Join Game"}
                    </Button>
                  </div>
                </div>

                {/* AdSense InFeed Ad Placement after index 2 and index 5 */}
                {(idx === 2 || idx === 5) && (
                  <div className="mt-4">
                    <InFeedAd adSlot="play-grid-infeed" minHeight={240} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div
              id="play-empty-state"
              className="col-span-full rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center space-y-3"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">No pickup games found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {activeTab === "my-games"
                    ? "You have not joined or hosted any pickup games yet. Browse all games to reserve your first slot!"
                    : "No games matched your current filters. Be the first to host an open game at your local turf!"}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Reset Filters
                  </Button>
                )}
                <Button size="sm" onClick={() => setHostModalOpen(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Host a Game
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* AdSense Responsive Unit Before Editorial Section */}
        <div className="mt-12">
          <ResponsiveAd adSlot="play-mid-responsive" minHeight={120} />
        </div>

        {/* High-Value Comprehensive Editorial Guide (Eliminating Thin Content) */}
        <PlayEditorialGuide />

        {/* Frequently Asked Questions with Schema.org FAQPage */}
        <PlayFAQ />
      </div>

      {/* Host Game Dialog */}
      <HostGameModal
        open={hostModalOpen}
        onOpenChange={setHostModalOpen}
        onGameCreated={handleGameCreated}
      />

      {/* Game Details & Roster Modal */}
      <GameDetailsModal
        game={selectedGameForDetails}
        open={Boolean(selectedGameForDetails)}
        onOpenChange={(open) => {
          if (!open) setSelectedGameForDetails(null);
        }}
        onJoinGame={handleJoinGame}
        onLeaveGame={handleLeaveGame}
        isJoined={
          selectedGameForDetails
            ? joinedGameIds.includes(selectedGameForDetails.id) ||
              selectedGameForDetails.isUserHosted
            : false
        }
      />
    </div>
  );
}
