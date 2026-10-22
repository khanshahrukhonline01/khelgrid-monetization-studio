import { useMemo } from "react";
import type { SportsCVData, CardTheme } from "@/types/sports-cv";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Award,
  ShieldCheck,
  Zap,
  Activity,
  QrCode,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  Flame,
  CheckCircle2,
  Instagram,
  Video,
  Play,
  ExternalLink,
  Globe,
  Share2,
  TrendingUp,
  BarChart3,
  Layers,
  Clock,
  Users,
} from "lucide-react";

interface SportsCVCardProps {
  data: SportsCVData;
  className?: string;
  onShare?: () => void;
}

const THEME_CONFIG: Record<
  CardTheme,
  {
    outerBorder: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
    accentGlow: string;
    accentBar: string;
    meterBg: string;
    cardBg: string;
  }
> = {
  gold: {
    outerBorder: "border-amber-500/40",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-400",
    accentText: "text-amber-400",
    accentGlow: "shadow-[0_0_24px_rgba(245,158,11,0.12)]",
    accentBar: "bg-gradient-to-r from-amber-500 to-yellow-400",
    meterBg: "bg-amber-500/20",
    cardBg: "bg-gradient-to-b from-neutral-900/95 via-neutral-950/98 to-neutral-900/95",
  },
  cyber: {
    outerBorder: "border-cyan-500/40",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-400",
    accentText: "text-cyan-400",
    accentGlow: "shadow-[0_0_24px_rgba(6,182,212,0.12)]",
    accentBar: "bg-gradient-to-r from-cyan-500 to-blue-500",
    meterBg: "bg-cyan-500/20",
    cardBg: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  },
  emerald: {
    outerBorder: "border-emerald-500/40",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-400",
    accentText: "text-emerald-400",
    accentGlow: "shadow-[0_0_24px_rgba(16,185,129,0.12)]",
    accentBar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    meterBg: "bg-emerald-500/20",
    cardBg: "bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950",
  },
  crimson: {
    outerBorder: "border-rose-500/40",
    badgeBg: "bg-rose-500/15 border-rose-500/30",
    badgeText: "text-rose-400",
    accentText: "text-rose-400",
    accentGlow: "shadow-[0_0_24px_rgba(244,63,94,0.12)]",
    accentBar: "bg-gradient-to-r from-rose-500 to-red-500",
    meterBg: "bg-rose-500/20",
    cardBg: "bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950",
  },
  classic: {
    outerBorder: "border-primary/40",
    badgeBg: "bg-primary/15 border-primary/30",
    badgeText: "text-primary",
    accentText: "text-primary",
    accentGlow: "shadow-[0_0_20px_rgba(0,0,0,0.3)]",
    accentBar: "bg-gradient-to-r from-primary to-primary/80",
    meterBg: "bg-primary/20",
    cardBg: "bg-card text-card-foreground",
  },
};

