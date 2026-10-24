import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Trophy,
  Calendar,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, CITIES, type Trial } from "@/data/trials";
import { getTrialEndDate } from "@/lib/opportunity-badge";

export type DateRangeOption =
  | "all"
  | "closing_soon"
  | "this_week"
  | "this_month"
  | "next_quarter"
  | "sep_2026"
  | "oct_2026"
  | "nov_2026"
  | "dec_2026";

export interface RegionDefinition {
  id: string;
  name: string;
  cities: string[];
}

export const REGIONS: RegionDefinition[] = [
  { id: "all", name: "All Regions / Pan-India", cities: [] },
  {
    id: "north",
    name: "North Zone",
    cities: [
      "Delhi",
      "Chandigarh",
      "Jaipur",
      "Lucknow",
      "Kanpur",
      "Dehradun",
      "Gurugram",
      "Noida",
      "Punjab",
      "Jammu",
    ],
  },
  {
    id: "south",
    name: "South Zone",
    cities: [
      "Bengaluru",
      "Hyderabad",
      "Chennai",
      "Kochi",
      "Mysuru",
      "Coimbatore",
      "Thiruvananthapuram",
    ],
  },
  {
    id: "west",
    name: "West Zone",
    cities: [
      "Mumbai",
      "Pune",
      "Ahmedabad",
      "Goa",
      "Nagpur",
      "Surat",
      "Vadodara",
      "Gandhinagar",
      "Chhatrapati Sambhajinagar",
      "Aurangabad",
    ],
  },
  {
    id: "east_ne",
    name: "East & North-East Zone",
    cities: [
      "Kolkata",
      "Namchi",
      "Gangtok",
      "Guwahati",
      "Itanagar",
      "Bhubaneswar",
      "Patna",
      "Ranchi",
      "Shillong",
    ],
  },
  {
    id: "central",
    name: "Central Zone",
    cities: ["Bhopal", "Indore", "Raipur", "Gwalior", "Jabalpur"],
  },
];

export interface SportTypeDefinition {
  id: string;
  name: string;
  sports: string[];
  icon: string;
}

export const SPORT_TYPES: SportTypeDefinition[] = [
  { id: "all", name: "All Sport Types", sports: [], icon: "🏆" },
  {
    id: "team_ball",
    name: "Team & Ball Sports",
    sports: [
      "Cricket",
      "Football",
      "Hockey",
      "Basketball",
      "Volleyball",
      "Handball",
      "Kho-Kho",
      "Rugby",
      "Softball",
      "Netball",
      "Sepak Takraw",
    ],
    icon: "⚽",
  },
  {
    id: "racquet",
    name: "Racquet & Net Sports",
    sports: ["Badminton", "Tennis", "Table Tennis", "Soft Tennis", "Squash", "Pickleball"],
    icon: "🏸",
  },
  {
    id: "track_field",
    name: "Track, Field & Athletics",
    sports: ["Athletics", "Running", "Swimming", "Triathlon", "Track Cycling"],
    icon: "🏃",
  },
  {
    id: "combat",
    name: "Combat & Martial Arts",
    sports: [
      "Wrestling",
      "Wrestling Freestyle",
      "Boxing",
      "Kabaddi",
      "Judo",
      "Taekwondo",
      "Karate",
      "Wushu",
      "Thang-Ta",
    ],
    icon: "🤼",
  },
  {
    id: "target_precision",
    name: "Precision & Target Sports",
    sports: ["Shooting", "Archery", "Chess"],
    icon: "🎯",
  },
  {
    id: "mind_body",
    name: "Mind & Body Sports",
    sports: ["Yoga", "Yogasana"],
    icon: "🧘",
  },
  {
    id: "strength",
    name: "Strength Sports",
    sports: ["Weightlifting"],
    icon: "🏋️",
  },
];

