import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { buildSeoHead } from "@/lib/seo";
import { DistrictSportsInfrastructure } from "@/components/infrastructure/DistrictSportsInfrastructure";

const searchSchema = z.object({
  district: fallback(z.string(), "Lucknow").default("Lucknow"),
});

export const Route = createFileRoute("/district-infrastructure")({
  validateSearch: zodValidator(searchSchema),
  head: () =>
    buildSeoHead({
      title: "District-wise Sports Infrastructure (Uttar Pradesh) · Khel Sathi Portal | KhelGrid",
      description:
        "Official district-wise sports infrastructure across all 75+ districts of Uttar Pradesh from the Khel Sathi portal. Discover government stadiums, swimming pools, synthetic tracks, and hostels in Lucknow, Agra, Varanasi, Meerut, and Kanpur.",
      canonicalPath: "/district-infrastructure",
      keywords:
        "khel sathi portal, district-wise sports infrastructure uttar pradesh, kd singh babu stadium, eklavya stadium agra, chowk stadium lucknow, sports infrastructure up, green park kanpur, sports stadiums in up, swimming pool up sports, sports directorate lucknow",
      type: "website",
      customSchema: {
        "@type": "GovernmentOrganization",
        name: "Department of Sports, Government of Uttar Pradesh (Khel Sathi Portal)",
        url: "https://khelsathi.in",
        department: {
          "@type": "SportsOrganization",
          name: "Uttar Pradesh Sports Directorate",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lucknow",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        },
      },
    }),
  component: DistrictInfrastructurePage,
});

function DistrictInfrastructurePage() {
  const { district } = Route.useSearch();

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <DistrictSportsInfrastructure initialDistrict={district || "Lucknow"} />
    </main>
  );
}

export default DistrictInfrastructurePage;
