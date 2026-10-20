import { Link } from "@tanstack/react-router";
import { Building2, CheckCircle2, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useTouchScroll } from "@/hooks/use-touch-scroll";
import { getAcademyCardImage } from "@/data/card-images";

export interface VerifiedAcademy {
  id: string;
  name: string;
  location: string;
  city: string;
  sports: string;
  badge: string;
  established: string;
  scoutStatus: string;
  trialFilterQuery: string;
}

export const VERIFIED_ACADEMIES_CATALOG: readonly VerifiedAcademy[] = [
  {
    id: "iis-vijayanagar",
    name: "Inspire Institute of Sport (IIS)",
    location: "Vijayanagar, Karnataka",
    city: "Vijayanagar",
    sports: "Athletics, Boxing, Wrestling, Judo",
    badge: "Olympic Training Center",
    established: "Est. 2017",
    scoutStatus: "Direct Scout Scouting",
    trialFilterQuery: "Wrestling",
  },
  {
    id: "tata-football-academy",
    name: "Tata Football Academy (TFA)",
    location: "Jamshedpur, Jharkhand",
    city: "Jamshedpur",
    sports: "Football",
    badge: "Elite Youth Academy",
    established: "Est. 1987",
    scoutStatus: "AIFF 4-Star Certified",
    trialFilterQuery: "Football",
  },
  {
    id: "gopichand-badminton",
    name: "Pullela Gopichand Badminton Academy",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    sports: "Badminton",
    badge: "National Center of Excellence",
    established: "Est. 2008",
    scoutStatus: "SAI NCOE Partner",
    trialFilterQuery: "Badminton",
  },
  {
    id: "bhaichung-bhutia-schools",
    name: "Bhaichung Bhutia Football Schools",
    location: "Pan-India (20+ Centers)",
    city: "Delhi NCR",
    sports: "Grassroots Football",
    badge: "AIFF 4-Star Certified",
    established: "Est. 2010",
    scoutStatus: "Youth League Pathway",
    trialFilterQuery: "Football",
  },
  {
    id: "ppba-bengaluru",
    name: "Prakash Padukone Badminton Academy",
    location: "Bengaluru, Karnataka",
    city: "Bengaluru",
    sports: "Badminton",
    badge: "Elite National Training",
    established: "Est. 1994",
    scoutStatus: "Olympic Podium Track",
    trialFilterQuery: "Badminton",
  },
  {
    id: "asi-pune",
    name: "Army Sports Institute (ASI)",
    location: "Pune, Maharashtra",
    city: "Pune",
    sports: "Archery, Athletics, Boxing, Fencing",
    badge: "Mission Olympics Wing",
    established: "Est. 2001",
    scoutStatus: "Armed Forces Scheme",
    trialFilterQuery: "Athletics",
  },
  {
    id: "mary-kom-foundation",
    name: "Mary Kom Regional Boxing Foundation",
    location: "Imphal, Manipur",
    city: "Imphal",
    sports: "Boxing",
    badge: "SAI Center of Excellence",
    established: "Est. 2006",
    scoutStatus: "Youth Talent Hunter",
    trialFilterQuery: "Boxing",
  },
  {
    id: "mrf-pace-foundation",
    name: "MRF Pace Foundation",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    sports: "Cricket (Fast Bowling)",
    badge: "Premier Specialist Combine",
    established: "Est. 1987",
    scoutStatus: "BCCI Talent Radar",
    trialFilterQuery: "Cricket",
  },
] as const;

export function FeaturedAcademiesSection() {
  const { scrollRef, scroll } = useTouchScroll(300);

  return (
    <section
      id="featured-academies"
      aria-label="Featured Training Institutions and Sports Academies"
      className="w-full min-w-0 max-w-full py-2"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">Featured Training Institutions</span>
          </h2>
          <p className="text-[11px] text-muted-foreground truncate">
            Accredited sports centers actively scouted on KhelGrid · Swipe to view
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {/* Scroll navigation arrows for all screen devices */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll academies left"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll academies right"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/academy"
            className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors shrink-0"
          >
            <span>All Academies</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontally Scrollable Rail of Academy Cards across all screen devices */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar touch-scroll-rail pb-2.5 pt-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {VERIFIED_ACADEMIES_CATALOG.map((academy) => (
          <div
            key={academy.id}
            className="snap-start shrink-0 w-[80vw] max-w-[280px] sm:w-[270px] lg:w-[290px] group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div>
              {/* Academy Campus Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted mb-2.5 shrink-0">
                <img
                  src={getAcademyCardImage(academy.id)}
                  alt={`${academy.name} - Sports Academy in ${academy.city}`}
                  width={400}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <span className="rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {academy.established}
                  </span>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white/95 z-10 pointer-events-none">
                  <span className="text-[10px] font-semibold text-white/90 truncate">
                    {academy.scoutStatus}
                  </span>
                </div>
              </div>

              {/* Academy Name */}
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                {academy.name}
              </h3>

              {/* Location */}
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{academy.location}</span>
              </div>

              {/* Sports Offered */}
              <div className="mt-2 text-xs font-medium text-foreground/80 line-clamp-1">
                {academy.sports}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate max-w-[170px]">
                {academy.badge}
              </span>

              <Link
                to="/trials"
                search={{ sport: academy.trialFilterQuery }}
                className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                <span>Trials</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
