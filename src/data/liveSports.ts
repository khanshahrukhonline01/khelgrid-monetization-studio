// Legacy URLs kept for compatibility, not linked in UI
export const GOOGLE_CRICKET_SEARCH_URL = "";
export const GOOGLE_IND_WI_2ND_T20I_URL = "";

export interface LiveMatchUpdate {
  id: string;
  sport: "Cricket" | "Football" | "Badminton" | "Hockey" | "Kabaddi" | "Tennis";
  status: "LIVE" | "UPCOMING" | "RECENT";
  tournament: string;
  stage?: string;
  matchInfo?: string;
  teamA: {
    name: string;
    code: string;
    score: string;
    logo?: string;
    flag?: string;
  };
  teamB: {
    name: string;
    code: string;
    score: string;
    logo?: string;
    flag?: string;
  };
  highlight: string;
  statusText?: string;
  venueOrOvers?: string;
  liveTime?: string;
  source: string;
  isRealTime?: boolean;
  hasSchedule?: boolean;
  hasPointsTable?: boolean;
  googleUrl?: string;
}

export const LIVE_SPORTS_UPDATES: LiveMatchUpdate[] = [];
