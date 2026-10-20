import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

let llmsContent = "";
try {
  llmsContent = fs.readFileSync(path.resolve(process.cwd(), "public/llms.txt"), "utf8");
} catch {
  llmsContent = `# KhelGrid · India's Authoritative Sports Selection Trials & Academy Platform
> https://www.khelgrid.com

Authoritative directory for sports selection trials near me, Khelo India academies, and SAI NCOE recruitments across India.
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
