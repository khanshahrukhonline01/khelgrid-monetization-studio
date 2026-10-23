import { useMemo, useState, lazy, Suspense } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  HelpCircle,
  ListFilter,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useParams, createFileRoute } from "@tanstack/react-router";
import { InArticleAd } from "@/components/ads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/context/BlogContext";
import { BLOG_POSTS } from "@/data/blog";
import { buildSeoHead } from "@/lib/seo";
import { MatchStatsCard } from "@/components/blog/MatchStatsCard";

// Non-critical analytical widgets lazy loaded to improve FCP/LCP
const MatchAnalysisFeedbackForm = lazy(() =>
  import("@/components/blog/MatchAnalysisFeedbackForm").then((m) => ({
    default: m.MatchAnalysisFeedbackForm,
  })),
);
const MatchStatisticsCharts = lazy(() =>
  import("@/components/blog/MatchStatisticsCharts").then((m) => ({
    default: m.MatchStatisticsCharts,
  })),
);
const IndiaJapanSocialFeed = lazy(() =>
  import("@/components/blog/IndiaJapanSocialFeed").then((m) => ({
    default: m.IndiaJapanSocialFeed,
  })),
);
const AsianGamesAnalytics = lazy(() =>
  import("@/components/blog/AsianGamesAnalytics").then((m) => ({
    default: m.AsianGamesAnalytics,
  })),
);
const MatchOutcomePredictor = lazy(() =>
  import("@/components/blog/MatchOutcomePredictor").then((m) => ({
    default: m.MatchOutcomePredictor,
  })),
);
const AnalyticNewsletterForm = lazy(() =>
  import("@/components/blog/AnalyticNewsletterForm").then((m) => ({
    default: m.AnalyticNewsletterForm,
  })),
);

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    return { post, slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title =
      post?.metaTitle ||
      (post
        ? `${post.title} · KhelGrid Sports Blog`
        : "Sports Training & Career Advice · KhelGrid Blog");
    const description =
      post?.metaDescription ||
      post?.excerpt ||
      "Original sports training tips, trial preparation checklists, recovery guidance and athlete development advice.";

    const customSchema: Array<Record<string, unknown>> = [];

    if (post?.faqs && post.faqs.length > 0) {
      customSchema.push({
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    // Match-analysis cards may contain editorial/statistical data rather than a
    // verified scheduled event. Do not emit SportsEvent markup without a trusted
    // ISO 8601 start date and a real event record.

    return buildSeoHead({
      title,
      description,
      canonicalPath: `/blog/${params.slug}`,
      type: "article",
      image: post?.coverImage,
      author: post?.author || "KhelGrid Editorial Team",
      publishedTime: post?.publishedAt ? `${post.publishedAt}T00:00:00Z` : undefined,
      modifiedTime: post?.updatedAt ? `${post.updatedAt}T00:00:00Z` : undefined,
      section: post?.category,
      keywords: post?.keywords,
      customSchema: customSchema.length > 0 ? customSchema : undefined,
    });
  },
  component: BlogArticle,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function slugifySection(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/^\d+[.\s]*/, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

function BlogArticle() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { posts } = useBlog();
  const post = posts.find((item) => item.slug === slug);
  const [activeAnalyticsHub, setActiveAnalyticsHub] = useState<"asiad" | "cricket" | "predictor">(
    slug === "asian-games-2026-live-updates-september-23-india-medal-tally-analysis"
      ? "asiad"
      : slug === "india-vs-japan-cricket-match-tactical-analysis"
        ? "cricket"
        : "predictor",
  );

  const wordCount = useMemo(() => {
    if (!post) return 0;
    let count = (post.excerpt || "").split(/\s+/).filter(Boolean).length;
    post.sections.forEach((sec) => {
      count += sec.heading.split(/\s+/).filter(Boolean).length;
      sec.paragraphs.forEach((p) => {
        count += p.split(/\s+/).filter(Boolean).length;
      });
      if (sec.bullets) {
        sec.bullets.forEach((b) => {
          count += b.split(/\s+/).filter(Boolean).length;
        });
      }
    });
    return count;
  }, [post]);

  if (!post) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This article may have been removed or the link may be out of date.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/blog">Back to blog</Link>
        </Button>
      </main>
    );
  }

  const related = posts
    .filter((item) => item.category === post.category && item.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            {post.category}
          </Badge>
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {post.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{post.author}</span>
          <span>{post.authorRole}</span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Updated {formatDate(post.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readMins} min read ({wordCount} words)
          </span>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-border bg-secondary aspect-[16/9] sm:aspect-[21/9]">
        <img
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={630}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <div className="rounded-2xl border border-border bg-card/50 p-4 text-sm leading-relaxed text-muted-foreground sm:p-5">
            <strong className="text-foreground">KhelGrid editorial note:</strong> This article is
            original general educational information. Training, nutrition, recovery and career
            decisions should be adapted with a qualified coach or healthcare professional. Confirm
            current selection rules, fees and deadlines with the relevant official organizer.
          </div>

          {/* Optional Match Scorecard / Stats */}
          {post.matchStats && <MatchStatsCard stats={post.matchStats} />}

          <div className="mt-8 space-y-9">
            {post.sections.map((section, index) => {
              const sectionId = slugifySection(section.heading);
              return (
                <section key={section.heading} id={sectionId} className="scroll-mt-24">
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2 rounded-xl border border-border bg-gradient-card p-4 text-sm leading-relaxed">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {index === 1 && (
                    <InArticleAd adSlot="guideInline" minHeight={160} className="mt-8" />
                  )}
                </section>
              );
            })}
          </div>

          {/* High-Performance Analytics Hub: Live Wire Data (Real-time telemetry and match analysis) */}
          <section
            id="high-performance-analytics-hub"
            aria-labelledby="analytics-hub-heading"
            className="mt-12 space-y-6 rounded-2xl border border-primary/25 bg-gradient-to-b from-card/90 via-card/70 to-background p-5 sm:p-7 shadow-xs"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-primary font-semibold"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" /> High-Performance Analytics Hub
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Live Wire Data
                  </span>
                </div>
                <h3
                  id="analytics-hub-heading"
                  className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
                >
                  {activeAnalyticsHub === "asiad"
                    ? "Asian Games 2026: Live Medal Tally & Discipline Breakdown"
                    : activeAnalyticsHub === "predictor"
                      ? "Match Outcome Predictor: Dynamic Win Probability Engine"
                      : "Match Intelligence: Recharts Analytics & Tactical Breakdown"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {activeAnalyticsHub === "asiad"
                    ? "Real-time medal tallies, shotgun skeet hit rates, and discipline leaderboards."
                    : activeAnalyticsHub === "predictor"
                      ? "Dynamic win probability forecasting computed from current run rates (CRR vs RRR), wickets in hand, and historical win rates."
                      : "Real-time tactical wire featuring bowling economy rates, run rate progression, and community match buzz."}
                </p>
              </div>

              {/* Hub View Switcher */}
              <div className="flex items-center overflow-x-auto max-w-full rounded-full border border-border bg-background p-1 text-xs no-scrollbar shrink-0 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("asiad")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "asiad"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Asian Games 2026
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("cricket")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "cricket"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Match Charts & Buzz
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalyticsHub("predictor")}
                  className={`shrink-0 rounded-full px-3 py-1 font-medium transition-colors cursor-pointer ${
                    activeAnalyticsHub === "predictor"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Outcome Predictor
                </button>
              </div>
            </div>

            {/* Active Analytics Tool */}
            <div className="pt-1">
              <Suspense
                fallback={<div className="h-64 w-full rounded-xl bg-muted/30 animate-pulse" />}
              >
                {activeAnalyticsHub === "asiad" ? (
                  <AsianGamesAnalytics />
                ) : activeAnalyticsHub === "predictor" ? (
                  <MatchOutcomePredictor />
                ) : (
                  <div className="space-y-6">
                    <MatchStatisticsCharts />
                    <IndiaJapanSocialFeed />
                  </div>
                )}
              </Suspense>
            </div>
          </section>

          {/* FAQs section if present */}
          {post.faqs && post.faqs.length > 0 && (
            <section
              id="frequently-asked-questions"
              aria-labelledby="faq-heading"
              className="mt-12 rounded-2xl border border-border/80 bg-secondary/30 p-5 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 id="faq-heading" className="text-xl font-bold tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="mt-5 space-y-4">
                {post.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-border bg-card/60 p-4 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Monetization & Scouting Intelligence Newsletter Subscription Lead Capture */}
          <Suspense
            fallback={<div className="h-32 w-full rounded-2xl bg-muted/30 animate-pulse" />}
          >
            <AnalyticNewsletterForm
              postSlug={post.slug}
              postTitle={post.title}
              postCategory={post.category}
            />
          </Suspense>

          {/* Interactive SEO-Optimized Discussion & Feedback Form */}
          <Suspense
            fallback={<div className="h-48 w-full rounded-2xl bg-muted/30 animate-pulse" />}
          >
            <MatchAnalysisFeedbackForm
              postSlug={post.slug}
              postTitle={post.title}
              readMins={post.readMins}
              wordCount={wordCount}
              metaTitle={post.metaTitle}
              metaDescription={post.metaDescription}
              keywords={post.keywords}
            />
          </Suspense>

          <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <h2 className="font-semibold">Turn the tactical advice into action</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Save key insights from this match analysis, review bowling drills with your coach, and
              apply pace adaptation exercises to your weekly nets routine.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full bg-gradient-hero text-primary-foreground hover:opacity-95"
              >
                <Link to="/blog">
                  <PenLine className="mr-2 h-4 w-4" />
                  Read more articles
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/guides">Explore Cricket Guides</Link>
              </Button>
            </div>
          </div>
        </article>

        <aside className="self-start lg:sticky lg:top-24 space-y-6">
          {/* Table of Contents */}
          <div className="rounded-2xl border border-border bg-gradient-card p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <ListFilter className="h-3.5 w-3.5" /> Table of Contents
            </div>
            <nav className="mt-3 space-y-2 text-xs">
              {post.matchStats && (
                <a
                  href="#match-scorecard-summary"
                  className="block text-muted-foreground hover:text-primary transition-colors truncate"
                >
                  • Match Scorecard Summary
                </a>
              )}
              {post.sections.map((section, idx) => {
                const sectionId = slugifySection(section.heading);
                return (
                  <a
                    key={section.heading}
                    href={`#${sectionId}`}
                    className="block text-muted-foreground hover:text-primary transition-colors truncate"
                  >
                    • {idx + 1}. {section.heading.replace(/^\d+[.\s]*/, "").slice(0, 30)}…
                  </a>
                );
              })}
              <a
                href="#high-performance-analytics-hub"
                className="block font-medium text-primary hover:underline transition-colors truncate"
              >
                • High-Performance Analytics Hub (Live Wire Data)
              </a>
              {post.faqs && post.faqs.length > 0 && (
                <a
                  href="#frequently-asked-questions"
                  className="block text-muted-foreground hover:text-primary transition-colors truncate"
                >
                  • Frequently Asked Questions
                </a>
              )}
              <a
                href="#scouting-analytics-newsletter"
                className="block font-medium text-primary hover:underline transition-colors truncate"
              >
                • VIP Scouting & Monetization Wire
              </a>
              <a
                href="#match-analysis-feedback-section"
                className="block text-muted-foreground hover:text-primary transition-colors truncate"
              >
                • Reader Discussion & Review
              </a>
            </nav>
          </div>

          {/* Author Card */}
          <div className="rounded-2xl border border-border bg-gradient-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              About the author
            </p>
            <p className="mt-3 font-semibold">{post.author}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {post.authorRole}. We publish practical explanations, match technical reviews, and
              grassroots player pathways.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Fact-checked editorial</span>
            </div>
            <Link
              to="/editorial-policy"
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Read our editorial policy →
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl border-t border-border/60 pt-8">
          <h2 className="text-xl font-bold tracking-tight">
            More {post.category.toLowerCase()} articles
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/blog/$slug"
                params={{ slug: item.slug }}
                className="rounded-2xl border border-border bg-gradient-card p-4 transition hover:border-primary/40"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {item.category}
                </div>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
