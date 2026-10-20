import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { COACHING } from "@/data/khelgrid";
import { AcademyPage } from "@/routes/academy";
import {
  AccreditedAcademyList,
  ALL_KHELO_ACADEMIES,
  DEFAULT_BATCH_1_ACADEMIES,
  DEFAULT_BATCH_2_ACADEMIES,
  DEFAULT_BATCH_3_ACADEMIES,
  DEFAULT_BATCH_4_ACADEMIES,
  DEFAULT_BATCH_5_ACADEMIES,
  DEFAULT_BATCH_6_ACADEMIES,
  DEFAULT_BATCH_7_ACADEMIES,
  DEFAULT_BATCH_8_ACADEMIES,
  DEFAULT_BATCH_9_ACADEMIES,
  DEFAULT_BATCH_10_ACADEMIES,
  DEFAULT_BATCH_11_ACADEMIES,
  DEFAULT_BATCH_12_ACADEMIES,
  DEFAULT_BATCH_13_ACADEMIES,
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

describe("Khelo India & SAI Accredited Academies (Batches 1 to 13)", () => {
  const allAcademies = COACHING.filter(
    (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
  );

  it("contains deduplicated accredited academies with zero duplicate listings", () => {
    expect(allAcademies.length).toBe(260);
    expect(ALL_KHELO_ACADEMIES.length).toBeLessThan(260);
    expect(ALL_KHELO_ACADEMIES.length).toBeGreaterThan(200);

    // Verify deduplication of key institutions requested by user:
    const bhiwani = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Bhiwani Boxing Club"),
    );
    expect(bhiwani.length).toBe(1);

    const cfa = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Chandigarh Football Academy"),
    );
    expect(cfa.length).toBe(1);

    const surjit = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Surjit Hockey Academy"),
    );
    expect(surjit.length).toBe(1);

    const bfc = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Bengaluru FC Residential Academy"),
    );
    expect(bfc.length).toBe(1);

    const equestrian = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("MP State Equestrian Academy"),
    );
    expect(equestrian.length).toBe(1);

    const gujaratTennis = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Gujarat State Tennis Academy"),
    );
    expect(gujaratTennis.length).toBe(1);

    const assamBadminton = ALL_KHELO_ACADEMIES.filter((a) =>
      a.academyName?.includes("Assam State Badminton Academy"),
    );
    expect(assamBadminton.length).toBe(1);
  });

  it("has valid locations, sports and accreditations for each of the 260 academies", () => {
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

  it("includes flagship Batch 6 accredited academies (101 through 120)", () => {
    const names = DEFAULT_BATCH_6_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI Training Centre (STC) Dharamshala");
    expect(names).toContain("BBFS Bengaluru Apex Development Centre");
    expect(names).toContain("SAI NCOE Indira Gandhi Stadium Complex Delhi");
    expect(names).toContain("Odisha Naval Tata Hockey HPC");
    expect(names).toContain("National Sports Academy Prayagraj");
    expect(names).toContain("SAI NCOE IG Stadium Kohima");
    expect(names).toContain("Churchill Brothers FC Youth Academy");
    expect(names).toContain("MP State Shooting Academy Gwalior");
    expect(names).toContain("SAI Training Centre (STC) Bareilly");
    expect(names).toContain("Chhatrapati Shahu Maharaj Wrestling Academy");
    expect(names).toContain("PIS Hockey Academy Jalandhar");
    expect(names).toContain("SAI Training Centre (STC) Salem");
    expect(names).toContain("Assam Rifles Khelo India Sports School Shillong");
    expect(names).toContain("SAI Training Centre (STC) Bilaspur");
    expect(names).toContain("KSSC Athletics Academy Kozhikode");
    expect(names).toContain("SAI Training Centre (STC) Jabalpur");
    expect(names).toContain("Vijay Hazare Cricket Academy Vadodara");
    expect(names).toContain("SAI Training Centre (STC) Alwar");
    expect(names).toContain("Bengal Cricket Academy Kalyani");
    expect(names).toContain("SAI Training Centre (STC) Udhampur");
  });

  it("includes flagship Batch 7 accredited academies (121 through 140)", () => {
    const names = DEFAULT_BATCH_7_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI NCOE Kandaghat Solan");
    expect(names).toContain("Tata Steel Water Sports Academy");
    expect(names).toContain("SAI Training Centre (STC) Agartala");
    expect(names).toContain("FC Goa Youth Academy");
    expect(names).toContain("SAI Training Centre (STC) Kashipur");
    expect(names).toContain("NIS Patiala Weightlifting High-Performance Wing");
    expect(names).toContain("KSSC Aquatics Academy Kollam");
    expect(names).toContain("SAI Training Centre (STC) Dimapur");
    expect(names).toContain("HCA Centre of Excellence Uppal");
    expect(names).toContain("SAI Training Centre (STC) Mayiladuthurai");
    expect(names).toContain("MP State Equestrian Academy Bhopal");
    expect(names).toContain("SAI National Water Sports Academy Punnamada");
    expect(names).toContain("GMSSS Khelo India Hockey Academy Jalandhar");
    expect(names).toContain("SAI Training Centre (STC) Sagar");
    expect(names).toContain("GBA Regional Badminton Academy Mapusa");
    expect(names).toContain("SAI Training Centre (STC) Gurdaspur");
    expect(names).toContain("Delhi State Fencing Academy Rohini");
    expect(names).toContain("SAI Training Centre (STC) Kurnool");
    expect(names).toContain("Sree Kanteerava Athletics Academy");
    expect(names).toContain("SAI NCOE Shooting Range Complex Cuttack");
  });

  it("includes flagship Batch 8 accredited academies (141 through 160)", () => {
    const names = DEFAULT_BATCH_8_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI Training Centre (STC) Hisar");
    expect(names).toContain("Odisha Reliance Foundation Athletics HPC");
    expect(names).toContain("SAI Training Centre (STC) Thalassery");
    expect(names).toContain("Bengaluru FC Residential Academy");
    expect(names).toContain("SAI Training Centre (STC) Raipur");
    expect(names).toContain("MP State Women's Hockey Academy Gwalior");
    expect(names).toContain("SAI Training Centre (STC) Solapur");
    expect(names).toContain("Chetan Anand Badminton Academy");
    expect(names).toContain("SAI Training Centre (STC) Ranchi");
    expect(names).toContain("GFG Shooting Academy Navi Mumbai");
    expect(names).toContain("SAI Training Centre (STC) Eluru");
    expect(names).toContain("PIS Fencing Academy Patiala");
    expect(names).toContain("SAI Training Centre (STC) Mysuru");
    expect(names).toContain("Gautam Gambhir Cricket Academy");
    expect(names).toContain("SAI Training Centre (STC) Mapusa");
    expect(names).toContain("KSLTA Tennis Excellence Centre");
    expect(names).toContain("SAI Training Centre (STC) Dharwad");
    expect(names).toContain("Odisha JSW Swimming HPC");
    expect(names).toContain("SAI Training Centre (STC) Varanasi");
    expect(names).toContain("Sudarshan Chakra Equestrian Academy");
  });

  it("includes flagship Batch 9 accredited academies (161 through 180)", () => {
    const names = DEFAULT_BATCH_9_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI Training Centre (STC) Chennai SAF Village");
    expect(names).toContain("SAI NCOE Water Sports Complex Alappuzha");
    expect(names).toContain("MP State Judo Academy Bhopal");
    expect(names).toContain("Haryana State Youth Boxing Academy Bhiwani");
    expect(names).toContain("Tata Steel Fencing High Performance Centre");
    expect(names).toContain("SAI Training Centre (STC) Morabadi Ranchi");
    expect(names).toContain("SAI High Altitude Centre Shilaroo");
    expect(names).toContain("Gujarat State Tennis Academy Ahmedabad");
    expect(names).toContain("ASI Pune Archery High Performance Wing");
    expect(names).toContain("SAI Training Centre (STC) Utlou Bishnupur");
    expect(names).toContain("Odisha Naval Tata Hockey HPC Rourkela");
    expect(names).toContain("SAI Training Centre (STC) Aurangabad");
    expect(names).toContain("Karnataka State Table Tennis Academy Bengaluru");
    expect(names).toContain("SAI Training Centre (STC) Leh Ladakh");
    expect(names).toContain("Kerala State Aquatic Academy Pirappancode");
    expect(names).toContain("SAI Training Centre (STC) Jabalpur");
    expect(names).toContain("Punjab State Weightlifting COE Patiala");
    expect(names).toContain("SAI NCOE Kurukshetra Wrestling Wing");
    expect(names).toContain("Rajasthan State Shooting Academy Jagatpura");
    expect(names).toContain("SAI Training Centre (STC) Port Blair");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 9", () => {
    const alappuzha = DEFAULT_BATCH_9_ACADEMIES.find((a) => a.id === "academy-khelo-162")!; // SAI NCOE Alappuzha
    const html = renderToString(<AccreditedAcademyCard academy={alappuzha} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(alappuzha.academyName!);
    expect(html).toContain(alappuzha.city);
    expect(html).toContain(alappuzha.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/rowing"');
    expect(html).toContain('href="/city/alappuzha"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 9 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch9" />,
    );
    expect(html).toContain("Batch 9");
    expect(html).toContain("SAI NCOE Water Sports Complex Alappuzha");
    expect(html).toContain("Haryana State Youth Boxing Academy Bhiwani");
    expect(html).toContain("SAI Training Centre (STC) Leh Ladakh");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("includes flagship Batch 10 accredited academies (181 through 200)", () => {
    const names = DEFAULT_BATCH_10_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI NCOE Central Regional Centre Bhopal");
    expect(names).toContain("SAI Training Centre (STC) Barabati Cuttack");
    expect(names).toContain("MP State Equestrian Academy Bhopal");
    expect(names).toContain("SAI Training Centre (STC) Madurai");
    expect(names).toContain("Haryana State Wrestling Academy Rohtak");
    expect(names).toContain("SAI Training Centre (STC) Alwar");
    expect(names).toContain("Assam State Badminton Academy Guwahati");
    expect(names).toContain("SAI Training Centre (STC) Calicut");
    expect(names).toContain("SAI NCOE Gymnastics Centre Kolkata");
    expect(names).toContain("SAI Training Centre (STC) Bareilly");
    expect(names).toContain("Tata Steel Archery HPC Noamundi");
    expect(names).toContain("SAI Training Centre (STC) Salem");
    expect(names).toContain("Punjab State Boxing COE Jalandhar");
    expect(names).toContain("SAI Training Centre (STC) Dimapur");
    expect(names).toContain("SAI NCOE Dr. Karni Singh Shooting Range Delhi");
    expect(names).toContain("SAI Training Centre (STC) Fatorda Margao");
    expect(names).toContain("Odisha State Table Tennis Academy Cuttack");
    expect(names).toContain("SAI Training Centre (STC) Prayagraj");
    expect(names).toContain("SAI Training Centre (STC) Shillong");
    expect(names).toContain("SAI NCOE Bengaluru Kengeri Hub");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 10", () => {
    const kengeri = DEFAULT_BATCH_10_ACADEMIES.find((a) => a.id === "academy-khelo-200")!; // SAI NCOE Bengaluru Kengeri Hub
    const html = renderToString(<AccreditedAcademyCard academy={kengeri} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(kengeri.academyName!);
    expect(html).toContain(kengeri.city);
    expect(html).toContain(kengeri.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/athletics"');
    expect(html).toContain('href="/city/bengaluru"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 10 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch10" />,
    );
    expect(html).toContain("Batch 10");
    expect(html).toContain("SAI NCOE Dr. Karni Singh Shooting Range Delhi");
    expect(html).toContain("MP State Equestrian Academy Bhopal");
    expect(html).toContain("SAI NCOE Bengaluru Kengeri Hub");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("includes flagship Batch 11 accredited academies (201 through 220)", () => {
    const names = DEFAULT_BATCH_11_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI Training Centre (STC) Agartala");
    expect(names).toContain("Haryana State Archery Academy Rohtak");
    expect(names).toContain("SAI Training Centre (STC) Thalassery Fencing");
    expect(names).toContain("MP State Water Sports Academy Bhopal");
    expect(names).toContain("SAI Training Centre (STC) Kashipur Boxing Wing");
    expect(names).toContain("Odisha Football Academy Kalinga Stadium");
    expect(names).toContain("SAI NCOE Gandhinagar Athletics Centre");
    expect(names).toContain("Punjab State Hockey Academy Surjit Stadium");
    expect(names).toContain("SAI Training Centre (STC) Mayiladuthurai");
    expect(names).toContain("Maharashtra State Wrestling Academy Motibagh");
    expect(names).toContain("SAI Training Centre (STC) Bilaspur");
    expect(names).toContain("Kerala State Badminton Academy RSC Kochi");
    expect(names).toContain("SAI Training Centre (STC) Sagar Judo Wing");
    expect(names).toContain("Tamil Nadu State Tennis Academy SDAT Chennai");
    expect(names).toContain("SAI Training Centre (STC) Gurdaspur");
    expect(names).toContain("Karnataka State Aquatic Academy Mysuru");
    expect(names).toContain("SAI Training Centre (STC) Kurnool Boxing");
    expect(names).toContain("Rajasthan State Basketball Academy Jaipur");
    expect(names).toContain("SAI Training Centre (STC) Solan Table Tennis");
    expect(names).toContain("SAI NCOE Shooting Range Bhopal");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 11", () => {
    const thalassery = DEFAULT_BATCH_11_ACADEMIES.find((a) => a.id === "academy-khelo-203")!; // SAI Thalassery Fencing
    const html = renderToString(<AccreditedAcademyCard academy={thalassery} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(thalassery.academyName!);
    expect(html).toContain(thalassery.city);
    expect(html).toContain(thalassery.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/fencing"');
    expect(html).toContain('href="/city/thalassery"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 11 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch11" />,
    );
    expect(html).toContain("Batch 11");
    expect(html).toContain("SAI Training Centre (STC) Agartala");
    expect(html).toContain("SAI Training Centre (STC) Thalassery Fencing");
    expect(html).toContain("MP State Water Sports Academy Bhopal");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("includes flagship Batch 12 accredited academies (221 through 240)", () => {
    const names = DEFAULT_BATCH_12_ACADEMIES.map((a) => a.academyName);
    expect(names).toContain("SAI Training Centre (STC) Jagatpur Water Sports");
    expect(names).toContain("Army Boys Sports Company 1 EME Secunderabad");
    expect(names).toContain("SAI STC Alappuzha Kayaking & Canoeing Wing");
    expect(names).toContain("Goa State Badminton Academy Panaji");
    expect(names).toContain("SAI Training Centre (STC) Dharwad Wrestling");
    expect(names).toContain("Uttarakhand State Archery Academy Dehradun");
    expect(names).toContain("SAI Training Centre (STC) Ranital Jabalpur");
    expect(names).toContain("Odisha Reliance Foundation HPC Athletics");
    expect(names).toContain("SAI Training Centre (STC) Varanasi Wrestling");
    expect(names).toContain("Punjab State Weightlifting Academy Ludhiana");
    expect(names).toContain("SAI Training Centre (STC) Salem Athletics");
    expect(names).toContain("Assam State Boxing Academy Sarusajai");
    expect(names).toContain("SAI Training Centre (STC) Udhampur Table Tennis");
    expect(names).toContain("KSLTA Junior Centre of Excellence Bengaluru");
    expect(names).toContain("SAI STC Mayiladuthurai Kabaddi");
    expect(names).toContain("Rajasthan State Athletics Academy Bikaner");
    expect(names).toContain("SAI Training Centre (STC) Solapur Weightlifting");
    expect(names).toContain("Kerala State Athletics Academy Maharajas Kochi");
    expect(names).toContain("SAI NCOE High Performance Judo Imphal");
    expect(names).toContain("SAI NCOE Jawaharlal Nehru Stadium Delhi");
  });

  it("renders AccreditedAcademyCard with semantic Schema.org microdata and internal links for Batch 12", () => {
    const dehradun = DEFAULT_BATCH_12_ACADEMIES.find((a) => a.id === "academy-khelo-226")!; // Uttarakhand State Archery Academy
    const html = renderToString(<AccreditedAcademyCard academy={dehradun} />);

    // Schema.org Microdata
    expect(html.toLowerCase()).toContain("itemscope");
    expect(html).toContain("schema.org/SportsActivityLocation");
    expect(html).toContain(dehradun.academyName!);
    expect(html).toContain(dehradun.city);
    expect(html).toContain(dehradun.area);

    // Internal links for SEO & discoverability
    expect(html).toContain('href="/sport/archery"');
    expect(html).toContain('href="/city/dehradun"');
    expect(html).toContain('href="/search"');
    expect(html).toContain('href="/train"');
  });

  it("renders AccreditedAcademyList component with Batch 12 switcher active", () => {
    const html = renderToString(
      <AccreditedAcademyList academies={ALL_KHELO_ACADEMIES} initialBatch="batch12" />,
    );
    expect(html).toContain("Batch 12");
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SportsActivityLocation");
  });

  it("renders AcademyPage route with dynamic stat badge, disclaimer and listings", () => {
    const html = renderToString(<AcademyPage />);
    expect(html).toContain("Sports Academies Directory India");
    expect(html).toContain("academies listed");
    expect(html).toContain("Source: SAI &amp; Khelo India Public Directory");
    expect(html).toContain("KhelGrid is an independent platform");
    expect(html).toContain("Report a correction");
    expect(html).toContain("Claim or update your listing");
    expect(html).toContain("How to choose a sports academy");
    expect(html).toContain("Army Sports Institute (ASI) Pune");
    expect(html).toContain("NIS Patiala High-Performance Academy");
    expect(html).toContain("Inspire Institute of Sport (IIS)");
    expect(html).toContain("Chandigarh Football Academy (CFA)");
    expect(html).toContain("Mohun Bagan Super Giant Youth Academy");
    expect(html).toContain("FC Goa Youth Academy");
    expect(html).toContain("Bengaluru FC Residential Academy");
    expect(html).toContain("SAI NCOE Water Sports Complex Alappuzha");
  });
});
