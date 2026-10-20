import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { TOOLS_CATALOG, type Tool } from "@/data/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { generateFaqs, faqsToJsonLd } from "@/lib/faq-generator";
const PAGE_SIZE = 6;

const CATEGORY_BY_SLUG: Record<string, Tool["category"]> = {
  calculator: "Calculator",
  checklist: "Checklist",
  planner: "Planner",
  estimator: "Estimator",
};

const searchSchema = z.object({
  page: fallback(z.number().int().min(1), 1).default(1),
});

export const Route = createFileRoute("/best-tools/$category")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.category];
    if (!category) throw notFound();
    return { category, slug: params.category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const canonicalUrl = `https://www.khelgrid.com/best-tools/${params.category}`;
    return {
      meta: [
        {
          name: "robots",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
        },
        { title: `Best ${loaderData.category.toLowerCase()}s for athletes · KhelGrid` },
        {
          name: "description",
          content: `Free ${loaderData.category.toLowerCase()}s built for Indian athletes — trial prep, training load, scholarships and more.`,
        },
        { property: "og:site_name", content: "KhelGrid" },
        { property: "og:title", content: `Best ${loaderData.category.toLowerCase()}s on KhelGrid` },
        {
          property: "og:description",
          content: `Hand-picked ${loaderData.category.toLowerCase()}s for athletes, parents and coaches.`,
        },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `Best ${loaderData.category.toLowerCase()}s · KhelGrid` },
        {
          name: "twitter:description",
          content: `Hand-picked ${loaderData.category.toLowerCase()}s for athletes, parents and coaches.`,
        },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Category not found</h1>
      <Button asChild className="mt-6">
        <Link to="/tools">All tools</Link>
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
  component: BestToolsCategoryPage,
});

function BestToolsCategoryPage() {
  const { category, slug } = Route.useLoaderData();
  const { page } = Route.useSearch();
  const all = TOOLS_CATALOG.filter((t) => t.category === category);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = all.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const faqs = generateFaqs({
    category,
    slug,
    noun: category.toLowerCase(),
    nounPlural: `${category.toLowerCase()}s`,
    totalCount: all.length,
    pageItemTitles: slice.map((t) => t.name),
    page: safePage,
    totalPages,
  });
  const jsonLd = JSON.stringify(faqsToJsonLd(faqs));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <Link to="/tools" className="text-xs text-muted-foreground hover:text-foreground">
        ← All tools
      </Link>
      <Badge variant="outline" className="mt-3 border-primary/40 bg-primary/5 text-primary">
        {category}
      </Badge>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Best {category.toLowerCase()}s for athletes
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Page {safePage} of {totalPages} · {all.length} {category.toLowerCase()}s.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {slice.map((t) => (
          <Link
            key={t.slug}
            to="/tools/$slug"
            params={{ slug: t.slug }}
            className="group rounded-2xl border border-border bg-gradient-card p-5 transition hover:border-primary/40"
          >
            <Badge variant="secondary" className="text-[10px]">
              {t.category}
            </Badge>
            <h3 className="mt-2 font-semibold group-hover:text-primary">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
            <span className="mt-3 inline-flex items-center text-xs text-primary">
              Open tool <ArrowRight className="ml-1 h-3 w-3" />
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
        <h2 className="text-lg font-semibold">Browse other tool types</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(CATEGORY_BY_SLUG).map(([slug, label]) => (
            <Link
              key={slug}
              to="/best-tools/$category"
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

export const BEST_TOOL_CATEGORY_SLUGS = Object.keys(CATEGORY_BY_SLUG);
