import type { EnrichedGame } from "./types";

interface PlaySEOProps {
  games: EnrichedGame[];
}

export function PlaySEO({ games }: PlaySEOProps) {
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

  const sportsEventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Amateur Pickup Games and Sports Match Slots in India",
    description:
      "Directory of casual pickup football matches, badminton games, box cricket slots, and pickleball runs across Indian cities.",
    numberOfItems: games.length,
    itemListElement: games.slice(0, 10).map((g, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SportsEvent",
        name: `${g.sport} Pickup Match at ${g.venue}`,
        description:
          g.description ||
          `Casual ${g.skillLevel.toLowerCase()} ${g.sport} pickup game hosted by ${g.host} at ${g.venue}, ${g.city}.`,
        startDate: `${g.date} ${g.time}`,
        location: {
          "@type": "Place",
          name: g.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: g.city,
            addressCountry: "IN",
          },
        },
        offers: {
          "@type": "Offer",
          price: String(g.costPerPlayer),
          priceCurrency: "INR",
          availability:
            g.joined >= g.capacity ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        },
        organizer: {
          "@type": "Person",
          name: g.host,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventsSchema) }}
      />
    </>
  );
}
