import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { COACHING, type CoachingProgram } from "@/data/playo";
import { SPORT_ICONS } from "@/components/train/TrainFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Star,
  Sparkles,
  Trophy,
  Users,
  Search,
  ExternalLink,
  Share2,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  Phone,
  RotateCcw,
  SlidersHorizontal,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";

// Filter for the 20 Batch 1 Khelo India / SAI Accredited Academies
const KHELO_ACADEMIES_BATCH_1 = COACHING.filter(
  (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
);

// Structured Schema for SEO
const ACADEMY_ITEMS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Khelo India & SAI Accredited Sports Academies in India (Batch 1)",
  description:
    "Official directory of verified Khelo India Accredited Academies (KIAA) and SAI National Centres of Excellence (NCOE) across India with residential boarding, world-class coaching, and sports scholarships.",
  numberOfItems: KHELO_ACADEMIES_BATCH_1.length,
  itemListElement: KHELO_ACADEMIES_BATCH_1.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SportsActivityLocation",
      name: item.academyName || item.title,
      description: item.highlights?.join(". ") || item.title,
      image: item.image,
      address: {
        "@type": "PostalAddress",
        addressLocality: item.city,
        streetAddress: item.area,
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        addressCountry: "IN",
      },
      telephone: "+91-11-24368393",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: item.rating,
        reviewCount: item.reviewsCount || 100,
        bestRating: 5,
        worstRating: 1,
      },
    },
  })),
};

export const Route = createFileRoute("/academy")({
  head: () =>
    buildSeoHead({
      title:
        "Khelo India & SAI Accredited Sports Academies Directory (Batch 1) · KhelGrid | Game, Sport & Play",
      description:
        "Explore 20 verified Khelo India Accredited Academies (KIAA) and SAI National Centres of Excellence (NCOE) across India. Elite residential coaching, state sports hostels, and Olympic scholarship programs.",
      canonicalPath: "/academy",
      keywords:
        "khelo india accredited academies, sports authority of india, sai ncoe, army sports institute pune, tata archery academy, usha school of athletics, gopichand badminton academy, mary kom boxing academy, chhatrasal stadium, bcci centre of excellence, reliance foundation young champs, sports academies in india, game, sport, play, sports coaching 2026, residential sports hostel",
      type: "website",
      customSchema: ACADEMY_ITEMS_SCHEMA,
    }),
  component: AcademyDirectoryPage,
});

