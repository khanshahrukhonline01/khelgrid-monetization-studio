import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { COACHING } from "@/data/playo";
import { AcademyPage } from "@/routes/academy";
import {
  AccreditedAcademyList,
  ALL_KHELO_ACADEMIES,
  DEFAULT_BATCH_1_ACADEMIES,
  DEFAULT_BATCH_2_ACADEMIES,
  DEFAULT_BATCH_3_ACADEMIES,
  DEFAULT_BATCH_4_ACADEMIES,
  DEFAULT_BATCH_5_ACADEMIES,
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

describe("Khelo India & SAI Accredited Academies (Batches 1 to 5)", () => {
  const allAcademies = COACHING.filter(
    (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
  );

  it("contains exactly 100 accredited academies in total across Batches 1 to 5", () => {
    expect(allAcademies.length).toBe(100);
    expect(ALL_KHELO_ACADEMIES.length).toBe(100);
    expect(DEFAULT_BATCH_1_ACADEMIES.length).toBe(20);
    expect(DEFAULT_BATCH_2_ACADEMIES.length).toBe(20);
    expect(DEFAULT_BATCH_3_ACADEMIES.length).toBe(20);
    expect(DEFAULT_BATCH_4_ACADEMIES.length).toBe(20);
    expect(DEFAULT_BATCH_5_ACADEMIES.length).toBe(20);
  });

  it("has valid locations, sports and accreditations for each of the 100 academies", () => {
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

  it("includes flagship Batch 3 accredited academies (41 through 60)", () => {
    const names = DEFAULT_BATCH_3_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI NCOE LNCPE Thiruvananthapuram");
    expect(names).toContain("SAI NCOE Central Centre Bhopal");
    expect(names).toContain("SAI National Water Sports Academy");
    expect(names).toContain("PIS Gymnastics Academy Mohali");
    expect(names).toContain("SAI NCOE Takyelpat Imphal");
    expect(names).toContain("Army Boys Sports Company (ABSC) Pune");
    expect(names).toContain("MP State Equestrian Academy");
    expect(names).toContain("Gopichand Mytrah Badminton Academy");
    expect(names).toContain("GNSPF Project Leap Shooting Academy");
    expect(names).toContain("BBFS Vedas Residential Football Academy");
    expect(names).toContain("Dronacharya Archery Academy");
    expect(names).toContain("NTHA Odisha Women's Hockey Academy");
    expect(names).toContain("Bengaluru FC Residential Academy");
    expect(names).toContain("Inspire Institute of Sport (IIS)");
    expect(names).toContain("Vijay Merchant Cricket Academy BKC");
    expect(names).toContain("Chandrasekharan Nair Police Athletics Academy");
    expect(names).toContain("MP State Shooting Academy");
    expect(names).toContain("Haryana State Kabaddi Academy");
    expect(names).toContain("TNTA Advanced Development Centre");
    expect(names).toContain("Gyan Jyoti Residential Sports Academy");
  });

  it("includes flagship Batch 4 accredited academies (61 through 80)", () => {
    const names = DEFAULT_BATCH_4_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI NCOE Aurangabad (Chhatrapati Sambhajinagar)");
    expect(names).toContain("SAI Netaji Subhas Southern Centre Bengaluru");
    expect(names).toContain("MP State Water Sports Academy");
    expect(names).toContain("Assam State Badminton Academy Guwahati");
    expect(names).toContain("Dhanraj Pillay Hockey Academy");
    expect(names).toContain("SAI NCOE Jagatpur Cuttack");
    expect(names).toContain("Bhiwani Boxing Club (BBC)");
    expect(names).toContain("Mahabali Satpal Wrestling Academy");
    expect(names).toContain("Sikkim Football Academy Gangtok");
    expect(names).toContain("Chandigarh Football Academy (CFA)");
    expect(names).toContain("SAIL Hockey Academy Rourkela");
    expect(names).toContain("Surjit Hockey Academy Jalandhar");
    expect(names).toContain("VVS Sports Academy Hyderabad");
    expect(names).toContain("GNSPF Hyderabad Shooting Centre");
    expect(names).toContain("Kerala Police Football Academy Malappuram");
    expect(names).toContain("SAI Training Centre (STC) Kurukshetra");
    expect(names).toContain("SAAP Tennis Academy Vijayawada");
    expect(names).toContain("MP State Martial Arts Academy Bhopal");
    expect(names).toContain("TNPESU Athletics Academy Chennai");
    expect(names).toContain("GFDC Residential Football Academy Margao");
  });

  it("includes flagship Batch 5 accredited academies (81 through 100)", () => {
    const names = DEFAULT_BATCH_5_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI HATC High Altitude Centre Shilaroo");
    expect(names).toContain("Army Rowing Node (ARN) Pune");
    expect(names).toContain("Mizoram State Sports Academy Aizawl");
    expect(names).toContain("Tata Steel HPC Athletics Academy Jamshedpur");
    expect(names).toContain("SAI Regional Centre Khuman Lampak Imphal");
    expect(names).toContain("SAI High Performance Centre JLN Stadium Delhi");
    expect(names).toContain("PPSM Badminton Regional Centre Pune");
    expect(names).toContain("BBD Badminton Academy Lucknow");
    expect(names).toContain("MP State Archery Academy Jabalpur");
    expect(names).toContain("Gujarat State Tennis Academy Ahmedabad");
    expect(names).toContain("MBSPSU Sports Academy Patiala");
    expect(names).toContain("SAI NCOE Aquatics Centre Visakhapatnam");
    expect(names).toContain("SAG High Performance Centre Nadiad");
    expect(names).toContain("GNDU Fencing & Archery Academy Amritsar");
    expect(names).toContain("Dr. Karni Singh Shooting Academy Delhi");
    expect(names).toContain("Sanjay Manjrekar Cricket Excellence Academy");
    expect(names).toContain("SAI Training Centre (STC) Thalassery");
    expect(names).toContain("Haryana State Boxing Academy Rohtak");
    expect(names).toContain("East Bengal FC Residential Youth Academy");
    expect(names).toContain("Mohun Bagan Super Giant Youth Academy");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 5", () => {
    const mb = DEFAULT_BATCH_5_ACADEMIES.find((a) => a.id === "academy-khelo-100")!; // Mohun Bagan Youth Academy
    const html = renderToString(<AccreditedAcademyCard academy={mb} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(mb.academyName!);
    expect(html).toContain(mb.city);
    expect(html).toContain(mb.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/football"');
    expect(html).toContain('href="/city/kolkata"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 5 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch5" />,
    );
    expect(html).toContain("Batch 5 (81–100)");
    expect(html).toContain("SAI HATC High Altitude Centre Shilaroo");
    expect(html).toContain("Mohun Bagan Super Giant Youth Academy");
    expect(html).toContain("East Bengal FC Residential Youth Academy");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("renders AcademyPage route with 100 academies loaded banner", () => {
    const html = renderToString(<AcademyPage />);
    expect(html).toContain("Khelo India &amp; SAI Accredited");
    expect(html).toContain("100 Premier Academies Loaded");
    expect(html).toContain("Army Sports Institute (ASI) Pune");
    expect(html).toContain("NIS Patiala High-Performance Academy");
    expect(html).toContain("Inspire Institute of Sport (IIS)");
    expect(html).toContain("Chandigarh Football Academy (CFA)");
    expect(html).toContain("Mohun Bagan Super Giant Youth Academy");
  });
});
