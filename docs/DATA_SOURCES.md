# KhelGrid Legal Data Sources Registry

**Audit Date:** October 30, 2026  
**Auditor:** Senior Full-Stack Engineer, KhelGrid  
**Policy Compliance:** Mandatory under KhelGrid `AGENTS.md` and Non-Negotiable Legal Data Rules.

---

## 1. Candidate Sources Audit Matrix

| Source Name | Sport(s) / Domain | What It Provides | Free-Tier Limits | Live Data? | Display Allowed? | Redistribute Allowed? | Required Attribution | Terms URL & Checked Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **KhelGrid Supabase Database** | All Grassroots Sports (Trials, Opportunities, Venues, Academies, Cities) | Verified Indian trials, scouting combines, scholarships, venue amenities, booking parameters, city sports hubs | Unlimited (internal database) | Operational state | **YES** | **YES** (`review_status='approved'`) | "Data provided by KhelGrid (khelgrid.com)" | `https://www.khelgrid.com/terms` (Checked: 2026-10-30) |
| **API-Football (API-Sports)** | Football (ISL, Premier League, UCL, La Liga) | Live match scores, clocks, fixtures, team codes, standings, logos | 100 requests/day, 10 req/min | **YES** | **YES** (on own website/app) | **NO** (Strict resale & derivative API ban) | "Data provided by API-Sports" (Recommended) | `https://api-sports.io/terms` (Checked: 2026-10-30) |
| **CricketData.org (formerly CricAPI)** | Cricket (International, IPL, Domestic) | Match fixtures, series info, basic live scores (delayed ~5m) | 100 requests/day | **YES** (Delayed) | **YES** (Non-commercial app display) | **NO** (Terms prohibit raw data republishing/resale) | "Powered by CricketData.org" | `https://cricketdata.org/terms.aspx` (Checked: 2026-10-30) |
| **OpenCricket API** | Cricket | Ball-by-ball historical archives & match status | 5,000 monthly calls (Starter plan) | Basic score status | **YES** | **PARTIAL**: Cricsheet match data is ODC-By 1.0 (Allowed); Live feed data has NO open redistribution licence | "Historical match data from Cricsheet (ODC-By 1.0)" | `https://opencricketapi.com/terms` (Checked: 2026-10-30) |
| **Cricsheet.org** | Cricket | Match results, ball-by-ball event files, venue mapping, player registers | Free open download / static JSON/YAML (No quota) | **NO** (Concluded matches only) | **YES** | **YES** (ODC-By 1.0 / CC BY 4.0) | "Data sourced from Cricsheet.org (ODC-By 1.0)" | `https://cricsheet.org/license/` (Checked: 2026-10-30) |
| **football-data.org** | Football (Top European Leagues) | League fixtures, results, basic standings for 12 leagues | 10 requests/min | Limited (Scores delayed on free tier) | **YES** (Personal/hobby display) | **NO** (Prohibits raw data feed redistribution) | "Data provided by football-data.org" | `https://www.football-data.org/terms` (Checked: 2026-10-30) |
| **TheSportsDB** | Multi-Sport (Football, Basketball, etc.) | Team metadata, stadium metadata, schedules | 30 requests/min (Public developer key) | Very limited / locked on free tier | **YES** (Non-app store personal sites) | **NO** (Terms restrict raw database mirroring/resale) | "Source: TheSportsDB.com" | `https://www.thesportsdb.com/terms` (Checked: 2026-10-30) |
| **data.gov.in (Open Government Data India)** | Indian Sports (MYAS, SAI, Khelo India) | Accredited academies, Khelo India centers, National Sports Federation directories | Free open access / API | **NO** (Directory / historical data) | **YES** | **YES** (Government Open Data License - India) | "Source: Ministry of Youth Affairs and Sports, data.gov.in" | `https://data.gov.in/open-data-license-india` (Checked: 2026-10-30) |
| **Wikidata / Wikimedia** | Multi-Sport metadata | Tournament metadata, sports taxonomy, club founding dates, stadiums | Free public SPARQL / REST API | **NO** (Knowledge base) | **YES** | **YES** (Creative Commons CC0 1.0 Public Domain) | Courtesy link to Wikidata | `https://www.wikidata.org/wiki/Wikidata:Copyright` (Checked: 2026-10-30) |
| **OpenStreetMap (OSM)** | Sports Venues & Facilities | Coordinates, physical addresses, turf ground tags, amenities | Free open export / Overpass API (Rate-polite) | **NO** (Geospatial) | **YES** | **YES** (Open Database License - ODbL 1.0) | "© OpenStreetMap contributors" | `https://www.openstreetmap.org/copyright` (Checked: 2026-10-30) |
| **Pro Kabaddi League (PKL / Mashal Sports)** | Kabaddi | Live match scores, raid stats, standings | No public developer API program | N/A | **NO** | **NO** | N/A (Scraping/reverse-engineering strictly forbidden) | `https://www.prokabaddi.com/terms-of-use` (Checked: 2026-10-30) |
| **Hockey India / FIH** | Hockey | Domestic & international hockey scores | No public free developer API | N/A | **NO** | **NO** | N/A (Scraping strictly forbidden) | `https://www.hockeyindia.org` (Checked: 2026-10-30) |
| **Badminton World Federation (BWF)** | Badminton | World Tour fixtures, tournament draws, live points | No free public developer API program | N/A | **NO** | **NO** | N/A (Scraping strictly forbidden) | `https://corporate.bwfbadminton.com` (Checked: 2026-10-30) |
| **Unofficial Scraped Feeds (Cricbuzz, ESPN Cricinfo, Sofascore)** | Cricket, Football, Tennis | Unofficial scraping / hidden mobile API tokens | N/A | Variable | **STRICTLY FORBIDDEN** (Violates Hard Rule 1) | **STRICTLY FORBIDDEN** | N/A | Forbidden under Rule 1 (Checked: 2026-10-30) |

