import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MONETIZATION_SECTIONS_META } from "@/routes/pricing";

describe("Monetization Studio React Helmet Async Dynamic Head Tags", () => {
  it("provides unique titles and meta descriptions for each key monetization section", () => {
    const keys = Object.keys(MONETIZATION_SECTIONS_META) as Array<keyof typeof MONETIZATION_SECTIONS_META>;
    expect(keys.length).toBeGreaterThanOrEqual(5);

    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const key of keys) {
      const meta = MONETIZATION_SECTIONS_META[key];
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.keywords).toBeTruthy();
      expect(meta.canonical).toBeTruthy();
      expect(meta.headline).toBeTruthy();
      expect(meta.subheadline).toBeTruthy();

      // Ensure every title and description is distinct across sections
      expect(titles.has(meta.title)).toBe(false);
      expect(descriptions.has(meta.description)).toBe(false);

      titles.add(meta.title);
      descriptions.add(meta.description);
    }
  });

  it("includes high-value keywords for Pro, Academy Boost, and Micropayments", () => {
    expect(MONETIZATION_SECTIONS_META.pro.title).toContain("Pro Athlete Membership");
    expect(MONETIZATION_SECTIONS_META.pro.title).toContain("₹499");
    expect(MONETIZATION_SECTIONS_META.academy.title).toContain("Academy Trial Boost");
    expect(MONETIZATION_SECTIONS_META.academy.title).toContain("₹1,500");
    expect(MONETIZATION_SECTIONS_META.micropayments.title).toContain("Pay-Per-Trial");
    expect(MONETIZATION_SECTIONS_META.micropayments.title).toContain("₹49");
    expect(MONETIZATION_SECTIONS_META.scouts.title).toContain("Scout & Partner");
  });
});
