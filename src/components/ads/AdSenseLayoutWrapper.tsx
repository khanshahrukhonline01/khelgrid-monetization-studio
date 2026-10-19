import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  hasAdSenseEnvId,
  getEnvPublisherId,
  adsConfig,
  normalizePublisherId,
  type AdSlotKey,
} from "@/config/ads";
import { AdSenseWrapper } from "./AdSenseWrapper";
import { BannerAd, InArticleAd, ResponsiveAd, SidebarAd, MobileStickyAd } from "./AdUnits";
import { AdPlaceholder } from "./AdUnit";

export interface AdSenseLayoutConfig {
  /** The active AdSense Publisher ID derived from VITE_GOOGLE_ADSENSE_ID */
  publisherId: string;
  /** Whether VITE_GOOGLE_ADSENSE_ID is present and valid */
  isConfigured: boolean;
  /** Whether Google Auto Ads is enabled */
  isAutoAdsEnabled: boolean;
  /** Whether top banner automatic insertion is active */
  topBannerActive: boolean;
  /** Whether mid-content automatic insertion is active */
  midContentActive: boolean;
  /** Whether footer banner automatic insertion is active */
  footerBannerActive: boolean;
}

const AdSenseLayoutContext = createContext<AdSenseLayoutConfig>({
  publisherId: "",
  isConfigured: false,
  isAutoAdsEnabled: false,
  topBannerActive: false,
  midContentActive: false,
  footerBannerActive: false,
});

/**
 * Hook to access the layout's AdSense configuration and auto-insertion state.
 */
export function useAdSenseLayout(): AdSenseLayoutConfig {
  return useContext(AdSenseLayoutContext);
}

export interface AdSenseLayoutWrapperProps {
  /**
   * Main page or layout children to render.
   */
  children: ReactNode;

  /**
   * Whether to automatically insert a top leaderboard/banner ad above main content.
   * Defaults to true.
   */
  enableTopBanner?: boolean;

  /**
   * Whether to automatically insert an in-feed / mid-content ad unit.
   * Defaults to false (can be enabled for content-heavy or feed pages).
   */
  enableMidContent?: boolean;

  /**
   * Whether to automatically insert a footer banner ad above the site footer.
   * Defaults to true.
   */
  enableFooterBanner?: boolean;

  /**
   * Whether to enable a desktop sidebar ad placement.
   * Defaults to false.
   */
  enableSidebar?: boolean;

  /**
   * Whether to automatically insert a dismissible mobile sticky bottom anchor ad.
   * Defaults to true on mobile viewports.
   */
  enableMobileSticky?: boolean;

  /**
   * Custom AdSense Publisher ID override (defaults to VITE_GOOGLE_ADSENSE_ID from .env).
   */
  publisherId?: string;

  /**
   * Custom AdSense slot key or numeric ID for the top banner.
   * Defaults to "headerBanner".
   */
  topSlot?: AdSlotKey | string;

  /**
   * Custom AdSense slot key or numeric ID for the mid-content ad.
   * Defaults to "inArticleMid".
   */
  midSlot?: AdSlotKey | string;

  /**
   * Custom AdSense slot key or numeric ID for the footer banner.
   * Defaults to "footerBanner".
   */
  footerSlot?: AdSlotKey | string;

  /**
   * Custom AdSense slot key or numeric ID for the desktop sidebar ad.
   * Defaults to "sidebarTop".
   */
  sidebarSlot?: AdSlotKey | string;

  /**
   * Custom AdSense slot key or numeric ID for the mobile sticky ad.
   * Defaults to "mobileSticky".
   */
  mobileStickySlot?: AdSlotKey | string;

  /**
   * Outer layout container CSS classes.
   */
  className?: string;

  /**
   * Main content area container CSS classes.
   */
  contentClassName?: string;

  /**
   * Whether to render placeholder blocks in development/test mode when AdSense ID is absent.
   * Defaults to true in test mode.
   */
  showPlaceholders?: boolean;
}

/**
 * Comprehensive Google AdSense layout wrapper component.
 *
 * It utilizes `VITE_GOOGLE_ADSENSE_ID` from the environment (`.env`) and
 * implements automatic ad insertion across the application layout:
 * - Top responsive banner placement (below header/navigation)
 * - In-feed / mid-content ad placement
 * - High-visibility pre-footer banner placement
 * - Desktop sidebar skyscraper placement
 * - Mobile dismissible bottom anchor placement
 *
 * Also manages Google Auto Ads harmonisation, hydration safety, and zero Cumulative Layout Shift (CLS).
 */
