import { parse, isValid, format, eachDayOfInterval, isSameDay, startOfDay } from "date-fns";
import type { Trial } from "@/data/trials";

export interface CalendarEvent {
  id: string;
  trialId: string;
  trial: Trial;
  date: Date;
  dateString: string; // YYYY-MM-DD
  type: "trial_day" | "deadline" | "milestone";
  title: string;
  description?: string;
  sport: string;
  city: string;
  venue?: string;
  fee: number;
}

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const MONTH_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function getMonthIndex(name: string): number {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  const shortIdx = MONTH_SHORT.indexOf(clean.slice(0, 3));
  if (shortIdx !== -1) return shortIdx;
  return MONTH_NAMES.indexOf(clean);
}

/**
 * Parses flexible Indian sports trial date strings into structured Date array
 */
export function parseTrialDates(dateStr: string): {
  primaryDate: Date | null;
  allDates: Date[];
} {
  if (!dateStr || !dateStr.trim()) {
    return { primaryDate: null, allDates: [] };
  }

  const raw = dateStr.trim();
  const yearMatch = raw.match(/202[4-9]/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;

  // Case 1: "Oct 23, 24 & 25, 2026" or "Oct 23, 24, 25, 2026"
  const multiDayMatch = raw.match(/([A-Za-z]+)\s+([\d,\s&]+),\s*(202[4-9])/);
  if (multiDayMatch && (raw.includes("&") || raw.split(",").length > 2)) {
    const monthName = multiDayMatch[1];
    const monthIdx = getMonthIndex(monthName);
    const daysPart = multiDayMatch[2];
    const dayNumbers = daysPart
      .split(/[,\s&]+/)
      .map((d) => parseInt(d.trim(), 10))
      .filter((d) => !isNaN(d) && d >= 1 && d <= 31);

    if (monthIdx !== -1 && dayNumbers.length > 0) {
      const dates = dayNumbers.map((day) => new Date(year, monthIdx, day, 9, 0, 0));
      return { primaryDate: dates[0], allDates: dates };
    }
  }

  // Case 2: Range e.g. "Nov 5 - Nov 20, 2026" or "Nov 7 - Dec 15, 2026" or "Oct 19 - Oct 20, 2026"
  if (raw.includes(" - ")) {
    const [startPart, endPart] = raw.split(" - ").map((s) => s.trim());
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Check if startPart has month and day e.g. "Nov 5"
    const startMatch = startPart.match(/([A-Za-z]+)\s+(\d{1,2})/);
    const endMatch = endPart.match(/([A-Za-z]+)?\s*(\d{1,2})(?:,?\s*(202[4-9]))?/);

    if (startMatch) {
      const startMonth = getMonthIndex(startMatch[1]);
      const startDay = parseInt(startMatch[2], 10);
      if (startMonth !== -1 && !isNaN(startDay)) {
        startDate = new Date(year, startMonth, startDay, 9, 0, 0);
      }
    }

    if (endMatch && startDate) {
      const endMonth = endMatch[1] ? getMonthIndex(endMatch[1]) : startDate.getMonth();
      const endDay = parseInt(endMatch[2], 10);
      const endYear = endMatch[3] ? parseInt(endMatch[3], 10) : year;
      if (endMonth !== -1 && !isNaN(endDay)) {
        endDate = new Date(endYear, endMonth, endDay, 18, 0, 0);
      }
    }

    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
      if (endDate >= startDate) {
        // Cap range to max 30 consecutive days so huge multi-month tournaments don't flood every single cell
        const daysDiff = Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysDiff <= 31) {
          const days = eachDayOfInterval({ start: startDate, end: endDate });
          return { primaryDate: startDate, allDates: days };
        } else {
          // For very long tournaments, mark start and end dates
          return { primaryDate: startDate, allDates: [startDate, endDate] };
        }
      }
      return { primaryDate: startDate, allDates: [startDate] };
    }
  }

  // Case 3: Standard single date e.g. "Oct 23, 2026" or "October 23, 2026"
  const standardMatch = raw.match(/([A-Za-z]+)\s+(\d{1,2})(?:,?\s*(202[4-9]))?/);
  if (standardMatch) {
    const month = getMonthIndex(standardMatch[1]);
    const day = parseInt(standardMatch[2], 10);
    const parsedYear = standardMatch[3] ? parseInt(standardMatch[3], 10) : year;
    if (month !== -1 && !isNaN(day)) {
      const d = new Date(parsedYear, month, day, 9, 0, 0);
      if (isValid(d)) {
        return { primaryDate: d, allDates: [d] };
      }
    }
  }

  return { primaryDate: null, allDates: [] };
}

/**
 * Parses registration deadline into Date
 */
