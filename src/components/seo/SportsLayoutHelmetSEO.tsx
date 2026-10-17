import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useRouterState } from "@tanstack/react-router";
import {
  SITE_URL,
  DEFAULT_SITE_NAME,
  TWITTER_HANDLE,
  DEFAULT_OG_IMAGE,
  DEFAULT_KEYWORDS,
} from "@/lib/seo";
import { resolveCanonicalUrl, resolveImageUrl, resolveTitle } from "./seo-utils";

export type SportsCategory = "trials" | "coaching" | "gameplay" | "portal";

export interface SportsLayoutHelmetSEOProps {
  /** Explicitly override sports category: sports trials, coaching opportunities, or gameplay engagement */
  category?: SportsCategory;
  /** Primary sport filter (e.g. Cricket, Football, Badminton, Kho-Kho, Athletics) */
  sport?: string;
  /** City or regional filter (e.g. Delhi, Mumbai, Bengaluru, Hyderabad) */
  city?: string;
  /** Search query string */
  query?: string;
  /** Explicit title override */
  title?: string;
  /** Explicit meta description override (120-160 characters recommended) */
  description?: string;
  /** Explicit keywords override (comma-separated or string array) */
  keywords?: string | string[];
  /** Canonical URL or path override */
  canonicalUrl?: string;
  /** OpenGraph / Twitter Card image URL */
  image?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Prevent search engine indexing */
  noindex?: boolean;
  /** Custom Schema.org JSON-LD structured data */
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Additional React / Helmet children elements */
  children?: React.ReactNode;
}

export interface DynamicSeoResult {
  category: SportsCategory;
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  image: string;
  schemas: Array<Record<string, unknown>>;
}

/**
 * Extracts pathname and search parameters safely across SSR, router, and test environments.
 */
function useSafeLocation(): { pathname: string; searchParams: URLSearchParams } {
  let routerPath = "";
  let routerSearch = "";

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routerPath = useRouterState({ select: (s) => s.location?.pathname ?? "" });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routerSearch = useRouterState({ select: (s) => s.location?.searchStr ?? "" });
  } catch {
    routerPath = "";
    routerSearch = "";
  }

  const pathname =
    routerPath ||
    (typeof window !== "undefined" && window.location?.pathname ? window.location.pathname : "/");

  const searchRaw =
    routerSearch ||
    (typeof window !== "undefined" && window.location?.search ? window.location.search : "");

  const searchParams = useMemo(() => {
    try {
      const cleanSearch = searchRaw.startsWith("?") ? searchRaw.slice(1) : searchRaw;
      return new URLSearchParams(cleanSearch);
    } catch {
      return new URLSearchParams();
    }
  }, [searchRaw]);

  return { pathname, searchParams };
}

/**
 * Detects sports category based on active route path and search parameters.
 */
export function detectSportsCategory(
  pathname: string,
  searchParams?: URLSearchParams,
): SportsCategory {
  const p = pathname.toLowerCase();
  const q = searchParams?.get("q")?.toLowerCase() || "";

  // 1. Sports Trials & Selection Combines
  if (
    p.startsWith("/search") ||
    p.startsWith("/trials") ||
    p.startsWith("/trial") ||
    p.startsWith("/opportunities") ||
    p.startsWith("/recommendations") ||
    q.includes("trial") ||
    q.includes("crpf") ||
    q.includes("recruitment")
  ) {
    return "trials";
  }

  // 2. Coaching Opportunities & Academy Training
  if (
    p.startsWith("/train") ||
    p.startsWith("/coaches") ||
    p.startsWith("/academy") ||
    p.startsWith("/learning-hub") ||
    p.startsWith("/partner") ||
    p.startsWith("/start-from-zero") ||
    p.startsWith("/guides") ||
    p.startsWith("/guide") ||
    q.includes("coach") ||
    q.includes("academy")
  ) {
    return "coaching";
  }

  // 3. Gameplay Engagement, Turf Booking & Sports CV
  if (
    p.startsWith("/play") ||
    p.startsWith("/book") ||
    p.startsWith("/venue") ||
    p.startsWith("/events") ||
    p.startsWith("/live-scores") ||
    p.startsWith("/my-stats") ||
    p.startsWith("/onboarding") ||
    p.startsWith("/cv") ||
    p.startsWith("/community") ||
    q.includes("turf") ||
    q.includes("pickup")
  ) {
    return "gameplay";
  }

  // 4. Portal-Wide Root / Default
  return "portal";
}

