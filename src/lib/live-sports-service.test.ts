import { afterEach, describe, expect, it, vi } from "vitest";
import { getLiveSportsUpdates, simulateRealtimeSportsTick } from "./live-sports-service";
import type { LiveMatchUpdate } from "@/data/liveSports";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("LiveSportsService", () => {
  it("fetches sports data and returns structured matches", async () => {
    const result = await getLiveSportsUpdates(false);
    expect(result).toBeDefined();
    expect(Array.isArray(result.matches)).toBe(true);
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.lastUpdated).toBeDefined();

    const firstMatch = result.matches[0];
    expect(firstMatch.teamA).toBeDefined();
    expect(firstMatch.teamB).toBeDefined();
    expect(firstMatch.sport).toBeDefined();
    expect(firstMatch.status).toBeDefined();
  }, 15000);

  it("simulates real-time updates for in-play cricket and football matches", () => {
    const mockMatches: LiveMatchUpdate[] = [
      {
        id: "test-cricket",
        sport: "Cricket",
        status: "LIVE",
        tournament: "Test Cup",
        teamA: { name: "Team 1", code: "T1", score: "100/2 (10.0 ov)" },
        teamB: { name: "Team 2", code: "T2", score: "Yet to bat" },
        highlight: "Opening partnership",
        venueOrOvers: "10.0/50 ov",
        source: "Test",
      },
      {
        id: "test-football",
        sport: "Football",
        status: "LIVE",
        tournament: "Test League",
        teamA: { name: "Team A", code: "TMA", score: "1" },
        teamB: { name: "Team B", code: "TMB", score: "1" },
        highlight: "Half-time whistle",
        venueOrOvers: "45'",
        source: "Test",
      },
      {
        id: "test-final",
        sport: "Football",
        status: "RECENT",
        tournament: "Test League",
        teamA: { name: "Team A", code: "TMA", score: "2" },
        teamB: { name: "Team B", code: "TMB", score: "1" },
        highlight: "Match finished",
        venueOrOvers: "FT",
        source: "Test",
      },
    ];

    const updated = simulateRealtimeSportsTick(mockMatches);
    expect(updated).toHaveLength(3);

    // Final matches should not change
    expect(updated[2].venueOrOvers).toBe("FT");

    // Cricket match should have updated over/ball
    expect(updated[0].teamA.score).toMatch(/\(\d+\.\d+\s*ov\)/);

    // Football match clock should have ticked
    expect(updated[1].venueOrOvers).toBe("46'");
  });

  it("ensures live feeds attribute to Google Sports and non-copyrighted sources", async () => {
    const rssFeed = `<?xml version="1.0"?>
      <rss><channel><item>
        <title>India vs Australia - live cricket score</title>
        <link>https://news.google.com/articles/test-fixture</link>
        <pubDate>Sat, 24 Oct 2026 12:00:00 GMT</pubDate>
      </item></channel></rss>`;

    // Keep this a deterministic feed-contract test, not a dependency on Google's live network.
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(rssFeed, {
            status: 200,
            headers: { "Content-Type": "application/rss+xml" },
          }),
      ),
    );

    const result = await getLiveSportsUpdates(true);
    expect(result.sourceSummary).toMatch(/Google Sports/i);
    expect(result.matches.some((match) => match.source.includes("Google Sports"))).toBe(true);

    // Absolutely no ESPN proprietary source
    for (const match of result.matches) {
      expect(match.source).not.toMatch(/ESPN/i);
    }
  });
});
