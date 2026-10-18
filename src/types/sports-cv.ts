export type SportType =
  | "Cricket"
  | "Football"
  | "Basketball"
  | "Badminton"
  | "Athletics"
  | "Tennis"
  | "Kabaddi"
  | "Swimming"
  | "Hockey"
  | "Other";

export type CardTheme = "gold" | "cyber" | "emerald" | "crimson" | "classic";

export type AchievementLevel =
  "School" | "Club" | "District" | "State" | "National" | "International";

export type AwardType =
  | "Gold / 1st Place"
  | "Silver / 2nd Place"
  | "Bronze / 3rd Place"
  | "MVP / Best Player"
  | "Best Bowler"
  | "Best Batsman"
  | "Top Scorer"
  | "State Selection"
  | "Finalist"
  | "Certificate of Merit";

export interface AthleticAchievement {
  id: string;
  title: string;
  competition: string;
  year: number;
  level: AchievementLevel;
  award: AwardType;
  description?: string;
  verified?: boolean;
}

export interface PositionHistoryEntry {
  id: string;
  period: string; // e.g. "2024 - Present" or "2023 - 2024"
  team: string; // e.g. "Delhi State U-19 Squad"
  position: string; // e.g. "Opening Bowler (Right-Arm Fast)"
  secondaryPosition?: string; // e.g. "Death Overs Specialist"
  level: AchievementLevel;
  isCurrent?: boolean;
  notes?: string;
  appearances?: number;
}

export interface CareerStatSeason {
  id: string;
  season: string; // e.g. "2024-25" or "2024"
  teamOrTournament: string; // e.g. "BCCI Cooch Behar Trophy"
  matches: number;
  stat1Label: string; // e.g. "Runs" or "Goals" or "Points"
  stat1Value: string | number;
  stat2Label: string; // e.g. "Wickets" or "Assists" or "Win %"
  stat2Value: string | number;
  stat3Label?: string; // e.g. "Bowling Avg" or "Pass Acc"
  stat3Value?: string | number;
  ratingOrHighlight?: string; // e.g. "Player of the Final" or "8.8 Avg Rating"
}

export interface CareerSummaryStats {
  totalMatches: number;
  winRate?: string;
  primaryMetric: { label: string; value: string | number };
  secondaryMetric: { label: string; value: string | number };
  tertiaryMetric?: { label: string; value: string | number };
  quaternaryMetric?: { label: string; value: string | number };
}

export type MetricCategory = "Athleticism" | "Speed" | "Endurance" | "Power" | "Sport-Specific";

export interface PerformanceMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  category: MetricCategory;
  score?: number; // 0 to 100 for visual gauge/bar
  benchmark?: string; // e.g. "State Benchmark: 5.1s"
}

export interface SocialProfiles {
  instagram?: string;
  youtube?: string;
  twitter?: string;
  cricheroes?: string;
  strava?: string;
  playo?: string;
  linkedin?: string;
}

export interface SportsCVData {
  id: string;
  athleteName: string;
  sport: SportType;
  position: string;
  secondaryPosition?: string;
  jerseyNumber?: string;
  ageCategory: string; // e.g. "U-19", "U-16", "Senior Open"
  age?: number;
  gender?: "Male" | "Female" | "Other";
  city: string;
  state: string;
  currentAcademy: string;
  dominantSide: "Right" | "Left" | "Ambidextrous";
  height: string;
  weight: string;
  bio: string;
  verified: boolean;
  athleteId: string;
  theme: CardTheme;
  achievements: AthleticAchievement[];
  positionHistory?: PositionHistoryEntry[];
  careerSummary?: CareerSummaryStats;
  careerSeasonStats?: CareerStatSeason[];
  performanceMetrics: PerformanceMetric[];
  highlightVideoUrl?: string;
  socialProfiles?: SocialProfiles;
  coachReference?: {
    name: string;
    designation: string;
    phoneOrEmail?: string;
  };
  availability: "Open for Trials" | "Club Contracted" | "Free Agent" | "Academy Trainee";
  lastUpdated: string;
}

