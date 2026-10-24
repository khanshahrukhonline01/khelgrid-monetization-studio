import { Sparkles, Clock, Flame, Star, Trophy, XCircle, AlertTriangle } from "lucide-react";
import type { Trial } from "@/data/trials";

export interface ComputedOpportunityBadge {
  label: string;
  sublabel?: string;
  icon: typeof Sparkles;
  style: string;
  dotStyle: string;
  isExpired: boolean;
  isUrgent: boolean;
}

/**
 * Parses dates formatted like:
 * - "Mar 14, 2026"
 * - "Apr 02, 2026"
 * - ISO string "2026-03-14"
 */
export function parseTrialDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    // If the string only has a date (no time), set it to the end of the day local/UTC
    if (!dateStr.includes(":") && !dateStr.includes("T")) {
      parsed.setHours(23, 59, 59, 999);
    }
    return parsed;
  }
  return null;
}

/**
 * Returns the end date of a scheduled opportunity. Handles single dates and
 * common published ranges such as "Oct 26–28, 2026", "Oct 23, 24 & 25, 2026",
 * and "Oct 27 - Nov 05, 2026". Unparseable/tentative dates return null.
 */
export function getTrialEndDate(dateStr?: string): Date | null {
  if (!dateStr?.trim()) return null;

  let clean = dateStr.trim().split("·")[0].replace(/\([^)]*\)/g, "").trim();
  clean = clean.replace(/[–—]/g, "-");

  const finish = (value: string): Date | null => {
    const parsed = new Date(value.trim());
    if (Number.isNaN(parsed.getTime())) return null;
    if (!value.includes("T")) parsed.setHours(23, 59, 59, 999);
    return parsed;
  };

  // Compact same-month range: "Oct 26-28, 2026".
  const compactRange = clean.match(/^([A-Za-z]{3,9})\s+(\d{1,2})\s*-\s*(\d{1,2}),?\s*(\d{4})$/i);
  if (compactRange) {
    return finish(`${compactRange[1]} ${compactRange[3]}, ${compactRange[4]}`);
  }

  // Multiple days in one month: "Oct 23, 24 & 25, 2026".
  const multiDay = clean.match(/^([A-Za-z]{3,9})\s+\d{1,2},\s*\d{1,2}\s*(?:&|and|,)\s*(\d{1,2}),?\s*(\d{4})$/i);
  if (multiDay) {
    return finish(`${multiDay[1]} ${multiDay[2]}, ${multiDay[3]}`);
  }

  // Explicit date range: use the right-hand date as the event end.
  const rangeParts = clean.split(/\s+-\s+/);
  if (rangeParts.length >= 2) {
    const endPart = rangeParts[rangeParts.length - 1].trim();
    const explicitEnd = finish(endPart);
    if (explicitEnd) return explicitEnd;

    // Range end omits the month: "Oct 26 - 28, 2026".
    const endWithoutMonth = endPart.match(/^(\d{1,2}),?\s*(\d{4})$/);
    const startMonth = rangeParts[0].match(/^([A-Za-z]{3,9})\s+/);
    if (endWithoutMonth && startMonth) {
      return finish(`${startMonth[1]} ${endWithoutMonth[1]}, ${endWithoutMonth[2]}`);
    }
  }

  return finish(clean);
}

/**
 * Parses the first scheduled day from common trial/event date ranges.
 * Returns null when the source has no reliable calendar date.
 */
export function getTrialStartDate(dateStr?: string): Date | null {
  if (!dateStr?.trim()) return null;

  const clean = dateStr.trim().split("·")[0].replace(/\([^)]*\)/g, "").replace(/[–—]/g, "-").trim();
  const startPart = clean.split(/\s+-\s+/)[0].trim();
  const direct = new Date(startPart);
  if (!Number.isNaN(direct.getTime()) && /\b20\d{2}\b/.test(startPart)) {
    direct.setHours(0, 0, 0, 0);
    return direct;
  }

  const firstDay = startPart.match(/^([A-Za-z]{3,9})\s+(\d{1,2})/);
  const years = [...clean.matchAll(/\b(20\d{2})\b/g)].map((match) => match[1]);
  const year = startPart.match(/\b(20\d{2})\b/)?.[1] || years[years.length - 1];
  if (!firstDay || !year) return null;

  const parsed = new Date(`${firstDay[1]} ${firstDay[2]}, ${year}`);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

/** True only after the scheduled event's final date has elapsed. */
export function isTrialArchived(trial: Pick<Trial, "date">, currentDate: Date = new Date()): boolean {
  const endDate = getTrialEndDate(trial.date);
  return Boolean(endDate && endDate.getTime() < currentDate.getTime());
}

