import { Link } from "@tanstack/react-router";
import { TRIALS, type Trial } from "@/data/trials";
import { getTrialEndDate } from "@/lib/opportunity-badge";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import {
  Trophy,
  Calendar,
  Heart,
  Share2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useTouchScroll } from "@/hooks/use-touch-scroll";
import { getTrialCardImage } from "@/data/card-images";

interface FeaturedTrialsRadarProps {
  selectedSport?: string;
  selectedCity?: string;
}

export function FeaturedTrialsRadar({
  selectedSport = "All",
  selectedCity = "All Cities",
}: FeaturedTrialsRadarProps) {
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const { scrollRef, scroll } = useTouchScroll(340);

  const currentTrials = TRIALS.filter((trial) => {
    const endDate = getTrialEndDate(trial.date);
    return Boolean(endDate && endDate.getTime() >= Date.now());
  });

  const filteredTrials = currentTrials.filter((trial) => {
    const matchSport =
      selectedSport === "All" ||
      selectedSport === "All Sports" ||
      trial.sport.toLowerCase() === selectedSport.toLowerCase();

    const matchCity =
      selectedCity === "All Cities" ||
      selectedCity === "All Locations" ||
      trial.city.toLowerCase() === selectedCity.toLowerCase();

    return matchSport && matchCity;
  }).slice(0, 8);

  const displayTrials = filteredTrials.length > 0 ? filteredTrials : currentTrials.slice(0, 8);

  const handleShare = (e: React.MouseEvent, trial: Trial) => {
    e.preventDefault();
    e.stopPropagation();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://www.khelgrid.com";
    const shareUrl = `${origin}/trial/${trial.id}`;
    const text = `🏆 *${trial.sport.toUpperCase()} TRIAL: ${trial.title}*\n📍 *Location:* ${trial.academy}, ${trial.city}\n🗓️ *Date:* ${trial.date}\n🎟️ *Fee:* ${trial.feeLabel || (trial.fee === 0 ? "Free Entry" : "₹" + trial.fee)}\n🎯 *Eligibility:* ${trial.ageCategory || "Open"}\n\n👉 *Details & Registration:* ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Opening WhatsApp share!");
  };

  const handleBookmark = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(id);
    if (!isSaved(id)) {
      toast.success(`Saved "${title}"`);
    } else {
      toast.info(`Removed from saved`);
    }
  };

  return (
    <section aria-label="Featured Selection Trials" className="w-full min-w-0 max-w-full py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2.5 w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">Selection Trials & Combines</span>
          </h2>
          <div className="text-[11px] text-muted-foreground truncate">
            Verified SAI, federation & academy scouting trials · Swipe to explore
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Left/Right Scroll Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll trials left"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll trials right"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/search"
            search={{ sport: "All Sports", city: "All Locations" }}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>All ({TRIALS.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontally Scrollable Rail of Trial Cards across all screen devices */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar touch-scroll-rail pb-2.5 pt-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {displayTrials.map((trial) => {
          const saved = isSaved(trial.id);

          return (
            <Link
              key={trial.id}
              to="/search"
              search={{
                q:
                  trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                    ? "CRPF"
                    : trial.title,
                sport:
                  trial.sport && trial.sport !== "Multi-Discipline Sports Quota"
                    ? trial.sport
                    : "All Sports",
                city: "All Locations",
                sort: "Soonest",
                free: false,
                trialId: trial.id,
              }}
              hash={
                trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026"
                  ? "crpf-recruitment-notification-card"
                  : `trial-card-${trial.id}`
              }
              className="snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-[320px] lg:w-[340px] group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3 sm:p-3.5 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer select-auto"
            >
              <div>
                {/* Visual Card Image Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted mb-3 shrink-0">
                  <img
                    src={getTrialCardImage(trial.sport)}
                    alt={`${trial.title} - ${trial.sport} Selection Trial`}
                    width={400}
                    height={250}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top Overlay: Sport & Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <span className="rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {trial.sport}
                    </span>
                    {trial.badge && (
                      <span className="rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        {trial.badge}
                      </span>
                    )}
                  </div>

                  {/* Top Right Action Buttons */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, trial)}
                      className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white/90 hover:bg-black/90 hover:text-white cursor-pointer transition backdrop-blur-xs"
                      title="Share trial"
                      aria-label="Share trial on WhatsApp"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleBookmark(e, trial.id, trial.title)}
                      className={`grid h-7 w-7 place-items-center rounded-lg transition cursor-pointer backdrop-blur-xs ${
                        saved
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-black/60 text-white/90 hover:bg-black/90 hover:text-white"
                      }`}
                      title={saved ? "Remove from favorites" : "Save to favorites"}
                      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${saved ? "fill-white" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom Overlay: City & Fee */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white/95 z-10 pointer-events-none">
                    <span className="text-[11px] font-medium text-white/95 truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-white/80 shrink-0" />
                      <span>{trial.city}</span>
                    </span>
                    <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs shrink-0">
                      {trial.fee === 0 ? "Free Entry" : `₹${trial.fee}`}
                    </span>
                  </div>
                </div>

                {/* Trial Title */}
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                  {trial.title}
                </h3>

                {/* Academy / Organizer */}
                <div className="mt-1 text-xs text-muted-foreground truncate flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{trial.academy}</span>
                </div>
              </div>

              {/* Card Footer: Date, Eligibility */}
              <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-[11px] font-medium">{trial.date}</span>
                </div>

                <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  {trial.ageCategory || "Open Age"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
