import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { COACHING } from "@/data/playo";
import { AcademyPage } from "@/routes/academy";
import {
  AccreditedAcademyList,
  ALL_KHELO_ACADEMIES,
  DEFAULT_BATCH_1_ACADEMIES,
  DEFAULT_BATCH_2_ACADEMIES,
} from "@/components/academy/AccreditedAcademyList";
import { AccreditedAcademyCard } from "@/components/academy/AccreditedAcademyCard";

// Mock Tanstack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/academy" } }),
  Link: ({ to, params, search, children, ...props }: any) => {
    let href = typeof to === "string" ? to : "#";
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        href = href.replace(`$${k}`, String(v));
      });
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Mock react-helmet-async
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: any) => <div data-testid="mock-helmet">{children}</div>,
}));

describe("Khelo India & SAI Accredited Academies (Batches 1 & 2)", () => {
  const allAcademies = COACHING.filter(
    (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
  );

  it("contains exactly 40 accredited academies in total across Batches 1 & 2", () => {
    expect(allAcademies.length).toBe(40);
    expect(ALL_KHELO_ACADEMIES.length).toBe(40);
    expect(DEFAULT_BATCH_1_ACADEMIES.length).toBe(20);
    expect(DEFAULT_BATCH_2_ACADEMIES.length).toBe(20);
  });

  it("has valid locations, sports and accreditations for each of the 40 academies", () => {
    allAcademies.forEach((academy) => {
      expect(academy.title).toBeTruthy();
      expect(academy.academyName).toBeTruthy();
      expect(academy.coach).toBeTruthy();
      expect(academy.sport).toBeTruthy();
      expect(academy.city).toBeTruthy();
      expect(academy.area).toBeTruthy();
      expect(academy.accreditation).toBeTruthy();
      expect(academy.facilities && academy.facilities.length).toBeGreaterThan(0);
      expect(academy.rating).toBeGreaterThanOrEqual(4.5);
      expect(academy.reviewsCount).toBeGreaterThan(0);
      expect(academy.highlights && academy.highlights.length).toBeGreaterThan(0);
    });
  });

  it("includes flagship Batch 1 accredited academies", () => {
    const names = DEFAULT_BATCH_1_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("Army Sports Institute (ASI) Pune");
    expect(names).toContain("Tata Archery Academy (TAA)");
    expect(names).toContain("Usha School of Athletics");
    expect(names).toContain("Prakash Padukone Badminton Academy (PPBA)");
    expect(names).toContain("Pullela Gopichand Badminton Academy");
    expect(names).toContain("Mary Kom Boxing Academy");
    expect(names).toContain("National Cricket Academy (BCCI COE)");
  });

  it("includes flagship Batch 2 accredited academies (21 through 40)", () => {
    const names = DEFAULT_BATCH_2_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("NIS Patiala High-Performance Academy");
    expect(names).toContain("SAI NCOE Regional Centre Lucknow");
    expect(names).toContain("SAI NCOE Sonepat");
    expect(names).toContain("SAI NCOE Kolkata");
    expect(names).toContain("SAI NCOE Guwahati");
    expect(names).toContain("SAI NCOE Gandhinagar");
    expect(names).toContain("SAI NCOE Rohtak");
    expect(names).toContain("RoundGlass Sports Academy (RGSA)");
    expect(names).toContain("Minerva Academy FC");
    expect(names).toContain("MRF Pace Foundation");
    expect(names).toContain("Gun For Glory (GFG) Shooting Academy");
    expect(names).toContain("Ramanathan Krishnan Tennis Academy");
    expect(names).toContain("MP State Women's Hockey Academy");
    expect(names).toContain("Odisha Reliance Foundation Athletics HPC");
    expect(names).toContain("KSCA State Cricket Academy");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 2", () => {
    const nisPatiala = DEFAULT_BATCH_2_ACADEMIES[0]; // academy-khelo-21
    const html = renderToString(<AccreditedAcademyCard academy={nisPatiala} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(nisPatiala.academyName!);
    expect(html).toContain(nisPatiala.city);
    expect(html).toContain(nisPatiala.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/athletics"');
    expect(html).toContain('href="/city/patiala"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 2 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch2" />,
    );
    expect(html).toContain("Batch 2 (21–40)");
    expect(html).toContain("NIS Patiala High-Performance Academy");
    expect(html).toContain("RoundGlass Sports Academy (RGSA)");
    expect(html).toContain("MRF Pace Foundation");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("renders AcademyPage route with 40 academies loaded banner", () => {
    const html = renderToString(<AcademyPage />);
    expect(html).toContain("Khelo India &amp; SAI Accredited");
    expect(html).toContain("40 Premier Academies Loaded");
    expect(html).toContain("Army Sports Institute (ASI) Pune");
    expect(html).toContain("NIS Patiala High-Performance Academy");
    expect(html).toContain("KSCA State Cricket Academy");
  });
});
