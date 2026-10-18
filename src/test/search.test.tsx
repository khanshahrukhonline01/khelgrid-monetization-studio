import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import SearchPage, { Route } from "@/routes/search";
import { TRIALS, SPORTS, CITIES } from "@/data/trials";

// Mock router
let mockSearchParams: Record<string, unknown> = {
  q: "",
  sport: "All Sports",
  city: "All Locations",
  region: "all",
  sportType: "all",
  dateRange: "all",
  category: "All Categories",
  sort: "Soonest",
  free: false,
  officialOnly: false,
  view: "grid",
};

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
    useSearch: () => mockSearchParams,
  }),
  useNavigate: () => vi.fn(),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

// Mock AuthContext
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    applications: [],
    boostedTrials: [],
    role: "user",
    canApply: () => true,
    applyToTrial: vi.fn(),
  }),
}));

// Mock SavedOpportunityContext & FollowedAcademyContext
vi.mock("@/context/SavedOpportunityContext", () => ({
  useSavedOpportunities: () => ({
    savedIds: [],
    savedOpportunities: [],
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

describe("Search Trials Page & SEO Optimization", () => {
  beforeEach(() => {
    mockSearchParams = {
      q: "",
      sport: "All Sports",
      city: "All Locations",
      category: "All Categories",
      sort: "Soonest",
      free: false,
      officialOnly: false,
      view: "grid",
    };
  });

  describe("SEO Metadata & Structured Data", () => {
    it("provides search-engine indexable metadata with noindex set to false", () => {
      const headFn = (Route as any).head;
      expect(headFn).toBeDefined();

      const seo = headFn({ search: mockSearchParams });
      expect(seo.meta).toBeDefined();

      // Ensure no robots noindex is set
      const robotsMeta = seo.meta.find((m: any) => m.name === "robots");
      expect(robotsMeta?.content).not.toContain("noindex");
      expect(robotsMeta?.content).toContain("index");
    });

    it("dynamically customizes title and meta description based on sport and city search", () => {
      const headFn = (Route as any).head;

      const cricketDelhi = headFn({
        search: { sport: "Cricket", city: "Delhi" },
      });
      const titleEntry = cricketDelhi.meta.find((m: any) => m.title);
      expect(titleEntry?.title).toContain("Cricket");
      expect(titleEntry?.title).toContain("Delhi");

      const footballAll = headFn({
        search: { sport: "Football", city: "All Locations" },
      });
      const footballTitle = footballAll.meta.find((m: any) => m.title);
      expect(footballTitle?.title).toContain("Football");
      expect(footballTitle?.title).toContain("Across India");
    });

    it("embeds Schema.org JSON-LD WebSite SearchAction and FAQPage structured data", () => {
      const headFn = (Route as any).head;
      const seo = headFn({ search: mockSearchParams });

      const scripts = seo.scripts || [];
      const jsonLd = scripts.find((s: any) => s.type === "application/ld+json");
      expect(jsonLd).toBeDefined();

      const parsed = JSON.parse(jsonLd.children);
      const graph = parsed["@graph"] || parsed;
      expect(Array.isArray(graph)).toBe(true);

      const hasWebSite = graph.some((item: any) => item["@type"] === "WebSite");
      const hasBreadcrumbs = graph.some((item: any) => item["@type"] === "BreadcrumbList");
      const hasFAQ = graph.some((item: any) => item["@type"] === "FAQPage");

      expect(hasWebSite).toBe(true);
      expect(hasBreadcrumbs).toBe(true);
      expect(hasFAQ).toBe(true);
    });
  });

  describe("Responsive Page Layout & Content Elements", () => {
    it("renders the search heading, desktop filter sidebar, and sport switcher bar", () => {
      const html = renderToString(<SearchPage />);

      expect(html).toContain("Search Trials and Opportunities");
      expect(html).toContain("desktop-filter-sidebar");
      expect(html).toContain("Refine Trials");
      expect(html).toContain("Cricket");
      expect(html).toContain("Football");
      expect(html).toContain("Trending Searches:");
      expect(html).toContain("About Sports Selection Trials on KhelGrid");
    });

    it("renders the CRPF meritorious sportspersons recruitment notification card with PDF link", () => {
      const html = renderToString(<SearchPage />);

      expect(html).toContain("CRPF Meritorious Sportspersons Recruitment 2026");
      expect(html).toContain(
        "https://rect.crpf.gov.in/Upload/Recruitment/Meritorious_Sportspersons_315092026-672.pdf",
      );
      expect(html).toContain("View Official Notification PDF");
      expect(html).toContain("521 Spots");
      expect(html).toContain("rect.crpf.gov.in");
    });

    it("renders trial cards in grid view by default", () => {
      const html = renderToString(<SearchPage />);

      expect(html).toContain(TRIALS[0].title);
      expect(html).toContain(TRIALS[0].academy.replace(/&/g, "&amp;"));
    });

    it("renders compact list view when view parameter is list", () => {
      mockSearchParams.view = "list";
      const html = renderToString(<SearchPage />);

      expect(html).toContain("spots remaining");
      expect(html).toContain("Details");
      expect(html).toContain("Register");
    });

    it("renders empty state with reset filters action when no trials match", () => {
      mockSearchParams.q = "xyznonexistenttrial12345";
      const html = renderToString(<SearchPage />);

      expect(html).toContain("No Trials Found Matching Filters");
      expect(html).toContain("Reset Filters");
    });

    it("renders Save/Heart toggle buttons and allows viewing favorite trials in separate list", () => {
      const html = renderToString(<SearchPage />);

      expect(html).toContain("My Saved Favorites");
      expect(html).toContain("Saved Favorites");
      expect(html).toContain("Save");
      expect(html).toContain("Save to Favorites");
    });

    it("renders dedicated saved trials empty state when savedOnly is active and none saved", () => {
      mockSearchParams.savedOnly = true;
      const html = renderToString(<SearchPage />);

      expect(html).toContain("No Saved Trials Yet");
      expect(html).toContain("Browse All Selection Trials");
    });
  });
});
