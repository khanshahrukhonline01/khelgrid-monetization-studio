import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  getDefaultSportsCV,
  loadSportsCVData,
  saveSportsCVData,
  buildScoutTextSummary,
  SPORTS_CV_STORAGE_KEY,
} from "@/lib/sports-cv-storage";
import { SportsCVCard } from "./SportsCVCard";
import {
  SPORT_POSITION_PRESETS,
  COMMON_METRIC_PRESETS,
  type SportsCVData,
} from "@/types/sports-cv";

describe("Sports CV Component & Data Layer", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  describe("Data Storage and Helper Utilities", () => {
    it("generates realistic default sports CV data with position, metrics, and achievements", () => {
      const data = getDefaultSportsCV("Rohan Verma");
      expect(data.athleteName).toBe("Rohan Verma");
      expect(data.sport).toBe("Cricket");
      expect(data.position).toContain("Bowler");
      expect(data.achievements.length).toBeGreaterThanOrEqual(1);
      expect(data.performanceMetrics.length).toBeGreaterThanOrEqual(1);
      expect(data.verified).toBe(true);
      expect(data.theme).toBe("gold");
    });

    it("saves and reloads sports CV data from localStorage", () => {
      const initial = getDefaultSportsCV("Priya Nair");
      initial.position = "Striker / Center Forward";
      initial.sport = "Football";

      saveSportsCVData(initial);
      const loaded = loadSportsCVData();
      expect(loaded.athleteName).toBe("Priya Nair");
      expect(loaded.position).toBe("Striker / Center Forward");
      expect(loaded.sport).toBe("Football");
    });

    it("formats a rich, scannable text summary for scouts and recruiters", () => {
      const data = getDefaultSportsCV("Aarav Sharma");
      const summary = buildScoutTextSummary(data);

      expect(summary).toContain("ATHLETE SPORTS CV");
      expect(summary).toContain("Aarav Sharma");
      expect(summary).toContain("KEY PERFORMANCE METRICS:");
      expect(summary).toContain("ATHLETIC ACHIEVEMENTS & HONOURS:");
      expect(summary).toContain("Verified Profile ID:");
    });

    it("provides position presets for all core sports", () => {
      expect(SPORT_POSITION_PRESETS.Cricket.length).toBeGreaterThan(3);
      expect(SPORT_POSITION_PRESETS.Football.length).toBeGreaterThan(3);
      expect(SPORT_POSITION_PRESETS.Basketball.length).toBeGreaterThan(3);
      expect(SPORT_POSITION_PRESETS.Athletics.length).toBeGreaterThan(3);
    });

    it("provides performance metric test presets with benchmarks", () => {
      expect(COMMON_METRIC_PRESETS.Cricket.length).toBeGreaterThan(2);
      const cricketSprint = COMMON_METRIC_PRESETS.Cricket.find((m) =>
        m.name.toLowerCase().includes("sprint"),
      );
      expect(cricketSprint).toBeDefined();
      expect(cricketSprint?.benchmark).toBeDefined();
    });
  });

  describe("SportsCVCard Visual Presentation", () => {
    it("renders the athlete name, position, and sport badge", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Vikram Rathore"),
        sport: "Basketball",
        position: "Point Guard (PG)",
        jerseyNumber: "#30",
        city: "Bengaluru",
        state: "Karnataka",
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Vikram Rathore");
      expect(html).toContain("Point Guard (PG)");
      expect(html).toContain("Basketball");
      expect(html).toContain("#30");
      expect(html).toContain("Bengaluru");
      expect(html).toContain("Karnataka");
    });

    it("renders all athletic achievements in the visual card", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Kavya Patel"),
        achievements: [
          {
            id: "ach-t1",
            title: "National Badminton Championship Finalist",
            competition: "All-India Junior Nationals 2025",
            year: 2025,
            level: "National",
            award: "Silver / 2nd Place",
            description: "Runner up in U-19 Singles category out of 128 seeded contenders.",
            verified: true,
          },
        ],
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("National Badminton Championship Finalist");
      expect(html).toContain("All-India Junior Nationals 2025");
      expect(html).toContain("Silver / 2nd Place");
      expect(html).toContain("National");
      expect(html).toContain("2025");
    });

    it("renders performance metrics with value, unit, and progress bars", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Devansh Sen"),
        performanceMetrics: [
          {
            id: "met-t1",
            name: "Yo-Yo Intermittent Recovery 1",
            value: "20.8",
            unit: "level",
            category: "Endurance",
            score: 95,
            benchmark: "Elite Standard: 20.0+",
          },
          {
            id: "met-t2",
            name: "Max Sprint Speed",
            value: "33.2",
            unit: "km/h",
            category: "Speed",
            score: 92,
            benchmark: "Top Decile",
          },
        ],
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Yo-Yo Intermittent Recovery 1");
      expect(html).toContain("20.8");
      expect(html).toContain("level");
      expect(html).toContain("Max Sprint Speed");
      expect(html).toContain("33.2");
      expect(html).toContain("km/h");
      expect(html).toContain("Elite Standard: 20.0+");
    });

    it("renders scout verification badge and QR code section", () => {
      const data = getDefaultSportsCV("Sahil Khan");
      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Verified Sports CV");
      expect(html).toContain("Digital Scout Verification");
      expect(html).toContain(data.athleteId);
    });

    it("renders connected athletic social media handles and highlight reels", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Smriti Mandhana Fan"),
        socialProfiles: {
          instagram: "@smriti_future_star",
          youtube: "https://youtu.be/match-highlights-2026",
          twitter: "@smriti_cricket",
          cricheroes: "https://cricheroes.com/player-profile/smriti-99",
          strava: "https://www.strava.com/athletes/123456",
          playo: "https://khelgrid.com/profile/smriti",
        },
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Connected Socials &amp; Match Footage");
      expect(html).toContain("@smriti_future_star");
      expect(html).toContain("Watch Skills Reel");
      expect(html).toContain("@smriti_cricket");
      expect(html).toContain("CricHeroes Stats");
      expect(html).toContain("Strava Activity");
      expect(html).toContain("KhelGrid Karma");
    });

    it("applies theme styles (cyber, emerald, crimson, gold, classic)", () => {
      const dataGold = getDefaultSportsCV();
      dataGold.theme = "gold";
      const htmlGold = renderToString(<SportsCVCard data={dataGold} />);
      expect(htmlGold).toContain("border-amber-500/40");

      const dataCyber = { ...dataGold, theme: "cyber" as const };
      const htmlCyber = renderToString(<SportsCVCard data={dataCyber} />);
      expect(htmlCyber).toContain("border-cyan-500/40");

      const dataEmerald = { ...dataGold, theme: "emerald" as const };
      const htmlEmerald = renderToString(<SportsCVCard data={dataEmerald} />);
      expect(htmlEmerald).toContain("border-emerald-500/40");
    });

    it("renders position and squad history timeline with teams, roles and caps", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Kabir Das"),
        positionHistory: [
          {
            id: "pos-test-1",
            period: "2024 - Present",
            team: "Bengaluru FC Youth Academy",
            position: "Attacking Midfielder (CAM)",
            secondaryPosition: "Left Winger",
            level: "State",
            isCurrent: true,
            appearances: 24,
            notes: "Lead playmaker with 14 assists in state league.",
          },
          {
            id: "pos-test-2",
            period: "2022 - 2024",
            team: "Bishop Cotton Boys School First XI",
            position: "Central Midfielder",
            level: "School",
            isCurrent: false,
            appearances: 30,
            notes: "Inter-school tournament winner.",
          },
        ],
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Position &amp; Squad History");
      expect(html).toContain("Attacking Midfielder (CAM)");
      expect(html).toContain("Bengaluru FC Youth Academy");
      expect(html).toContain("Current Squad");
      expect(html).toContain("24");
      expect(html).toContain("Caps / Matches");
      expect(html).toContain("Bishop Cotton Boys School First XI");
      expect(html).toContain("2022 - 2024");
    });

    it("renders career stats summary cards and season-by-season match records table", () => {
      const data: SportsCVData = {
        ...getDefaultSportsCV("Rhea Pillai"),
        careerSummary: {
          totalMatches: 82,
          winRate: "72%",
          primaryMetric: { label: "Total Goals", value: 46 },
          secondaryMetric: { label: "Total Assists", value: 28 },
          tertiaryMetric: { label: "Pass Accuracy", value: "86.4%" },
        },
        careerSeasonStats: [
          {
            id: "season-test-1",
            season: "2024-25",
            teamOrTournament: "Karnataka Women's State League",
            matches: 14,
            stat1Label: "Goals",
            stat1Value: 18,
            stat2Label: "Assists",
            stat2Value: 10,
            stat3Label: "Pass Acc",
            stat3Value: "88%",
            ratingOrHighlight: "Golden Boot Winner",
          },
        ],
      };

      const html = renderToString(<SportsCVCard data={data} />);

      expect(html).toContain("Career Stats &amp; Match Records");
      expect(html).toContain("Career Matches");
      expect(html).toContain("82");
      expect(html).toContain("72%");
      expect(html).toContain("Win/Select Rate");
      expect(html).toContain("Total Goals");
      expect(html).toContain("46");
      expect(html).toContain("Total Assists");
      expect(html).toContain("28");
      expect(html).toContain("Karnataka Women&#x27;s State League");
      expect(html).toContain("Golden Boot Winner");
      expect(html).toContain("2024-25");
    });
  });
});
