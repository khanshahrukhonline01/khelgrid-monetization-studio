import { describe, it, expect } from "vitest";
import { SPORTS_NEWS_CATALOG } from "./news";
import { BLOG_POSTS } from "./blog";
import { TRIALS } from "./trials";

describe("Asian Para Games 2026 Yahoo Sports Article in KhelChronicle", () => {
  const chronicleArticle = SPORTS_NEWS_CATALOG.find(
    (a) => a.id === "news-yahoo-asian-para-games-2026-full-schedule-sports",
  );

  const blogPost = BLOG_POSTS.find(
    (b) => b.slug === "asian-para-games-2026-full-schedule-18-sports-disciplines-aichi-nagoya",
  );

  it("verifies the article exists in KhelChronicle news catalog with official Yahoo Sports link", () => {
    expect(chronicleArticle).toBeDefined();
    expect(chronicleArticle?.title).toContain(
      "Asian Para Games 2026: Full Schedule, 18 Sports Disciplines",
    );
    expect(chronicleArticle?.officialSourceUrl).toBe(
      "https://sports.yahoo.com/articles/asian-para-games-2026-full-164320224.html",
    );
    expect(chronicleArticle?.onlyChronicle).toBe(true);
    expect(chronicleArticle?.sport).toBe("Multi-Sport");
    expect(chronicleArticle?.category).toBe("Championships");
  });

  it("verifies matching comprehensive blog post exists in KhelChronicle with all 18 sports", () => {
    expect(blogPost).toBeDefined();
    expect(blogPost?.title).toContain("Asian Para Games 2026");
    expect(blogPost?.faqs?.length).toBeGreaterThanOrEqual(4);

    const sportsSection = blogPost?.sections.find((s) => s.heading.includes("18 Confirmed Sports"));
    expect(sportsSection).toBeDefined();
    expect(sportsSection?.bullets?.length).toBe(18);
    expect(sportsSection?.bullets).toContain("Para Archery (Compound, Recurve, W1)");
    expect(sportsSection?.bullets).toContain("Wheelchair Rugby");
  });

  it("ensures the article is strictly NOT present in TRIALS (only in KhelChronicle as instructed)", () => {
    const inTrials = TRIALS.find(
      (t) =>
        t.id.includes("asian-para-games") ||
        t.title.toLowerCase().includes("asian para games") ||
        t.sourceUrl?.includes("sports.yahoo.com/articles/asian-para-games"),
    );
    expect(inTrials).toBeUndefined();
  });
});
