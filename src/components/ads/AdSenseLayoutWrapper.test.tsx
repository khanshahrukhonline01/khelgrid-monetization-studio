import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { AdConsentProvider } from "./AdConsent";
import { AdSenseLayoutWrapper, useAdSenseLayout } from "./AdSenseLayoutWrapper";
import { getEnvPublisherId, hasAdSenseEnvId } from "@/config/ads";

// Helper component to test useAdSenseLayout hook
function TestConsumer() {
  const { publisherId, isConfigured, topBannerActive, footerBannerActive } = useAdSenseLayout();
  return (
    <div data-testid="layout-consumer">
      <span data-testid="pub-id">{publisherId}</span>
      <span data-testid="configured">{String(isConfigured)}</span>
      <span data-testid="top-active">{String(topBannerActive)}</span>
      <span data-testid="footer-active">{String(footerBannerActive)}</span>
    </div>
  );
}

describe("AdSenseLayoutWrapper", () => {
  it("utilizes VITE_GOOGLE_ADSENSE_ID from .env and renders children", () => {
    const envPubId = getEnvPublisherId();
    const isEnvSet = hasAdSenseEnvId();

    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper>
          <div data-testid="child-content">Main Page Content</div>
          <TestConsumer />
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    expect(html).toContain("Main Page Content");
    expect(html).toContain('data-testid="adsense-layout-wrapper"');

    if (isEnvSet) {
      expect(html).toContain(`data-publisher-id="${envPubId}"`);
      expect(html).toContain('<span data-testid="configured">true</span>');
    }
  });

  it("automatically inserts top banner and footer banner ad slots by default", () => {
    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper>
          <h1>KhelGrid Opportunities</h1>
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    // Verify Top Banner slot container exists
    expect(html).toContain('aria-label="Sponsored advertisement"');

    // Verify Pre-Footer Banner slot container exists
    expect(html).toContain('aria-label="Footer advertisement"');
  });

  it("supports disabling top banner and footer banner slots via props", () => {
    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper enableTopBanner={false} enableFooterBanner={false}>
          <h1>No Banners Page</h1>
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    expect(html).not.toContain('aria-label="Sponsored advertisement"');
    expect(html).not.toContain('aria-label="Footer advertisement"');
    expect(html).toContain("No Banners Page");
  });

  it("automatically inserts mid-content ad slot when enableMidContent is set", () => {
    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper enableMidContent={true}>
          <article>Long article about sports trials...</article>
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    expect(html).toContain('aria-label="Advertisement"');
    expect(html).toContain("Long article about sports trials...");
  });

  it("supports custom publisherId override prop", () => {
    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper publisherId="pub-9999888877776666">
          <TestConsumer />
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    expect(html).toContain("ca-pub-9999888877776666");
    expect(html).toContain('data-publisher-id="ca-pub-9999888877776666"');
    expect(html).toContain('<span data-testid="configured">true</span>');
  });

  it("supports desktop sidebar ad column when enableSidebar is true", () => {
    const html = renderToString(
      <AdConsentProvider requireConsent={false}>
        <AdSenseLayoutWrapper enableSidebar={true}>
          <div>Sidebar Test Page</div>
        </AdSenseLayoutWrapper>
      </AdConsentProvider>,
    );

    expect(html).toContain('aria-label="Sidebar advertisement"');
    expect(html).toContain("Sponsored Partner");
  });
});
