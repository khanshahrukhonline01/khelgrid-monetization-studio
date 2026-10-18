import type { Trial } from "@/data/trials";
import { SITE_URL, DEFAULT_SITE_NAME } from "@/lib/seo";
import { generateTrialsFaqSchema } from "@/data/trials-faq";

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

export interface SearchTrialsSeoMetadata {
  isCrpf: boolean;
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  ogImageUrl: string;
  jsonLdData: Array<Record<string, unknown>>;
}

/**
 * Pure generator for Search Trials SEO metadata.
 * Computes tailored titles, meta descriptions, canonical URLs, keywords,
 * and Schema.org structured data (JobPosting, Breadcrumbs, FAQPage, WebSite)
 * for search queries, sport/city filters, and recruitment drives like CRPF 2026.
 */
export function getSearchTrialsSeoMetadata(
  props: SearchTrialsHelmetSEOProps = {},
): SearchTrialsSeoMetadata {
  const { query = "", sport = "", city = "", trialId = "", savedOnly = false } = props;

  const qLower = query.toLowerCase();
  const idLower = trialId.toLowerCase();
  const isCrpf = Boolean(
    qLower.includes("crpf") ||
    idLower.includes("crpf") ||
    qLower.includes("meritorious") ||
    qLower.includes("police force") ||
    qLower.includes("constable gd") ||
    qLower.includes("head constable"),
  );

  const activeSport = sport && sport !== "All Sports" && sport !== "all" ? sport : "";
  const activeCity = city && city !== "All Locations" && city !== "all" ? city : "";

  // Dynamic Title Construction
  let pageTitle = `Sports Selection Trials, Combines & Recruitment Drives in India (2026) · ${DEFAULT_SITE_NAME}`;
  if (isCrpf) {
    pageTitle = `CRPF Meritorious Sportspersons Recruitment 2026 (521 Posts) | Official Sports Quota Apply · ${DEFAULT_SITE_NAME}`;
  } else if (savedOnly) {
    pageTitle = `My Saved Sports Opportunities & Selection Trials · ${DEFAULT_SITE_NAME}`;
  } else if (activeSport && activeCity) {
    pageTitle = `${activeSport} Selection Trials & Opportunities in ${activeCity} (2026) · ${DEFAULT_SITE_NAME}`;
  } else if (activeSport) {
    pageTitle = `${activeSport} Selection Trials, Combines & Sports Quotas Across India (2026) · ${DEFAULT_SITE_NAME}`;
  } else if (activeCity) {
    pageTitle = `Sports Selection Trials & Academy Combines in ${activeCity} (2026) · ${DEFAULT_SITE_NAME}`;
  } else if (query.trim()) {
    pageTitle = `Search Results for "${query.trim()}" · Sports Trials & Opportunities · ${DEFAULT_SITE_NAME}`;
  }

  // Dynamic Meta Description Construction
  let metaDescription = `Discover verified sports selection trials, government quota recruitments (CRPF 2026), junior academy combines, and state trials across India. Filter by sport, city, age group, and free entry.`;
  if (isCrpf) {
    metaDescription =
      "Apply online for 521 vacancies (182 Head Constable GD + 339 Constable GD) under CRPF Meritorious Sportspersons Recruitment 2026 at rect.crpf.gov.in across 22 sports disciplines. Check eligibility, PST physical standards, trial test marks, selection phases, and official notification.";
  } else if (activeSport && activeCity) {
    metaDescription = `Find verified ${activeSport} selection trials, junior academy combines, state tournament screening, and coaching camps in ${activeCity}. Check age eligibility, venue details, reporting dates, and coach contacts on ${DEFAULT_SITE_NAME}.`;
  } else if (activeSport) {
    metaDescription = `Discover verified ${activeSport} selection trials, state camps, academy combines, and sports quota recruitments across India. View age categories, trial dates, entry fees, and selection guidelines on ${DEFAULT_SITE_NAME}.`;
  } else if (activeCity) {
    metaDescription = `Browse open sports selection trials, tournaments, coaching combines, and trials in ${activeCity} across Cricket, Football, Athletics, Badminton, Basketball, Wrestling, and more.`;
  } else if (query.trim()) {
    metaDescription = `Explore verified sports trial listings, coaching combines, and scouting opportunities matching "${query.trim()}". Real-time dates, venues, eligibility, and verified official contacts on ${DEFAULT_SITE_NAME}.`;
  }

  // Dynamic Canonical URL
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (activeSport) params.set("sport", activeSport);
  if (activeCity) params.set("city", activeCity);
  if (trialId) params.set("trialId", trialId);

  const queryString = params.toString();
  const canonicalUrl = queryString ? `${SITE_URL}/search?${queryString}` : `${SITE_URL}/search`;

  // Targeted Keywords
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
    baseKeywords.unshift(
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
    );
  } else {
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
  }

  const keywords = baseKeywords.join(", ");

  // Schema.org JSON-LD Structured Data
  const jsonLdData: Array<Record<string, unknown>> = [
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
  jsonLdData.push({
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
      logo: `${SITE_URL}/og-image.svg`,
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

  // 4. FAQPage Schema for Sports Opportunities & Guidance
  jsonLdData.push(generateTrialsFaqSchema());

  const ogImageUrl = `${SITE_URL}/og-image.svg`;

  return {
    isCrpf,
    pageTitle,
    metaDescription,
    canonicalUrl,
    keywords,
    ogImageUrl,
    jsonLdData,
  };
}
