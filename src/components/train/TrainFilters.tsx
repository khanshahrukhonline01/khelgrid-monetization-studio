import React from "react";
import {
  Search,
  MapPin,
  Trophy,
  GraduationCap,
  Star,
  RotateCcw,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Sparkles,
  Users,
  IndianRupee,
  Check,
  Calendar,
  LayoutGrid,
  List,
} from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { KHELGRID_SPORTS, KHELGRID_CITIES, type CoachingProgram } from "@/data/khelgrid";

export type TrainEntityType = "all" | "coaches" | "academies";

export interface TrainFilterState {
  entityType: TrainEntityType;
  q: string;
  sport: string;
  city: string;
  level: string;
  format: string;
  ageGroup: string;
  priceRange: string;
  certifiedOnly: boolean;
  freeTrialOnly: boolean;
  minRating: number;
  facility: string;
  sort: "recommended" | "rating_desc" | "price_asc" | "price_desc" | "reviews_desc";
  view: "grid" | "list";
}

export const DEFAULT_TRAIN_FILTERS: TrainFilterState = {
  entityType: "all",
  q: "",
  sport: "All",
  city: "All",
  level: "All",
  format: "All",
  ageGroup: "All",
  priceRange: "all",
  certifiedOnly: false,
  freeTrialOnly: false,
  minRating: 0,
  facility: "All",
  sort: "recommended",
  view: "grid",
};

export const LEVEL_OPTIONS = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"] as const;

export const FORMAT_OPTIONS = [
  { id: "All", label: "All Formats" },
  { id: "Academy Batch", label: "Academy Batch" },
  { id: "1-on-1 Private", label: "1-on-1 Private Coach" },
  { id: "Weekend Camp", label: "Weekend Camp" },
  { id: "High-Performance Combine", label: "High-Performance" },
] as const;

export const FACILITY_OPTIONS = [
  "All",
  "Hostel / Boarding",
  "Gym",
  "Floodlights",
  "Video Analysis",
  "Turf Wickets",
  "Physiotherapist",
] as const;

export const AGE_GROUP_OPTIONS = [
  { id: "All", label: "All Ages" },
  { id: "U-12 Grassroots", label: "U-12 Grassroots" },
  { id: "U-16 Youth", label: "U-16 Youth" },
  { id: "U-19 Junior", label: "U-19 Junior" },
  { id: "Senior / Open", label: "Senior / Open (18+)" },
] as const;

export const PRICE_RANGE_OPTIONS = [
  { id: "all", label: "Any Budget", min: 0, max: Infinity },
  { id: "under_3000", label: "Under ₹3,000 / mo", min: 0, max: 3000 },
  { id: "3000_5000", label: "₹3,000 – ₹5,000 / mo", min: 3000, max: 5000 },
  { id: "5000_8000", label: "₹5,000 – ₹8,000 / mo", min: 5000, max: 8000 },
  { id: "above_8000", label: "₹8,000+ / mo", min: 8000, max: Infinity },
] as const;

export const SPORT_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Badminton: "🏸",
  Tennis: "🎾",
  Swimming: "🏊",
  Basketball: "🏀",
  Pickleball: "🏓",
  "Table Tennis": "🏓",
  Athletics: "🏃",
  Boxing: "🥊",
  Volleyball: "🏐",
  "Kho-Kho": "🏃",
};

export interface TrainFiltersProps {
  filters: TrainFilterState;
  onChange: (filters: TrainFilterState) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAvailable: number;
  sportCounts: Record<string, number>;
  coachCount?: number;
  academyCount?: number;
  onOpenCoachRegister?: () => void;
  onOpenAcademyRegister?: () => void;
}

