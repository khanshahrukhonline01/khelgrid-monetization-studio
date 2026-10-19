import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "./SEO";
import { resolveCanonicalUrl, resolveImageUrl, resolveTitle } from "./seo-utils";
import { SITE_URL, DEFAULT_SITE_NAME, TWITTER_HANDLE, DEFAULT_OG_IMAGE } from "@/lib/seo";

describe("Reusable SEO Component (react-helmet-async)", () => {
  it("resolves canonical URLs correctly for absolute and relative paths", () => {
    expect(resolveCanonicalUrl("https://khelgrid.com/search")).toBe("https://khelgrid.com/search");
    expect(resolveCanonicalUrl("http://example.com/test")).toBe("http://example.com/test");
    expect(resolveCanonicalUrl("/opportunities")).toBe(`${SITE_URL}/opportunities`);
    expect(resolveCanonicalUrl("trial/t-123")).toBe(`${SITE_URL}/trial/t-123`);
  });

  it("resolves image URLs correctly for absolute and relative paths", () => {
    expect(resolveImageUrl()).toBe(DEFAULT_OG_IMAGE);
    expect(resolveImageUrl("https://custom.com/image.jpg")).toBe("https://custom.com/image.jpg");
    expect(resolveImageUrl("/assets/banner.png")).toBe(`${SITE_URL}/assets/banner.png`);
  });

  it("formats page title with site branding", () => {
    expect(resolveTitle("National Trials", DEFAULT_SITE_NAME, true)).toBe(
      `National Trials · ${DEFAULT_SITE_NAME}`,
    );
    expect(resolveTitle(`State Trials · ${DEFAULT_SITE_NAME}`, DEFAULT_SITE_NAME, true)).toBe(
      `State Trials · ${DEFAULT_SITE_NAME}`,
    );
    expect(resolveTitle("Raw Page Title", DEFAULT_SITE_NAME, false)).toBe("Raw Page Title");
    expect(resolveTitle("", DEFAULT_SITE_NAME, true)).toBe(DEFAULT_SITE_NAME);
  });

  it("renders standardized title, meta description, and canonical URL tags via HelmetProvider", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Selection Trials 2026"
          description="Find upcoming athletics and badminton selection trials across India."
          canonicalUrl="/trials"
        />
      </HelmetProvider>,
    );

    // Verify Title
    expect(html).toContain(`<title>Selection Trials 2026 · ${DEFAULT_SITE_NAME}</title>`);

    // Verify Meta description & canonical
    expect(html).toContain(
      'name="description" content="Find upcoming athletics and badminton selection trials across India."',
    );
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/trials"`);

    // Verify OpenGraph tags
    expect(html).toContain(
      `property="og:title" content="Selection Trials 2026 · ${DEFAULT_SITE_NAME}"`,
    );
    expect(html).toContain(
      'property="og:description" content="Find upcoming athletics and badminton selection trials across India."',
    );
    expect(html).toContain(`property="og:url" content="${SITE_URL}/trials"`);
    expect(html).toContain(`property="og:site_name" content="${DEFAULT_SITE_NAME}"`);
    expect(html).toContain(`property="og:image" content="${DEFAULT_OG_IMAGE}"`);

    // Verify Twitter Card tags
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain(`name="twitter:site" content="${TWITTER_HANDLE}"`);
    expect(html).toContain(
      `name="twitter:title" content="Selection Trials 2026 · ${DEFAULT_SITE_NAME}"`,
    );
  });

  it("supports 'canonical' alias prop and custom ogImage/image", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Athlete Profile"
          description="View youth athlete statistics, medals, and scout verified CV."
          canonical="/cv/ath-99"
          image="https://khelgrid.com/athletes/ath-99-cv.png"
          imageAlt="Athlete CV Certificate"
          keywords={["athlete", "sports cv", "scout"]}
          author="KhelGrid Scouting Network"
        />
      </HelmetProvider>,
    );

    expect(html).toContain(`rel="canonical" href="${SITE_URL}/cv/ath-99"`);
    expect(html).toContain(
      'property="og:image" content="https://khelgrid.com/athletes/ath-99-cv.png"',
    );
    expect(html).toContain('property="og:image:alt" content="Athlete CV Certificate"');
    expect(html).toContain('name="keywords" content="athlete, sports cv, scout"');
    expect(html).toContain('name="author" content="KhelGrid Scouting Network"');
  });

  it("sets noindex directives properly when requested", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Private Dashboard"
          description="Internal athlete management view."
          canonicalUrl="/dashboard"
          noindex={true}
        />
      </HelmetProvider>,
    );

    expect(html).toContain('name="robots" content="noindex, nofollow"');
  });

  it("injects Schema.org JSON-LD scripts and child elements", () => {
    const sampleSchema = {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: "CRPF Athletics Combine 2026",
      startDate: "2026-11-01",
    };

    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="CRPF Recruitment"
          description="CRPF Sports Quota recruitment notification."
          canonicalUrl="/trial/crpf-2026"
          schema={sampleSchema}
        >
          <meta name="custom-test-meta" content="verified-trial" />
        </SEO>
      </HelmetProvider>,
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("CRPF Athletics Combine 2026");
    expect(html).toContain('name="custom-test-meta" content="verified-trial"');
  });

  it("handles article ogType and datetime metadata", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="How to Prepare for SAI NCOE Trials"
          description="Expert tips and documentation checklist for national sports trials."
          canonicalUrl="/guide/sai-ncoe-prep"
          type="article"
          publishedTime="2026-10-15T10:00:00Z"
          modifiedTime="2026-10-15T12:00:00Z"
          author="Editorial Board"
        />
      </HelmetProvider>,
    );

    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('property="article:published_time" content="2026-10-15T10:00:00Z"');
    expect(html).toContain('property="article:modified_time" content="2026-10-15T12:00:00Z"');
    expect(html).toContain('property="article:author" content="Editorial Board"');
  });

  it("automatically generates Schema.org BreadcrumbList structured data", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Badminton Selection Trials"
          description="Upcoming badminton trials in India."
          canonicalUrl="/trials/badminton"
          breadcrumbs={[
            { name: "Home", path: "/" },
            { name: "Trials", path: "/trials" },
            { name: "Badminton", path: "/trials/badminton" },
          ]}
        />
      </HelmetProvider>,
    );

    expect(html).toContain("BreadcrumbList");
    expect(html).toContain('"name":"Home"');
    expect(html).toContain('"name":"Trials"');
    expect(html).toContain('"name":"Badminton"');
    expect(html).toContain(`${SITE_URL}/trials/badminton`);
  });

  it("automatically generates Schema.org FAQPage structured data", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Sports Trials FAQ"
          description="Frequently asked questions about government trials."
          canonicalUrl="/faq"
          faqs={[
            {
              question: "What documents are required for SAI trials?",
              answer: "Age proof, sports achievement certificates, and medical fitness form.",
            },
            {
              question: "Is there any entry fee?",
              answer: "No, all official SAI open trials are completely free of charge.",
            },
          ]}
        />
      </HelmetProvider>,
    );

    expect(html).toContain("FAQPage");
    expect(html).toContain("What documents are required for SAI trials?");
    expect(html).toContain("Age proof, sports achievement certificates");
    expect(html).toContain("Is there any entry fee?");
  });

  it("handles custom robots directive and nofollow correctly", () => {
    const htmlWithNofollow = renderToString(
      <HelmetProvider>
        <SEO
          title="External Resource Hub"
          description="Outbound links directory."
          canonicalUrl="/resources"
          nofollow={true}
        />
      </HelmetProvider>,
    );
    expect(htmlWithNofollow).toContain('name="robots" content="index, nofollow"');

    const htmlCustomRobots = renderToString(
      <HelmetProvider>
        <SEO
          title="Special Staging Page"
          description="Staging meta."
          canonicalUrl="/staging"
          robots="noindex, follow, noarchive"
        />
      </HelmetProvider>,
    );
    expect(htmlCustomRobots).toContain('name="robots" content="noindex, follow, noarchive"');
  });

  it("supports primary locale and alternateLocales for multilingual SEO", () => {
    const html = renderToString(
      <HelmetProvider>
        <SEO
          title="Hindi Sports Portal"
          description="खेल और ट्रायल की जानकारी."
          canonicalUrl="/hi"
          locale="hi_IN"
          alternateLocales={["en_IN", "bn_IN"]}
        />
      </HelmetProvider>,
    );

    expect(html).toContain('property="og:locale" content="hi_IN"');
    expect(html).toContain('property="og:locale:alternate" content="en_IN"');
    expect(html).toContain('property="og:locale:alternate" content="bn_IN"');
  });
});
