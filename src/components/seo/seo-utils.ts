import { SITE_URL, DEFAULT_SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * Resolves a full canonical URL from either an absolute URL or a relative path.
 */
export function resolveCanonicalUrl(url?: string): string {
  if (!url) {
    if (typeof window !== "undefined" && window.location) {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return SITE_URL;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Resolves a full image URL from either an absolute URL or a relative path.
 */
export function resolveImageUrl(img?: string): string {
  if (!img) return DEFAULT_OG_IMAGE;
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Formats the document title with the site brand name if needed.
 */
export function resolveTitle(title: string, siteName: string, formatTitle: boolean): string {
  if (!title) return siteName;
  if (!formatTitle || title.includes(siteName)) {
    return title;
  }
  return `${title} · ${siteName}`;
}
