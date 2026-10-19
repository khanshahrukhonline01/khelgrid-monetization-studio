import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { COACHING, type CoachingProgram, PLAYO_SPORTS, PLAYO_CITIES } from "@/data/playo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TrainFilters,
  TrainDesktopSidebar,
  filterCoachingPrograms,
  DEFAULT_TRAIN_FILTERS,
  type TrainFilterState,
  SPORT_ICONS,
} from "@/components/train/TrainFilters";
import {
  Star,
  MapPin,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  Share2,
  Clock,
  Phone,
  RotateCcw,
  GraduationCap,
  Trophy,
  UserCheck,
  Building2,
  Check,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/train")({
  head: () =>
    buildSeoHead({
      title: "Sports Coaching & Certified Academies in India · KhelGrid",
      description:
        "Find certified coaches, NIS-accredited trainers, and elite sports academies across India. Programs for beginners, grassroots youth, and professional athletes.",
      canonicalPath: "/train",
      keywords:
        "sports coaching, cricket academy near me, football coach, badminton training classes, athlete development, sports training camps",
      type: "website",
    }),
  component: TrainPage,
});

export function TrainPage() {
  const [filters, setFilters] = useState<TrainFilterState>(DEFAULT_TRAIN_FILTERS);
  const [enquiringProgram, setEnquiringProgram] = useState<CoachingProgram | null>(null);
  const [coachRegisterOpen, setCoachRegisterOpen] = useState(false);
  const [academyRegisterOpen, setAcademyRegisterOpen] = useState(false);

  // Enquiry modal form state
  const [enquiryForm, setEnquiryForm] = useState({
    athleteName: "",
    phone: "",
    age: "14",
    preferredTime: "Evening Batch (5 PM - 7 PM)",
    notes: "",
  });

  // Coach registration modal form state
  const [coachForm, setCoachForm] = useState({
    name: "",
    sport: "Cricket",
    city: "Bengaluru",
    area: "",
    experienceYears: "5",
    certification: "NIS Patiala Diploma",
    format: "1-on-1 Private",
    feePerMonth: "4000",
    phone: "",
    bio: "",
  });

  // Academy registration modal form state
  const [academyForm, setAcademyForm] = useState({
    academyName: "",
    directorName: "",
    sport: "Football",
    city: "Delhi",
    fullAddress: "",
    affiliation: "State Association Recognized",
    facilities: ["Gym", "Turf Wickets"],
    monthlyFee: "5000",
    phone: "",
    email: "",
  });

  // Read URL search params for deep linking (e.g., ?type=coaches or ?register=coach)
  const searchParams = useRouterState({
    select: (s) => (s.location.search as Record<string, string | undefined>) || {},
  });

  useEffect(() => {
    if (searchParams.type === "coaches" || searchParams.type === "coach") {
      setFilters((prev) => ({ ...prev, entityType: "coaches" }));
    } else if (searchParams.type === "academies" || searchParams.type === "academy") {
      setFilters((prev) => ({ ...prev, entityType: "academies" }));
    }

    if (searchParams.register === "coach") {
      setCoachRegisterOpen(true);
    } else if (searchParams.register === "academy") {
      setAcademyRegisterOpen(true);
    }
  }, [searchParams.type, searchParams.register]);

  // Calculate live sport counts across all available coaching programs
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of COACHING) {
      counts[p.sport] = (counts[p.sport] || 0) + 1;
    }
    return counts;
  }, []);

  // Compute coach vs academy counts
  const coachCount = useMemo(() => {
    return COACHING.filter((p) => p.entityType === "coach" || p.format === "1-on-1 Private").length;
  }, []);

  const academyCount = useMemo(() => {
    return COACHING.filter(
      (p) =>
        p.entityType === "academy" ||
        p.format === "Academy Batch" ||
        p.format === "High-Performance Combine",
    ).length;
  }, []);

  // Filter and sort programs based on active filter state
  const filteredList = useMemo(() => {
    return filterCoachingPrograms(COACHING, filters);
  }, [filters]);

  const handleReset = () => {
    setFilters(DEFAULT_TRAIN_FILTERS);
    toast.info("All coaching filters have been reset");
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Coaching search link copied to clipboard!");
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.athleteName.trim() || !enquiryForm.phone.trim()) {
      toast.error("Please provide athlete name and contact number");
      return;
    }

    toast.success(
      `Enquiry submitted for ${enquiringProgram?.title}! ${enquiringProgram?.coach} will contact you shortly.`,
    );
    setEnquiringProgram(null);
    setEnquiryForm({
      athleteName: "",
      phone: "",
      age: "14",
      preferredTime: "Evening Batch (5 PM - 7 PM)",
      notes: "",
    });
  };

  const handleCoachRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachForm.name.trim() || !coachForm.phone.trim()) {
      toast.error("Please provide your name and phone number");
      return;
    }

    toast.success(
      `Welcome Coach ${coachForm.name}! Your coaching application for ${coachForm.sport} in ${coachForm.city} has been received. Our verification team will review your NIS/federation credentials within 24 hours.`,
    );
    setCoachRegisterOpen(false);
  };

  const handleAcademyRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!academyForm.academyName.trim() || !academyForm.phone.trim()) {
      toast.error("Please provide your academy name and phone number");
      return;
    }

    toast.success(
      `Academy "${academyForm.academyName}" registered successfully! Our academy onboarding coordinator will contact you to verify facilities and publish your batch schedule.`,
    );
    setAcademyRegisterOpen(false);
  };

  return (
    <main
      id="train-coaching-page"
      className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 w-full min-w-0 max-w-full overflow-x-hidden"
    >
      {/* 1. COMPACT ATHLETIC HEADER WITH REGISTRATION BUTTONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 w-full min-w-0 max-w-full">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate flex items-center gap-2">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
            <span>Sports Coaching & Academies</span>
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>NIS & Federation Verified</span>
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            ({filteredList.length} programs available)
          </span>
        </div>

        {/* Action CTAs: Registration for Coaches & Academies + Sports CV */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCoachRegisterOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold border-primary/40 bg-primary/5 text-primary hover:bg-primary/15 cursor-pointer"
            title="Register as a coach on KhelGrid"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>+ Register Coach</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAcademyRegisterOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 cursor-pointer"
            title="Register your sports academy"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>+ Register Academy</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="h-8 gap-1.5 text-xs font-medium border-border cursor-pointer hidden sm:inline-flex"
            title="Share coaching programs"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Share</span>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold text-xs shadow-xs"
          >
            <Link to="/onboarding">
              <Sparkles className="h-3.5 w-3.5" /> Sports CV
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. RESPONSIVE GRID LAYOUT (Desktop Sidebar + Main Content) */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12 items-start w-full min-w-0 max-w-full">
        {/* DESKTOP FILTER SIDEBAR (Visible on lg >= 1024px) */}
        <TrainDesktopSidebar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          totalFiltered={filteredList.length}
          totalAvailable={COACHING.length}
          sportCounts={sportCounts}
          coachCount={coachCount}
          academyCount={academyCount}
          onOpenCoachRegister={() => setCoachRegisterOpen(true)}
          onOpenAcademyRegister={() => setAcademyRegisterOpen(true)}
        />

        {/* MAIN WORKSPACE: SEARCH, CONTROLS, ACTIVE PILLS, AND PROGRAMS */}
        <div className="w-full min-w-0 max-w-full lg:col-span-9 space-y-4">
          {/* Main Filter Control Suite (Entity Switcher, Sports Rail, Search Bar, Sort, and Mobile Sheet) */}
          <TrainFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            totalFiltered={filteredList.length}
            totalAvailable={COACHING.length}
            sportCounts={sportCounts}
            coachCount={coachCount}
            academyCount={academyCount}
            onOpenCoachRegister={() => setCoachRegisterOpen(true)}
            onOpenAcademyRegister={() => setAcademyRegisterOpen(true)}
          />

          {/* Quick Informative Banner for Directory Switching */}
          {filters.entityType === "coaches" && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-foreground">
                <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Viewing certified personal trainers &amp; individual sport coaches. Looking for
                  complete coach bios?
                </span>
              </div>
              <Link
                to="/coaches"
                className="font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Browse Full Coach Directory</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          {filters.entityType === "academies" && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-foreground">
                <Trophy className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  Viewing accredited training academies &amp; sports centers. Are you an academy
                  organizer?
                </span>
              </div>
              <Link
                to="/academy"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Organizer Partner Portal</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* 3. PROGRAM LISTINGS (GRID OR LIST VIEW) */}
          {filteredList.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-2xl border border-dashed border-border/80 bg-card p-8 sm:p-12 text-center space-y-4 w-full">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">No Training Programs Found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  We couldn&apos;t find training batches matching your current filter criteria. Try
                  widening your city selection, clearing budget limits, or switching directory type.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    setFilters({ ...filters, sport: "All", city: "All", entityType: "all" })
                  }
                  className="gap-1.5 text-xs bg-primary text-primary-foreground cursor-pointer"
                >
                  View Pan-India Programs
                </Button>
              </div>
            </div>
          ) : filters.view === "list" ? (
            /* COMPACT LIST VIEW */
            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs w-full min-w-0 max-w-full">
              <div className="divide-y divide-border/60">
                {filteredList.map((c) => {
                  const isCoach = c.entityType === "coach" || c.format === "1-on-1 Private";
                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <img
                          src={c.image}
                          alt={c.title}
                          loading="lazy"
                          className="h-16 w-20 rounded-xl object-cover shrink-0 bg-secondary"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-primary flex items-center gap-1">
                              {SPORT_ICONS[c.sport] || "🏆"} {c.sport}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {c.area}, {c.city}
                            </span>
                            {isCoach ? (
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                Coach
                              </span>
                            ) : (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Academy
                              </span>
                            )}
                            {c.certified && (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                ✓ {c.accreditation || "NIS Certified"}
                              </span>
                            )}
                            {c.freeTrial && (
                              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                Free Trial
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                            {c.title}
                          </h3>

                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                            <span className="font-medium text-foreground">{c.coach}</span>
                            {c.entityType !== "academy" && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                  <Star className="h-3 w-3 fill-current" /> {c.rating}
                                </span>
                              </>
                            )}
                            <span>·</span>
                            <span>{c.level}</span>
                            {c.format && (
                              <>
                                <span>·</span>
                                <span>{c.format}</span>
                              </>
                            )}
                            {c.facilities && c.facilities.length > 0 && (
                              <>
                                <span>·</span>
                                <span className="text-foreground/80">
                                  {c.facilities.slice(0, 2).join(", ")}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-bold text-foreground">
                            ₹{c.pricePerMonth.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-muted-foreground"> / mo</span>
                          </div>
                          {c.sessionsPerWeek && (
                            <div className="text-[11px] text-muted-foreground">
                              {c.sessionsPerWeek} sessions/wk
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => setEnquiringProgram(c)}
                          className="h-9 text-xs font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer"
                        >
                          {c.freeTrial ? "Book Demo" : isCoach ? "Book Coach" : "Enquire Batch"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0 max-w-full">
              {filteredList.map((c) => {
                const isCoach = c.entityType === "coach" || c.format === "1-on-1 Private";
                return (
                  <div
                    key={c.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                  >
                    <div>
                      {/* Media Header */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                        <img
                          src={c.image}
                          alt={c.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                            {isCoach ? "Coach" : "Academy"}
                          </span>
                          <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                            {c.level}
                          </span>
                          {c.certified && (
                            <span className="rounded-md bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                              ✓ {c.accreditation ? c.accreditation.split("/")[0].trim() : "NIS"}
                            </span>
                          )}
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
                          <span className="flex items-center gap-1 font-semibold">
                            <span>{SPORT_ICONS[c.sport] || "🏆"}</span>
                            <span>{c.sport}</span>
                          </span>
                          {c.entityType !== "academy" && (
                            <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-bold">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{c.rating}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-bold leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {c.title}
                        </h3>

                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{c.coach}</span>
                          {c.experienceYears && (
                            <>
                              <span>·</span>
                              <span>{c.experienceYears}+ yrs exp</span>
                            </>
                          )}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0 text-primary" />
                          <span className="truncate">
                            {c.area}, {c.city}
                          </span>
                        </div>

                        {/* Highlights / Format & Facilities */}
                        <div className="pt-1 text-[11px] text-muted-foreground flex flex-wrap items-center gap-1.5 border-t border-border/50">
                          <span>{c.format || "Academy Batch"}</span>
                          <span>·</span>
                          <span>{c.ageGroup || "All Ages"}</span>
                          {c.facilities && c.facilities.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-foreground/90 font-medium truncate max-w-[140px]">
                                {c.facilities[0]}
                              </span>
                            </>
                          )}
                          {c.freeTrial && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                Free Trial
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                        <div>
                          <div className="text-base font-extrabold text-foreground leading-none">
                            ₹{c.pricePerMonth.toLocaleString("en-IN")}
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {" "}
                              / mo
                            </span>
                          </div>
                          {c.sessionsPerWeek && (
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {c.sessionsPerWeek} sessions/wk
                            </div>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => setEnquiringProgram(c)}
                          className="h-8.5 px-3 text-xs font-semibold bg-primary text-primary-foreground shadow-xs cursor-pointer hover:bg-primary/90"
                        >
                          {c.freeTrial ? "Book Trial" : isCoach ? "Book Coach" : "Enquire"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. ENQUIRY / BOOK TRIAL MODAL */}
      {enquiringProgram && (
        <Dialog open={!!enquiringProgram} onOpenChange={(o) => !o && setEnquiringProgram(null)}>
          <DialogContent className="max-w-md rounded-2xl p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>
                  {enquiringProgram.entityType === "coach"
                    ? "Book Coaching Session"
                    : "Enquire with Academy"}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Connect with {enquiringProgram.coach} for{" "}
                <span className="font-semibold text-foreground">{enquiringProgram.title}</span>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Athlete Name</label>
                <input
                  required
                  value={enquiryForm.athleteName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, athleteName: e.target.value })}
                  placeholder="Full name of student / athlete"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Contact Phone</label>
                  <input
                    required
                    type="tel"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Athlete Age</label>
                  <input
                    type="number"
                    min="4"
                    max="65"
                    value={enquiryForm.age}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, age: e.target.value })}
                    className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Preferred Timing</label>
                <select
                  value={enquiryForm.preferredTime}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, preferredTime: e.target.value })
                  }
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  <option>Morning Batch (6 AM - 8 AM)</option>
                  <option>Evening Batch (5 PM - 7 PM)</option>
                  <option>Weekend Intensive (Sat &amp; Sun)</option>
                  <option>Flexible 1-on-1 Timing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Questions / Training Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={enquiryForm.notes}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                  placeholder="e.g. Preparing for state team trials, beginner looking for basic strokes..."
                  className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary resize-none"
                />
              </div>

              {enquiringProgram.freeTrial && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-xs flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Complimentary first evaluation demo session included!</span>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEnquiringProgram(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-semibold bg-primary text-primary-foreground"
                >
                  Confirm Enquiry
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* 5. REGISTER AS COACH MODAL */}
      <Dialog open={coachRegisterOpen} onOpenChange={setCoachRegisterOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Register as a Sports Coach</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              List your coaching services on KhelGrid to connect with thousands of athletes and
              parents across India.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCoachRegisterSubmit} className="space-y-3.5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Coach Full Name</label>
                <input
                  required
                  value={coachForm.name}
                  onChange={(e) => setCoachForm({ ...coachForm, name: e.target.value })}
                  placeholder="e.g. Coach Ramesh Kumar"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Primary Sport</label>
                <select
                  value={coachForm.sport}
                  onChange={(e) => setCoachForm({ ...coachForm, sport: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {PLAYO_SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">City</label>
                <select
                  value={coachForm.city}
                  onChange={(e) => setCoachForm({ ...coachForm, city: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {PLAYO_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Locality / Area</label>
                <input
                  value={coachForm.area}
                  onChange={(e) => setCoachForm({ ...coachForm, area: e.target.value })}
                  placeholder="e.g. Koramangala, Indiranagar"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Accreditation / Certification
                </label>
                <input
                  value={coachForm.certification}
                  onChange={(e) => setCoachForm({ ...coachForm, certification: e.target.value })}
                  placeholder="e.g. NIS Patiala, BCCI Level 2, AFC B"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Years of Experience</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={coachForm.experienceYears}
                  onChange={(e) => setCoachForm({ ...coachForm, experienceYears: e.target.value })}
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Coaching Format</label>
                <select
                  value={coachForm.format}
                  onChange={(e) => setCoachForm({ ...coachForm, format: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  <option value="1-on-1 Private">1-on-1 Private Coaching</option>
                  <option value="Weekend Camp">Weekend Clinic / Camp</option>
                  <option value="Academy Batch">Small Group Batch</option>
                  <option value="Online Video Analysis">Video Analysis &amp; Remote</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Monthly Fee (₹)</label>
                <input
                  type="number"
                  step="500"
                  value={coachForm.feePerMonth}
                  onChange={(e) => setCoachForm({ ...coachForm, feePerMonth: e.target.value })}
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                WhatsApp / Phone Number
              </label>
              <input
                required
                type="tel"
                value={coachForm.phone}
                onChange={(e) => setCoachForm({ ...coachForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Coaching Philosophy / Bio
              </label>
              <textarea
                rows={2}
                value={coachForm.bio}
                onChange={(e) => setCoachForm({ ...coachForm, bio: e.target.value })}
                placeholder="Mention past achievements, key training methods, and student accomplishments..."
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCoachRegisterOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-primary text-primary-foreground"
              >
                Submit Coach Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. REGISTER SPORTS ACADEMY MODAL */}
      <Dialog open={academyRegisterOpen} onOpenChange={setAcademyRegisterOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-500" />
              <span>Register Your Sports Academy</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Publish your academy batches, showcase world-class facilities, and enroll aspiring
              champions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAcademyRegisterSubmit} className="space-y-3.5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Academy Name</label>
                <input
                  required
                  value={academyForm.academyName}
                  onChange={(e) => setAcademyForm({ ...academyForm, academyName: e.target.value })}
                  placeholder="e.g. Apex Sports Academy"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Director / Head Coach
                </label>
                <input
                  value={academyForm.directorName}
                  onChange={(e) => setAcademyForm({ ...academyForm, directorName: e.target.value })}
                  placeholder="e.g. Coach Vikram Singh"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Primary Sport</label>
                <select
                  value={academyForm.sport}
                  onChange={(e) => setAcademyForm({ ...academyForm, sport: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {PLAYO_SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">City</label>
                <select
                  value={academyForm.city}
                  onChange={(e) => setAcademyForm({ ...academyForm, city: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  {PLAYO_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Full Campus Address</label>
              <input
                value={academyForm.fullAddress}
                onChange={(e) => setAcademyForm({ ...academyForm, fullAddress: e.target.value })}
                placeholder="Plot no, sports complex, locality, pincode..."
                className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Association Affiliation
                </label>
                <select
                  value={academyForm.affiliation}
                  onChange={(e) => setAcademyForm({ ...academyForm, affiliation: e.target.value })}
                  className="w-full h-9.5 px-2.5 text-xs rounded-xl border border-border bg-background text-foreground outline-none"
                >
                  <option>SAI Khelo India Accredited</option>
                  <option>State Association Recognized</option>
                  <option>National Federation Affiliated</option>
                  <option>Private Training Center</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Starting Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  step="500"
                  value={academyForm.monthlyFee}
                  onChange={(e) => setAcademyForm({ ...academyForm, monthlyFee: e.target.value })}
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Official Phone</label>
                <input
                  required
                  type="tel"
                  value={academyForm.phone}
                  onChange={(e) => setAcademyForm({ ...academyForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Official Email</label>
                <input
                  type="email"
                  value={academyForm.email}
                  onChange={(e) => setAcademyForm({ ...academyForm, email: e.target.value })}
                  placeholder="admissions@academy.com"
                  className="w-full h-9.5 px-3 text-xs rounded-xl border border-border bg-background text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/30 p-2.5 text-xs space-y-1.5">
              <span className="font-semibold text-foreground">
                Facilities Highlighted on Listing:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                <span className="rounded bg-secondary px-2 py-0.5">✓ Turf Pitches</span>
                <span className="rounded bg-secondary px-2 py-0.5">✓ Strength Gym</span>
                <span className="rounded bg-secondary px-2 py-0.5">✓ Hostel / Boarding</span>
                <span className="rounded bg-secondary px-2 py-0.5">✓ Video Analytics</span>
                <span className="rounded bg-secondary px-2 py-0.5">✓ Floodlights</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAcademyRegisterOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Register Academy Campus
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default TrainPage;