/**
 * Computes dynamic SEO metadata tailored to sports trials, coaching opportunities,
 * and gameplay engagement to maximize Google Search & search engine rankings.
 */
export function computeDynamicSportsSeo({
  categoryOverride,
  pathname,
  searchParams,
  propSport,
  propCity,
  propQuery,
  propTitle,
  propDescription,
  propKeywords,
  propCanonical,
  propImage,
  customSchema,
}: {
  categoryOverride?: SportsCategory;
  pathname: string;
  searchParams: URLSearchParams;
  propSport?: string;
  propCity?: string;
  propQuery?: string;
  propTitle?: string;
  propDescription?: string;
  propKeywords?: string | string[];
  propCanonical?: string;
  propImage?: string;
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
}): DynamicSeoResult {
  const category = categoryOverride || detectSportsCategory(pathname, searchParams);
  const activeSport = propSport || searchParams.get("sport") || "";
  const activeCity = propCity || searchParams.get("city") || "";
  const activeQuery = propQuery || searchParams.get("q") || "";
  const isCrpf =
    activeQuery.toLowerCase().includes("crpf") ||
    pathname.toLowerCase().includes("crpf") ||
    (searchParams.get("trialId") || "").toLowerCase().includes("crpf");

  let title = propTitle || "";
  let description = propDescription || "";
  let keywordsList: string[] = [];
  const schemas: Array<Record<string, unknown>> = [];

  const canonicalUrl = resolveCanonicalUrl(
    propCanonical || (pathname.startsWith("/") ? pathname : `/${pathname}`),
  );
  const image = resolveImageUrl(propImage);

  // -------------------------------------------------------------
  // PILLAR 1: SPORTS TRIALS & SELECTION COMBINES
  // -------------------------------------------------------------
  if (category === "trials") {
    if (isCrpf) {
      if (!title) {
        title = "CRPF Meritorious Sportspersons Recruitment 2026 & Selection Trials";
      }
      if (!description) {
        description =
          "Apply for 521 vacancies in CRPF meritorious sportspersons recruitment 2026 (rect.crpf.gov.in). Check eligibility, 50-mark trial scoring, PST standards & official notification on KhelGrid.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "CRPF recruitment 2026",
        "CRPF meritorious sportspersons recruitment",
        "rect.crpf.gov.in apply online",
        "CRPF sports quota 2026",
        "521 vacancies CRPF sports quota",
        "CRPF constable GD recruitment",
        "CRPF sports trial test 50 marks",
        "sports trials India",
        "selection trials 2026",
        "sports quota jobs India",
        "sports opportunities",
        "central police sports recruitment",
      ];

      schemas.push({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: "CRPF Meritorious Sportspersons Recruitment 2026 (521 Vacancies)",
        description:
          "Recruitment of 521 Meritorious Sportspersons in Central Reserve Police Force (CRPF) under Sports Quota across 21 disciplines. Selection via sports trial test (50 marks) and physical standard verification.",
        identifier: {
          "@type": "PropertyValue",
          name: "CRPF Sports Quota Notice",
          value: "CRPF-SPORTS-QUOTA-2026-521",
        },
        datePosted: "2026-09-15T00:00:00Z",
        validThrough: "2026-11-15T23:59:59Z",
        employmentType: "FULL_TIME",
        hiringOrganization: {
          "@type": "Organization",
          name: "Central Reserve Police Force (CRPF)",
          sameAs: "https://rect.crpf.gov.in",
          logo: "https://rect.crpf.gov.in/Images/logo.png",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            addressCountry: "IN",
          },
        },
      });
    } else if (activeSport && activeSport !== "All Sports") {
      if (!title) {
        title =
          activeCity && activeCity !== "All Locations"
            ? `${activeSport} Selection Trials & Opportunities in ${activeCity} 2026`
            : `${activeSport} Selection Trials, Combines & Recruitment 2026`;
      }
      if (!description) {
        description = `Discover verified ${activeSport} selection trials${activeCity && activeCity !== "All Locations" ? ` in ${activeCity}` : " across India"}. Explore age-group cutoffs (U-14 to Senior), dates, venues, registration forms, and SAI scouting combines.`;
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        `${activeSport} selection trials 2026`,
        `${activeSport} trials India`,
        `${activeSport} academy combines`,
        `${activeSport} state selection`,
        `${activeSport} junior national camp`,
        "sports trials India",
        "sports opportunities",
        "SAI selection trials",
        "Khelo India youth trials",
        "open sports scouting",
      ];
    } else {
      if (!title) {
        title = "Sports Selection Trials, Combines & Opportunities 2026";
      }
      if (!description) {
        description =
          "Discover verified Indian sports selection trials, SAI NCOE residential induction, CRPF 2026 sports quota, state championships, and open scouting combines across 16+ sports.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "sports trials India",
        "selection trials 2026",
        "sports opportunities",
        "CRPF recruitment 2026",
        "SAI selection trials",
        "Khelo India youth games",
        "athletics trials",
        "badminton state trials",
        "cricket combine",
        "football academy trials",
        "kho-kho national selection",
        "kabaddi trials",
        "open scouting camp",
        "sports quota jobs",
        "verified sports trial circular",
      ];
    }

    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Verified Sports Selection Trials and Combines in India",
      description:
        "Comprehensive index of verified sports selection trials, SAI NCOE combines, and government sports quota recruitment drives across India.",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 25,
    });
  }

  // -------------------------------------------------------------
  // PILLAR 2: COACHING OPPORTUNITIES & ACADEMY TRAINING
  // -------------------------------------------------------------
  else if (category === "coaching") {
    if (activeSport && activeSport !== "All Sports") {
      if (!title) {
        title = `Elite ${activeSport} Coaching Academies & Certified Coaches`;
      }
      if (!description) {
        description = `Train at top-ranked ${activeSport} coaching academies with NIS-certified mentors across India. Compare batch timings, trial preparation programs, academy facilities, and fees.`;
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        `${activeSport} coaching academy near me`,
        `${activeSport} training classes`,
        `certified ${activeSport} coach India`,
        `NIS ${activeSport} coaching`,
        `${activeSport} trial preparation batch`,
        `youth ${activeSport} coaching program`,
        "sports coaching opportunities",
        "high performance training center",
      ];
    } else {
      if (!title) {
        title = "Sports Coaching Opportunities & Certified NIS Academies";
      }
      if (!description) {
        description =
          "Find accredited sports coaching academies and NIS-certified mentors across India. Compare batch schedules, trial preparation programs, fee structures, and elite training.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "sports coaching opportunities",
        "cricket coaching academy near me",
        "badminton coaching classes",
        "football academy training",
        "NIS certified coaches",
        "tennis coaching",
        "swimming lessons",
        "athletic training camp",
        "sports academy admission 2026",
        "trial preparation batch",
        "high performance sports center",
        "grassroots coaching India",
      ];
    }

    schemas.push({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "KhelGrid Verified Sports Coaching Network",
      description:
        "India's network of verified sports coaching academies, NIS-certified coaches, and athlete development centers for grassroots to elite athletes.",
      url: `${SITE_URL}/train`,
      areaServed: "India",
      knowsAbout: [
        "Cricket Coaching",
        "Football Training",
        "Badminton Academy",
        "Athletics Camp",
        "Kho-Kho Fundamentals",
        "Kabaddi Coaching",
      ],
    });
  }

  // -------------------------------------------------------------
  // PILLAR 3: GAMEPLAY ENGAGEMENT, TURF BOOKING & SPORTS CV
  // -------------------------------------------------------------
  else if (category === "gameplay") {
    const isLiveScores = pathname.startsWith("/live-scores");
    const isEvents = pathname.startsWith("/events");
    const isCV =
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/cv") ||
      pathname.startsWith("/my-stats");

    if (isLiveScores) {
      if (!title) {
        title = "Live Sports Scores, Match Updates & Ball-by-Ball Feed";
      }
      if (!description) {
        description =
          "Follow real-time live sports scores and updates for cricket, football, badminton, hockey, kabaddi, and tennis matches across India on KhelGrid.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "live sports scores",
        "live cricket score",
        "ISL football score",
        "pro kabaddi live",
        "badminton live score",
        "hockey score update",
        "live match tracker India",
        "sports scores online",
      ];
    } else if (isEvents) {
      if (!title) {
        title = "Sports Tournaments, State Leagues & Panga Battles";
      }
      if (!description) {
        description =
          "Register for upcoming sports tournaments, inter-academy leagues, box cricket cups, and state championships across India on KhelGrid.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "sports tournaments 2026",
        "box cricket tournament",
        "futsal league India",
        "badminton championship",
        "kabaddi tournament",
        "tournament registration India",
        "inter-academy cup",
        "grassroots sports league",
      ];
    } else if (isCV) {
      if (!title) {
        title = "Athlete Sports CV Builder & Verified Scout Card";
      }
      if (!description) {
        description =
          "Build your verified digital Sports CV, record performance benchmarks (sprint, yo-yo test), showcase match highlight reels, and get discovered by sports scouts on KhelGrid.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "sports cv builder",
        "digital scout card",
        "athlete portfolio",
        "verified sports cv India",
        "sports performance benchmarks",
        "athletic resume maker",
        "scouting radar",
        "yo-yo test score",
        "40m sprint timing",
      ];
    } else {
      if (!title) {
        title = "Book Sports Turfs & Join Pickup Games · Gameplay Engagement";
      }
      if (!description) {
        description =
          "Book premium sports turfs, join local box cricket & futsal pickup games, compete in sports tournaments, and build your verified athlete Sports CV on KhelGrid.";
      }
      keywordsList = [
        "game",
        "sport",
        "play",
        "gameplay engagement",
        "book sports turf online",
        "box cricket pitch",
        "futsal court booking",
        "pickup sports games",
        "badminton court slot",
        "turf war",
        "3v3 basketball streetball",
        "weekend match lobby",
        "sports venues near me",
        "sports tournaments 2026",
      ];
    }

    schemas.push({
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: "KhelGrid Sports Turfs & Gameplay Arena Network",
      description:
        "India's network of bookable sports turfs, box cricket grounds, futsal courts, and local pickup game lobbies.",
      url: `${SITE_URL}/play`,
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    });
  }

  // -------------------------------------------------------------
  // PILLAR 4: PORTAL-WIDE DEFAULT (HOME & GENERAL PAGES)
  // -------------------------------------------------------------
  else {
    if (!title) {
      title = "India's Sports Opportunity Network | Game, Sport, Play & Trials";
    }
    if (!description) {
      description =
        "India's #1 network for game, sport, and play. Discover verified sports selection trials (CRPF 2026 & SAI), train with top coaching academies, book sports turfs, and build your Sports CV.";
    }
    keywordsList = [
      "game",
      "sport",
      "play",
      "sports trials India",
      "sports opportunities",
      "coaching opportunities",
      "gameplay engagement",
      "book sports turf",
      "pickup games",
      "selection trials 2026",
      "CRPF recruitment 2026",
      "SAI trials",
      "sports CV builder",
      "cricket coaching",
      "football combine",
      "badminton court booking",
      "kho-kho trials",
      "turf war",
      "box cricket match",
      "gully to stadium",
    ];

    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: DEFAULT_SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      name: DEFAULT_SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      description: description,
      sameAs: ["https://twitter.com/khelgrid", "https://instagram.com/khelgrid"],
    });
  }

  // Format title with brand suffix if not already present
  const resolvedTitle = resolveTitle(title, DEFAULT_SITE_NAME, true);

  // Merge keywords
  const finalKeywords = propKeywords
    ? Array.isArray(propKeywords)
      ? propKeywords.join(", ")
      : propKeywords
    : keywordsList.length > 0
      ? keywordsList.join(", ")
      : DEFAULT_KEYWORDS;

  // Add custom schemas if provided
  if (customSchema) {
    if (Array.isArray(customSchema)) {
      schemas.push(...customSchema);
    } else {
      schemas.push(customSchema);
    }
  }

  return {
    category,
    title: resolvedTitle,
    description,
    keywords: finalKeywords,
    canonicalUrl,
    image,
    schemas,
  };
}