export function AdSenseLayoutWrapper({
  children,
  enableTopBanner = true,
  enableMidContent = false,
  enableFooterBanner = true,
  enableSidebar = false,
  enableMobileSticky = true,
  publisherId: customPublisherId,
  topSlot = "headerBanner",
  midSlot = "inArticleMid",
  footerSlot = "footerBanner",
  sidebarSlot = "sidebarTop",
  mobileStickySlot = "mobileSticky",
  className = "",
  contentClassName = "",
  showPlaceholders = adsConfig.enableTestMode,
}: AdSenseLayoutWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 1. Resolve Publisher ID from props or .env (VITE_GOOGLE_ADSENSE_ID)
  const envPublisherId = getEnvPublisherId();
  const effectivePublisherId = useMemo(() => {
    if (customPublisherId && customPublisherId.trim()) {
      return normalizePublisherId(customPublisherId.trim());
    }
    return envPublisherId || adsConfig.publisherId;
  }, [customPublisherId, envPublisherId]);

  const isConfigured = hasAdSenseEnvId() || Boolean(customPublisherId?.trim());
  const isAutoAdsEnabled = adsConfig.enableAutoAds;

  const layoutContextValue: AdSenseLayoutConfig = useMemo(
    () => ({
      publisherId: effectivePublisherId,
      isConfigured,
      isAutoAdsEnabled,
      topBannerActive: enableTopBanner && !isAutoAdsEnabled,
      midContentActive: enableMidContent && !isAutoAdsEnabled,
      footerBannerActive: enableFooterBanner && !isAutoAdsEnabled,
    }),
    [
      effectivePublisherId,
      isConfigured,
      isAutoAdsEnabled,
      enableTopBanner,
      enableMidContent,
      enableFooterBanner,
    ],
  );

  return (
    <AdSenseLayoutContext.Provider value={layoutContextValue}>
      {/* 1. Global script loader & lifecycle manager */}
      <AdSenseWrapper loadScript={true} />

      {/* 2. Layout container with children and automatic ad insertion */}
      <div
        data-testid="adsense-layout-wrapper"
        data-publisher-id={effectivePublisherId}
        className={`flex flex-col min-h-screen w-full min-w-0 max-w-full ${className}`}
      >
        {/* A. Automatic Top Banner Ad Slot */}
        {enableTopBanner && !isAutoAdsEnabled && (
          <aside
            aria-label="Sponsored advertisement"
            className="w-full max-w-7xl mx-auto px-3 sm:px-4 pt-3 pb-1"
          >
            <div className="overflow-hidden rounded-xl border border-border/40 bg-card/40 p-2 sm:p-3 text-center">
              <BannerAd adSlot={topSlot} minHeight={90} className="w-full max-w-[728px] mx-auto" />
            </div>
          </aside>
        )}

        {/* B. Main Layout Body (with optional desktop sidebar) */}
        <div className="flex-1 w-full min-w-0 max-w-full">
          {enableSidebar ? (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className={`min-w-0 lg:col-span-8 xl:col-span-9 ${contentClassName}`}>
                {children}

                {/* Automatic Mid-Content In-Feed Ad Slot */}
                {enableMidContent && !isAutoAdsEnabled && (
                  <aside aria-label="Advertisement" className="my-6">
                    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4">
                      <InArticleAd adSlot={midSlot} minHeight={200} />
                    </div>
                  </aside>
                )}
              </div>

              {/* Automatic Desktop Sidebar Ad Column */}
              {!isAutoAdsEnabled && (
                <aside
                  aria-label="Sidebar advertisement"
                  className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4"
                >
                  <div className="sticky top-20 rounded-2xl border border-border/60 bg-card/60 p-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Sponsored Partner
                    </div>
                    <SidebarAd adSlot={sidebarSlot} minHeight={600} />
                  </div>
                </aside>
              )}
            </div>
          ) : (
            <div className={`min-w-0 max-w-full ${contentClassName}`}>
              {children}

              {/* Automatic Mid-Content In-Feed Ad Slot (Single Column) */}
              {enableMidContent && !isAutoAdsEnabled && (
                <aside aria-label="Advertisement" className="max-w-5xl mx-auto px-3 sm:px-4 my-8">
                  <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-4 text-center">
                    <InArticleAd adSlot={midSlot} minHeight={200} />
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>

        {/* C. Automatic Pre-Footer Responsive Banner Ad Slot */}
        {enableFooterBanner && !isAutoAdsEnabled && (
          <aside
            aria-label="Footer advertisement"
            className="w-full max-w-7xl mx-auto px-3 sm:px-4 pt-6 pb-4 mt-auto"
          >
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-card/80 via-card/50 to-card/80 p-3 sm:p-5 text-center">
              <ResponsiveAd
                adSlot={footerSlot}
                minHeight={120}
                className="w-full max-w-[970px] mx-auto"
              />
            </div>
          </aside>
        )}

        {/* D. Automatic Mobile Sticky Anchor Ad */}
        {enableMobileSticky && !isAutoAdsEnabled && (
          <div className="block md:hidden">
            <MobileStickyAnchor adSlot={mobileStickySlot} />
          </div>
        )}
      </div>
    </AdSenseLayoutContext.Provider>
  );
}

/**
 * Dismissible mobile anchor banner ad placed at the bottom above the mobile nav bar.
 */
function MobileStickyAnchor({ adSlot = "mobileSticky" }: { adSlot?: AdSlotKey | string }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || adsConfig.enableAutoAds) return null;

  return (
    <div
      data-testid="mobile-sticky-ad-anchor"
      className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
    >
      <div className="relative">
        <button
          type="button"
          aria-label="Close advertisement"
          onClick={() => setDismissed(true)}
          className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground cursor-pointer text-xs font-bold"
        >
          ✕
        </button>
        <MobileStickyAd adSlot={adSlot} minHeight={60} />
      </div>
    </div>
  );
}

/**
 * Granular helper component to manually trigger an automatic ad insertion anywhere in layout or pages.
 */
export function AutoAdInsert({
  position = "banner",
  slot,
  className = "",
}: {
  position?: "banner" | "inArticle" | "sidebar" | "responsive";
  slot?: AdSlotKey | string;
  className?: string;
}) {
  const { isAutoAdsEnabled } = useAdSenseLayout();
  if (isAutoAdsEnabled) return null;

  return (
    <div className={`overflow-hidden my-4 ${className}`}>
      {position === "banner" && <BannerAd adSlot={slot || "headerBanner"} />}
      {position === "inArticle" && <InArticleAd adSlot={slot || "inArticleMid"} />}
      {position === "sidebar" && <SidebarAd adSlot={slot || "sidebarTop"} />}
      {position === "responsive" && <ResponsiveAd adSlot={slot || "footerBanner"} />}
    </div>
  );
}

export default AdSenseLayoutWrapper;