export function parseRegistrationDeadline(deadlineStr?: string): Date | null {
  if (!deadlineStr || !deadlineStr.trim()) return null;
  const raw = deadlineStr.trim();
  const yearMatch = raw.match(/202[4-9]/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : 2026;

  const match = raw.match(/([A-Za-z]+)\s+(\d{1,2})(?:,?\s*(202[4-9]))?/);
  if (match) {
    const month = getMonthIndex(match[1]);
    const day = parseInt(match[2], 10);
    const parsedYear = match[3] ? parseInt(match[3], 10) : year;
    if (month !== -1 && !isNaN(day)) {
      const d = new Date(parsedYear, month, day, 23, 59, 59);
      return isValid(d) ? d : null;
    }
  }
  return null;
}

/**
 * Converts a list of trials into calendar events indexed by YYYY-MM-DD
 */
export function aggregateTrialsToCalendarEvents(trials: Trial[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  trials.forEach((trial) => {
    // 1. Trial active dates
    const { allDates } = parseTrialDates(trial.date);
    allDates.forEach((d, idx) => {
      events.push({
        id: `${trial.id}-day-${idx}-${format(d, "yyyy-MM-dd")}`,
        trialId: trial.id,
        trial,
        date: d,
        dateString: format(d, "yyyy-MM-dd"),
        type: "trial_day",
        title: trial.title,
        sport: trial.sport,
        city: trial.city,
        venue: trial.venue,
        fee: trial.fee,
        description: `Selection trial for ${trial.sport} in ${trial.city} (${trial.date}). Organized by ${trial.academy}.`,
      });
    });

    // 2. Registration deadline event (if present)
    const deadlineDate = parseRegistrationDeadline(trial.registrationDeadline);
    if (deadlineDate) {
      events.push({
        id: `${trial.id}-deadline-${format(deadlineDate, "yyyy-MM-dd")}`,
        trialId: trial.id,
        trial,
        date: deadlineDate,
        dateString: format(deadlineDate, "yyyy-MM-dd"),
        type: "deadline",
        title: `Registration Deadline: ${trial.title}`,
        sport: trial.sport,
        city: trial.city,
        venue: trial.venue,
        fee: trial.fee,
        description: `Last date to register for ${trial.title}. Fee: ${trial.fee === 0 ? "Free Entry" : "₹" + trial.fee}.`,
      });
    }

    // 3. Timelines milestones (if present)
    if (trial.timelines && Array.isArray(trial.timelines)) {
      trial.timelines.forEach((timeline, tIdx) => {
        const { primaryDate } = parseTrialDates(timeline.date);
        if (primaryDate) {
          events.push({
            id: `${trial.id}-timeline-${tIdx}-${format(primaryDate, "yyyy-MM-dd")}`,
            trialId: trial.id,
            trial,
            date: primaryDate,
            dateString: format(primaryDate, "yyyy-MM-dd"),
            type: "milestone",
            title: `${timeline.label}: ${trial.sport} (${trial.city})`,
            sport: trial.sport,
            city: trial.city,
            venue: trial.venue,
            fee: trial.fee,
            description: timeline.description || timeline.label,
          });
        }
      });
    }
  });

  return events;
}

/**
 * Groups events by date key "YYYY-MM-DD"
 */
export function groupEventsByDateString(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  events.forEach((ev) => {
    const list = map.get(ev.dateString) || [];
    // Prevent duplicate trial entries on the same day
    if (!list.some((existing) => existing.trialId === ev.trialId && existing.type === ev.type)) {
      list.push(ev);
    }
    map.set(ev.dateString, list);
  });
  return map;
}

/**
 * Generates an iCalendar (.ics) format string for export
 */
export function generateIcsCalendar(
  events: CalendarEvent[],
  calendarName = "KhelGrid Sports Trials Calendar",
): string {
  const cleanEvents = events.filter((e) => isValid(e.date));
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KhelGrid//Sports Calendar//EN",
    `X-WR-CALNAME:${calendarName}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  cleanEvents.forEach((ev) => {
    const startStr = format(ev.date, "yyyyMMdd'T'090000");
    const endStr = format(ev.date, "yyyyMMdd'T'180000");
    const nowStr = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.id}@khelgrid.com`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push(`DTSTART:${startStr}`);
    lines.push(`DTEND:${endStr}`);
    lines.push(`SUMMARY:${ev.title.replace(/[,;]/g, " ")}`);
    lines.push(
      `DESCRIPTION:${(ev.description || ev.title).replace(/[\r\n]+/g, " ").replace(/[,;]/g, " ")}`,
    );
    if (ev.venue) {
      lines.push(`LOCATION:${ev.venue.replace(/[,;]/g, " ")}`);
    }
    lines.push(`CATEGORIES:${ev.sport},Sports Selection Trials`);
    lines.push(`URL:https://www.khelgrid.com/trial/${ev.trialId}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
