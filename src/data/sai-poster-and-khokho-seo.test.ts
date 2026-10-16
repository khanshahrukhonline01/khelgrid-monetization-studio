import { describe, it, expect } from "vitest";
import { TRIALS, SPORTS } from "./trials";
import { SPORTS_CATALOG } from "./catalog";
import { SPORTS_NEWS_CATALOG } from "./news";
import { SPORTS_LIST } from "@/components/home/SportCategoryPills";
import { TRIAL_IMAGES } from "./card-images";
import { DEFAULT_KEYWORDS, buildSeoHead } from "@/lib/seo";

describe("SAI Circular Poster, Kho-Kho Sports List & SEO Slang Integration", () => {
  const saiPosterUrl =
    "https://sportsauthorityofindia.nic.in/sai_new/public/assets/uploads/selection_trials/5716899f-6ea1-42bf-b571-bb75e888d1c0.jpeg";

  it("verifies SAI NCOE Women Boxing trial card has official posterUrl and imageUrl set", () => {
    const saiTrial = TRIALS.find((t) => t.id === "t-sai-ncoe-aurangabad-women-boxing-trials-2026");
    expect(saiTrial).toBeDefined();
    expect(saiTrial?.posterUrl).toBe(saiPosterUrl);
    expect(saiTrial?.imageUrl).toBe(saiPosterUrl);
    expect(saiTrial?.sourceUrl).toBe(saiPosterUrl);
    expect(saiTrial?.sport).toBe("Boxing");
    expect(saiTrial?.city).toBe("Chhatrapati Sambhajinagar");
    expect(saiTrial?.spots).toBe(5);
  });

  it("ensures the SAI trial card is strictly in Trials & Opportunities, NOT in Khel Chronicle", () => {
    const inChronicle = SPORTS_NEWS_CATALOG.some(
      (article) =>
        article.id.includes("sai-ncoe-aurangabad-women-boxing") ||
        article.title.toLowerCase().includes("sai ncoe women boxing") ||
        (article.sourceUrl && article.sourceUrl.includes("5716899f-6ea1-42bf-b571-bb75e888d1c0")),
    );
    expect(inChronicle).toBe(false);
  });

  it("verifies Kho-Kho is included in all sports lists and catalogs", () => {
    // 1. In TRIALS SPORTS array
    expect(SPORTS).toContain("Kho-Kho");

    // 2. In SPORTS_CATALOG
    const khoKhoCatalog = SPORTS_CATALOG.find((s) => s.slug === "kho-kho");
    expect(khoKhoCatalog).toBeDefined();
    expect(khoKhoCatalog?.name).toBe("Kho-Kho");
    expect(khoKhoCatalog?.emoji).toBe("🏃‍♂️");
    expect(khoKhoCatalog?.highlights.length).toBeGreaterThanOrEqual(2);

    // 3. In SportCategoryPills SPORTS_LIST
    const inPills = SPORTS_LIST.some((s) => s.id === "Kho-Kho");
    expect(inPills).toBe(true);

    // 4. In TRIAL_IMAGES for visual card rendering
    expect(TRIAL_IMAGES["Kho-Kho"]).toBeDefined();
    expect(TRIAL_IMAGES["Kho-Kho"]).toContain("svg");
  });

  it("verifies search engine ranking keywords and Indian sports slangs are defined in DEFAULT_KEYWORDS", () => {
    expect(DEFAULT_KEYWORDS).toContain("game");
    expect(DEFAULT_KEYWORDS).toContain("sport");
    expect(DEFAULT_KEYWORDS).toContain("play");
    expect(DEFAULT_KEYWORDS).toContain("khel");
    expect(DEFAULT_KEYWORDS).toContain("khiladi");
    expect(DEFAULT_KEYWORDS).toContain("maidan");
    expect(DEFAULT_KEYWORDS).toContain("turf");
    expect(DEFAULT_KEYWORDS).toContain("box cricket");
    expect(DEFAULT_KEYWORDS).toContain("akhada");
    expect(DEFAULT_KEYWORDS).toContain("dangal");
    expect(DEFAULT_KEYWORDS).toContain("panga");
    expect(DEFAULT_KEYWORDS).toContain("kho-kho");
    expect(DEFAULT_KEYWORDS).toContain("SAI NCOE");
  });

  it("buildSeoHead generates meta tags including search terms and slang to maximize search rankings", () => {
    const head = buildSeoHead({
      title: "Discover Sports Trials",
      description: "Find open selection trials and book turf maidans.",
      canonicalPath: "/search",
    });

    const keywordsMeta = head.meta.find((m) => m["name"] === "keywords");
    expect(keywordsMeta).toBeDefined();
    expect(keywordsMeta?.["content"]).toContain("game");
    expect(keywordsMeta?.["content"]).toContain("sport");
    expect(keywordsMeta?.["content"]).toContain("play");
    expect(keywordsMeta?.["content"]).toContain("maidan");
    expect(keywordsMeta?.["content"]).toContain("akhada");
    expect(keywordsMeta?.["content"]).toContain("dangal");
  });
});
