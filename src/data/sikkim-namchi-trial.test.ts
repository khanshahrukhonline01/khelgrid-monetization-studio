import { describe, it, expect } from "vitest";
import { TRIALS } from "@/data/trials";
import { CITIES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { SPORTS_NEWS_CATALOG } from "@/data/news";
import { buildSeoHead } from "@/lib/seo";

describe("Fit India School Games Namchi Sikkim Selection Trials Integration", () => {
  it("includes the Fit India School Games Namchi trial in TRIALS dataset", () => {
    const trial = TRIALS.find((t) => t.id === "t-fit-india-namchi-sikkim-2026");
    expect(trial).toBeDefined();
    expect(trial?.city).toBe("Namchi");
    expect(trial?.sport).toBe("Athletics");
    expect(trial?.fee).toBe(0);
    expect(trial?.academy).toContain("Government of Sikkim");
    expect(trial?.sourceUrl).toContain("sikkim.gov.in");
    expect(trial?.sourceUrl).toContain(
      "District-Level+Competition+cum+Selection+Trials+for+Fit+India+School+Games+2026+Held+in+Namchi",
    );
    expect(trial?.venue).toContain("Bhaichung Stadium");
  });

  it("links correctly to Namchi in CITIES_CATALOG", () => {
    const city = CITIES_CATALOG.find((c) => c.slug === "namchi");
    expect(city).toBeDefined();
    expect(city?.name).toBe("Namchi");
    expect(city?.state).toBe("Sikkim");
    expect(city?.hubs).toContain("Bhaichung Stadium");

    const namchiTrials = TRIALS.filter((t) => t.city.toLowerCase() === "namchi");
    expect(namchiTrials.length).toBeGreaterThanOrEqual(1);
    expect(namchiTrials[0].id).toBe("t-fit-india-namchi-sikkim-2026");
  });

  it("links correctly to Athletics in SPORTS_CATALOG", () => {
    const athletics = SPORTS_CATALOG.find((s) => s.slug === "athletics");
    expect(athletics).toBeDefined();

    const athleticsTrials = TRIALS.filter(
      (t) => t.sport.toLowerCase() === athletics?.name.toLowerCase(),
    );
    expect(athleticsTrials.some((t) => t.id === "t-fit-india-namchi-sikkim-2026")).toBe(true);
  });

  it("includes news bulletin coverage for Fit India School Games Namchi trials", () => {
    const newsItem = SPORTS_NEWS_CATALOG.find(
      (n) => n.id === "news-fit-india-school-games-namchi-2026",
    );
    expect(newsItem).toBeDefined();
    expect(newsItem?.title).toContain(
      "District-Level Competition cum Selection Trials for Fit India School Games 2026 Held in Namchi",
    );
    expect(newsItem?.tags).toContain("Fit India");
    expect(newsItem?.tags).toContain("Namchi");
    expect(newsItem?.tags).toContain("Sikkim");
  });

  it("generates correct Open Graph and canonical SEO tags for the Namchi selection trial", () => {
    const trial = TRIALS.find((t) => t.id === "t-fit-india-namchi-sikkim-2026")!;
    const seoResult = buildSeoHead({
      title: `${trial.title} · ${trial.sport} Trial in ${trial.city}`,
      description: `${trial.title} hosted by ${trial.academy} in ${trial.city}.`,
      canonicalPath: `/trial/${trial.id}`,
      type: "website",
      image: "https://www.khelgrid.com/og-image.png",
      author: trial.academy,
    });

    const ogTitle = seoResult.meta.find((m) => m.property === "og:title");
    expect(ogTitle?.content).toContain("Fit India School Games District Selection Trials");
    expect(ogTitle?.content).toContain("Namchi");

    const ogUrl = seoResult.meta.find((m) => m.property === "og:url");
    expect(ogUrl?.content).toContain("/trial/t-fit-india-namchi-sikkim-2026");

    const canonicalLink = seoResult.links.find((l) => l.rel === "canonical");
    expect(canonicalLink?.href).toContain("/trial/t-fit-india-namchi-sikkim-2026");
  });
});
