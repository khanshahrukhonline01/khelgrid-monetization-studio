import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { TRIALS, SPORTS } from "@/data/trials";
import { SPORTS_CATALOG } from "@/data/catalog";
import { SPORTS_NEWS_CATALOG } from "@/data/news";
import { SPORTS_LIST as HOME_HERO_SPORTS_PILLS } from "@/components/home/SportCategoryPills";
import { SPORTS as HERO_SPORTS } from "@/components/home/HomeHeroSection";
import { AthleteOnboardingWizard, PROFICIENCY_TIERS } from "@/components/AthleteOnboardingWizard";
import { TrialCard } from "@/components/TrialCard";

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({
    children,
    to,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock Auth and saved context
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    applications: [],
    boostedTrials: [],
    role: "user",
  }),
}));

vi.mock("@/context/SavedOpportunityContext", () => ({
  useSavedOpportunities: () => ({
    isSaved: () => false,
    toggleSaved: vi.fn(),
  }),
}));

vi.mock("@/context/FollowedAcademyContext", () => ({
  useFollowedAcademies: () => ({
    isFollowingAcademy: () => false,
    toggleFollowAcademy: vi.fn(),
  }),
}));

describe("SAI Selection Trial Card, Kho-Kho Sports Lists & Multi-Step Onboarding", () => {
  const SAI_IMAGE_URL =
    "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg";

  it("verifies SAI selection trial card contains the exact official image url", () => {
    const matchingTrials = TRIALS.filter((t) => t.imageUrl === SAI_IMAGE_URL);
    expect(matchingTrials.length).toBeGreaterThan(0);

    const nationalTrials = matchingTrials.find(
      (t) =>
        t.id === "t-sai-national-selection-trials-2026" || t.id === "t-sai-wrestling-mumbai-2026",
    );
    expect(nationalTrials).toBeDefined();
    expect(nationalTrials?.academy).toContain("Sports Authority of India");
  });

  it("renders TrialCard with the SAI official selection trials image", () => {
    const saiTrial = TRIALS.find((t) => t.imageUrl === SAI_IMAGE_URL)!;
    expect(saiTrial).toBeDefined();

    const html = renderToString(<TrialCard trial={saiTrial} onApply={vi.fn()} />);

    expect(html).toContain(SAI_IMAGE_URL);
    expect(html).toContain(saiTrial.title.replace(/&/g, "&amp;"));
  });

  it("ensures the SAI selection trial image is strictly NOT added to Khel Chronicle (news catalog)", () => {
    const chronicleMatch = SPORTS_NEWS_CATALOG.find(
      (n) => n.imageUrl === SAI_IMAGE_URL || n.officialSourceUrl === SAI_IMAGE_URL,
    );
    expect(chronicleMatch).toBeUndefined();
  });

  it("verifies Kho-Kho is present in all major sports lists across the platform", () => {
    // 1. Trials sports list
    expect(SPORTS).toContain("Kho-Kho");

    // 2. Catalog sports list
    const catalogKhoKho = SPORTS_CATALOG.find((s) => s.slug === "kho-kho" || s.name === "Kho-Kho");
    expect(catalogKhoKho).toBeDefined();
    expect(catalogKhoKho?.name).toBe("Kho-Kho");

    // 3. Home hero pills
    const pillKhoKho = HOME_HERO_SPORTS_PILLS.find(
      (s) => s.name === "Kho-Kho" || s.id === "Kho-Kho",
    );
    expect(pillKhoKho).toBeDefined();

    // 4. Hero section sports
    expect(HERO_SPORTS).toContain("Kho-Kho");
  });

  it("verifies multi-step onboarding wizard collects sports interests and proficiency levels using step-based state", () => {
    const html = renderToString(<AthleteOnboardingWizard />);

    // Step 1: Identity & Sports Interests
    expect(html).toContain("Step 1: Athlete Identity &amp; Sport");
    expect(html).toContain("Kho-Kho");
    expect(html).toContain("Select Primary Sport");
    expect(html).toContain("Secondary Sports &amp; Games You Play");

    // Proficiency tiers defined with shadcn components
    expect(PROFICIENCY_TIERS.length).toBe(4);
    expect(PROFICIENCY_TIERS.map((p) => p.id)).toEqual([
      "Beginner",
      "Intermediate",
      "Advanced",
      "Elite",
    ]);

    // Progress and navigation controls
    expect(html).toContain("Athlete Basics");
    expect(html).toContain("% Completed");
    expect(html).toContain("Save &amp; Continue");
    expect(html).toContain("Live Scout Card Preview");
  });
});
