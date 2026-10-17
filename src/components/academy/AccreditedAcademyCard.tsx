import React from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  MapPin,
  Star,
  Users,
  Share2,
  ArrowUpRight,
  Trophy,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPORT_ICONS } from "@/components/train/TrainFilters";
import { type CoachingProgram } from "@/data/playo";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/seo";

export interface AccreditedAcademyCardProps {
  academy: CoachingProgram;
  onEnquire?: (academy: CoachingProgram) => void;
  className?: string;
}

/**
 * Resolves SEO-friendly URL slug for sports.
 */
export function getSportSlug(sport: string): string {
  const map: Record<string, string> = {
    Archery: "archery",
    Athletics: "athletics",
    Badminton: "badminton",
    Boxing: "boxing",
    Cricket: "cricket",
    Football: "football",
    Hockey: "hockey",
    Wrestling: "wrestling",
    Swimming: "swimming",
    Tennis: "tennis",
    "Table Tennis": "table-tennis",
    Basketball: "basketball",
    Volleyball: "volleyball",
    Kabaddi: "kabaddi",
    "Kho-Kho": "kho-kho",
    Pickleball: "pickleball",
  };
  return map[sport] || sport.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Resolves SEO-friendly URL slug for major Indian sports cities.
 */
export function getCitySlug(city: string): string {
  const map: Record<string, string> = {
    Delhi: "delhi",
    Mumbai: "mumbai",
    Bengaluru: "bengaluru",
    Hyderabad: "hyderabad",
    Chennai: "chennai",
    Pune: "pune",
    Chandigarh: "chandigarh",
    Ahmedabad: "ahmedabad",
    Kanpur: "kanpur",
    Bhopal: "bhopal",
    Jamshedpur: "jamshedpur",
    Bhubaneswar: "bhubaneswar",
    Kozhikode: "kozhikode",
    "Chhatrapati Sambhajinagar": "chhatrapati-sambhajinagar",
    Ranchi: "ranchi",
    Jabalpur: "jabalpur",
    Mangaluru: "mangaluru",
    Kodagu: "kodagu",
    Imphal: "imphal",
    Bhiwani: "bhiwani",
    "Navi Mumbai": "navi-mumbai",
  };
  return map[city] || city.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function AccreditedAcademyCard({
  academy,
  onEnquire,
  className = "",
}: AccreditedAcademyCardProps) {
  const isFree = academy.pricePerMonth === 0;
  const sportSlug = getSportSlug(academy.sport);
  const citySlug = getCitySlug(academy.city);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== "undefined" ? window.location.origin : SITE_URL;
    const url = `${origin}/academy#${academy.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(`Copied share link for ${academy.academyName || academy.title}!`);
    } else {
      toast.info(`Academy: ${academy.academyName || academy.title}`);
    }
  };

  return (
    <article
      id={academy.id}
      itemScope
      itemType="https://schema.org/SportsActivityLocation"
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md ${className}`}
    >
      {/* Hidden Structured Data Microdata for SEO Crawlers */}
      <meta itemProp="name" content={academy.academyName || academy.title} />
      <meta itemProp="sport" content={academy.sport} />
      <meta itemProp="image" content={academy.image} />
      <meta itemProp="telephone" content="+91-11-24368393" />
      <meta itemProp="url" content={`${SITE_URL}/academy#${academy.id}`} />
      <div
        itemProp="address"
        itemScope
        itemType="https://schema.org/PostalAddress"
        className="hidden"
      >
        <span itemProp="streetAddress">{academy.area}</span>
        <span itemProp="addressLocality">{academy.city}</span>
        <span itemProp="addressCountry">IN</span>
      </div>
      <div
        itemProp="aggregateRating"
        itemScope
        itemType="https://schema.org/AggregateRating"
        className="hidden"
      >
        <meta itemProp="ratingValue" content={String(academy.rating)} />
        <meta itemProp="reviewCount" content={String(academy.reviewsCount || 50)} />
        <meta itemProp="bestRating" content="5" />
      </div>

      <div>
        {/* Card Header & Visual Media */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          <img
            src={academy.image}
            alt={`${academy.academyName || academy.title} - ${academy.sport} Academy in ${academy.city}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
            <span className="rounded-md bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>{academy.accreditation?.split("/")[0].trim() || "Accredited"}</span>
            </span>

            <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
              {academy.level}
            </span>
          </div>

          {/* Bottom Media Bar with Sport Link and Rating */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
            {/* Internal link to Sport Landing Page */}
            <Link
              to="/sport/$slug"
              params={{ slug: sportSlug }}
              className="flex items-center gap-1 font-semibold hover:underline bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs"
              title={`View all ${academy.sport} trials and programs`}
            >
              <span>{SPORT_ICONS[academy.sport] || "🏆"}</span>
              <span>{academy.sport}</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </Link>

            <span className="flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-bold">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{academy.rating}</span>
              <span className="text-[10px] text-white/70">({academy.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Card Main Body */}
        <div className="p-4 space-y-2.5">
          <div>
            <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {academy.academyName || academy.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
              <Users className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">{academy.coach}</span>
            </p>
          </div>

          {/* Location with Internal Link to City Hub */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium text-foreground/90">{academy.area}, </span>
            <Link
              to="/city/$slug"
              params={{ slug: citySlug }}
              className="text-primary font-semibold hover:underline truncate"
              title={`Explore sports opportunities in ${academy.city}`}
            >
              {academy.city}
            </Link>
          </div>

          {/* Format and Age Group */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            <span className="rounded bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
              {academy.format}
            </span>
            <span>·</span>
            <span>{academy.ageGroup}</span>
            <span>·</span>
            <span>{academy.sessionsPerWeek} sessions/wk</span>
          </div>

          {/* Facility Badges */}
          {academy.facilities && academy.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {academy.facilities.slice(0, 3).map((f) => (
                <span
                  key={f}
                  className="rounded-md bg-primary/5 border border-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                >
                  {f}
                </span>
              ))}
              {academy.facilities.length > 3 && (
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{academy.facilities.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Highlights */}
          {academy.highlights && academy.highlights.length > 0 && (
            <ul className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
              {academy.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="flex items-start gap-1 line-clamp-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="truncate">{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Discoverability Pathways: Internal Links */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-[11px]">
            <Link
              to="/search"
              search={{ sport: academy.sport }}
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              title={`View ${academy.sport} selection trials`}
            >
              <Trophy className="h-3 w-3" />
              <span>{academy.sport} Trials</span>
            </Link>

            <span className="text-muted-foreground/40">·</span>

            <Link
              to="/train"
              search={{ sport: academy.sport, entityType: "academies" }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
              title={`Filter all ${academy.sport} academies in Training Hub`}
            >
              <GraduationCap className="h-3 w-3" />
              <span>Coaching Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
          <div>
            {isFree ? (
              <div>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹0 Scholarship
                </span>
                <div className="text-[10px] text-muted-foreground">Khelo India Free Boarding</div>
              </div>
            ) : (
              <div>
                <span className="text-base font-extrabold text-foreground">
                  ₹{academy.pricePerMonth.toLocaleString("en-IN")}
                  <span className="text-[11px] font-normal text-muted-foreground"> / mo</span>
                </span>
                <div className="text-[10px] text-muted-foreground">Subsidized Academy Batch</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Share Academy Link"
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="sm"
              onClick={() => onEnquire?.(academy)}
              className="h-8 px-3 text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
            >
              {isFree ? "Apply Scholarship" : "Enquire / Join"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default AccreditedAcademyCard;
