import { createFileRoute } from "@tanstack/react-router";

const INDEXNOW_KEY = "6c71a3962bfa4c5ea1f5927c81d83ee6";

export const Route = createFileRoute("/6c71a3962bfa4c5ea1f5927c81d83ee6.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(INDEXNOW_KEY, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
