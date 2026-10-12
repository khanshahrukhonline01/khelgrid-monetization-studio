# Google AdSense on KhelGrid

Everything ad-related lives in two places:

- `src/config/ads.ts` — publisher ID, global flags, slot registry
- `src/components/ads/` — consent layer + ad components

## 1. Environment variables

```env
# Required (from AdSense → Account → Settings)
VITE_GOOGLE_ADSENSE_ID=ca-pub-1234567890123456

# Optional: let Google place ads automatically instead of manual units
VITE_ADSENSE_AUTO_ADS=false

# Ad unit slot IDs (AdSense → Ads → By ad unit). Leave blank to show a placeholder.
VITE_ADSLOT_HOME_HERO=
VITE_ADSLOT_HOME_MID=
VITE_ADSLOT_HOME_FOOTER=
VITE_ADSLOT_HEADER=
VITE_ADSLOT_FOOTER=
VITE_ADSLOT_SIDEBAR_TOP=
VITE_ADSLOT_SIDEBAR_MID=
VITE_ADSLOT_SIDEBAR_BOTTOM=
VITE_ADSLOT_ARTICLE_TOP=
VITE_ADSLOT_ARTICLE_MID=
VITE_ADSLOT_ARTICLE_END=
VITE_ADSLOT_LISTING_INLINE=
VITE_ADSLOT_SEARCH_INLINE=
VITE_ADSLOT_MOBILE_STICKY=
```

Until a valid `ca-pub-…` ID is set, **no AdSense script is loaded at all** and
every ad component renders a neutral "Ad space" placeholder. This keeps the app
fast and policy-safe before approval.

## 2. Using ad components

```tsx
import { BannerAd, ResponsiveAd, SidebarAd, InArticleAd, InFeedAd } from "@/components/ads";

<BannerAd adSlot="homeBelowHero" minHeight={100} />
<ResponsiveAd adSlot="homeFooter" />
<SidebarAd adSlot="sidebarBottom" />       // desktop only
<InArticleAd adSlot="inArticleMid" />      // fluid, for guides
<InFeedAd adSlot="searchInline" />         // sits inside a card grid
```

`adSlot` accepts a key from `AD_SLOTS` or a raw numeric slot id.

## 3. Behaviour built in

| Concern              | Implementation                                                            |
| -------------------- | ------------------------------------------------------------------------- |
| Lazy loading         | `IntersectionObserver`, 300px `rootMargin`; `eager` prop opts out         |
| Layout shift         | every unit reserves `minHeight` before the ad loads                       |
| Double push          | mount ref + `data-adsbygoogle-status` guard (HMR-safe)                    |
| No fill / ad blocker | falls back to the placeholder after 2.5s                                  |
| Consent              | `AdConsentProvider`; declining sets `requestNonPersonalizedAds = 1`       |
| Test mode            | `data-adtest="on"` automatically in development                           |
| Performance          | `preconnect` / `dns-prefetch` to Google ad hosts; script is `async`       |
| Analytics            | `ad_request`, `ad_impression`, `ad_consent` via `src/lib/ad-analytics.ts` |

## 4. User Messaging Platform (UMP) / GDPR & CCPA Consent

KhelGrid implements Google's User Messaging Platform (UMP) across both Web and Android platforms in compliance with Google's EU user consent policy and IAB TCF v2.2 requirements:

### Web Architecture (`src/lib/ump-web.ts` + `src/components/ads/`):

- **IAB Europe TCF v2.2**: Registers standard `__tcfapiLocator` iframe and `window.__tcfapi` stub for IAB TCF v2.2 compliance.
- **Google Privacy & Messaging (Funding Choices)**: Loads Google's official CMP script (`https://fundingchoicesmessages.google.com/i/ca-pub-XXXXXXXX?ers=1`) and signals presence via `googlefcPresent` iframe.
- **Google Consent Mode v2**: Sets default signals (`ad_storage: 'denied'`, `ad_user_data: 'denied'`, `ad_personalization: 'denied'`, `analytics_storage: 'granted'`), automatically updated when choices are recorded.
- **Privacy Options / Revocation**: Users can review or revoke consent choices at any time via `<CookieSettingsButton />`, which invokes `window.googlefc.showRevocationMessage()` or the in-app consent manager.

### Android Architecture (`app/src/main/java/com/khelgrid/app/ads/`):

- `UserMessagingPlatform.getConsentInformation(context)`
- `requestConsentInfoUpdate` + `loadAndShowConsentFormIfRequired`
- `showPrivacyOptionsForm` allows users in EEA/UK or state regulation areas to modify consent anytime.

## 5. Auto Ads

Set `VITE_ADSENSE_AUTO_ADS=true` to hand placement to Google. Manual units then
stop requesting (they keep reserving space), and the mobile sticky anchor is
disabled to avoid stacking with Google's own anchor ad.

## 6. Policy checklist

- One inline ad per 6 search results — keeps the content-to-ad ratio healthy
- Every unit is labelled "Advertisement"
- The mobile sticky ad is dismissible
- No ads on auth, checkout, or error screens

## Android app (AdMob)

AdSense units only serve on the website. The Android app in `app/` uses AdMob:

- `app/src/main/java/com/khelgrid/app/ads/AdMob.kt` — consent (Google UMP) is
  resolved before the SDK starts and before any banner requests an ad.
- `AndroidManifest.xml` carries `com.google.android.gms.ads.APPLICATION_ID`.
- The IDs currently in the code are Google's public **test** IDs. Replace
  `AdIds.BOTTOM_BANNER` and the manifest `APPLICATION_ID` with the real KhelGrid
  AdMob values after AdMob approval.