export const DATE_RANGE_OPTIONS: { id: DateRangeOption; label: string; description: string }[] = [
  { id: "all", label: "All Upcoming Dates", description: "All scheduled trial fixtures" },
  {
    id: "closing_soon",
    label: "Closing Soon (< 48 Hours)",
    description: "Registration cutoff approaching",
  },
  {
    id: "this_week",
    label: "This Week (Next 7 Days)",
    description: "Immediate upcoming screenings",
  },
  {
    id: "this_month",
    label: "This Month (Next 30 Days)",
    description: "Screenings within 30 days",
  },
  { id: "next_quarter", label: "Next 90 Days", description: "Next 3 months calendar" },
  { id: "sep_2026", label: "September 2026", description: "Trials in September 2026" },
  { id: "oct_2026", label: "October 2026", description: "Trials in October 2026" },
  { id: "nov_2026", label: "November 2026", description: "Trials in November 2026" },
  { id: "dec_2026", label: "December 2026", description: "Trials in December 2026" },
];

export interface TrialsFilterCriteria {
  query: string;
  region: string; // Region ID or "all"
  city: string; // Specific city or "all"
  sportType: string; // Sport Type ID or "all"
  sport: string; // Specific sport or "all"
  dateRange: DateRangeOption;
  freeOnly?: boolean;
}

export const DEFAULT_FILTER_CRITERIA: TrialsFilterCriteria = {
  query: "",
  region: "all",
  city: "all",
  sportType: "all",
  sport: "all",
  dateRange: "all",
  freeOnly: false,
};

/**
 * Robust date parser for trial date strings such as "Sep 23 - Sep 28, 2026", "Sep 30, 2026", "Dec 20, 2026"
 */
export function parseTrialDate(dateStr: string): Date | null {
  return getTrialEndDate(dateStr);
}

/**
 * Filter function applying region, sport type, and date range criteria to an array of trials
 */
