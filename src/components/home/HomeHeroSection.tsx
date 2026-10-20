import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Trophy,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  CheckCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRIALS } from "@/data/trials";

export const SPORTS = [
  "All Sports",
  "Cricket",
  "Football",
  "Badminton",
  "Athletics",
  "Kho-Kho",
  "Hockey",
  "Tennis",
  "Wrestling",
  "Kabaddi",
  "Boxing",
  "Basketball",
  "Pickleball",
] as const;

export const LOCATIONS = [
  "All Locations",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chandigarh",
  "Pune",
  "Kolkata",
  "Chennai",
  "Jammu",
  "Chhatrapati Sambhajinagar",
  "Guwahati",
] as const;

export const AGE_CATEGORIES = [
  "Any Age",
  "Under-14",
  "Under-17",
  "Under-19",
  "Under-21",
  "Open (Senior)",
] as const;

export const QUICK_TAGS = [
  { label: "SAI NCOE Trials", sport: "Boxing", q: "SAI" },
  { label: "Kho-Kho National Trials", sport: "Kho-Kho", q: "Kho-Kho" },
  { label: "Turf Maidans & Box Cricket", sport: "Cricket", q: "Turf" },
  { label: "Ranji & State Selections", sport: "Cricket", q: "Ranji" },
  { label: "Akhada Dangal Wrestling", sport: "Wrestling", q: "Wrestling" },
  { label: "Football Youth Academies", sport: "Football", q: "Football" },
] as const;

export const HERO_STATS = [
  { value: "350+", label: "Verified Trials", icon: Trophy },
  { value: "1,200+", label: "Turfs & Venues", icon: Building2 },
  { value: "16+", label: "Sports Covered", icon: Compass },
  { value: "28", label: "States & UTs", icon: Users },
] as const;

export function HomeHeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"search" | "eligibility">("search");

  // Search state
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>("All Sports");
  const [location, setLocation] = useState<string>("All Locations");

  // Eligibility state
  const [eligibilitySport, setEligibilitySport] = useState<string>("Football");
  const [eligibilityAge, setEligibilityAge] = useState<string>("Under-17");
  const [eligibilityCity, setEligibilityCity] = useState<string>("All Locations");

  // Calculate matching trials for eligibility
  const eligibleCount = TRIALS.filter((t) => {
    const matchSport =
      eligibilitySport === "All Sports" || t.sport.toLowerCase() === eligibilitySport.toLowerCase();
    const matchCity =
      eligibilityCity === "All Locations" || t.city.toLowerCase() === eligibilityCity.toLowerCase();
    return matchSport && matchCity;
  }).length;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: query.trim(),
        sport: sport === "All Sports" ? undefined : sport,
        city: location === "All Locations" ? undefined : location,
        sort: "Soonest",
        free: false,
      },
    });
  };

  const handleEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: eligibilityAge === "Any Age" ? undefined : eligibilityAge,
        sport: eligibilitySport === "All Sports" ? undefined : eligibilitySport,
        city: eligibilityCity === "All Locations" ? undefined : eligibilityCity,
        sort: "Soonest",
        free: false,
      },
    });
  };

  const handleQuickTagClick = (tag: (typeof QUICK_TAGS)[number]) => {
    navigate({
      to: "/search",
      search: {
        q: tag.q,
        sport: tag.sport,
        sort: "Soonest",
        free: false,
      },
    });
  };

  return (
    <section
      id="hero"
      aria-label="Hero Discovery and Search"
      className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12"
    >
      {/* Background ambient gradient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_450px_at_50%_-5%,oklch(0.56_0.22_275/0.14),transparent_75%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Eyebrow & Main Title */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>India&apos;s Verified Sports Opportunity Network</span>
            <span className="text-muted-foreground" aria-hidden="true">
              ·
            </span>
            <span className="text-primary font-semibold">SAI, Federations & Clubs</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Find the right sports opportunity across <span className="text-gradient">India</span>
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg max-w-2xl mx-auto text-balance">
            Discover verified trials, book high-grade venues, join competitive pickup games, enroll
            in coaching academies, and build your official athlete Sports CV.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mx-auto mt-7 flex max-w-md items-center justify-center">
          <div className="inline-flex rounded-xl border border-border/80 bg-muted/60 p-1 shadow-inner backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Search Everything</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("eligibility")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "eligibility"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Trial Eligibility Finder</span>
            </button>
          </div>
        </div>

        {/* Central Search or Eligibility Card */}
        <div className="mx-auto mt-4 max-w-4xl">
          {activeTab === "search" ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center"
            >
              {/* Text Input */}
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search trial, turf name, academy, or city…"
                  aria-label="Search trials, venues, or sports events"
                  className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Dropdown Filters */}
              <div className="grid grid-cols-2 gap-2 sm:contents">
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger
                    aria-label="Filter by sport"
                    className="h-11 rounded-xl border-border bg-secondary/50 sm:w-44 text-sm"
                  >
                    <Trophy className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    aria-label="Filter by city or location"
                    className="h-11 rounded-xl border-border bg-secondary/50 sm:w-44 text-sm"
                  >
                    <MapPin className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Action */}
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95 cursor-pointer shadow-sm active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <span>Find Matches</span>
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleEligibilitySubmit}
              className="flex flex-col gap-2 rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                {/* Sport */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground ml-1">
                    Sport
                  </label>
                  <Select value={eligibilitySport} onValueChange={setEligibilitySport}>
                    <SelectTrigger className="h-10 rounded-xl border-border bg-secondary/50 text-sm">
                      <Trophy className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPORTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Category */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground ml-1">
                    Age Category
                  </label>
                  <Select value={eligibilityAge} onValueChange={setEligibilityAge}>
                    <SelectTrigger className="h-10 rounded-xl border-border bg-secondary/50 text-sm">
                      <Calendar
                        className="mr-1.5 h-4 w-4 text-primary shrink-0"
                        aria-hidden="true"
                      />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGE_CATEGORIES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground ml-1">
                    City or State
                  </label>
                  <Select value={eligibilityCity} onValueChange={setEligibilityCity}>
                    <SelectTrigger className="h-10 rounded-xl border-border bg-secondary/50 text-sm">
                      <MapPin className="mr-1.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Action */}
              <div className="sm:self-end">
                <Button
                  type="submit"
                  size="lg"
                  className="h-10 w-full sm:w-auto rounded-xl bg-gradient-hero px-6 text-primary-foreground hover:opacity-95 cursor-pointer shadow-sm active:scale-[0.98] transition-all whitespace-nowrap mt-2 sm:mt-0"
                >
                  <span>View Eligible Trials ({eligibleCount || 10}+)</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
          )}

          {/* Quick Filter Tags */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Trending:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Athletic Spotlight & Quantitative Impact Strip */}
        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-muted">
            <img
              src="/src/assets/images/khelgrid_hero_athletes_1790836288244.jpg"
              alt="Young Indian athletes sprinting on a modern training track"
              width={1200}
              height={500}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* Contrast scrim overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-white">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                  Grassroots to Podium
                </p>
                <p className="text-base sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                  Connecting over 50,000+ emerging athletes across 28 states
                </p>
              </div>
              <Link
                to="/start-from-zero"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white underline decoration-white/50 hover:decoration-white transition-colors"
              >
                <span>Read the Athlete Pathway Guide</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 divide-border/60 bg-card sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="p-4 text-center sm:p-5">
                <div className="flex items-center justify-center gap-1.5 text-primary">
                  <stat.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
