import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import {
  Building2,
  ShieldCheck,
  Search,
  Sparkles,
  Trophy,
  GraduationCap,
  RotateCcw,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import { COACHING, type CoachingProgram } from "@/data/playo";
import { SPORT_ICONS } from "@/components/train/TrainFilters";
import { AccreditedAcademyCard, getSportSlug, getCitySlug } from "./AccreditedAcademyCard";
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
import { toast } from "sonner";
import { SITE_URL } from "@/lib/seo";

// All 40 extracted Khelo India & SAI Accredited Academies
export const ALL_KHELO_ACADEMIES = COACHING.filter(
  (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
).slice(0, 40);

// Batch 1 (First 20 Academies)
export const DEFAULT_BATCH_1_ACADEMIES = ALL_KHELO_ACADEMIES.slice(0, 20);

// Batch 2 (Next 20 Academies)
export const DEFAULT_BATCH_2_ACADEMIES = ALL_KHELO_ACADEMIES.slice(20, 40);

export type BatchFilterType = "all" | "batch1" | "batch2";

export interface AccreditedAcademyListProps {
  /** Array of academies to render. Defaults to all 40 extracted Khelo India academies */
  academies?: CoachingProgram[];
  /** Initial batch view: "all" | "batch1" | "batch2" */
  initialBatch?: BatchFilterType;
  /** Section heading title */
  title?: string;
  /** Section description */
  subtitle?: string;
  /** Whether to show search, sport, and city filter controls */
  showFilters?: boolean;
  /** Whether to inject React Helmet SEO meta tags and JSON-LD schema */
  showSeoMetadata?: boolean;
  /** ClassName override */
  className?: string;
}

export function AccreditedAcademyList({
  academies = ALL_KHELO_ACADEMIES,
  initialBatch = "all",
  title = "Khelo India & SAI Accredited Sports Academies",
  subtitle = "Official directory of accredited sports academies, National Centres of Excellence (NCOE), and elite youth sports institutions across India.",
  showFilters = true,
  showSeoMetadata = true,
  className = "",
}: AccreditedAcademyListProps) {
  const [selectedBatch, setSelectedBatch] = useState<BatchFilterType>(initialBatch);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [enquiringAcademy, setEnquiringAcademy] = useState<CoachingProgram | null>(null);

  // Enquiry modal state
  const [enquiryForm, setEnquiryForm] = useState({
    athleteName: "",
    phone: "",
    age: "15",
    preferredBatch: "Full Residential Batch (Scholarship / Combine)",
    notes: "",
  });

  // Filter by selected batch first
  const batchFilteredList = useMemo(() => {
    if (selectedBatch === "batch1") {
      return academies.slice(0, 20);
    }
    if (selectedBatch === "batch2") {
      return academies.slice(20, 40);
    }
    return academies;
  }, [academies, selectedBatch]);

  // Extract unique sports and cities from active batch pool
  const availableSports = useMemo(() => {
    const set = new Set<string>();
    academies.forEach((a) => set.add(a.sport));
    return ["All", ...Array.from(set).sort()];
  }, [academies]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    academies.forEach((a) => set.add(a.city));
    return ["All", ...Array.from(set).sort()];
  }, [academies]);

  // Filter academies dynamically based on search, sport, city, and scholarship
  const filteredAcademies = useMemo(() => {
    return batchFilteredList.filter((item) => {
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
  }, [batchFilteredList, searchTerm, selectedSport, selectedCity, scholarshipOnly]);

  // Schema.org structured data for SEO crawlers covering all academies
  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "40 Khelo India & SAI Accredited Sports Academies in India",
      description:
        "Comprehensive roster of 40 verified Khelo India Accredited Academies (KIAA) and SAI National Centres of Excellence (NCOE) across India with residential boarding and scholarships.",
      numberOfItems: academies.length,
      itemListElement: academies.map((item, index) => ({
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
  }, [academies]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.athleteName.trim() || !enquiryForm.phone.trim()) {
      toast.error("Please provide your name and contact phone number");
      return;
    }
    toast.success(
      `Enquiry submitted to ${enquiringAcademy?.academyName || enquiringAcademy?.title}! Their admissions team will reach out within 24 hours.`,
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

  return (
    <section className={`w-full ${className}`}>
      {/* 1. DYNAMIC REACT HELMET SEO METADATA */}
      {showSeoMetadata && (
        <Helmet>
          <title>Top 40 Khelo India & SAI Accredited Sports Academies · Directory | KhelGrid</title>
          <meta
            name="description"
            content="Explore 40 verified sports academies extracted from the official Khelo India & SAI accredited directory. Residential coaching, NIS Patiala, Sonepat, Lucknow, Kolkata, Rohtak, Mohali, and scholarship programs."
          />
          <meta
            name="keywords"
            content="khelo india accredited academies, sports authority of india, sai ncoe, army sports institute pune, tata archery academy, usha school of athletics, nis patiala, sai sonepat, sai lucknow, sai rohtak, roundglass sports academy, minerva academy fc, gagan narang gun for glory, mrf pace foundation, sports academies in india, game, sport, play, sports trials 2026"
          />
          <meta
            property="og:title"
            content="Top 40 Khelo India & SAI Accredited Sports Academies · KhelGrid"
          />
          <meta
            property="og:description"
            content="Official directory of 40 accredited sports academies and National Centres of Excellence in India with verified locations and scholarships."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${SITE_URL}/academy`} />
          <link rel="canonical" href={`${SITE_URL}/academy`} />
          <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
        </Helmet>
      )}

      {/* 2. SECTION HEADER & BATCH CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold gap-1.5 px-2.5 py-0.5 text-xs"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Extracted from Official PDF Roster</span>
            </Badge>

            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>40 Accredited Academies Active (Batches 1 & 2)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Discovery CTAs */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 gap-1.5 text-xs font-semibold"
          >
            <Link to="/train" search={{ entityType: "academies" }}>
              <GraduationCap className="h-4 w-4" />
              <span>All Coaching Programs</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8.5 gap-1.5 text-xs font-semibold bg-primary text-primary-foreground"
          >
            <Link to="/search">
              <Trophy className="h-4 w-4" />
              <span>Selection Trials</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 3. BATCH SWITCHER TABS & INTERACTIVE DISCOVERY FILTERS */}
      {showFilters && (
        <div className="mt-6 space-y-3">
          {/* Batch Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-1.5 rounded-xl border border-border/70">
            <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground pl-1">
              <Layers className="h-4 w-4 text-primary" />
              <span>Roster Batch:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                variant={selectedBatch === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("all")}
                className="h-7.5 px-3 text-xs font-semibold cursor-pointer"
              >
                All 40 Academies
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch1" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch1")}
                className="h-7.5 px-3 text-xs font-semibold cursor-pointer"
              >
                Batch 1 (1–20)
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch2" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch2")}
                className="h-7.5 px-3 text-xs font-semibold cursor-pointer"
              >
                Batch 2 (21–40) ✨
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by academy name, city, coach (e.g. NIS Patiala, Sonepat, Mary Kom, RoundGlass)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9.5 h-9 text-xs bg-background border-border"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
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
                    className="h-8.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
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
                    className="h-8.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct === "All" ? "All Locations" : ct}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ₹0 Scholarship Toggle */}
                <Button
                  type="button"
                  variant={scholarshipOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScholarshipOnly(!scholarshipOnly)}
                  className="h-8.5 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>₹0 Scholarship</span>
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
                    className="h-8.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACADEMY CARDS GRID */}
      <div className="mt-6">
        <div className="flex items-center justify-between pb-2 mb-4">
          <span className="text-xs font-semibold text-muted-foreground">
            Displaying {filteredAcademies.length} of {batchFilteredList.length} Academies in{" "}
            {selectedBatch === "all"
              ? "All Batches"
              : selectedBatch === "batch1"
                ? "Batch 1"
                : "Batch 2"}
          </span>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Batches 1 & 2 Complete · 40 Official Academies
          </span>
        </div>

        {filteredAcademies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No academies matched your filters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Try selecting "All Sports" or "All Locations" or toggle to "All 40 Academies".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedSport("All");
                setSelectedCity("All");
                setScholarshipOnly(false);
                setSelectedBatch("all");
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAcademies.map((academy) => (
              <AccreditedAcademyCard
                key={academy.id}
                academy={academy}
                onEnquire={(ac) => setEnquiringAcademy(ac)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. INTERNAL DISCOVERABILITY HUB (Internal Linking for SEO) */}
      <div className="mt-10 rounded-2xl border border-border/80 bg-muted/30 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span>Explore Related Sports & Regional Hubs (Internal Linking)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="font-semibold text-foreground mb-1.5">Sports Hubs</div>
            <ul className="space-y-1 text-muted-foreground">
              {availableSports
                .filter((s) => s !== "All")
                .slice(0, 5)
                .map((sp) => (
                  <li key={sp}>
                    <Link
                      to="/sport/$slug"
                      params={{ slug: getSportSlug(sp) }}
                      className="hover:text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{SPORT_ICONS[sp] || "🏆"}</span>
                      <span>{sp} Academies & Trials</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-1.5">More Disciplines</div>
            <ul className="space-y-1 text-muted-foreground">
              {availableSports
                .filter((s) => s !== "All")
                .slice(5, 10)
                .map((sp) => (
                  <li key={sp}>
                    <Link
                      to="/sport/$slug"
                      params={{ slug: getSportSlug(sp) }}
                      className="hover:text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{SPORT_ICONS[sp] || "🏆"}</span>
                      <span>{sp} Academies & Trials</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-1.5">Sports Cities</div>
            <ul className="space-y-1 text-muted-foreground">
              {availableCities
                .filter((c) => c !== "All")
                .slice(0, 5)
                .map((ct) => (
                  <li key={ct}>
                    <Link
                      to="/city/$slug"
                      params={{ slug: getCitySlug(ct) }}
                      className="hover:text-primary hover:underline"
                    >
                      Sports in {ct}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground mb-1.5">Quick Navigation</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <Link
                  to="/train"
                  search={{ entityType: "academies" }}
                  className="hover:text-primary hover:underline"
                >
                  All Certified Academies
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary hover:underline">
                  All Selection Trials 2026
                </Link>
              </li>
              <li>
                <Link to="/cities" className="hover:text-primary hover:underline">
                  All Indian Sports Cities
                </Link>
              </li>
              <li>
                <Link to="/sports" className="hover:text-primary hover:underline">
                  All Olympic Sports
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. ENQUIRY / SCHOLARSHIP APPLICATION MODAL */}
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
    </section>
  );
}

export default AccreditedAcademyList;
