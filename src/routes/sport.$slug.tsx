import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SPORTS_CATALOG, CITIES_CATALOG } from "@/data/catalog";
import { TRIALS } from "@/data/trials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Trophy, Users } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/sport/$slug")({
  loader: ({ params }) => {
    const sport = SPORTS_CATALOG.find((s) => s.slug === params.slug);
    if (!sport) throw notFound();
    return { sport };
  },
  head: ({ loaderData, params }) => {
    const sport = loaderData?.sport;
    if (!sport) {
      return buildSeoHead({
        title: "Sport Directory · KhelGrid",
        description:
          "Discover verified sports selection trials, NIS accredited coaching academies, competitions, and government sports quota recruitments across India.",
        canonicalPath: `/sport/${params.slug}`,
      });
    }

    return buildSeoHead({
      title: `${sport.name} Trials, Academies & Scholarships in India · KhelGrid`,
      description: `${sport.tagline}. Access verified ${sport.name} selection trials, NIS-certified coaches, and scholarship opportunities across Indian states.`,
      canonicalPath: `/sport/${sport.slug}`,
      keywords: `${sport.name} trials India, ${sport.name} academy, ${sport.name} selection, ${sport.name} scholarship, junior ${sport.name} tournament`,
      type: "website",
    });
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Sport not found</h1>
      <Button asChild className="mt-6">
        <Link to="/sports">All sports</Link>
      </Button>
    </div>
  ),
  component: SportPage,
});

function SportPage() {
  const { sport } = Route.useLoaderData();
  const matching = TRIALS.filter((t) => t.sport.toLowerCase() === sport.name.toLowerCase()).slice(
    0,
    6,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Link to="/sports" className="text-xs text-muted-foreground hover:text-foreground">
        ← All sports
      </Link>
      <div className="mt-3 flex items-start gap-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-hero text-3xl">
          {sport.emoji}
        </div>
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
            {sport.level} · {sport.ageBand}
          </Badge>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            {sport.name} trials in India
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{sport.tagline}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link
            to="/search"
            search={{
              q: "",
              sport: sport.name,
              city: "All Locations",
              sort: "Soonest",
              free: false,
            }}
          >
            See live {sport.name} trials <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/talent-scanner">Run AI Talent Scanner</Link>
        </Button>
      </div>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        {sport.highlights.map((h: string) => (
          <div key={h} className="rounded-2xl border border-border bg-gradient-card p-5 text-sm">
            <Trophy className="mb-2 h-4 w-4 text-primary" />
            {h}
          </div>
        ))}
      </section>

      {matching.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Upcoming {sport.name} trials</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {matching.map((t) => (
              <Link
                key={t.id}
                to="/trial/$id"
                params={{ id: t.id }}
                className="rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
              >
                <div className="text-sm font-semibold">{t.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t.academy}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {t.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {t.spots} spots
                  </span>
                  <span>{t.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{sport.name} cities & hubs</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CITIES_CATALOG.slice(0, 12).map((c) => (
            <Link
              key={c.slug}
              to="/city/$slug"
              params={{ slug: c.slug }}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:border-primary/40 hover:text-primary"
            >
              {sport.name} in {c.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
