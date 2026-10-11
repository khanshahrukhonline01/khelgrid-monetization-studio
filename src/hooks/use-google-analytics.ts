import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  analyticsConfig,
  googleTagIds,
  gtagScriptSrc,
  hasValidGoogleTag,
} from "@/config/analytics";
import {
  sendGtagEvent,
  trackPageView as libTrackPageView,
  trackUserEngagement as libTrackUserEngagement,
} from "@/lib/analytics";

const SCRIPT_ID = "google-tag-loader";

export interface UseGoogleAnalyticsOptions {
  /** Override whether analytics should send events (defaults to analyticsConfig.enabled) */
  enabled?: boolean;
}

export interface GoogleAnalyticsHookReturn {
  isInitialized: boolean;
  measurementId: string;
  googleTagId: string;
  activeIds: string[];
  trackPageView: (path?: string, title?: string) => void;
  trackUserEngagement: (action: string, params?: Record<string, unknown>) => void;
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
}

/**
 * Initializes Google Analytics 4 (GA4) and Google Tag using VITE_GA_MEASUREMENT_ID
 * and VITE_GOOGLE_TAG_ID. Tracks SPA page views and active user engagement
 * (engagement time and scroll milestones) safely without infinite re-renders.
 */
export function useGoogleAnalytics(
  options: UseGoogleAnalyticsOptions = {},
): GoogleAnalyticsHookReturn {
  const isEnabled = options.enabled ?? analyticsConfig.enabled;
  const isInitializedRef = useRef<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // TanStack Router location state with null-safe selectors
  const pathname = useRouterState({ select: (s) => s?.location?.pathname ?? "/" });
  const search = useRouterState({ select: (s) => s?.location?.searchStr ?? "" });

  // References for engagement calculations
  const routeStartTimeRef = useRef<number>(Date.now());
  const activeTimeAccumulatorRef = useRef<number>(0);
  const isTabActiveRef = useRef<boolean>(true);
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const scrollMilestonesHitRef = useRef<Set<number>>(new Set());

  // Stable IDs in use (memoized so reference never changes)
  const activeIds = useMemo(() => googleTagIds(), []);
  const measurementId = analyticsConfig.measurementId;
  const googleTagId = analyticsConfig.googleTagId;

  const isFirstMountRef = useRef<boolean>(true);

  // 1. Script injection and gtag setup (executed strictly once on client mount if not already present in HTML)
  useEffect(() => {
    if (typeof window === "undefined" || !hasValidGoogleTag() || isInitializedRef.current) {
      return;
    }

    try {
      // Prepare dataLayer and gtag shim
      window.dataLayer = window.dataLayer ?? [];
      if (!window.gtag) {
        window.gtag = (...args: unknown[]) => {
          if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push(args as unknown as Record<string, unknown>);
          }
        };
      }

      // Check if tag is already configured in static head HTML
      const alreadyInHead = Boolean(
        document.querySelector('script[src*="googletagmanager.com/gtag/js"]'),
      );

      if (!alreadyInHead) {
        window.gtag("js", new Date());
        for (const id of activeIds) {
          window.gtag("config", id);
        }

        let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement("script");
          script.id = SCRIPT_ID;
          script.async = true;
          script.src = gtagScriptSrc();
          document.head.appendChild(script);
        }
      }

      isInitializedRef.current = true;
      setIsInitialized(true);
    } catch (err) {
      console.warn("[analytics] Google tag initialization error:", err);
    }
  }, [activeIds]);

  // 2. Track SPA page views on subsequent client route changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasValidGoogleTag() || !isEnabled) {
      return;
    }

    // Skip the initial mount since head script sends initial page_view automatically
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    try {
      const currentPath = `${pathname}${search ?? ""}`;
      libTrackPageView(currentPath, typeof document !== "undefined" ? document.title : "");

      // Reset engagement timers & scroll milestones on page route change
      routeStartTimeRef.current = Date.now();
      activeTimeAccumulatorRef.current = 0;
      lastActiveTimestampRef.current = Date.now();
      scrollMilestonesHitRef.current.clear();
    } catch (err) {
      console.warn("[analytics] Page view tracking error:", err);
    }
  }, [pathname, search, isEnabled]);

  // 3. User engagement tracking: active time and visibility changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasValidGoogleTag() || !isEnabled) {
      return;
    }

    const sendEngagementPulse = (reason: string) => {
      try {
        const now = Date.now();
        let totalElapsed = activeTimeAccumulatorRef.current;
        if (isTabActiveRef.current) {
          totalElapsed += now - lastActiveTimestampRef.current;
        }

        // Only send if user spent meaningful time (> 1000ms)
        if (totalElapsed >= 1000) {
          libTrackUserEngagement("active_time", {
            engagement_time_msec: totalElapsed,
            page_path: `${pathname}${search ?? ""}`,
            reason,
          });
          // Reset accumulator after dispatch
          activeTimeAccumulatorRef.current = 0;
          lastActiveTimestampRef.current = now;
        }
      } catch {
        // Suppress pulse error
      }
    };

    const handleVisibilityChange = () => {
      try {
        const now = Date.now();
        if (document.hidden) {
          if (isTabActiveRef.current) {
            activeTimeAccumulatorRef.current += now - lastActiveTimestampRef.current;
            isTabActiveRef.current = false;
          }
          sendEngagementPulse("tab_hidden");
        } else {
          isTabActiveRef.current = true;
          lastActiveTimestampRef.current = now;
        }
      } catch {
        // Suppress
      }
    };

    const handlePageHide = () => {
      sendEngagementPulse("page_unload");
    };

    // Scroll depth milestones: 25%, 50%, 75%, 90%
    const handleScroll = () => {
      try {
        const docHeight = Math.max(
          document.documentElement?.scrollHeight || 0,
          document.body?.scrollHeight || 0,
        );
        const winHeight = window.innerHeight || 0;
        const scrollTop = window.scrollY || document.documentElement?.scrollTop || 0;

        if (docHeight <= winHeight || winHeight === 0) return;

        const scrollPercent = Math.round(((scrollTop + winHeight) / docHeight) * 100);
        const milestones = [25, 50, 75, 90];

        for (const m of milestones) {
          if (scrollPercent >= m && !scrollMilestonesHitRef.current.has(m)) {
            scrollMilestonesHitRef.current.add(m);
            sendGtagEvent(
              "scroll",
              {
                percent_scrolled: m,
                page_path: `${pathname}${search ?? ""}`,
              },
              "engagement",
            );
          }
        }
      } catch {
        // Suppress scroll calculation errors
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sendEngagementPulse("route_unmount");
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, search, isEnabled]);

  // Stable callback triggers
  const trackPageView = useCallback(
    (path?: string, title?: string) => {
      const resolvedPath = path ?? `${pathname}${search ?? ""}`;
      libTrackPageView(resolvedPath, title);
    },
    [pathname, search],
  );

  const trackUserEngagement = useCallback(
    (action: string, params?: Record<string, unknown>) => {
      libTrackUserEngagement(action, {
        page_path: `${pathname}${search ?? ""}`,
        ...params,
      });
    },
    [pathname, search],
  );

  const trackEvent = useCallback((eventName: string, params?: Record<string, unknown>) => {
    sendGtagEvent(eventName, params, "analytics");
  }, []);

  return {
    isInitialized,
    measurementId,
    googleTagId,
    activeIds,
    trackPageView,
    trackUserEngagement,
    trackEvent,
  };
}
