/**
 * Comprehensive SEO & Metadata Helpers for KhelGrid
 *
 * Implements full OpenGraph, Twitter Card, Canonical URL, and Robots meta tags
 * adhering to Google Search Console and AdSense quality standards (E-E-A-T).
 */

import { ROUTE_LABELS } from "@/config/nav";

export const SITE_URL = "https://www.khelgrid.com";
export const DEFAULT_OG_IMAGE = "https://www.khelgrid.com/og-image.png";
export const DEFAULT_SITE_NAME = "KhelGrid";
export const TWITTER_HANDLE = "@KhelGrid";
export const DEFAULT_KEYWORDS =
  "game, sport, play, khel, khiladi, khel kud, maidan, turf, turf booking near me, box cricket near me, box cricket turf, futsal turf, selection trials 2026, sports trials India, open trials, sports recruitment, sports quota recruitment, CRPF recruitment 2026, cricket trials, football trials, badminton court booking, athletics trials, kho-kho selection trials, kho-kho junior national, kabaddi panga, kabaddi trials, akhada, dangal, wrestling trials, SAI NCOE trials, Khelo India, sports academy near me, pickup games near me, sports CV India, desi sports, desi khel, mitti ka khel, net practice, gully cricket, ranji trophy trials, sports tournament registration, athlete resume maker, grassroots sports India";

export interface BreadcrumbItemSchema {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface SeoOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  breadcrumbs?: Array<{ name: string; path?: string }>;
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  scripts?: Array<{ type: string; children: string }>;
}

/**
 * Prettifies URL slugs into human-readable titles.
 */
export function prettifySlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Resolves breadcrumbs hierarchy for any given pathname.
 * Handles single paths, nested routes, and deep dynamic routes.
 */
export function buildBreadcrumbsFromPath(
  pathname: string,
  customCrumbs?: Array<{ name: string; path?: string }>,
): Array<{ name: string; item: string }> {
  if (customCrumbs && customCrumbs.length > 0) {
    const list: Array<{ name: string; item: string }> = [];
    const hasHome = customCrumbs.some((c) => c.name.toLowerCase() === "home" || c.path === "/");
    if (!hasHome) {
      list.push({ name: "Home", item: SITE_URL });
    }
    for (const c of customCrumbs) {
      const fullUrl = c.path
        ? c.path.startsWith("http")
          ? c.path
          : `${SITE_URL}${c.path.startsWith("/") ? c.path : `/${c.path}`}`
        : SITE_URL;
      list.push({ name: c.name, item: fullUrl });
    }
    return list;
  }

  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  const baseCrumb = { name: "Home", item: SITE_URL };

  if (!clean || clean === "") {
    return [baseCrumb];
  }

  const segments = clean.split("/").filter(Boolean);
  const crumbs: Array<{ name: string; item: string }> = [baseCrumb];

  // Specific parent mappings for singular prefixes to plural canonical hubs
  const parentMap: Record<string, { label: string; to: string }> = {
    sport: { label: "Sports", to: "/sports" },
    city: { label: "Cities", to: "/cities" },
    guide: { label: "Guides", to: "/guides" },
    tool: { label: "Tools & calculators", to: "/tools" },
    venue: { label: "Book venues", to: "/book" },
    trial: { label: "Search Trials and Opportunities", to: "/search" },
  };

  let accumulatedPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    // If first segment has a designated canonical hub parent (e.g. /sport/$slug)
    if (i === 0 && parentMap[segment] && segments.length > 1) {
      crumbs.push({
        name: parentMap[segment].label,
        item: `${SITE_URL}${parentMap[segment].to}`,
      });
      continue;
    }

    // Resolve label
    let label = ROUTE_LABELS[accumulatedPath];
    if (!label) {
      label = prettifySlug(segment);
    }

    crumbs.push({
      name: label,
      item: `${SITE_URL}${accumulatedPath}`,
    });
  }

  return crumbs;
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 */
export function generateBreadcrumbSchema(
  pathname: string,
  customCrumbs?: Array<{ name: string; path?: string }>,
) {
  const crumbs = buildBreadcrumbsFromPath(pathname, customCrumbs);
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/**
 * Generates Schema.org WebSite schema with Sitelinks Searchbox potentialAction.
 */
export function generateSitelinksSearchboxSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: DEFAULT_SITE_NAME,
    alternateName: [
      "KhelGrid",
      "Khel Grid",
      "KhelGrid · Game, Sport & Play",
      "Khel & Khiladi Grid",
      "KhelGrid India",
      "India's Sports Opportunity Network",
    ],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates Schema.org ItemList of SiteNavigationElements for sitelinks discovery.
 */
export function generateSitelinksNavigationSchema() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#sitelinks`,
    name: "KhelGrid Sitelinks",
    description: "Primary navigational sections of KhelGrid",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Search Trials and Opportunities",
        url: `${SITE_URL}/search`,
        description: "Discover upcoming sports trials, selection camps, and scouting calls.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Play Pickup Games",
        url: `${SITE_URL}/play`,
        description: "Find local pickup games, community tournaments, and amateur matches.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Book Venues & Turf",
        url: `${SITE_URL}/book`,
        description: "Book verified sports turfs, badminton courts, cricket nets, and arenas.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Sports Academies",
        url: `${SITE_URL}/academy`,
        description: "Verified coaching academies and high-performance sports centres.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 5,
        name: "Sports Guides & Knowledge",
        url: `${SITE_URL}/guides`,
        description: "Athlete development guides, fitness routines, and trial prep roadmaps.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 6,
        name: "Tools & Calculators",
        url: `${SITE_URL}/tools`,
        description: "Free athletic calculators, calorie estimators, and tournament planners.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 7,
        name: "Memberships",
        url: `${SITE_URL}/memberships`,
        description: "Multi-facility sports memberships and trial credit passes.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 8,
        name: "Pricing & Plans",
        url: `${SITE_URL}/pricing`,
        description: "Athlete, parent, academy, and scout membership pricing tiers.",
      },
      {
        "@type": "SiteNavigationElement",
        position: 9,
        name: "About KhelGrid",
        url: `${SITE_URL}/about`,
        description: "Learn about KhelGrid's mission to digitize grassroots Indian sports.",
      },
    ],
  };
}

