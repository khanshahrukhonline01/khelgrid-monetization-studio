import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

let llmsContent = "";
try {
  llmsContent = fs.readFileSync(path.resolve(process.cwd(), "public/llms.txt"), "utf8");
} catch {
  llmsContent = `# KhelGrid · India's Sports Opportunity Network
> KhelGrid is India's verified sports selection trials directory, Khelo India accredited academy network, and sports quota discovery platform.

## Core Opportunities & Trials
- [Search Sports Selection Trials](https://www.khelgrid.com/search): Real-time searchable directory of verified sports selection trials across India.
- [Verified Opportunities & Selections](https://www.khelgrid.com/opportunities): Detailed selection trials with eligibility criteria, age cutoffs, and entry requirements.
- [Khelo India & SAI Academies](https://www.khelgrid.com/academy): Comprehensive directory of Khelo India and Sports Authority of India accredited training centres.
- [Sports Events & Tournaments](https://www.khelgrid.com/events): Regional championships, national meets, and sports quota notifications.
- [Verified Sports Coaches](https://www.khelgrid.com/coaches): Qualified coaches across multiple sports disciplines in India.
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
