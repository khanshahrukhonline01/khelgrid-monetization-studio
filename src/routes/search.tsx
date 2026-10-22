import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Fragment, useMemo, useState, useRef, useEffect, lazy, Suspense } from "react";
import { BannerAd, InFeedAd } from "@/components/ads";
import { TRIALS, SPORTS, CITIES, type Trial } from "@/data/trials";
import { fetchAvailableTrialsFromSupabase } from "@/lib/trials-service";
import { TrialCard } from "@/components/TrialCard";
import { useAuth } from "@/context/AuthContext";
import { isTrialArchived } from "@/lib/opportunity-badge";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";

// Lazy-loaded non-critical modals and calendar to streamline Critical Rendering Path
const TrialDetailsModal = lazy(() =>
  import("@/components/TrialDetailsModal").then((m) => ({ default: m.TrialDetailsModal })),
);
const SportsCalendar = lazy(() =>
  import("@/components/calendar/SportsCalendar").then((m) => ({ default: m.SportsCalendar })),
);
const TrialNewsletterSignup = lazy(() =>
  import("@/components/TrialNewsletterSignup").then((m) => ({ default: m.TrialNewsletterSignup })),
);
const CheckoutModal = lazy(() =>
  import("@/components/CheckoutModal").then((m) => ({ default: m.CheckoutModal })),
);
const BoostModal = lazy(() =>
  import("@/components/BoostModal").then((m) => ({ default: m.BoostModal })),
);
import {
  TrialsSearchFilter,
  REGIONS,
  SPORT_TYPES,
  DATE_RANGE_OPTIONS,
  parseTrialDate,
  type DateRangeOption,
} from "@/components/TrialsSearchFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Search as SearchIcon,
  MapPin,
  Trophy,
  X,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  IndianRupee,
  Check,
  Calendar,
  CalendarDays,
  Users,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Share2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Heart,
  CheckCircle2,
  Award,
  FileText,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { buildSeoHead } from "@/lib/seo";
import { SearchTrialsHelmetSEO } from "@/components/seo/SearchTrialsHelmetSEO";
import { TRIALS_AND_OPPORTUNITIES_FAQS, generateTrialsFaqSchema } from "@/data/trials-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ALL_SPORT = "All Sports";
const ALL_CITY = "All Locations";
const ALL_CATEGORY = "All Categories";

const SORTS = ["Soonest", "Most spots", "Lowest fee", "Highest spots"] as const;
type SortKey = (typeof SORTS)[number];

const CATEGORIES = [
  ALL_CATEGORY,
  "U-14 / Sub-Junior",
  "U-16 / Junior",
  "U-19 / Youth",
  "U-23 / Emerging",
  "Senior Open",
] as const;
type CategoryKey = (typeof CATEGORIES)[number];

const SPORT_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Badminton: "🏸",
  Athletics: "🏃",
  "Kho-Kho": "🏃‍♂️",
  Tennis: "🎾",
  Kabaddi: "🤼",
  Swimming: "🏊",
  Hockey: "🏑",
  "Table Tennis": "🏓",
  "Soft Tennis": "🎾",
  Squash: "🎾",
  Netball: "🤾",
  Volleyball: "🏐",
  Chess: "♟️",
  Shooting: "🎯",
  Archery: "🏹",
  Boxing: "🥊",
  Wrestling: "🤼",
  Pickleball: "🏓",
  Wushu: "🥋",
  Gymnastics: "🤸",
  Handball: "🤾",
  Judo: "🥋",
  Karate: "🥋",
  Taekwondo: "🥋",
  "Water Sports": "🛶",
  Weightlifting: "🏋️",
  Yoga: "🧘",
  Fencing: "🤺",
  Equestrian: "🏇",
  "Multi-Discipline Sports Quota": "🎖️",
};

const CRPF_SPORTS_DISCIPLINES = [
  "Athletics",
  "Swimming",
  "Archery",
  "Badminton",
  "Basketball",
  "Boxing",
  "Football",
  "Gymnastics",
  "Handball",
  "Hockey",
  "Judo",
  "Kabaddi",
  "Karate",
  "Shooting",
  "Taekwondo",
  "Volleyball",
  "Water Sports",
  "Weightlifting",
  "Wushu",
  "Wrestling",
  "Yoga",
] as const;

