import { describe, it, expect } from "vitest";
import { adsConfig, hasValidPublisherId, adsenseScriptSrc, resolveAdSlot, AD_SLOTS } from "./ads";
import fs from "node:fs";
import path from "node:path";

describe("Google AdSense Configuration & ads.txt Verification", () => {
  it("has a valid publisher ID matching ca-pub-16digits", () => {
    expect(hasValidPublisherId()).toBe(true);
    expect(adsConfig.publisherId).toMatch(/^ca-pub-\d{16}$/);
    expect(adsConfig.publisherId).toBe("ca-pub-8352691151177209");
  });

  it("generates correct Google AdSense script URL", () => {
    const src = adsenseScriptSrc();
    expect(src).toBe(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8352691151177209"
    );
  });

  it("resolves ad slots correctly from registry or fallback", () => {
    expect(resolveAdSlot("homeBelowHero")).toBe(AD_SLOTS.homeBelowHero);
    expect(resolveAdSlot("custom_slot_999")).toBe("custom_slot_999");
  });

  it("validates canonical public/ads.txt content format", () => {
    const adsTxtPath = path.resolve(process.cwd(), "public/ads.txt");
    expect(fs.existsSync(adsTxtPath)).toBe(true);

    const content = fs.readFileSync(adsTxtPath, "utf-8").trim();
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    expect(lines.length).toBeGreaterThan(0);
    const googleLine = lines.find((l) => l.startsWith("google.com"));
    expect(googleLine).toBeDefined();

    // Standard IAB format: domain, publisher_id, type, cert_authority_id
    const parts = googleLine!.split(",").map((s) => s.trim());
    expect(parts[0]).toBe("google.com");
    expect(parts[1]).toBe("pub-8352691151177209");
    expect(parts[2]).toBe("DIRECT");
    expect(parts[3]).toBe("f08c47fec0942fa0");
  });
});
