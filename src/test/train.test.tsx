import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import TrainPage from "@/routes/train";
import {
  filterCoachingPrograms,
  DEFAULT_TRAIN_FILTERS,
  type TrainFilterState,
} from "@/components/train/TrainFilters";
import { COACHING } from "@/data/khelgrid";

// Mock router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/train" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("Train & Coaching Filters Suite", () => {
  describe("filterCoachingPrograms Functionality", () => {
    it("returns all programs when default filters are applied", () => {
      const results = filterCoachingPrograms(COACHING, DEFAULT_TRAIN_FILTERS);
      expect(results.length).toBe(COACHING.length);
    });

    it("filters accurately by text query", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        q: "Arjun",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.coach.includes("Arjun") || p.title.includes("Arjun"))).toBe(
        true,
      );
    });

    it("filters accurately by sport", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        sport: "Badminton",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.sport === "Badminton")).toBe(true);
    });

    it("filters accurately by city", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        city: "Bengaluru",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.city === "Bengaluru")).toBe(true);
    });

    it("filters accurately by skill level", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        level: "Beginner",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.level === "Beginner" || p.level === "All Levels")).toBe(true);
    });

    it("filters accurately by format", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        format: "1-on-1 Private",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.format === "1-on-1 Private")).toBe(true);
    });

    it("filters accurately by age group", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        ageGroup: "U-12 Grassroots",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every((p) => p.ageGroup === "U-12 Grassroots" || p.ageGroup === "All Ages"),
      ).toBe(true);
    });

    it("filters accurately by price range", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        priceRange: "under_3000",
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => p.pricePerMonth <= 3000)).toBe(true);
    });

    it("filters accurately by NIS certified only", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        certifiedOnly: true,
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => Boolean(p.certified))).toBe(true);
    });

    it("filters accurately by free trial availability", () => {
      const filters: TrainFilterState = {
        ...DEFAULT_TRAIN_FILTERS,
        freeTrialOnly: true,
      };
      const results = filterCoachingPrograms(COACHING, filters);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((p) => Boolean(p.freeTrial))).toBe(true);
    });

    it("sorts by price ascending and descending correctly", () => {
      const asc = filterCoachingPrograms(COACHING, {
        ...DEFAULT_TRAIN_FILTERS,
        sort: "price_asc",
      });
      for (let i = 1; i < asc.length; i++) {
        expect(asc[i].pricePerMonth).toBeGreaterThanOrEqual(asc[i - 1].pricePerMonth);
      }

      const desc = filterCoachingPrograms(COACHING, {
        ...DEFAULT_TRAIN_FILTERS,
        sort: "price_desc",
      });
      for (let i = 1; i < desc.length; i++) {
        expect(desc[i].pricePerMonth).toBeLessThanOrEqual(desc[i - 1].pricePerMonth);
      }
    });

    it("filters accurately by coaches entity type", () => {
      const coaches = filterCoachingPrograms(COACHING, {
        ...DEFAULT_TRAIN_FILTERS,
        entityType: "coaches",
      });
      expect(coaches.length).toBeGreaterThan(0);
      expect(coaches.every((c) => c.entityType === "coach" || c.format === "1-on-1 Private")).toBe(
        true,
      );
    });

    it("filters accurately by academies entity type", () => {
      const academies = filterCoachingPrograms(COACHING, {
        ...DEFAULT_TRAIN_FILTERS,
        entityType: "academies",
      });
      expect(academies.length).toBeGreaterThan(0);
      expect(
        academies.every(
          (a) =>
            a.entityType === "academy" ||
            a.format === "Academy Batch" ||
            a.format === "High-Performance Combine",
        ),
      ).toBe(true);
    });

    it("filters accurately by academy facilities", () => {
      const hostelAcademies = filterCoachingPrograms(COACHING, {
        ...DEFAULT_TRAIN_FILTERS,
        facility: "Hostel / Boarding",
      });
      expect(hostelAcademies.length).toBeGreaterThan(0);
      expect(
        hostelAcademies.every((a) => a.facilities?.some((f) => f.toLowerCase().includes("hostel"))),
      ).toBe(true);
    });
  });

  describe("Train Page UI & Responsive Layout Rendering", () => {
    it("renders the main train page with title, desktop sidebar, and search controls", () => {
      const html = renderToString(<TrainPage />);

      expect(html).toContain("Sports Coaching &amp; Academies");
      expect(html).toContain("NIS &amp; Federation Verified");
      expect(html).toContain("train-desktop-filter-sidebar");
      expect(html).toContain("Refine Coaching");
      expect(html).toContain("train-search-input");
      expect(html).toContain("All Sports");
    });

    it("renders sports chips with cricket, football, and badminton", () => {
      const html = renderToString(<TrainPage />);

      expect(html).toContain("Cricket");
      expect(html).toContain("Football");
      expect(html).toContain("Badminton");
    });

    it("renders registration buttons for coaches and academies separately", () => {
      const html = renderToString(<TrainPage />);

      expect(html).toContain("Register Coach");
      expect(html).toContain("Register Academy");
    });
  });
});
