import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { resolveCanonicalUrl, resolveImageUrl, resolveTitle } from "./seo-utils";

export interface SEOProps {
  /** Page title (e.g. "About Us" or "CRPF Sports Recruitment 2026") */
  title: string;
  /** Meta description for search engine snippets and social sharing */
  description: string;
  /** Canonical URL or relative path (e.g. "/about", "https://khelgrid.com/about") */
  canonicalUrl?: string;
  /** Alias for canonicalUrl */
  canonical?: string;
  /** Meta keywords as a comma-separated string or array of strings */
  keywords?: string | string[];
  /** OpenGraph & Twitter Card image URL */
  ogImage?: string;
  /** Alias for ogImage */
  image?: string;
  /** Alt text for social share image */
  imageAlt?: string;
  /** OpenGraph type (default: "website") */
  ogType?: "website" | "article" | "profile" | "book" | "music.song";
  /** Alias for ogType */
  type?: "website" | "article" | "profile" | "book" | "music.song";
  /** Prevent indexing by search engines */
  noindex?: boolean;
  /** Prevent following links by search engines */
  nofollow?: boolean;
  /** Explicit robots directive override (e.g. "index, follow", "noindex, nofollow") */
  robots?: string;
  /** Custom brand / site name (default: "KhelGrid") */
  siteName?: string;
  /** Whether to append the brand name to the title if not already present (default: true) */
  formatTitle?: boolean;
  /** Twitter card type (default: "summary_large_image") */
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  /** Twitter username / handle (default: "@KhelGrid") */
  twitterHandle?: string;
  /** Content author */
  author?: string;
  /** ISO datetime for published article */
  publishedTime?: string;
  /** ISO datetime for modified article */
  modifiedTime?: string;
  /** Primary locale (default: "en_IN") */
  locale?: string;
  /** Alternate locales (e.g. ["hi_IN"]) */
  alternateLocales?: string[];
  /** Single schema object or array of Schema.org JSON-LD objects */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Alias for jsonLd */
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Alias for jsonLd */
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Breadcrumb items to automatically generate BreadcrumbList schema */
  breadcrumbs?: Array<{ name: string; url?: string; path?: string }>;
  /** FAQ items to automatically generate FAQPage schema */
  faqs?: Array<{ question: string; answer: string }>;
  /** Additional React / Helmet children elements (extra meta, links, scripts) */
  children?: React.ReactNode;
}

/**
 * Reusable SEO component using react-helmet-async that accepts props for
 * title, description, and canonical URL to standardize meta tags across
 * the application's pages.
 *
 * It manages:
 * - HTML title and standard meta description
 * - Canonical link tag with absolute URL resolution
 * - Robots indexing directives (index/noindex, follow/nofollow)
 * - Open Graph protocol meta tags (Facebook, WhatsApp, LinkedIn, Discord)
 * - Twitter / X Card meta tags
 * - Schema.org JSON-LD structured data scripts (Custom, BreadcrumbList, FAQPage)
 * - Extensible child tags within react-helmet-async
 */
export function SEO({
  title,
  description,
  canonicalUrl,
  canonical,
  keywords,
  ogImage,
  image,
  imageAlt,
  ogType,
  type = "website",
  noindex = false,
  nofollow,
  robots,
  siteName = DEFAULT_SITE_NAME,
  formatTitle = true,
  twitterCard = "summary_large_image",
  twitterHandle = TWITTER_HANDLE,
  author,
  publishedTime,
  modifiedTime,
  locale = "en_IN",
  alternateLocales,
  jsonLd,
  schema,
  structuredData,
  breadcrumbs,
  faqs,
  children,
}: SEOProps) {
  // Resolve canonical URL (accept either canonicalUrl or canonical)
  const effectiveCanonical = useMemo(
    () => resolveCanonicalUrl(canonicalUrl || canonical),
    [canonicalUrl, canonical],
  );

  // Resolve image URL (accept either ogImage or image)
  const effectiveImage = useMemo(() => resolveImageUrl(ogImage || image), [ogImage, image]);

  // Resolve title
  const effectiveTitle = useMemo(
    () => resolveTitle(title, siteName, formatTitle),
    [title, siteName, formatTitle],
  );

  // Resolve type
  const effectiveType = ogType || type;

  // Resolve keywords
  const effectiveKeywords = useMemo(() => {
    if (!keywords) return undefined;
    return Array.isArray(keywords) ? keywords.filter(Boolean).join(", ") : keywords;
  }, [keywords]);

  // Resolve robots directive
  const robotsDirective = useMemo(() => {
    if (robots) return robots;
    if (noindex) {
      return nofollow === false ? "noindex, follow" : "noindex, nofollow";
    }
    if (nofollow) return "index, nofollow";
    return "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  }, [robots, noindex, nofollow]);

  // Automatic BreadcrumbList schema
  const breadcrumbSchema = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: resolveCanonicalUrl(crumb.url || crumb.path || "/"),
      })),
    };
  }, [breadcrumbs]);

  // Automatic FAQPage schema
  const faqSchema = useMemo(() => {
    if (!faqs || faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  }, [faqs]);

  // Normalize JSON-LD schemas
  const schemas = useMemo(() => {
    const raw = jsonLd ?? schema ?? structuredData;
    const list: Array<Record<string, unknown>> = [];
    if (raw) {
      if (Array.isArray(raw)) {
        list.push(...raw);
      } else {
        list.push(raw);
      }
    }
    if (breadcrumbSchema) {
      list.push(breadcrumbSchema);
    }
    if (faqSchema) {
      list.push(faqSchema);
    }
    return list;
  }, [jsonLd, schema, structuredData, breadcrumbSchema, faqSchema]);

  return (
    <Helmet>
      {/* 1. Document Title & Primary Search Meta */}
      <title>{effectiveTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={effectiveCanonical} />
      <meta name="robots" content={robotsDirective} />
      {effectiveKeywords && <meta name="keywords" content={effectiveKeywords} />}
      {author && <meta name="author" content={author} />}

      {/* 2. Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, Discord, Slack) */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={effectiveType} />
      <meta property="og:title" content={effectiveTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={effectiveCanonical} />
      <meta property="og:image" content={effectiveImage} />
      <meta property="og:image:secure_url" content={effectiveImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:locale" content={locale} />
      {alternateLocales?.map((altLocale) => (
        <meta
          key={`og-alt-locale-${altLocale}`}
          property="og:locale:alternate"
          content={altLocale}
        />
      ))}

      {/* Article-specific Open Graph tags */}
      {effectiveType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {effectiveType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {effectiveType === "article" && author && <meta property="article:author" content={author} />}

      {/* 3. Twitter / X Cards */}
      <meta name="twitter:card" content={twitterCard} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={effectiveImage} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {/* 4. Schema.org JSON-LD Structured Data */}
      {schemas.map((s, idx) => (
        <script key={`seo-jsonld-${idx}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}

      {/* 5. Custom children extensions */}
      {children}
    </Helmet>
  );
}

export default SEO;
