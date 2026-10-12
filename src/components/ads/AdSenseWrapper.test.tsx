import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { AdSenseWrapper } from "./AdSenseWrapper";
import { adSenseService } from "@/services/adsense.service";
import * as adsConfigModule from "@/config/ads";

// Mock AdConsent context
vi.mock("./AdConsent", () => ({
  useAdConsent: () => ({
    canLoadScript: true,
    nonPersonalized: false,
    canServeAds: true,
  }),
}));

describe("AdSenseWrapper Component & Conditional Rendering", () => {
  beforeEach(() => {
    adSenseService.destroy();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render children during SSR / before hydration, rendering fallback or placeholder safely", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);

    const html = renderToString(
      <AdSenseWrapper fallback={<div id="fallback-ui">Fallback Content</div>}>
        <div id="ad-content">Ad Unit Content</div>
      </AdSenseWrapper>,
    );

    // During SSR, fallback is rendered safely without throwing hydration errors
    expect(html).toContain('id="fallback-ui"');
    expect(html).not.toContain('id="ad-content"');
  });

  it("renders placeholder fallback during SSR when placeholderFallback is true", () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);

    const html = renderToString(
      <AdSenseWrapper placeholderFallback={true} minHeight={160}>
        <div id="ad-content">Ad Unit Content</div>
      </AdSenseWrapper>,
    );

    expect(html).toContain("Ad space");
    expect(html).toContain("min-height:160px");
    expect(html).not.toContain('id="ad-content"');
  });

  it("prevents script loading when VITE_GOOGLE_ADSENSE_ID is missing in service", async () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(false);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("");

    // Initialize without explicit publisher ID
    const initResult = adSenseService.initialize();
    expect(initResult).toBe(false);

    const scriptLoaded = await adSenseService.loadScript(false);
    expect(scriptLoaded).toBe(false);
    expect(adSenseService.getState().scriptLoaded).toBe(false);
  });

  it("permits script loading when VITE_GOOGLE_ADSENSE_ID is valid and configured", async () => {
    vi.spyOn(adsConfigModule, "hasAdSenseEnvId").mockReturnValue(true);
    vi.spyOn(adsConfigModule, "getEnvPublisherId").mockReturnValue("ca-pub-8352691151177209");

    const mockWindow = {
      adsbygoogle: [] as unknown[],
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const mockDocument = {
      getElementById: vi.fn().mockReturnValue(null),
      querySelector: vi.fn().mockReturnValue(null),
      createElement: vi.fn().mockReturnValue({
        setAttribute: vi.fn(),
        onload: null as (() => void) | null,
      }),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      head: {
        appendChild: (el: { onload?: () => void }) => {
          setTimeout(() => el.onload?.(), 0);
          return el;
        },
      },
    };

    vi.stubGlobal("window", mockWindow);
    vi.stubGlobal("document", mockDocument);

    const initResult = adSenseService.initialize();
    expect(initResult).toBe(true);

    const scriptLoaded = await adSenseService.loadScript(false);
    expect(scriptLoaded).toBe(true);

    vi.unstubAllGlobals();
  });

  it("correctly identifies hasAdSenseEnvId helper behavior", () => {
    expect(adsConfigModule.hasAdSenseEnvId()).toBe(false); // No VITE_GOOGLE_ADSENSE_ID in test runner
    expect(adsConfigModule.isAdSenseConfigured()).toBe(false);
  });
});
