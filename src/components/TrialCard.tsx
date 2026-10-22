import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Flame,
  Check,
  Zap,
  Heart,
  Bell,
  Share2,
  Copy,
  MessageCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import type { Trial } from "@/data/trials";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { useFollowedAcademies } from "@/context/FollowedAcademyContext";
import { getRealtimeOpportunityBadge } from "@/lib/opportunity-badge";
import { TrialDetailsModal } from "@/components/TrialDetailsModal";
import { getTrialCardImage } from "@/data/card-images";
import { toast } from "sonner";

interface Props {
  trial: Trial;
  boosted?: boolean;
  onApply: () => void;
  onBoost?: () => void;
  showBoostAction?: boolean;
}

export function TrialCard({ trial, boosted, onApply, onBoost, showBoostAction }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { applications } = useAuth();
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const { isFollowingAcademy, toggleFollowAcademy } = useFollowedAcademies();
  const applied = applications.includes(trial.id);
  const saved = isSaved(trial.id);
  const followingAcademy = isFollowingAcademy(trial.academy);
  const statusBadge = getRealtimeOpportunityBadge(trial);

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaved(trial.id);
    if (!saved) {
      toast.success(`Saved "${trial.title}" to Favorites! ❤️`);
    } else {
      toast.info(`Removed "${trial.title}" from Favorites`);
    }
  };

  return (
    <>
      <div
        id={`trial-card-${trial.id}`}
        onClick={() => setIsDetailsOpen(true)}
        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-card p-3 sm:p-4 md:p-5 transition-all cursor-pointer w-full min-w-0 max-w-full box-border ${
          boosted
            ? "border-primary/60 animate-pulse-glow"
            : "border-border hover:border-primary/50 hover:shadow-md hover:translate-y-[-2px]"
        } ${statusBadge?.isExpired ? "opacity-85 grayscale-[0.2]" : ""}`}
      >
        <div className="w-full min-w-0 max-w-full">
          {/* Visual Card Image Banner */}
          <div className="relative aspect-[16/10] w-full min-w-0 max-w-full overflow-hidden rounded-xl bg-muted mb-3 shrink-0">
            <img
              src={trial.posterUrl || trial.imageUrl || getTrialCardImage(trial.sport)}
              alt={`${trial.title} - ${trial.sport} Selection Trial`}
              width={400}
              height={250}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (trial.posterUrl && !target.src.includes("sai_trial_poster.jpeg")) {
                  target.src = "/sai_trial_poster.jpeg";
                } else {
                  target.src = getTrialCardImage(trial.sport);
                }
              }}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Left: Sport & Boosted */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 max-w-[calc(100%-4rem)] truncate">
              <span className="rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                {trial.sport}
              </span>
              {boosted && (
                <span className="flex items-center gap-1 rounded-md bg-primary/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs uppercase tracking-wider shrink-0">
                  <Flame className="h-2.5 w-2.5" /> Featured
                </span>
              )}
            </div>

            {/* Top Right: Heart Save Toggle */}
            <button
              type="button"
              onClick={handleToggleHeart}
              aria-label={
                saved ? `Remove ${trial.title} from favorites` : `Save ${trial.title} to favorites`
              }
              title={saved ? "Saved in Favorites (Click to remove)" : "Save to Favorites"}
              className={`absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg border transition-all cursor-pointer backdrop-blur-xs ${
                saved
                  ? "border-rose-500/70 bg-rose-500 text-white shadow-sm scale-105"
                  : "border-white/30 bg-black/60 text-white/90 hover:border-rose-400 hover:text-rose-400 hover:bg-black/90"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 transition-transform ${saved ? "fill-white" : ""}`} />
            </button>

            {/* Bottom Overlay: City & Fee */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white/95 z-10 pointer-events-none gap-2 min-w-0">
              <span className="text-[11px] font-medium text-white/90 truncate flex items-center gap-1 min-w-0">
                <MapPin className="h-3 w-3 text-white/80 shrink-0" />
                <span className="truncate">{trial.city}</span>
              </span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold shadow-xs shrink-0 whitespace-nowrap ml-1 ${(!trial.feeLabel && trial.fee === 0) || trial.feeLabel?.toLowerCase().includes("free") ? "bg-emerald-500/90 text-white" : "bg-secondary text-foreground"}`}>
                {trial.feeLabel || (trial.fee === 0 ? "Free Entry" : `₹${trial.fee}`)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground w-full min-w-0">
            <span className="text-foreground/75 font-medium">{trial.tag}</span>
            {trial.listingType === "competition" && trial.entryStatus && (
              <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                {trial.entryStatus === "IN PROGRESS" || trial.entryStatus === "INPROGRESS"
                  ? "Entry in progress"
                  : trial.entryStatus === "ENTRY NOT STARTED"
                    ? "Entry not started"
                    : trial.entryStatus}
              </span>
            )}

            {statusBadge && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusBadge.style}`}
              >
                <span
                  className={`h-1 w-1 rounded-full shrink-0 ${statusBadge.dotStyle}`}
                  aria-hidden="true"
                />
                <statusBadge.icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                <span>{statusBadge.label}</span>
              </span>
            )}
          </div>

          <h3 className="mt-2 text-base sm:text-lg font-semibold leading-snug line-clamp-2 break-words w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailsOpen(true);
              }}
              className="text-left font-semibold hover:text-primary transition-colors cursor-pointer w-full break-words"
            >
              {trial.title}
            </button>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate w-full">
            {trial.academy}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            className="mt-1 inline-flex text-xs font-medium text-primary hover:underline cursor-pointer truncate max-w-full"
          >
            View venue location &amp; organizer info →
          </button>

          <div className="mt-3.5 grid grid-cols-3 gap-1 sm:gap-2 text-xs text-muted-foreground w-full min-w-0">
            <div className="flex min-w-0 items-center gap-1 text-[11px] sm:text-xs">
              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{trial.city}</span>
            </div>
            <div className="flex min-w-0 items-center gap-1 text-[11px] sm:text-xs">
              <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{trial.date}</span>
            </div>
            <div className="flex min-w-0 items-center gap-1 text-[11px] sm:text-xs">
              <Users className="h-3 w-3 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{trial.listingType === "competition" ? "School competition" : `${trial.spots} spots`}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleHeart}
            aria-label={
              saved ? `Remove ${trial.title} from favorites` : `Save ${trial.title} to favorites`
            }
            title={saved ? "Saved in Favorites (Click to remove)" : "Save to Favorites"}
            className={`h-9 px-2 sm:px-2.5 shrink-0 gap-1 sm:gap-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              saved
                ? "border-rose-500/60 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                : "border-border hover:border-rose-400 hover:text-rose-500 text-muted-foreground hover:bg-rose-500/5"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 shrink-0 ${saved ? "fill-rose-500 text-rose-500" : ""}`}
            />
            <span className="text-[11px] sm:text-xs font-medium">{saved ? "Saved" : "Save"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFollowAcademy(trial.academy);
              toast.success(
                followingAcademy ? `Unfollowed ${trial.academy}` : `Following ${trial.academy}`,
              );
            }}
            aria-label={
              followingAcademy
                ? `Stop following ${trial.academy}`
                : `Follow ${trial.academy} for schedule updates`
            }
            title={followingAcademy ? "Following academy" : "Follow academy schedule"}
            className={`h-9 w-9 shrink-0 rounded-xl ${
              followingAcademy
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            <Bell className={`h-3.5 w-3.5 ${followingAcademy ? "fill-current" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Share trial announcement"
                aria-label={`Share ${trial.title}`}
                className="h-9 w-9 shrink-0 rounded-xl border-border text-muted-foreground"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-700 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "https://www.khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  const text = encodeURIComponent(
                    `🏆 *${trial.title}* (${trial.sport})\n📍 ${trial.city} · 📅 ${trial.date}\n🔗 View on KhelGrid: ${shareUrl}`,
                  );
                  window.open(
                    `https://api.whatsapp.com/send?text=${text}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <MessageCircle className="h-4 w-4 fill-emerald-500/20" />
                <span>Share on WhatsApp</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "https://www.khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  const text = encodeURIComponent(
                    `Official ${trial.sport} selection trial: ${trial.title} in ${trial.city} on ${trial.date}. Verified on @KhelGrid:`,
                  );
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <span className="font-bold text-xs">𝕏</span>
                <span>Share on X</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={async (e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined"
                      ? window.location.origin
                      : "https://www.khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  try {
                    if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(shareUrl);
                    }
                    toast.success("Link copied to clipboard!");
                  } catch {
                    toast.error("Could not copy link");
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {trial.listingType === "competition" ? (
            <a
              href={trial.sourceUrl || "https://www.sgfi.org.in"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 h-9 inline-flex items-center justify-center gap-1.5 text-xs font-bold truncate px-2.5 rounded-xl shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
              aria-label={`View official calendar for ${trial.title}`}
            >
              <span className="truncate">Official Calendar</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" />
            </a>
          ) : trial.id === "t-crpf-meritorious-sportspersons-recruitment-2026" ? (
            <a
              href="https://rect.crpf.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 h-9 inline-flex items-center justify-center gap-1.5 text-xs font-bold truncate px-2.5 rounded-xl shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
            >
              <span className="truncate">Apply on CRPF Portal</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" />
            </a>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              disabled={applied || statusBadge?.isExpired}
              className="flex-1 min-w-0 h-9 text-xs sm:text-sm font-bold truncate px-2 sm:px-3 rounded-xl shadow-xs"
              variant={applied || statusBadge?.isExpired ? "secondary" : "default"}
            >
              {applied ? (
                <>
                  <Check className="mr-1 h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Applied</span>
                </>
              ) : statusBadge?.isExpired ? (
                <span className="truncate">Closed</span>
              ) : (
                <span className="truncate">Apply</span>
              )}
            </Button>
          )}

          {showBoostAction && !boosted && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onBoost?.();
              }}
              variant="outline"
              size="icon"
              title="Boost listing"
              className="h-9 w-9 shrink-0 rounded-xl"
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Expanded Modal for Venue, Organizer Contact & Direct Registration */}
      <TrialDetailsModal
        trial={trial}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isRegistered={applied}
        onRegister={() => onApply()}
      />
    </>
  );
}
