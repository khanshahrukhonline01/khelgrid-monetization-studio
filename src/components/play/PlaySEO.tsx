/**
 * Structured data for the Play page.
 *
 * Only emit the breadcrumb schema here. The currently displayed pickup games
 * come from illustrative seed data with non-date-specific dates (for example,
 * "Tue, Jun 10") and are not backed by verified, current event records.
 * Emitting SportsEvent/Offer markup for those entries can mislead search engines.
 *
 * Add SportsEvent markup back when Play uses real, date-valid event records and
 * the offer's actual validity start can be supplied.
 */
export function PlaySEO() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.khelgrid.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Play & Casual Games",
        item: "https://www.khelgrid.com/play",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
