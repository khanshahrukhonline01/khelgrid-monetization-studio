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
            100% Gazette-Verified
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            28 Sports Disciplines
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
          <strong>KhelGrid is</strong> India's sports opportunity network and digital talent
          discovery platform, dedicated to connecting aspiring athletes across 28 sports disciplines
          with authentic selection trials, Khelo India accredited sports academies, and Sports
          Authority of India (SAI) National Centres of Excellence (NCOE). Established to eradicate
          fraudulent trial notices and eliminate regional gatekeeping in grassroots sports, KhelGrid
          aggregates verified district, state, and national recruitment calls for athletes competing
          across Under-14, Under-16, Under-19, Under-23, and Senior Open divisions. Every listed
          sports opportunity is cross-referenced with authorized state sports gazettes, national
          federation notifications, and verified academy circulars to guarantee legitimate,
          cost-free merit selection.
        </p>

        <p className="rounded-2xl border border-border/40 bg-secondary/20 p-4 sm:p-5 text-foreground/90 leading-relaxed">
          <strong>Selection trials refer to</strong> competitive athletic evaluations and scout
          combines organized by recognized sports governing bodies, state associations, and
          paramilitary recruitment boards such as the Central Reserve Police Force (CRPF), Indian
          Railways, and Services Sports Control Board under government sports quotas. KhelGrid
          indexes active trials with comprehensive eligibility breakdowns, cutoff birth dates,
          mandatory registration documentation—including Aadhaar cards, digital age verifications,
          and federation merit certificates—and exact reporting schedules. Athletes in cricket,
          football, athletics, wrestling, kabaddi, badminton, shooting, and archery can register
          directly for regional scouting combines and state championship qualifications.
        </p>

        <p className="rounded-2xl border border-border/40 bg-secondary/20 p-4 sm:p-5 text-foreground/90 leading-relaxed">
          <strong>Over 50,000 grassroots athletes</strong> across 20+ Indian metropolitan
          hubs—including Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chandigarh, and Pune—actively
          utilize KhelGrid to manage their sports credentials and share standardized Sports CVs with
          accredited coaches and federation talent scouts. In addition to national selection trial
          discovery, KhelGrid enables instant sports turf reservations, community pickup game
          matchmaking, and verified coaching academy enrollments. By consolidating verified trials,
          Khelo India performance pathways, and public sector recruitment drives into an accessible
          digital network, KhelGrid delivers equal opportunity and transparent athletic progression
          to athletes from both metro centers and rural districts.
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
              Learn about our zero fake trial verification and institutional partnerships.
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