export function filterTrials(trials: Trial[], criteria: TrialsFilterCriteria): Trial[] {
  const q = criteria.query.trim().toLowerCase();
  const now = new Date();

  return trials.filter((t) => {
    // 1. Text Query Filter
    if (q) {
      const matchText =
        `${t.title} ${t.academy} ${t.sport} ${t.city} ${t.tag || ""} ${t.venue || ""} ${t.eligibility || ""}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // 2. Specific Region Filter
    if (criteria.region !== "all") {
      const regionDef = REGIONS.find((r) => r.id === criteria.region);
      if (regionDef && regionDef.cities.length > 0) {
        const matchesCityInRegion = regionDef.cities.some((c) =>
          t.city.toLowerCase().includes(c.toLowerCase()),
        );
        if (!matchesCityInRegion) return false;
      }
    }

    // Direct City Filter
    if (criteria.city !== "all" && t.city.toLowerCase() !== criteria.city.toLowerCase()) {
      return false;
    }

    // 3. Sport Type Filter
    if (criteria.sportType !== "all") {
      const typeDef = SPORT_TYPES.find((st) => st.id === criteria.sportType);
      if (typeDef && typeDef.sports.length > 0) {
        const matchesSportInType = typeDef.sports.some(
          (s) => s.toLowerCase() === t.sport.toLowerCase(),
        );
        if (!matchesSportInType) return false;
      }
    }

    // Direct Sport Filter
    if (criteria.sport !== "all" && t.sport.toLowerCase() !== criteria.sport.toLowerCase()) {
      return false;
    }

    // 4. Upcoming Dates Filter
    if (criteria.dateRange !== "all") {
      const trialDate = parseTrialDate(t.date);
      const regDeadline = t.registrationDeadline
        ? parseTrialDate(t.registrationDeadline)
        : trialDate;
      const targetDate = trialDate || regDeadline;

      if (!targetDate) return false; // Keep undated records out until their dates are verified

      const diffMs = targetDate.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = diffHours / 24;

      if (criteria.dateRange === "closing_soon") {
        // Closing soon if badge says Closing Soon or deadline within 48h
        const hasClosingBadge =
          t.badge === "Closing Soon" ||
          (t.urgencyText && t.urgencyText.toLowerCase().includes("closing"));
        if (!hasClosingBadge && (diffHours < 0 || diffHours > 48)) return false;
      } else if (criteria.dateRange === "this_week") {
        if (diffDays < 0 || diffDays > 7) return false;
      } else if (criteria.dateRange === "this_month") {
        if (diffDays < 0 || diffDays > 30) return false;
      } else if (criteria.dateRange === "next_quarter") {
        if (diffDays < 0 || diffDays > 90) return false;
      } else if (criteria.dateRange === "sep_2026") {
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        if (month !== 8 || year !== 2026) return false; // Sep is index 8
      } else if (criteria.dateRange === "oct_2026") {
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        if (month !== 9 || year !== 2026) return false; // Oct is index 9
      } else if (criteria.dateRange === "nov_2026") {
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        if (month !== 10 || year !== 2026) return false; // Nov is index 10
      } else if (criteria.dateRange === "dec_2026") {
        const month = targetDate.getMonth();
        const year = targetDate.getFullYear();
        if (month !== 11 || year !== 2026) return false; // Dec is index 11
      }
    }

    // 5. Free Entry Filter
    if (criteria.freeOnly && t.fee > 0) {
      return false;
    }

    return true;
  });
}

export interface TrialsSearchFilterProps {
  initialCriteria?: Partial<TrialsFilterCriteria>;
  onFilterChange?: (criteria: TrialsFilterCriteria) => void;
  totalResultsCount?: number;
  className?: string;
  compact?: boolean;
}

export function TrialsSearchFilter({
  initialCriteria,
  onFilterChange,
  totalResultsCount,
  className = "",
  compact = false,
}: TrialsSearchFilterProps) {
  const [criteria, setCriteria] = useState<TrialsFilterCriteria>({
    ...DEFAULT_FILTER_CRITERIA,
    ...initialCriteria,
  });

  const [expandedSection, setExpandedSection] = useState<"none" | "regions" | "sports" | "dates">(
    "none",
  );

  // Sync external changes
  useEffect(() => {
    if (initialCriteria) {
      setCriteria((prev) => ({ ...prev, ...initialCriteria }));
    }
  }, [initialCriteria]);

  const updateCriteria = (patch: Partial<TrialsFilterCriteria>) => {
    const updated = { ...criteria, ...patch };
    setCriteria(updated);
    if (onFilterChange) {
      onFilterChange(updated);
    }
  };

  const handleReset = () => {
    setCriteria(DEFAULT_FILTER_CRITERIA);
    if (onFilterChange) {
      onFilterChange(DEFAULT_FILTER_CRITERIA);
    }
  };

  // Active filter pills count
  const activePills = useMemo(() => {
    const pills: { id: string; label: string; onRemove: () => void }[] = [];

    if (criteria.query.trim()) {
      pills.push({
        id: "q",
        label: `"${criteria.query}"`,
        onRemove: () => updateCriteria({ query: "" }),
      });
    }

    if (criteria.region !== "all") {
      const reg = REGIONS.find((r) => r.id === criteria.region);
      if (reg) {
        pills.push({
          id: "region",
          label: `Region: ${reg.name}`,
          onRemove: () => updateCriteria({ region: "all" }),
        });
      }
    }

    if (criteria.city !== "all") {
      pills.push({
        id: "city",
        label: `City: ${criteria.city}`,
        onRemove: () => updateCriteria({ city: "all" }),
      });
    }

    if (criteria.sportType !== "all") {
      const st = SPORT_TYPES.find((s) => s.id === criteria.sportType);
      if (st) {
        pills.push({
          id: "sportType",
          label: `Type: ${st.name}`,
          onRemove: () => updateCriteria({ sportType: "all" }),
        });
      }
    }

    if (criteria.sport !== "all") {
      pills.push({
        id: "sport",
        label: `Sport: ${criteria.sport}`,
        onRemove: () => updateCriteria({ sport: "all" }),
      });
    }

    if (criteria.dateRange !== "all") {
      const dateOption = DATE_RANGE_OPTIONS.find((d) => d.id === criteria.dateRange);
      if (dateOption) {
        pills.push({
          id: "dateRange",
          label: `Date: ${dateOption.label}`,
          onRemove: () => updateCriteria({ dateRange: "all" }),
        });
      }
    }

    if (criteria.freeOnly) {
      pills.push({
        id: "freeOnly",
        label: "Free Entry Only",
        onRemove: () => updateCriteria({ freeOnly: false }),
      });
    }

    return pills;
  }, [criteria]);

  return (
    <div
      id="trials-search-filter-root"
      className={`rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm space-y-4 ${className}`}
    >
      {/* 1. KEYWORD SEARCH BAR */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id="input-trials-search-query"
          type="text"
          placeholder="Search by trial title, academy, venue, sport, or keyword..."
          value={criteria.query}
          onChange={(e) => updateCriteria({ query: e.target.value })}
          className="h-11 pl-10 pr-10 text-sm rounded-xl border-border bg-background focus-visible:ring-primary"
        />
        {criteria.query && (
          <button
            type="button"
            onClick={() => updateCriteria({ query: "" })}
            className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 2. THREE CORE FILTER DROPDOWNS: REGIONS, SPORT TYPES, UPCOMING DATES */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* FILTER 1: SPECIFIC REGIONS */}
        <div id="filter-region-control" className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Specific Regions</span>
          </label>
          <Select
            value={criteria.region}
            onValueChange={(val) => updateCriteria({ region: val, city: "all" })}
          >
            <SelectTrigger
              id="select-trial-region"
              className="h-10 text-xs rounded-xl border-border bg-background"
            >
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FILTER 2: SPORT TYPES */}
        <div id="filter-sport-type-control" className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span>Sport Types</span>
          </label>
          <Select
            value={criteria.sportType}
            onValueChange={(val) => updateCriteria({ sportType: val, sport: "all" })}
          >
            <SelectTrigger
              id="select-trial-sport-type"
              className="h-10 text-xs rounded-xl border-border bg-background"
            >
              <SelectValue placeholder="All Sport Types" />
            </SelectTrigger>
            <SelectContent>
              {SPORT_TYPES.map((st) => (
                <SelectItem key={st.id} value={st.id} className="text-xs">
                  <span className="mr-1.5">{st.icon}</span>
                  {st.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FILTER 3: UPCOMING DATES */}
        <div id="filter-upcoming-dates-control" className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Upcoming Dates</span>
          </label>
          <Select
            value={criteria.dateRange}
            onValueChange={(val) => updateCriteria({ dateRange: val as DateRangeOption })}
          >
            <SelectTrigger
              id="select-trial-upcoming-dates"
              className="h-10 text-xs rounded-xl border-border bg-background"
            >
              <SelectValue placeholder="All Upcoming Dates" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((d) => (
                <SelectItem key={d.id} value={d.id} className="text-xs">
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3. QUICK CHIPS: POPULAR REGIONS & SPORT PILLS */}
      {!compact && (
        <div className="pt-2 border-t border-border/50 space-y-2.5">
          {/* Popular Cities Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Popular Cities:
            </span>
            <button
              type="button"
              onClick={() => updateCriteria({ city: "all", region: "all" })}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                criteria.city === "all" && criteria.region === "all"
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All India
            </button>
            {CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  updateCriteria({
                    city: criteria.city === c ? "all" : c,
                    region: "all",
                  })
                }
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                  criteria.city.toLowerCase() === c.toLowerCase()
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Individual Sports Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Sports:
            </span>
            <button
              type="button"
              onClick={() => updateCriteria({ sport: "all", sportType: "all" })}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                criteria.sport === "all" && criteria.sportType === "all"
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Sports
            </button>
            {SPORTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  updateCriteria({
                    sport: criteria.sport === s ? "all" : s,
                    sportType: "all",
                  })
                }
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors cursor-pointer border ${
                  criteria.sport.toLowerCase() === s.toLowerCase()
                    ? "border-primary bg-primary text-primary-foreground font-semibold"
                    : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. ACTIVE FILTER PILLS & RESULTS COUNTER */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {typeof totalResultsCount === "number" && (
            <span className="font-bold text-foreground mr-1.5">
              {`${totalResultsCount} ${totalResultsCount === 1 ? "Trial Found" : "Trials Found"}`}
            </span>
          )}

          {activePills.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={pill.onRemove}
                className="hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 transition-colors cursor-pointer"
                title={`Remove ${pill.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {activePills.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default TrialsSearchFilter;
