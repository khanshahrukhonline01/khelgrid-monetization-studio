import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { SPORTS_NEWS_CATALOG, type SportsNewsArticle } from "@/data/news";
import { LIVE_SPORTS_UPDATES } from "@/data/liveSports";
import {
  Newspaper,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  Share2,
  Bookmark,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Radio,
  Calendar,
  ShieldCheck,
  Activity,
  ExternalLink,
  Building2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getChronicleCardImage } from "@/data/card-images";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { MatchStatisticsCharts } from "@/components/blog/MatchStatisticsCharts";
import { IndiaJapanSocialFeed } from "@/components/blog/IndiaJapanSocialFeed";
import { AsianGamesAnalytics } from "@/components/blog/AsianGamesAnalytics";
import { MatchOutcomePredictor } from "@/components/blog/MatchOutcomePredictor";

const SPORT_TABS_CONFIG = [
  { id: "All Sports", label: "All", fullLabel: "All Sports", key: "allSports", fallback: "All" },
  {
    id: "Wrestling",
    label: "Wrestling",
    fullLabel: "Wrestling",
    key: "wrestling",
    fallback: "Wrestling",
  },
  { id: "Cricket", label: "Cricket", fullLabel: "Cricket", key: "cricket", fallback: "Cricket" },
  {
    id: "Football",
    label: "Football",
    fullLabel: "Football",
    key: "football",
    fallback: "Football",
  },
  { id: "Tennis", label: "Tennis", fullLabel: "Tennis", key: "tennis", fallback: "Tennis" },
  {
    id: "Badminton",
    label: "Badminton",
    fullLabel: "Badminton",
    key: "badminton",
    fallback: "Badminton",
  },
  {
    id: "Athletics",
    label: "Athletics",
    fullLabel: "Athletics",
    key: "athletics",
    fallback: "Athletics",
  },
  {
    id: "Asian Games",
    label: "Asian Games",
    fullLabel: "Asian Games",
    key: "asianGames",
    fallback: "Asian Games",
  },
  {
    id: "Grassroots",
    label: "Grassroots",
    fullLabel: "Grassroots",
    key: "grassroots",
    fallback: "Grassroots",
  },
] as const;

const SAVED_NEWS_STORAGE_KEY = "khelgrid-saved-news-v1";

const OFFICIAL_SELECTION_CIRCULARS = [
  {
    id: "circ-1",
    authority: "SAI NCOE",
    title: "Men Wrestlers Induction Selection Trials at Kandivali Campus",
    date: "Sep 2026",
    tag: "Official Trial",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    link: "/trials?sport=wrestling",
  },
  {
    id: "circ-2",
    authority: "Fit India Mission",
    title:
      "School Games District Selection Cum Competitions Active in Namchi & State Zonal Centers",
    date: "Sep-Oct 2026",
    tag: "Govt Scheme",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    link: "/trials?category=government",
  },
  {
    id: "circ-3",
    authority: "Khelo India",
    title: "State Youth Games Talent Identification Guidelines & District Quotas Published",
    date: "2026 Season",
    tag: "Federation Circular",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    link: "/guides",
  },
  {
    id: "circ-4",
    authority: "KhelGrid Trust",
    title:
      "Anti-Scam Alert: Zero Unofficial Registration Fees — Verify Organizers via Platform Audit",
    date: "Active Advisory",
    tag: "Scout Advisory",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    link: "/trust-center",
  },
  {
    id: "circ-5",
    authority: "BCCI / DDCA",
    title: "State Youth Championship & U-19 Selection Combine Rosters Released",
    date: "Domestic Season",
    tag: "Cricket Combine",
    badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    link: "/trials?sport=cricket",
  },
] as const;

export interface SportsNewsSectionProps {
  variant?: "full" | "home";
  isHomePage?: boolean;
}

