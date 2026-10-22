import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Youtube,
  Twitter,
  Mail,
  MapPin,
  ShieldCheck,
  Zap,
  Trophy,
  Search,
  Sparkles,
  Copyright,
  Scale,
  Clock,
} from "lucide-react";
import { CookieSettingsButton } from "@/components/ads";
import { NAV_ITEMS } from "@/config/nav";

/** Pain → cure strip. This is the "painkiller" positioning, not a nice-to-have. */
const PAIN_POINTS = [
  {
    icon: Search,
    pain: "Trials are hidden in WhatsApp groups",
    cure: "Every verified trial in one searchable grid",
  },
  {
    icon: ShieldCheck,
    pain: "Fake selectors & pay-to-play scams",
    cure: "Academy verification before a listing goes live",
  },
  {
    icon: Trophy,
    pain: "No proof of your performance",
    cure: "Verified Sports CV scouts actually trust",
  },
  {
    icon: Sparkles,
    pain: "Nobody tells you the next step",
    cure: "Start From Zero roadmaps + AI Guide, sport by sport",
  },
];

function pick(paths: string[]) {
  return paths
    .map((p) => NAV_ITEMS.find((i) => i.to === p))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
}

const COLUMNS: Array<{ title: string; items: ReturnType<typeof pick> }> = [
  {
    title: "Compete",
    items: pick([
      "/search",
      "/calendar",
      "/trials",
      "/opportunities",
      "/events",
      "/verify",
      "/talent-scanner",
      "/scout-portal",
    ]),
  },
  {
    title: "Play & train",
    items: pick(["/play", "/book", "/train", "/coaches", "/memberships", "/events"]),
  },
  {
    title: "Learn",
    items: pick([
      "/start-from-zero",
      "/ai-guide",
      "/guides",
      "/chronicle",
      "/blog",
      "/learning-hub",
      "/tools",
      "/resources",
    ]),
  },
  {
    title: "Grow",
    items: pick([
      "/academy",
      "/partner",
      "/list-venue",
      "/careers",
      "/pricing",
      "/community",
      "/cities",
      "/mobile-app",
      "/dashboard",
    ]),
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/khelgrid?igsh=YmZmeHI1M2hyMHMw",
    icon: Instagram,
  },
  { label: "YouTube", href: "https://www.youtube.com/@khelgrid", icon: Youtube },
  { label: "X", href: "https://x.com/Khelgrid", icon: Twitter },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      {/* Painkiller strip */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h2 className="font-heading text-lg font-semibold md:text-xl">
            Your talent isn&apos;t the problem. Access is.
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            KhelGrid kills the four things that quietly end Indian sporting careers — share it with
            the one player who deserves to be seen.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAIN_POINTS.map(({ icon: Icon, pain, cure }) => (
              <li key={pain} className="rounded-2xl border border-border bg-background/60 p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground line-through">
                  {pain}
                </p>
                <p className="mt-1 text-sm font-semibold">{cure}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Game, Sport & Play Across India Directory */}
      <section className="border-t border-border bg-card/60 py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Game, Sport &amp; Play Across India
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-bold text-primary">
                  54+ Verified Directories
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connecting India&apos;s grassroots khiladis, maidans, turfs, akhadas, and national
                sports trials
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 text-xs">
            {/* 1. Essentials */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Game, Sport &amp; Play Essentials
              </h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "game",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Game &amp; Match Finder
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Sport Academies &amp; Selections
                  </Link>
                </li>
                <li>
                  <Link to="/play" className="hover:text-primary transition">
                    Play Pickup Matches &amp; Box Games
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "khiladi",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Khiladi (खिलाड़ी) Talent Directory
                  </Link>
                </li>
                <li>
                  <Link to="/sports" className="hover:text-primary transition">
                    Desi Khel &amp; Olympic Disciplines
                  </Link>
                </li>
                <li>
                  <Link to="/start-from-zero" className="hover:text-primary transition">
                    Grassroots Athlete Passport
                  </Link>
                </li>
                <li>
                  <Link to="/start-from-zero" className="hover:text-primary transition">
                    Verified Sports CV Maker
                  </Link>
                </li>
                <li>
                  <Link to="/learning-hub" className="hover:text-primary transition">
                    AI Training Drills &amp; Playbook
                  </Link>
                </li>
                <li>
                  <Link to="/talent-scanner" className="hover:text-primary transition">
                    Talent Scanner Fitness Tests
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2. Maidan, Turf & Box Cricket */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Maidan, Turf &amp; Net Practice
              </h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Book Turf Near Me (मैदान)
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Box Cricket Turf &amp; Nets
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Badminton Court Hourly Booking
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Futsal Arenas &amp; 5v5 Pitches
                  </Link>
                </li>
                <li>
                  <Link to="/play" className="hover:text-primary transition">
                    Gully Cricket &amp; Community Games
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Swimming Pool Hourly Passes
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Tennis Clay &amp; Synthetic Courts
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Basketball Wooden Sprung Courts
                  </Link>
                </li>
                <li>
                  <Link to="/book" className="hover:text-primary transition">
                    Table Tennis Arenas &amp; Clubs
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Akhada, Dangal & Combat */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Akhada, Dangal &amp; Combat</h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "akhada",
                      sport: "Wrestling",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Akhada (अखाड़ा) &amp; Wrestling Camps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "dangal",
                      sport: "Wrestling",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Dangal (दंगल) &amp; Kusti Combines
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "kabaddi",
                      sport: "Kabaddi",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Kabaddi Panga &amp; Raid Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "kho-kho",
                      sport: "Kho-Kho",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Kho-Kho Junior National Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "mitti",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Mitti Ka Khel Traditional Combines
                  </Link>
                </li>
                <li>
                  <Link to="/sports" className="hover:text-primary transition">
                    Mallakhamb &amp; Indigenous Sports
                  </Link>
                </li>
                <li>
                  <Link to="/sport/wushu" className="hover:text-primary transition">
                    Wushu Sanda &amp; Taolu Combines
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "karate",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Judo &amp; Karate State Selections
                  </Link>
                </li>
                <li>
                  <Link to="/sport/boxing" className="hover:text-primary transition">
                    Boxing Rings &amp; Bhiwani Sparring
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. National Trials & SAI NCOE */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">National Trials &amp; SAI NCOE</h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "SAI",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Sports Authority of India (SAI) Trials
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    SAI National Centres of Excellence
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Khelo India State Centres (KISCE)
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Army Sports Institute (ASI Pune)
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Tata Archery &amp; Football Academies
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Gopichand Badminton Academy
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Inspire Institute of Sport (IIS Bellary)
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Usha School of Athletics Kerala
                  </Link>
                </li>
                <li>
                  <Link to="/academy" className="hover:text-primary transition">
                    Chhatrasal Stadium Wrestling Combine
                  </Link>
                </li>
              </ul>
            </div>

            {/* 5. Government Sports Quotas */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Govt Sports Quota Recruitment</h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "quota",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Government Sports Quota Recruitment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "CRPF",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    CRPF Meritorious Sportspersons 2026
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "railways",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Indian Railways Sports Quota Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "police",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    State Police Sports Quota Entry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "army",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Armed Forces Sports Quota Enrolment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "sports quota",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Bank &amp; PSU Sports Quota Vacancies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "cisf",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    CISF &amp; ITBP Sports Selections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "constable",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    State Police Head Constable Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "university",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Universities Sports Quota AIU Meets
                  </Link>
                </li>
              </ul>
            </div>

            {/* 6. Age Categories & Leagues */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Age Categories &amp; Leagues</h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "Ranji",
                      sport: "Cricket",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    BCCI Ranji Trophy Cricket Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "Khel Maharan",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Khel Maharan 3.0 Assam Registrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "",
                      sport: "All Sports",
                      city: "All Locations",
                      category: "U-14 / Sub-Junior",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Under-14 Sub-Junior Selection Camps
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "",
                      sport: "Cricket",
                      city: "All Locations",
                      category: "U-16 / Junior",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Under-16 Junior State Cricket Trials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "",
                      sport: "All Sports",
                      city: "All Locations",
                      category: "U-19 / Youth",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Under-19 Youth National Championship
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "",
                      sport: "All Sports",
                      city: "All Locations",
                      category: "U-23 / Emerging",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Under-23 Emerging Athlete Combines
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    search={{
                      q: "",
                      sport: "All Sports",
                      city: "All Locations",
                      category: "Senior Open",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    Senior Open Sports Competitions
                  </Link>
                </li>
                <li>
                  <Link to="/sport/football" className="hover:text-primary transition">
                    ISL &amp; I-League Football Youth Trials
                  </Link>
                </li>
                <li>
                  <Link to="/sport/kabaddi" className="hover:text-primary transition">
                    Pro Kabaddi Grassroots Talent Hunt
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Top Sports Complexes in Cities */}
      <section className="border-t border-border bg-background py-9">
        <div className="mx-auto max-w-7xl space-y-5 px-4 md:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-foreground sm:text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Top Sports Complexes in Cities
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Explore major stadiums, sports centres and training hubs across India. Check venue
                access, current facilities and booking or event requirements before visiting.
              </p>
            </div>
            <Link to="/cities" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Explore all cities <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { city: "Delhi", slug: "delhi", state: "Delhi NCR", venues: ["Jawaharlal Nehru Stadium", "Thyagaraj Stadium", "SAI Karni Singh Shooting Range"] },
              { city: "Mumbai", slug: "mumbai", state: "Maharashtra", venues: ["Wankhede Stadium", "MCA-BKC Ground", "Cooperage Football Ground"] },
              { city: "Bengaluru", slug: "bengaluru", state: "Karnataka", venues: ["Sree Kanteerava Stadium", "M. Chinnaswamy Stadium", "Kanteerava Aquatic Centre"] },
              { city: "Hyderabad", slug: "hyderabad", state: "Telangana", venues: ["Gachibowli Stadium", "GMC Balayogi Stadium", "Rajiv Gandhi International Cricket Stadium"] },
              { city: "Pune", slug: "pune", state: "Maharashtra", venues: ["Shree Shiv Chhatrapati Sports Complex", "MCA Stadium, Gahunje", "Deccan Gymkhana"] },
              { city: "Kolkata", slug: "kolkata", state: "West Bengal", venues: ["Salt Lake Stadium", "Eden Gardens", "Mohun Bagan Ground"] },
              { city: "Chennai", slug: "chennai", state: "Tamil Nadu", venues: ["Jawaharlal Nehru Stadium", "M. A. Chidambaram Stadium", "SDAT Tennis Stadium"] },
              { city: "Bhubaneswar", slug: "bhubaneswar", state: "Odisha", venues: ["Kalinga Stadium", "Kalinga Hockey Stadium", "Biju Patnaik Swimming Pool"] },
            ].map((entry) => (
              <article key={entry.slug} className="group rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-heading text-sm font-bold text-foreground">{entry.city}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{entry.state}</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Trophy className="h-4 w-4" />
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {entry.venues.map((venue) => (
                    <li key={venue} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                      <span>{venue}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/city/${entry.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  Explore {entry.city} sports hubs <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Venue names are discovery starting points, not a confirmation of current availability,
            public entry, or booking status. Please verify details with the venue or official organiser.
          </p>
        </div>
      </section>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="font-heading text-xl font-extrabold text-gradient">
              KhelGrid
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              India&apos;s grid for sports trials, venues, coaching and verified athlete profiles.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> India · 16 cities in the current grid
            </p>
            <a
              href="mailto:khelgrid@gmail.com"
              className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0" /> khelgrid@gmail.com
            </a>

            <Link
              to="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Zap className="h-4 w-4" /> Go Pro — ₹499/mo
            </Link>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-heading text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* KhelGrid Product Bar — immediately above the IPR notice */}
      <section aria-label="KhelGrid products" className="border-t border-border bg-background py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-heading text-sm font-bold text-foreground">Explore KhelGrid Products</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Tools to help athletes build, train, discover and get noticed.</p>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Made for Indian sport</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <Link to="/start-from-zero" className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Trophy className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">Sports CV</span><span className="block text-[10px] text-muted-foreground">Show your journey</span></span>
            </Link>
            <Link to="/talent-scanner" className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Search className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">Talent Scanner</span><span className="block text-[10px] text-muted-foreground">Track performance</span></span>
            </Link>
            <Link to="/search" search={{ q: "", sport: "All Sports", city: "All Locations", sort: "Soonest", free: false }} className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Search className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">Find Trials</span><span className="block text-[10px] text-muted-foreground">Discover opportunities</span></span>
            </Link>
            <Link to="/ai-guide" className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">AI Sports Guide</span><span className="block text-[10px] text-muted-foreground">Plan your next step</span></span>
            </Link>
            <Link to="/book" className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><MapPin className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">Book Venues</span><span className="block text-[10px] text-muted-foreground">Find places to play</span></span>
            </Link>
            <Link to="/play" className="group flex min-w-0 items-center gap-2 rounded-xl border border-border bg-card/70 p-3 transition hover:border-primary/50 hover:bg-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Zap className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold text-foreground group-hover:text-primary">Play & Match</span><span className="block text-[10px] text-muted-foreground">Find local games</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* IPR, AI & Copyright Footbar Strip (Ultra-Compact) */}
      <section className="border-t border-border bg-muted/15 py-3">
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 text-xs md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Copyright className="h-3.5 w-3.5 text-primary shrink-0" />
              IPR, AI & Copyright Notice:
            </span>
            <span className="text-[11px] text-muted-foreground">
              Protected under Indian Copyright Act 1957. Purely autonomous AI outputs lack natural
              authorship; creative arrangements & Sports CV layouts are proprietary. Unauthorized AI
              deepfakes, athlete likeness theft & automated scraping for LLM training are strictly
              prohibited.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
            <Link
              to="/ipr-policy"
              className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:border-primary/50 hover:bg-card"
            >
              <Scale className="h-3 w-3 text-primary" />
              IPR & AI Policy
            </Link>
            <a
              href="mailto:ipr@khelgrid.com?subject=IPR%2FAI%20Takedown%20Notice&body=Attention%20Nodal%20IPR%20Officer%2C%0A%0AWork%2FAI%20Content%20URL%3A%0AInfringement%2FLikeness%20Issue%3A"
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <Mail className="h-3 w-3" />
              ipr@khelgrid.com
            </a>
          </div>
        </div>
      </section>

      {/* Legal bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {year} KhelGrid. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/ipr-policy" className="font-semibold text-primary hover:underline">
              IPR & Copyright
            </Link>
            <Link to="/cancellation-policy" className="hover:text-foreground">
              Cancellation
            </Link>
            <Link to="/posh-policy" className="hover:text-foreground">
              POSH Policy
            </Link>
            <Link to="/editorial-policy" className="hover:text-foreground">
              Editorial
            </Link>
            <Link to="/verification-policy" className="hover:text-foreground">
              Verification
            </Link>
            <Link to="/correction-policy" className="hover:text-foreground">
              Corrections
            </Link>

            <a href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </a>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
