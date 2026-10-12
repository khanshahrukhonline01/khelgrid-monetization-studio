/**
 * Single source of truth for Google AdSense on KhelGrid.
 *
 * The publisher ID comes from the environment (`VITE_GOOGLE_ADSENSE_ID`) so it
 * is never hardcoded in more than one place. Publisher IDs are public values
 * (they ship in the page HTML), so a VITE_ variable is the correct home for it.
 *
 * .env / .env.production
 *   VITE_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
 */

/** KhelGrid's live AdSense publisher ID (public value; env var can override it). */
const DEFAULT_PUBLISHER_ID = "ca-pub-8352691151177209";

/** ca-pub-XXXXXXXXXXXXXXXX (16 digits). */
const PUBLISHER_ID_RE = /^ca-pub-\d{16}$/;

/**
 * Normalizes publisher IDs: strips spaces, and prepends 'ca-' if user provided 'pub-XXXXXXXXXXXXXXXX'.
 */
export function normalizePublisherId(id: string): string {
  const trimmed = id.trim();
  if (trimmed.startsWith("pub-")) {
    return `ca-${trimmed}`;
  }
  return trimmed;
}

const RAW_PUBLISHER_ID = normalizePublisherId(
  ((import.meta.env["VITE_GOOGLE_ADSENSE_ID"] as string | undefined) ?? "").trim() ||
    DEFAULT_PUBLISHER_ID,
);

/**
 * Returns the raw publisher ID explicitly set in `VITE_GOOGLE_ADSENSE_ID`, trimmed and normalized.
 * Returns empty string if not defined in the environment.
 */
export function getEnvPublisherId(): string {
  const envId = (import.meta.env["VITE_GOOGLE_ADSENSE_ID"] as string | undefined)?.trim() ?? "";
  return envId ? normalizePublisherId(envId) : "";
}

/**
 * Checks whether `VITE_GOOGLE_ADSENSE_ID` is explicitly present in the environment
 * and matches the valid `ca-pub-XXXXXXXXXXXXXXXX` format.
 */
export function hasAdSenseEnvId(): boolean {
  const envId = getEnvPublisherId();
  return envId.length > 0 && PUBLISHER_ID_RE.test(envId);
}

/**
 * Alias for `hasAdSenseEnvId()`. Used by UI wrappers to conditionally enable AdSense.
 */
export function isAdSenseConfigured(): boolean {
  return hasAdSenseEnvId();
}

export type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

export const adsConfig = {
  /** Google publisher ID, e.g. ca-pub-1234567890123456. Empty = not approved yet. */
  publisherId: RAW_PUBLISHER_ID.trim(),

  /**
   * Auto Ads: when true only the global AdSense script is loaded and Google
   * places the ads. Manual `<AdUnit>` components still render placeholders so
   * layout stays stable, but they do not push their own ad requests.
   */
  enableAutoAds: (import.meta.env["VITE_ADSENSE_AUTO_ADS"] as string | undefined) === "true",

  /** Defaults applied by every ad component unless overridden per instance. */
  defaultFormat: "auto" as AdFormat,
  defaultResponsive: true,
  defaultStyle: { display: "block" } as React.CSSProperties,

  /**
   * Test mode marks requests with `data-adtest="on"` so impressions are not
   * billed / counted. Automatically on in development.
   */
  enableTestMode: import.meta.env.DEV,

  /** Lazy-load ads this many pixels before they enter the viewport. */
  lazyRootMargin: "300px",

  /** Show the "Advertisement" label above each unit (policy-friendly). */
  showAdLabel: true,
} as const;

/**
 * Ad slot registry. Add a slot here once, reference it by key everywhere.
 * Values are the numeric slot IDs from the AdSense dashboard.
 * Slots left as "" render a placeholder instead of an ad request.
 */
export const AD_SLOTS = {
  homeBelowHero: import.meta.env["VITE_ADSLOT_HOME_HERO"] ?? "",
  homeMidContent: import.meta.env["VITE_ADSLOT_HOME_MID"] ?? "",
  homeFooter: import.meta.env["VITE_ADSLOT_HOME_FOOTER"] ?? "",
  headerBanner: import.meta.env["VITE_ADSLOT_HEADER"] ?? "",
  footerBanner: import.meta.env["VITE_ADSLOT_FOOTER"] ?? "",
  sidebarTop: import.meta.env["VITE_ADSLOT_SIDEBAR_TOP"] ?? "",
  sidebarMid: import.meta.env["VITE_ADSLOT_SIDEBAR_MID"] ?? "",
  sidebarBottom: import.meta.env["VITE_ADSLOT_SIDEBAR_BOTTOM"] ?? "",
  inArticleTop: import.meta.env["VITE_ADSLOT_ARTICLE_TOP"] ?? "",
  inArticleMid: import.meta.env["VITE_ADSLOT_ARTICLE_MID"] ?? "",
  inArticleEnd: import.meta.env["VITE_ADSLOT_ARTICLE_END"] ?? "",
  listingInline: import.meta.env["VITE_ADSLOT_LISTING_INLINE"] ?? "",
  searchInline: import.meta.env["VITE_ADSLOT_SEARCH_INLINE"] ?? "",
  mobileSticky: import.meta.env["VITE_ADSLOT_MOBILE_STICKY"] ?? "",
  modalSponsored: import.meta.env["VITE_ADSLOT_MODAL_SPONSORED"] ?? "",
} as const satisfies Record<string, string>;

export type AdSlotKey = keyof typeof AD_SLOTS;

/** True once a valid publisher ID is configured (i.e. the site is approved). */
export function hasValidPublisherId(): boolean {
  return PUBLISHER_ID_RE.test(adsConfig.publisherId);
}

/** URL of the single global AdSense loader script. */
export function adsenseScriptSrc(): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.publisherId}`;
}

/** Resolve a registry key (or a raw slot id) to a slot id. */
export function resolveAdSlot(slot: AdSlotKey | string): string {
  return (AD_SLOTS as Record<string, string>)[slot] ?? slot;
}
