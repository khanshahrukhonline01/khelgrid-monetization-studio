import { describe, it, expect } from "vitest";
import { TRIALS, SPORTS, CITIES } from "./trials";
import { VENUES, PLAYO_CITIES, PLAYO_SPORTS } from "./playo";
import { buildSeoHead } from "@/lib/seo";

describe("J&K Kho-Kho Selection Trials & Green Play Field Integration", () => {
  const khoKhoTrial = TRIALS.find((t) => t.id === "t-jk-kho-kho-junior-national-trials-2026");

  it("verifies J&K Kho-Kho trial exists with complete official metadata", () => {
    expect(khoKhoTrial).toBeDefined();
    expect(khoKhoTrial?.title).toBe(
      "Kho-Kho Selection Trials on Oct 19 & 20 for 45th Junior National Championship",
    );
    expect(khoKhoTrial?.academy).toContain("Jammu and Kashmir Kho-Kho Association");
    expect(khoKhoTrial?.sport).toBe("Kho-Kho");
    expect(khoKhoTrial?.city).toBe("Jammu");
    expect(khoKhoTrial?.fee).toBe(0);
    expect(khoKhoTrial?.sourceUrl).toBe(
      "https://www.dailyexcelsior.com/kho-kho-selection-trials-on-oct-19-20/",
    );
    expect(khoKhoTrial?.venue).toContain("Green Play Field");
    expect(khoKhoTrial?.requiredDocuments?.length).toBeGreaterThanOrEqual(4);
    expect(khoKhoTrial?.ageCategory).toContain("Under-18");
  });

  it("verifies Kho-Kho and Jammu are supported in platform filters", () => {
    expect(SPORTS).toContain("Kho-Kho");
    expect(CITIES).toContain("Jammu");
    expect(PLAYO_SPORTS).toContain("Kho-Kho");
    expect(PLAYO_CITIES).toContain("Jammu");
  });

  it("verifies Green Play Field Jammu exists in VENUES with active trial link", () => {
    const venue = VENUES.find((v) => v.id === "v-green-play-field-gandhi-nagar-jammu");
    expect(venue).toBeDefined();
    expect(venue?.city).toBe("Jammu");
    expect(venue?.sports).toContain("Kho-Kho");
    expect(venue?.trialId).toBe("t-jk-kho-kho-junior-national-trials-2026");
    expect(venue?.officialUrl).toBe("https://jksportscouncil.in");
  });

  it("produces valid, SEO-optimized title, description, and canonical URL via buildSeoHead", () => {
    expect(khoKhoTrial).toBeDefined();
    if (!khoKhoTrial) return;

    const head = buildSeoHead({
      title: `${khoKhoTrial.title} · J&K Junior National Trials`,
      description: `${khoKhoTrial.title} organized by ${khoKhoTrial.academy} in ${khoKhoTrial.city}. Selection trials for 45th Junior National Kho-Kho Championship at ${khoKhoTrial.venue}.`,
      canonicalPath: `/trial/${khoKhoTrial.id}`,
      keywords: `${khoKhoTrial.title}, Kho-Kho trials Jammu, JKKKA, Junior National Kho-Kho Championship, Green Play Field Gandhi Nagar`,
    });

    const titleMeta = head.meta.find((m) => "title" in m);
    expect(titleMeta).toBeDefined();
    expect((titleMeta as { title: string }).title).toContain("Kho-Kho Selection Trials");
    expect((titleMeta as { title: string }).title).toContain("KhelGrid");

    const descMeta = head.meta.find((m) => "name" in m && m.name === "description");
    expect(descMeta).toBeDefined();
    expect((descMeta as { content: string }).content).toContain(
      "Jammu and Kashmir Kho-Kho Association",
    );

    const canonicalLink = head.links.find((l) => l.rel === "canonical");
    expect(canonicalLink).toBeDefined();
    expect(canonicalLink?.href).toBe(
      "https://khelgrid.com/trial/t-jk-kho-kho-junior-national-trials-2026",
    );
  });
});
