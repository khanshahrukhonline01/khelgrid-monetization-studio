import { Link, useNavigate } from "@tanstack/react-router";
import { VENUES, type Venue } from "@/data/khelgrid";
import { CalendarCheck, Star, MapPin, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTouchScroll } from "@/hooks/use-touch-scroll";
import { getVenueCardImage } from "@/data/card-images";

interface QuickVenueRadarProps {
  selectedCity?: string;
  selectedSport?: string;
}

export function QuickVenueRadar({
  selectedCity = "All Cities",
  selectedSport = "All",
}: QuickVenueRadarProps) {
  const navigate = useNavigate();
  const { scrollRef, scroll } = useTouchScroll(300);

  const venues = VENUES.filter((venue) => {
    const matchCity =
      selectedCity === "All Cities" ||
      selectedCity === "All Locations" ||
      venue.city.toLowerCase() === selectedCity.toLowerCase();

    const matchSport =
      selectedSport === "All" ||
      selectedSport === "All Sports" ||
      venue.sports.some((s) => s.toLowerCase() === selectedSport.toLowerCase());

    return matchCity && matchSport;
  }).slice(0, 8);

  const displayVenues = venues.length > 0 ? venues : VENUES.slice(0, 8);

  return (
    <section aria-label="Book sports turf venues" className="w-full min-w-0 max-w-full py-2">
      <div className="flex items-center justify-between pb-2.5 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="truncate">Book Turfs & Courts</span>
          </h2>
          <div className="text-[11px] text-muted-foreground truncate">
            Instant court booking across football, badminton & cricket · Swipe to view
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Scroll navigation arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll venues left"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll venues right"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/book"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>Find Turfs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontally Scrollable Venues Rail across all screen devices */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar touch-scroll-rail pb-2.5 pt-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {displayVenues.map((venue) => (
          <div
            key={venue.id}
            className="snap-start shrink-0 w-[80vw] max-w-[280px] sm:w-[260px] lg:w-[280px] group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-xs transition-all hover:border-emerald-500/50 hover:shadow-md"
          >
            <div>
              {/* Venue Image / Visual Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted shrink-0">
                <img
                  src={getVenueCardImage(venue.id, venue.sports[0])}
                  alt={`${venue.name} - Sports Turf in ${venue.city}`}
                  width={400}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{venue.rating.toFixed(1)}</span>
                  <span className="text-white/60">({venue.reviews})</span>
                </div>

                <div className="absolute bottom-2 right-2 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  ₹{venue.pricePerHour}/hr
                </div>
              </div>

              {/* Name & Location */}
              <div className="mt-2.5">
                <h3 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors min-h-[1.25rem]">
                  {venue.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {venue.area}, {venue.city}
                  </span>
                </div>
              </div>

              {/* Sports tags */}
              <div className="mt-2 flex flex-wrap gap-1">
                {venue.sports.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-3 pt-2.5 border-t border-border/50">
              <Button
                size="sm"
                onClick={() => navigate({ to: `/venue/${venue.id}` })}
                className="w-full h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 mr-1" />
                <span>Book Slot</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