const POPULAR_SEARCHES = [
  { label: "❤️ My Favorites", savedOnly: true },
  { label: "🎖️ CRPF Sports Quota (521 Posts)", query: "CRPF" },
  { label: "KCA U-14 Kanpur", query: "KCA Kanpur", sport: "Cricket", city: "Kanpur" },
  { label: "🏀 Green Park Basketball", query: "Basketball", sport: "Basketball", city: "Kanpur" },
  { label: "U-19 Cricket", query: "Cricket", sport: "Cricket" },
  { label: "Football Combine", query: "Combine", sport: "Football" },
  { label: "Badminton Hyderabad", query: "Gopichand", city: "Hyderabad" },
  { label: "State Athletics", query: "Athletics", sport: "Athletics" },
  { label: "Free Entry", free: true },
  { label: "Official Trials", officialOnly: true },
];

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sport: fallback(z.string(), ALL_SPORT).default(ALL_SPORT),
  city: fallback(z.string(), ALL_CITY).default(ALL_CITY),
  region: fallback(z.string(), "all").default("all"),
  sportType: fallback(z.string(), "all").default("all"),
  dateRange: fallback(z.string(), "all").default("all"),
  category: fallback(z.string(), ALL_CATEGORY).default(ALL_CATEGORY),
  sort: fallback(z.enum(SORTS), "Soonest").default("Soonest"),
  free: fallback(z.boolean(), false).default(false),
  officialOnly: fallback(z.boolean(), false).default(false),
  savedOnly: fallback(z.boolean(), false).default(false),
  view: fallback(z.enum(["grid", "list", "calendar"]), "grid").default("grid"),
  trialId: fallback(z.string(), "").default(""),
  archive: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: ({ search }) => {
    const sSport = search?.sport && search.sport !== ALL_SPORT ? search.sport : "";
    const sCity = search?.city && search.city !== ALL_CITY ? search.city : "";
    const sQ = search?.q ? `"${search.q}"` : "";
    const isCrpf =
      (search?.q && search.q.toLowerCase().includes("crpf")) ||
      (search?.trialId && search.trialId.toLowerCase().includes("crpf"));

    let pageTitle = "Search Trials and Opportunities in India · KhelGrid";
    let metaDesc =
      "Filter and discover sports selection trials, tournaments, recruitment drives, coaching camps, and academy opportunities across India by sport, age group, and city.";

    if (search?.archive) {
      pageTitle = "Archived Sports Trials & Past Selection Opportunities in India · KhelGrid";
      metaDesc = "Browse past sports selection trials and completed opportunities across India. Listings are retained for reference; check official sources for results, updated dates, or the next edition.";
    } else if (isCrpf) {
      pageTitle =
        "CRPF Meritorious Sportspersons Recruitment 2026 (521 Posts) · Official Apply · KhelGrid";
      metaDesc =
        "Official Central Reserve Police Force (CRPF) Sports Quota Recruitment 2026 for 521 Head Constable & Constable (GD) posts across 22 sports disciplines. Apply online at rect.crpf.gov.in.";
    } else if (sSport && sCity) {
      pageTitle = `${sSport} Trials and Opportunities in ${sCity} (2026) · KhelGrid`;
      metaDesc = `Discover verified ${sSport} selection trials, recruitment drives, academy combines, and state tournaments in ${sCity}. Check venue details, age eligibility, and registration dates on KhelGrid.`;
    } else if (sSport) {
      pageTitle = `${sSport} Trials and Opportunities Across India (2026) · KhelGrid`;
      metaDesc = `Find upcoming ${sSport} selection trials, junior state camps, club academy trials, and sports quota recruitments across India. Verified dates, eligibility criteria, and open spots on KhelGrid.`;
    } else if (sCity) {
      pageTitle = `Sports Selection Trials and Opportunities in ${sCity} (2026) · KhelGrid`;
      metaDesc = `Browse open sports selection trials, recruitment drives, tournaments, and coaching combines in ${sCity} across Athletics, Cricket, Football, Badminton, and more.`;
    } else if (sQ) {
      pageTitle = `Search Results for ${sQ} · Sports Trials and Opportunities on KhelGrid`;
    }

    const searchUrl = "https://www.khelgrid.com/search";
    const structuredData: Array<Record<string, unknown>> = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "KhelGrid Sports Trials and Opportunities Portal",
        url: searchUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${searchUrl}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.khelgrid.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Search Trials and Opportunities",
            item: searchUrl,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "CRPF Meritorious Sportspersons Recruitment 2026 (Head Constable & Constable GD)",
        description:
          "Central Reserve Police Force invites online applications from eligible meritorious Indian sportspersons for 182 Head Constable (GD) and 339 Constable (GD) posts across 22 sports disciplines under Sports Quota 2026.",
        datePosted: "2026-10-12",
        validThrough: "2026-11-11T23:59:59+05:30",
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "GovernmentOrganization",
          name: "Central Reserve Police Force (CRPF) & Ministry of Home Affairs",
          sameAs: "https://rect.crpf.gov.in",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            addressRegion: "Pan-India",
          },
        },
        totalJobOpenings: 521,
        directApply: true,
        url: "https://rect.crpf.gov.in",
      },
      generateTrialsFaqSchema(),
    ];

    const faqSchema = generateTrialsFaqSchema();

    return buildSeoHead({
      title: pageTitle,
      description: metaDesc,
      canonicalPath: search?.archive ? "/search?archive=true" : "/search",
      noindex: false,
      keywords: `${sSport ? sSport + " trials, " : ""}CRPF recruitment 2026, CRPF meritorious sportspersons recruitment 2026, rect.crpf.gov.in apply online, sports trials India, sports opportunities, sports quota 2026, cricket selection trials, football academy combine, athletics trials, badminton state selections, open sports trials 2026`,
      type: "website",
      customSchema: structuredData,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqSchema),
        },
      ],
    });
  },
  component: SearchPage,
});