---

## 2. Key Legal & Architectural Findings

### A. The "Display vs. Redistribution" Boundary
* **Third-Party Free APIs (API-Sports, CricketData.org, football-data.org):**  
  Almost all commercial sports providers explicitly allow you to consume their API and **display** scores and standings on your own frontend website/app. However, their Terms of Service **explicitly forbid redistributing or reselling raw data feeds or sub-licensing the API to third parties**.  
  * **Architecture Enforcement:** These providers must be marked `display_allowed = true` and `redistribute_allowed = false` in the `sources` table. They can be surfaced on `khelgrid.com/live-scores`, but **filtered out completely from `/api/v1/...` public endpoints**.

### B. Truly Redistributable Data Sources
* **KhelGrid Proprietary Data (Supabase):**  
  Trials, opportunities, venues, academies, cities, and sports. 100% owned by KhelGrid. `display_allowed = true`, `redistribute_allowed = true`.
* **Cricsheet.org (Cricket Archives):**  
  Available under **ODC-By 1.0**. Fully redistributable in `/api/v1/` with attribution text: *"Data sourced from Cricsheet.org"*.
* **data.gov.in & OpenStreetMap:**  
  Permits open redistribution with mandatory attribution.

### C. Sports with Zero Legal Free-Tier APIs (Kabaddi, Badminton, Hockey, Tennis)
* Neither Pro Kabaddi League, Hockey India, FIH, nor BWF provide free public developer APIs.
* In accordance with Hard Rule 1 and KhelGrid's Zero Fake Scores Policy:
  * **Never scrape unauthorized endpoints.**
  * Display verified pending states:  
    * e.g., *"Official Live Rights Pending — Check official schedule at prokabaddi.com"*.
  * Store domestic/verified static fixtures with official source citations, leaving missing in-play fields as `null`.

---

## 3. Recommended Source Allocations

### 1. For Public Read-Only API (`/api/v1/...` where `redistribute_allowed = true`):
* **Source: `khelgrid_internal` (Supabase)**:
  * `/api/v1/trials` (Approved, non-expired trials)
  * `/api/v1/opportunities` (Approved scholarships and camps)
  * `/api/v1/venues` (Approved sports grounds and turfs)
  * `/api/v1/academies`
  * `/api/v1/cities`
  * `/api/v1/sports`
* **Source: `cricsheet`**:
  * Historical / concluded match scorecards with ODC-By attribution.

### 2. For Website Live Scores Only (`live-scores.tsx` where `display_allowed = true`, `redistribute_allowed = false`):
* **Football**: **API-Football (API-Sports)** free tier (100 req/day).
  * Server-side cron ingestion (budgeted: 1 request every 15 minutes during match windows = ~40 calls/day max).
  * Stored in Supabase `matches` with `source_id = 'api_football'`, `redistribute_allowed = false`.
* **Cricket**: **CricketData.org (free tier 100 req/day)** or **OpenCricket API**.
  * Server-side cron polling during active Indian matches (budgeted: ~60 calls/day max).
  * Stored in Supabase `matches` with `redistribute_allowed = false`.
* **Kabaddi / Hockey / Badminton**:
  * Curated official tournament fixtures from official federation notices (SAI, Hockey India, PKL) stored in Supabase with `source_url` pointing to the official press release/notice. In-play scores remain `null` or marked `"Live Rights Pending"`. Zero fabrication.
