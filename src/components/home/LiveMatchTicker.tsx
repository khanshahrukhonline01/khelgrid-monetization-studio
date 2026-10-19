import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LIVE_SPORTS_UPDATES, type LiveMatchUpdate } from "@/data/liveSports";
import { Radio, ChevronRight, ChevronLeft, Trophy, Flame, Activity, X, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTouchScroll } from "@/hooks/use-touch-scroll";

interface LiveMatchTickerProps {
  selectedSport?: string;
}

export function LiveMatchTicker({ selectedSport = "All" }: LiveMatchTickerProps) {
  const [selectedMatch, setSelectedMatch] = useState<LiveMatchUpdate | null>(null);
  const { scrollRef, scroll } = useTouchScroll(320);

  const matches = LIVE_SPORTS_UPDATES.filter((m) => {
    if (selectedSport === "All" || selectedSport === "All Sports") return true;
    return m.sport.toLowerCase() === selectedSport.toLowerCase();
  });

  const displayMatches = matches.length > 0 ? matches : LIVE_SPORTS_UPDATES;

  return (
    <section
      id="live-scores"
      aria-label="Live Match Score Center"
      className="w-full min-w-0 max-w-full py-2 scroll-mt-24"
    >
      {/* Header with Live Pulse */}
      <div className="flex items-center justify-between gap-2 pb-2.5 w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5 truncate">
            <span>Live Match Center</span>
          </h2>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Scroll navigation arrows for all screen devices */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll live matches left"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll live matches right"
              className="grid h-8 w-8 place-items-center rounded-lg border border-border/80 bg-secondary/80 text-foreground hover:bg-secondary active:scale-95 transition cursor-pointer touch-manipulation"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/live-scores"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            <span>All Scores</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Horizontal Swipeable Match Cards */}
      <div
        ref={scrollRef}
        className="flex w-full min-w-0 max-w-full items-stretch gap-3 overflow-x-auto no-scrollbar touch-scroll-rail pb-2 pt-1 px-0.5 snap-x snap-proximity select-none cursor-grab active:cursor-grabbing"
      >
        {displayMatches.map((match) => (
          <div
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="snap-start flex-none w-[80vw] max-w-[300px] sm:w-[320px] min-h-[148px] rounded-2xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md cursor-pointer active:scale-[0.99] flex flex-col justify-between"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-border/60">
              <span className="font-semibold text-muted-foreground truncate max-w-[170px]">
                {match.sport} · {match.tournament}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {match.status}
              </span>
            </div>

            {/* Teams & Scores */}
            <div className="py-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none">{match.teamA.flag || "🏏"}</span>
                  <span className="font-bold text-foreground truncate">{match.teamA.name}</span>
                </div>
                <span className="font-mono font-extrabold text-foreground">
                  {match.teamA.score}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none">{match.teamB.flag || "⚡"}</span>
                  <span className="font-bold text-foreground truncate">{match.teamB.name}</span>
                </div>
                <span className="font-mono font-semibold text-muted-foreground">
                  {match.teamB.score}
                </span>
              </div>
            </div>

            {/* Match Status / Highlight Footer */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="truncate text-primary font-medium">
                {match.highlight || match.statusText}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{selectedMatch.sport}</span>
                <span>·</span>
                <span>{selectedMatch.tournament}</span>
              </div>
              <DialogTitle className="text-base sm:text-lg">
                {selectedMatch.teamA.name} vs {selectedMatch.teamB.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedMatch.matchInfo || "Live Match Coverage"}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-border/70 bg-secondary/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedMatch.teamA.flag || "🏏"}</span>
                  <span className="font-bold text-sm">{selectedMatch.teamA.name}</span>
                </div>
                <span className="font-mono text-base font-bold">{selectedMatch.teamA.score}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedMatch.teamB.flag || "⚡"}</span>
                  <span className="font-bold text-sm">{selectedMatch.teamB.name}</span>
                </div>
                <span className="font-mono text-base font-semibold text-muted-foreground">
                  {selectedMatch.teamB.score}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-card border border-border p-3 text-xs space-y-1.5">
              <div className="font-semibold text-foreground">Situation & Insights:</div>
              <p className="text-muted-foreground leading-relaxed">
                {selectedMatch.highlight || selectedMatch.statusText}
              </p>
              {selectedMatch.stage && (
                <div className="text-[11px] text-primary font-medium">
                  Stage: {selectedMatch.stage}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Match link copied to clipboard!");
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary py-2.5 text-xs font-semibold hover:bg-secondary/80 cursor-pointer min-h-[44px]"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Match</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className="flex-1 flex items-center justify-center rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer min-h-[44px]"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
