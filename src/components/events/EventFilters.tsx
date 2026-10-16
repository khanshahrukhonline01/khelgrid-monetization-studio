import { useMemo } from "react";
import type { SportEvent } from "@/data/playo";
import { PLAYO_SPORTS, PLAYO_CITIES } from "@/data/playo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Trophy,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  DollarSign,
  Grid,
  List,
  CalendarDays,
  PlusCircle,
  ShieldCheck,
  Check,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EventCategoryFilter =
  | "all"
  | "upcoming"
  | "registration_open"
  | "local"
  | "national"
  | "Weekend Cup"
  | "Corporate League"
  | "Championship"
  | "Youth & Grassroots"
  | "Community Open"
  | (string & {});

export type EventTeamFormatFilter =
  "all" | "Singles" | "Doubles" | "Small Teams (5-7)" | "Full Squad (11v11)" | "Open Individual";

export type EventPriceRangeFilter = "all" | "free" | "under_500" | "500_1500" | "above_1500";

export type EventSortOption = "date_asc" | "prize_desc" | "fee_asc" | "fee_desc" | "spots_asc";

export type EventViewMode = "grid" | "list" | "calendar";

export interface EventFilterState {
  q: string;
  sport: string;
  city: string;
  category: EventCategoryFilter;
  teamFormat: EventTeamFormatFilter;
  priceRange: EventPriceRangeFilter;
  onlySpotsLeft: boolean;
  cashPrizeOnly: boolean;
  onlySaved?: boolean;
  sort: EventSortOption;
  view: EventViewMode;
}

export const DEFAULT_EVENT_FILTERS: EventFilterState = {
  q: "",
  sport: "All",
  city: "All",
  category: "all",
  teamFormat: "all",
  priceRange: "all",
  onlySpotsLeft: false,
  cashPrizeOnly: false,
  onlySaved: false,
  sort: "date_asc",
  view: "grid",
};

export const EVENT_CATEGORY_TABS = [
  { id: "all", label: "All Events", icon: "🏆", badgeText: "All" },
  { id: "upcoming", label: "Upcoming", icon: "📅", badgeText: "Next" },
  { id: "registration_open", label: "Registration Open", icon: "⚡", badgeText: "Open Slots" },
  { id: "local", label: "Local Tournaments", icon: "📍", badgeText: "City / Turf" },
  { id: "national", label: "National Championships", icon: "🇮🇳", badgeText: "Circuit" },
  { id: "Weekend Cup", label: "Weekend Cups", icon: "⚔️", badgeText: "Weekend" },
  { id: "Corporate League", label: "Corporate Leagues", icon: "💼", badgeText: "Corporate" },
  { id: "Championship", label: "Championships", icon: "🥇", badgeText: "Trophy" },
  { id: "Youth & Grassroots", label: "Youth & Grassroots", icon: "🌱", badgeText: "U-14/19" },
] as const;

export const EVENT_SPORT_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Badminton: "🏸",
  Tennis: "🎾",
  Pickleball: "🏓",
  "Table Tennis": "🏓",
  Basketball: "🏀",
  Swimming: "🏊",
  Athletics: "🏃",
  Kabaddi: "🤼",
  "Kho-Kho": "🏃‍♂️",
  Volleyball: "🏐",
  Boxing: "🥊",
};

export const EVENT_TEAM_FORMAT_OPTIONS = [
  { id: "all", label: "Any Team Size" },
  { id: "Singles", label: "Singles / 1v1" },
  { id: "Doubles", label: "Doubles / Pairs" },
  { id: "Small Teams (5-7)", label: "Small Squads (5-7)" },
  { id: "Full Squad (11v11)", label: "Full 11v11 Teams" },
  { id: "Open Individual", label: "Individual Participants" },
] as const;

export const EVENT_PRICE_OPTIONS = [
  { id: "all", label: "Any Entry Fee" },
  { id: "free", label: "Free Entry Only" },
  { id: "under_500", label: "Under ₹500" },
  { id: "500_1500", label: "₹500 – ₹1,500" },
  { id: "above_1500", label: "₹1,500+" },
] as const;