export const SPORT_POSITION_PRESETS: Record<SportType, string[]> = {
  Cricket: [
    "Top-Order Batsman",
    "Opening Batsman & Wicketkeeper",
    "Middle-Order Batsman",
    "Fast Bowler (Right-Arm)",
    "Fast Bowler (Left-Arm)",
    "Right-Arm Leg Spinner",
    "Left-Arm Orthodox Spinner",
    "Batting All-Rounder",
    "Bowling All-Rounder",
  ],
  Football: [
    "Striker / Center Forward",
    "Left Winger (LW)",
    "Right Winger (RW)",
    "Attacking Midfielder (CAM)",
    "Central Midfielder (CM)",
    "Defensive Midfielder (CDM)",
    "Left Back (LB)",
    "Right Back (RB)",
    "Center Back (CB)",
    "Goalkeeper (GK)",
  ],
  Basketball: [
    "Point Guard (PG)",
    "Shooting Guard (SG)",
    "Small Forward (SF)",
    "Power Forward (PF)",
    "Center (C)",
  ],
  Badminton: [
    "Men's Singles Specialist",
    "Women's Singles Specialist",
    "Doubles Specialist",
    "Mixed Doubles Specialist",
  ],
  Athletics: [
    "100m / 200m Sprinter",
    "400m / 800m Middle Distance",
    "Long Jump / Triple Jump",
    "High Jump Specialist",
    "Javelin Thrower",
    "Shot Put / Discus",
  ],
  Tennis: [
    "Singles Baseliner",
    "Serve & Volley Specialist",
    "All-Court Player",
    "Doubles Specialist",
  ],
  Kabaddi: [
    "Right Raider",
    "Left Raider",
    "Right Corner Defender",
    "Left Corner Defender",
    "Cover Defender",
    "All-Rounder",
  ],
  Swimming: [
    "Freestyle Sprinter (50m/100m)",
    "Butterfly Specialist",
    "Backstroke Specialist",
    "Breaststroke Specialist",
    "Individual Medley (200m/400m)",
  ],
  Hockey: [
    "Center Forward",
    "Right Wing",
    "Center Half / Playmaker",
    "Fullback Defender",
    "Goalkeeper",
  ],
  Other: ["Primary Competitor", "Team Captain", "Squad Specialist"],
};

