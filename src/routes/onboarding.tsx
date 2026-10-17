import { createFileRoute } from "@tanstack/react-router";
import { AthleteOnboardingWizard } from "@/components/AthleteOnboardingWizard";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/onboarding")({
  head: () =>
    buildSeoHead({
      title: "Athlete Onboarding Wizard · Game, Sport, Play & Sports CV · KhelGrid",
      description:
        "Step-based sports onboarding wizard to collect sports interests, playing styles, and proficiency levels for athletes, grassroots players, and pros on KhelGrid.",
      canonicalPath: "/onboarding",
      keywords:
        "game, sport, play, athlete onboarding wizard, sports interests, proficiency levels, sports CV builder, verified scout card, gully cricket, turf war, pickup games, kho-kho trials, kabaddi raider, athletic combine",
      type: "website",
    }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <main className="min-h-screen py-4 sm:py-8">
      <AthleteOnboardingWizard />
    </main>
  );
}

export default OnboardingPage;
