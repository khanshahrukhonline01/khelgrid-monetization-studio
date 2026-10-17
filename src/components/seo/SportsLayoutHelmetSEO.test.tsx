import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import {
  SportsLayoutHelmetSEO,
  detectSportsCategory,
  computeDynamicSportsSeo,
} from "./SportsLayoutHelmetSEO";
import { SITE_URL, DEFAULT_SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";

// Mock @tanstack/react-router useRouterState
let mockRouterState = {
  pathname: "/",
  searchStr: "",
};

vi.mock("@tanstack/react-router", () => ({
  useRouterState: ({ select }: { select?: (state: any) => any } = {}) => {
    if (select) {
      return select({
        location: {
          pathname: mockRouterState.pathname,
          searchStr: mockRouterState.searchStr,
        },
      });
    }
    return {
      location: {
        pathname: mockRouterState.pathname,
        searchStr: mockRouterState.searchStr,
      },
    };
  },
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("SportsLayoutHelmetSEO Component & Dynamic Meta Tag Engine", () => {
  describe("Category Detection Engine", () => {
    it("identifies sports trials routes and query intent", () => {
      expect(detectSportsCategory("/search")).toBe("trials");
      expect(detectSportsCategory("/trials")).toBe("trials");
      expect(detectSportsCategory("/trial/t-sai-wrestling-mumbai-2026")).toBe("trials");
      expect(detectSportsCategory("/opportunities")).toBe("trials");
      expect(detectSportsCategory("/opportunities/t-1")).toBe("trials");
      expect(detectSportsCategory("/recommendations")).toBe("trials");

      const searchWithTrialQ = new URLSearchParams("q=athletics+trials");
      expect(detectSportsCategory("/explore", searchWithTrialQ)).toBe("trials");

      const searchWithCrpf = new URLSearchParams("q=crpf+recruitment");
      expect(detectSportsCategory("/explore", searchWithCrpf)).toBe("trials");
    });

    it("identifies coaching opportunities routes", () => {
      expect(detectSportsCategory("/train")).toBe("coaching");
      expect(detectSportsCategory("/coaches")).toBe("coaching");
      expect(detectSportsCategory("/academy")).toBe("coaching");
      expect(detectSportsCategory("/learning-hub")).toBe("coaching");
      expect(detectSportsCategory("/partner")).toBe("coaching");
      expect(detectSportsCategory("/start-from-zero")).toBe("coaching");
      expect(detectSportsCategory("/guides")).toBe("coaching");
    });

    it("identifies gameplay engagement routes", () => {
      expect(detectSportsCategory("/play")).toBe("gameplay");
      expect(detectSportsCategory("/book")).toBe("gameplay");
      expect(detectSportsCategory("/venue/v-cricket-turf-delhi")).toBe("gameplay");
      expect(detectSportsCategory("/events")).toBe("gameplay");
      expect(detectSportsCategory("/live-scores")).toBe("gameplay");
      expect(detectSportsCategory("/my-stats")).toBe("gameplay");
      expect(detectSportsCategory("/onboarding")).toBe("gameplay");
      expect(detectSportsCategory("/cv/aarav-sharma")).toBe("gameplay");
      expect(detectSportsCategory("/community")).toBe("gameplay");
    });

    it("identifies portal-wide root and general routes", () => {
      expect(detectSportsCategory("/")).toBe("portal");
      expect(detectSportsCategory("/about")).toBe("portal");
      expect(detectSportsCategory("/terms")).toBe("portal");
      expect(detectSportsCategory("/privacy")).toBe("portal");
    });
  });

  describe("Dynamic Metadata Computation", () => {
    it("computes targeted metadata for general sports trials", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/search",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("trials");
      expect(seo.title).toContain("Sports Selection Trials");
      expect(seo.title).toContain(DEFAULT_SITE_NAME);
      expect(seo.description).toContain("selection trials");
      expect(seo.keywords).toContain("sports trials India");
      expect(seo.keywords).toContain("selection trials 2026");
      expect(seo.keywords).toContain("game");
      expect(seo.keywords).toContain("sport");
      expect(seo.keywords).toContain("play");
      expect(seo.canonicalUrl).toBe(`${SITE_URL}/search`);

      const itemList = seo.schemas.find((s) => s["@type"] === "ItemList");
      expect(itemList).toBeDefined();
    });

    it("computes targeted metadata for CRPF sports quota recruitment 2026", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/search",
        searchParams: new URLSearchParams("q=crpf"),
      });

      expect(seo.category).toBe("trials");
      expect(seo.title).toContain("CRPF Meritorious Sportspersons Recruitment 2026");
      expect(seo.description).toContain("521 vacancies");
      expect(seo.description).toContain("rect.crpf.gov.in");
      expect(seo.keywords).toContain("CRPF recruitment 2026");
      expect(seo.keywords).toContain("rect.crpf.gov.in apply online");

      const jobPosting = seo.schemas.find((s) => s["@type"] === "JobPosting");
      expect(jobPosting).toBeDefined();
      expect((jobPosting as any)?.identifier?.value).toBe("CRPF-SPORTS-QUOTA-2026-521");
      expect((jobPosting as any)?.hiringOrganization?.sameAs).toBe("https://rect.crpf.gov.in");
    });

    it("computes targeted metadata for sport-specific trials (e.g. Badminton in Bengaluru)", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/search",
        searchParams: new URLSearchParams("sport=Badminton&city=Bengaluru"),
      });

      expect(seo.category).toBe("trials");
      expect(seo.title).toContain("Badminton Selection Trials & Opportunities in Bengaluru 2026");
      expect(seo.description).toContain("Badminton");
      expect(seo.description).toContain("Bengaluru");
      expect(seo.keywords).toContain("Badminton selection trials 2026");
    });

    it("computes targeted metadata for coaching opportunities (/train)", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/train",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("coaching");
      expect(seo.title).toContain("Sports Coaching Opportunities");
      expect(seo.title).toContain("Certified NIS Academies");
      expect(seo.description).toContain("NIS-certified mentors");
      expect(seo.keywords).toContain("sports coaching opportunities");
      expect(seo.keywords).toContain("cricket coaching academy near me");
      expect(seo.keywords).toContain("NIS certified coaches");

      const eduOrg = seo.schemas.find((s) => s["@type"] === "EducationalOrganization");
      expect(eduOrg).toBeDefined();
    });

    it("computes targeted metadata for sport-specific coaching", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/train",
        searchParams: new URLSearchParams("sport=Cricket"),
      });

      expect(seo.category).toBe("coaching");
      expect(seo.title).toContain("Elite Cricket Coaching Academies");
      expect(seo.keywords).toContain("Cricket coaching academy near me");
    });

    it("computes targeted metadata for gameplay engagement (/play, /book)", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/play",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("gameplay");
      expect(seo.title).toContain("Book Sports Turfs & Join Pickup Games");
      expect(seo.title).toContain("Gameplay Engagement");
      expect(seo.description).toContain("Book premium sports turfs");
      expect(seo.description).toContain("box cricket & futsal pickup games");
      expect(seo.keywords).toContain("gameplay engagement");
      expect(seo.keywords).toContain("book sports turf online");
      expect(seo.keywords).toContain("box cricket pitch");
      expect(seo.keywords).toContain("futsal court booking");

      const activityLocation = seo.schemas.find((s) => s["@type"] === "SportsActivityLocation");
      expect(activityLocation).toBeDefined();
    });

    it("computes targeted metadata for gameplay live scores (/live-scores)", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/live-scores",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("gameplay");
      expect(seo.title).toContain("Live Sports Scores");
      expect(seo.keywords).toContain("live sports scores");
      expect(seo.keywords).toContain("live cricket score");
    });

    it("computes targeted metadata for athlete Sports CV (/onboarding)", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/onboarding",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("gameplay");
      expect(seo.title).toContain("Athlete Sports CV Builder");
      expect(seo.keywords).toContain("sports cv builder");
      expect(seo.keywords).toContain("digital scout card");
    });

    it("computes portal-wide home metadata linking trials, coaching, and gameplay", () => {
      const seo = computeDynamicSportsSeo({
        pathname: "/",
        searchParams: new URLSearchParams(""),
      });

      expect(seo.category).toBe("portal");
      expect(seo.title).toContain("India's Sports Opportunity Network");
      expect(seo.title).toContain("Game, Sport, Play & Trials");
      expect(seo.description).toContain("selection trials");
      expect(seo.description).toContain("coaching academies");
      expect(seo.description).toContain("sports turfs");
      expect(seo.keywords).toContain("sports trials India");
      expect(seo.keywords).toContain("coaching opportunities");
      expect(seo.keywords).toContain("gameplay engagement");

      const website = seo.schemas.find((s) => s["@type"] === "WebSite");
      expect(website).toBeDefined();
    });
  });

  describe("React Helmet Layout Rendering", () => {
    it("renders dynamic meta tags in Helmet for sports trials route", () => {
      mockRouterState = {
        pathname: "/search",
        searchStr: "?sport=Kho-Kho",
      };

      const html = renderToString(
        <HelmetProvider>
          <SportsLayoutHelmetSEO />
        </HelmetProvider>,
      );

      expect(html).toContain("Kho-Kho Selection Trials");
      expect(html).toContain('property="og:title"');
      expect(html).toContain('name="twitter:card" content="summary_large_image"');
      expect(html).toContain(`name="twitter:site" content="${TWITTER_HANDLE}"`);
      expect(html).toContain('name="khelgrid:category" content="trials"');
      expect(html).toContain('name="khelgrid:sports-pillar" content="trials"');
    });

    it("renders dynamic meta tags in Helmet for coaching opportunities route", () => {
      mockRouterState = {
        pathname: "/train",
        searchStr: "",
      };

      const html = renderToString(
        <HelmetProvider>
          <SportsLayoutHelmetSEO />
        </HelmetProvider>,
      );

      expect(html).toContain("Sports Coaching Opportunities &amp; Certified NIS Academies");
      expect(html).toContain('name="khelgrid:category" content="coaching"');
      expect(html).toContain("EducationalOrganization");
    });

    it("renders dynamic meta tags in Helmet for gameplay engagement route", () => {
      mockRouterState = {
        pathname: "/play",
        searchStr: "",
      };

      const html = renderToString(
        <HelmetProvider>
          <SportsLayoutHelmetSEO />
        </HelmetProvider>,
      );

      expect(html).toContain("Book Sports Turfs &amp; Join Pickup Games");
      expect(html).toContain('name="khelgrid:category" content="gameplay"');
      expect(html).toContain("SportsActivityLocation");
    });

    it("respects explicit category and title prop overrides", () => {
      mockRouterState = {
        pathname: "/",
        searchStr: "",
      };

      const html = renderToString(
        <HelmetProvider>
          <SportsLayoutHelmetSEO
            category="trials"
            title="Custom National Selection Trials 2026"
            description="Custom trial description for test verification."
          />
        </HelmetProvider>,
      );

      expect(html).toContain("Custom National Selection Trials 2026");
      expect(html).toContain('content="Custom trial description for test verification."');
      expect(html).toContain('name="khelgrid:category" content="trials"');
    });
  });
});
