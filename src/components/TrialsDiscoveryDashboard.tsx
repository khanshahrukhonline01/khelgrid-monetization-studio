import React, { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  Trophy,
  Calendar,
  Clock,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Users,
  CheckCircle2,
  Database,
  ArrowRight,
  Filter,
  Check,
  Bookmark,
  Share2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { fetchAvailableTrialsFromSupabase, type TrialDiscoveryItem } from "@/lib/trials-service";
import { SPORTS, CITIES } from "@/data/trials";
import { TrialDetailsModal } from "@/components/TrialDetailsModal";

export interface TrialsDiscoveryDashboardProps {
  className?: string;
  defaultSport?: string;
  defaultCity?: string;
  maxLimit?: number;
  showFilters?: boolean;
}

const SPORT_EMOJIS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Badminton: "🏸",
  Athletics: "🏃",
  Hockey: "🏑",
  Tennis: "🎾",
  Wrestling: "🤼",
  Swimming: "🏊",
  Basketball: "🏀",
  Kabaddi: "🤼",
  "Table Tennis": "🏓",
  Shooting: "🎯",
  Archery: "🏹",
  Boxing: "🥊",
  Squash: "🎾",
  "Soft Tennis": "🎾",
  Netball: "🤾",
  Rugby: "🏉",
  "Thang-Ta": "🥋",
  "Wrestling Freestyle": "🤼",
  Softball: "🥎",
  Yogasana: "🧘",
  "Sepak Takraw": "🤾",
  "Track Cycling": "🚴",
};

