import { describe, it, expect } from "vitest";
import { TRIALS } from "./trials";
import { buildSeoHead } from "@/lib/seo";

describe("Khel Maharan 3.0 Assam Opportunity & SEO Optimization", () => {
  const kmTrial = TRIALS.find((t) => t.id === "t-khel-maharan-3-assam-2026");

  it("verifies Khel Maharan 3.0 trial exists in TRIALS with complete official metadata", () => {
    expect(kmTrial).toBeDefined();
    expect(kmTrial?.title).toBe(
      "Khel Maharan 3.0 to Begin on November 7, Registration Opens Across Assam",
    );
    expect(kmTrial?.academy).toBe("Department of Sports & Youth Welfare, Government of Assam");
    expect(kmTrial?.city).toBe("Guwahati");
    expect(kmTrial?.fee).toBe(0);
    expect(kmTrial?.sourceUrl).toBe(
      "https://www.nktv.in/khel-maharan-3-0-to-begin-on-november-7-registration-opens-across-assam/",
    );
    expect(kmTrial?.tag).toContain("Assam Govt Grassroots Combine");
    expect(kmTrial?.ageCategory).toContain("Shoushab Krida Samaroh");
    expect(kmTrial?.requiredDocuments?.length).toBeGreaterThanOrEqual(4);
    expect(kmTrial?.sources?.some((s) => s.url.includes("nktv.in"))).toBe(true);
  });

  it("produces valid, SEO-optimized title, description, and canonical URL via buildSeoHead", () => {
    expect(kmTrial).toBeDefined();
    if (!kmTrial) return;

    const head = buildSeoHead({
      title: `${kmTrial.title} · ${kmTrial.sport} Trial in ${kmTrial.city}`,
      description: `${kmTrial.title} hosted by ${kmTrial.academy} in ${kmTrial.city}. Free entry, begins ${kmTrial.date} at ${kmTrial.venue}. Official verified opportunity on KhelGrid.`,
      canonicalPath: `/trial/${kmTrial.id}`,
      keywords: `${kmTrial.title}, Khel Maharan Assam, grassroots sports trials, SAI scouting, Assam sports scholarships`,
    });

    const titleMeta = head.meta.find((m) => "title" in m);
    expect(titleMeta).toBeDefined();
    expect((titleMeta as { title: string }).title).toContain(
      "Khel Maharan 3.0 to Begin on November 7",
    );
    expect((titleMeta as { title: string }).title).toContain("KhelGrid");

    const descMeta = head.meta.find((m) => "name" in m && m.name === "description");
    expect(descMeta).toBeDefined();
    expect((descMeta as { content: string }).content).toContain(
      "Department of Sports & Youth Welfare, Government of Assam",
    );
    expect((descMeta as { content: string }).content).toContain("Free entry");

    const canonicalLink = head.links.find((l) => l.rel === "canonical");
    expect(canonicalLink).toBeDefined();
    expect(canonicalLink?.href).toBe("https://www.khelgrid.com/trial/t-khel-maharan-3-assam-2026");

    const ogTitle = head.meta.find((m) => "property" in m && m.property === "og:title");
    expect(ogTitle).toBeDefined();
    expect((ogTitle as { content: string }).content).toContain("Khel Maharan 3.0");
  });
});
