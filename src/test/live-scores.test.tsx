import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { LiveScoresPage } from "@/routes/live-scores";
import { BOTTOM_NAV_TABS, BottomTabBar } from "@/components/BottomTabBar";
import { NAV_ITEMS, FEATURE_ITEMS } from "@/config/nav";
import { LIVE_SPORTS_UPDATES } from "@/data/liveSports";

// Mock router for component test
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/live-scores" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("Live Scores Page and Navigation", () => {
  it("includes /live-scores in navigation items and features", () => {
    const liveScoreItem = NAV_ITEMS.find((item) => item.to === "/live-scores");
    expect(liveScoreItem).toBeDefined();
    expect(liveScoreItem?.label).toBe("Live Scores");
    expect(liveScoreItem?.surfaces).toContain("features");

    const inFeatureItems = FEATURE_ITEMS.some((item) => item.to === "/live-scores");
    expect(inFeatureItems).toBe(true);
  });

  it("includes the Live tab in BOTTOM_NAV_TABS for small screen devices", () => {
    const liveTab = BOTTOM_NAV_TABS.find(
      (tab) => tab.to === "/live-scores" || tab.label === "Live",
    );
    expect(liveTab).toBeDefined();
    expect(liveTab?.label).toBe("Live");
    expect(liveTab?.to).toBe("/live-scores");
    expect(liveTab?.isLive).toBe(true);
  });

  it("renders BottomTabBar with the Live button", () => {
    const html = renderToString(<BottomTabBar />);
    expect(html).toContain("Live");
    expect(html).toContain('href="/live-scores"');
    expect(html).toContain("bottom-tab-live");
  });

  it("renders LiveScoresPage without SSR hydration errors and focused on cricket", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain("Live Cricket");
    expect(html).toContain("Live Cricket Matches");
    expect(html).toContain("Official Schedules &amp; Real-Time Tracking");
    expect(html).toContain("All Cricket");
    expect(html).toContain("T20 Matches");
    expect(html).toContain("ODI Matches");
    expect(html).toContain("Test Series");
    expect(html).toContain("WPL 2026");
    // The shared sports selector remains visible above the cricket-focused match list.
    // Other sports may appear in navigation, but their match data must not appear here.
    expect(html).toContain("Football");
    expect(html).toContain("Badminton");
    expect(html).toContain("Kabaddi");
    expect(html).not.toContain("Mumbai City FC");
    expect(html).not.toContain("Lakshya Sen");
    expect(html).not.toContain("Dabang Delhi KC");
  });

  it("does not render fabricated match records when the provider feed is empty", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(LIVE_SPORTS_UPDATES).toEqual([]);
    expect(html).not.toContain("Mumbai City FC");
    expect(html).not.toContain("Lakshya Sen");
    expect(html).toContain("Checking live sports providers");
  });

  it("does not claim specific match results or redirect users to Google", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).not.toContain("West Indies Tour of India 2026");
    expect(html).not.toContain("Australia Tour of South Africa 2026");
    expect(html).not.toContain("Afghanistan vs Bangladesh in UAE 2026");
    expect(html).not.toContain("google.com");
    expect(html).not.toContain("For Live Score visit Google");
    expect(html).not.toContain("Google Sports Wire");
  });

  it("renders search bar at the top of Live Scores page with cricket filter options", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).toContain("Search teams, tournaments or matches");
    expect(html).toContain("Quick Filters:");
    expect(html).toContain("Quick Filters:");
    expect(html).not.toContain("West Indies Tour of India 2026");
    expect(html).not.toContain("Australia Tour of South Africa 2026");
  });

  it("ensures other sports and external Google search redirects are removed from live page", () => {
    const html = renderToString(<LiveScoresPage />);
    expect(html).not.toContain("Mumbai City FC");
    expect(html).not.toContain("Mohun Bagan SG");
    expect(html).not.toContain("Lakshya Sen");
    expect(html).not.toContain("Viktor Axelsen");
    expect(html).not.toContain("Dabang Delhi KC");
    expect(html).not.toContain("Carlos Alcaraz");
    expect(html).not.toContain("Live+ISL+score");
    expect(html).not.toContain("Live+Badminton+score");
    expect(html).not.toContain("Live+PKL+score");
  });
});