export function SportsCVCard({ data, className = "", onShare }: SportsCVCardProps) {
  const theme = THEME_CONFIG[data.theme] || THEME_CONFIG.gold;

  // Average performance rating
  const overallRating = useMemo(() => {
    if (!data.performanceMetrics || data.performanceMetrics.length === 0) return 85;
    const scores = data.performanceMetrics
      .map((m) => m.score ?? 80)
      .filter((s) => typeof s === "number");
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / scores.length);
  }, [data.performanceMetrics]);

  return (
    <div
      id="sports-cv-profile-card"
      className={`relative overflow-hidden rounded-2xl border ${theme.outerBorder} ${theme.cardBg} ${theme.accentGlow} p-5 sm:p-7 text-neutral-100 transition-all duration-300 ${className}`}
    >
      {/* Background athletic decorative watermarks */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-white/[0.02] blur-3xl" />

      {/* Top Header: Verification & ID */}
      <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${theme.badgeBg} ${theme.badgeText}`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Athlete Sports CV
          </span>
          <span className="text-[11px] font-mono tracking-wider text-neutral-400">
            {data.athleteId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {data.availability}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            KhelGrid Scout ID
          </span>
        </div>
      </div>

      {/* Athlete Hero Header */}
      <div className="relative mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {/* Jersey or Avatar Badge */}
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5 font-black text-2xl sm:text-3xl tracking-tighter text-white shadow-inner">
            {data.jerseyNumber ? (
              <span>{data.jerseyNumber}</span>
            ) : (
              <span>{data.athleteName.charAt(0)}</span>
            )}
            <div className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {data.athleteName}
              </h3>
              <Badge
                variant="outline"
                className={`border-white/20 text-xs font-semibold ${theme.accentText}`}
              >
                {data.sport}
              </Badge>
            </div>

            {/* Position Display */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/90">
              <span className={`font-bold ${theme.accentText}`}>{data.position}</span>
              {data.secondaryPosition && (
                <span className="text-neutral-400 text-xs font-normal">
                  · Secondary: {data.secondaryPosition}
                </span>
              )}
            </div>

            {/* Academy & City */}
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-neutral-300">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                {data.currentAcademy || "Independent Athlete"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                {data.city}, {data.state}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Scout Rating Badge */}
        <div className="flex shrink-0 items-center gap-3 self-start sm:self-center rounded-xl border border-white/10 bg-white/[0.04] p-3 text-right">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">
              Overall Athletic Index
            </div>
            <div className="text-xs font-semibold text-neutral-300">State Percentile</div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-white/10 font-black text-xl ${theme.accentText}`}
          >
            {overallRating}
          </div>
        </div>
      </div>

      {/* Biological & Physical Attribute Tags */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5 text-center text-xs">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <div className="text-[10px] uppercase text-neutral-400">Category</div>
          <div className="mt-0.5 font-bold text-neutral-100">{data.ageCategory}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <div className="text-[10px] uppercase text-neutral-400">Height</div>
          <div className="mt-0.5 font-bold text-neutral-100">{data.height || "—"}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <div className="text-[10px] uppercase text-neutral-400">Weight</div>
          <div className="mt-0.5 font-bold text-neutral-100">{data.weight || "—"}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <div className="text-[10px] uppercase text-neutral-400">Dominant Side</div>
          <div className="mt-0.5 font-bold text-neutral-100">{data.dominantSide}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <div className="text-[10px] uppercase text-neutral-400">Trial Status</div>
          <div className="mt-0.5 font-bold text-emerald-400">Active Ready</div>
        </div>
      </div>

      {/* Bio / Scout Statement */}
      {data.bio && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs sm:text-sm leading-relaxed text-neutral-300">
          <span className="font-semibold text-white mr-1">Athlete Summary:</span>
          {data.bio}
        </div>
      )}

      {/* Section 1: Career Stats & Match Records */}
      {(data.careerSummary || (data.careerSeasonStats && data.careerSeasonStats.length > 0)) && (
        <div className="mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
              <BarChart3 className={`h-4 w-4 ${theme.accentText}`} />
              Career Stats &amp; Match Records
            </h4>
            <span className="text-[11px] text-neutral-400">
              {data.careerSummary?.totalMatches ||
                data.careerSeasonStats?.reduce((a, b) => a + (b.matches || 0), 0) ||
                0}{" "}
              Matches Recorded
            </span>
          </div>

          {/* Key Metric Ticker Cards */}
          {data.careerSummary && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Career Matches
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                  {data.careerSummary.totalMatches}
                </div>
                {data.careerSummary.winRate && (
                  <div className="mt-0.5 text-[10px] text-emerald-400 font-medium">
                    {`${data.careerSummary.winRate} Win/Select Rate`}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  {data.careerSummary.primaryMetric.label}
                </div>
                <div
                  className={`mt-1 font-mono text-xl sm:text-2xl font-black tabular-nums ${theme.accentText}`}
                >
                  {data.careerSummary.primaryMetric.value}
                </div>
                <div className="mt-0.5 text-[10px] text-neutral-400">Primary Benchmark</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  {data.careerSummary.secondaryMetric.label}
                </div>
                <div className="mt-1 font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                  {data.careerSummary.secondaryMetric.value}
                </div>
                <div className="mt-0.5 text-[10px] text-neutral-400">Secondary Benchmark</div>
              </div>

              {data.careerSummary.tertiaryMetric ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                    {data.careerSummary.tertiaryMetric.label}
                  </div>
                  <div className="mt-1 font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                    {data.careerSummary.tertiaryMetric.value}
                  </div>
                  <div className="mt-0.5 text-[10px] text-neutral-400">Efficiency Rate</div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                    Status
                  </div>
                  <div className="mt-1 text-sm font-bold text-emerald-400">Active Scouted</div>
                  <div className="mt-0.5 text-[10px] text-neutral-400">State Circuit</div>
                </div>
              )}
            </div>
          )}

          {/* Season-by-Season Breakdown Table */}
          {data.careerSeasonStats && data.careerSeasonStats.length > 0 && (
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-neutral-400">
                    <th className="px-3 py-2.5 font-semibold">Season</th>
                    <th className="px-3 py-2.5 font-semibold">Tournament / Team</th>
                    <th className="px-3 py-2.5 font-semibold text-center">Matches</th>
                    <th className="px-3 py-2.5 font-semibold text-right">
                      {data.careerSeasonStats[0].stat1Label}
                    </th>
                    <th className="px-3 py-2.5 font-semibold text-right">
                      {data.careerSeasonStats[0].stat2Label}
                    </th>
                    {data.careerSeasonStats[0].stat3Label && (
                      <th className="px-3 py-2.5 font-semibold text-right">
                        {data.careerSeasonStats[0].stat3Label}
                      </th>
                    )}
                    <th className="px-3 py-2.5 font-semibold">Honour / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.careerSeasonStats.map((season) => (
                    <tr key={season.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-3 py-2.5 font-mono text-white font-medium whitespace-nowrap tabular-nums">
                        {season.season}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-300 font-medium">
                        {season.teamOrTournament}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-center font-bold text-neutral-200 tabular-nums">
                        {season.matches}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-right font-bold text-white tabular-nums">
                        {season.stat1Value}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-right font-bold text-neutral-300 tabular-nums">
                        {season.stat2Value}
                      </td>
                      {season.stat3Label && (
                        <td className="px-3 py-2.5 font-mono text-right text-neutral-400 tabular-nums">
                          {season.stat3Value ?? "—"}
                        </td>
                      )}
                      <td className="px-3 py-2.5 text-neutral-300">
                        {season.ratingOrHighlight ? (
                          <span className={`inline-block font-semibold ${theme.accentText}`}>
                            {season.ratingOrHighlight}
                          </span>
                        ) : (
                          <span className="text-neutral-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Position & Squad History Timeline */}
      {data.positionHistory && data.positionHistory.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
              <Layers className={`h-4 w-4 ${theme.accentText}`} />
              Position &amp; Squad History
            </h4>
            <span className="text-[11px] text-neutral-400">
              {data.positionHistory.length} Squads Logged
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {data.positionHistory.map((item) => (
              <div
                key={item.id}
                className="relative flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:bg-white/[0.05]"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 ${theme.accentText}`}
                >
                  <Clock className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs sm:text-sm text-white">{item.position}</h5>
                      {item.isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Current Squad
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}
                      >
                        {item.level}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                        {item.period}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-300">
                    <span className="font-semibold text-white/90">{item.team}</span>
                    {item.secondaryPosition && (
                      <span className="text-neutral-400">
                        · Tactical Role: {item.secondaryPosition}
                      </span>
                    )}
                    {typeof item.appearances === "number" && (
                      <span className="font-mono text-neutral-400 tabular-nums">
                        · {item.appearances} Caps / Matches
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 1: Performance Metrics */}
      <div className="mt-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
            <Zap className={`h-4 w-4 ${theme.accentText}`} />
            Performance Metrics
          </h4>
          <span className="text-[11px] text-neutral-400">
            {data.performanceMetrics.length} Metrics Tested
          </span>
        </div>

        {data.performanceMetrics.length === 0 ? (
          <div className="mt-3 rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-neutral-400">
            No performance metrics logged yet. Click "Edit CV" to add speed, vertical jump, or
            sport-specific test stats.
          </div>
        ) : (
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {data.performanceMetrics.map((metric) => {
              const score = metric.score ?? 80;
              return (
                <div
                  key={metric.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs sm:text-sm text-white">
                        {metric.name}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {metric.benchmark || `Category: ${metric.category}`}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-base sm:text-lg font-black font-mono ${theme.accentText}`}
                      >
                        {metric.value}
                      </span>
                      <span className="ml-1 text-[11px] text-neutral-300 font-medium">
                        {metric.unit}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${theme.accentBar}`}
                        style={{ width: `${Math.min(100, Math.max(15, score))}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{score}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Athletic Achievements */}
      <div className="mt-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
            <Trophy className={`h-4 w-4 ${theme.accentText}`} />
            Honours & Athletic Achievements
          </h4>
          <span className="text-[11px] text-neutral-400">{data.achievements.length} Recorded</span>
        </div>

        {data.achievements.length === 0 ? (
          <div className="mt-3 rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-neutral-400">
            No achievements added yet. Click "Edit CV" to add tournament medals, state selections,
            or school records.
          </div>
        ) : (
          <div className="mt-3 space-y-2.5">
            {data.achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 ${theme.accentText}`}
                >
                  {ach.award.includes("Gold") || ach.award.includes("1st") ? (
                    <Trophy className="h-4 w-4" />
                  ) : ach.award.includes("Silver") || ach.award.includes("Bronze") ? (
                    <Medal className="h-4 w-4" />
                  ) : ach.award.includes("MVP") || ach.award.includes("Best") ? (
                    <Flame className="h-4 w-4" />
                  ) : (
                    <Award className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                      {ach.title}
                    </h5>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText}`}
                      >
                        {ach.level}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">{ach.year}</span>
                    </div>
                  </div>

                  <div className="mt-0.5 text-xs text-neutral-300 font-medium">
                    {ach.award} · <span className="text-neutral-400">{ach.competition}</span>
                  </div>

                  {ach.description && (
                    <p className="mt-1 text-[11px] leading-relaxed text-neutral-400 line-clamp-2">
                      {ach.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Connected Athletic Socials & Match Footage */}
      {(data.socialProfiles || data.highlightVideoUrl) && (
        <div className="mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-white">
              <Share2 className={`h-4 w-4 ${theme.accentText}`} />
              Connected Socials & Match Footage
            </h4>
            <span className="text-[11px] text-neutral-400">Athlete-provided links</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {data.socialProfiles?.instagram && (
              <a
                href={
                  data.socialProfiles.instagram.startsWith("http")
                    ? data.socialProfiles.instagram
                    : `https://instagram.com/${data.socialProfiles.instagram.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold text-pink-300 transition-all hover:bg-pink-500/20 hover:border-pink-500/50"
              >
                <Instagram className="h-3.5 w-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                <span>
                  {data.socialProfiles.instagram.startsWith("@")
                    ? data.socialProfiles.instagram
                    : `@${data.socialProfiles.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`}
                </span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {data.highlightVideoUrl && (
              <a
                href={data.highlightVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20 hover:border-red-500/50"
              >
                <Play className="h-3.5 w-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>Watch Skills Reel</span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {data.socialProfiles?.twitter && (
              <a
                href={
                  data.socialProfiles.twitter.startsWith("http")
                    ? data.socialProfiles.twitter
                    : `https://x.com/${data.socialProfiles.twitter.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition-all hover:bg-sky-500/20 hover:border-sky-500/50"
              >
                <span className="font-bold text-[11px] text-sky-400">𝕏</span>
                <span>
                  {data.socialProfiles.twitter.startsWith("@")
                    ? data.socialProfiles.twitter
                    : `@${data.socialProfiles.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, "").replace(/\/$/, "")}`}
                </span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {data.socialProfiles?.cricheroes && (
              <a
                href={
                  data.socialProfiles.cricheroes.startsWith("http")
                    ? data.socialProfiles.cricheroes
                    : `https://cricheroes.com/player-profile/${data.socialProfiles.cricheroes}`
                }
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/50"
              >
                <Award className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>CricHeroes Stats</span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {data.socialProfiles?.strava && (
              <a
                href={
                  data.socialProfiles.strava.startsWith("http")
                    ? data.socialProfiles.strava
                    : `https://www.strava.com/athletes/${data.socialProfiles.strava}`
                }
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 transition-all hover:bg-orange-500/20 hover:border-orange-500/50"
              >
                <Activity className="h-3.5 w-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
                <span>Strava Activity</span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}

            {data.socialProfiles?.khelgrid && (
              <a
                href={
                  data.socialProfiles.khelgrid.startsWith("http")
                    ? data.socialProfiles.khelgrid
                    : `https://www.khelgrid.com/profile/${data.socialProfiles.khelgrid}`
                }
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
              >
                <Globe className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>KhelGrid Karma</span>
                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Card footer with profile link and coach reference */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-neutral-300">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">KhelGrid Athlete Profile</span>
              {onShare && (
                <button
                  type="button"
                  onClick={onShare}
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText} transition hover:opacity-90`}
                >
                  <Share2 className="h-3 w-3" />
                  Share Public Link
                </button>
              )}
            </div>
            <div className="text-[11px] text-neutral-400">
              Scan or open the public profile and athlete-provided details
            </div>
          </div>
        </div>

        {data.coachReference && (
          <div className="border-t border-white/10 pt-2 sm:border-t-0 sm:pt-0 sm:text-right">
            <div className="text-[10px] uppercase text-neutral-400">Coach / Academy Reference</div>
            <div className="font-medium text-white">{data.coachReference.name}</div>
            <div className="text-[10px] text-neutral-400">{data.coachReference.designation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