function SearchPage() {
  const auth = useAuth();
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { savedIds: rawSavedIds = [], toggleSaved } = useSavedOpportunities();
  const savedIds = useMemo(() => (Array.isArray(rawSavedIds) ? rawSavedIds : []), [rawSavedIds]);
  const [checkout, setCheckout] = useState<Trial | null>(null);
  const [boost, setBoost] = useState<Trial | null>(null);
  const [detailsTrial, setDetailsTrial] = useState<Trial | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [trialsList, setTrialsList] = useState<Trial[]>(TRIALS);

  useEffect(() => {
    let isMounted = true;
    fetchAvailableTrialsFromSupabase().then((res) => {
      if (isMounted && res.isSupabaseLive && res.trials.length > 0) {
        const map = new Map<string, Trial>();
        TRIALS.forEach((t) => map.set(t.id, t));
        res.trials.forEach((t) => {
          map.set(t.id, t as unknown as Trial);
        });
        setTrialsList(Array.from(map.values()));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const crpfTrial = useMemo(
    () =>
      trialsList.find((t) => t.id === "t-crpf-meritorious-sportspersons-recruitment-2026") || null,
    [trialsList],
  );

  // Auto-scroll directly to CRPF notification card or search results when targeted from home page or URL
  useEffect(() => {
    const isCrpfTarget =
      params.q.toLowerCase().includes("crpf") ||
      params.trialId?.toLowerCase().includes("crpf") ||
      (typeof window !== "undefined" && window.location.hash.includes("crpf"));

    if (isCrpfTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById("crpf-recruitment-notification-card");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("ring-2", "ring-emerald-500", "ring-offset-2");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-emerald-500", "ring-offset-2");
          }, 2400);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (params.trialId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`trial-card-${params.trialId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-primary", "ring-offset-2");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-primary", "ring-offset-2");
          }, 2400);
        }
        const targetedTrial = trialsList.find((t) => t.id === params.trialId);
        if (targetedTrial) {
          setDetailsTrial(targetedTrial);
        }
      }, 150);
      return () => clearTimeout(timer);
    } else if (params.q || (params.sport && params.sport !== ALL_SPORT)) {
      const timer = setTimeout(() => {
        const resultsEl = document.getElementById("trials-results-section");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [params.q, params.sport, params.trialId, trialsList]);

  const update = (patch: Partial<typeof params>) =>
    navigate({ search: (prev: typeof params) => ({ ...prev, ...patch }), replace: true });

  // Count trials per sport for badges
  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_SPORT]: trialsList.length };
    for (const s of SPORTS) counts[s] = 0;
    for (const t of trialsList) {
      if (t.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
        for (const cs of CRPF_SPORTS_DISCIPLINES) {
          if (counts[cs] !== undefined) counts[cs]++;
        }
      } else {
        if (counts[t.sport] !== undefined) counts[t.sport]++;
        else counts[t.sport] = 1;
      }
    }
    return counts;
  }, [trialsList]);

  // Filtered and sorted results
  const results = useMemo(() => {
    const q = params.q.trim().toLowerCase();
    let list = trialsList.filter((t) => {
      // Keep the main discovery feed current. Completed dated opportunities are
      // available through the explicit archive toggle instead of cluttering results.
      const archived = isTrialArchived(t);
      if (params.archive ? !archived : archived) return false;

      if (params.sport !== ALL_SPORT) {
        if (t.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
          const matchesDiscipline =
            t.sport.toLowerCase() === params.sport.toLowerCase() ||
            CRPF_SPORTS_DISCIPLINES.some((d) => d.toLowerCase() === params.sport.toLowerCase());
          if (!matchesDiscipline) return false;
        } else if (t.sport !== params.sport) {
          return false;
        }
      }
      if (params.city !== ALL_CITY) {
        if (t.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
          if (params.city !== "Delhi") return false;
        } else if (t.city !== params.city) {
          return false;
        }
      }
      if (params.free && t.fee > 0 && t.id !== "t-crpf-meritorious-sportspersons-recruitment-2026")
        return false;
      if (
        params.officialOnly &&
        !t.tag.toLowerCase().includes("official") &&
        !t.tag.toLowerCase().includes("govt") &&
        !(t.verifiedLabel && t.verifiedLabel.toLowerCase().includes("official"))
      )
        return false;
      if (params.savedOnly && !savedIds.includes(t.id)) return false;

      // Region Filter
      if (params.region && params.region !== "all") {
        const reg = REGIONS.find((r) => r.id === params.region);
        if (reg && reg.cities.length > 0) {
          const matchCity = reg.cities.some((c) => t.city.toLowerCase().includes(c.toLowerCase()));
          if (!matchCity) return false;
        }
      }

      // Sport Type Filter
      if (params.sportType && params.sportType !== "all") {
        const st = SPORT_TYPES.find((s) => s.id === params.sportType);
        if (st && st.sports.length > 0) {
          const matchSport = st.sports.some((s) => s.toLowerCase() === t.sport.toLowerCase());
          if (!matchSport) return false;
        }
      }

      // Upcoming Dates Filter
      if (params.dateRange && params.dateRange !== "all") {
        const trialDate = parseTrialDate(t.date);
        const regDeadline = t.registrationDeadline
          ? parseTrialDate(t.registrationDeadline)
          : trialDate;
        const targetDate = trialDate || regDeadline;

        if (targetDate) {
          const now = new Date("2026-09-29T21:00:00Z");
          const diffMs = targetDate.getTime() - now.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          const diffDays = diffHours / 24;

          if (params.dateRange === "closing_soon") {
            const hasClosingBadge =
              t.badge === "Closing Soon" ||
              (t.urgencyText && t.urgencyText.toLowerCase().includes("closing"));
            if (!hasClosingBadge && (diffHours < 0 || diffHours > 48)) return false;
          } else if (params.dateRange === "this_week") {
            if (diffDays < 0 || diffDays > 7) return false;
          } else if (params.dateRange === "this_month") {
            if (diffDays < 0 || diffDays > 30) return false;
          } else if (params.dateRange === "next_quarter") {
            if (diffDays < 0 || diffDays > 90) return false;
          } else if (params.dateRange === "sep_2026") {
            if (targetDate.getMonth() !== 8 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "oct_2026") {
            if (targetDate.getMonth() !== 9 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "nov_2026") {
            if (targetDate.getMonth() !== 10 || targetDate.getFullYear() !== 2026) return false;
          } else if (params.dateRange === "dec_2026") {
            if (targetDate.getMonth() !== 11 || targetDate.getFullYear() !== 2026) return false;
          }
        }
      }

      // Category filter matching
      if (params.category !== ALL_CATEGORY) {
        const catStr = params.category.toLowerCase();
        const trialText = `${t.title} ${t.tag} ${t.eligibility || ""}`.toLowerCase();
        if (
          catStr.includes("u-14") &&
          !trialText.includes("u-14") &&
          !trialText.includes("sub-junior")
        )
          return false;
        if (catStr.includes("u-16") && !trialText.includes("u-16") && !trialText.includes("junior"))
          return false;
        if (catStr.includes("u-19") && !trialText.includes("u-19") && !trialText.includes("youth"))
          return false;
        if (
          catStr.includes("u-23") &&
          !trialText.includes("u-23") &&
          !trialText.includes("emerging")
        )
          return false;
        if (
          catStr.includes("senior") &&
          !trialText.includes("senior") &&
          !trialText.includes("open")
        )
          return false;
      }

      // Free-text query across multiple metadata fields
      if (
        q &&
        !`${t.title} ${t.academy} ${t.sport} ${t.city} ${t.tag} ${t.venue || ""} ${t.eligibility || ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });

    const dateKey = (t: Trial) => new Date(t.date).getTime();
    if (params.sort === "Soonest") list = [...list].sort((a, b) => dateKey(a) - dateKey(b));
    else if (params.sort === "Most spots") list = [...list].sort((a, b) => b.spots - a.spots);
    else if (params.sort === "Highest spots") list = [...list].sort((a, b) => b.spots - a.spots);
    else if (params.sort === "Lowest fee") list = [...list].sort((a, b) => a.fee - b.fee);

    const boosted = list.filter((t) => auth.boostedTrials.includes(t.id));
    const regular = list.filter((t) => !auth.boostedTrials.includes(t.id));
    return { boosted, regular, total: list.length, all: list };
  }, [params, auth.boostedTrials, savedIds, trialsList]);

  const handleApply = (trial: Trial) => {
    if (trial.id === "t-national-cricket-club-mumbai-talent-hunt-2026") {
      window.open(
        "https://www.tribuneindia.com/news/sports/mumbais-national-cricket-club-announces-talent-hunt-for-players-between-16-23-years-of-age/",
        "_blank",
        "noopener,noreferrer",
      );
      toast.info("Opening the published NCC Mumbai talent-hunt report. Confirm any missing logistics with the organizer before travelling.");
      return;
    }
    if (trial.id === "t-sai-ncoe-aurangabad-women-boxing-trials-2026") {
      window.open(
        "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg",
        "_blank",
        "noopener,noreferrer",
      );
      toast.success(
        "Opening official SAI NCOE selection trials notice (sportsauthorityofindia.nic.in)!",
      );
      return;
    }
    if (trial.id === "t-jk-kho-kho-junior-national-trials-2026") {
      window.open(
        "https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/",
        "_blank",
        "noopener,noreferrer",
      );
      toast.success(
        "Opening official J&K Kho-Kho Association trials notification on Daily Excelsior!",
      );
      return;
    }
    if (trial.id === "t-bcci-arunachal-pradesh-ranji-trials-2026") {
      window.open("https://www.bcci.tv/domestic", "_blank", "noopener,noreferrer");
      toast.success(
        "Opening official BCCI Domestic Portal (bcci.tv) for Arunachal Pradesh Ranji Trials!",
      );
      return;
    }
    if (trial.id === "t-khel-maharan-3-assam-2026") {
      window.open("https://khelmaharan.com/khel", "_blank", "noopener,noreferrer");
      toast.success(
        "Opening official Khel Maharan 3.0 registration portal (khelmaharan.com/khel)!",
      );
      return;
    }
    if (trial.id === "t-ddca-delhi-womens-u15-cricket-2026") {
      window.open("https://ddca.in", "_blank", "noopener,noreferrer");
      toast.success("Opening official DDCA portal (ddca.in) for Women's U-15 Open Trials!");
      return;
    }
    if (trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026") {
      window.open("https://rect.crpf.gov.in", "_blank", "noopener,noreferrer");
      toast.success("Opening official CRPF portal (rect.crpf.gov.in) to Apply!");
      return;
    }
    if (auth.applications.includes(trial.id)) return;
    if (auth.canApply(trial.id)) {
      auth.applyToTrial(trial.id);
      toast.success(`Applied to ${trial.title}`);
      return;
    }
    setCheckout(trial);
  };

  const showBoostAction = auth.role === "organizer";

  // Active filter indicators
  const activePills: { key: string; label: string; icon: React.ReactNode; onClear: () => void }[] =
    [];
  if (params.q)
    activePills.push({
      key: "q",
      label: `"${params.q}"`,
      icon: <SearchIcon className="h-3 w-3" />,
      onClear: () => update({ q: "" }),
    });
  if (params.savedOnly)
    activePills.push({
      key: "savedOnly",
      label: `Favorites (${savedIds.length})`,
      icon: <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />,
      onClear: () => update({ savedOnly: false }),
    });
  if (params.sport !== ALL_SPORT)
    activePills.push({
      key: "sport",
      label: params.sport,
      icon: <Trophy className="h-3 w-3" />,
      onClear: () => update({ sport: ALL_SPORT }),
    });
  if (params.city !== ALL_CITY)
    activePills.push({
      key: "city",
      label: params.city,
      icon: <MapPin className="h-3 w-3" />,
      onClear: () => update({ city: ALL_CITY }),
    });
  if (params.region && params.region !== "all") {
    const reg = REGIONS.find((r) => r.id === params.region);
    if (reg) {
      activePills.push({
        key: "region",
        label: `Region: ${reg.name}`,
        icon: <MapPin className="h-3 w-3" />,
        onClear: () => update({ region: "all" }),
      });
    }
  }
  if (params.sportType && params.sportType !== "all") {
    const st = SPORT_TYPES.find((s) => s.id === params.sportType);
    if (st) {
      activePills.push({
        key: "sportType",
        label: `Type: ${st.name}`,
        icon: <Trophy className="h-3 w-3" />,
        onClear: () => update({ sportType: "all" }),
      });
    }
  }
  if (params.dateRange && params.dateRange !== "all") {
    const dOpt = DATE_RANGE_OPTIONS.find((d) => d.id === params.dateRange);
    if (dOpt) {
      activePills.push({
        key: "dateRange",
        label: `Date: ${dOpt.label}`,
        icon: <Calendar className="h-3 w-3" />,
        onClear: () => update({ dateRange: "all" }),
      });
    }
  }
  if (params.category !== ALL_CATEGORY)
    activePills.push({
      key: "category",
      label: params.category,
      icon: <Award className="h-3 w-3" />,
      onClear: () => update({ category: ALL_CATEGORY }),
    });
  if (params.free)
    activePills.push({
      key: "free",
      label: "Free Entry (₹0)",
      icon: <IndianRupee className="h-3 w-3" />,
      onClear: () => update({ free: false }),
    });
  if (params.officialOnly)
    activePills.push({
      key: "officialOnly",
      label: "Official Verified",
      icon: <ShieldCheck className="h-3 w-3" />,
      onClear: () => update({ officialOnly: false }),
    });
  if (params.sort !== "Soonest")
    activePills.push({
      key: "sort",
      label: `Sort: ${params.sort}`,
      icon: <ArrowUpDown className="h-3 w-3" />,
      onClear: () => update({ sort: "Soonest" }),
    });

  const clearAll = () =>
    navigate({
      search: {
        q: "",
        sport: ALL_SPORT,
        city: ALL_CITY,
        region: "all",
        sportType: "all",
        dateRange: "all",
        category: ALL_CATEGORY,
        sort: "Soonest",
        free: false,
        officialOnly: false,
        savedOnly: false,
        view: params.view,
      },
      replace: true,
    });

  const handleShareSearch = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Filtered search link copied to clipboard!");
    }
  };

  return (
    <main
      id="search-trials-page"
      className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 w-full min-w-0 max-w-full overflow-x-hidden"
    >
      {/* Standardized SEO Meta-Tag Manager using react-helmet-async */}
      <SearchTrialsHelmetSEO
        query={params.q}
        sport={params.sport}
        city={params.city}
        sort={params.sort}
        free={params.free}
        trialId={params.trialId}
        savedOnly={params.savedOnly}
        archive={params.archive}
        totalResults={results.total}
        featuredTrial={crpfTrial}
      />

      {/* Sleek Compact Header (No wasted vertical space) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5 w-full min-w-0 max-w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
            {params.archive ? "Archived Sports Trials & Opportunities" : "Search Trials and Opportunities"}
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified</span>
          </span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            ({results.total} trials &amp; opportunities available)
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant={params.archive ? "default" : "outline"}
            size="sm"
            onClick={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  archive: !params.archive,
                  dateRange: "all",
                }),
              })
            }
            className="h-8 gap-1.5 text-xs font-medium"
            aria-label={params.archive ? "Show current and upcoming trials" : "View archived trials"}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{params.archive ? "Upcoming" : "Archive"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShareSearch}
            className="h-8 gap-1.5 text-xs font-medium border-border cursor-pointer"
            title="Share this search"
          >
            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Share</span>
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

      {params.archive && (
        <div className="mt-3 rounded-xl border border-border/70 bg-muted/35 px-3.5 py-3 text-sm text-muted-foreground">
          <strong className="text-foreground">Past events archive.</strong> These listings are kept for reference. Registration may be closed; check the source notice for official results or future editions.
        </div>
      )}

      {/* Main Responsive Grid Layout: Filter Sidebar (Desktop) + Results Content */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12 items-start w-full min-w-0 max-w-full">
        {/* DESKTOP FILTER SIDEBAR (Visible on lg >= 1024px) */}
        <aside
          id="desktop-filter-sidebar"
          className="hidden lg:block lg:col-span-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-6 sticky top-20"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Refine Trials</span>
            </div>
            {activePills.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Favorites / Saved Trials Filter Card */}
          <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Heart
                  className={`h-3.5 w-3.5 ${
                    savedIds.length > 0 ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                  }`}
                />
                <span>Saved Favorites</span>
              </div>
              <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                {savedIds.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => update({ savedOnly: !params.savedOnly })}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                params.savedOnly
                  ? "bg-rose-500 text-white shadow-xs"
                  : "border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${params.savedOnly ? "fill-white" : ""}`} />
              <span>
                {params.savedOnly ? "Show All Trials" : `View Favorites (${savedIds.length})`}
              </span>
            </button>
          </div>

          {/* Filter 1: Location & Region */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Location & Zone</span>
            </label>
            <div className="space-y-2">
              <select
                aria-label="Filter by Geographic Region"
                value={params.region || "all"}
                onChange={(e) => update({ region: e.target.value })}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                aria-label="Filter by City"
                value={params.city}
                onChange={(e) => update({ city: e.target.value })}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {[ALL_CITY, ...CITIES].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 2: Sport Selection */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                <span>Sport</span>
              </span>
              <span className="font-mono text-[11px]">{results.total} Available</span>
            </label>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {[ALL_SPORT, ...SPORTS].map((s) => {
                const count = sportCounts[s] ?? 0;
                const isSelected = params.sport === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => update({ sport: s })}
                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
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

          {/* Filter 3: Age Category */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Age Band</span>
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isSelected = params.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => update({ category: cat })}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 4: Upcoming Dates */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Upcoming Dates</span>
            </label>
            <select
              aria-label="Filter by Upcoming Dates"
              value={params.dateRange || "all"}
              onChange={(e) => update({ dateRange: e.target.value })}
              className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
            >
              {DATE_RANGE_OPTIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter 5: Entry Fee & Federation Verification */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Participation Criteria
            </label>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={params.free}
                  onChange={(e) => update({ free: e.target.checked })}
                  className="rounded border-border accent-primary h-4 w-4"
                />
                <span>Free Entry Only (₹0)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={params.officialOnly}
                  onChange={(e) => update({ officialOnly: e.target.checked })}
                  className="rounded border-border accent-primary h-4 w-4"
                />
                <span>Official Federation Verified</span>
              </label>
            </div>
          </div>

          {/* Filter 6: Sort By */}
          <div className="space-y-2 border-t border-border/60 pt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              <span>Sort Order</span>
            </label>
            <select
              aria-label="Sort order"
              value={params.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* RESULTS & SEARCH WORKSPACE (9 cols on desktop, full width on mobile) */}
        <div className="w-full min-w-0 max-w-full lg:col-span-9 space-y-3">
          {/* Primary Search Bar + Responsive Controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full min-w-0 max-w-full">
            {/* Unified Search Input */}
            <div className="relative flex-1 min-w-0">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="search-trials-input"
                value={params.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search by trial title, academy, venue, sport, or keyword..."
                className="h-10 sm:h-11 w-full rounded-xl border border-border bg-card/70 pl-10 pr-9 text-xs sm:text-sm text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
              />
              {params.q && (
                <button
                  type="button"
                  onClick={() => update({ q: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Bar: Saved Favorites Toggle, View Mode, Mobile Filter Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Quick Saved Favorites Filter Toggle */}
              <Button
                type="button"
                variant={params.savedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => update({ savedOnly: !params.savedOnly })}
                className={`h-10 sm:h-11 gap-1.5 rounded-xl px-2.5 sm:px-3 text-xs font-bold transition-all cursor-pointer ${
                  params.savedOnly
                    ? "bg-rose-500 text-white shadow-xs hover:bg-rose-600"
                    : "border-border bg-card text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                }`}
                title={params.savedOnly ? "Show all selection trials" : "Show My Saved Favorites"}
              >
                <Heart
                  className={`h-3.5 w-3.5 shrink-0 ${params.savedOnly || savedIds.length > 0 ? "fill-current" : ""}`}
                />
                <span className="hidden sm:inline">My Saved Favorites</span>
                <span className="sm:hidden">Saved</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    params.savedOnly ? "bg-white/20 text-white" : "bg-rose-500/15"
                  }`}
                >
                  {savedIds.length}
                </span>
              </Button>

              {/* Desktop View Mode Toggle (Grid vs List) */}
              <div className="hidden sm:flex items-center rounded-xl border border-border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => update({ view: "grid" })}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    params.view === "grid"
                      ? "bg-background text-foreground shadow-sm"
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
                    params.view === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ListIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => update({ view: "calendar" })}
                  title="Calendar View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    params.view === "calendar"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button (Opens Bottom Sheet / Vertical Filter) */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 sm:h-11 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold lg:hidden cursor-pointer"
                    aria-label="Open filter sheet"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span>Filters</span>
                    {activePills.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {activePills.length}
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
                      <span>Filter Selection Trials</span>
                      {activePills.length > 0 && (
                        <button
                          type="button"
                          onClick={clearAll}
                          className="text-xs font-medium text-primary hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-4 space-y-5">
                    {/* Quick Saved Favorites Filter */}
                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-foreground">My Saved Favorites</p>
                          <p className="text-[11px] text-muted-foreground">
                            {savedIds.length} bookmarked favorites
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => update({ savedOnly: !params.savedOnly })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          params.savedOnly
                            ? "bg-rose-500 text-white shadow-xs"
                            : "border border-border bg-card text-foreground hover:bg-secondary"
                        }`}
                      >
                        {params.savedOnly ? "Saved Only ✓" : "View Saved"}
                      </button>
                    </div>

                    {/* Sport Selection (Vertical Filter List) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-primary" /> Sport Selection
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {results.total} trials
                        </span>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {[ALL_SPORT, ...SPORTS].map((s) => {
                          const isSelected = params.sport === s;
                          const count = sportCounts[s] ?? 0;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => update({ sport: s })}
                              className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              }`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                {SPORT_ICONS[s] && <span>{SPORT_ICONS[s]}</span>}
                                <span>{s}</span>
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                                  isSelected
                                    ? "bg-white/20 text-white"
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

                    {/* Location & Region */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" /> Location & Zone
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          aria-label="Filter by Geographic Region (Mobile)"
                          value={params.region || "all"}
                          onChange={(e) => update({ region: e.target.value })}
                          className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                        >
                          {REGIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                        <select
                          aria-label="Filter by City (Mobile)"
                          value={params.city}
                          onChange={(e) => update({ city: e.target.value })}
                          className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                        >
                          {[ALL_CITY, ...CITIES].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Age Category */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Award className="h-3.5 w-3.5 text-primary" /> Age Band
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => update({ category: cat })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                              params.category === cat
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upcoming Dates */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Upcoming Dates
                      </span>
                      <select
                        aria-label="Filter by Upcoming Dates (Mobile)"
                        value={params.dateRange || "all"}
                        onChange={(e) => update({ dateRange: e.target.value })}
                        className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground outline-none"
                      >
                        {DATE_RANGE_OPTIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Criteria toggles */}
                    <div className="space-y-2 pt-1 border-t border-border/60">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground py-1">
                        <input
                          type="checkbox"
                          checked={params.free}
                          onChange={(e) => update({ free: e.target.checked })}
                          className="rounded border-border accent-primary h-4 w-4"
                        />
                        <span>Free Entry Trials Only (₹0)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground py-1">
                        <input
                          type="checkbox"
                          checked={params.officialOnly}
                          onChange={(e) => update({ officialOnly: e.target.checked })}
                          className="rounded border-border accent-primary h-4 w-4"
                        />
                        <span>Official Federation Trials Only</span>
                      </label>
                    </div>

                    {/* Sort */}
                    <div className="border-t border-border/60 pt-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                        Sort By
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SORTS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => update({ sort: s })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                              params.sort === s
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "border border-border bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="mt-6 flex-row gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={clearAll}
                      className="flex-1 text-xs"
                    >
                      Reset All
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setSheetOpen(false)}
                      className="flex-1 text-xs font-bold bg-primary text-primary-foreground"
                    >
                      Show {results.total} Trials
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Popular Search Shortcuts */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground w-full min-w-0">
            <span className="text-[11px] font-semibold text-foreground/80">Trending Searches:</span>
            {POPULAR_SEARCHES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  update({
                    q: item.query || "",
                    sport: item.sport || ALL_SPORT,
                    city: item.city || ALL_CITY,
                    free: item.free ?? false,
                    officialOnly: item.officialOnly ?? false,
                    savedOnly: item.savedOnly ?? false,
                  })
                }
                className="rounded-lg border border-border/70 bg-secondary/30 px-2 py-0.5 text-[11px] hover:border-primary/50 hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators Bar */}
          <div
            id="trials-results-section"
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs w-full min-w-0 max-w-full scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="font-semibold text-foreground">
                {params.savedOnly
                  ? `❤️ ${results.total} Saved ${results.total === 1 ? "Trial" : "Trials"}`
                  : `${results.total} ${results.total === 1 ? "Trial" : "Trials"} Found`}
              </span>

              {activePills.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  {activePills.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={p.onClear}
                      className="group inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      {p.icon}
                      <span>{p.label}</span>
                      <X className="h-3 w-3 opacity-70 group-hover:opacity-100" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>

            <div className="text-[11px] text-muted-foreground hidden sm:block">
              {params.sport !== ALL_SPORT ? params.sport : "All Sports"} in{" "}
              {params.city !== ALL_CITY ? params.city : "India"}
            </div>
          </div>

          {/* CRPF MERITORIOUS SPORTSPERSONS 2026 OFFICIAL RECRUITMENT NOTIFICATION CARD */}
          {(!params.savedOnly ||
            savedIds.includes("t-crpf-meritorious-sportspersons-recruitment-2026")) &&
            (params.sport === ALL_SPORT ||
              CRPF_SPORTS_DISCIPLINES.some((d) => d.toLowerCase() === params.sport.toLowerCase()) ||
              params.q.toLowerCase().includes("crpf") ||
              !params.q) && (
              <section
                id="crpf-recruitment-notification-card"
                className="rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/10 via-card to-background p-4 sm:p-5 md:p-6 shadow-sm space-y-4 w-full min-w-0 scroll-mt-24 transition-all duration-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Official Government Recruitment
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Ministry of Home Affairs (MHA)</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-foreground">521 Vacancies</span>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      CRPF Meritorious Sportspersons Recruitment 2026
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Central Reserve Police Force invites online applications from eligible
                      meritorious Indian sportspersons for <strong>182 Head Constable (GD)</strong>{" "}
                      and <strong>339 Constable (GD)</strong> posts across 22 sports disciplines
                      under Sports Quota 2026.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Applications Open
                    </span>
                    {crpfTrial && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toggleSaved(crpfTrial.id);
                          if (!savedIds.includes(crpfTrial.id)) {
                            toast.success("Saved CRPF Recruitment to Favorites! ❤️");
                          } else {
                            toast.info("Removed CRPF Recruitment from Favorites");
                          }
                        }}
                        className={`h-8 gap-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                          savedIds.includes(crpfTrial.id)
                            ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            savedIds.includes(crpfTrial.id) ? "fill-rose-500 text-rose-500" : ""
                          }`}
                        />
                        <span>{savedIds.includes(crpfTrial.id) ? "Saved" : "Save"}</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Key Notification Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                  <div className="rounded-xl border border-border/80 bg-background/70 p-3">
                    <span className="text-[11px] text-muted-foreground block">Total Posts</span>
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      521 Spots
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      182 HC (GD) · 339 CT (GD)
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-background/70 p-3">
                    <span className="text-[11px] text-muted-foreground block">
                      Application Dates
                    </span>
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      Oct 12 – Nov 11, 2026
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      Edit Window: Nov 12–14, 2026
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-background/70 p-3">
                    <span className="text-[11px] text-muted-foreground block">Age Eligibility</span>
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      18 – 23 Years
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      As on 01/08/2026 (Relaxable)
                    </span>
                  </div>

                  <div className="rounded-xl border border-border/80 bg-background/70 p-3">
                    <span className="text-[11px] text-muted-foreground block">Application Fee</span>
                    <span className="font-bold text-foreground text-sm sm:text-base">
                      ₹100 / ₹0
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      ₹0 for SC, ST &amp; All Female
                    </span>
                  </div>
                </div>

                {/* 22 Disciplines Strip */}
                <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    22 Eligible Sports Disciplines Mentioned in Notification:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {CRPF_SPORTS_DISCIPLINES.map((sport) => (
                      <span
                        key={sport}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground"
                      >
                        <span>{SPORT_ICONS[sport] || "🏆"}</span>
                        <span>{sport}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    id="crpf-apply-online-button"
                    href="https://rect.crpf.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer ring-2 ring-emerald-500/20 active:scale-95"
                  >
                    <span>Apply Online on rect.crpf.gov.in (Official Website)</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  <a
                    href="https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>View Official Notification PDF</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>

                  {crpfTrial && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailsTrial(crpfTrial)}
                      className="h-9 text-xs text-primary hover:underline cursor-pointer"
                    >
                      <span>View Full PST &amp; Selection Criteria →</span>
                    </Button>
                  )}
                </div>
              </section>
            )}

          {/* FEATURED / BOOSTED TRIALS */}
          {results.boosted.length > 0 && (
            <section className="space-y-3 pt-2 w-full min-w-0 max-w-full">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Flame className="h-4 w-4" />
                <span>Featured Recruitment Combines</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0 max-w-full">
                {results.boosted.map((t) => (
                  <TrialCard
                    key={t.id}
                    trial={t}
                    boosted
                    onApply={() => handleApply(t)}
                    onBoost={() => setBoost(t)}
                    showBoostAction={showBoostAction}
                  />
                ))}
              </div>
            </section>
          )}

          {/* REGULAR TRIALS GRID OR COMPACT LIST */}
          <section className="space-y-4 pt-2 w-full min-w-0 max-w-full">
            {results.regular.length === 0 && results.boosted.length === 0 ? (
              params.savedOnly ? (
                /* DEDICATED EMPTY STATE FOR SAVED FAVORITES */
                <div className="rounded-2xl border border-dashed border-rose-500/40 bg-rose-500/5 p-8 sm:p-12 text-center space-y-4 w-full">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                    <Heart className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      No Saved Trials Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Tap the <strong>Save</strong> or <strong>Heart (❤️)</strong> button on any
                      selection trial card to bookmark your favorite combines and review them here
                      in your personalized list.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      type="button"
                      onClick={() => update({ savedOnly: false })}
                      className="gap-2 text-xs bg-primary text-primary-foreground font-semibold cursor-pointer"
                    >
                      <Trophy className="h-3.5 w-3.5" /> Browse All Selection Trials
                    </Button>
                  </div>
                </div>
              ) : (
                /* GENERAL EMPTY STATE WITH HELPFUL NEXT STEPS */
                <div className="rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center space-y-4 w-full">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <SearchIcon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                      No Trials Found Matching Filters
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                      We couldn&apos;t find open selection trials matching your current combination
                      of filters. Try expanding your search criteria or resetting filters.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                      className="gap-1.5 text-xs cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => update({ sport: ALL_SPORT, city: ALL_CITY, savedOnly: false })}
                      className="gap-1.5 text-xs bg-primary text-primary-foreground cursor-pointer"
                    >
                      View All Sports & Locations
                    </Button>
                  </div>
                </div>
              )
            ) : params.view === "calendar" ? (
              /* CENTRALIZED SPORTS CALENDAR VIEW */
              <div className="w-full">
                <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-muted/20 animate-pulse" />}>
                  <SportsCalendar
                    initialTrials={results.trials}
                    onSelectTrial={(t) => handleApply(t)}
                  />
                </Suspense>
              </div>
            ) : params.view === "list" ? (
              /* COMPACT LIST VIEW */
              <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm w-full min-w-0 max-w-full">
                <div className="divide-y divide-border/60">
                  {results.regular.map((t, idx) => (
                    <div
                      key={t.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            {t.sport}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {t.date}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {t.city}
                          </span>
                          {t.tag === "Official" && (
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ✓ Official
                            </span>
                          )}
                        </div>

                        <Link
                          to="/trial/$id"
                          params={{ id: t.id }}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {t.title}
                        </Link>

                        <div className="text-xs text-muted-foreground flex items-center gap-3">
                          <span>{t.academy}</span>
                          <span>·</span>
                          <span>{t.spots} spots remaining</span>
                          <span>·</span>
                          <span className="font-semibold text-foreground">
                            {t.fee === 0 ? "Free Entry" : `₹${t.fee}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs border-border"
                        >
                          <Link to="/trial/$id" params={{ id: t.id }}>
                            Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApply(t)}
                          disabled={auth.applications.includes(t.id)}
                          className={`h-8 text-xs font-semibold ${
                            auth.applications.includes(t.id)
                              ? "bg-secondary text-muted-foreground"
                              : "bg-primary text-primary-foreground shadow-sm"
                          }`}
                        >
                          {auth.applications.includes(t.id) ? "Applied ✓" : "Register"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 w-full min-w-0 max-w-full">
                {results.regular.map((t, i) => (
                  <Fragment key={t.id}>
                    <TrialCard
                      trial={t}
                      onApply={() => handleApply(t)}
                      onBoost={() => setBoost(t)}
                      showBoostAction={showBoostAction}
                    />
                    {i > 0 && (i + 1) % 6 === 0 && (
                      <InFeedAd adSlot="searchInline" minHeight={250} />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </section>

          {/* Ad Slot */}
          <div className="pt-4">
            <BannerAd adSlot="listingInline" minHeight={100} />
          </div>

          {/* Automatic Trial Alerts Newsletter Subscription */}
          <section className="mt-8" aria-label="Subscribe to Trial Alerts">
            <Suspense fallback={<div className="h-40 w-full rounded-2xl bg-muted/20 animate-pulse" />}>
              <TrialNewsletterSignup
                defaultSport={params.sport}
                defaultCity={params.city}
                title={`Get Instant Notifications for ${
                  params.sport !== ALL_SPORT ? params.sport : "Sports"
                } Trials${params.city !== ALL_CITY ? ` in ${params.city}` : ""}`}
                subtitle="Never miss an upcoming selection camp or registration deadline. Set your email alert to receive new trial notifications automatically."
              />
            </Suspense>
          </section>

          {/* SEO Structured Content & FAQ Section */}
          <section className="mt-10 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-border/60 pb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                About Sports Selection Trials on KhelGrid
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                KhelGrid aggregates and independently verifies competitive sporting trials across
                India. Athletes can discover certified state association trials, national federation
                combines, and private academy talent hunts for junior, youth, and senior age
                divisions.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Verified Trial Criteria
                </div>
                <p className="leading-relaxed">
                  Every listed selection trial includes confirmed dates, age cutoffs (e.g. U-16,
                  U-19), selection committees, and transparent entry criteria.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  Direct Scout Access
                </div>
                <p className="leading-relaxed">
                  Recruiters and state talent identification scouts review applied candidate
                  profiles and verified performance telemetry directly on KhelGrid.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Instant Digital Sports CV
                </div>
                <p className="leading-relaxed">
                  Link your certified trial achievements, speed benchmarks, and match footage
                  directly to your Sports CV for verified scouting.
                </p>
              </div>
            </div>

            {/* Interactive FAQs for Athletes & Parents */}
            <div id="trials-opportunities-faq" className="pt-6 border-t border-border/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions · Trials &amp; Opportunities
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Essential answers to guide your trials selection, age eligibility, quota
                    recruitments, and academy combines
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="w-fit text-[11px] font-semibold text-primary border-primary/30"
                >
                  {TRIALS_AND_OPPORTUNITIES_FAQS.length} Verified Answers
                </Badge>
              </div>

              <Accordion type="single" collapsible className="w-full space-y-2.5">
                {TRIALS_AND_OPPORTUNITIES_FAQS.map((faq, idx) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border/70 rounded-xl px-4 py-1 bg-secondary/15 hover:bg-secondary/30 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-semibold text-xs sm:text-sm hover:no-underline py-3 cursor-pointer">
                      <span className="flex items-center gap-2.5">
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-3 pl-7">
                      <p>{faq.answer}</p>
                      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Category:</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-foreground/70 font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>
      </div>

      <Suspense fallback={null}>
        {checkout && (
          <CheckoutModal
            open={!!checkout}
            onOpenChange={(o) => !o && setCheckout(null)}
            trialId={checkout.id}
            trialTitle={checkout.title}
            onPaid={() => auth.applyToTrial(checkout.id)}
          />
        )}
        {boost && (
          <BoostModal
            open={!!boost}
            onOpenChange={(o) => !o && setBoost(null)}
            trialId={boost.id}
            trialTitle={boost.title}
          />
        )}
        {detailsTrial && (
          <TrialDetailsModal
            trial={detailsTrial}
            isOpen={!!detailsTrial}
            onClose={() => setDetailsTrial(null)}
            onRegister={() => handleApply(detailsTrial)}
          />
        )}
      </Suspense>
    </main>
  );
}

export default SearchPage;
