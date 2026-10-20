import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CITIES_CATALOG, SPORTS_CATALOG } from "@/data/catalog";
import { TRIALS } from "@/data/trials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Building2 } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { FitIndiaFAQ } from "@/components/FitIndiaFAQ";
import { KcaKanpurCricketDetails } from "@/components/KcaKanpurCricketDetails";
import { GreenParkBasketballDetails } from "@/components/GreenParkBasketballDetails";

export const Route = createFileRoute("/city/$slug")({
  loader: ({ params }) => {
    const city = CITIES_CATALOG.find((c) => c.slug === params.slug);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData, params }) => {
    const city = loaderData?.city;
    if (!city) {
      return buildSeoHead({
        title: "City Sports Hub · KhelGrid",
        description:
          "Discover verified sports selection trials, turf bookings, NIS certified coaches, and elite academies across major sporting cities in India.",
        canonicalPath: `/city/${params.slug}`,
      });
    }

    return buildSeoHead({
      title: `Sports Trials, Venues & Academies in ${city.name} · KhelGrid`,
      description: `${city.tagline}. Discover open sports trials, turf bookings, NIS certified coaches, and elite academies in ${city.name}, ${city.state}.`,
      canonicalPath: `/city/${city.slug}`,
      keywords: `sports trials in ${city.name}, turf booking ${city.name}, badminton court ${city.name}, sports coaching ${city.name}, football academy ${city.name}`,
      type: "website",
    });
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">City not found</h1>
      <Button asChild className="mt-6">
        <Link to="/cities">All cities</Link>
      </Button>
    </div>
  ),
  component: CityPage,
});

function CityPage() {
  const { city } = Route.useLoaderData();
  const matching = TRIALS.filter((t) => t.city.toLowerCase() === city.name.toLowerCase()).slice(
    0,
    6,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Link to="/cities" className="text-xs text-muted-foreground hover:text-foreground">
        ← All cities
      </Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">
        {city.state}
      </Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
        Sports trials in {city.name}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {city.tagline}. {city.venueNote}.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link
            to="/search"
            search={{ q: "", sport: "All Sports", city: city.name, sort: "Soonest", free: false }}
          >
            Browse {city.name} trials <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/book">Book a venue</Link>
        </Button>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-card/50 p-5">
        <h2 className="font-semibold">Planning sports in {city.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Use the city page to compare current listings, then confirm the exact venue and reporting
          instructions with the organizer. The hubs below are starting points for research, not a
          claim that every venue hosts trials.
        </p>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {city.hubs.map((h: string) => (
          <div key={h} className="rounded-2xl border border-border bg-gradient-card p-5 text-sm">
            <Building2 className="mb-2 h-4 w-4 text-primary" />
            {h}
          </div>
        ))}
      </section>

      {matching.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Upcoming in {city.name}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {matching.map((t) => (
              <Link
                key={t.id}
                to="/trial/$id"
                params={{ id: t.id }}
                className="rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
              >
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {t.academy} · {t.sport}
                </div>
                <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {t.date}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Fit India School Games Official FAQ for Namchi Hub */}
      {city.slug === "namchi" && (
        <section className="mt-12">
          <FitIndiaFAQ />
        </section>
      )}

      {/* Kanpur Cricket Association (KCA) Official Details for Kanpur Hub */}
      {city.slug === "kanpur" && (
        <>
          <section className="mt-12">
            <KcaKanpurCricketDetails />
          </section>
          <section className="mt-12">
            <GreenParkBasketballDetails />
          </section>
        </>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Sports active in {city.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SPORTS_CATALOG.slice(0, 12).map((s) => (
            <Link
              key={s.slug}
              to="/sport/$slug"
              params={{ slug: s.slug }}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
            >
              {s.emoji} {s.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
