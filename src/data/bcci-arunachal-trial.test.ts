import { describe, it, expect } from "vitest";
import { TRIALS, CITIES } from "./trials";
import { VENUES, KHELGRID_CITIES } from "./khelgrid";
import { buildSeoHead } from "@/lib/seo";

describe("BCCI Arunachal Pradesh Ranji Trials & BCCI Venues Integration", () => {
  const bcciTrial = TRIALS.find((t) => t.id === "t-bcci-arunachal-pradesh-ranji-trials-2026");

  it("verifies BCCI Arunachal Ranji trial exists with complete official metadata", () => {
    expect(bcciTrial).toBeDefined();
    expect(bcciTrial?.title).toBe(
      "BCCI to Conduct Trials to Ensure Arunachal Pradesh's Ranji Participation",
    );
    expect(bcciTrial?.academy).toBe("Board of Control for Cricket in India (BCCI)");
    expect(bcciTrial?.sport).toBe("Cricket");
    expect(bcciTrial?.city).toBe("Itanagar");
    expect(bcciTrial?.fee).toBe(0);
    expect(bcciTrial?.sourceUrl).toBe(
      "https://www.hindustantimes.com/cricket/bcci-to-conduct-trials-to-ensure-arunachal-pradeshs-ranji-participation-101791969126681.html",
    );
    expect(bcciTrial?.sources?.some((s) => s.url.includes("bcci.tv"))).toBe(true);
    expect(bcciTrial?.venue).toContain("Yupia Cricket Ground");
    expect(bcciTrial?.requiredDocuments?.length).toBeGreaterThanOrEqual(4);
    expect(
      bcciTrial?.organizerContacts?.some((c) => c.name.includes("Satya Gopal Chakraborty")),
    ).toBe(true);
  });

  it("verifies Itanagar is included in searchable cities for both trials and venue booking", () => {
    expect(CITIES).toContain("Itanagar");
    expect(KHELGRID_CITIES).toContain("Itanagar");
  });

  it("verifies BCCI-recognized venues exist in Arunachal Pradesh with active trial integration", () => {
    const yupia = VENUES.find((v) => v.id === "v-bcci-yupia-cricket-ground-itanagar");
    expect(yupia).toBeDefined();
    expect(yupia?.city).toBe("Itanagar");
    expect(yupia?.sports).toContain("Cricket");
    expect(yupia?.trialId).toBe("t-bcci-arunachal-pradesh-ranji-trials-2026");
    expect(yupia?.officialUrl).toContain("bcci.tv");

    const rajivGandhi = VENUES.find((v) => v.id === "v-bcci-rajiv-gandhi-stadium-naharlagun");
    expect(rajivGandhi).toBeDefined();
    expect(rajivGandhi?.city).toBe("Itanagar");
    expect(rajivGandhi?.sports).toContain("Cricket");
    expect(rajivGandhi?.officialUrl).toContain("bcci.tv");
  });

  it("produces valid, SEO-optimized title, description, and canonical URL via buildSeoHead", () => {
    expect(bcciTrial).toBeDefined();
    if (!bcciTrial) return;

    const head = buildSeoHead({
      title: `${bcciTrial.title} · Ranji Trophy & State Combine`,
      description: `${bcciTrial.title} conducted by ${bcciTrial.academy} in ${bcciTrial.city}. Selection trials for Ranji Trophy and domestic tournaments at ${bcciTrial.venue}.`,
      canonicalPath: `/trial/${bcciTrial.id}`,
      keywords: `${bcciTrial.title}, BCCI cricket trials, Arunachal Pradesh Ranji Trophy, Yupia Cricket Stadium, Indian domestic cricket`,
    });

    const titleMeta = head.meta.find((m) => "title" in m);
    expect(titleMeta).toBeDefined();
    expect((titleMeta as { title: string }).title).toContain("BCCI to Conduct Trials");
    expect((titleMeta as { title: string }).title).toContain("KhelGrid");

    const descMeta = head.meta.find((m) => "name" in m && m.name === "description");
    expect(descMeta).toBeDefined();
    expect((descMeta as { content: string }).content).toContain(
      "Board of Control for Cricket in India (BCCI)",
    );

    const canonicalLink = head.links.find((l) => l.rel === "canonical");
    expect(canonicalLink).toBeDefined();
    expect(canonicalLink?.href).toBe(
      "https://www.khelgrid.com/trial/t-bcci-arunachal-pradesh-ranji-trials-2026",
    );

    const ogTitle = head.meta.find((m) => "property" in m && m.property === "og:title");
    expect(ogTitle).toBeDefined();
    expect((ogTitle as { content: string }).content).toContain("BCCI to Conduct Trials");
  });
});
