import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { useGoogleAnalytics } from "./use-google-analytics";
import { sendGtagEvent, trackEvent, trackPageView, trackUserEngagement } from "@/lib/analytics";
import { trackAdEvent } from "@/lib/ad-analytics";
import { googleTagIds, hasValidGoogleTag } from "@/config/analytics";

// Mock TanStack Router
let mockLocation = { pathname: "/trials", searchStr: "?sport=cricket" };

vi.mock("@tanstack/react-router", () => ({
  useRouterState: ({ select }: { select?: (state: any) => any } = {}) => {
    const state = { location: mockLocation };
    return select ? select(state) : state;
  },
}));

// Set up global browser mocks for node test environment
const mockWindow = {
  gtag: undefined as any,
  dataLayer: [] as any[],
  location: { href: "https://www.khelgrid.com/trials?sport=cricket" },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  innerHeight: 800,
  scrollY: 0,
};

const mockDocument = {
  title: "KhelGrid Trials",
  hidden: false,
  getElementById: vi.fn(() => null),
  head: { appendChild: vi.fn() },
  documentElement: { scrollHeight: 2000, scrollTop: 0 },
  body: { scrollHeight: 2000 },
};

(globalThis as any).window = mockWindow;
(globalThis as any).document = mockDocument;

describe("Google Analytics Hook & Unified Tracking", () => {
  let mockGtag: any;

  beforeEach(() => {
    mockGtag = vi.fn();
    mockWindow.gtag = mockGtag;
    mockWindow.dataLayer = [];
    mockLocation = { pathname: "/trials", searchStr: "?sport=cricket" };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves valid measurement and google tag IDs without duplicates", () => {
    const ids = googleTagIds();
    expect(ids.length).toBeGreaterThan(0);
    // Deduplication check: no duplicate IDs in list
    const uniqueIds = Array.from(new Set(ids));
    expect(ids).toEqual(uniqueIds);
    expect(hasValidGoogleTag()).toBe(true);
  });

  it("sends gtag events safely to both gtag and dataLayer using sendGtagEvent", () => {
    sendGtagEvent("custom_test_event", { sport: "badminton", rating: 5 });

    expect(mockGtag).toHaveBeenCalledWith("event", "custom_test_event", {
      sport: "badminton",
      rating: 5,
    });
    expect(window.dataLayer).toContainEqual({
      event: "custom_test_event",
      sport: "badminton",
      rating: 5,
    });
  });

  it("tracks page views with trackPageView", () => {
    trackPageView("/book", "Book Court · KhelGrid");

    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "page_view",
      expect.objectContaining({
        page_path: "/book",
        page_title: "Book Court · KhelGrid",
      }),
    );
  });

  it("tracks user engagement with trackUserEngagement", () => {
    trackUserEngagement("filter_applied", { filter: "Age U17", results_count: 12 });

    expect(mockGtag).toHaveBeenCalledWith(
      "event",
      "user_engagement",
      expect.objectContaining({
        action: "filter_applied",
        filter: "Age U17",
        results_count: 12,
      }),
    );
  });

  it("removes duplication in trackAdEvent by routing to unified sendGtagEvent", () => {
    trackAdEvent({
      event: "ad_impression",
      slot: "home_hero_banner",
      format: "banner",
      value: "direct_sponsor",
    });

    expect(mockGtag).toHaveBeenCalledWith("event", "ad_impression", {
      slot: "home_hero_banner",
      format: "banner",
      value: "direct_sponsor",
    });
    expect(window.dataLayer).toContainEqual({
      event: "ad_impression",
      slot: "home_hero_banner",
      format: "banner",
      value: "direct_sponsor",
    });
  });

  it("removes duplication in trackEvent for nav clicks", () => {
    trackEvent({
      event: "nav_click",
      label: "Play · Find games",
      destination: "/play",
      source: "sidebar_desktop",
    });

    expect(mockGtag).toHaveBeenCalledWith("event", "nav_click", {
      label: "Play · Find games",
      destination: "/play",
      source: "sidebar_desktop",
    });
  });

  it("can be invoked inside a component without throwing", () => {
    function TestComponent() {
      const analytics = useGoogleAnalytics({ enabled: false });
      return <div data-testid="analytics-test">{analytics.measurementId}</div>;
    }

    expect(() => renderToString(<TestComponent />)).not.toThrow();
  });
});
