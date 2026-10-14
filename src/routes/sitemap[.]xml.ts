import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { SPORTS_CATALOG, CITIES_CATALOG, GUIDES_CATALOG, TOOLS_CATALOG } from "@/data/catalog";
import { BLOG_POSTS } from "@/data/blog";
import { TRIALS } from "@/data/trials";
import { hasGuideBody } from "@/content/guide-bodies";

const BASE_URL = "https://khelgrid.com";
const LAST_MOD = "2026-10-13";

interface SitemapEntry {
  loc: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
  lastmod: string;
}

export function generateSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const add = (
    path: string,
    priority: number,
    changefreq: SitemapEntry["changefreq"] = "weekly",
  ) => {
    entries.push({
      loc: `${BASE_URL}${path}`,
      priority,
      changefreq,
      lastmod: LAST_MOD,
    });
  };

  // High priority core directory & hubs (strictly canonical 200 OK URLs — no redirects)
  add("/", 1.0, "daily");
  add("/search", 0.9, "daily");
  add("/play", 0.9, "daily");
  add("/book", 0.9, "daily");
  add("/train", 0.9, "daily");
  add("/events", 0.9, "daily");
  add("/guides", 0.85, "weekly");
  add("/tools", 0.85, "weekly");
  add("/blog", 0.85, "weekly");
  add("/chronicle", 0.85, "weekly");
  add("/coaches", 0.8, "weekly");
  add("/academy", 0.8, "weekly");
  add("/memberships", 0.8, "weekly");
  add("/sports", 0.8, "weekly");
  add("/cities", 0.8, "weekly");
  add("/start-from-zero", 0.75, "weekly");
  add("/learning-hub", 0.75, "weekly");
  add("/talent-scanner", 0.75, "weekly");
  add("/verify", 0.75, "weekly");
  add("/ai-guide", 0.7, "weekly");
  add("/community", 0.7, "weekly");
  add("/resources", 0.7, "weekly");
  add("/mobile-app", 0.7, "weekly");
  add("/pricing", 0.6, "monthly");
  add("/about", 0.6, "monthly");
  add("/contact", 0.6, "monthly");
  add("/careers", 0.5, "monthly");
  add("/partner", 0.5, "monthly");
  add("/trust-center", 0.5, "monthly");

  // Legal & compliance
  add("/editorial-policy", 0.3, "yearly");
  add("/verification-policy", 0.3, "yearly");
  add("/correction-policy", 0.3, "yearly");
  add("/cancellation-policy", 0.3, "yearly");
  add("/posh-policy", 0.3, "yearly");
  add("/privacy", 0.3, "yearly");
  add("/terms", 0.3, "yearly");

  // Dynamic Trial entries (Verified Opportunities)
  for (const trial of TRIALS) {
    add(`/trial/${trial.id}`, 0.9, "weekly");
  }

  // Sports landing pages
  for (const sport of SPORTS_CATALOG) {
    add(`/sport/${sport.slug}`, 0.85, "weekly");
  }

  // Cities landing pages
  for (const city of CITIES_CATALOG) {
    add(`/city/${city.slug}`, 0.85, "weekly");
  }

  // Guides
  for (const guide of GUIDES_CATALOG) {
    if (hasGuideBody(guide.slug)) {
      add(`/guide/${guide.slug}`, 0.8, "weekly");
    }
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    add(`/blog/${post.slug}`, 0.8, "weekly");
  }

  // Interactive Tools
  for (const tool of TOOLS_CATALOG) {
    add(`/tools/${tool.slug}`, 0.8, "weekly");
  }

  // Top Guide Categories
  const guideCategories = [
    "trial-prep",
    "sports-cv",
    "scholarships",
    "nutrition",
    "mindset",
    "parents",
    "recovery",
    "tech",
  ];
  for (const cat of guideCategories) {
    add(`/top-guides/${cat}`, 0.75, "weekly");
  }

  // Best Tools Categories
  const toolCategories = ["calculator", "checklist", "planner", "estimator"];
  for (const cat of toolCategories) {
    add(`/best-tools/${cat}`, 0.75, "weekly");
  }

  return entries;
}

export function buildSitemapXml(): string {
  const entries = generateSitemapEntries();
  const uniqueUrls = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    if (!uniqueUrls.has(entry.loc)) {
      uniqueUrls.set(entry.loc, entry);
    }
  }

  const items = Array.from(uniqueUrls.values()).map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
  </url>`,
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...items,
    `</urlset>`,
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = buildSitemapXml();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
