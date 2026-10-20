import { useState, useEffect, lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AppHeaderBanner,
  SportCategoryPills,
  AppLaunchpad,
  LiveMatchTicker,
  FeaturedTrialsRadar,
  QuickVenueRadar,
  HomeEditorialAuthoritySection,
} from "@/components/home";
import { BannerAd, ResponsiveAd } from "@/components/ads";
import { buildSeoHead } from "@/lib/seo";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";

// Non-critical below-the-fold components lazy-loaded to optimize Critical Rendering Path (FCP & LCP)
const PickupGameLobby = lazy(() =>
  import("@/components/home/PickupGameLobby").then((m) => ({ default: m.PickupGameLobby })),
);
const AthletePathwayCard = lazy(() =>
  import("@/components/home/AthletePathwayCard").then((m) => ({ default: m.AthletePathwayCard })),
);
const HomeNewsWireSection = lazy(() =>
  import("@/components/home/HomeNewsWireSection").then((m) => ({ default: m.HomeNewsWireSection })),
);
const NativeAppBanner = lazy(() =>
  import("@/components/home/NativeAppBanner").then((m) => ({ default: m.NativeAppBanner })),
);
const FeaturedAcademiesSection = lazy(() =>
  import("@/components/home/FeaturedAcademiesSection").then((m) => ({
    default: m.FeaturedAcademiesSection,
  })),
);
const HomeCommunityImpactSection = lazy(() =>
  import("@/components/home/HomeCommunityImpactSection").then((m) => ({
    default: m.HomeCommunityImpactSection,
  })),
);
const HomeFaqSection = lazy(() =>
  import("@/components/HomeFaqSection").then((m) => ({ default: m.HomeFaqSection })),
);

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "KhelGrid · Sports Selection Trials, Academies & Quotas",
      description:
        "Discover verified sports selection trials across India. Find open trials, SAI NCOE selections, Khelo India academies, and sports quota recruitment drives.",
      canonicalPath: "/",
      keywords:
        "sports trials India, sports opportunities, selection trials 2026, CRPF meritorious sportspersons recruitment 2026, sports quota jobs, sports academies near me, book turf, pickup sports games, badminton courts, cricket trials, football academy combine, athletics trials India, sports CV",
      type: "website",
      customSchema: {
        "@type": "FAQPage",
        mainEntity: HOME_FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    }),
  component: Home,
});

function Home() {
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");

  // Read saved city preference on client after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("khelgrid_user_city");
      if (saved) {
        setSelectedCity(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem("khelgrid_user_city", city);
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full flex-1 pb-10 sm:pb-16">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 1. App Header Greeting, City Switcher, Quick Search & PWA Install Bar */}
        <AppHeaderBanner selectedCity={selectedCity} onSelectCity={handleSelectCity} />

        {/* 2. Touch-First Horizontal Sport Selector */}
        <SportCategoryPills selectedSport={selectedSport} onSelectSport={setSelectedSport} />

        {/* 3. App Launchpad: 6 Iconic Touch-Friendly Tiles */}
        <AppLaunchpad />

        {/* 4. In-Play Live Match Center (Direct target for bottom thumb Live tab) */}
        <LiveMatchTicker selectedSport={selectedSport} />

        {/* 5. Sponsored Banner Ad */}
        <div className="pt-1">
          <BannerAd adSlot="homeBelowHero" minHeight={90} />
        </div>

        {/* 6. Selection Trials & Scouting Combines */}
        <FeaturedTrialsRadar selectedSport={selectedSport} selectedCity={selectedCity} />

        {/* 7. Instant Turf & Court Booking */}
        <QuickVenueRadar selectedCity={selectedCity} selectedSport={selectedSport} />

        {/* 8. Community Pickup Games Lobby (Lazy-loaded with zero-shift fallback) */}
        <Suspense fallback={<div className="h-48 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <PickupGameLobby selectedCity={selectedCity} selectedSport={selectedSport} />
        </Suspense>

        {/* 9. Athlete Passport & Verified Sports CV Feature */}
        <Suspense fallback={<div className="h-40 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <AthletePathwayCard />
        </Suspense>

        {/* 10. National Sports Wire & Live Editorial */}
        <Suspense fallback={<div className="h-64 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <HomeNewsWireSection />
        </Suspense>

        {/* 11. Multi-Platform PWA, Android & iOS Native App Showcase */}
        <Suspense fallback={<div className="h-32 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <NativeAppBanner />
        </Suspense>

        {/* 12. Featured Training Institutions & Sports Academies */}
        <Suspense fallback={<div className="h-56 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <FeaturedAcademiesSection />
        </Suspense>

        {/* 13. Authoritative Editorial Overview for Search Engine & LLM Citability */}
        <HomeEditorialAuthoritySection />

        {/* 14. Zero Fake Trials Standard & Community Trust Audit */}
        <Suspense fallback={<div className="h-48 w-full rounded-2xl bg-muted/30 animate-pulse" />}>
          <HomeCommunityImpactSection />
        </Suspense>

        {/* 14. Frequently Asked Questions Accordion */}
        <div className="pt-2">
          <Suspense
            fallback={<div className="h-48 w-full rounded-2xl bg-muted/30 animate-pulse" />}
          >
            <HomeFaqSection />
          </Suspense>
        </div>

        {/* 15. Responsive Footer Ad Unit */}
        <div className="pt-2">
          <ResponsiveAd adSlot="homeFooter" minHeight={200} />
        </div>
      </div>
    </div>
  );
}
