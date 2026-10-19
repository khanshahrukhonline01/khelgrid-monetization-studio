import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { LIVE_SPORTS_UPDATES } from "@/data/liveSports";
import { ChevronRight, ChevronLeft, Activity, Radio } from "lucide-react";

export function SidebarLiveScoreWidget() {
  const liveMatches = LIVE_SPORTS_UPDATES.filter((m) => m.status === "LIVE");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate through matches every 8 seconds if not interacted
  useEffect(() => {
    if (liveMatches.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveMatches.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [liveMatches.length]);

  const currentMatch = liveMatches[currentIndex] || LIVE_SPORTS_UPDATES[0];
  if (!currentMatch) return null;

  const getSportEmoji = (sport: string) => {
    switch (sport) {
      case "Cricket":
        return "🏏";
      case "Football":
        return "⚽";
      case "Badminton":
        return "🏸";
      case "Kabaddi":
        return "🤼";
      case "Hockey":
        return "🏑";
      case "Tennis":
        return "🎾";
      default:
        return "⚡";
    }
  };

  return (
    <div className="my-2 rounded-xl border border-border/80 bg-card/90 p-2.5 text-foreground shadow-xs transition-all hover:border-primary/50">
      {/* Mini Header: Match title & LIVE badge */}
      <div className="flex items-center justify-between gap-1.5 border-b border-border/60 pb-1.5">
        <Link
          to="/live-scores"
          className="flex items-center gap-1.5 min-w-0 hover:underline"
          title="Open Live Scores match center"
        >
          <span className="text-xs">{getSportEmoji(currentMatch.sport)}</span>
          <span className="truncate font-semibold text-[11px] text-foreground/90">
            {currentMatch.matchInfo ||
              `${currentMatch.stage || "Match"} • ${currentMatch.tournament}`}
          </span>
        </Link>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE</span>
        </span>
      </div>

      {/* Mini Teams & Scores */}
      <Link to="/live-scores" className="block mt-2 space-y-1.5 hover:opacity-90">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">{currentMatch.teamA.flag || "🇨🇦"}</span>
            <span className="font-bold text-foreground truncate">{currentMatch.teamA.code}</span>
          </div>
          {currentMatch.sport === "Cricket" ? (
            <span className="text-[10px] text-primary font-bold">
              {currentMatch.teamA.score && currentMatch.teamA.score !== "Live"
                ? currentMatch.teamA.score
                : "BCCI Official"}
            </span>
          ) : (
            <span className="font-mono text-xs font-bold text-foreground">
              {currentMatch.teamA.score}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">{currentMatch.teamB.flag || "⚡"}</span>
            <span className="font-bold text-foreground truncate">{currentMatch.teamB.code}</span>
          </div>
          {currentMatch.sport === "Cricket" ? (
            <span className="text-[10px] text-muted-foreground font-semibold">Ball-by-ball</span>
          ) : (
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {currentMatch.teamB.score}
            </span>
          )}
        </div>
      </Link>

      {/* Mini Status */}
      <p className="mt-1.5 text-[10px] text-muted-foreground truncate font-medium">
        {currentMatch.statusText || currentMatch.highlight}
      </p>

      {/* Mini Footer: Switcher & Link to Live Scores Section */}
      <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-1.5 text-[10px]">
        <Link
          to="/live-scores"
          className="inline-flex items-center gap-0.5 font-bold text-primary hover:underline"
        >
          <span>Live Scores Hub</span>
          <ChevronRight className="h-3 w-3" />
        </Link>

        {liveMatches.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + liveMatches.length) % liveMatches.length)
              }
              className="p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              aria-label="Previous live match"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-[9px] text-muted-foreground font-mono">
              {currentIndex + 1}/{liveMatches.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % liveMatches.length)}
              className="p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              aria-label="Next live match"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
