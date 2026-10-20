import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GUIDES_CATALOG } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { GUIDE_BODIES } from "@/content/guide-bodies";
import { ArticlePage } from "@/components/ArticlePage";
import { buildSeoHead } from "@/lib/seo";
import type { ContentPage } from "@/content/types";

/** Guides with a full editorial body render as long-form articles. */
function toContentPage(guide: (typeof GUIDES_CATALOG)[number]): ContentPage | null {
  const body = GUIDE_BODIES[guide.slug];
  if (!body) return null;
  return {
    path: `/guide/${guide.slug}`,
    eyebrow: guide.category,
    title: guide.title,
    description: guide.excerpt,
    updated: "2026-02-01",
    readMins: guide.readMins,
    intro: body.intro,
    sections: body.sections,
    faqs: body.faqs,
    cta: { to: "/search", label: "Browse live trials" },
  };
}

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    const guide = GUIDES_CATALOG.find((g) => g.slug === params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData, params }) => {
    const guide = loaderData?.guide;
    if (!guide) {
      return buildSeoHead({
        title: "Athlete Guide · KhelGrid",
        description:
          "Comprehensive athlete guides covering sports trial preparation, SAI selection criteria, sports quota recruitment rules, and performance development.",
        canonicalPath: `/guide/${params.slug}`,
      });
    }

    const hasBody = Boolean(GUIDE_BODIES[guide.slug]);

    return buildSeoHead({
      title: `${guide.title} · KhelGrid Guide`,
      description: guide.excerpt,
      canonicalPath: `/guide/${guide.slug}`,
      type: "article",
      author: guide.author || "KhelGrid Sports Editorial Team",
      publishedTime: "2026-02-01T00:00:00Z",
      modifiedTime: "2026-10-15T00:00:00Z",
      keywords: `${guide.title}, ${guide.category}, athlete guide, sports trials India`,
      noindex: !hasBody,
      section: guide.category,
    });
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Guide not found</h1>
      <Button asChild className="mt-6">
        <Link to="/guides">All guides</Link>
      </Button>
    </div>
  ),
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const article = toContentPage(guide);
  if (article) return <ArticlePage page={article} />;
  const related = GUIDES_CATALOG.filter(
    (g) => g.category === guide.category && g.slug !== guide.slug,
  ).slice(0, 4);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Link to="/guides" className="text-xs text-muted-foreground hover:text-foreground">
        ← All guides
      </Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">
        {guide.category}
      </Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {guide.readMins} min read
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          {guide.author ?? "KhelGrid Sports Editorial Team"}
        </span>
      </div>
      <p className="mt-6 text-base text-muted-foreground">{guide.excerpt}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        Editorial review note: this guide is maintained as general educational information. Confirm
        time-sensitive details with the relevant official source.
      </p>
      <div className="mt-5 rounded-xl border border-border bg-card/50 p-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">KhelGrid editorial note:</strong>{" "}
        {guide.sourceNote ??
          "This guide is general educational information; confirm rules, fees, eligibility, and performance standards with the relevant federation, organizer, coach, or official notice."}{" "}
        It is not medical, legal, or selection advice.
      </div>

      <ol className="mt-8 space-y-3">
        {guide.steps.map((s: string, i: number) => (
          <li
            key={s}
            className="flex items-start gap-3 rounded-2xl border border-border bg-gradient-card p-4"
          >
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {i + 1}
            </div>
            <span className="text-sm">{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" /> Ready to act on this?
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Find a live trial that fits this plan and apply in two taps.
        </p>
        <Button asChild className="mt-4 bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link
            to="/search"
            search={{
              q: "",
              sport: "All Sports",
              city: "All Locations",
              sort: "Soonest",
              free: false,
            }}
          >
            Browse live trials
          </Link>
        </Button>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">More on {guide.category}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/guide/$slug"
                params={{ slug: r.slug }}
                className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40"
              >
                <div className="text-sm font-semibold">{r.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.excerpt}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
