import { createFileRoute } from "@tanstack/react-router";
import { AthleteOnboardingWizard } from "@/components/AthleteOnboardingWizard";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/onboarding")({
  head: () =>
    buildSeoHead({
      title: "Athlete Onboarding Wizard · Setup Sports CV & Socials · KhelGrid",
      description:
        "Guide new sports athletes through configuring their verified Sports CV, setting performance benchmarks, and connecting social media profiles for talent scouts.",
      canonicalPath: "/onboarding",
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
