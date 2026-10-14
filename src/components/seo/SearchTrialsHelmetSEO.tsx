import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import type { Trial } from "@/data/trials";
import { SITE_URL, DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";

export interface SearchTrialsHelmetSEOProps {
  query?: string;
  sport?: string;
  city?: string;
  sort?: string;
  free?: boolean;
  trialId?: string;
  savedOnly?: boolean;
  totalResults?: number;
  featuredTrial?: Trial | null;
}

/**
 * Standardized SEO Meta-Tag Manager using react-helmet-async
 * for the Search Trials and Opportunities page.
 *
 * Dynamically synchronizes document title, standard meta descriptions,
 * canonical URLs, OpenGraph tags, Twitter Card tags, and Schema.org
 * structured data (JobPosting, SportsEvent, BreadcrumbList, WebSite, FAQPage)
 * with special discoverability optimizations for CRPF Meritorious Sportspersons
 * Recruitment 2026 and national/state sports trials.
 */
export function SearchTrialsHelmetSEO({
  query = "",
  sport = "",
  city = "",
  sort = "Soonest",
  free = false,
  trialId = "",
  savedOnly = false,
  totalResults,
  featuredTrial,
}: SearchTrialsHelmetSEOProps) {
  const isCrpf = useMemo(() => {
    const qLower = query.toLowerCase();
    const idLower = trialId.toLowerCase();
    return (
      qLower.includes("crpf") ||
      idLower.includes("crpf") ||
      qLower.includes("meritorious") ||
      qLower.includes("police force") ||
      qLower.includes("constable gd") ||
      qLower.includes("head constable")
    );
  }, [query, trialId]);

  const activeSport = sport && sport !== "All Sports" && sport !== "all" ? sport : "";
  const activeCity = city && city !== "All Locations" && city !== "all" ? city : "";

  // Dynamic Title Construction
  const pageTitle = useMemo(() => {
    if (isCrpf) {
      return `CRPF Meritorious Sportspersons Recruitment 2026 (521 Posts) | Official Sports Quota Apply · ${DEFAULT_SITE_NAME}`;
    }
    if (savedOnly) {
      return `My Saved Sports Opportunities & Selection Trials · ${DEFAULT_SITE_NAME}`;
    }
    if (activeSport && activeCity) {
      return `${activeSport} Selection Trials & Opportunities in ${activeCity} (2026) · ${DEFAULT_SITE_NAME}`;
    }
    if (activeSport) {
      return `${activeSport} Selection Trials, Combines & Sports Quotas Across India (2026) · ${DEFAULT_SITE_NAME}`;
    }
    if (activeCity) {
      return `Sports Selection Trials & Academy Combines in ${activeCity} (2026) · ${DEFAULT_SITE_NAME}`;
    }
    if (query.trim()) {
      return `Search Results for "${query.trim()}" · Sports Trials & Opportunities · ${DEFAULT_SITE_NAME}`;
    }
    return `Sports Selection Trials, Combines & Recruitment Drives in India (2026) · ${DEFAULT_SITE_NAME}`;
  }, [isCrpf, savedOnly, activeSport, activeCity, query]);

  // Dynamic Meta Description Construction
  const metaDescription = useMemo(() => {
    if (isCrpf) {
      return "Apply online for 521 vacancies (182 Head Constable GD + 339 Constable GD) under CRPF Meritorious Sportspersons Recruitment 2026 at rect.crpf.gov.in across 22 sports disciplines. Check eligibility, PST physical standards, trial test marks, selection phases, and official notification.";
    }
    if (activeSport && activeCity) {
      return `Find verified ${activeSport} selection trials, junior academy combines, state tournament screening, and coaching camps in ${activeCity}. Check age eligibility, venue details, reporting dates, and coach contacts on ${DEFAULT_SITE_NAME}.`;
    }
    if (activeSport) {
      return `Discover verified ${activeSport} selection trials, state camps, academy combines, and sports quota recruitments across India. View age categories, trial dates, entry fees, and selection guidelines on ${DEFAULT_SITE_NAME}.`;
    }
    if (activeCity) {
      return `Browse open sports selection trials, tournaments, coaching combines, and trials in ${activeCity} across Cricket, Football, Athletics, Badminton, Basketball, Wrestling, and more.`;
    }
    if (query.trim()) {
      return `Explore verified sports trial listings, coaching combines, and scouting opportunities matching "${query.trim()}". Real-time dates, venues, eligibility, and verified official contacts on ${DEFAULT_SITE_NAME}.`;
    }
    return `Discover verified sports selection trials, government quota recruitments (CRPF 2026), junior academy combines, and state trials across India. Filter by sport, city, age group, and free entry.`;
  }, [isCrpf, activeSport, activeCity, query]);

  // Dynamic Canonical URL
  const canonicalUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeSport) params.set("sport", activeSport);
    if (activeCity) params.set("city", activeCity);
    if (trialId) params.set("trialId", trialId);

    const queryString = params.toString();
    return queryString ? `${SITE_URL}/search?${queryString}` : `${SITE_URL}/search`;
  }, [query, activeSport, activeCity, trialId]);

  // Targeted Keywords
  const keywords = useMemo(() => {
    const baseKeywords = [
      "sports trials India",
      "sports selection trials 2026",
      "sports opportunities",
      "sports recruitment drives",
      "sports quota jobs",
      "academy combines",
      "junior selection trials",
    ];

    if (isCrpf) {
      return [
        "CRPF recruitment 2026",
        "CRPF meritorious sportspersons recruitment 2026",
        "rect.crpf.gov.in apply online",
        "CRPF sports quota 2026",
        "CRPF constable GD recruitment 2026",
        "CRPF head constable GD recruitment",
        "521 vacancies CRPF sports quota",
        "CRPF physical standard test PST",
        "CRPF sports trial test 50 marks",
        "central police sports quota",
        "ministry of home affairs sports recruitment",
        ...baseKeywords,
      ].join(", ");
    }

    if (activeSport) {
      baseKeywords.unshift(
        `${activeSport} trials 2026`,
        `${activeSport} selection trials`,
        `${activeSport} academy combines`,
        `${activeSport} junior state camp`,
      );
    }

    if (activeCity) {
      baseKeywords.unshift(
        `sports trials in ${activeCity}`,
        `academy selection ${activeCity}`,
        `turf and trials ${activeCity}`,
      );
    }

    return baseKeywords.join(", ");
  }, [isCrpf, activeSport, activeCity]);

  // Schema.org JSON-LD Structured Data
  const jsonLdData = useMemo(() => {
    const schemas: Array<Record<string, unknown>> = [
      // 1. WebSite Search Action
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: `${DEFAULT_SITE_NAME} Sports Trials and Opportunities`,
        url: `${SITE_URL}/search`,
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      // 2. Breadcrumbs
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Search Trials & Opportunities",
            item: `${SITE_URL}/search`,
          },
          ...(activeSport
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${activeSport} Trials`,
                  item: `${SITE_URL}/search?sport=${encodeURIComponent(activeSport)}`,
                },
              ]
            : []),
        ],
      },
    ];

    // 3. CRPF JobPosting Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: "CRPF Meritorious Sportspersons Recruitment 2026 (Head Constable & Constable GD)",
      description:
        "Central Reserve Police Force (Ministry of Home Affairs) invites online applications from eligible meritorious Indian sportspersons for 182 Head Constable (GD) and 339 Constable (GD) posts across 22 sports disciplines under Sports Quota 2026. Apply online at rect.crpf.gov.in.",
      identifier: {
        "@type": "PropertyValue",
        name: "Central Reserve Police Force",
        value: "CRPF-SPORTS-QUOTA-2026-521",
      },
      datePosted: "2026-10-12",
      validThrough: "2026-11-11T23:59:59+05:30",
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "GovernmentOrganization",
        name: "Central Reserve Police Force (CRPF) & Ministry of Home Affairs",
        sameAs: "https://rect.crpf.gov.in",
        url: "https://rect.crpf.gov.in",
        logo: "https://khelgrid.com/og-image.svg",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "Pan-India",
        },
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          minValue: 21700,
          maxValue: 81100,
          unitText: "MONTH",
        },
      },
      qualifications:
        "10+2 (Intermediate) for Head Constable (GD); 10th (Matriculation) for Constable (GD). Must have represented India in recognized International Tournaments, or State in National Championships, or University in Inter-University Tournaments, or State Schools Team in National School Games between 30/09/2024 and 30/09/2026 across 22 disciplines.",
      totalJobOpenings: 521,
      directApply: true,
      applicationContact: {
        "@type": "ContactPoint",
        name: "CRPF Recruitment Help Desk",
        telephone: "+91-11-26160255",
        email: "rectt@crpf.gov.in",
        url: "https://rect.crpf.gov.in",
      },
    });

    // 4. FAQPage Schema for Sports Opportunities & CRPF Guidance
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How can sportspersons apply for the CRPF Meritorious Sportspersons Recruitment 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Eligible sportspersons must submit their applications exclusively online on the official CRPF recruitment portal at rect.crpf.gov.in between October 12, 2026 and November 11, 2026 (23:59 hrs). Applications sent by post or physical modes will not be accepted.",
          },
        },
        {
          "@type": "Question",
          name: "What are the vacancy counts and pay scales for CRPF Sports Quota 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There are 521 total vacancies: 182 posts for Head Constable (General Duty) in Pay Level-4 (₹25,500 – ₹81,100) and 339 posts for Constable (General Duty) in Pay Level-3 (₹21,700 – ₹69,100), plus allowances as admissible to Central Government employees.",
          },
        },
        {
          "@type": "Question",
          name: "What is the age limit and relaxation for CRPF Sports Quota recruitment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Candidates must be between 18 and 23 years of age as on August 01, 2026. Upper age relaxation is provided: 5 years for Unreserved (UR), 8 years for OBC (Non-Creamy Layer), and 10 years for SC/ST candidates.",
          },
        },
        {
          "@type": "Question",
          name: "How does the sports trial selection process work on KhelGrid?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "KhelGrid lists verified selection trials and recruitment combines from government departments, state sports associations, and elite youth academies across India. You can filter by sport, city, age bracket, and registration fee, then apply directly through official portals or organizer registration forms.",
          },
        },
      ],
    });

    return schemas;
  }, [activeSport]);

  const ogImageUrl = `${SITE_URL}/og-image.svg`;

  return (
    <Helmet>
      {/* 1. Document Title & Core Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta name="author" content={DEFAULT_SITE_NAME} />

      {/* 2. OpenGraph Meta Tags (Facebook, WhatsApp, LinkedIn, Discord, Telegram) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={
          isCrpf
            ? "CRPF Meritorious Sportspersons Recruitment 2026 - 521 Vacancies - KhelGrid"
            : "KhelGrid Sports Selection Trials & Recruitment Opportunities"
        }
      />
      <meta property="og:locale" content="en_IN" />

      {/* 3. Twitter / X Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta
        name="twitter:image:alt"
        content={
          isCrpf
            ? "CRPF Meritorious Sportspersons Recruitment 2026 - Official Sports Quota"
            : "KhelGrid - India's Sports Opportunity Network"
        }
      />

      {/* 4. Schema.org JSON-LD Structured Data */}
      {jsonLdData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default SearchTrialsHelmetSEO;
