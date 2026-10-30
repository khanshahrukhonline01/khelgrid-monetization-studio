import { describe, it, expect } from "vitest";
import {
  SportsDataService,
  sportsDataService,
  fetchLiveScores,
  simulateSportsTick,
  buildGoogleSportsUrl,
  type SportsMatch,
} from "./SportsDataService";

describe("SportsDataService", () => {
  it("provides a singleton instance and standardized methods", () => {
    const instance1 = SportsDataService.getInstance();
    const instance2 = SportsDataService.getInstance();
    expect(instance1).toBe(instance2);
    expect(sportsDataService).toBe(instance1);
    expect(typeof instance1.fetchScores).toBe("function");
    expect(typeof instance1.simulateTick).toBe("function");
  });

  it("builds valid Google sports match center URLs", () => {
    const url = buildGoogleSportsUrl({
      teamA: { name: "India" },
      teamB: { name: "Australia" },
      sport: "Cricket",
    });
    expect(url).toContain("https://www.google.com/search?q=");
    expect(url).toContain("India%20vs%20Australia");
    expect(url).toContain("Cricket");
  });

  it("fetches standardized live match scores", async () => {
    const result = await fetchLiveScores({ forceRefresh: true });
    expect(result).toBeDefined();
    expect(Array.isArray(result.matches)).toBe(true);
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.sourceSummary).toMatch(/Google Sports/i);
    expect(result.lastUpdated).toBeDefined();

    const first = result.matches[0];
    expect(first.teamA).toBeDefined();
    expect(first.teamB).toBeDefined();
    expect(first.sport).toBeDefined();
    expect(first.status).toBeDefined();
    expect(first.googleSearchUrl).toContain("google.com/search?q=");

    // Free of proprietary ESPN sources
    for (const match of result.matches) {
      expect(match.source).not.toMatch(/ESPN/i);
    }
  }, 15000);

  it("filters scores by specific sport parameter", async () => {
    const result = await fetchLiveScores({ sport: "Cricket", forceRefresh: false });
    expect(result.matches.every((m) => m.sport === "Cricket")).toBe(true);
  }, 15000);

  it("simulates in-play sports ticks accurately", () => {
    const testMatches: SportsMatch[] = [
      {
        id: "live-cricket-1",
        sport: "Cricket",
        status: "LIVE",
        tournament: "Series",
        teamA: { name: "Team 1", code: "T1", score: "150/3 (20.0 ov)" },
        teamB: { name: "Team 2", code: "T2", score: "Yet to bat" },
        highlight: "Partnership growing",
        venueOrOvers: "20.0/50 ov",
        source: "Google Sports",
      },
      {
        id: "live-football-1",
        sport: "Football",
        status: "LIVE",
        tournament: "League",
        teamA: { name: "Team A", code: "TMA", score: "1" },
        teamB: { name: "Team B", code: "TMB", score: "0" },
        highlight: "Second half underway",
        venueOrOvers: "55'",
        source: "Google Sports",
      },
    ];

    const updated = simulateSportsTick(testMatches);
    expect(updated).toHaveLength(2);
    expect(updated[0].teamA.score).toMatch(/\(\d+\.\d+\s*ov\)/);
    expect(updated[1].venueOrOvers).toBe("56'");
  });
});
