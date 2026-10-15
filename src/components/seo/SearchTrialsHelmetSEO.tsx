import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import {
  getSearchTrialsSeoMetadata,
  type SearchTrialsHelmetSEOProps,
  type SearchTrialsSeoMetadata,
} from "@/lib/search-trials-seo";

export type { SearchTrialsHelmetSEOProps, SearchTrialsSeoMetadata };

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
  const seo = useMemo(
    () =>
      getSearchTrialsSeoMetadata({
        query,
        sport,
        city,
        sort,
        free,
        trialId,
        savedOnly,
        totalResults,
        featuredTrial,
      }),
    [query, sport, city, sort, free, trialId, savedOnly, totalResults, featuredTrial],
  );

  return (
    <Helmet>
      {/* 1. Document Title & Core Meta */}
      <title>{seo.pageTitle}</title>
      <meta name="description" content={seo.metaDescription} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonicalUrl} />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta name="author" content={DEFAULT_SITE_NAME} />

      {/* 2. OpenGraph Meta Tags (Facebook, WhatsApp, LinkedIn, Discord, Telegram) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:title" content={seo.pageTitle} />
      <meta property="og:description" content={seo.metaDescription} />
      <meta property="og:url" content={seo.canonicalUrl} />
      <meta property="og:image" content={seo.ogImageUrl} />
      <meta property="og:image:secure_url" content={seo.ogImageUrl} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content={
          seo.isCrpf
            ? "CRPF Meritorious Sportspersons Recruitment 2026 - 521 Vacancies - KhelGrid"
            : "KhelGrid Sports Selection Trials & Recruitment Opportunities"
        }
      />
      <meta property="og:locale" content="en_IN" />

      {/* 3. Twitter / X Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={seo.pageTitle} />
      <meta name="twitter:description" content={seo.metaDescription} />
      <meta name="twitter:image" content={seo.ogImageUrl} />
      <meta
        name="twitter:image:alt"
        content={
          seo.isCrpf
            ? "CRPF Meritorious Sportspersons Recruitment 2026 - Official Sports Quota"
            : "KhelGrid - India's Sports Opportunity Network"
        }
      />

      {/* 4. Schema.org JSON-LD Structured Data */}
      {seo.jsonLdData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default SearchTrialsHelmetSEO;
