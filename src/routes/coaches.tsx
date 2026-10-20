import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GraduationCap, MapPin, RotateCcw, Search, Star, Trophy } from "lucide-react";
import { toast } from "sonner";
import { COACHES, KHELGRID_SPORTS, type CoachProfile } from "@/data/khelgrid";
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
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/coaches")({
  head: () =>
    buildSeoHead({
      title: "Find Certified Sports Coaches & Trainers across India · KhelGrid",
      description:
        "Browse verified, NIS-certified sports coaches by sport, experience, and athlete ratings. Hire personal trainers for cricket, football, badminton, tennis, and fitness.",
      canonicalPath: "/coaches",
      keywords:
        "sports coaches India, certified badminton coach, cricket bowling coach, football fitness trainer, NIS certified coaches",
      type: "website",
    }),
  component: CoachesPage,
});

const EXPERIENCE_FILTERS = [
  { value: "any", label: "Any experience" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
  { value: "15", label: "15+ years" },
] as const;

const RATING_FILTERS = [
  { value: "any", label: "Any rating" },
  { value: "4", label: "4.0+ stars" },
  { value: "4.5", label: "4.5+ stars" },
  { value: "4.8", label: "4.8+ stars" },
] as const;

function CoachesPage() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState("All");
  const [experience, setExperience] = useState("any");
  const [rating, setRating] = useState("any");

  const coaches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minimumExperience = experience === "any" ? 0 : Number(experience);
    const minimumRating = rating === "any" ? 0 : Number(rating);

    return COACHES.filter((coach) => {
      const searchableText = [coach.name, coach.sport, coach.city, coach.area, ...coach.specialties]
        .join(" ")
        .toLowerCase();

      return (
        (sport === "All" || coach.sport === sport) &&
        coach.yearsExperience >= minimumExperience &&
        coach.rating >= minimumRating &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    }).sort((first, second) => second.rating - first.rating);
  }, [experience, query, rating, sport]);

  const resetFilters = () => {
    setQuery("");
    setSport("All");
    setExperience("any");
    setRating("any");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <header className="max-w-3xl">
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          Coach directory
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Find the right coach for your next step
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Browse coaches by sport, compare experience and ratings, then shortlist someone whose
          coaching style fits your goals.
        </p>
      </header>

      <section
        className="mt-8 rounded-2xl border border-border bg-card/60 p-4 sm:p-5"
        aria-labelledby="coach-filters-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="coach-filters-heading" className="font-semibold">
              Filter coaches
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Use any combination of filters to narrow the directory.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-[minmax(0,1fr)_170px_170px_170px]">
          <div className="relative col-span-2 sm:col-span-4 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, specialty or city…"
              aria-label="Search coaches"
              className="h-11 border-border bg-secondary/40 pl-9"
            />
          </div>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="h-11 min-w-0 border-border bg-secondary/40">
              <Trophy className="mr-1 h-4 w-4 shrink-0 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All sports</SelectItem>
              {KHELGRID_SPORTS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger className="h-11 min-w-0 border-border bg-secondary/40">
              <GraduationCap className="mr-1 h-4 w-4 shrink-0 text-primary" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_FILTERS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className="h-11 min-w-0 border-border bg-secondary/40">
              <Star className="mr-1 h-4 w-4 shrink-0 text-yellow-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_FILTERS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Browse by sport"
        >
          <button
            type="button"
            onClick={() => setSport("All")}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${sport === "All" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
          >
            All sports
          </button>
          {KHELGRID_SPORTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSport(item)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${sport === item ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{coaches.length} coaches to explore</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ratings are shown with the directory profile and should be discussed with the coach
            before booking.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">Sorted by overall rating</span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coaches.map((coach) => (
          <CoachCard key={coach.id} coach={coach} />
        ))}
        {coaches.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="font-semibold">No coaches match these filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different sport, rating or experience range.
            </p>
            <Button type="button" variant="outline" className="mt-4" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function CoachCard({ coach }: { coach: CoachProfile }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={coach.image}
          alt={`${coach.name}, ${coach.sport} coach`}
          width={400}
          height={250}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-sm">
          {coach.sport}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{coach.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {coach.area}, {coach.city}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            {coach.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-secondary/60 p-2">
            <p className="text-muted-foreground">Experience</p>
            <p className="mt-0.5 font-semibold">{coach.yearsExperience} years</p>
          </div>
          <div className="rounded-lg bg-secondary/60 p-2">
            <p className="text-muted-foreground">Reviews</p>
            <p className="mt-0.5 font-semibold">{coach.reviewCount}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {coach.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="border-border text-[10px]">
              {specialty}
            </Badge>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Usually available: {coach.availability}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full rounded-full"
          onClick={() => toast.success(`Intro request started for ${coach.name}`)}
        >
          Request an intro
        </Button>
      </div>
    </article>
  );
}
