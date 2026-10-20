import { describe, it, expect } from "vitest";
import { TRIALS } from "./trials";
import { VENUES } from "./khelgrid";
import { SPORTS_NEWS_CATALOG } from "./news";

describe("DDCA Delhi Women's U-15 Open Trials & Venue Integration", () => {
  const ddcaTrial = TRIALS.find((t) => t.id === "t-ddca-delhi-womens-u15-cricket-2026");

  it("verifies DDCA trial exists in TRIALS with complete official metadata", () => {
    expect(ddcaTrial).toBeDefined();
    expect(ddcaTrial?.title).toBe(
      "DDCA Invites Applications for Delhi Women’s U-15 Team Open Trials for 2026–27 Season",
    );
    expect(ddcaTrial?.academy).toContain("Delhi & District Cricket Association");
    expect(ddcaTrial?.sport).toBe("Cricket");
    expect(ddcaTrial?.city).toBe("Delhi");
    expect(ddcaTrial?.fee).toBe(0);
    expect(ddcaTrial?.sourceUrl).toBe(
      "https://www.deccanchronicle.com/amp/sports/ddca-invites-applications-for-delhi-womens-u-15-team-open-trials-for-202627-season-1995820",
    );
    expect(ddcaTrial?.ageCategory).toContain("Women U-15");
    expect(ddcaTrial?.gender).toContain("Women");
    expect(ddcaTrial?.venue).toContain("Arun Jaitley Stadium");
    expect(ddcaTrial?.requiredDocuments).toBeDefined();
    expect(ddcaTrial?.requiredDocuments?.length).toBeGreaterThanOrEqual(4);
  });

  it("verifies DDCA trial is NOT added to Khel Chronicle / news data", () => {
    const chronicleMatch = SPORTS_NEWS_CATALOG.find(
      (article) =>
        article.title.toLowerCase().includes("ddca invites applications") ||
        article.headline?.toLowerCase().includes("ddca invites applications"),
    );
    expect(chronicleMatch).toBeUndefined();
  });

  it("verifies DDCA Arun Jaitley Stadium exists in VENUES with active trial link", () => {
    const ddcaVenue = VENUES.find((v) => v.id === "v-ddca-arun-jaitley-stadium-delhi");
    expect(ddcaVenue).toBeDefined();
    expect(ddcaVenue?.city).toBe("Delhi");
    expect(ddcaVenue?.sports).toContain("Cricket");
    expect(ddcaVenue?.trialId).toBe("t-ddca-delhi-womens-u15-cricket-2026");
    expect(ddcaVenue?.officialUrl).toBe("https://ddca.in");
    expect(ddcaVenue?.bookable).toBe(true);
  });
});
