import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import {
  Building2,
  ShieldCheck,
  Search,
  Trophy,
  GraduationCap,
  RotateCcw,
  Award,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { COACHING, type CoachingProgram } from "@/data/khelgrid";
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

// Canonical deduplication helper to ensure zero duplicate academies across directory listings
export function normalizeAcademyDedupeKey(item: CoachingProgram): string {
  const normCity = item.city
    .toLowerCase()
    .trim()
    .replace(/^ballari$/, "bellary")
    .replace(/[^a-z0-9]/g, "");

  const name = (item.academyName || item.title)
    .toLowerCase()
    .trim()
    .replace(/\(.*?\)/g, "")
    .replace(/mini cuba/g, "")
    .replace(new RegExp(item.city, "gi"), "")
    .replace(/[^a-z0-9]/g, "");

  if (name.includes("bhiwaniboxing")) {
    return `bhiwani_boxing_${normCity}`;
  }
  if (name.includes("mpequestrian") || name.includes("madhyapradeshstateequestrian")) {
    return `mp_equestrian_${normCity}`;
  }
  if (name.includes("surjithockey")) {
    return `surjit_hockey_${normCity}`;
  }
  if (name.includes("chandigarhfootball")) {
    return `chandigarh_football_${normCity}`;
  }
  if (name.includes("bengalurufcresidential") || name.includes("bfcresidential")) {
    return `bengaluru_fc_residential_bellary`;
  }
  if (name.includes("gujaratstatetennis")) {
    return `gujarat_state_tennis_${normCity}`;
  }
  if (name.includes("assamstatebadminton")) {
    return `assam_state_badminton_${normCity}`;
  }

  return `${name}_${normCity}`;
}

export function getDeduplicatedKheloAcademies(): CoachingProgram[] {
  const rawKheloAcademies = COACHING.filter(
    (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
  );
  const seen = new Set<string>();
  const deduped: CoachingProgram[] = [];
  for (const item of rawKheloAcademies) {
    const key = normalizeAcademyDedupeKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }
  return deduped;
}

export const ALL_KHELO_ACADEMIES = getDeduplicatedKheloAcademies();

export const RAW_KHELO_ACADEMIES = COACHING.filter(
  (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
);

// Slices for batch views
export const DEFAULT_BATCH_1_ACADEMIES = RAW_KHELO_ACADEMIES.slice(0, 20);
export const DEFAULT_BATCH_2_ACADEMIES = RAW_KHELO_ACADEMIES.slice(20, 40);
export const DEFAULT_BATCH_3_ACADEMIES = RAW_KHELO_ACADEMIES.slice(40, 60);
export const DEFAULT_BATCH_4_ACADEMIES = RAW_KHELO_ACADEMIES.slice(60, 80);
export const DEFAULT_BATCH_5_ACADEMIES = RAW_KHELO_ACADEMIES.slice(80, 100);
export const DEFAULT_BATCH_6_ACADEMIES = RAW_KHELO_ACADEMIES.slice(100, 120);
export const DEFAULT_BATCH_7_ACADEMIES = RAW_KHELO_ACADEMIES.slice(120, 140);
export const DEFAULT_BATCH_8_ACADEMIES = RAW_KHELO_ACADEMIES.slice(140, 160);
export const DEFAULT_BATCH_9_ACADEMIES = RAW_KHELO_ACADEMIES.slice(160, 180);
export const DEFAULT_BATCH_10_ACADEMIES = RAW_KHELO_ACADEMIES.slice(180, 200);
export const DEFAULT_BATCH_11_ACADEMIES = RAW_KHELO_ACADEMIES.slice(200, 220);
export const DEFAULT_BATCH_12_ACADEMIES = RAW_KHELO_ACADEMIES.slice(220, 240);
export const DEFAULT_BATCH_13_ACADEMIES = RAW_KHELO_ACADEMIES.slice(240);

export type BatchFilterType =
  | "all"
  | "batch1"
  | "batch2"
  | "batch3"
  | "batch4"
  | "batch5"
  | "batch6"
  | "batch7"
  | "batch8"
  | "batch9"
  | "batch10"
  | "batch11"
  | "batch12"
  | "batch13";

export interface AccreditedAcademyListProps {
  /** Array of academies to render. Defaults to all unique Khelo India academies */
  academies?: CoachingProgram[];
  /** Initial batch view: "all" | "batch1" | "batch2" ... */
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
  title = "Sports Academies Directory",
  subtitle = "Filter academies by sport, city, level and facilities. Details are compiled from public directory records and academy submissions.",
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
    if (selectedBatch === "batch1") return DEFAULT_BATCH_1_ACADEMIES;
    if (selectedBatch === "batch2") return DEFAULT_BATCH_2_ACADEMIES;
    if (selectedBatch === "batch3") return DEFAULT_BATCH_3_ACADEMIES;
    if (selectedBatch === "batch4") return DEFAULT_BATCH_4_ACADEMIES;
    if (selectedBatch === "batch5") return DEFAULT_BATCH_5_ACADEMIES;
    if (selectedBatch === "batch6") return DEFAULT_BATCH_6_ACADEMIES;
    if (selectedBatch === "batch7") return DEFAULT_BATCH_7_ACADEMIES;
    if (selectedBatch === "batch8") return DEFAULT_BATCH_8_ACADEMIES;
    if (selectedBatch === "batch9") return DEFAULT_BATCH_9_ACADEMIES;
    if (selectedBatch === "batch10") return DEFAULT_BATCH_10_ACADEMIES;
    if (selectedBatch === "batch11") return DEFAULT_BATCH_11_ACADEMIES;
    if (selectedBatch === "batch12") return DEFAULT_BATCH_12_ACADEMIES;
    if (selectedBatch === "batch13") return DEFAULT_BATCH_13_ACADEMIES;
    return academies;
  }, [academies, selectedBatch]);

  // Extract unique sports and cities from active pool
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

  const totalCitiesCount = useMemo(() => {
    return new Set(academies.map((a) => a.city)).size;
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

  // Schema.org structured data for SEO crawlers covering unique academies
  const jsonLdSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Sports Academies Directory India",
      description:
        "Independent directory of sports academies in India, including Khelo India accredited academies and SAI centres. Filter by sport, city, facilities and fees.",
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
      `Enquiry submitted for ${enquiringAcademy?.academyName || enquiringAcademy?.title}! Check with the academy directly regarding current trial dates and admission criteria.`,
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
          <title>Sports Academies in India: Khelo India & SAI Listings | KhelGrid</title>
          <meta
            name="description"
            content="Independent directory of sports academies in India, including Khelo India accredited academies and SAI centres. Filter by sport, city, facilities and fees."
          />
          <meta
            name="keywords"
            content="sports academies in india, khelo india accredited academies, sports authority of india, sai ncoe, army sports institute pune, tata archery academy, usha school of athletics, nis patiala, sai sonepat, sai lucknow, sai rohtak, roundglass sports academy, minerva academy fc, gagan narang gun for glory, mrf pace foundation, sai thiruvananthapuram, sai bhopal, inspire institute of sport, iis bellary, chandigarh football academy, bhiwani boxing club, sai aurangabad, sai shilaroo, army rowing node, mohun bagan academy, east bengal academy, bbfs bengaluru, odisha naval tata hockey, sports coaching 2026"
          />
          <meta
            property="og:title"
            content="Sports Academies in India: Khelo India & SAI Listings | KhelGrid"
          />
          <meta
            property="og:description"
            content="Independent directory of sports academies in India, including Khelo India accredited academies and SAI centres. Filter by sport, city, facilities and fees."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${SITE_URL}/academy`} />
          <link rel="canonical" href={`${SITE_URL}/academy`} />
          <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
        </Helmet>
      )}

      {/* 2. SECTION HEADER & METRICS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary font-medium px-2.5 py-0.5 text-xs"
            >
              {academies.length} academies listed · {totalCitiesCount} cities · Source: SAI &amp;
              Khelo India Public Directory · Last updated October 2026
            </Badge>
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
              <span>Browse Batch:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                variant={selectedBatch === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("all")}
                className="h-7.5 px-3 text-xs font-semibold cursor-pointer"
              >
                All Academies ({academies.length})
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch1" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch1")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 1
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch2" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch2")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 2
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch3" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch3")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 3
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch4" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch4")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 4
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch5" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch5")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 5
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch6" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch6")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 6
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch7" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch7")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 7
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch8" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch8")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 8
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch9" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch9")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 9
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch10" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch10")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 10
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch11" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch11")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 11
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch12" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch12")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 12
              </Button>

              <Button
                type="button"
                variant={selectedBatch === "batch13" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedBatch("batch13")}
                className="h-7.5 px-2.5 text-xs font-medium cursor-pointer"
              >
                Batch 13
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
                  placeholder="Search by academy name, city, coach (e.g. Patiala, Sonepat, Mary Kom, RoundGlass)..."
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

                {/* Scholarship Toggle */}
                <Button
                  type="button"
                  variant={scholarshipOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScholarshipOnly(!scholarshipOnly)}
                  className="h-8.5 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Scholarships</span>
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
            Showing {filteredAcademies.length} of {academies.length} academies
          </span>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Compiled from public directory records
          </span>
        </div>

        {filteredAcademies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-semibold text-foreground">
              No academies matched your filters
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              Try selecting "All Sports" or "All Locations" or clearing search terms.
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

      {/* 5. INTERNAL DISCOVERABILITY HUB */}
      <div className="mt-10 rounded-2xl border border-border/80 bg-muted/30 p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span>Explore Related Sports & Regional Hubs</span>
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

      {/* 6. ENQUIRY / DETAILS MODAL */}
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

              <div className="rounded-lg bg-muted/60 border border-border p-2.5 text-[11px] text-muted-foreground flex items-start gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>
                  Fees, intake and scholarships vary by academy and year. Please confirm eligibility
                  and selection trial dates directly with the academy.
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
                  Send Enquiry
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
