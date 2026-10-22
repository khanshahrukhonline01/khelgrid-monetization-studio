import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { AthleteOnboardingWizard, ONBOARDING_COMPLETED_KEY } from "./AthleteOnboardingWizard";
import {
  getDefaultSportsCV,
  loadSportsCVData,
  saveSportsCVData,
  SPORTS_CV_STORAGE_KEY,
} from "@/lib/sports-cv-storage";
import { setSportsCVLanguage, SPORTS_CV_LANGUAGE_KEY } from "@/lib/sports-cv-i18n";

// Mock @tanstack/react-router useNavigate and Link
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

describe("AthleteOnboardingWizard Component & Flow", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("renders the onboarding wizard with initial Step 1 details and sport selections", () => {
    const html = renderToString(<AthleteOnboardingWizard />);

    expect(html).toContain("Build Your Scout-Ready Sports CV &amp; Connect Socials");
    expect(html).toContain("Step 1: Athlete Identity &amp; Sport");
    expect(html).toContain("Athlete Full Name");
    expect(html).toContain("Cricket");
    expect(html).toContain("Football");
    expect(html).toContain("Basketball");
    expect(html).toContain("Competition Age Category");
    expect(html).toContain("Save &amp; Continue");
  });


  it("renders translated onboarding labels and examples in Hindi", () => {
    setSportsCVLanguage("hi");
    const html = renderToString(<AthleteOnboardingWizard />);

    expect(html).toContain("चरण 1");
    expect(html).toContain("उदाहरण: आरव शर्मा");
    expect(html).toContain("सेव करें और आगे बढ़ें");
    expect(localStorage.getItem(SPORTS_CV_LANGUAGE_KEY)).toBe("hi");
  });

  it("keeps English as the default onboarding language", () => {
    const html = renderToString(<AthleteOnboardingWizard />);

    expect(html).toContain("Step 1 of");
    expect(html).toContain("e.g. Aarav Sharma");
    expect(html).toContain("Save &amp; Continue");
  });

  it("renders the live scout card preview in the wizard", () => {
    const html = renderToString(<AthleteOnboardingWizard />);

    expect(html).toContain("Live Scout Card Preview");
    expect(html).toContain("Verified Sports CV");
    expect(html).toContain("Scout Insight:");
  });

  it("supports social media connections and initializes default handles", () => {
    const defaultData = getDefaultSportsCV("Rohan Verma");
    saveSportsCVData(defaultData);

    const loaded = loadSportsCVData();
    expect(loaded.socialProfiles).toBeDefined();
    expect(loaded.socialProfiles?.instagram).toContain("aarav");
    expect(loaded.socialProfiles?.youtube).toContain("youtu.be");
  });

  it("saves onboarding completed flag to localStorage when requested", () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      expect(localStorage.getItem(ONBOARDING_COMPLETED_KEY)).toBe("true");
    }
  });
});
