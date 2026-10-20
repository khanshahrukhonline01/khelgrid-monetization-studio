import { createFileRoute } from "@tanstack/react-router";
import { submitToIndexNow, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from "@/lib/indexnow";
import { generateSitemapEntries } from "./sitemap[.]xml";

export const Route = createFileRoute("/api/indexnow")({
  server: {
    handlers: {
      GET: async () => {
        // Retrieve priority URLs from sitemap entries
        const entries = generateSitemapEntries();
        const urls = entries.slice(0, 100).map((e) => e.loc);
        const result = await submitToIndexNow(urls);

        return new Response(
          JSON.stringify(
            {
              protocol: "IndexNow",
              key: INDEXNOW_KEY,
              keyLocation: INDEXNOW_KEY_LOCATION,
              result,
            },
            null,
            2,
          ),
          {
            status: result.success ? 200 : 500,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const urls = Array.isArray(body?.urls) ? body.urls : [];
          const result = await submitToIndexNow(urls);

          return new Response(JSON.stringify(result, null, 2), {
            status: result.success ? 200 : 400,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8" },
          });
        }
      },
    },
  },
});
