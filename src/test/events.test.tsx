import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import EventsPage from "@/routes/events";
import {
  filterSportEvents,
  DEFAULT_EVENT_FILTERS,
  type EventFilterState,
} from "@/components/events/EventFilters";
import { EVENTS } from "@/data/khelgrid";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/events" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("Events & Tournaments Suite", () => {
  describe("filterSportEvents Filtering Logic", () => {
    it("returns all tournaments when default filters are applied", () => {
      const results = filterSportEvents(EVENTS, DEFAULT_EVENT_FILTERS);
      expect(results.length).toBe(EVENTS.length);
      expect(results.length).toBeGreaterThan(0);
    });

    it("filters accurately by text query", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        q: "Futsal",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every((e) =>
          [e.title, e.sport, e.format, e.venue].some((txt) => txt.toLowerCase().includes("futsal")),
        ),
      ).toBe(true);
    });

    it("filters accurately by sport", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        sport: "Cricket",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.sport === "Cricket")).toBe(true);
    });

    it("filters accurately by city", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        city: "Mumbai",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.city === "Mumbai")).toBe(true);
    });

    it("filters accurately by tournament category", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        category: "Corporate League",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.category === "Corporate League")).toBe(true);
    });

    it("filters accurately by 'upcoming' category filter", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        category: "upcoming",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.status !== "Completed")).toBe(true);
    });

    it("filters accurately by 'registration_open' category filter", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        category: "registration_open",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      // Sold out event e15 should be excluded
      expect(results.find((e) => e.id === "e15")).toBeUndefined();
      expect(results.every((e) => e.spotsLeft > 0 && e.status !== "Sold Out")).toBe(true);
    });

    it("filters accurately by 'local' category filter", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        category: "local",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every((e) => e.scope === "Local" || (!e.scope && e.category !== "Championship")),
      ).toBe(true);
    });

    it("filters accurately by 'national' category filter", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        category: "national",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every(
          (e) =>
            e.scope === "National" ||
            (!e.scope &&
              (e.category === "Championship" ||
                e.title.toLowerCase().includes("national") ||
                e.title.toLowerCase().includes("premier") ||
                e.title.toLowerCase().includes("all-india"))),
        ),
      ).toBe(true);
    });

    it("filters accurately by team format", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        teamFormat: "Doubles",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.teamFormat === "Doubles")).toBe(true);
    });

    it("filters accurately by price range (free entry)", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        priceRange: "free",
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.entryFee === 0)).toBe(true);
    });

    it("filters accurately by cash prize pool", () => {
      const filters: EventFilterState = {
        ...DEFAULT_EVENT_FILTERS,
        cashPrizeOnly: true,
      };
      const results = filterSportEvents(EVENTS, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((e) => e.prizePool?.includes("₹"))).toBe(true);
    });

    it("sorts by entry fee ascending and descending correctly", () => {
      const asc = filterSportEvents(EVENTS, {
        ...DEFAULT_EVENT_FILTERS,
        sort: "fee_asc",
      });
      for (let i = 1; i < asc.length; i++) {
        expect(asc[i].entryFee).toBeGreaterThanOrEqual(asc[i - 1].entryFee);
      }

      const desc = filterSportEvents(EVENTS, {
        ...DEFAULT_EVENT_FILTERS,
        sort: "fee_desc",
      });
      for (let i = 1; i < desc.length; i++) {
        expect(desc[i].entryFee).toBeLessThanOrEqual(desc[i - 1].entryFee);
      }
    });

    it("sorts by prize pool descending correctly", () => {
      const prizeSorted = filterSportEvents(EVENTS, {
        ...DEFAULT_EVENT_FILTERS,
        sort: "prize_desc",
      });
      expect(prizeSorted.length).toBeGreaterThan(0);
      expect(prizeSorted[0].prizePool).toContain("₹2,50,000");
    });
  });

  describe("Events Page UI & Responsive Layout Rendering", () => {
    it("renders the tournament page header, stats strip, and action buttons", () => {
      const html = renderToString(<EventsPage />);

      expect(html).toContain("Sports Tournaments &amp; Weekend Leagues");
      expect(html).toContain("KhelGrid Tournament Arena");
      expect(html).toContain("+ Host Tournament");
      expect(html).toContain("Share");
      expect(html).toContain("Live Competitions");
      expect(html).toContain("Cash Prize Pools");
    });

    it("renders tournament sports chips", () => {
      const html = renderToString(<EventsPage />);

      expect(html).toContain("All Sports");
      expect(html).toContain("Cricket");
      expect(html).toContain("Football");
      expect(html).toContain("Badminton");
    });

    it("renders enhanced category filter tabs with Upcoming, Registration Open, Local, National", () => {
      const html = renderToString(<EventsPage />);

      expect(html).toContain("All Events");
      expect(html).toContain("Upcoming");
      expect(html).toContain("Registration Open");
      expect(html).toContain("Local Tournaments");
      expect(html).toContain("National Championships");
    });

    it("renders tournament cards with prize pool and spots info", () => {
      const html = renderToString(<EventsPage />);

      expect(html).toContain("Sunday Pickleball Open Cup");
      expect(html).toContain("Mumbai Corporate Box Cricket Trophy");
      expect(html).toContain("₹60,000 Cash + Rotating Trophy");
      expect(html).toContain("Register");
      expect(html).toContain("Rules");
    });

    it("renders 'Save for Later' buttons and registration countdown indicators on tournament cards", () => {
      const html = renderToString(<EventsPage />);

      // Save for Later buttons
      expect(html).toContain("Save");
      expect(html).toContain("Shortlist");

      // Registration deadline countdown indicators
      expect(html).toContain("Registration Closes");
      expect(html).toContain("Closes in");
    });

    it("filters tournaments by saved shortlist when onlySaved filter is active", () => {
      const savedIds = new Set(["e1", "e3"]);
      const results = filterSportEvents(
        EVENTS,
        {
          ...DEFAULT_EVENT_FILTERS,
          onlySaved: true,
        },
        savedIds,
      );

      expect(results.length).toBe(2);
      expect(results.map((e) => e.id)).toEqual(["e1", "e3"]);
    });

    it("renders collapsible FAQ section addressing registration and eligibility questions", () => {
      const html = renderToString(<EventsPage />);

      expect(html).toContain("Tournament Registration &amp; Eligibility FAQs");
      expect(html).toContain("Tournament Knowledge Base");
      expect(html).toContain("Who is eligible to participate in KhelGrid tournaments?");
      expect(html).toContain("Can I register as an individual / solo player without a team?");
      expect(html).toContain("What identity documents are required at check-in on match day?");
      expect(html).toContain(
        "Can we modify our squad roster or substitute players after registering?",
      );
      expect(html).toContain(
        "What is the cancellation and refund policy if our team cannot attend?",
      );
      expect(html).toContain("All Questions");
      expect(html).toContain("Registration &amp; Teams");
      expect(html).toContain("Eligibility &amp; ID Verification");
      expect(html).toContain("Match Rules &amp; Kits");
      expect(html).toContain("Prizes &amp; Refunds");
    });
  });
});
