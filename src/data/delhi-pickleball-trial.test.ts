import { describe, it, expect } from "vitest";
import { TRIALS, SPORTS } from "@/data/trials";
import { SPORTS_CATALOG } from "@/data/catalog";
import { buildSeoHead } from "@/lib/seo";

describe("Delhi State Selection Trials (Pickleball) Integration", () => {
  it("includes the Delhi State Pickleball Selection Trials in TRIALS dataset", () => {
    const trial = TRIALS.find((t) => t.id === "t-delhi-pickleball-selection-trials-2026");
    expect(trial).toBeDefined();
    expect(trial?.title).toBe("Delhi State Selection Trials (PWR 400 Pickleball)");
    expect(trial?.sport).toBe("Pickleball");
    expect(trial?.city).toBe("Delhi");
    expect(trial?.date).toBe("Oct 10 - Oct 11, 2026");
    expect(trial?.venue).toBe("The Blue Court, New Delhi");
    expect(trial?.fee).toBe(0);
    expect(trial?.sourceUrl).toBe(
      "https://www.timesnownews.com/sports/pickleball/delhi-state-selection-trials-to-bring-top-pickleball-talent-together-article-156289906",
    );
    expect(trial?.sourceLabel).toContain("Times Now");
    expect(trial?.academy).toContain("Indian Pickleball Association");
    expect(trial?.selectionProcess).toContain("PWR 400");
  });

  it("includes Pickleball in the SPORTS selection filter options", () => {
    expect(SPORTS).toContain("Pickleball");
  });

  it("links correctly to the Pickleball entry in SPORTS_CATALOG", () => {
    const pickleball = SPORTS_CATALOG.find((s) => s.slug === "pickleball");
    expect(pickleball).toBeDefined();
    expect(pickleball?.name).toBe("Pickleball");

    const pickleballTrials = TRIALS.filter(
      (t) => t.sport.toLowerCase() === pickleball?.name.toLowerCase(),
    );
    expect(pickleballTrials.length).toBeGreaterThanOrEqual(1);
    expect(pickleballTrials.some((t) => t.id === "t-delhi-pickleball-selection-trials-2026")).toBe(
      true,
    );
  });

  it("matches Delhi city filtering for selection trials", () => {
    const delhiTrials = TRIALS.filter((t) => t.city.toLowerCase() === "delhi");
    expect(delhiTrials.some((t) => t.id === "t-delhi-pickleball-selection-trials-2026")).toBe(true);
  });

  it("generates correct Open Graph and canonical SEO tags for the trial page", () => {
    const trial = TRIALS.find((t) => t.id === "t-delhi-pickleball-selection-trials-2026")!;
    const seoResult = buildSeoHead({
      title: `${trial.title} · ${trial.sport} Trial in ${trial.city}`,
      description: `${trial.title} hosted by ${trial.academy} in ${trial.city}.`,
      canonicalPath: `/trial/${trial.id}`,
      type: "website",
      image: "https://www.khelgrid.com/og-image.png",
      author: trial.academy,
    });

    const ogTitle = seoResult.meta.find((m) => m.property === "og:title");
    expect(ogTitle?.content).toContain("Delhi State Selection Trials");
    expect(ogTitle?.content).toContain("Pickleball");

    const ogUrl = seoResult.meta.find((m) => m.property === "og:url");
    expect(ogUrl?.content).toContain("/trial/t-delhi-pickleball-selection-trials-2026");

    const canonicalLink = seoResult.links.find((l) => l.rel === "canonical");
    expect(canonicalLink?.href).toContain("/trial/t-delhi-pickleball-selection-trials-2026");
  });
});