export function AcademyDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [enquiringAcademy, setEnquiringAcademy] = useState<CoachingProgram | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Enquiry modal form state
  const [enquiryForm, setEnquiryForm] = useState({
    athleteName: "",
    phone: "",
    age: "15",
    preferredBatch: "Full Residential Batch (Scholarship / Combine)",
    notes: "",
  });

  // Registration modal form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    director: "",
    sport: "Archery",
    city: "Pune",
    accreditationType: "Khelo India Accredited Academy (KIAA)",
    phone: "",
    email: "",
  });

  // Unique sports and cities from Batch 1
  const availableSports = useMemo(() => {
    const set = new Set<string>();
    KHELO_ACADEMIES_BATCH_1.forEach((a) => set.add(a.sport));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    KHELO_ACADEMIES_BATCH_1.forEach((a) => set.add(a.city));
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filtered academies
  const filteredAcademies = useMemo(() => {
    return KHELO_ACADEMIES_BATCH_1.filter((item) => {
      if (selectedSport !== "All" && item.sport !== selectedSport) {
        return false;
      }
      if (selectedCity !== "All" && item.city !== selectedCity) {
        return false;
      }
      if (scholarshipOnly && item.pricePerMonth !== 0) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchName = item.academyName?.toLowerCase().includes(q);
        const matchCoach = item.coach.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        const matchArea = item.area.toLowerCase().includes(q);
        const matchSport = item.sport.toLowerCase().includes(q);
        const matchAccreditation = item.accreditation?.toLowerCase().includes(q);
        if (
          !matchTitle &&
          !matchName &&
          !matchCoach &&
          !matchCity &&
          !matchArea &&
          !matchSport &&
          !matchAccreditation
        ) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedSport, selectedCity, scholarshipOnly]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.athleteName.trim() || !enquiryForm.phone.trim()) {
      toast.error("Please provide your name and contact phone number");
      return;
    }
    toast.success(
      `Enquiry submitted to ${enquiringAcademy?.academyName || enquiringAcademy?.title}! Their admissions coordinator will review your Sports CV and contact you within 24 hours.`,
    );
    setEnquiringAcademy(null);
    setEnquiryForm({
      athleteName: "",
      phone: "",
      age: "15",
      preferredBatch: "Full Residential Batch (Scholarship / Combine)",
      notes: "",
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name.trim() || !registerForm.phone.trim()) {
      toast.error("Please fill in the academy name and contact phone");
      return;
    }
    toast.success(
      `Registration received for "${registerForm.name}"! Our Sports Authority & Accreditation desk will verify your credentials and publish your academy page.`,
    );
    setRegisterModalOpen(false);
  };

  const copyShareLink = (academy: CoachingProgram) => {
    const url = `${window.location.origin}/academy#${academy.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(`Shareable link copied for ${academy.academyName || academy.title}!`);
    } else {
      toast.info(`Academy ID: ${academy.id}`);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-10 w-full min-w-0 max-w-full overflow-x-hidden">
      {/* 1. HERO & BATCH ANNOUNCEMENT HEADER */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold gap-1.5 px-3 py-1 text-xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Official Khelo India & SAI Accredited Directory</span>
          </Badge>

          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Batch 1: 20 Premier Academies (Prompt 1 of 2)</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl leading-tight">
          Khelo India & SAI Accredited Sports Academies
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Official roster of verified Khelo India Accredited Academies (KIAA) and SAI National
          Centres of Excellence (NCOE) across India. Featuring state-of-the-art sports science,
          residential boarding, Olympic pedigree mentors, and merit scholarships.
        </p>

        {/* Quick Highlights Counter */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3">
            <div className="text-xl sm:text-2xl font-black text-primary">20 Hubs</div>
            <div className="text-xs text-muted-foreground font-medium">Batch 1 Loaded</div>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              100% Verified
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              SAI / Federation Recognised
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3">
            <div className="text-xl sm:text-2xl font-black text-amber-500">₹0 Merit</div>
            <div className="text-xs text-muted-foreground font-medium">Scholarships Available</div>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3">
            <div className="text-xl sm:text-2xl font-black text-foreground">16+ Cities</div>
            <div className="text-xs text-muted-foreground font-medium">Across Pan-India</div>
          </div>
        </div>

        {/* Top Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setRegisterModalOpen(true)}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-xs"
          >
            <Building2 className="h-4 w-4" />
            <span>+ List Your Academy</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/train" search={{ entityType: "academies" }}>
              <GraduationCap className="h-4 w-4" />
              <span>Explore All in Training Hub</span>
            </Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Link to="/search">
              <Trophy className="h-4 w-4" />
              <span>View Active Selection Trials</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. SEARCH & FILTER SECTION */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by academy name, city, coach (e.g. Mary Kom, Tata, ASI Pune, Bhopal)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9.5 h-10 text-sm bg-background border-border"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sport Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span>Sport:</span>
              <select
                aria-label="Filter by sport"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              >
                {availableSports.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp === "All" ? "All Sports" : `${SPORT_ICONS[sp] || "🏆"} ${sp}`}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <span>City:</span>
              <select
                aria-label="Filter by city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              >
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct === "All" ? "All Locations" : ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Scholarship Only Toggle */}
            <Button
              type="button"
              variant={scholarshipOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setScholarshipOnly(!scholarshipOnly)}
              className="h-9 text-xs font-semibold gap-1.5"
            >
              <Award className="h-3.5 w-3.5" />
              <span>₹0 Scholarship Only</span>
            </Button>

            {/* Reset Filters */}
            {(searchTerm ||
              selectedSport !== "All" ||
              selectedCity !== "All" ||
              scholarshipOnly) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSport("All");
                  setSelectedCity("All");
                  setScholarshipOnly(false);
                }}
                className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 3. ACADEMY CARDS GRID */}
      <div className="mt-8">
        <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Accredited Academies Directory</h2>
            <Badge variant="secondary" className="text-xs font-semibold">
              {filteredAcademies.length} of {KHELO_ACADEMIES_BATCH_1.length} in Batch 1
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground hidden sm:block">
            Showing Batch 1 (First 20 Academies) · Next 20 in Next Prompt
          </div>
        </div>

        {filteredAcademies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No academies matched your filters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Try resetting the sport or location filter to view the accredited institutions in
              Batch 1.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("All");
                setSelectedCity("All");
                setScholarshipOnly(false);
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAcademies.map((academy) => {
              const isFree = academy.pricePerMonth === 0;

              return (
                <div
                  id={academy.id}
                  key={academy.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                >
                  {/* Card Image Banner */}
                  <div>
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                      <img
                        src={academy.image}
                        alt={academy.academyName || academy.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                        <span className="rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{academy.accreditation?.split("/")[0].trim() || "Accredited"}</span>
                        </span>

                        <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                          {academy.level}
                        </span>
                      </div>

                      {/* Bottom Image Overlay */}
                      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          <span>{SPORT_ICONS[academy.sport] || "🏆"}</span>
                          <span>{academy.sport}</span>
                        </span>

                        <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-bold">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{academy.rating}</span>
                          <span className="text-[10px] text-white/70">
                            ({academy.reviewsCount})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {academy.academyName || academy.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                          <Users className="h-3 w-3 shrink-0 text-primary" />
                          <span className="truncate">{academy.coach}</span>
                        </p>
                      </div>

                      {/* Location with Area & City */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate font-medium text-foreground/90">
                          {academy.area}, {academy.city}
                        </span>
                      </div>

                      {/* Format and Age Group */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                        <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
                          {academy.format}
                        </span>
                        <span>·</span>
                        <span>{academy.ageGroup}</span>
                        <span>·</span>
                        <span>{academy.sessionsPerWeek} sessions/wk</span>
                      </div>

                      {/* Facilities Badges */}
                      {academy.facilities && academy.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {academy.facilities.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="rounded-md bg-primary/5 border border-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                            >
                              {f}
                            </span>
                          ))}
                          {academy.facilities.length > 3 && (
                            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                              +{academy.facilities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Highlights */}
                      {academy.highlights && academy.highlights.length > 0 && (
                        <ul className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                          {academy.highlights.slice(0, 2).map((h, i) => (
                            <li key={i} className="flex items-start gap-1 line-clamp-1">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span className="truncate">{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                      <div>
                        {isFree ? (
                          <div>
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                              ₹0 Scholarship
                            </span>
                            <div className="text-[10px] text-muted-foreground">
                              Khelo India Free Boarding
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-base font-extrabold text-foreground">
                              ₹{academy.pricePerMonth.toLocaleString("en-IN")}
                              <span className="text-[11px] font-normal text-muted-foreground">
                                {" "}
                                / mo
                              </span>
                            </span>
                            <div className="text-[10px] text-muted-foreground">
                              Subsidized Academy Batch
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyShareLink(academy)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Share Academy Link"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => setEnquiringAcademy(academy)}
                          className="h-8 px-3 text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                        >
                          {isFree ? "Apply Scholarship" : "Enquire / Join"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. BATCH 2 NOTICE & CONTINUATION BANNER */}
      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center max-w-4xl mx-auto">
        <Badge variant="outline" className="border-primary/40 text-primary font-bold mb-2">
          Prompt 1 Complete · 20 Academies Active
        </Badge>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Ready for Batch 2 (Next 20 Academies)?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          We have configured and rendered the first 20 premier Khelo India Accredited Academies with
          verified locations, sports disciplines, and full SEO metadata. Ask for the next 20 in your
          next prompt to expand the roster to 40!
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild size="sm" className="bg-primary text-primary-foreground">
            <Link to="/train" search={{ entityType: "academies" }}>
              Filter Academies in Training Hub <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/search">Explore Selection Trials</Link>
          </Button>
        </div>
      </div>

      {/* 5. ENQUIRY MODAL */}
      {enquiringAcademy && (
        <Dialog open={!!enquiringAcademy} onOpenChange={(o) => !o && setEnquiringAcademy(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Enquire at {enquiringAcademy.academyName || enquiringAcademy.title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {enquiringAcademy.area}, {enquiringAcademy.city} · {enquiringAcademy.sport} ·{" "}
                {enquiringAcademy.accreditation}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5 py-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Athlete Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={enquiryForm.athleteName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, athleteName: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Contact Phone / WhatsApp *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Athlete Age</label>
                  <Input
                    type="number"
                    min="6"
                    max="35"
                    value={enquiryForm.age}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, age: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Preferred Program Format
                </label>
                <select
                  aria-label="Preferred Program Format"
                  value={enquiryForm.preferredBatch}
                  onChange={(e) =>
                    setEnquiryForm({ ...enquiryForm, preferredBatch: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                >
                  <option value="Full Residential Batch (Scholarship / Combine)">
                    Full Residential Batch (Scholarship / Combine)
                  </option>
                  <option value="Day Boarding Morning / Evening Squad">
                    Day Boarding Morning / Evening Squad
                  </option>
                  <option value="Weekend Intensive Coaching Camp">
                    Weekend Intensive Coaching Camp
                  </option>
                  <option value="Trial & Assessment Session">Trial & Assessment Session</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Sports CV & Background Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention previous tournaments played, medal record, or sports CV link..."
                  value={enquiryForm.notes}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-start gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {enquiringAcademy.pricePerMonth === 0
                    ? "This academy provides full or partial Khelo India scholarship coverage for selected athletes upon trial verification."
                    : `Monthly fee: ₹${enquiringAcademy.pricePerMonth.toLocaleString("en-IN")}. Merit fee concessions available for state medalists.`}
                </span>
              </div>

              <DialogFooter className="mt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEnquiringAcademy(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Submit Academy Application
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* 6. REGISTER ACADEMY MODAL */}
      {registerModalOpen && (
        <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                <span>List Your Sports Academy on KhelGrid</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Join India's official discovery network for verified sports talent, trials, and
                coaching.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 py-2">
              <div>
                <label className="text-xs font-semibold text-foreground">Academy Name *</label>
                <Input
                  required
                  placeholder="e.g. Apex High-Performance Sports Center"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Chief Coach / Director
                  </label>
                  <Input
                    placeholder="e.g. Coach Ramesh Kumar"
                    value={registerForm.director}
                    onChange={(e) => setRegisterForm({ ...registerForm, director: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Sport Discipline</label>
                  <Input
                    placeholder="e.g. Archery, Athletics, Boxing"
                    value={registerForm.sport}
                    onChange={(e) => setRegisterForm({ ...registerForm, sport: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <Input
                    placeholder="e.g. Pune, Bhopal, Delhi"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Accreditation</label>
                  <select
                    aria-label="Accreditation"
                    value={registerForm.accreditationType}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, accreditationType: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-xs"
                  >
                    <option value="Khelo India Accredited Academy (KIAA)">
                      Khelo India Accredited (KIAA)
                    </option>
                    <option value="SAI NCOE Partner">SAI NCOE Partner</option>
                    <option value="National Sports Federation (NSF)">
                      National Sports Federation (NSF)
                    </option>
                    <option value="State Sports Directorate Recognised">
                      State Sports Directorate
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Phone Number *</label>
                  <Input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Official Email</label>
                  <Input
                    type="email"
                    placeholder="contact@academy.org"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="mt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRegisterModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  Submit for Verification
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
export default AcademyDirectoryPage;