export function TrialsDiscoveryDashboard({
  className = "",
  defaultSport = "All Sports",
  defaultCity = "All Locations",
  maxLimit = 50,
  showFilters = true,
}: TrialsDiscoveryDashboardProps) {
  const auth = useAuth();
  const [trials, setTrials] = useState<TrialDiscoveryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [selectedSport, setSelectedSport] = useState<string>(defaultSport);
  const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [selectedTrialForModal, setSelectedTrialForModal] = useState<TrialDiscoveryItem | null>(
    null,
  );
  const [savedTrialIds, setSavedTrialIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("khelgrid_saved_trials_v1");
        if (stored) return new Set(JSON.parse(stored));
      } catch {
        // ignore storage access errors
      }
    }
    return new Set<string>();
  });

  // Load trials leveraging Supabase client
  const loadTrials = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAvailableTrialsFromSupabase({
        sport: selectedSport !== "All Sports" ? selectedSport : undefined,
        city: selectedCity !== "All Locations" ? selectedCity : undefined,
        maxLimit,
      });
      setTrials(res.trials);
      setIsSupabaseLive(res.isSupabaseLive);
      setLastRefreshedAt(new Date());
    } catch (err: unknown) {
      console.warn("Failed fetching trials:", err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrials();
  }, [selectedSport, selectedCity, maxLimit]);

  // Toggle bookmark/save trial
  const handleToggleSave = (trialId: string, title: string) => {
    setSavedTrialIds((prev) => {
      const next = new Set(prev);
      const isNowSaved = !next.has(trialId);
      if (isNowSaved) {
        next.add(trialId);
        toast.success(`Saved "${title}" to your bookmarks`);
      } else {
        next.delete(trialId);
        toast.info(`Removed "${title}" from bookmarks`);
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("khelgrid_saved_trials_v1", JSON.stringify(Array.from(next)));
        } catch {
          // ignore storage write errors
        }
      }
      return next;
    });
  };

  // Quick apply simulation
  const handleApply = (trial: TrialDiscoveryItem) => {
    if (trial.listingType === "competition") {
      window.open(trial.sourceUrl || "https://www.sgfi.org.in", "_blank", "noopener,noreferrer");
      return;
    }
    if (auth.applications?.includes(trial.id)) {
      toast.info(`You have already applied for ${trial.title}`);
      return;
    }
    if (auth.applyToTrial) {
      auth.applyToTrial(trial.id);
      toast.success(`Applied to ${trial.title}`, {
        description: `Confirmation registered for ${trial.city} screening camp.`,
      });
    } else {
      toast.success(`Application registered for ${trial.title}`);
    }
  };

  // Filter in-memory for instant search query & free filter
  const filteredTrials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return trials.filter((t) => {
      if (freeOnly && (t.fee > 0 || (t.feeLabel && !t.feeLabel.toLowerCase().includes("free")))) return false;
      if (q) {
        const text =
          `${t.title} ${t.academy} ${t.sport} ${t.city} ${t.venue || ""} ${t.eligibility || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [trials, searchQuery, freeOnly]);

  const handleResetFilters = () => {
    setSelectedSport("All Sports");
    setSelectedCity("All Locations");
    setSearchQuery("");
    setFreeOnly(false);
  };

  return (
    <div id="trials-discovery-dashboard-component" className={`space-y-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. HEADER & SUPABASE CLIENT STATUS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Trials Discovery Grid
              </h2>
              <Badge variant="outline" className="border-border text-xs px-2 font-mono">
                {filteredTrials.length} {filteredTrials.length === 1 ? "Trial" : "Trials"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Official scouting combines, academy screening camps, and talent trials fetched via
              Supabase client.
            </p>
          </div>
        </div>

        {/* Supabase status & refresh controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              isSupabaseLive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-primary/30 bg-primary/5 text-primary"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full inline-block ${
                isSupabaseLive ? "bg-emerald-500 animate-pulse" : "bg-primary"
              }`}
            />
            <Database className="h-3 w-3" />
            <span>{isSupabaseLive ? "Supabase Live Client" : "Verified Database Sync"}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadTrials}
            disabled={isLoading}
            className="h-8 text-xs px-2.5 gap-1.5 border-border"
            title="Refresh trials from database"
          >
            <RotateCcw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 text-xs px-3 bg-primary text-primary-foreground font-semibold"
          >
            <Link to="/search">
              <span>Full Portal</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & DISCOVERY BAR */}
      {/* ========================================================================= */}
      {showFilters && (
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3.5 shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="input-trials-discovery-search"
                type="text"
                placeholder="Search trial title, academy, venue, sport, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10 text-xs rounded-xl border-border bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Sport Selector */}
            <div className="flex items-center gap-2">
              <select
                id="select-trials-discovery-sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="All Sports">All Sports</option>
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* Quick City Selector */}
              <select
                id="select-trials-discovery-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="All Locations">All Locations</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Free Only Toggle Button */}
              <button
                type="button"
                onClick={() => setFreeOnly(!freeOnly)}
                className={`h-10 rounded-xl border px-3 text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  freeOnly
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Free Entry (₹0)
              </button>
            </div>
          </div>

          {/* Quick Sport Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Quick Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSport("All Sports")}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                selectedSport === "All Sports"
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All
            </button>
            {SPORTS.slice(0, 6).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSport(s)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                  selectedSport === s
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="mr-1">{SPORT_EMOJIS[s] || "🏅"}</span>
                <span>{s}</span>
              </button>
            ))}

            {(selectedSport !== "All Sports" ||
              selectedCity !== "All Locations" ||
              searchQuery ||
              freeOnly) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="ml-auto text-[11px] text-primary hover:underline font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRIALS DISCOVERY GRID VIEW */}
      {/* ========================================================================= */}
      {isLoading ? (
        /* Loading Skeleton Grid */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-64 rounded-2xl border border-border/80 bg-card p-5 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded bg-muted" />
                <div className="h-5 w-16 rounded bg-muted" />
              </div>
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-8 w-full rounded bg-muted mt-4" />
            </div>
          ))}
        </div>
      ) : filteredTrials.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No trials matched your criteria</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Try adjusting your sport discipline, location, or search keywords to explore all open
            scouting fixtures.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs border-border"
          >
            Clear Filters &amp; View All Trials
          </Button>
        </div>
      ) : (
        /* The Responsive Grid */
        <div
          id="trials-grid-container"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredTrials.map((trial) => {
            const isApplied = auth.applications?.includes(trial.id);
            const isSaved = savedTrialIds.has(trial.id);

            return (
              <Card
                key={trial.id}
                id={`trial-card-${trial.id}`}
                onClick={() => setSelectedTrialForModal(trial)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-border/80 bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* Card Header: Sport, City & Bookmark */}
                  <CardHeader className="p-4 pb-2 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5 font-semibold"
                        >
                          <span className="mr-1">{SPORT_EMOJIS[trial.sport] || "🏅"}</span>
                          <span>{trial.sport}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{trial.city}</span>
                        </Badge>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(trial.id, trial.title);
                        }}
                        className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        title={isSaved ? "Remove from bookmarks" : "Bookmark trial"}
                      >
                        <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Trial Title */}
                    <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2 pt-1 group-hover:text-primary transition-colors">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrialForModal(trial);
                        }}
                        className="text-left font-bold hover:text-primary transition-colors cursor-pointer"
                      >
                        {trial.title}
                      </button>
                    </h3>

                    {/* Academy & Venue */}
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div className="font-medium text-foreground/90">{trial.academy}</div>
                      {trial.venue && <div className="line-clamp-1 opacity-75">{trial.venue}</div>}
                    </div>
                  </CardHeader>

                  {/* Card Content: Details, Dates, Spots & Verification */}
                  <CardContent className="p-4 pt-1 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{trial.date}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          (!trial.feeLabel && trial.fee === 0) || trial.feeLabel?.toLowerCase().includes("free")
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                            : "border-primary/30 text-primary font-bold"
                        }
                      >
                        {trial.feeLabel || (trial.fee === 0 ? "Free Entry" : `₹${trial.fee}`)}
                      </Badge>
                    </div>

                    {/* Spots & Urgency Notice */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>
                          <strong className="text-foreground">{trial.spots}</strong> spots available
                        </span>
                      </div>

                      {trial.verifiedLabel && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{trial.verifiedLabel}</span>
                        </div>
                      )}
                    </div>

                    {/* Eligibility Snippet if available */}
                    {trial.eligibility && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed bg-muted/20 p-2 rounded-lg">
                        {trial.eligibility}
                      </p>
                    )}
                  </CardContent>
                </div>

                {/* Card Footer: Apply & Action Buttons */}
                <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrialForModal(trial);
                    }}
                    className="h-8 text-xs px-2.5 text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                  >
                    <span>View Venue &amp; Contacts</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>

                  {trial.listingType === "competition" ? (
                    <a
                      href={trial.sourceUrl || "https://www.sgfi.org.in"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <span>Official Calendar</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(trial);
                      }}
                      disabled={isApplied}
                      className={`h-8 text-xs font-semibold px-3.5 gap-1.5 cursor-pointer ${
                        isApplied
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Now</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interactive Modal for Expanded Information, Venue Location, Organizer Contact & Direct Registration */}
      <TrialDetailsModal
        trial={selectedTrialForModal}
        isOpen={!!selectedTrialForModal}
        onClose={() => setSelectedTrialForModal(null)}
        isRegistered={
          selectedTrialForModal ? auth.applications?.includes(selectedTrialForModal.id) : false
        }
        onRegister={(t) => handleApply(t as TrialDiscoveryItem)}
      />
    </div>
  );
}

export default TrialsDiscoveryDashboard;
