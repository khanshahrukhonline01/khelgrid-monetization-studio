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

      {/* Game, Sport & Play Across India: Popular Slang, Trials & Turf Searches */}
      <section className="border-t border-border bg-card/60 py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Game, Sport &amp; Play Across India · Popular Slang &amp; Search Directory
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connecting India&apos;s grassroots khiladis, maidans, turfs, akhadas, and national
                sports trials
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
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
                  <Link
                    to="/search"
                    search={{
                      q: "sport",
                      sport: "All Sports",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
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
              </ul>
            </div>

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
              </ul>
            </div>

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
                      q: "boxing",
                      sport: "Boxing",
                      city: "All Locations",
                      sort: "Soonest",
                      free: false,
                    }}
                    className="hover:text-primary transition"
                  >
                    SAI NCOE Boxing Selection Trials
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
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">National Trials &amp; Quotas</h4>
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
              </ul>
            </div>
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
