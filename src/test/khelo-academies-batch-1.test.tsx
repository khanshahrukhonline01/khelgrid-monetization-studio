import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { COACHING } from "@/data/playo";
import { AcademyDirectoryPage } from "@/routes/academy";

// Mock Tanstack Router
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({
    ...config,
    component: config.component,
    head: config.head,
  }),
  useNavigate: () => vi.fn(),
  useRouterState: () => ({ location: { search: {}, pathname: "/academy" } }),
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

describe("Khelo India & SAI Accredited Academies (Batch 1)", () => {
  const batch1 = COACHING.filter(
    (c) => c.entityType === "academy" && c.id.startsWith("academy-khelo-"),
  );

  it("contains exactly 20 accredited academies in Batch 1", () => {
    expect(batch1.length).toBe(20);
  });

  it("has valid locations, sports and accreditations for each academy in Batch 1", () => {
    batch1.forEach((academy) => {
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

  it("includes flagship accredited academies across diverse Indian regions", () => {
    const academyNames = batch1.map((a) => a.academyName);
    expect(academyNames).toContain("Army Sports Institute (ASI) Pune");
    expect(academyNames).toContain("Tata Archery Academy (TAA)");
    expect(academyNames).toContain("Usha School of Athletics");
    expect(academyNames).toContain("MP State Athletics Academy");
    expect(academyNames).toContain("Prakash Padukone Badminton Academy (PPBA)");
    expect(academyNames).toContain("Pullela Gopichand Badminton Academy");
    expect(academyNames).toContain("Mary Kom Boxing Academy");
    expect(academyNames).toContain("Chhatrasal Stadium Wrestling Academy");
    expect(academyNames).toContain("Tata Football Academy (TFA)");
    expect(academyNames).toContain("National Cricket Academy (BCCI COE)");
  });

  it("renders the 20 academy cards properly in AcademyDirectoryPage", () => {
    const html = renderToString(<AcademyDirectoryPage />);
    expect(html).toContain("Khelo India &amp; SAI Accredited");
    expect(html).toContain("Batch 1: 20 Premier Academies");
    expect(html).toContain("Army Sports Institute (ASI) Pune");
    expect(html).toContain("Tata Archery Academy (TAA)");
    expect(html).toContain("Usha School of Athletics");
    expect(html).toContain("National Cricket Academy (BCCI COE)");
  });
});
