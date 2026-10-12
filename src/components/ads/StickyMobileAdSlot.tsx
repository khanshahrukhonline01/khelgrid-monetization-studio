import { useState } from "react";
import { X } from "lucide-react";
import { AD_SLOTS, adsConfig, hasAdSenseEnvId } from "@/config/ads";
import { MobileStickyAd } from "./AdUnits";

/**
 * Dismissible mobile sticky ad, anchored just above the BottomTabBar.
 * Rendered once from the root layout only when VITE_GOOGLE_ADSENSE_ID is present.
 */
export function StickyMobileAdSlot() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  if (adsConfig.enableAutoAds) return null; // Auto Ads own anchor placements
  if (!hasAdSenseEnvId() || !AD_SLOTS.mobileSticky) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="relative">
        <button
          type="button"
          aria-label="Close advertisement"
          onClick={() => setDismissed(true)}
          className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-secondary/80 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <MobileStickyAd adSlot="mobileSticky" />
      </div>
    </div>
  );
}
