import { useEffect, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  generateFullRouteJsonLd,
  generateBreadcrumbSchema,
  generateSitelinksSearchboxSchema,
  generateSitelinksNavigationSchema,
  generateOrganizationSchema,
  SITE_URL,
  DEFAULT_SITE_NAME,
} from "@/lib/seo";

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  keywords?: string;
  breadcrumbs?: Array<{ name: string; path?: string }>;
  customSchema?: Record<string, unknown> | Array<Record<string, unknown>>;
  faqs?: Array<{ question?: string; q?: string; answer?: string; a?: string }>;
}

/**
 * SEOHead dynamically manages search engine optimization & JSON-LD structured data.
 *
 * It generates and injects Schema.org compliant structured data for:
 * 1. Breadcrumbs (`BreadcrumbList`) mapped dynamically to every page route.
 * 2. Sitelinks Searchbox (`WebSite` with `SearchAction` potentialAction).
 * 3. Primary site navigation sitelinks (`ItemList` of `SiteNavigationElement`).
 * 4. Organization knowledge graph (`SportsOrganization`).
 * 5. Route-specific rich entities (e.g., `SearchResultsPage`, `WebApplication`, `AboutPage`, etc.).
 */
export function SEOHead(props: SEOHeadProps = {}) {
  // Gracefully retrieve pathname from TanStack Router if available
  let routerPathname: string | undefined;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routerPathname = useRouterState({
      select: (s) => s.location?.pathname,
    });
  } catch {
    routerPathname = undefined;
  }

  const activePathname = props.canonicalPath || routerPathname || "/";

  // Build FAQPage schema if faqs prop is supplied
  const faqSchema = useMemo(() => {
    if (!props.faqs || props.faqs.length === 0) return null;
    return {
      "@type": "FAQPage",
      mainEntity: props.faqs.map((f) => ({
        "@type": "Question",
        name: f.question || f.q || "",
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer || f.a || "",
        },
      })),
    };
  }, [props.faqs]);

  // Combine custom schemas
  const combinedCustomSchema = useMemo(() => {
    const list: Array<Record<string, unknown>> = [];
    if (props.customSchema) {
      if (Array.isArray(props.customSchema)) {
        list.push(...props.customSchema);
      } else {
        list.push(props.customSchema);
      }
    }
    if (faqSchema) {
      list.push(faqSchema);
    }
    return list.length > 0 ? list : undefined;
  }, [props.customSchema, faqSchema]);

  // Generate complete Schema.org @graph
  const jsonLdData = useMemo(() => {
    return generateFullRouteJsonLd(activePathname, {
      title: props.title || DEFAULT_SITE_NAME,
      description: props.description || "",
      canonicalPath: activePathname,
      type: props.type,
      image: props.image,
      keywords: props.keywords,
      breadcrumbs: props.breadcrumbs,
      customSchema: combinedCustomSchema,
    });
  }, [
    activePathname,
    props.title,
    props.description,
    props.type,
    props.image,
    props.keywords,
    props.breadcrumbs,
    combinedCustomSchema,
  ]);

  const jsonLdString = useMemo(() => JSON.stringify(jsonLdData), [jsonLdData]);

  // Client-side effect: sync JSON-LD script directly in document.head
  useEffect(() => {
    if (typeof document === "undefined") return;

    const SCRIPT_ID = "khelgrid-dynamic-jsonld";
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = jsonLdString;

    // Synchronize document.title if custom title was specified
    if (props.title) {
      const formattedTitle = props.title.includes(DEFAULT_SITE_NAME)
        ? props.title
        : `${props.title} · ${DEFAULT_SITE_NAME}`;
      document.title = formattedTitle;
    }

    // Synchronize canonical link tag in document.head
    const fullCanonical = activePathname.startsWith("http")
      ? activePathname
      : `${SITE_URL}${activePathname.startsWith("/") ? activePathname : `/${activePathname}`}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullCanonical;

    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = fullCanonical;

    if (props.description) {
      const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (descMeta) {
        descMeta.content = props.description;
      }
      const ogDesc = document.querySelector(
        'meta[property="og:description"]',
      ) as HTMLMetaElement | null;
      if (ogDesc) {
        ogDesc.content = props.description;
      }
    }
  }, [jsonLdString, props.title, props.description, activePathname]);

  return (
    <script
      id="khelgrid-dynamic-jsonld-ssr"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}

export default SEOHead;