/**
 * Generates Schema.org SportsOrganization schema.
 */
export function generateOrganizationSchema() {
  return {
    "@type": "SportsOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: DEFAULT_SITE_NAME,
    legalName: DEFAULT_SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-96x96.png`,
    image: DEFAULT_OG_IMAGE,
    description: "India's premier sports discovery and talent development network.",
    sameAs: ["https://twitter.com/khelgrid", "https://www.instagram.com/khelgrid"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "khelgrid@gmail.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

/**
 * Generates Schema.org Organization schema.
 */
export function generateGeneralOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#general-organization`,
    name: DEFAULT_SITE_NAME,
    legalName: DEFAULT_SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-96x96.png`,
    image: DEFAULT_OG_IMAGE,
    description: "India's premier sports discovery and talent development network.",
    sameAs: ["https://twitter.com/khelgrid", "https://www.instagram.com/khelgrid"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "khelgrid@gmail.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

/**
 * Generates specific route entity schema based on pathname.
 */
export function generateRouteSpecificSchema(
  pathname: string,
  options?: Partial<SeoOptions>,
): Record<string, unknown> {
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  const canonicalUrl = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const title = options?.title || DEFAULT_SITE_NAME;
  const description = options?.description || "";

  if (cleanPath === "/") {
    return {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (cleanPath === "/search" || cleanPath === "/trials") {
    return {
      "@type": "SearchResultsPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    };
  }

  if (cleanPath === "/about") {
    return {
      "@type": "AboutPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (cleanPath === "/contact") {
    return {
      "@type": "ContactPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (cleanPath.startsWith("/tools")) {
    return {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#software`,
      name: title,
      applicationCategory: "SportsApplication",
      operatingSystem: "All",
      url: canonicalUrl,
      description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    };
  }

  if (
    cleanPath.startsWith("/guide") ||
    cleanPath.startsWith("/blog") ||
    options?.type === "article"
  ) {
    const isBlog = cleanPath.startsWith("/blog");
    const isBlogHub = cleanPath === "/blog";
    if (isBlogHub) {
      return {
        "@type": "Blog",
        "@id": `${canonicalUrl}#blog`,
        headline: title,
        name: title,
        description,
        url: canonicalUrl,
        publisher: {
          "@type": "SportsOrganization",
          "@id": `${SITE_URL}/#organization`,
          name: DEFAULT_SITE_NAME,
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/favicon-96x96.png`,
            width: 96,
            height: 96,
          },
        },
      };
    }

    const itemType = isBlog ? "BlogPosting" : "Article";
    const idSuffix = isBlog ? "blog" : "article";
    const imageUrl = options?.image
      ? options.image.startsWith("http")
        ? options.image
        : `${SITE_URL}${options.image.startsWith("/") ? options.image : `/${options.image}`}`
      : DEFAULT_OG_IMAGE;

    const authorName = options?.author || "KhelGrid Editorial Team";
    const publishedDate = options?.publishedTime || "2026-01-15T00:00:00Z";
    const modifiedDate = options?.modifiedTime || publishedDate;

    return {
      "@type": itemType,
      "@id": `${canonicalUrl}#${idSuffix}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline: title.length > 110 ? `${title.slice(0, 107)}...` : title,
      name: title,
      description: description || title,
      url: canonicalUrl,
      image: [imageUrl],
      datePublished: publishedDate,
      dateModified: modifiedDate,
      inLanguage: "en-IN",
      author: {
        "@type": "Person",
        name: authorName,
        url: `${SITE_URL}/about`,
      },
      publisher: {
        "@type": "SportsOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: DEFAULT_SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/favicon-96x96.png`,
          width: 96,
          height: 96,
        },
      },
      ...(options?.section ? { articleSection: options.section } : {}),
      ...(options?.keywords ? { keywords: options.keywords } : {}),
    };
  }

  if (cleanPath.startsWith("/play")) {
    return {
      "@type": "SportsActivityLocation",
      "@id": `${canonicalUrl}#sports-activity`,
      name: title,
      description,
      url: canonicalUrl,
      provider: { "@id": `${SITE_URL}/#organization` },
    };
  }

  if (cleanPath.startsWith("/trial/")) {
    // Trial listings are not guaranteed to represent confirmed, date-valid events.
    // Keep the page discoverable without emitting incomplete SportsEvent/Offer data.
    return {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    };
  }

  if (cleanPath === "/pricing" || cleanPath === "/memberships") {
    return {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "0",
        highPrice: "999",
        offerCount: "4",
      },
    };
  }

  return {
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

/**
 * Compiles a comprehensive Schema.org @graph containing:
 * 1. WebSite schema with Sitelinks Searchbox potentialAction
 * 2. SportsOrganization schema
 * 3. Sitelinks ItemList navigation
 * 4. Dynamic BreadcrumbList for this page
 * 5. Specific Page / Entity Schema for this route
 * 6. Any optional custom schema or FAQs
 */
export function generateFullRouteJsonLd(
  pathname: string,
  options?: SeoOptions & {
    breadcrumbs?: Array<{ name: string; path?: string }>;
    customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  },
) {
  const cleanPath = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  const sitelinksWebSite = generateSitelinksSearchboxSchema();
  const sitelinksNavigation = generateSitelinksNavigationSchema();
  const organization = generateOrganizationSchema();
  const generalOrganization = generateGeneralOrganizationSchema();
  const breadcrumbs = generateBreadcrumbSchema(cleanPath, options?.breadcrumbs);
  const routePage = generateRouteSpecificSchema(cleanPath, options);

  const graphItems: Array<Record<string, unknown>> = [
    sitelinksWebSite,
    organization,
    generalOrganization,
    sitelinksNavigation,
    breadcrumbs,
    routePage,
  ];

  if (options?.customSchema) {
    if (Array.isArray(options.customSchema)) {
      graphItems.push(...options.customSchema);
    } else {
      graphItems.push(options.customSchema);
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graphItems,
  };
}

/**
 * Builds a standardized, type-safe meta & links structure for TanStack Router's `head()` hook.
 */
export function buildSeoHead(options: SeoOptions) {
  const formattedTitle = options.title.includes("KhelGrid")
    ? options.title
    : `${options.title} · KhelGrid`;

  const cleanPath = options.canonicalPath.startsWith("http")
    ? options.canonicalPath
    : `${SITE_URL}${options.canonicalPath.startsWith("/") ? options.canonicalPath : `/${options.canonicalPath}`}`;

  const imageUrl = options.image
    ? options.image.startsWith("http")
      ? options.image
      : `${SITE_URL}${options.image.startsWith("/") ? options.image : `/${options.image}`}`
    : DEFAULT_OG_IMAGE;

  const ogType = options.type || "website";

  const meta: Array<Record<string, string>> = [
    { title: formattedTitle },
    { name: "description", content: options.description },
    {
      name: "keywords",
      content: options.keywords ? `${options.keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS,
    },
    {
      name: "robots",
      content: options.noindex
        ? "noindex, follow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    // OpenGraph
    { property: "og:site_name", content: DEFAULT_SITE_NAME },
    { property: "og:title", content: formattedTitle },
    { property: "og:description", content: options.description },
    { property: "og:url", content: cleanPath },
    { property: "og:type", content: ogType },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: formattedTitle },
    { property: "og:locale", content: "en_IN" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: formattedTitle },
    { name: "twitter:description", content: options.description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: formattedTitle },
  ];

  if (ogType === "article") {
    if (options.publishedTime) {
      meta.push({ property: "article:published_time", content: options.publishedTime });
    }
    if (options.modifiedTime) {
      meta.push({ property: "article:modified_time", content: options.modifiedTime });
    }
    if (options.author) {
      meta.push({ property: "article:author", content: options.author });
    }
    if (options.section) {
      meta.push({ property: "article:section", content: options.section });
    }
  }

  const links = [{ rel: "canonical", href: cleanPath }];

  const jsonLd = generateFullRouteJsonLd(options.canonicalPath, options);
  const scripts: Array<Record<string, unknown>> = [
    {
      type: "application/ld+json",
      children: JSON.stringify(jsonLd),
    },
    ...(options.scripts || []),
  ];

  return { meta, links, scripts };
}

/**
 * Quick helper for unindexed, shallow, or authenticated/private pages.
 */
export function noindexMeta() {
  return { name: "robots", content: "noindex, follow" } as const;
}

export { SEOHead } from "@/components/SEOHead";
