import React, { useEffect, useState, useRef, type ReactNode } from "react";
import { hasAdSenseEnvId, getEnvPublisherId, adsConfig } from "@/config/ads";
import { useAdConsent } from "./AdConsent";
import { adSenseService } from "@/services/adsense.service";
import { AdPlaceholder } from "./AdUnit";

export interface AdSenseWrapperProps {
  /**
   * Children components (e.g. `<AdUnit>`, `<BannerAd>`, or ad slots) to render
   * only when AdSense is configured, hydrated, and active.
   * If omitted, this wrapper acts as an invisible script loader and lifecycle manager.
   */
  children?: ReactNode;

  /**
   * Optional custom fallback UI to display when AdSense is disabled, unconfigured,
   * or during hydration.
   */
  fallback?: ReactNode;

  /**
   * Whether to show the standard neutral `AdPlaceholder` when VITE_GOOGLE_ADSENSE_ID is missing.
   * Defaults to true in test mode / development, false in production.
   */
  placeholderFallback?: boolean;

  /**
   * Minimum reserved height for placeholder to prevent Cumulative Layout Shift (CLS).
   * Default: "120px".
   */
  minHeight?: number | string;

  /**
   * Whether this wrapper instance should ensure the Google AdSense script is loaded.
   * Default: true.
   */
  loadScript?: boolean;

  /**
   * Optional wrapper container class name.
   */
  className?: string;
}

export interface AdSenseStatus {
  /** True if VITE_GOOGLE_ADSENSE_ID is present, non-empty, and valid. */
  isConfigured: boolean;
  /** True once client hydration is complete (safe from hydration mismatch). */
  isHydrated: boolean;
  /** The normalized publisher ID from environment, or null if missing. */
  publisherId: string | null;
  /** True if configured, hydrated, and user consent allows loading scripts. */
  canLoadScript: boolean;
  /** True once the AdSense script tag is injected and confirmed. */
  scriptLoaded: boolean;
  /** Any error encountered during AdSense initialization or script injection. */
  error: Error | null;
}

/**
 * Hook to inspect the runtime AdSense state, hydration status, and configuration.
 */
export function useAdSenseStatus(): AdSenseStatus {
  const [isHydrated, setIsHydrated] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { canLoadScript: consentAllows } = useAdConsent();
  const isConfigured = hasAdSenseEnvId();
  const publisherId = isConfigured ? getEnvPublisherId() : null;

  useEffect(() => {
    setIsHydrated(true);

    if (isConfigured && typeof window !== "undefined") {
      const state = adSenseService.getState();
      if (state.scriptLoaded) {
        setScriptLoaded(true);
      }
    }
  }, [isConfigured]);

  return {
    isConfigured,
    isHydrated,
    publisherId,
    canLoadScript: isConfigured && isHydrated && consentAllows,
    scriptLoaded,
    error,
  };
}

/**
 * Conditional rendering wrapper for Google AdSense.
 *
 * Guarantees:
 * 1. Only loads the AdSense script if `VITE_GOOGLE_ADSENSE_ID` is present and non-empty in the environment.
 * 2. Prevents hydration errors by deferring script injection and ad slot rendering until client hydration completes.
 * 3. Prevents "missing variable" crashes by gracefully falling back to placeholders or empty render.
 * 4. Respects user consent (GDPR / UMP / TCF) before script execution.
 * 5. Handles mobile container safeguards (Cordova/Capacitor webviews).
 */
export function AdSenseWrapper({
  children,
  fallback = null,
  placeholderFallback = adsConfig.enableTestMode,
  minHeight = "120px",
  loadScript = true,
  className = "",
}: AdSenseWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const initAttempted = useRef(false);

  const { canLoadScript: consentAllows, nonPersonalized } = useAdConsent();
  const isConfigured = hasAdSenseEnvId();
  const envPublisherId = isConfigured ? getEnvPublisherId() : "";

  // 1. Hydration safeguard: strictly client-side mounting
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 2. Conditional script loading: ONLY when VITE_GOOGLE_ADSENSE_ID is present
  useEffect(() => {
    if (!isHydrated || !loadScript) return;

    if (!isConfigured) {
      if (import.meta.env.DEV) {
        console.info(
          "[AdSenseWrapper] Google AdSense is disabled: VITE_GOOGLE_ADSENSE_ID is not configured in environment.",
        );
      }
      return;
    }

    if (!consentAllows || initAttempted.current) return;
    initAttempted.current = true;

    try {
      adSenseService.initialize({
        publisherId: envPublisherId,
        onError: (err) => {
          setLoadError(err);
        },
      });

      adSenseService.loadScript(nonPersonalized).catch((err) => {
        setLoadError(err instanceof Error ? err : new Error(String(err)));
      });
    } catch (err) {
      setLoadError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [isHydrated, loadScript, isConfigured, consentAllows, nonPersonalized, envPublisherId]);

  // If used purely as a script loader without children, return nothing
  if (!children) {
    return null;
  }

  // During SSR or before hydration completes, render safe fallback to prevent hydration mismatch
  if (!isHydrated) {
    if (fallback) return <>{fallback}</>;
    if (placeholderFallback) {
      const heightStr = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      return (
        <div className={className} style={{ minHeight: heightStr }}>
          <AdPlaceholder minHeight={heightStr} />
        </div>
      );
    }
    return null;
  }

  // If VITE_GOOGLE_ADSENSE_ID is not configured in environment
  if (!isConfigured || loadError) {
    if (fallback) return <>{fallback}</>;
    if (placeholderFallback) {
      const heightStr = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
      return (
        <div className={className} style={{ minHeight: heightStr }}>
          <AdPlaceholder minHeight={heightStr} />
        </div>
      );
    }
    return null;
  }

  // Configured and hydrated: safely render AdSense components
  return <>{children}</>;
}
