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

export const LIVE_SPORTS_UPDATES: LiveMatchUpdate[] = [
  // 1. India vs West Indies 2nd T20I
  {
    id: "cricket-ind-wi-2nd-t20i",
    sport: "Cricket",
    status: "LIVE",
    tournament: "West Indies Tour of India 2026",
    stage: "2nd T20I · Starts 7:00 PM IST",
    matchInfo: "2nd T20I • Bilateral Series",
    teamA: {
      name: "India",
      code: "IND",
      score: "Live",
      flag: "🇮🇳",
    },
    teamB: {
      name: "West Indies",
      code: "WI",
      score: "Live",
      flag: "🌴",
    },
    highlight: "2nd T20I of 5-match bilateral series under lights at Ranchi",
    statusText: "Live · 2nd T20I (5-Match Bilateral Series)",
    venueOrOvers: "Starts 7:00 PM IST",
    liveTime: "JSCA International Stadium Complex, Ranchi",
    source: "Official BCCI Match Feed",
    hasSchedule: true,
  },
  // 2. South Africa vs Australia 1st Test
  {
    id: "cricket-sa-aus-1st-test",
    sport: "Cricket",
    status: "LIVE",
    tournament: "Australia Tour of South Africa 2026",
    stage: "1st Test · Day 1",
    matchInfo: "1st Test • 3-Match Test Series",
    teamA: {
      name: "South Africa",
      code: "SA",
      score: "Live",
      flag: "🇿🇦",
    },
    teamB: {
      name: "Australia",
      code: "AUS",
      score: "Live",
      flag: "🇦🇺",
    },
    highlight: "Australia's first Test series visit to Kingsmead since 2018",
    statusText: "Day 1 Live · Kingsmead, Durban",
    venueOrOvers: "Day 1 · Kingsmead",
    liveTime: "Kingsmead, Durban (8:30 AM GMT / 1:00 PM IST)",
    source: "Official CSA Match Feed",
    hasSchedule: true,
  },
  // 3. Bangladesh vs Afghanistan Only Test
  {
    id: "cricket-ban-afg-only-test",
    sport: "Cricket",
    status: "LIVE",
    tournament: "Afghanistan vs Bangladesh in UAE 2026",
    stage: "Only Test · Day 1",
    matchInfo: "Only Test • UAE Tour",
    teamA: {
      name: "Bangladesh",
      code: "BAN",
      score: "Live",
      flag: "🇧🇩",
    },
    teamB: {
      name: "Afghanistan",
      code: "AFG",
      score: "Live",
      flag: "🇦🇫",
    },
    highlight: "One-off Test match battle at Zayed Cricket Stadium",
    statusText: "Day 1 Live · Zayed Cricket Stadium, Abu Dhabi",
    venueOrOvers: "Day 1 · Abu Dhabi",
    liveTime: "Sheikh Zayed Stadium, Abu Dhabi (7:00 AM GMT / 11:30 AM IST)",
    source: "Official ACB Match Feed",
    hasSchedule: true,
  },
  // 4. Pakistan vs Sri Lanka 1st T20I
  {
    id: "cricket-pak-sl-1st-t20i",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "Sri Lanka Tour of Pakistan 2026",
    stage: "1st T20I · Starts 9:00 PM IST",
    matchInfo: "1st T20I • Rawalpindi Series",
    teamA: {
      name: "Pakistan",
      code: "PAK",
      score: "Upcoming",
      flag: "🇵🇰",
    },
    teamB: {
      name: "Sri Lanka",
      code: "SL",
      score: "Upcoming",
      flag: "🇱🇰",
    },
    highlight: "Opening T20 international encounter under floodlights",
    statusText: "Scheduled Today · Starts 9:00 PM IST",
    venueOrOvers: "Starts 9:00 PM IST",
    liveTime: "Rawalpindi Cricket Stadium, Rawalpindi (3:30 PM GMT)",
    source: "Official PCB Match Feed",
    hasSchedule: true,
  },
  // 5. Oman vs Canada ODI
  {
    id: "cricket-oma-can-cwc-league2",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's Cricket World Cup League 2",
    stage: "ODI Match 41",
    matchInfo: "ODI Match 41 • CWC League 2",
    teamA: {
      name: "Oman",
      code: "OMA",
      score: "Live",
      flag: "🇴🇲",
    },
    teamB: {
      name: "Canada",
      code: "CAN",
      score: "Live",
      flag: "🇨🇦",
    },
    highlight: "Crucial points on the line in ICC World Cup qualification",
    statusText: "Live · 50 Overs ICC Qualification",
    venueOrOvers: "Live · 50 ov",
    liveTime: "Al Amerat Cricket Ground (Ministry Turf 1), Al Amarat (6:00 AM GMT)",
    source: "ICC Official Match Center",
    hasSchedule: true,
  },
  // 6. Namibia vs United Arab Emirates ODI
  {
    id: "cricket-nam-uae-cwc-league2",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "ICC Men's Cricket World Cup League 2",
    stage: "ODI Match 42 · Starts 9:30 PM IST",
    matchInfo: "ODI Match 42 • CWC League 2",
    teamA: {
      name: "Namibia",
      code: "NAM",
      score: "Upcoming",
      flag: "🇳🇦",
    },
    teamB: {
      name: "United Arab Emirates",
      code: "UAE",
      score: "Upcoming",
      flag: "🇦🇪",
    },
    highlight: "League 2 showdown hosted at Grand Prairie Stadium",
    statusText: "Scheduled Today · Starts 9:30 PM IST",
    venueOrOvers: "Starts 9:30 PM IST",
    liveTime: "Grand Prairie Stadium, Texas (4:00 PM GMT / 9:30 PM IST)",
    source: "ICC Official Match Center",
    hasSchedule: true,
  },
  // 7. Malaysia vs Saudi Arabia T20I
  {
    id: "cricket-mas-ksa-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "Malaysia",
      code: "MAS",
      score: "Live",
      flag: "🇲🇾",
    },
    teamB: {
      name: "Saudi Arabia",
      code: "KSA",
      score: "Live",
      flag: "🇸🇦",
    },
    highlight: "High-stakes Asia regional qualifier match at Bayuemas Oval",
    statusText: "Live · 20 Overs Asia Qualifier",
    venueOrOvers: "Live · 20 ov",
    liveTime: "Bayuemas Oval, Kuala Lumpur (7:00 AM GMT)",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 8. China vs Hong Kong T20I
  {
    id: "cricket-chn-hk-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "China",
      code: "CHN",
      score: "Live",
      flag: "🇨🇳",
    },
    teamB: {
      name: "Hong Kong",
      code: "HK",
      score: "Live",
      flag: "🇭🇰",
    },
    highlight: "East Asian clash at UKM-YSD Cricket Oval",
    statusText: "Live · 20 Overs Asia Qualifier",
    venueOrOvers: "Live · 20 ov",
    liveTime: "UKM-YSD Cricket Oval, Bangi (7:00 AM GMT)",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 9. Maldives vs Singapore T20I
  {
    id: "cricket-mdv-sgp-t20-qualifier-b",
    sport: "Cricket",
    status: "LIVE",
    tournament: "ICC Men's T20 World Cup Asia Qualifier B",
    stage: "Group Stage",
    matchInfo: "Group B • T20 World Cup Qualifier",
    teamA: {
      name: "Maldives",
      code: "MDV",
      score: "Live",
      flag: "🇲🇻",
    },
    teamB: {
      name: "Singapore",
      code: "SGP",
      score: "Live",
      flag: "🇸🇬",
    },
    highlight: "Sub-regional qualifier fixture at Selangor Turf Club",
    statusText: "Live · 20 Overs Asia Qualifier",
    venueOrOvers: "Live · 20 ov",
    liveTime: "Selangor Turf Club, Kuala Lumpur (7:00 AM GMT)",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 10. Bahrain vs Kuwait T20I
  {
    id: "cricket-bhr-kuw-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Bahrain",
      code: "BHR",
      score: "Finished",
      flag: "🇧🇭",
    },
    teamB: {
      name: "Kuwait",
      code: "KUW",
      score: "Finished",
      flag: "🇰🇼",
    },
    highlight: "Gulf rivalry in ICC Asia Sub Regional Qualifier A",
    statusText: "Match Finished · Bahrain won by 6 wickets",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "UKM-YSD Cricket Oval, Bangi",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 11. Qatar vs Myanmar T20I
  {
    id: "cricket-qat-mya-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Qatar",
      code: "QAT",
      score: "Finished",
      flag: "🇶🇦",
    },
    teamB: {
      name: "Myanmar",
      code: "MYA",
      score: "Finished",
      flag: "🇲🇲",
    },
    highlight: "Qualifier round fixture at Selangor Turf Club",
    statusText: "Match Finished · Qatar won by 42 runs",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "Selangor Turf Club, Kuala Lumpur",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 12. Mongolia vs Thailand T20I
  {
    id: "cricket-mng-tha-t20-qualifier-a",
    sport: "Cricket",
    status: "RECENT",
    tournament: "ICC Men's T20 World Cup Asia Qualifier A",
    stage: "Group Stage",
    matchInfo: "Group A • T20 World Cup Qualifier",
    teamA: {
      name: "Mongolia",
      code: "MNG",
      score: "Finished",
      flag: "🇲🇳",
    },
    teamB: {
      name: "Thailand",
      code: "THA",
      score: "Finished",
      flag: "🇹🇭",
    },
    highlight: "Qualifier round match at Bayuemas Oval",
    statusText: "Match Finished · Thailand won by 8 wickets",
    venueOrOvers: "Full Time (20 ov)",
    liveTime: "Bayuemas Oval, Kuala Lumpur",
    source: "ICC Asia Match Center",
    hasSchedule: true,
  },
  // 13. WPL RCB vs MI
  {
    id: "cricket-wpl-rcb-mi",
    sport: "Cricket",
    status: "UPCOMING",
    tournament: "Women's Premier League (WPL)",
    stage: "Match 14 · Starts 7:30 PM IST",
    matchInfo: "Match 14 • WPL 2026",
    teamA: { name: "Royal Challengers Bengaluru", code: "RCB-W", score: "Upcoming", flag: "🔴" },
    teamB: { name: "Mumbai Indians", code: "MI-W", score: "Upcoming", flag: "🔵" },
    highlight: "Blockbuster WPL clash · Smriti Mandhana vs Harmanpreet Kaur",
    statusText: "Scheduled Today · Match 14 Starts 7:30 PM IST",
    venueOrOvers: "Starts 7:30 PM IST",
    liveTime: "M. Chinnaswamy Stadium, Bengaluru",
    source: "WPL Official Match Center",
    hasSchedule: true,
  },
];
