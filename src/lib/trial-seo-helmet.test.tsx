import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { buildSeoHead } from "@/lib/seo";
import { TRIALS } from "@/data/trials";
import { SearchTrialsHelmetSEO } from "@/components/seo/SearchTrialsHelmetSEO";
import { getSearchTrialsSeoMetadata } from "@/lib/search-trials-seo";

describe("Official Selection Trial SEO & React Helmet Integration", () => {
  const saiTrial = TRIALS.find((t) => t.id === "t-sai-wrestling-mumbai-2026")!;

  it("builds comprehensive Open Graph, Twitter, and canonical meta tags via buildSeoHead", () => {
    expect(saiTrial).toBeDefined();

    const seoResult = buildSeoHead({
      title: `${saiTrial.title} · ${saiTrial.sport} Trial in ${saiTrial.city}`,
      description: `${saiTrial.title} hosted by ${saiTrial.academy} in ${saiTrial.city}.`,
      canonicalPath: `/trial/${saiTrial.id}`,
      keywords: `${saiTrial.title}, ${saiTrial.sport} trial ${saiTrial.city}`,
      type: "website",
      image: "https://khelgrid.com/og-image.png",
      author: saiTrial.academy,
    });

    const metaList = seoResult.meta;
    expect(metaList).toBeDefined();

    // Verify Open Graph tags
    const ogTitle = metaList.find((m) => m.property === "og:title");
    expect(ogTitle?.content).toContain("SAI NCOE Wrestling Selection Trials");

    const ogDescription = metaList.find((m) => m.property === "og:description");
    expect(ogDescription?.content).toContain("Sports Authority of India");

    const ogType = metaList.find((m) => m.property === "og:type");
    expect(ogType?.content).toBe("website");

    const ogUrl = metaList.find((m) => m.property === "og:url");
    expect(ogUrl?.content).toContain("/trial/t-sai-wrestling-mumbai-2026");

    const ogImage = metaList.find((m) => m.property === "og:image");
    expect(ogImage?.content).toBe("https://khelgrid.com/og-image.png");

    const ogSiteName = metaList.find((m) => m.property === "og:site_name");
    expect(ogSiteName?.content).toBe("KhelGrid");

    // Verify Twitter Cards
    const twitterCard = metaList.find((m) => m.name === "twitter:card");
    expect(twitterCard?.content).toBe("summary_large_image");

    const twitterTitle = metaList.find((m) => m.name === "twitter:title");
    expect(twitterTitle?.content).toContain("SAI NCOE Wrestling Selection Trials");

    const twitterImage = metaList.find((m) => m.name === "twitter:image");
    expect(twitterImage?.content).toBe("https://khelgrid.com/og-image.png");

    // Canonical link
    const canonicalLink = seoResult.links.find((l) => l.rel === "canonical");
    expect(canonicalLink?.href).toContain("/trial/t-sai-wrestling-mumbai-2026");

    // SportsEvent structured data script
    const jsonLdScript = seoResult.scripts.find((s) => s.type === "application/ld+json");
    expect(jsonLdScript).toBeDefined();
    if (jsonLdScript) {
      const parsed = JSON.parse(jsonLdScript.children as string);
      expect(parsed["@graph"]).toBeDefined();
      const sportsEvent = parsed["@graph"].find((item: any) => item["@type"] === "SportsEvent");
      expect(sportsEvent).toBeDefined();
      expect(sportsEvent.name).toContain("SAI NCOE Wrestling");
    }
  });

  it("verifies HelmetProvider mounts properly in SSR/testing environment without errors", () => {
    const helmetContext = {};
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <div data-testid="helmet-app">KhelGrid SEO Shell</div>
      </HelmetProvider>,
    );

    expect(html).toContain("KhelGrid SEO Shell");
  });

  it("verifies SearchTrialsHelmetSEO dynamically configures CRPF metadata and Schema.org JobPosting", () => {
    const meta = getSearchTrialsSeoMetadata({
      query: "crpf recruitment",
      sport: "Athletics",
      city: "All Locations",
    });

    expect(meta.isCrpf).toBe(true);
    expect(meta.pageTitle).toContain("CRPF Meritorious Sportspersons Recruitment 2026");
    expect(meta.metaDescription).toContain("521 vacancies");
    expect(meta.metaDescription).toContain("rect.crpf.gov.in");
    expect(meta.canonicalUrl).toContain("q=crpf+recruitment");
    expect(meta.keywords).toContain("CRPF recruitment 2026");

    const jobPosting = meta.jsonLdData.find((s) => s["@type"] === "JobPosting");
    expect(jobPosting).toBeDefined();
    expect((jobPosting as any)?.identifier?.value).toBe("CRPF-SPORTS-QUOTA-2026-521");
    expect((jobPosting as any)?.hiringOrganization?.sameAs).toBe("https://rect.crpf.gov.in");

    const faqPage = meta.jsonLdData.find((s) => s["@type"] === "FAQPage");
    expect(faqPage).toBeDefined();

    // Verify component mounts without error inside HelmetProvider
    const helmetContext = {};
    const html = renderToString(
      <HelmetProvider context={helmetContext}>
        <SearchTrialsHelmetSEO query="crpf recruitment" sport="Athletics" city="All Locations" />
      </HelmetProvider>,
    );
    expect(html).toBeDefined();
  });

  it("verifies SearchTrialsHelmetSEO constructs sport and city targeted titles for regional discovery", () => {
    const meta = getSearchTrialsSeoMetadata({
      sport: "Badminton",
      city: "Bengaluru",
    });

    expect(meta.isCrpf).toBe(false);
    expect(meta.pageTitle).toContain("Badminton Selection Trials & Opportunities in Bengaluru");
    expect(meta.metaDescription).toContain("Bengaluru");
    expect(meta.metaDescription).toContain("Badminton");
    expect(meta.canonicalUrl).toContain("sport=Badminton");
    expect(meta.canonicalUrl).toContain("city=Bengaluru");
    expect(meta.keywords).toContain("Badminton trials 2026");
  });
});