export function filterCoachingPrograms(
  programs: CoachingProgram[],
  filters: TrainFilterState,
): CoachingProgram[] {
  const query = filters.q.trim().toLowerCase();

  return programs
    .filter((program) => {
      // 0. Entity Type Filter (Coaches vs Academies)
      if (filters.entityType === "coaches") {
        const isCoach = program.entityType === "coach" || program.format === "1-on-1 Private";
        if (!isCoach) return false;
      } else if (filters.entityType === "academies") {
        const isAcademy =
          program.entityType === "academy" ||
          program.format === "Academy Batch" ||
          program.format === "High-Performance Combine";
        if (!isAcademy) return false;
      }

      // 1. Text Search
      if (query) {
        const text = [
          program.title,
          program.coach,
          program.academyName || "",
          program.accreditation || "",
          program.sport,
          program.city,
          program.area,
          program.level,
          program.format || "",
          program.ageGroup || "",
          ...(program.facilities || []),
          ...(program.highlights || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!text.includes(query)) return false;
      }

      // 2. Sport Filter
      if (filters.sport !== "All" && program.sport !== filters.sport) {
        return false;
      }

      // 3. City Filter
      if (filters.city !== "All" && program.city !== filters.city) {
        return false;
      }

      // 4. Level Filter
      if (filters.level !== "All") {
        if (filters.level === "All Levels") {
          // matches all
        } else if (program.level !== filters.level && program.level !== "All Levels") {
          return false;
        }
      }

      // 5. Format Filter
      if (filters.format !== "All") {
        if (program.format && program.format !== filters.format) {
          return false;
        }
      }

      // 6. Age Group Filter
      if (filters.ageGroup !== "All") {
        if (
          program.ageGroup &&
          program.ageGroup !== filters.ageGroup &&
          program.ageGroup !== "All Ages"
        ) {
          return false;
        }
      }

      // 7. Facility Filter (e.g. for academies)
      if (filters.facility && filters.facility !== "All") {
        const hasFac = program.facilities?.some((f) =>
          f.toLowerCase().includes(filters.facility.toLowerCase()),
        );
        if (!hasFac) return false;
      }

      // 8. Price Range Filter
      if (filters.priceRange !== "all") {
        const range = PRICE_RANGE_OPTIONS.find((r) => r.id === filters.priceRange);
        if (range) {
          if (program.pricePerMonth < range.min || program.pricePerMonth > range.max) {
            return false;
          }
        }
      }

      // 9. Certified Only Toggle
      if (filters.certifiedOnly && !program.certified) {
        return false;
      }

      // 10. Free Trial Toggle
      if (filters.freeTrialOnly && !program.freeTrial) {
        return false;
      }

      // 11. Minimum Rating
      if (filters.minRating > 0 && program.rating < filters.minRating) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "rating_desc":
          return b.rating - a.rating;
        case "price_asc":
          return a.pricePerMonth - b.pricePerMonth;
        case "price_desc":
          return b.pricePerMonth - a.pricePerMonth;
        case "reviews_desc":
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        case "recommended":
        default: {
          // Recommended balances rating and certification
          const scoreA = a.rating * 10 + (a.certified ? 5 : 0) + (a.freeTrial ? 3 : 0);
          const scoreB = b.rating * 10 + (b.certified ? 5 : 0) + (b.freeTrial ? 3 : 0);
          return scoreB - scoreA;
        }
      }
    });
}