export const COMMON_METRIC_PRESETS: Record<SportType, Array<Omit<PerformanceMetric, "id">>> = {
  Cricket: [
    {
      name: "Bowling Top Speed",
      value: "134",
      unit: "km/h",
      category: "Speed",
      score: 88,
      benchmark: "State U-19: 130 km/h",
    },
    {
      name: "Yo-Yo Test Score",
      value: "19.6",
      unit: "level",
      category: "Endurance",
      score: 92,
      benchmark: "BCCI Elite: 19.0+",
    },
    {
      name: "Batting Strike Rate",
      value: "142.5",
      unit: "SR",
      category: "Sport-Specific",
      score: 86,
      benchmark: "T20 Target: 135+",
    },
    {
      name: "40m Sprint",
      value: "4.92",
      unit: "s",
      category: "Speed",
      score: 90,
      benchmark: "Elite Standard: <5.0s",
    },
    {
      name: "Vertical Jump",
      value: "62",
      unit: "cm",
      category: "Power",
      score: 84,
      benchmark: "Benchmark: 58cm",
    },
  ],
  Football: [
    {
      name: "Top Sprint Speed",
      value: "32.8",
      unit: "km/h",
      category: "Speed",
      score: 91,
      benchmark: "Pro Average: 31.5 km/h",
    },
    {
      name: "Yo-Yo Intermittent Test",
      value: "20.4",
      unit: "level",
      category: "Endurance",
      score: 94,
      benchmark: "Club Target: 19.5",
    },
    {
      name: "Pass Accuracy",
      value: "87.4",
      unit: "%",
      category: "Sport-Specific",
      score: 89,
      benchmark: "Midfield Benchmark: 82%",
    },
    {
      name: "Shot Power",
      value: "108",
      unit: "km/h",
      category: "Power",
      score: 85,
      benchmark: "Target: 100+ km/h",
    },
    {
      name: "30m Acceleration",
      value: "3.98",
      unit: "s",
      category: "Speed",
      score: 88,
      benchmark: "Benchmark: 4.10s",
    },
  ],
  Basketball: [
    {
      name: "Max Vertical Leap",
      value: "78",
      unit: "cm",
      category: "Power",
      score: 93,
      benchmark: "Elite League: 75cm",
    },
    {
      name: "Lane Agility Drill",
      value: "11.2",
      unit: "s",
      category: "Athleticism",
      score: 88,
      benchmark: "Target: <11.5s",
    },
    {
      name: "Free Throw Accuracy",
      value: "84",
      unit: "%",
      category: "Sport-Specific",
      score: 85,
      benchmark: "Pro Benchmark: 80%",
    },
    {
      name: "3/4 Court Sprint",
      value: "3.24",
      unit: "s",
      category: "Speed",
      score: 90,
      benchmark: "Target: <3.30s",
    },
  ],
  Badminton: [
    {
      name: "Smash Speed",
      value: "348",
      unit: "km/h",
      category: "Power",
      score: 92,
      benchmark: "National Circuit: 330+",
    },
    {
      name: "Court Agility Hexagon",
      value: "10.4",
      unit: "s",
      category: "Athleticism",
      score: 90,
      benchmark: "Target: <11.0s",
    },
    {
      name: "VO2 Max Estimate",
      value: "58.4",
      unit: "ml/kg/min",
      category: "Endurance",
      score: 89,
      benchmark: "Benchmark: 55+",
    },
  ],
  Athletics: [
    {
      name: "100m Personal Best",
      value: "10.84",
      unit: "s",
      category: "Speed",
      score: 96,
      benchmark: "State Record: 10.72s",
    },
    {
      name: "Flying 30m Speed",
      value: "2.94",
      unit: "s",
      category: "Speed",
      score: 94,
      benchmark: "Elite Target: <3.0s",
    },
    {
      name: "Standing Broad Jump",
      value: "2.88",
      unit: "m",
      category: "Power",
      score: 91,
      benchmark: "National Avg: 2.75m",
    },
  ],
  Tennis: [
    {
      name: "First Serve Speed",
      value: "186",
      unit: "km/h",
      category: "Power",
      score: 88,
      benchmark: "Target: 180+",
    },
    {
      name: "Spider Agility Drill",
      value: "15.2",
      unit: "s",
      category: "Athleticism",
      score: 90,
      benchmark: "Target: <16.0s",
    },
    {
      name: "Forehand RPM",
      value: "2850",
      unit: "rpm",
      category: "Sport-Specific",
      score: 86,
      benchmark: "Target: 2600+",
    },
  ],
  Kabaddi: [
    {
      name: "Multi-Directional Agility",
      value: "12.8",
      unit: "s",
      category: "Athleticism",
      score: 92,
      benchmark: "League Target: 13.5s",
    },
    {
      name: "Grip Strength (Dominant)",
      value: "64",
      unit: "kg",
      category: "Power",
      score: 94,
      benchmark: "Pro Avg: 58kg",
    },
    {
      name: "Beep Test Score",
      value: "12.8",
      unit: "level",
      category: "Endurance",
      score: 88,
      benchmark: "Target: 12.0+",
    },
  ],
  Swimming: [
    {
      name: "50m Freestyle PB",
      value: "24.18",
      unit: "s",
      category: "Speed",
      score: 94,
      benchmark: "State Standard: 24.8s",
    },
    {
      name: "Under-water Dolphin Kick 15m",
      value: "5.4",
      unit: "s",
      category: "Power",
      score: 90,
      benchmark: "Target: <5.8s",
    },
  ],
  Hockey: [
    {
      name: "Reverse Hit Speed",
      value: "124",
      unit: "km/h",
      category: "Power",
      score: 88,
      benchmark: "Benchmark: 115+",
    },
    {
      name: "Yo-Yo Test Score",
      value: "19.8",
      unit: "level",
      category: "Endurance",
      score: 92,
      benchmark: "Target: 19.2+",
    },
    {
      name: "40m Sprint",
      value: "4.98",
      unit: "s",
      category: "Speed",
      score: 89,
      benchmark: "Target: <5.10s",
    },
  ],
  Other: [
    {
      name: "Yo-Yo / Beep Endurance",
      value: "18.5",
      unit: "level",
      category: "Endurance",
      score: 85,
      benchmark: "Benchmark: 18.0+",
    },
    {
      name: "40m Dash",
      value: "5.02",
      unit: "s",
      category: "Speed",
      score: 86,
      benchmark: "Benchmark: 5.10s",
    },
    {
      name: "Vertical Jump",
      value: "60",
      unit: "cm",
      category: "Power",
      score: 82,
      benchmark: "Benchmark: 55cm",
    },
  ],
};

