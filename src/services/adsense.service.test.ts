import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { adSenseService } from "./adsense.service";
import { normalizePublisherId } from "@/config/ads";

describe("AdSenseService & Mobile Lifecycle Management", () => {
  let mockWindow: Record<string, unknown>;
  let mockDocument: Record<string, unknown>;

  beforeEach(() => {
    adSenseService.destroy();

    const eventListeners: Record<string, Array<(...args: unknown[]) => void>> = {};
    const elements: Array<{
      id?: string;
      src?: string;
      setAttribute: (k: string, v: string) => void;
    }> = [];

    mockDocument = {
      hidden: false,
      getElementById: (id: string) => elements.find((e) => e.id === id) || null,
      querySelector: (selector: string) => {
        if (selector.includes("pagead2")) {
          return elements.find((e) => e.src?.includes("pagead2")) || null;
        }
        return null;
      },
      createElement: (tag: string) => {
        const el = {
          tag,
          id: "",
          src: "",
          async: false,
          crossOrigin: "",
          setAttribute: (k: string, v: string) => {
            (el as Record<string, unknown>)[k] = v;
          },
          onload: null as (() => void) | null,
          onerror: null as ((err: unknown) => void) | null,
        };
        return el;
      },
      head: {
        appendChild: (el: { id?: string; src?: string; onload?: () => void }) => {
          elements.push(el);
          setTimeout(() => el.onload?.(), 0);
          return el;
        },
      },
      addEventListener: (evt: string, fn: (...args: unknown[]) => void) => {
        eventListeners[evt] = eventListeners[evt] || [];
        eventListeners[evt].push(fn);
      },
      removeEventListener: (evt: string, fn: (...args: unknown[]) => void) => {
        if (eventListeners[evt]) {
          eventListeners[evt] = eventListeners[evt].filter((f) => f !== fn);
        }
      },
    };

    mockWindow = {
      navigator: {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
        onLine: true,
        maxTouchPoints: 5,
      },
      matchMedia: (query: string) => ({
        matches: query.includes("standalone") ? false : query.includes("landscape") ? false : true,
      }),
      addEventListener: (evt: string, fn: (...args: unknown[]) => void) => {
        eventListeners[evt] = eventListeners[evt] || [];
        eventListeners[evt].push(fn);
      },
      removeEventListener: (evt: string, fn: (...args: unknown[]) => void) => {
        if (eventListeners[evt]) {
          eventListeners[evt] = eventListeners[evt].filter((f) => f !== fn);
        }
      },
      dispatchEvent: vi.fn(),
      adsbygoogle: [] as unknown[],
    };

    vi.stubGlobal("window", mockWindow);
    vi.stubGlobal("document", mockDocument);
    vi.stubGlobal("navigator", mockWindow.navigator);
  });

  afterEach(() => {
    adSenseService.destroy();
    vi.unstubAllGlobals();
  });

  it("normalizes publisher IDs properly", () => {
    expect(normalizePublisherId("ca-pub-8352691151177209")).toBe("ca-pub-8352691151177209");
    expect(normalizePublisherId("pub-8352691151177209")).toBe("ca-pub-8352691151177209");
    expect(normalizePublisherId("  pub-8352691151177209  ")).toBe("ca-pub-8352691151177209");
    expect(normalizePublisherId("  ca-pub-8352691151177209  ")).toBe("ca-pub-8352691151177209");
  });

  it("initializes with valid publisher ID and sets state", () => {
    const initialized = adSenseService.initialize({
      publisherId: "ca-pub-8352691151177209",
    });
    expect(initialized).toBe(true);
    expect(adSenseService.isValidPublisherId()).toBe(true);

    const state = adSenseService.getState();
    expect(state.initialized).toBe(true);
    expect(state.publisherId).toBe("ca-pub-8352691151177209");
  });

  it("detects mobile environment features gracefully", () => {
    const env = adSenseService.detectMobileEnvironment();
    expect(env).toBeDefined();
    expect(env.isMobileDevice).toBe(true);
    expect(typeof env.isStandalone).toBe("boolean");
    expect(typeof env.isCapacitor).toBe("boolean");
    expect(typeof env.isCordova).toBe("boolean");
    expect(["android", "ios", "pwa", "mobile-web", "desktop-web"]).toContain(env.platform);
    expect(["portrait", "landscape"]).toContain(env.screenOrientation);
  });

  it("manages pause and resume lifecycle transitions", () => {
    adSenseService.initialize({ publisherId: "ca-pub-8352691151177209" });

    adSenseService.pause();
    expect(adSenseService.getState().isPaused).toBe(true);
    // Pushing ads while paused is safely blocked
    const pushedWhilePaused = adSenseService.pushAd({});
    expect(pushedWhilePaused).toBe(false);

    adSenseService.resume();
    expect(adSenseService.getState().isPaused).toBe(false);
  });

  it("loads script into document.head when initialized", async () => {
    adSenseService.initialize({ publisherId: "ca-pub-8352691151177209" });

    const loaded = await adSenseService.loadScript(false);
    expect(loaded).toBe(true);
    expect(adSenseService.getState().scriptLoaded).toBe(true);
  });

  it("configures non-personalized ads flag on window.adsbygoogle queue", async () => {
    adSenseService.initialize({ publisherId: "ca-pub-8352691151177209" });
    await adSenseService.loadScript(true);

    const queue = mockWindow.adsbygoogle as { requestNonPersonalizedAds?: number };
    expect(queue.requestNonPersonalizedAds).toBe(1);
  });
});