export const EVENT_SORT_OPTIONS = [
  { id: "date_asc", label: "Soonest Date First" },
  { id: "prize_desc", label: "Highest Prize Pool" },
  { id: "fee_asc", label: "Entry Fee (Low to High)" },
  { id: "fee_desc", label: "Entry Fee (High to Low)" },
  { id: "spots_asc", label: "Filling Fast (Fewest Spots)" },
] as const;

/**
 * Filter and sort tournaments based on active criteria
 */
export function filterSportEvents(
  events: SportEvent[],
  filters: EventFilterState,
  savedIds?: Set<string>,
): SportEvent[] {
  const query = filters.q.trim().toLowerCase();

  return events
    .filter((event) => {
      // 0. Saved for Later Filter
      if (filters.onlySaved && savedIds) {
        if (!savedIds.has(event.id)) {
          return false;
        }
      }
      if (query) {
        const text = [
          event.title,
          event.sport,
          event.city,
          event.venue,
          event.area || "",
          event.format,
          event.category || "",
          event.prizePool || "",
          event.organizer?.name || "",
          ...(event.perks || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!text.includes(query)) return false;
      }

      // 2. Sport Filter
      if (filters.sport !== "All" && event.sport !== filters.sport) {
        return false;
      }

      // 3. City Filter
      if (filters.city !== "All" && event.city !== filters.city) {
        return false;
      }

      // 4. Category Filter
      if (filters.category && filters.category !== "all") {
        const catKey = filters.category.toLowerCase().replace(/[\s_-]+/g, "");

        if (catKey === "upcoming") {
          // Upcoming: all events that are active / scheduled (not completed)
          if (event.status === "Completed") return false;
        } else if (catKey === "registrationopen" || catKey === "open") {
          // Registration Open: only events with slots currently available
          if (event.spotsLeft <= 0 || event.status === "Sold Out") {
            return false;
          }
        } else if (catKey === "local") {
          // Local: city-level, turf, neighborhood, club cups or scope === "Local"
          const isLocal =
            event.scope === "Local" ||
            (!event.scope &&
              (event.category === "Weekend Cup" ||
                event.category === "Community Open" ||
                event.category === "Corporate League"));
          if (!isLocal) return false;
        } else if (catKey === "national") {
          // National: pan-India, state/national championships, premier leagues
          const isNational =
            event.scope === "National" ||
            (!event.scope &&
              (event.category === "Championship" ||
                event.title.toLowerCase().includes("national") ||
                event.title.toLowerCase().includes("premier") ||
                event.title.toLowerCase().includes("all-india")));
          if (!isNational) return false;
        } else {
          // Direct match by category field (e.g. "Weekend Cup", "Corporate League", "Championship", "Youth & Grassroots", "Community Open")
          const eventCatNormalized = (event.category || "").toLowerCase().replace(/[\s_-]+/g, "");
          if (event.category !== filters.category && eventCatNormalized !== catKey) {
            return false;
          }
        }
      }

      // 5. Team Format Filter
      if (filters.teamFormat !== "all" && event.teamFormat !== filters.teamFormat) {
        return false;
      }

      // 6. Price Range Filter
      if (filters.priceRange === "free" && event.entryFee !== 0) {
        return false;
      }
      if (filters.priceRange === "under_500" && event.entryFee > 500) {
        return false;
      }
      if (filters.priceRange === "500_1500" && (event.entryFee < 500 || event.entryFee > 1500)) {
        return false;
      }
      if (filters.priceRange === "above_1500" && event.entryFee <= 1500) {
        return false;
      }

      // 7. Spots Left Filter
      if (filters.onlySpotsLeft && event.spotsLeft <= 0) {
        return false;
      }

      // 8. Cash Prize Filter
      if (filters.cashPrizeOnly) {
        if (!event.prizePool || !event.prizePool.includes("₹")) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "prize_desc": {
          const prizeA = extractNumber(a.prizePool);
          const prizeB = extractNumber(b.prizePool);
          return prizeB - prizeA;
        }
        case "fee_asc":
          return a.entryFee - b.entryFee;
        case "fee_desc":
          return b.entryFee - a.entryFee;
        case "spots_asc":
          return a.spotsLeft - b.spotsLeft;
        case "date_asc":
        default:
          return a.id.localeCompare(b.id);
      }
    });
}

function extractNumber(str?: string): number {
  if (!str) return 0;
  const match = str.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export interface EventFiltersProps {
  filters: EventFilterState;
  onChange: (filters: EventFilterState) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAvailable: number;
  sportCounts: Record<string, number>;
  categoryCounts?: Record<string, number>;
  savedCount?: number;
  onOpenHostModal?: () => void;
}

export function EventFilters({
  filters,
  onChange,
  onReset,
  totalFiltered,
  totalAvailable,
  sportCounts,
  categoryCounts,
  savedCount = 0,
  onOpenHostModal,
}: EventFiltersProps) {
  const update = (partial: Partial<EventFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.sport !== "All") count++;
    if (filters.city !== "All") count++;
    if (filters.category !== "all") count++;
    if (filters.teamFormat !== "all") count++;
    if (filters.priceRange !== "all") count++;
    if (filters.onlySpotsLeft) count++;
    if (filters.cashPrizeOnly) count++;
    if (filters.onlySaved) count++;
    if (filters.sort !== "date_asc") count++;
    return count;
  }, [filters]);

  const activeBadges = useMemo(() => {
    const list: Array<{ id: string; label: string; onRemove: () => void }> = [];

    if (filters.onlySaved) {
      list.push({
        id: "onlySaved",
        label: `Saved Tournaments (${savedCount})`,
        onRemove: () => update({ onlySaved: false }),
      });
    }
    if (filters.category !== "all") {
      const tab = EVENT_CATEGORY_TABS.find((t) => t.id === filters.category);
      list.push({
        id: "category",
        label: `Category: ${tab?.label || filters.category}`,
        onRemove: () => update({ category: "all" }),
      });
    }
    if (filters.q) {
      list.push({
        id: "q",
        label: `"${filters.q}"`,
        onRemove: () => update({ q: "" }),
      });
    }
    if (filters.sport !== "All") {
      list.push({
        id: "sport",
        label: `${filters.sport}`,
        onRemove: () => update({ sport: "All" }),
      });
    }
    if (filters.city !== "All") {
      list.push({
        id: "city",
        label: `City: ${filters.city}`,
        onRemove: () => update({ city: "All" }),
      });
    }
    if (filters.teamFormat !== "all") {
      const opt = EVENT_TEAM_FORMAT_OPTIONS.find((t) => t.id === filters.teamFormat);
      list.push({
        id: "teamFormat",
        label: `${opt?.label || filters.teamFormat}`,
        onRemove: () => update({ teamFormat: "all" }),
      });
    }
    if (filters.priceRange !== "all") {
      const opt = EVENT_PRICE_OPTIONS.find((p) => p.id === filters.priceRange);
      list.push({
        id: "priceRange",
        label: `${opt?.label || filters.priceRange}`,
        onRemove: () => update({ priceRange: "all" }),
      });
    }
    if (filters.cashPrizeOnly) {
      list.push({
        id: "cashPrizeOnly",
        label: "Cash Prize Pool",
        onRemove: () => update({ cashPrizeOnly: false }),
      });
    }
    if (filters.onlySpotsLeft) {
      list.push({
        id: "onlySpotsLeft",
        label: "Spots Available",
        onRemove: () => update({ onlySpotsLeft: false }),
      });
    }

    return list;
  }, [filters, savedCount]);

  return (
    <div className="space-y-3.5 w-full">
      {/* 1. TOP SEGMENTED CATEGORY TABS & HOST CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div
          role="tablist"
          aria-label="Tournament Categories"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto rounded-xl bg-secondary/40 p-1 border border-border/60"
        >
          {EVENT_CATEGORY_TABS.map((tab) => {
            const isSelected = filters.category === tab.id;
            const count = categoryCounts ? categoryCounts[tab.id] : undefined;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => update({ category: tab.id as EventCategoryFilter })}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-background text-foreground shadow-xs ring-1 ring-border/60 font-bold"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "font-mono text-[10px] px-1.5 py-0.2 rounded-full",
                      isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
          {/* Quick Saved for Later Filter Button */}
          <button
            type="button"
            onClick={() => update({ onlySaved: !filters.onlySaved })}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border",
              filters.onlySaved
                ? "bg-amber-500 text-white border-amber-400 font-bold shadow-xs ring-1 ring-amber-400"
                : "border-border/60 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
            )}
            title={
              filters.onlySaved
                ? "Showing saved tournaments only (click to clear)"
                : "Filter by saved tournaments"
            }
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5",
                filters.onlySaved ? "fill-white text-white" : "text-amber-500",
              )}
            />
            <span>Saved</span>
            {savedCount > 0 && (
              <span
                className={cn(
                  "font-mono text-[10px] px-1.5 py-0.2 rounded-full",
                  filters.onlySaved
                    ? "bg-black/20 text-white font-bold"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold",
                )}
              >
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {/* Top Action Controls: View Switcher & Host CTA */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-lg border border-border/70 bg-card p-0.5">
            <button
              type="button"
              onClick={() => update({ view: "grid" })}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors cursor-pointer",
                filters.view === "grid"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => update({ view: "list" })}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors cursor-pointer",
                filters.view === "list"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="List View"
              aria-label="List View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => update({ view: "calendar" })}
              className={cn(
                "p-1.5 rounded-md text-xs transition-colors cursor-pointer",
                filters.view === "calendar"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Weekend Calendar Schedule"
              aria-label="Calendar View"
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>

          {onOpenHostModal && (
            <Button
              type="button"
              size="sm"
              onClick={onOpenHostModal}
              className="h-8 gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>+ Host Tournament</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. SPORTS CHIPS CAROUSEL RAIL */}
      <div className="relative">
        <div
          role="region"
          aria-label="Sports filter options"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth"
        >
          <button
            type="button"
            onClick={() => update({ sport: "All" })}
            className={cn(
              "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border",
              filters.sport === "All"
                ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                : "border-border/70 bg-card hover:bg-secondary/70 text-foreground",
            )}
          >
            <span>🏆</span>
            <span>All Sports</span>
            <span className="font-mono text-[10px] opacity-80">({totalAvailable})</span>
          </button>

          {PLAYO_SPORTS.map((s) => {
            const count = sportCounts[s] || 0;
            const isSelected = filters.sport === s;
            const icon = EVENT_SPORT_ICONS[s] || "🏅";

            return (
              <button
                key={s}
                type="button"
                onClick={() => update({ sport: isSelected ? "All" : s })}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer border",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border-border/70 bg-card hover:bg-secondary/70 text-foreground",
                )}
              >
                <span>{icon}</span>
                <span>{s}</span>
                {count > 0 && <span className="font-mono text-[10px] opacity-80">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRIMARY CONTROLS BAR: SEARCH, CITY SELECTOR, SORT, AND MOBILE FILTER DRAWER */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-card/60 p-2.5 backdrop-blur-md shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Search tournaments, venues, formats, or organizers..."
            className="w-full h-9 rounded-xl border border-border/60 bg-background/80 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            aria-label="Search tournaments"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* City Filter dropdown */}
        <div className="w-[145px] shrink-0">
          <Select value={filters.city} onValueChange={(val) => update({ city: val })}>
            <SelectTrigger className="h-9 rounded-xl border-border/60 bg-background/80 text-xs text-foreground">
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">
                All Cities
              </SelectItem>
              {PLAYO_CITIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Format dropdown (Desktop only) */}
        <div className="hidden md:block w-[145px] shrink-0">
          <Select
            value={filters.teamFormat}
            onValueChange={(val) => update({ teamFormat: val as EventTeamFormatFilter })}
          >
            <SelectTrigger className="h-9 rounded-xl border-border/60 bg-background/80 text-xs text-foreground">
              <Users className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
              <SelectValue placeholder="Team Size" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TEAM_FORMAT_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort dropdown */}
        <div className="w-[155px] shrink-0 hidden sm:block">
          <Select
            value={filters.sort}
            onValueChange={(val) => update({ sort: val as EventSortOption })}
          >
            <SelectTrigger className="h-9 rounded-xl border-border/60 bg-background/80 text-xs text-foreground">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile / Full Filters Sheet Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-1.5 text-xs font-semibold rounded-xl border-border/70 cursor-pointer",
                activeFiltersCount > 0 && "border-primary text-primary bg-primary/5",
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-5 space-y-5">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span>Tournament Filter Facets</span>
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-xs font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </SheetTitle>
            </SheetHeader>

            {/* Facet 0: Category & Scope Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category &amp; Scope
                </label>
                {filters.category !== "all" && (
                  <button
                    type="button"
                    onClick={() => update({ category: "all" })}
                    className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                  >
                    Clear category
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {EVENT_CATEGORY_TABS.map((tab) => {
                  const isSelected = filters.category === tab.id;
                  const count = categoryCounts ? categoryCounts[tab.id] : undefined;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => update({ category: tab.id as EventCategoryFilter })}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between gap-1",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border/60 bg-secondary/30 hover:bg-secondary text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{tab.icon}</span>
                        <span className="truncate">{tab.label}</span>
                      </span>
                      {typeof count === "number" && (
                        <span className="text-[10px] opacity-75 font-mono shrink-0">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facet 1: Team Size / Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Squad &amp; Team Size
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {EVENT_TEAM_FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update({ teamFormat: opt.id as EventTeamFormatFilter })}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-xs font-medium text-left border transition-all cursor-pointer",
                      filters.teamFormat === opt.id
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border/60 bg-secondary/30 hover:bg-secondary text-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Facet 2: Entry Fee & Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Entry Fee Range
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {EVENT_PRICE_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => update({ priceRange: p.id as EventPriceRangeFilter })}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-xs font-medium text-left border transition-all cursor-pointer",
                      filters.priceRange === p.id
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border/60 bg-secondary/30 hover:bg-secondary text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Facet 3: Quick Toggles (Cash Prize & Spots Left) */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tournament Perks &amp; Availability
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={filters.cashPrizeOnly}
                    onChange={(e) => update({ cashPrizeOnly: e.target.checked })}
                    className="rounded border-border accent-primary h-4 w-4"
                  />
                  <span className="flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span>Cash Prize Tournaments Only</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={filters.onlySpotsLeft}
                    onChange={(e) => update({ onlySpotsLeft: e.target.checked })}
                    className="rounded border-border accent-primary h-4 w-4"
                  />
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Open Registration Slots Only</span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={!!filters.onlySaved}
                    onChange={(e) => update({ onlySaved: e.target.checked })}
                    className="rounded border-border accent-amber-500 h-4 w-4"
                  />
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500/40" />
                    <span>Saved for Later Only ({savedCount})</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Facet 4: Sort */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sort Order
              </label>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as EventSortOption })}
                className="w-full h-9 rounded-xl border border-border/70 bg-background px-3 text-xs text-foreground"
              >
                {EVENT_SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <SheetFooter className="pt-4 border-t border-border/60">
              <div className="w-full flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {totalFiltered} tournaments found
                </span>
                <Button
                  size="sm"
                  onClick={() => {}}
                  className="bg-primary text-primary-foreground font-bold text-xs"
                >
                  View {totalFiltered} Events
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* 4. ACTIVE FILTER BADGES STRIP */}
      {activeBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground">Active:</span>
          {activeBadges.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1 rounded-md bg-secondary/80 border border-border/60 px-2 py-0.5 text-[11px] text-foreground font-medium"
            >
              <span>{b.label}</span>
              <button
                type="button"
                onClick={b.onRemove}
                className="hover:text-destructive cursor-pointer"
                aria-label={`Remove filter ${b.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-semibold text-primary hover:underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