export interface SportStatTemplate {
  primaryLabel: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  stat1Label: string;
  stat2Label: string;
  stat3Label: string;
}

export const SPORT_STAT_TEMPLATES: Record<SportType, SportStatTemplate> = {
  Cricket: {
    primaryLabel: "Total Wickets",
    secondaryLabel: "Total Runs",
    tertiaryLabel: "Bowling Avg",
    stat1Label: "Runs",
    stat2Label: "Wickets",
    stat3Label: "Econ / Avg",
  },
  Football: {
    primaryLabel: "Goals",
    secondaryLabel: "Assists",
    tertiaryLabel: "Clean Sheets",
    stat1Label: "Goals",
    stat2Label: "Assists",
    stat3Label: "Pass Acc %",
  },
  Basketball: {
    primaryLabel: "PPG (Pts/Game)",
    secondaryLabel: "APG (Assists)",
    tertiaryLabel: "RPG (Rebounds)",
    stat1Label: "Points",
    stat2Label: "Rebounds",
    stat3Label: "Assists",
  },
  Badminton: {
    primaryLabel: "Win Rate",
    secondaryLabel: "Titles Won",
    tertiaryLabel: "Singles Rank",
    stat1Label: "Matches Won",
    stat2Label: "Win %",
    stat3Label: "Tournament Finish",
  },
  Athletics: {
    primaryLabel: "Personal Best (PB)",
    secondaryLabel: "Podium Finishes",
    tertiaryLabel: "State Seed",
    stat1Label: "Mark / Time",
    stat2Label: "Wind / Comp",
    stat3Label: "Medal / Rank",
  },
  Tennis: {
    primaryLabel: "Match Win %",
    secondaryLabel: "Tourney Titles",
    tertiaryLabel: "AITA / ITF Rank",
    stat1Label: "Sets Won",
    stat2Label: "1st Serve %",
    stat3Label: "Break Pts Saved",
  },
  Kabaddi: {
    primaryLabel: "Raid Points",
    secondaryLabel: "Tackle Points",
    tertiaryLabel: "Super Raids",
    stat1Label: "Raid Pts",
    stat2Label: "Tackle Pts",
    stat3Label: "Super 10s",
  },
  Swimming: {
    primaryLabel: "50m Free PB",
    secondaryLabel: "State Medals",
    tertiaryLabel: "FINA Points",
    stat1Label: "Timing",
    stat2Label: "Event Category",
    stat3Label: "Podium Place",
  },
  Hockey: {
    primaryLabel: "Goals Scored",
    secondaryLabel: "Penalty Corners",
    tertiaryLabel: "Caps / Matches",
    stat1Label: "Field Goals",
    stat2Label: "PC Conversions",
    stat3Label: "Dispossessions",
  },
  Other: {
    primaryLabel: "Wins / Selections",
    secondaryLabel: "Matches Played",
    tertiaryLabel: "Performance Index",
    stat1Label: "Wins",
    stat2Label: "Win %",
    stat3Label: "Rank / Score",
  },
};