export function SportsNewsSection({
  variant = "full",
  isHomePage = false,
}: SportsNewsSectionProps = {}) {
  const { t } = useLanguage();
  const isHomeMode = variant === "home" || isHomePage;
  const [selectedSportTab, setSelectedSportTab] = useState<string>("All Sports");
  const [readingArticle, setReadingArticle] = useState<SportsNewsArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set());
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [isInlineExpanded, setIsInlineExpanded] = useState<boolean>(false);
  const [activeAnalyticsHub, setActiveAnalyticsHub] = useState<"asiad" | "cricket" | "predictor">(
    "asiad",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("Just now");
  const [mobileViewMode, setMobileViewMode] = useState<"carousel" | "list">("carousel");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const carouselRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const homeScrollRef = useRef<HTMLDivElement>(null);

  const scrollHomeArticles = (direction: "left" | "right") => {
    if (homeScrollRef.current) {
      homeScrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
        behavior: "smooth",
      });
    }
  };

  // Load saved bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_NEWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedArticles(new Set(parsed.filter((id): id is string => typeof id === "string")));
        }
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Sync saved bookmarks to localStorage
  const persistSavedArticles = (nextSet: Set<string>) => {
    try {
      localStorage.setItem(SAVED_NEWS_STORAGE_KEY, JSON.stringify(Array.from(nextSet)));
    } catch {
      // ignore
    }
  };

  // Filtered news articles based on sport tab and search query
  const filteredArticles = useMemo(() => {
    let list = SPORTS_NEWS_CATALOG;

    if (selectedSportTab !== "All Sports") {
      list = list.filter((item) => {
        if (selectedSportTab === "Grassroots") {
          return item.category === "Grassroots" || item.sport === "Grassroots";
        }
        if (selectedSportTab === "Asian Games") {
          return (
            item.tags?.some((t) => t.toLowerCase().includes("asian games")) ||
            item.sport === "Multi-Sport" ||
            item.title.toLowerCase().includes("asian games")
          );
        }
        return item.sport.toLowerCase() === selectedSportTab.toLowerCase();
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.sport.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [selectedSportTab, searchQuery]);

  const featuredArticle = useMemo(() => {
    return (
      filteredArticles.find((a) => a.featured) || filteredArticles[0] || SPORTS_NEWS_CATALOG[0]
    );
  }, [filteredArticles]);

  const listArticles = useMemo(() => {
    return filteredArticles.filter((a) => a.id !== featuredArticle?.id).slice(0, 4);
  }, [filteredArticles, featuredArticle]);

  const remainingGridArticles = useMemo(() => {
    const shownIds = new Set([featuredArticle?.id, ...listArticles.map((a) => a.id)]);
    return filteredArticles.filter((a) => !shownIds.has(a.id));
  }, [filteredArticles, featuredArticle, listArticles]);

  // All displayed articles for mobile horizontal movable carousel
  const allCarouselArticles = useMemo(() => {
    if (!featuredArticle) return filteredArticles;
    // Featured first, followed by remaining
    const remaining = filteredArticles.filter((a) => a.id !== featuredArticle.id);
    return [featuredArticle, ...remaining];
  }, [featuredArticle, filteredArticles]);

  // Update carousel scroll state
  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Approximate active slide index
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveSlideIndex(Math.min(index, allCarouselArticles.length - 1));
  }, [allCarouselArticles.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, allCarouselArticles]);

  const scrollCarousel = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-carousel-card]");
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  const handleShare = async (article: SportsNewsArticle) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
    const shareUrl = article.blogSlug
      ? `${origin}/blog/${article.blogSlug}`
      : `${origin}/#news-${article.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.headline} - Follow live sports updates on KhelGrid`,
          url: shareUrl,
        });
        toast.success("Shared successfully");
      } catch {
        // user dismissed dialog
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Article link copied to clipboard!");
    }
  };

  const toggleSave = (id: string) => {
    setSavedArticles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removed from saved reading list");
      } else {
        next.add(id);
        toast.success("Saved to your reading list!");
      }
      persistSavedArticles(next);
      return next;
    });
  };

  const handleRefreshWire = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      toast.success("Real-time sports wire refreshed", {
        description: "Fetched the latest national trials and match dispatches.",
      });
    }, 600);
  };

  // Structured Data (JSON-LD NewsArticle & ItemList) according to Google Search Central specifications
  const newsJsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          "@id": "https://khelgrid.com/#sports-news-wire",
          name: "KhelGrid Real-Time Sports Wire & National News",
          description:
            "Live national sports bulletins, Khelo India updates, Asian Games medal tallies, and high-performance tactical analysis.",
          numberOfItems: SPORTS_NEWS_CATALOG.length,
          itemListElement: SPORTS_NEWS_CATALOG.map((article, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            url: article.blogSlug
              ? `https://khelgrid.com/blog/${article.blogSlug}`
              : `https://khelgrid.com/#news-${article.slug}`,
            name: article.title,
          })),
        },
        ...SPORTS_NEWS_CATALOG.map((article) => ({
          "@type": "NewsArticle",
          "@id": article.blogSlug
            ? `https://khelgrid.com/blog/${article.blogSlug}`
            : `https://khelgrid.com/#news-${article.slug}`,
          headline: article.title,
          alternativeHeadline: article.headline,
          description: article.excerpt,
          articleBody: article.content,
          articleSection: article.sport,
          inLanguage: "en-IN",
          url: article.blogSlug
            ? `https://khelgrid.com/blog/${article.blogSlug}`
            : `https://khelgrid.com/#news-${article.slug}`,
          image: [article.imageUrl],
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": article.blogSlug
              ? `https://khelgrid.com/blog/${article.blogSlug}`
              : `https://khelgrid.com/#news-${article.slug}`,
          },
          author: {
            "@type": "Person",
            name: article.author.name,
            jobTitle: article.author.role,
          },
          publisher: {
            "@type": "SportsOrganization",
            name: "KhelGrid",
            url: "https://khelgrid.com",
            logo: {
              "@type": "ImageObject",
              url: "https://khelgrid.com/favicon.svg",
              width: 512,
              height: 512,
            },
          },
          isAccessibleForFree: true,
          keywords: article.tags?.join(", "),
        })),
      ],
    };
  }, []);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return isoString;
    }
  };

  const getOfficialIssuer = (
    article: SportsNewsArticle,
  ): {
    issuer: string;
    isOfficialGov: boolean;
    editorialType: string;
    isOpportunityTrial: boolean;
  } => {
    const authorName = article.author.name.toLowerCase();
    const authorRole = article.author.role.toLowerCase();
    const tagsStr = article.tags.join(" ").toLowerCase();
    const isTrial = article.category === "Trials & Selection";

    if (authorName.includes("sikkim") || tagsStr.includes("sikkim")) {
      return {
        issuer: "Govt of Sikkim · SYA",
        isOfficialGov: true,
        editorialType: isTrial ? "Official Selection Circular" : "State Sports Bulletin",
        isOpportunityTrial: isTrial,
      };
    }
    if (
      authorName.includes("sai") ||
      authorRole.includes("pib") ||
      tagsStr.includes("sai ncoe") ||
      tagsStr.includes("kandivali")
    ) {
      return {
        issuer: "MYAS · SAI NCOE Kandivali",
        isOfficialGov: true,
        editorialType: isTrial ? "Ministry Selection Circular" : "National Center Dispatch",
        isOpportunityTrial: isTrial,
      };
    }
    if (tagsStr.includes("khelo india")) {
      return {
        issuer: "MYAS · Khelo India Mission",
        isOfficialGov: true,
        editorialType: isTrial ? "National Games Framework" : "National Sports Policy",
        isOpportunityTrial: isTrial,
      };
    }
    if (tagsStr.includes("bcci") || tagsStr.includes("nca")) {
      return {
        issuer: "BCCI · National Cricket Academy",
        isOfficialGov: false,
        editorialType: isTrial ? "Academy Zonal Notification" : "Cricket Scouting Wire",
        isOpportunityTrial: isTrial,
      };
    }
    if (tagsStr.includes("aiff")) {
      return {
        issuer: "AIFF · Grassroots League",
        isOfficialGov: false,
        editorialType: "Youth League Tournament Wire",
        isOpportunityTrial: false,
      };
    }
    if (tagsStr.includes("afi") || tagsStr.includes("athletics federation")) {
      return {
        issuer: "AFI · National Standards",
        isOfficialGov: false,
        editorialType: "National Qualifying Benchmarks",
        isOpportunityTrial: false,
      };
    }
    if (tagsStr.includes("bai") || tagsStr.includes("badminton association")) {
      return {
        issuer: "BAI · National Circuit",
        isOfficialGov: false,
        editorialType: "Championship Ranking Fixture",
        isOpportunityTrial: false,
      };
    }
    if (tagsStr.includes("aita") || tagsStr.includes("tennis")) {
      return {
        issuer: "AITA · National Series",
        isOfficialGov: false,
        editorialType: "Junior Circuit Standings",
        isOpportunityTrial: false,
      };
    }
    if (article.category === "Scholarship") {
      return {
        issuer: "National Sports Trust",
        isOfficialGov: false,
        editorialType: "Athlete Funding & Grant Notice",
        isOpportunityTrial: false,
      };
    }
    if (tagsStr.includes("asian games")) {
      return {
        issuer: "Aichi-Nagoya 2026 Wire",
        isOfficialGov: false,
        editorialType: "Continental Medal Standings",
        isOpportunityTrial: false,
      };
    }
    return {
      issuer: article.author.name,
      isOfficialGov: false,
      editorialType:
        article.category === "National" ? "National Dispatch" : "Match Intelligence Wire",
      isOpportunityTrial: isTrial,
    };
  };

  const formatWireRelativeTime = (isoString: string): string => {
    try {
      const pub = new Date(isoString).getTime();
      const now = new Date("2026-09-30T13:36:35Z").getTime();
      const diffMs = Math.max(0, now - pub);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) {
        return `${Math.max(14, diffMins)}m ago`;
      }
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      if (diffDays === 1) {
        return "1d ago";
      }
      if (diffDays < 7) {
        return `${diffDays}d ago`;
      }
      return new Date(isoString).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Recent";
    }
  };

  if (isHomeMode) {
    const homeArticles = filteredArticles.filter((article) => !article.onlyChronicle).slice(0, 3);
    return (
      <section
        id="sports-news-section"
        className="w-full min-w-0 max-w-full mt-6 border-t border-border/60 pt-6 sm:mt-8 sm:pt-8"
        aria-labelledby="sports-news-heading"
        itemScope
        itemType="https://schema.org/CollectionPage"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
        />

        {/* Home Header: Low-profile title, live status, and direct link to KhelChronicle */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="sr-only">
              Real-time Sports Wire · National Sports &amp; Selection Dispatch
            </span>
            <h2
              id="sports-news-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              <Newspaper className="h-4 w-4 text-primary shrink-0" />
              <span>{t("sportsUpdatesTitle", "KhelChronicle")}</span>
              <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
                · National Sports &amp; Selection Dispatch
              </span>
            </h2>

            {/* Official Verification Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>{t("updatedLive", "Official Dispatches")}</span>
            </span>

            <p className="sr-only sm:not-sr-only text-[11px] text-muted-foreground ml-1 hidden md:inline truncate max-w-sm">
              {t(
                "sportsUpdatesDesc",
                "Official selection circulars, Khelo India updates, state championships, and athlete pathways across India.",
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {/* Scroll navigation arrows for all screen devices */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollHomeArticles("left")}
                aria-label="Scroll KhelChronicle articles left"
                className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollHomeArticles("right")}
                aria-label="Scroll KhelChronicle articles right"
                className="grid h-7 w-7 place-items-center rounded-lg border border-border/80 bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              to="/chronicle"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors shrink-0"
            >
              <span>View All on KhelChronicle</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Exactly 3 cards side by side in a horizontally scrollable rail across all screen devices */}
        <div
          ref={homeScrollRef}
          className="flex w-full min-w-0 max-w-full items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar touch-scroll-rail pb-2.5 pt-1 px-0.5 snap-x snap-proximity grid-cols-1 md:grid-cols-3 select-none cursor-grab active:cursor-grabbing"
        >
          {homeArticles.map((article) => {
            const issuer = getOfficialIssuer(article);
            return (
              <article
                key={article.id}
                id={`home-news-${article.slug}`}
                itemScope
                itemType="https://schema.org/NewsArticle"
                className="snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-[300px] md:w-[320px] lg:w-[340px] group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                    <img
                      src={article.imageUrl || getChronicleCardImage(article.sport)}
                      alt={`${article.title} - ${article.sport}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      itemProp="image"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getChronicleCardImage(
                          article.sport,
                        );
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <span>{article.sport}</span>
                        <span aria-hidden="true" className="text-white/50">
                          ·
                        </span>
                        <span className="text-[11px] text-white/80">{issuer.issuer}</span>
                      </div>
                      <span className="font-mono text-[11px] text-white/90">
                        {article.readTime}
                      </span>
                    </div>
                    {article.featured && (
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-300 drop-shadow-xs">
                        <Sparkles className="h-3 w-3" /> Featured Story
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-medium text-primary">
                          {formatWireRelativeTime(article.publishedAt)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-foreground/80">{article.category}</span>
                      </div>
                      <time
                        dateTime={article.publishedAt}
                        itemProp="datePublished"
                        suppressHydrationWarning
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>

                    <h3
                      itemProp="headline"
                      className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
                    >
                      {article.title}
                    </h3>

                    <p
                      itemProp="description"
                      className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                        {article.author.name.charAt(0)}
                      </div>
                      <span
                        itemProp="author"
                        className="line-clamp-1 text-xs font-medium text-foreground max-w-[130px]"
                      >
                        {article.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(article.id)}
                        className="h-7 w-7 rounded-lg"
                        aria-label={`Bookmark ${article.title}`}
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 ${
                            savedArticles.has(article.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(article)}
                        className="h-7 w-7 rounded-lg"
                        aria-label={`Share ${article.title}`}
                      >
                        <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  {issuer.isOpportunityTrial ? (
                    <Link
                      to="/trials"
                      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>View Trial Cutoffs &amp; Info</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : article.blogSlug ? (
                    <Link
                      to="/blog/$slug"
                      params={{ slug: article.blogSlug }}
                      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <Link
                      to="/chronicle"
                      className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-1.5 text-xs font-semibold text-secondary-foreground transition hover:bg-secondary/80"
                    >
                      <span>Read on KhelChronicle</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner Linking to KhelChronicle */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
              <Newspaper className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Showing top 3 national sports dispatches
              </p>
              <p className="text-muted-foreground text-[11px]">
                The rest of the circulars, federation dispatches, and match analytics are available
                on KhelChronicle.
              </p>
            </div>
          </div>
          <Link
            to="/chronicle"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground text-xs hover:bg-primary/90 transition shadow-xs"
          >
            <span>Explore All on KhelChronicle ({SPORTS_NEWS_CATALOG.length} updates)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      id="sports-news-section"
      className="mt-8 border-t border-border/60 pt-6 sm:mt-10 sm:pt-8"
      aria-labelledby="sports-news-heading"
      itemScope
      itemType="https://schema.org/CollectionPage"
    >
      {/* Schema.org NewsArticle & ItemList Structured Data Injection for Search Engine Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />

      {/* Streamlined Header: Low-profile title, live status, and compact actions */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="sr-only">
            Real-time Sports Wire · National Sports &amp; Selection Dispatch
          </span>
          <h2
            id="sports-news-heading"
            className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <Newspaper className="h-4 w-4 text-primary shrink-0" />
            <span>{t("sportsUpdatesTitle", "KhelChronicle")}</span>
            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
              · National Sports &amp; Selection Dispatch
            </span>
          </h2>

          {/* Official Verification Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>{t("updatedLive", "Official Dispatches")}</span>
          </span>

          <p className="sr-only sm:not-sr-only text-[11px] text-muted-foreground ml-1 hidden md:inline truncate max-w-sm">
            {t(
              "sportsUpdatesDesc",
              "Official selection circulars, Khelo India updates, state championships, and athlete pathways across India.",
            )}
          </p>
        </div>

        {/* Compact Right Actions: Quick Search + Refresh + Mobile Toggle */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchNewsPlaceholder", "Search news...")}
              className="h-7 w-28 sm:w-36 focus:w-44 sm:focus:w-52 rounded-full border border-border/80 bg-background/80 pl-7 pr-6 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefreshWire}
            disabled={isRefreshing}
            className="h-7 w-7 rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Refresh Sports Dispatches"
            aria-label="Refresh Dispatches"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </Button>

          {/* View Toggle: Reel vs Grid (on small screens) */}
          <div className="flex items-center rounded-full border border-border bg-muted/40 p-0.5 sm:hidden">
            <button
              type="button"
              onClick={() => setMobileViewMode("carousel")}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                mobileViewMode === "carousel"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Horizontally scrollable reel"
              aria-label="Switch to horizontal reel view"
            >
              <SlidersHorizontal className="inline h-2.5 w-2.5 mr-1" />
              {t("reelView", "Reel")}
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode("list")}
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all ${
                mobileViewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Responsive CSS grid view"
              aria-label="Switch to responsive grid view"
            >
              <LayoutGrid className="inline h-2.5 w-2.5 mr-1" />
              {t("gridView", "Grid")}
            </button>
          </div>
        </div>
      </header>

      {/* Official Opportunity & Selection Circulars Ticker Ribbon */}
      <div className="mb-4 -mx-1 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-2.5 px-1 min-w-max">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <ShieldCheck className="h-3 w-3" />
            <span>OFFICIAL CIRCULARS</span>
          </div>

          {OFFICIAL_SELECTION_CIRCULARS.map((circ) => (
            <Link
              key={circ.id}
              to={circ.link}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-border/70 bg-card/90 px-3 py-1.5 text-xs transition-colors hover:border-primary/40 shadow-2xs"
            >
              <span className="font-bold text-primary text-[10px] tracking-wide uppercase">
                {circ.authority}
              </span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              <span className="font-medium text-foreground max-w-[260px] sm:max-w-[340px] truncate">
                {circ.title}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${circ.badgeColor}`}
              >
                {circ.tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Editorial Identity & Cross-Link Bridge to Opportunities */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs">
        <div className="flex items-center gap-2 text-foreground/90">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-[10px]">
            ⚡
          </span>
          <span className="font-medium text-foreground">
            <strong>KhelGrid Sports Intelligence Desk:</strong> India&apos;s verified clearinghouse
            for SAI selection trials, Khelo India pathways, federation notifications &amp;
            grassroots athlete journalism.
          </span>
        </div>
        <Link
          to="/trials"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline shrink-0 text-xs"
        >
          <span>Browse 350+ Verified Selection Trials</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Streamlined Horizontal Filtering Bar directly above news grid */}
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border/40 pb-2">
        <nav
          ref={tabsContainerRef}
          aria-label="Sports categories"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {SPORT_TABS_CONFIG.map((tab) => {
            const active = selectedSportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedSportTab(tab.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={tab.fullLabel}
              >
                <span>{tab.label}</span>
                <span className="sr-only"> ({tab.fullLabel})</span>
              </button>
            );
          })}
        </nav>

        <span className="shrink-0 text-[11px] font-medium text-muted-foreground hidden sm:inline-block">
          {filteredArticles.length} {t("updates", "updates")}
        </span>
      </div>

      {/* --- SMALL SCREEN HORIZONTALLY MOVABLE CAROUSEL --- */}
      {/* Active on screens < sm when mobileViewMode === 'carousel' */}
      <div className={`${mobileViewMode === "carousel" ? "block sm:hidden" : "hidden"} mt-2`}>
        {/* Movable Controls & Swipe Affordance */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Radio className="h-3 w-3 text-primary animate-pulse" />
            <span>
              {t("swipeToBrowse", "Swipe horizontally to browse")}{" "}
              <strong>{allCarouselArticles.length}</strong> {t("updates", "updates")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollLeft}
              onClick={() => scrollCarousel("left")}
              className="h-7 w-7 rounded-full border-border/80 disabled:opacity-30"
              aria-label="Scroll left in sports wire"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canScrollRight}
              onClick={() => scrollCarousel("right")}
              className="h-7 w-7 rounded-full border-border/80 disabled:opacity-30"
              aria-label="Scroll right in sports wire"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Horizontally Movable Cards Reel with Edge Fade Indicators */}
        <div className="relative">
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-4 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
          )}

          <div
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Horizontally movable sports news reel"
            className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x pb-4 pt-1 px-1 no-scrollbar"
          >
            {allCarouselArticles.map((article, idx) => {
              const issuer = getOfficialIssuer(article);
              return (
                <article
                  key={article.id}
                  data-carousel-card
                  id={`mobile-news-${article.slug}`}
                  itemScope
                  itemType="https://schema.org/NewsArticle"
                  className="group relative flex w-[82vw] min-w-[260px] max-w-[340px] shrink-0 snap-center sm:snap-start flex-col justify-between overflow-hidden rounded-2xl border border-border bg-gradient-card p-4 transition-all hover:border-primary/50 shadow-xs"
                >
                  <div>
                    {/* Image Container with Responsive Aspect Ratio */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={article.imageUrl}
                        alt={`${article.title} - ${article.sport} Sports Wire`}
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <span>{article.sport}</span>
                          <span aria-hidden="true" className="text-white/60">
                            ·
                          </span>
                          <span className="text-[11px] text-white/80">{issuer.issuer}</span>
                        </div>
                        <span className="font-mono text-[11px] text-white/90">
                          {formatWireRelativeTime(article.publishedAt)}
                        </span>
                      </div>
                      {article.featured && (
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[11px] font-semibold text-amber-300 drop-shadow-xs">
                          <Sparkles className="h-3 w-3" /> Featured Story
                        </div>
                      )}
                    </div>

                    {/* Article Headline & Meta (Zero Pill Discipline) */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 shrink-0" />
                          {issuer.issuer}
                        </span>
                        <time
                          dateTime={article.publishedAt}
                          itemProp="datePublished"
                          suppressHydrationWarning
                        >
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>

                      <h3
                        itemProp="headline"
                        className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
                      >
                        {article.title}
                      </h3>

                      <p
                        itemProp="description"
                        className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                      >
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-4 border-t border-border/60 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold">
                          {article.author.name.charAt(0)}
                        </div>
                        <span
                          itemProp="author"
                          className="line-clamp-1 text-xs font-medium text-foreground max-w-[130px]"
                        >
                          {article.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSave(article.id)}
                          className="h-7 w-7 rounded-full"
                          aria-label={`Bookmark ${article.title}`}
                        >
                          <Bookmark
                            className={`h-3.5 w-3.5 ${
                              savedArticles.has(article.id)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(article)}
                          className="h-7 w-7 rounded-full"
                          aria-label={`Share ${article.title}`}
                        >
                          <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>

                    {issuer.isOpportunityTrial ? (
                      <a
                        href="#latest-opportunities-heading"
                        className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>View Trial Registration & Cutoffs</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : article.blogSlug ? (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: article.blogSlug }}
                        className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                      >
                        <span>Read Analysis & Stats</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots Indicator */}
        <div
          className="mt-2 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Sports news slide indicators"
        >
          {allCarouselArticles.slice(0, 7).map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeSlideIndex === idx}
              aria-label={`Go to story ${idx + 1}`}
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSlideIndex === idx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- HYBRID REAL-TIME WIRE GRID (Lead Dispatch + Chronological Live Wire Stream) --- */}
      {/* Single column on mobile, 2 columns on tablets, 12-col hybrid layout on desktop */}
      <div
        className={`mt-2 sm:mt-3 ${
          mobileViewMode === "list" ? "grid" : "hidden sm:grid"
        } grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6`}
      >
        {/* Primary Lead Dispatch (Left on desktop: 7 cols) */}
        {featuredArticle && (
          <article
            id={`news-${featuredArticle.slug}`}
            itemScope
            itemType="https://schema.org/NewsArticle"
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card p-5 sm:p-6 sm:col-span-2 lg:col-span-7 transition-all hover:border-primary/50"
          >
            <div>
              {/* Media Frame with Clean Scrim and Zero-Pill Typography */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
                <img
                  src={featuredArticle.imageUrl}
                  alt={`${featuredArticle.title} - Featured National Sports Story`}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white tracking-wide">
                      {featuredArticle.sport}
                    </span>
                    <span aria-hidden="true" className="text-white/50">
                      ·
                    </span>
                    <span className="text-white/80">
                      {getOfficialIssuer(featuredArticle).issuer}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/90">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Lead Kicker & Relative Chronological Timestamp */}
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("featuredLeadStory", "Featured Lead Story")}
                  </span>
                  <span aria-hidden="true" className="text-border">
                    ·
                  </span>
                  <span className="font-mono text-primary font-medium">
                    {formatWireRelativeTime(featuredArticle.publishedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <time
                    dateTime={featuredArticle.publishedAt}
                    itemProp="datePublished"
                    suppressHydrationWarning
                  >
                    {formatDate(featuredArticle.publishedAt)}
                  </time>
                </div>
              </div>

              <h3
                itemProp="headline"
                className="mt-2.5 text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug"
              >
                {featuredArticle.title}
              </h3>

              <p
                itemProp="description"
                className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3"
              >
                {featuredArticle.excerpt}
              </p>

              {featuredArticle.officialSourceUrl ? (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <a
                    href={featuredArticle.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>
                      View Official PIB Press Release (PRID: {featuredArticle.pibPrid || "2321660"})
                    </span>
                  </a>
                  {featuredArticle.venueId && (
                    <Link
                      to="/venue/$id"
                      params={{ id: featuredArticle.venueId }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{featuredArticle.venueName || "Venue Details"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setReadingArticle(featuredArticle)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span>Read Full Dispatch</span>
                  </button>
                </div>
              ) : getOfficialIssuer(featuredArticle).isOpportunityTrial ? (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <a
                    href="#latest-opportunities-heading"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>View Application & Cutoffs in Opportunities</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAnalyticsHub("asiad");
                      setIsAnalyticsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span>Live Match Center</span>
                  </button>
                </div>
              ) : featuredArticle.blogSlug ? (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featuredArticle.blogSlug }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
                  >
                    {t("readFullAnalysis", "Read Tactical Analysis")}{" "}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveAnalyticsHub("asiad");
                      setIsAnalyticsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-primary" />
                    <span>{t("viewAnalytics", "View Recharts & Social Feed")}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                  {featuredArticle.author.name.charAt(0)}
                </div>
                <div>
                  <div itemProp="author" className="text-xs font-semibold text-foreground">
                    {featuredArticle.author.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {featuredArticle.author.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSave(featuredArticle.id)}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Save to reading list"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      savedArticles.has(featuredArticle.id)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare(featuredArticle)}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Share article"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </article>
        )}

        {/* Right Side: Chronological Live Wire Stream (Right on desktop: 5 cols) */}
        <div className="flex flex-col justify-between sm:col-span-2 lg:col-span-5 rounded-2xl border border-border/80 bg-gradient-card p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <span className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {t("trendingBulletins", "Latest Selection & Grassroots Bulletins")}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {filteredArticles.length} {t("activeUpdates", "updates active")}
              </span>
            </div>

            {/* Stacked Chronological Wire Feed */}
            <div className="space-y-3.5">
              {listArticles.map((article) => {
                const issuer = getOfficialIssuer(article);
                return (
                  <article
                    key={article.id}
                    id={`news-${article.slug}`}
                    itemScope
                    itemType="https://schema.org/NewsArticle"
                    className="group relative flex flex-col gap-1.5 pb-3 border-b border-border/50 last:border-b-0 last:pb-0"
                  >
                    {/* Metadata Kicker: Relative Time · Sport · Issuer */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="font-mono font-semibold text-primary">
                          {formatWireRelativeTime(article.publishedAt)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-foreground">{article.sport}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[140px]">
                          {issuer.issuer}
                        </span>
                      </div>
                      <time
                        dateTime={article.publishedAt}
                        itemProp="datePublished"
                        className="text-muted-foreground/70 hidden sm:inline"
                        suppressHydrationWarning
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>

                    {/* Headline */}
                    <h4
                      itemProp="headline"
                      className="text-xs sm:text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2"
                    >
                      {article.title}
                    </h4>

                    {/* Fast 1-line urgency excerpt */}
                    <p
                      itemProp="description"
                      className="text-xs text-muted-foreground line-clamp-1 leading-relaxed"
                    >
                      {article.excerpt}
                    </p>

                    {/* Micro Action Bar */}
                    <div className="mt-1 flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span itemProp="author" className="line-clamp-1 max-w-[130px]">
                          {article.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {article.officialSourceUrl ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <a
                              href={article.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                            >
                              <span>
                                PIB {article.pibPrid ? `PRID: ${article.pibPrid}` : "Release"}
                              </span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            {article.venueId && (
                              <Link
                                to="/venue/$id"
                                params={{ id: article.venueId }}
                                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-[11px]"
                              >
                                <span>Venue</span>
                                <Building2 className="h-2.5 w-2.5" />
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => setReadingArticle(article)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <span>Read</span>
                              <BookOpen className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ) : issuer.isOpportunityTrial ? (
                          <a
                            href="#latest-opportunities-heading"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
                          >
                            <span>Apply in Opportunities</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        ) : article.blogSlug ? (
                          <Link
                            to="/blog/$slug"
                            params={{ slug: article.blogSlug }}
                            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-[11px]"
                          >
                            <span>Analysis</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {article.readTime}
                          </span>
                        )}

                        <div className="flex items-center gap-0.5 ml-1">
                          <button
                            onClick={() => toggleSave(article.id)}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-sm"
                            aria-label={`Bookmark ${article.title}`}
                          >
                            <Bookmark
                              className={`h-3 w-3 ${
                                savedArticles.has(article.id)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleShare(article)}
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded-sm"
                            aria-label={`Share ${article.title}`}
                          >
                            <Share2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Notice Submission Prompt */}
          <aside className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <Newspaper className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-foreground">
                  {t("haveTournamentUpdate", "Have a tournament or trial update?")}
                </h5>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                  Federation officials and academy coaches publish verified dispatches directly on
                  KhelWire.
                </p>
                <Link
                  to="/blog/write"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {t("submitNotice", "Submit sports notice")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Extended Multi-Column Wire Dispatch Grid */}
        {remainingGridArticles.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-12 mt-4 space-y-4">
            <div className="flex items-center justify-between px-1 pt-4 border-t border-border/60">
              <span className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-foreground">
                <Newspaper className="h-4 w-4 text-primary" />
                {t("moreNationalUpdates", "National Sports Dispatches & Official Circulars")}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {remainingGridArticles.length} {t("articles", "articles")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {remainingGridArticles.map((article) => {
                const issuer = getOfficialIssuer(article);
                return (
                  <article
                    key={article.id}
                    id={`news-grid-${article.slug}`}
                    itemScope
                    itemType="https://schema.org/NewsArticle"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                  >
                    <div>
                      {/* Image with unboxed overlay */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                        <img
                          src={article.imageUrl}
                          alt={`${article.title} - ${article.sport}`}
                          loading="lazy"
                          decoding="async"
                          itemProp="image"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-white/90">
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <span>{article.sport}</span>
                            <span aria-hidden="true" className="text-white/50">
                              ·
                            </span>
                            <span className="text-[11px] text-white/80">{issuer.issuer}</span>
                          </div>
                          <span className="font-mono text-[11px] text-white/90">
                            {article.readTime}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-primary">
                              {formatWireRelativeTime(article.publishedAt)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-foreground/80">
                              {article.category}
                            </span>
                          </div>
                          <time
                            dateTime={article.publishedAt}
                            itemProp="datePublished"
                            suppressHydrationWarning
                          >
                            {formatDate(article.publishedAt)}
                          </time>
                        </div>

                        <h4
                          itemProp="headline"
                          className="mt-1.5 line-clamp-2 text-sm sm:text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary"
                        >
                          {article.title}
                        </h4>

                        <p
                          itemProp="description"
                          className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border/60 pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                            {article.author.name.charAt(0)}
                          </div>
                          <span
                            itemProp="author"
                            className="line-clamp-1 text-xs font-medium text-foreground max-w-[130px]"
                          >
                            {article.author.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSave(article.id)}
                            className="h-7 w-7 rounded-lg"
                            aria-label={`Bookmark ${article.title}`}
                          >
                            <Bookmark
                              className={`h-3.5 w-3.5 ${
                                savedArticles.has(article.id)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleShare(article)}
                            className="h-7 w-7 rounded-lg"
                            aria-label={`Share ${article.title}`}
                          >
                            <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      {article.officialSourceUrl ? (
                        <div className="mt-2.5 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <a
                              href={article.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>PIB Press Release</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => setReadingArticle(article)}
                              className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5 text-primary" />
                              <span>Read</span>
                            </button>
                          </div>
                          {article.venueId && (
                            <Link
                              to="/venue/$id"
                              params={{ id: article.venueId }}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                            >
                              <Building2 className="h-3.5 w-3.5" />
                              <span>Venue Details ({article.venueName || "View Venue"})</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      ) : issuer.isOpportunityTrial ? (
                        <a
                          href="#latest-opportunities-heading"
                          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>View Application in Opportunities</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      ) : article.blogSlug ? (
                        <Link
                          to="/blog/$slug"
                          params={{ slug: article.blogSlug }}
                          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                        >
                          <span>{t("readFullAnalysis", "Read Tactical Analysis")}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Decoupled High-Performance Analytics Hub Preview (Prevents ~1400px page bloat while keeping instant access) */}
      <div
        className="mt-8 rounded-2xl border border-border/80 bg-gradient-card p-5 sm:p-6"
        id="live-match-wire-intelligence"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />{" "}
                {t("analyticsHub", "High-Performance Analytics Hub")}
              </Badge>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                {t("liveWireData", "Live Wire Data")}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Asian Games 2026, Match Recharts & Win Outcome Predictor
            </h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Real-time medal tallies, bowling economy rates, run-rate progression, and win
              probability forecasting decoupled into an on-demand interactive analytical workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={() => setIsAnalyticsModalOpen(true)}
              className="gap-2 text-xs font-semibold shadow-xs"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Open Analytics Studio</span>
            </Button>

            <Link
              to="/blog/$slug"
              params={{
                slug:
                  activeAnalyticsHub === "asiad"
                    ? "asian-games-2026-live-updates-september-23-india-medal-tally-analysis"
                    : "india-vs-japan-cricket-match-tactical-analysis",
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>Dedicated Blog Hub</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsInlineExpanded(!isInlineExpanded)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <span>{isInlineExpanded ? "Collapse Inline" : "Preview Inline"}</span>
              {isInlineExpanded ? (
                <ChevronUp className="ml-1 h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Compact Quick Summary Metrics */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
            <div>
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                Asian Games 2026
              </span>
              <p className="text-sm font-bold text-foreground">19 Medals · 4 Gold</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveAnalyticsHub("asiad");
                setIsAnalyticsModalOpen(true);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              View Tally →
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
            <div>
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                IND vs JPN Cricket
              </span>
              <p className="text-sm font-bold text-foreground">184/5 (20.0) · RRR 9.25</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveAnalyticsHub("cricket");
                setIsAnalyticsModalOpen(true);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Recharts →
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3">
            <div>
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                Win Predictor Engine
              </span>
              <p className="text-sm font-bold text-foreground">78.4% Win Chance IND</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveAnalyticsHub("predictor");
                setIsAnalyticsModalOpen(true);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Predictor →
            </button>
          </div>
        </div>

        {/* Optional Inline Expansion (only when explicitly requested by user) */}
        {isInlineExpanded && (
          <div className="mt-6 border-t border-border/70 pt-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  {activeAnalyticsHub === "asiad"
                    ? "Asian Games 2026: Live Medal Tally & Discipline Breakdown"
                    : activeAnalyticsHub === "predictor"
                      ? "Match Outcome Predictor: Dynamic Win Probability Engine"
                      : "Match Intelligence: Recharts Analytics & Community Buzz"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {activeAnalyticsHub === "asiad"
                    ? "Live updates on September 23, 2026: Mirabai Chanu's silver, shotgun skeet hit rates, and Asian Games leaderboard."
                    : activeAnalyticsHub === "predictor"
                      ? "Real-time win probability forecasting based on current run rates (CRR vs RRR), wickets in hand, and historical win rates."
                      : "Real-time cricket wire featuring bowling economy rates, run rate progression, and social buzz."}
                </p>
              </div>

              <div className="flex items-center overflow-x-auto max-w-full rounded-full border border-border bg-background p-1 text-xs no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("asiad")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "asiad"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Asian Games 2026
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("cricket")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "cricket"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  India vs Japan Cricket
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("predictor")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "predictor"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Match Outcome Predictor
                </button>
              </div>
            </div>

            {activeAnalyticsHub === "asiad" ? (
              <AsianGamesAnalytics />
            ) : activeAnalyticsHub === "predictor" ? (
              <MatchOutcomePredictor />
            ) : (
              <>
                <MatchStatisticsCharts />
                <IndiaJapanSocialFeed />
              </>
            )}
          </div>
        )}
      </div>

      {/* Dedicated Analytics Studio Modal Dialog (Decoupled, Focused Workspace) */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> High-Performance Analytics Studio
              </Badge>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                Live Data
              </span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
              {activeAnalyticsHub === "asiad"
                ? "Asian Games 2026: Live Medal Tally & Discipline Breakdown"
                : activeAnalyticsHub === "predictor"
                  ? "Match Outcome Predictor: Dynamic Win Probability Engine"
                  : "Match Intelligence: Recharts Analytics & Community Buzz"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
              {activeAnalyticsHub === "asiad"
                ? "Live medal tallies, shooting skeet hit rates, and weightlifting leaderboard from the 2026 Asian Games."
                : activeAnalyticsHub === "predictor"
                  ? "Real-time win probability forecasting based on current run rates (CRR vs RRR), wickets in hand, and historical win rates."
                  : "Real-time cricket wire featuring bowling economy rates, run rate progression, and social buzz."}
            </DialogDescription>
          </DialogHeader>

          {/* Segmented Switcher inside Dialog */}
          <div className="my-4 flex items-center overflow-x-auto max-w-full rounded-xl border border-border bg-muted/40 p-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveAnalyticsHub("asiad")}
              className={`flex-1 shrink-0 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer text-center ${
                activeAnalyticsHub === "asiad"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Asian Games 2026
            </button>
            <button
              type="button"
              onClick={() => setActiveAnalyticsHub("cricket")}
              className={`flex-1 shrink-0 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer text-center ${
                activeAnalyticsHub === "cricket"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              India vs Japan Cricket
            </button>
            <button
              type="button"
              onClick={() => setActiveAnalyticsHub("predictor")}
              className={`flex-1 shrink-0 rounded-lg px-3 py-1.5 font-medium transition-colors cursor-pointer text-center ${
                activeAnalyticsHub === "predictor"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Match Outcome Predictor
            </button>
          </div>

          {/* Render Active Analytics Dashboard inside modal */}
          <div className="space-y-6 pt-2">
            {activeAnalyticsHub === "asiad" ? (
              <AsianGamesAnalytics />
            ) : activeAnalyticsHub === "predictor" ? (
              <MatchOutcomePredictor />
            ) : (
              <>
                <MatchStatisticsCharts />
                <IndiaJapanSocialFeed />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