/**
 * Computes dynamic, real-time date-based badges for sports opportunity cards:
 * 1. "Closed" (Red/Muted) - when the trial date / registration deadline is in the past.
 * 2. "Closing Soon" (Rose/Red) - within 24 hours of closing.
 * 3. "High Demand" (Amber) - spots filling fast (< 20 spots or explicit high demand).
 * 4. "New" (Emerald) - freshly added trials.
 * 5. "Scouted" / "Popular" - verified federation or pro scout presence.
 */
export function getRealtimeOpportunityBadge(
  trial: Pick<Trial, "date" | "registrationDeadline" | "badge" | "spots" | "urgencyText">,
  currentDate: Date = new Date(),
): ComputedOpportunityBadge | null {
  // A listing is closed if either its registration deadline or event end date has passed.
  // Use the earlier published date so a stale deadline cannot leave a finished event open.
  const statusDates = [getTrialEndDate(trial.registrationDeadline), getTrialEndDate(trial.date)]
    .filter((date): date is Date => Boolean(date));
  const targetDate = statusDates.length
    ? new Date(Math.min(...statusDates.map((date) => date.getTime())))
    : null;

  if (targetDate) {
    const diffMs = targetDate.getTime() - currentDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // 1. Expired / Past Date -> "Closed"
    if (diffMs <= 0) {
      return {
        label: "Closed",
        sublabel: "Registration ended",
        icon: XCircle,
        style:
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30 line-through opacity-85 shadow-xs",
        dotStyle: "bg-slate-400 dark:bg-slate-500",
        isExpired: true,
        isUrgent: false,
      };
    }

    // 2. Less than or equal to 24 hours -> "Closing Soon"
    if (diffHours <= 24) {
      const hoursRemaining = Math.max(1, Math.ceil(diffHours));
      return {
        label: "Closing Soon",
        sublabel: `${hoursRemaining}h left`,
        icon: AlertTriangle,
        style:
          "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 shadow-xs animate-pulse",
        dotStyle: "bg-rose-500 animate-ping",
        isExpired: false,
        isUrgent: true,
      };
    }

    // 3. Between 24 hours and 72 hours -> "Closes in Xd" / "Closing Soon"
    if (diffHours <= 72) {
      const daysRemaining = Math.ceil(diffHours / 24);
      return {
        label: `Closes in ${daysRemaining}d`,
        sublabel: `${daysRemaining} days left`,
        icon: Clock,
        style: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 shadow-xs",
        dotStyle: "bg-rose-500",
        isExpired: false,
        isUrgent: true,
      };
    }
  }

  // 4. Low Spots / Explicit High Demand -> "High Demand"
  if (
    trial.badge === "High Demand" ||
    (typeof trial.spots === "number" && trial.spots > 0 && trial.spots <= 20) ||
    trial.urgencyText?.toLowerCase().includes("filling fast") ||
    trial.urgencyText?.toLowerCase().includes("final")
  ) {
    return {
      label: "High Demand",
      sublabel: "Filling fast",
      icon: Flame,
      style: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 shadow-xs",
      dotStyle: "bg-amber-500",
      isExpired: false,
      isUrgent: false,
    };
  }

  // 5. New Trials
  if (trial.badge === "New") {
    return {
      label: "New",
      sublabel: "Recently added",
      icon: Sparkles,
      style:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-xs",
      dotStyle: "bg-emerald-500 animate-pulse",
      isExpired: false,
      isUrgent: false,
    };
  }

  // 6. Scouted Trials
  if (trial.badge === "Scouted" || trial.urgencyText?.toLowerCase().includes("scout")) {
    return {
      label: "Scouted",
      sublabel: "Pro scouts present",
      icon: Star,
      style: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 shadow-xs",
      dotStyle: "bg-indigo-500",
      isExpired: false,
      isUrgent: false,
    };
  }

  // 7. Popular Trials
  if (trial.badge === "Popular") {
    return {
      label: "Popular",
      sublabel: "High participation",
      icon: Trophy,
      style: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30 shadow-xs",
      dotStyle: "bg-sky-500",
      isExpired: false,
      isUrgent: false,
    };
  }

  // Fallback if badge is set to "Closing Soon" manually even without date match
  if (trial.badge === "Closing Soon") {
    return {
      label: "Closing Soon",
      sublabel: "Registration closing",
      icon: Clock,
      style: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 shadow-xs",
      dotStyle: "bg-rose-500",
      isExpired: false,
      isUrgent: true,
    };
  }

  return null;
}
