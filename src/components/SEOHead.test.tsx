import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { SEOHead } from "./SEOHead";
import {
  buildBreadcrumbsFromPath,
  generateBreadcrumbSchema,
  generateSitelinksSearchboxSchema,
  generateSitelinksNavigationSchema,
  generateOrganizationSchema,
  generateRouteSpecificSchema,
  generateFullRouteJsonLd,
  SITE_URL,
} from "@/lib/seo";

describe("SEOHead & JSON-LD Structured Data", () => {
  beforeEach(() => {
    if (typeof document !== "undefined") {
      const existing = document.getElementById("khelgrid-dynamic-jsonld");
      if (existing) existing.remove();
    }
  });

  afterEach(() => {
    if (typeof document !== "undefined") {
      const existing = document.getElementById("khelgrid-dynamic-jsonld");
      if (existing) existing.remove();
    }
    vi.restoreAllMocks();
  });

  describe("Breadcrumbs generation (buildBreadcrumbsFromPath & generateBreadcrumbSchema)", () => {
    it("generates root breadcrumb for homepage", () => {
      const crumbs = buildBreadcrumbsFromPath("/");
      expect(crumbs).toHaveLength(1);
      expect(crumbs[0]).toEqual({ name: "Home", item: SITE_URL });

      const schema = generateBreadcrumbSchema("/");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0]).toEqual({
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      });
    });

    it("generates 2-level breadcrumbs for standard top-level sections", () => {
      const crumbs = buildBreadcrumbsFromPath("/sports");
      expect(crumbs).toEqual([
        { name: "Home", item: SITE_URL },
        { name: "Sports", item: `${SITE_URL}/sports` },
      ]);

      const schema = generateBreadcrumbSchema("/sports");
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[1].name).toBe("Sports");
      expect(schema.itemListElement[1].item).toBe(`${SITE_URL}/sports`);
    });

    it("generates 3-level breadcrumbs for nested routes like /sports/badminton", () => {
      const crumbs = buildBreadcrumbsFromPath("/sports/badminton");
      expect(crumbs).toEqual([
        { name: "Home", item: SITE_URL },
        { name: "Sports", item: `${SITE_URL}/sports` },
        { name: "Badminton", item: `${SITE_URL}/sports/badminton` },
      ]);

      const schema = generateBreadcrumbSchema("/sports/badminton");
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[2].name).toBe("Badminton");
      expect(schema.itemListElement[2].position).toBe(3);
    });

    it("correctly maps singular prefix /sport/cricket to parent hub /sports", () => {
      const crumbs = buildBreadcrumbsFromPath("/sport/cricket");
      expect(crumbs).toEqual([
        { name: "Home", item: SITE_URL },
        { name: "Sports", item: `${SITE_URL}/sports` },
        { name: "Cricket", item: `${SITE_URL}/sport/cricket` },
      ]);
    });

    it("correctly maps /venue/123 to parent hub /book", () => {
      const crumbs = buildBreadcrumbsFromPath("/venue/123");
      expect(crumbs).toEqual([
        { name: "Home", item: SITE_URL },
        { name: "Book venues", item: `${SITE_URL}/book` },
        { name: "123", item: `${SITE_URL}/venue/123` },
      ]);
    });

    it("supports custom breadcrumb overrides", () => {
      const custom = [
        { name: "Custom Hub", path: "/custom" },
        { name: "Special Item", path: "/custom/item" },
      ];
      const crumbs = buildBreadcrumbsFromPath("/any-path", custom);
      expect(crumbs[0]).toEqual({ name: "Home", item: SITE_URL });
      expect(crumbs[1]).toEqual({ name: "Custom Hub", item: `${SITE_URL}/custom` });
      expect(crumbs[2]).toEqual({ name: "Special Item", item: `${SITE_URL}/custom/item` });
    });
  });

  describe("Sitelinks structured data", () => {
    it("generates WebSite schema with Sitelinks Searchbox potentialAction", () => {
      const sitelinks = generateSitelinksSearchboxSchema();
      expect(sitelinks["@type"]).toBe("WebSite");
      expect(sitelinks["@id"]).toBe(`${SITE_URL}/#website`);
      expect(sitelinks.name).toBe("KhelGrid");
      expect(sitelinks.potentialAction["@type"]).toBe("SearchAction");
      expect(sitelinks.potentialAction.target["@type"]).toBe("EntryPoint");
      expect(sitelinks.potentialAction.target.urlTemplate).toContain("/search?q=");
    });

    it("generates Sitelinks Navigation ItemList schema with primary app links", () => {
      const navList = generateSitelinksNavigationSchema();
      expect(navList["@type"]).toBe("ItemList");
      expect(navList["@id"]).toBe(`${SITE_URL}/#sitelinks`);
      expect(navList.itemListElement.length).toBeGreaterThanOrEqual(6);

      const searchItem = navList.itemListElement.find((i) => i.url === `${SITE_URL}/search`);
      expect(searchItem).toBeDefined();
      expect(searchItem?.name).toBe("Search Trials and Opportunities");

      const playItem = navList.itemListElement.find((i) => i.url === `${SITE_URL}/play`);
      expect(playItem).toBeDefined();
      expect(playItem?.name).toBe("Play Pickup Games");

      const bookItem = navList.itemListElement.find((i) => i.url === `${SITE_URL}/book`);
      expect(bookItem).toBeDefined();
    });
  });

  describe("Organization schema", () => {
    it("generates SportsOrganization schema with verified brand assets", () => {
      const org = generateOrganizationSchema();
      expect(org["@type"]).toBe("SportsOrganization");
      expect(org["@id"]).toBe(`${SITE_URL}/#organization`);
      expect(org.url).toBe(SITE_URL);
      expect(org.logo).toBe(`${SITE_URL}/favicon-96x96.png`);
      expect(org.contactPoint.email).toBe("khelgrid@gmail.com");
    });
  });

  describe("Route-specific schema", () => {
    it("assigns SearchResultsPage to /search", () => {
      const schema = generateRouteSpecificSchema("/search", { title: "Search Trials" });
      expect(schema["@type"]).toBe("SearchResultsPage");
    });

    it("assigns WebApplication to /tools/calorie-counter", () => {
      const schema = generateRouteSpecificSchema("/tools/calorie-counter", {
        title: "Calorie Counter",
      });
      expect(schema["@type"]).toBe("WebApplication");
      expect(schema.applicationCategory).toBe("SportsApplication");
    });

    it("assigns SportsActivityLocation to /play", () => {
      const schema = generateRouteSpecificSchema("/play", { title: "Play Pickup Games" });
      expect(schema["@type"]).toBe("SportsActivityLocation");
    });

    it("assigns Article to /guide/cricket-technique", () => {
      const schema = generateRouteSpecificSchema("/guide/cricket-technique", {
        title: "Cricket Technique",
        author: "Coach Sharma",
      });
      expect(schema["@type"]).toBe("Article");
      expect((schema.author as any).name).toBe("Coach Sharma");
    });
  });

  describe("Full route JSON-LD graph compilation", () => {
    it("compiles a comprehensive @graph with all schemas", () => {
      const full = generateFullRouteJsonLd("/sports/badminton", {
        title: "Badminton Trials & Hub",
        description: "Find badminton trials across India",
        canonicalPath: "/sports/badminton",
      });

      expect(full["@context"]).toBe("https://schema.org");
      expect(Array.isArray(full["@graph"])).toBe(true);

      const types = full["@graph"].map((item) => item["@type"]);
      expect(types).toContain("WebSite");
      expect(types).toContain("SportsOrganization");
      expect(types).toContain("ItemList");
      expect(types).toContain("BreadcrumbList");
      expect(types).toContain("WebPage");

      const breadcrumbs = full["@graph"].find((item) => item["@type"] === "BreadcrumbList");
      expect((breadcrumbs as any).itemListElement).toHaveLength(3);
    });
  });

  describe("<SEOHead /> React Component", () => {
    it("renders valid JSON-LD script tag with @graph containing all schemas", () => {
      const html = renderToString(
        <SEOHead
          title="Badminton Page"
          description="Description of badminton"
          canonicalPath="/sports/badminton"
        />,
      );

      expect(html).toContain('id="khelgrid-dynamic-jsonld-ssr"');
      expect(html).toContain('type="application/ld+json"');

      // Extract JSON-LD content from the rendered HTML string
      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      expect(match).not.toBeNull();
      const json = JSON.parse(match![1]);

      expect(json["@context"]).toBe("https://schema.org");
      expect(Array.isArray(json["@graph"])).toBe(true);

      const types = json["@graph"].map((i: any) => i["@type"]);
      expect(types).toContain("WebSite");
      expect(types).toContain("SportsOrganization");
      expect(types).toContain("ItemList");
      expect(types).toContain("BreadcrumbList");

      const breadcrumbs = json["@graph"].find((i: any) => i["@type"] === "BreadcrumbList");
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs.itemListElement).toHaveLength(3);
      expect(breadcrumbs.itemListElement[0].name).toBe("Home");
      expect(breadcrumbs.itemListElement[1].name).toBe("Sports");
      expect(breadcrumbs.itemListElement[2].name).toBe("Badminton");
    });

    it("injects FAQPage schema when faqs prop is supplied", () => {
      const html = renderToString(
        <SEOHead
          canonicalPath="/faqs"
          faqs={[
            {
              question: "How do I register for trials?",
              answer: "Visit the search page and click Apply.",
            },
          ]}
        />,
      );

      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      expect(match).not.toBeNull();
      const json = JSON.parse(match![1]);

      const faqObj = json["@graph"].find((i: any) => i["@type"] === "FAQPage");
      expect(faqObj).toBeDefined();
      expect(faqObj.mainEntity[0].name).toBe("How do I register for trials?");
      expect(faqObj.mainEntity[0].acceptedAnswer.text).toBe(
        "Visit the search page and click Apply.",
      );
    });

    it("injects custom schema when customSchema prop is provided", () => {
      const html = renderToString(
        <SEOHead
          canonicalPath="/custom-route"
          customSchema={{
            "@type": "SpecialAnnouncement",
            name: "National Trial Registration Open",
          }}
        />,
      );

      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      expect(match).not.toBeNull();
      const json = JSON.parse(match![1]);

      const customObj = json["@graph"].find((i: any) => i["@type"] === "SpecialAnnouncement");
      expect(customObj).toBeDefined();
      expect(customObj.name).toBe("National Trial Registration Open");
    });

    it("renders with zero props, defaulting gracefully and including breadcrumbs and sitelinks", () => {
      const html = renderToString(<SEOHead />);
      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      expect(match).not.toBeNull();
      const json = JSON.parse(match![1]);

      expect(json["@context"]).toBe("https://schema.org");
      expect(Array.isArray(json["@graph"])).toBe(true);

      const sitelinks = json["@graph"].find((i: any) => i["@type"] === "WebSite");
      expect(sitelinks).toBeDefined();

      const breadcrumbs = json["@graph"].find((i: any) => i["@type"] === "BreadcrumbList");
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs.itemListElement).toHaveLength(1);
      expect(breadcrumbs.itemListElement[0].name).toBe("Home");
    });
  });
});
