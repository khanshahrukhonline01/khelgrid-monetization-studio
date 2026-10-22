import { createFileRoute } from "@tanstack/react-router";
import { TRIALS } from "@/data/trials";
import { getTrialEndDate, isTrialArchived } from "@/lib/opportunity-badge";

export const Route = createFileRoute("/api/trials")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const sport = url.searchParams.get("sport");
        const city = url.searchParams.get("city");
        const archive = url.searchParams.get("archive") === "true";
        const limitParam = url.searchParams.get("limit");
        const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100) : 50;

        let results = TRIALS.filter((trial) => {
          if (!getTrialEndDate(trial.date)) return false;
          return archive ? isTrialArchived(trial) : !isTrialArchived(trial);
        });
        if (sport && sport.toLowerCase() !== "all") {
          results = results.filter((t) => t.sport.toLowerCase() === sport.toLowerCase());
        }
        if (city && city.toLowerCase() !== "all") {
          results = results.filter((t) => t.city.toLowerCase() === city.toLowerCase());
        }

        const data = {
          success: true,
          platform: "KhelGrid",
          canonicalUrl: "https://www.khelgrid.com/api/trials",
          documentation: "https://www.khelgrid.com/guides",
          view: archive ? "archive" : "current-and-upcoming",
          total: results.length,
          trials: results.slice(0, limit).map((t) => ({
            id: t.id,
            title: t.title,
            sport: t.sport,
            academy: t.academy,
            city: t.city,
            date: t.date,
            deadline: t.deadline,
            fee: t.fee,
            ageCategory: t.ageCategory,
            verified: t.verified,
            url: `https://www.khelgrid.com/trial/${t.id}`,
          })),
        };

        return new Response(JSON.stringify(data, null, 2), {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
