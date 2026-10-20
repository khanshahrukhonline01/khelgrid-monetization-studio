import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

let llmsContent = "";
try {
  llmsContent = fs.readFileSync(path.resolve(process.cwd(), "public/llms.txt"), "utf8");
} catch {
  llmsContent = `# KhelGrid · India's Sports Opportunity Network
> KhelGrid is India's verified sports selection trials directory, Khelo India accredited academy network, and sports quota discovery platform.

## Documentation, APIs & Project Overview
- [Documentation & Athlete Guides](https://www.khelgrid.com/guides): Comprehensive athlete development guides, trial preparation roadmaps, and sports quota rules.
- [Sports Data & Trials API](https://www.khelgrid.com/api/trials): Structured REST API endpoint delivering verified national sports selection trials and combine feeds.
- [About KhelGrid](https://www.khelgrid.com/about): Mission, governance, institutional verification standards, and brand entity profile.
- [Trust Center & Verification Policy](https://www.khelgrid.com/trust-center): Rigorous verification methodology ensuring authentic, zero fake trials across all states.
- [Athlete Sports CV Documentation](https://www.khelgrid.com/start-from-zero): Comprehensive guide to building standardized digital athletic resumes for scouting.
- [Terms of Service](https://www.khelgrid.com/terms): Official platform terms, athlete code of conduct, and participation guidelines.

## Core Opportunities & Selection Trials
- [Search Sports Selection Trials](https://www.khelgrid.com/search): Real-time searchable directory of verified sports selection trials across India.
- [Verified Opportunities & Selections](https://www.khelgrid.com/opportunities): Detailed selection trials with eligibility criteria, age cutoffs, and entry requirements.
- [Khelo India & SAI Academies](https://www.khelgrid.com/academy): Comprehensive directory of Khelo India and Sports Authority of India accredited training centres.
- [Sports Events & Tournaments](https://www.khelgrid.com/events): Regional championships, national meets, and sports quota notifications.
- [Live Match Center & Scores](https://www.khelgrid.com/live-scores): Real-time scores, cricket commentary, and live tournament tracking.
- [Book Sports Venues & Turfs](https://www.khelgrid.com/book): Turf booking, badminton courts, and cricket nets across Indian metro cities.
`;
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(llmsContent, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
