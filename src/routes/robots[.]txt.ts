import { createFileRoute } from "@tanstack/react-router";

export const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /
Allow: /ads.txt
Disallow: /dashboard
Disallow: /login
Disallow: /onboarding
Disallow: /settings
Disallow: /forgot-password
Disallow: /profile

User-agent: Google-adstxt
Allow: /ads.txt

User-agent: Mediapartners-Google
Allow: /
Allow: /ads.txt

User-agent: AdsBot-Google
Allow: /
Allow: /ads.txt

User-agent: Google-Display-Ads-Bot
Allow: /
Allow: /ads.txt

Sitemap: https://www.khelgrid.com/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(ROBOTS_TXT_CONTENT, {
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
