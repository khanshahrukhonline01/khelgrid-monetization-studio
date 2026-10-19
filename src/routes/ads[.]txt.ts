import { createFileRoute } from "@tanstack/react-router";

export const ADS_TXT_CONTENT = "google.com, pub-8352691151177209, DIRECT, f08c47fec0942fa0\n";

export const Route = createFileRoute("/ads.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(ADS_TXT_CONTENT, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
