import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { SEO } from "@/components/seo/SEO";

export const Route = createFileRoute("/about")({
  head: () =>
    buildSeoHead({
      title: "About KhelGrid · Mission, Vision & Athlete Opportunity Network",
      description:
        "Learn about KhelGrid's mission to organize India's sports ecosystem. Discover how our editorial team verifies trials, academies, and athletic pathways.",
      canonicalPath: "/about",
      keywords:
        "about KhelGrid, sports platform India, grassroots sports, athlete scouting, sports transparency",
      type: "website",
    }),
  component: AboutPage,
});

const PRINCIPLES = [
  "Make sports opportunities easier to discover across sports and cities.",
  "Show what is known, what has been checked, and what athletes still need to confirm.",
  "Keep essential opportunity information readable before asking users to pay.",
  "Give athletes and organizers a clear way to report errors or suspicious listings.",
];

function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <SEO
        title="About KhelGrid · Mission, Vision & Athlete Opportunity Network"
        description="Learn about KhelGrid's mission to organize India's sports ecosystem. Discover how our editorial team verifies trials, academies, and athletic pathways."
        canonicalUrl="/about"
        keywords="about KhelGrid, sports platform India, grassroots sports, athlete scouting, sports transparency"
      />
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our mission</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Sports access should be easier to trust.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          KhelGrid is a sports opportunity discovery platform for athletes, parents, coaches, and
          academies in India. We organize trials, camps, tournaments, scholarships, training, and
          learning resources in one place.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-gradient-card p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">What we do</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We help people compare opportunity details, understand eligibility, find preparation
            resources, and reach the organizer&apos;s official registration channel. KhelGrid is not
            the organizer of every listed event and does not guarantee selection.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-gradient-card p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">What verified means</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A verified label means our team has recorded a source or organizer check for the
            information shown. It does not mean KhelGrid guarantees a result, endorses a payment, or
            replaces the organizer&apos;s latest notice. Always confirm dates, fees, eligibility,
            and venue details before travelling or paying.
          </p>
          <Link
            to="/trust-center"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Read our verification process →
          </Link>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="text-xl font-semibold">Brand & Knowledge Entity Profile</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Legal & Brand Identity
            </span>
            <p className="mt-1 font-bold text-foreground">KhelGrid (India)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Official URL: https://www.khelgrid.com · Slogan: India's Sports Opportunity Network
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Entity Category & Schema
            </span>
            <p className="mt-1 font-bold text-foreground">SportsOrganization / WebApplication</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Structured Schema.org Entity with verified ContactPoint and Knowledge Graph mappings.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card/50 p-6">
        <h2 className="text-xl font-semibold">Our product principles</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <li key={principle} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {principle}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Contact and corrections</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Found an incorrect date, suspicious organizer, or expired opportunity? Tell us what needs
          checking and include the listing title and official source if available. We review
          correction requests through our support channel.
        </p>
        <Link
          to="/contact"
          className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Contact KhelGrid
        </Link>
      </section>
    </main>
  );
}
