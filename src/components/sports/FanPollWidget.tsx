import React, { useState, useEffect } from "react";
import { Flame, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FanPollWidgetProps {
  matchId: string;
  tournament: string;
  teamA: { name: string; code: string; flag?: string };
  teamB: { name: string; code: string; flag?: string };
}

const POLL_STORAGE_KEY = "khelgrid_fan_polls";

export function FanPollWidget({ matchId, tournament, teamA, teamB }: FanPollWidgetProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [votesA, setVotesA] = useState(148);
  const [votesB, setVotesB] = useState(62);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(POLL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed[matchId]) {
            setSelectedTeam(parsed[matchId]);
          }
        }
      }
    } catch {
      // ignore
    }
  }, [matchId]);

  const handleVote = (team: "A" | "B") => {
    if (selectedTeam) return; // already voted
    const teamCode = team === "A" ? teamA.code : teamB.code;
    setSelectedTeam(teamCode);
    if (team === "A") setVotesA((v) => v + 1);
    else setVotesB((v) => v + 1);

    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(POLL_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        parsed[matchId] = teamCode;
        localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card to-primary/5 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Fan Prediction Poll
          </h4>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {totalVotes.toLocaleString()} fans voted
        </span>
      </div>

      <p className="text-xs font-semibold text-foreground">
        Who will win <span className="text-primary">{tournament}</span>?
      </p>

      {/* Voting Buttons / Result Bars */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleVote("A")}
          disabled={Boolean(selectedTeam)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 transition-all text-xs font-bold cursor-pointer overflow-hidden",
            selectedTeam === teamA.code
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
              : "border-border/80 bg-background/80 hover:border-primary/50 text-foreground",
          )}
        >
          {selectedTeam && (
            <div
              className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-700"
              style={{ width: `${pctA}%` }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5 truncate">
            <span>{teamA.flag || "🏏"}</span>
            <span className="truncate">{teamA.name}</span>
          </span>
          {selectedTeam && (
            <span className="relative z-10 text-xs font-extrabold text-primary">
              {pctA}%
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleVote("B")}
          disabled={Boolean(selectedTeam)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 transition-all text-xs font-bold cursor-pointer overflow-hidden",
            selectedTeam === teamB.code
              ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
              : "border-border/80 bg-background/80 hover:border-primary/50 text-foreground",
          )}
        >
          {selectedTeam && (
            <div
              className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-700"
              style={{ width: `${pctB}%` }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5 truncate">
            <span>{teamB.flag || "🏏"}</span>
            <span className="truncate">{teamB.name}</span>
          </span>
          {selectedTeam && (
            <span className="relative z-10 text-xs font-extrabold text-primary">
              {pctB}%
            </span>
          )}
        </button>
      </div>

      {selectedTeam && (
        <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          <span>Your prediction for <strong>{selectedTeam}</strong> is recorded!</span>
        </p>
      )}
    </div>
  );
}
