import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { GUIDES_CATALOG, type Guide } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, ArrowRight } from "lucide-react";
import { generateFaqs, faqsToJsonLd } from "@/lib/faq-generator";
const PAGE_SIZE = 6;

const CATEGORY_BY_SLUG: Record<string, Guide["category"]> = {
  "trial-prep": "Trial prep",
  "sports-cv": "Sports CV",
  scholarships: "Scholarships",
  nutrition: "Nutrition",
  mindset: "Mindset",
  parents: "Parents",
  recovery: "Recovery",
  tech: "Tech",
};

const searchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/top-guides/$category")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.category];
    if (!category) throw notFound();
    return { category, slug: params.category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const canonicalUrl = `https://khelgrid.com/top-guides/${loaderData.slug}`;
    return {
      meta: [
        {
          name: "robots",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        },
        { title: `Top ${loaderData.category} guides for Indian athletes · KhelGrid` },
        {
          name: "description",
          content: `The most read ${loaderData.category.toLowerCase()} guides on KhelGrid — checklists, scripts and frameworks built for Indian sport.`,
        },
        { property: "og:site_name", content: "KhelGrid" },
        { property: "og:title", content: `Top ${loaderData.category} guides` },
        {
          property: "og:description",
          content: `Hand-picked ${loaderData.category.toLowerCase()} playbooks for athletes, parents and coaches in India.`,
        },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `Top ${loaderData.category} guides · KhelGrid` },
        {
          name: "twitter:description",
          content: `Hand-picked ${loaderData.category.toLowerCase()} playbooks for athletes, parents and coaches in India.`,
        },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Category not found</h1>
      <Button asChild className="mt-6">
        <Link to="/guides">All guides</Link>
      </Button>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  ),
  component: TopGuidesCategoryPage,
});

function TopGuidesCategoryPage() {
  const { category, slug } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const all = GUIDES_CATALOG.filter((g) => g.category === category);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const faqs = generateFaqs({
    category,
    slug,
    noun: "guide",
    nounPlural: "guides",
    totalCount: all.length,
    pageItemTitles: slice.map((g) => g.title),
    page: safePage,
    totalPages,
  });
  const jsonLd = JSON.stringify(faqsToJsonLd(faqs));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link to="/guides" className="text-xs text-muted-foreground hover:text-foreground">
        ← All guides
      </Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">
        {category}
      </Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Top {category} guides</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Page {safePage} of {totalPages} · {all.length} guides curated for Indian athletes.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {slice.map((g) => (
          <Link
            key={g.slug}
            to="/guide/$slug"
            params={{ slug: g.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {g.readMins} min
              </span>
              <span>{g.category}</span>
            </div>
            <h3 className="mt-2 font-semibold group-hover:text-primary">{g.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{g.excerpt}</p>
            <span className="mt-3 inline-flex items-center text-xs text-primary">
              Read guide <ArrowRight className="ml-1 h-3 w-3" />
            </span>
          </Link>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              from={Route.fullPath}
              search={{ page: p }}
              className={`rounded-md border px-3 py-1 text-sm ${p === safePage ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Browse other categories</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(CATEGORY_BY_SLUG).map(([slug, label]) => (
            <Link
              key={slug}
              to="/top-guides/$category"
              params={{ category: slug }}
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-primary hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-lg font-semibold">
          Frequently asked questions
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Fresh questions for page {safePage} — answers below are unique to this view.
        </p>
        <Accordion
          type="single"
          collapsible
          className="mt-3 rounded-2xl border border-border bg-gradient-card px-4"
        >
          {faqs.map((f, i) => (
            <AccordionItem
              key={`${safePage}-${i}`}
              value={`faq-${i}`}
              className="border-border last:border-b-0"
            >
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      </section>
    </main>
  );
}

export const TOP_GUIDE_CATEGORY_SLUGS = Object.keys(CATEGORY_BY_SLUG);
