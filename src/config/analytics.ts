/**
 * Google tag (gtag.js) configuration for KhelGrid.
 *
 * Single authorized tracking ID:
 *   - G-BETWHB02PX  → GA4 measurement ID
 */
const DEFAULT_GA_ID = "G-BETWHB02PX";

const GA_ID_RE = /^G-[A-Z0-9-]+$/i;

export const analyticsConfig = {
  /** GA4 measurement ID (sole authorized tracking ID). */
  measurementId:
    ((import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined) ?? "").trim() ||
    DEFAULT_GA_ID,
  /** Deprecated alias maintained for backward compatibility; points strictly to measurementId. */
  googleTagId:
    ((import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined) ?? "").trim() ||
    DEFAULT_GA_ID,
  /** Analytics is enabled whenever a valid tag ID exists unless explicitly disabled with VITE_ANALYTICS_ENABLED=false */
  enabled: import.meta.env["VITE_ANALYTICS_ENABLED"] !== "false",
} as const;

/** Every verified tag ID that should be configured on load. Strictly contains only the verified ID. */
export function googleTagIds(): string[] {
  const id = analyticsConfig.measurementId?.trim();
  return id && GA_ID_RE.test(id) ? [id] : [];
}

export function hasValidGoogleTag(): boolean {
  return googleTagIds().length > 0;
}

/** The single loader script URL. */
export function gtagScriptSrc(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${googleTagIds()[0] || DEFAULT_GA_ID}`;
}
