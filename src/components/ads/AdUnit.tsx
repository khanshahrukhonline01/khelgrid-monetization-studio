import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  adsConfig,
  hasValidPublisherId,
  hasAdSenseEnvId,
  getEnvPublisherId,
  resolveAdSlot,
  type AdFormat,
  type AdSlotKey,
} from "@/config/ads";
import { useAdConsent } from "./AdConsent";
import { trackAdEvent } from "@/lib/ad-analytics";
import type { AdsByGoogleQueue } from "./adsbygoogle";

export type AdUnitProps = {
  /** Registry key from `AD_SLOTS`, or a raw numeric slot id. */
  adSlot: AdSlotKey | string;
  adFormat?: AdFormat;
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Reserved height (prevents CLS). Number = px, or any CSS length. */
  minHeight?: number | string;
  /** Accessible name for the ad region. */
  ariaLabel?: string;
  /** Skip the IntersectionObserver and request immediately (above-the-fold only). */
  eager?: boolean;
  /** `data-ad-layout-key` for in-feed/in-article fluid units. */
  layoutKey?: string;
  /** Optional label override; set to null to hide the "Advertisement" caption. */
  label?: string | null;
};

type Status = "idle" | "reserved" | "requested" | "filled" | "unavailable";

/**
 * A single AdSense unit.
 *
 * Guarantees:
 * - never pushes twice for the same element (mount + script + init guards)
 * - never requests before consent is resolved
 * - reserves its own height so ads cannot cause layout shift
 * - degrades to a neutral placeholder (ad blocker, no fill, no publisher ID)
 */
function AdUnitBase({
  adSlot,
  adFormat = adsConfig.defaultFormat,
  responsive = adsConfig.defaultResponsive,
  className = "",
  style,
  minHeight = 120,
  ariaLabel = "Advertisement",
  eager = false,
  layoutKey,
  label = "Advertisement",
}: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [inView, setInView] = useState(eager);

  const { canServeAds } = useAdConsent();
  const slotId = resolveAdSlot(adSlot);
  const configured = hasAdSenseEnvId() && slotId.length > 0;
  // With Auto Ads on, Google owns placement; manual units stay inert.
  const manualAdsEnabled = configured && !adsConfig.enableAutoAds && canServeAds;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Lazy load: only observe when we will actually request an ad.
  useEffect(() => {
    if (eager || inView || !manualAdsEnabled) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: adsConfig.lazyRootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager, inView, manualAdsEnabled]);

  // Single, guarded push per element — strictly client-side after hydration.
  useEffect(() => {
    if (!isHydrated || !manualAdsEnabled || !inView || pushedRef.current) return;
    const ins = insRef.current;
    if (!ins) return;
    // Google marks initialized elements — respect it (also survives HMR).
    if (ins.getAttribute("data-adsbygoogle-status")) {
      pushedRef.current = true;
      return;
    }

    try {
      const queue = (window.adsbygoogle ??= [] as unknown as AdsByGoogleQueue);
      queue.push({});
      pushedRef.current = true;
      setStatus("requested");
      trackAdEvent({ event: "ad_request", slot: slotId, format: adFormat });
    } catch {
      setStatus("unavailable");
    }
  }, [manualAdsEnabled, inView, slotId, adFormat, isHydrated]);

  // Fill / no-fill / blocked detection — used only for graceful fallback UI.
  useEffect(() => {
    if (status !== "requested") return;
    const ins = insRef.current;
    if (!ins) return;
    const timer = window.setTimeout(() => {
      const state = ins.getAttribute("data-ad-status");
      if (state === "filled" || ins.clientHeight > 20) {
        setStatus("filled");
        trackAdEvent({ event: "ad_impression", slot: slotId, format: adFormat });
      } else {
        setStatus("unavailable");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [status, slotId, adFormat]);

  const reserved: CSSProperties = {
    minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
  };

  if (!configured) {
    if (adsConfig.enableTestMode) {
      return (
        <div
          role="complementary"
          aria-label={ariaLabel}
          className={`my-6 w-full max-w-full overflow-hidden ${className}`}
          style={{ ...reserved, ...style }}
        >
          <AdPlaceholder minHeight={reserved.minHeight as string} />
        </div>
      );
    }
    return null;
  }

  if (status === "unavailable") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="complementary"
      aria-label={ariaLabel}
      data-ad-slot={slotId || "unconfigured"}
      className={`my-6 w-full max-w-full overflow-hidden ${className}`}
      style={{ ...reserved, ...style }}
    >
      {label && adsConfig.showAdLabel && (
        <div className="mb-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          {label}
        </div>
      )}

      {!manualAdsEnabled || !isHydrated ? (
        adsConfig.enableTestMode ? (
          <AdPlaceholder minHeight={reserved.minHeight as string} />
        ) : null
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ ...adsConfig.defaultStyle, ...reserved }}
          data-ad-client={getEnvPublisherId() || adsConfig.publisherId}
          data-ad-slot={slotId}
          data-ad-format={adFormat}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          {...(responsive ? { "data-full-width-responsive": "true" } : {})}
          {...(adsConfig.enableTestMode ? { "data-adtest": "on" } : {})}
        />
      )}
    </div>
  );
}

/** Neutral, theme-aware reserved block shown when no ad can render. */
export function AdPlaceholder({ minHeight = "120px" }: { minHeight?: string }) {
  return (
    <div
      aria-hidden="true"
      className="grid w-full place-items-center rounded-xl border border-dashed border-border/60 bg-secondary/20"
      style={{ minHeight }}
    >
      <span className="text-[11px] text-muted-foreground/60">Ad space</span>
    </div>
  );
}

export const AdUnit = memo(AdUnitBase);