/**
 * React Helmet component for the main layout that dynamically updates meta tags
 * for sports trials, coaching opportunities, and gameplay engagement to maximize
 * search engine visibility and top SERP ranking.
 *
 * It dynamically tracks current route changes and search parameters to generate:
 * - Specific, click-worthy <title> and OpenGraph titles (30-60 chars).
 * - Action-oriented, keyword-dense <meta name="description"> (120-160 chars).
 * - High-ranking meta keywords with "game, sport, play" and trending Indian sports slang.
 * - Dynamic canonical URLs and robots indexing directives.
 * - OpenGraph (`og:*`) & Twitter Card (`twitter:*`) social share tags.
 * - Schema.org JSON-LD structured data (JobPosting, ItemList, EducationalOrganization,
 *   SportsActivityLocation, WebSite, SportsOrganization).
 */
export function SportsLayoutHelmetSEO(props: SportsLayoutHelmetSEOProps = {}) {
  const { pathname, searchParams } = useSafeLocation();

  const seo = useMemo(
    () =>
      computeDynamicSportsSeo({
        categoryOverride: props.category,
        pathname,
        searchParams,
        propSport: props.sport,
        propCity: props.city,
        propQuery: props.query,
        propTitle: props.title,
        propDescription: props.description,
        propKeywords: props.keywords,
        propCanonical: props.canonicalUrl,
        propImage: props.image,
        customSchema: props.customSchema,
      }),
    [
      props.category,
      pathname,
      searchParams,
      props.sport,
      props.city,
      props.query,
      props.title,
      props.description,
      props.keywords,
      props.canonicalUrl,
      props.image,
      props.customSchema,
    ],
  );

  const robotsDirective = props.noindex
    ? "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  return (
    <Helmet>
      {/* 1. Document Title & Primary Search Meta */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta name="robots" content={robotsDirective} />
      <meta name="author" content={DEFAULT_SITE_NAME} />

      {/* 2. OpenGraph Meta Tags (WhatsApp, Facebook, LinkedIn, Discord, Telegram) */}
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:secure_url" content={seo.image} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {props.imageAlt && <meta property="og:image:alt" content={props.imageAlt} />}
      <meta property="og:locale" content="en_IN" />

      {/* 3. Twitter / X Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      {props.imageAlt && <meta name="twitter:image:alt" content={props.imageAlt} />}

      {/* 4. Categorical Meta Signals for Search Engine Crawlers */}
      <meta name="khelgrid:category" content={seo.category} />
      <meta name="khelgrid:sports-pillar" content={seo.category} />

      {/* 5. Schema.org JSON-LD Structured Data */}
      {seo.schemas.map((schemaObj, index) => (
        <script key={`sports-layout-jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      ))}

      {/* 6. Extensible Children */}
      {props.children}
    </Helmet>
  );
}

export default SportsLayoutHelmetSEO;
