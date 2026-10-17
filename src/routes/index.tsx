import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AppHeaderBanner,
  SportCategoryPills,
  AppLaunchpad,
  LiveMatchTicker,
  FeaturedTrialsRadar,
  QuickVenueRadar,
  PickupGameLobby,
  AthletePathwayCard,
  NativeAppBanner,
  HomeNewsWireSection,
  FeaturedAcademiesSection,
  HomeCommunityImpactSection,
} from "@/components/home";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { BannerAd, ResponsiveAd } from "@/components/ads";
import { buildSeoHead } from "@/lib/seo";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "KhelGrid · India's Sports Opportunity Network | Game, Sport, Play & Trials",
      description:
        "India's #1 network for game, sport, and play. Discover verified selection trials (including CRPF 2026 sports quota), book sports turfs, join pickup games, and enroll in elite academies across 16+ sports.",
      canonicalPath: "/",
      keywords:
        "game, sport, play, sports trials India, sports opportunities, selection trials 2026, CRPF meritorious sportspersons recruitment 2026, sports quota jobs, sports academies near me, book turf, pickup sports games, turf war, box cricket match, gully cricket, badminton courts, cricket trials, football academy combine, athletics trials India, kho-kho trials, sports CV builder",
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

        {/* 8. Community Pickup Games Lobby */}
        <PickupGameLobby selectedCity={selectedCity} selectedSport={selectedSport} />

        {/* 9. Athlete Passport & Verified Sports CV Feature */}
        <AthletePathwayCard />

        {/* 10. National Sports Wire & Live Editorial */}
        <HomeNewsWireSection />

        {/* 11. Multi-Platform PWA, Android & iOS Native App Showcase */}
        <NativeAppBanner />

        {/* 12. Featured Training Institutions & Sports Academies */}
        <FeaturedAcademiesSection />

        {/* 13. Zero Fake Trials Standard & Community Trust Audit */}
        <HomeCommunityImpactSection />

        {/* 14. Frequently Asked Questions Accordion */}
        <div className="pt-2">
          <HomeFaqSection />
        </div>

        {/* 15. Responsive Footer Ad Unit */}
        <div className="pt-2">
          <ResponsiveAd adSlot="homeFooter" minHeight={200} />
        </div>
      </div>
    </div>
  );
}
