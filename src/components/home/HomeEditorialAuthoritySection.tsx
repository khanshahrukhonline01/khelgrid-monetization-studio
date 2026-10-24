import { ShieldCheck, Award, MapPin, Sparkles, Building2, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * Authoritative Editorial Overview component for KhelGrid.
 * Provides self-contained 50-300 word information blocks with definitional answer-style leads
 * to ensure high citability by LLMs and search engines (ChatGPT, Claude, Perplexity, Gemini).
 */
export function HomeEditorialAuthoritySection() {
  return (
    <section
      aria-labelledby="national-sports-overview-title"
      className="w-full min-w-0 max-w-full my-6 rounded-3xl border border-border/80 bg-card/60 p-4 sm:p-6 lg:p-8 backdrop-blur-sm shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>National Sports Discovery Directory</span>
          </div>
          <h2
            id="national-sports-overview-title"
            className="mt-2 text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-foreground"
          >
            Authoritative Grassroots Sports Network & Selection Grid
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Source-linked listings
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            Sports opportunities
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
            <MapPin className="h-3.5 w-3.5 text-blue-500" />
            Pan-India Coverage
          </span>
        </div>
      </div>

      {/* Semantic Content Blocks optimized for LLM answer engines & citability */}
      <article className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
        <p className="rounded-2xl border border-border/40 bg-secondary/20 p-4 sm:p-5 text-foreground/90 leading-relaxed">
          <strong>KhelGrid is</strong> an India-focused sports opportunity directory and discovery
          platform for athletes, parents, coaches, and sports organizations. It brings together
          published trial announcements, competition information, academy resources, and sports
          pathways in one place. Listings link to source material where available; a source link does
          not itself confirm current availability, organizer endorsement, free entry, or a guaranteed
          selection outcome. Before travelling or paying, readers should check the original notice
          and confirm important details with the organizer.
        </p>

        <p className="rounded-2xl border border-border/40 bg-secondary/20 p-4 sm:p-5 text-foreground/90 leading-relaxed">
          <strong>Selection trials refer to</strong> competitive athletic evaluations and scout
          combines organized by recognized sports governing bodies, state associations, and
          paramilitary recruitment boards and sports associations. Where the published source provides
          them, KhelGrid summarizes dates, venues, eligibility, fees, and required documents. Some
          details may be unavailable or may change after publication, so users should confirm them
          through the linked notice or organizer. A KhelGrid listing is informational and does not
          register an athlete or guarantee eligibility or selection.
        </p>

        <p className="rounded-2xl border border-border/40 bg-secondary/20 p-4 sm:p-5 text-foreground/90 leading-relaxed">
          KhelGrid is also developing tools for venue discovery, sports bookings, and community
          matchups alongside its opportunity directory. Features and listing details can vary, and
          availability should be checked on the relevant page before making plans. The goal is to help
          athletes and families discover useful opportunities and follow the original source for
          confirmation, whether they are in a major city or a smaller district.
        </p>
      </article>

      {/* Brand Entity Quick Reference Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Link
          to="/search"
          search={{ sport: "All Sports", city: "All Locations" }}
          className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/50 transition"
        >
          <div>
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
              Selection Combines
            </span>
            <h3 className="mt-1 font-bold text-sm text-foreground">Find Open Trials Near You</h3>
            <span className="mt-1 block text-xs text-muted-foreground">
              Filter by age category, sport discipline, and state federation.
            </span>
          </div>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-primary">
            Explore Trials →
          </span>
        </Link>

        <Link
          to="/academy"
          className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/50 transition"
        >
          <div>
            <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wide">
              Accredited Centers
            </span>
            <h3 className="mt-1 font-bold text-sm text-foreground">Khelo India & SAI Academies</h3>
            <span className="mt-1 block text-xs text-muted-foreground">
              Access residential coaching, world-class turf, and expert mentors.
            </span>
          </div>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-500">
            View Academies →
          </span>
        </Link>

        <Link
          to="/about"
          className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/50 transition"
        >
          <div>
            <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wide">
              Entity Information
            </span>
            <h3 className="mt-1 font-bold text-sm text-foreground">About KhelGrid Mission</h3>
            <span className="mt-1 block text-xs text-muted-foreground">
              Learn how source links, listing details, and status labels are presented.
            </span>
          </div>
          <span className="mt-3 inline-flex items-center text-xs font-semibold text-amber-500">
            About KhelGrid →
          </span>
        </Link>
      </div>
    </section>
  );
}