export function TrainFilters({
  filters,
  onChange,
  onReset,
  totalFiltered,
  totalAvailable,
  sportCounts,
  coachCount,
  academyCount,
  onOpenCoachRegister,
  onOpenAcademyRegister,
}: TrainFiltersProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false);

  // Helper to update partial filter state
  const update = React.useCallback(
    (patch: Partial<TrainFilterState>) => {
      onChange({ ...filters, ...patch });
    },
    [filters, onChange],
  );

  // Compute active non-default filter badges
  const activeBadges = React.useMemo(() => {
    const list: { id: string; label: string; onRemove: () => void }[] = [];

    if (filters.entityType !== "all") {
      list.push({
        id: "entityType",
        label: filters.entityType === "coaches" ? "Coaches Only" : "Academies Only",
        onRemove: () => update({ entityType: "all" }),
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
        label: `Sport: ${filters.sport}`,
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
    if (filters.level !== "All") {
      list.push({
        id: "level",
        label: `Level: ${filters.level}`,
        onRemove: () => update({ level: "All" }),
      });
    }
    if (filters.format !== "All") {
      list.push({
        id: "format",
        label: `Format: ${filters.format}`,
        onRemove: () => update({ format: "All" }),
      });
    }
    if (filters.facility !== "All") {
      list.push({
        id: "facility",
        label: `Facility: ${filters.facility}`,
        onRemove: () => update({ facility: "All" }),
      });
    }
    if (filters.ageGroup !== "All") {
      list.push({
        id: "ageGroup",
        label: `Age: ${filters.ageGroup}`,
        onRemove: () => update({ ageGroup: "All" }),
      });
    }
    if (filters.priceRange !== "all") {
      const p = PRICE_RANGE_OPTIONS.find((r) => r.id === filters.priceRange);
      list.push({
        id: "priceRange",
        label: p ? p.label : "Price Filter",
        onRemove: () => update({ priceRange: "all" }),
      });
    }
    if (filters.certifiedOnly) {
      list.push({
        id: "certified",
        label: "NIS Certified Only",
        onRemove: () => update({ certifiedOnly: false }),
      });
    }
    if (filters.freeTrialOnly) {
      list.push({
        id: "freeTrial",
        label: "Free Trial Available",
        onRemove: () => update({ freeTrialOnly: false }),
      });
    }
    if (filters.minRating > 0) {
      list.push({
        id: "minRating",
        label: `Rating ≥ ${filters.minRating}★`,
        onRemove: () => update({ minRating: 0 }),
      });
    }

    return list;
  }, [filters, update]);

  const hasActiveFilters = activeBadges.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* 1. ENTITY TYPE SELECTOR & REGISTRATION CTAS (All vs Coaches vs Academies) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 w-full min-w-0 max-w-full">
        {/* Segmented control */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => update({ entityType: "all" })}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filters.entityType === "all"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <span>All Training</span>
            <span className="font-mono text-[10px] opacity-80">({totalAvailable})</span>
          </button>
          <button
            type="button"
            onClick={() => update({ entityType: "coaches" })}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filters.entityType === "coaches"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Coaches</span>
          </button>
          <button
            type="button"
            onClick={() => update({ entityType: "academies" })}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filters.entityType === "academies"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>Academies</span>
          </button>
        </div>

        {/* Quick Platform Registration Links */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenCoachRegister && (
            <button
              type="button"
              onClick={onOpenCoachRegister}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>+ Register Coach</span>
            </button>
          )}
          {onOpenAcademyRegister && (
            <button
              type="button"
              onClick={onOpenAcademyRegister}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>+ Register Academy</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. HORIZONTAL SWIPEABLE SPORTS RAIL (Top quick switch for all devices) */}
      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <div
          role="tablist"
          aria-label="Filter coaching by sport"
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar touch-scroll-rail select-none w-full scroll-smooth"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filters.sport === "All"}
            onClick={() => update({ sport: "All" })}
            className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              filters.sport === "All"
                ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold"
                : "border-border/80 bg-card hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🏆</span>
            <span>All Sports</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                filters.sport === "All"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {totalAvailable}
            </span>
          </button>

          {KHELGRID_SPORTS.map((s) => {
            const isSelected = filters.sport === s;
            const count = sportCounts[s] ?? 0;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => update({ sport: isSelected ? "All" : s })}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-xs font-bold"
                    : "border-border/80 bg-card hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                <span>{s}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRIMARY SEARCH & QUICK CONTROLS BAR */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center w-full min-w-0 max-w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="train-search-input"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={
              filters.entityType === "coaches"
                ? "Search coach by name, sport, NIS certification, locality..."
                : filters.entityType === "academies"
                  ? "Search sports academy, facilities (hostel/turf), city..."
                  : "Search coach, academy, program, area, or curriculum…"
            }
            className="h-10 sm:h-11 pl-10 pr-9 text-xs sm:text-sm rounded-xl border-border bg-card/80 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => update({ q: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
              aria-label="Clear coach search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick City Dropdown */}
        <div className="w-full sm:w-44 shrink-0">
          <Select value={filters.city} onValueChange={(val) => update({ city: val })}>
            <SelectTrigger
              id="train-city-select"
              className="h-10 sm:h-11 rounded-xl border-border bg-card/80 text-xs text-foreground"
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary shrink-0" />
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs">
                All Cities
              </SelectItem>
              {KHELGRID_CITIES.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-44 shrink-0">
          <Select
            value={filters.sort}
            onValueChange={(val) => update({ sort: val as TrainFilterState["sort"] })}
          >
            <SelectTrigger
              id="train-sort-select"
              className="h-10 sm:h-11 rounded-xl border-border bg-card/80 text-xs text-foreground"
            >
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended" className="text-xs">
                Recommended
              </SelectItem>
              <SelectItem value="rating_desc" className="text-xs">
                Highest Rated (★)
              </SelectItem>
              <SelectItem value="price_asc" className="text-xs">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_desc" className="text-xs">
                Price: High to Low
              </SelectItem>
              <SelectItem value="reviews_desc" className="text-xs">
                Most Reviewed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons: View Toggle & Mobile Filters Sheet Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Desktop View Mode Toggle */}
          <div className="hidden sm:flex items-center rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => update({ view: "grid" })}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                filters.view === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => update({ view: "list" })}
              title="List View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                filters.view === "list"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Filter Button (Opens Bottom Drawer Sheet) */}
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="h-10 sm:h-11 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold lg:hidden cursor-pointer"
                aria-label="Open coaching filter sheet"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <span>Filters</span>
                {activeBadges.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeBadges.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 z-[80]"
            >
              <SheetHeader className="text-left border-b border-border/60 pb-3">
                <SheetTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span>Filter Training &amp; Academies</span>
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Reset All
                    </button>
                  )}
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-5">
                {/* 0. Entity Type (Mobile) */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    Directory Type
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-secondary/50 rounded-xl border border-border/60">
                    <button
                      type="button"
                      onClick={() => update({ entityType: "all" })}
                      className={`rounded-lg py-1.5 text-xs font-semibold text-center transition-all cursor-pointer ${
                        filters.entityType === "all"
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => update({ entityType: "coaches" })}
                      className={`rounded-lg py-1.5 text-xs font-semibold text-center transition-all cursor-pointer ${
                        filters.entityType === "coaches"
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Coaches
                    </button>
                    <button
                      type="button"
                      onClick={() => update({ entityType: "academies" })}
                      className={`rounded-lg py-1.5 text-xs font-semibold text-center transition-all cursor-pointer ${
                        filters.entityType === "academies"
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Academies
                    </button>
                  </div>
                </div>

                {/* 1. Skill Level */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" /> Skill Level
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVEL_OPTIONS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => update({ level: lvl })}
                        className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                          filters.level === lvl
                            ? "bg-primary text-primary-foreground font-bold shadow-xs"
                            : "border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Program Format */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Training Format
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FORMAT_OPTIONS.map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => update({ format: fmt.id })}
                        className={`rounded-xl px-2.5 py-1.5 text-xs text-left truncate transition-all cursor-pointer ${
                          filters.format === fmt.id
                            ? "bg-primary text-primary-foreground font-bold shadow-xs"
                            : "border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Facility Filter (for academies) */}
                {(filters.entityType === "all" || filters.entityType === "academies") && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-primary" /> Academy Facilities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {FACILITY_OPTIONS.map((fac) => (
                        <button
                          key={fac}
                          type="button"
                          onClick={() => update({ facility: fac })}
                          className={`rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                            filters.facility === fac
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {fac === "All" ? "Any Facilities" : fac}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Age Group */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> Age Group
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {AGE_GROUP_OPTIONS.map((ag) => (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => update({ ageGroup: ag.id })}
                        className={`rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer ${
                          filters.ageGroup === ag.id
                            ? "bg-primary text-primary-foreground font-bold shadow-xs"
                            : "border border-border bg-secondary/40 text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {ag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Budget Range */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-primary" /> Monthly Budget
                  </span>
                  <select
                    aria-label="Filter by monthly fee (Mobile)"
                    value={filters.priceRange}
                    onChange={(e) => update({ priceRange: e.target.value })}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground outline-none"
                  >
                    {PRICE_RANGE_OPTIONS.map((pr) => (
                      <option key={pr.id} value={pr.id}>
                        {pr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Verification & Perks Toggles */}
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-foreground py-1">
                    <input
                      type="checkbox"
                      checked={filters.certifiedOnly}
                      onChange={(e) => update({ certifiedOnly: e.target.checked })}
                      className="rounded border-border accent-primary h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>NIS / Federation Certified Only</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-foreground py-1">
                    <input
                      type="checkbox"
                      checked={filters.freeTrialOnly}
                      onChange={(e) => update({ freeTrialOnly: e.target.checked })}
                      className="rounded border-border accent-primary h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Free Demo / Trial Session Available</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-foreground py-1">
                    <input
                      type="checkbox"
                      checked={filters.minRating >= 4.5}
                      onChange={(e) => update({ minRating: e.target.checked ? 4.5 : 0 })}
                      className="rounded border-border accent-primary h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>Top Rated (4.5★ and above)</span>
                    </div>
                  </label>
                </div>
              </div>

              <SheetFooter className="mt-6 flex-row gap-2">
                <Button type="button" variant="ghost" onClick={onReset} className="flex-1 text-xs">
                  Reset All
                </Button>
                <Button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  className="flex-1 text-xs font-bold bg-primary text-primary-foreground"
                >
                  Show {totalFiltered} Programs
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 4. ACTIVE FILTER PILLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs w-full min-w-0 max-w-full">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="font-semibold text-foreground">
            {totalFiltered} {totalFiltered === 1 ? "Program" : "Programs"} Found
          </span>

          {hasActiveFilters && (
            <>
              <span className="text-muted-foreground">·</span>
              {activeBadges.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={badge.onRemove}
                  className="group inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <span>{badge.label}</span>
                  <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                </button>
              ))}
              <button
                type="button"
                onClick={onReset}
                className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </>
          )}
        </div>

        <div className="text-[11px] text-muted-foreground hidden sm:block">
          {filters.entityType === "coaches"
            ? "Certified Coaches"
            : filters.entityType === "academies"
              ? "Sports Academies"
              : "Coaches & Academies"}{" "}
          · {filters.sport !== "All" ? filters.sport : "All Sports"} in{" "}
          {filters.city !== "All" ? filters.city : "India"}
        </div>
      </div>
    </div>
  );
}

export function TrainDesktopSidebar({
  filters,
  onChange,
  onReset,
  totalFiltered,
  sportCounts,
  onOpenCoachRegister,
  onOpenAcademyRegister,
}: TrainFiltersProps) {
  const update = (patch: Partial<TrainFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const hasActiveFilters =
    filters.entityType !== "all" ||
    filters.q !== "" ||
    filters.sport !== "All" ||
    filters.city !== "All" ||
    filters.level !== "All" ||
    filters.format !== "All" ||
    filters.facility !== "All" ||
    filters.ageGroup !== "All" ||
    filters.priceRange !== "all" ||
    filters.certifiedOnly ||
    filters.freeTrialOnly ||
    filters.minRating > 0;

  return (
    <aside
      id="train-desktop-filter-sidebar"
      className="hidden lg:block lg:col-span-3 rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-6 sticky top-20"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Refine Coaching</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Filter 0: Directory Entity Type (All vs Coaches vs Academies) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Directory Type
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-secondary/50 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => update({ entityType: "all" })}
            className={`rounded-lg py-1.5 text-[11px] font-semibold text-center transition-all cursor-pointer ${
              filters.entityType === "all"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => update({ entityType: "coaches" })}
            className={`rounded-lg py-1.5 text-[11px] font-semibold text-center transition-all cursor-pointer ${
              filters.entityType === "coaches"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Coaches
          </button>
          <button
            type="button"
            onClick={() => update({ entityType: "academies" })}
            className={`rounded-lg py-1.5 text-[11px] font-semibold text-center transition-all cursor-pointer ${
              filters.entityType === "academies"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Academies
          </button>
        </div>
      </div>

      {/* Filter 1: Sport Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span>Sport</span>
          </span>
          <span className="font-mono text-[11px]">{totalFiltered} Open</span>
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => update({ sport: "All" })}
            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
              filters.sport === "All"
                ? "bg-primary/15 text-primary font-bold"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <span>🏆</span>
              <span>All Sports</span>
            </span>
            <span className="font-mono text-[11px] opacity-75">{totalFiltered}</span>
          </button>
          {KHELGRID_SPORTS.map((s) => {
            const count = sportCounts[s] ?? 0;
            const isSelected = filters.sport === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => update({ sport: isSelected ? "All" : s })}
                className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                  <span>{s}</span>
                </span>
                <span className="font-mono text-[11px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 2: Location & City */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>City & Locality</span>
        </label>
        <Select value={filters.city} onValueChange={(val) => update({ city: val })}>
          <SelectTrigger className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-xs">
              All Cities
            </SelectItem>
            {KHELGRID_CITIES.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter 3: Skill Level */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <GraduationCap className="h-3.5 w-3.5 text-primary" />
          <span>Skill Level</span>
        </label>
        <div className="space-y-1">
          {LEVEL_OPTIONS.map((lvl) => {
            const isSelected = filters.level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => update({ level: lvl })}
                className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 4: Program Format */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>Training Format</span>
        </label>
        <Select value={filters.format} onValueChange={(val) => update({ format: val })}>
          <SelectTrigger className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none">
            <SelectValue placeholder="All Formats" />
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((fmt) => (
              <SelectItem key={fmt.id} value={fmt.id} className="text-xs">
                {fmt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter 4B: Academy Facilities (for Academies & All) */}
      {(filters.entityType === "all" || filters.entityType === "academies") && (
        <div className="space-y-2 border-t border-border/60 pt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span>Academy Facilities</span>
          </label>
          <Select value={filters.facility} onValueChange={(val) => update({ facility: val })}>
            <SelectTrigger className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none">
              <SelectValue placeholder="All Facilities" />
            </SelectTrigger>
            <SelectContent>
              {FACILITY_OPTIONS.map((fac) => (
                <SelectItem key={fac} value={fac} className="text-xs">
                  {fac === "All" ? "Any Facilities" : fac}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filter 5: Age Group */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>Age Group</span>
        </label>
        <Select value={filters.ageGroup} onValueChange={(val) => update({ ageGroup: val })}>
          <SelectTrigger className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none">
            <SelectValue placeholder="All Ages" />
          </SelectTrigger>
          <SelectContent>
            {AGE_GROUP_OPTIONS.map((ag) => (
              <SelectItem key={ag.id} value={ag.id} className="text-xs">
                {ag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter 6: Monthly Budget */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-primary" />
          <span>Monthly Budget</span>
        </label>
        <Select value={filters.priceRange} onValueChange={(val) => update({ priceRange: val })}>
          <SelectTrigger className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none">
            <SelectValue placeholder="Any Budget" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGE_OPTIONS.map((pr) => (
              <SelectItem key={pr.id} value={pr.id} className="text-xs">
                {pr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter 7: Coach Accreditations & Perks */}
      <div className="space-y-2 border-t border-border/60 pt-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Accreditation & Quality
        </label>
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
            <input
              type="checkbox"
              checked={filters.certifiedOnly}
              onChange={(e) => update({ certifiedOnly: e.target.checked })}
              className="rounded border-border accent-primary h-4 w-4"
            />
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>NIS / Federation Certified</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
            <input
              type="checkbox"
              checked={filters.freeTrialOnly}
              onChange={(e) => update({ freeTrialOnly: e.target.checked })}
              className="rounded border-border accent-primary h-4 w-4"
            />
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Free Demo Session</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
            <input
              type="checkbox"
              checked={filters.minRating >= 4.5}
              onChange={(e) => update({ minRating: e.target.checked ? 4.5 : 0 })}
              className="rounded border-border accent-primary h-4 w-4"
            />
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span>Top Rated (4.5★+)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Sidebar Registration CTAs */}
      <div className="space-y-2.5 border-t border-border/60 pt-4">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Are You a Coach?</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Register to offer 1-on-1 coaching &amp; NIS training programs.
          </p>
          {onOpenCoachRegister && (
            <button
              type="button"
              onClick={onOpenCoachRegister}
              className="w-full mt-1 rounded-lg bg-primary py-1.5 text-center text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              + Register as Coach
            </button>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
            <Trophy className="h-4 w-4 text-emerald-500" />
            <span>Own a Sports Academy?</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Onboard your campus, showcase hostels, turf pitches &amp; batches.
          </p>
          {onOpenAcademyRegister && (
            <button
              type="button"
              onClick={onOpenAcademyRegister}
              className="w-full mt-1 rounded-lg bg-emerald-600 py-1.5 text-center text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              + Register Academy
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
