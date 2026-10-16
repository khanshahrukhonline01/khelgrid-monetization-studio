import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import React from "react";
import {
  parseTrialDates,
  parseRegistrationDeadline,
  aggregateTrialsToCalendarEvents,
  groupEventsByDateString,
  generateIcsCalendar,
} from "@/lib/sports-calendar-utils";
import { TRIALS } from "@/data/trials";
import { SportsCalendar } from "./SportsCalendar";

describe("Sports Calendar Utilities & Date Aggregation", () => {
  it("parses multi-day trial date formats like 'Oct 23, 24 & 25, 2026'", () => {
    const res = parseTrialDates("Oct 23, 24 & 25, 2026");
    expect(res.primaryDate).toBeDefined();
    expect(res.allDates.length).toBe(3);
    expect(res.allDates[0].getDate()).toBe(23);
    expect(res.allDates[1].getDate()).toBe(24);
    expect(res.allDates[2].getDate()).toBe(25);
    expect(res.allDates[0].getMonth()).toBe(9); // 0-indexed: 9 is October
  });

  it("parses trial date ranges like 'Nov 5 - Nov 20, 2026'", () => {
    const res = parseTrialDates("Nov 5 - Nov 20, 2026");
    expect(res.primaryDate).toBeDefined();
    expect(res.allDates.length).toBe(16); // 5 to 20 inclusive
    expect(res.allDates[0].getDate()).toBe(5);
    expect(res.allDates[res.allDates.length - 1].getDate()).toBe(20);
    expect(res.allDates[0].getMonth()).toBe(10); // November
  });

  it("parses short two-day ranges like 'Oct 19 - Oct 20, 2026'", () => {
    const res = parseTrialDates("Oct 19 - Oct 20, 2026");
    expect(res.primaryDate).toBeDefined();
    expect(res.allDates.length).toBe(2);
    expect(res.allDates[0].getDate()).toBe(19);
    expect(res.allDates[1].getDate()).toBe(20);
    expect(res.allDates[0].getMonth()).toBe(9);
  });

  it("parses registration deadlines correctly", () => {
    const d1 = parseRegistrationDeadline("Oct 23, 2026");
    expect(d1).toBeDefined();
    expect(d1?.getDate()).toBe(23);
    expect(d1?.getMonth()).toBe(9);

    const d2 = parseRegistrationDeadline("Nov 2, 2026");
    expect(d2).toBeDefined();
    expect(d2?.getDate()).toBe(2);
    expect(d2?.getMonth()).toBe(10);
  });

  it("aggregates all TRIALS into calendar events with both trial days and deadlines", () => {
    const events = aggregateTrialsToCalendarEvents(TRIALS);
    expect(events.length).toBeGreaterThanOrEqual(TRIALS.length);

    const hasDeadlines = events.some((e) => e.type === "deadline");
    const hasTrialDays = events.some((e) => e.type === "trial_day");
    expect(hasDeadlines).toBe(true);
    expect(hasTrialDays).toBe(true);

    // Grouping by date
    const grouped = groupEventsByDateString(events);
    expect(grouped.size).toBeGreaterThan(5);

    // Check Oct 23 has SAI Boxing
    const oct23Events = grouped.get("2026-10-23");
    expect(oct23Events).toBeDefined();
    expect(oct23Events?.some((e) => e.sport === "Boxing")).toBe(true);

    // Check Oct 19 has Kho-Kho
    const oct19Events = grouped.get("2026-10-19");
    expect(oct19Events).toBeDefined();
    expect(oct19Events?.some((e) => e.sport === "Kho-Kho")).toBe(true);
  });

  it("generates valid iCalendar (.ics) format with VCALENDAR and VEVENT blocks", () => {
    const events = aggregateTrialsToCalendarEvents(TRIALS);
    const icsContent = generateIcsCalendar(events, "Test Sports Calendar");

    expect(icsContent).toContain("BEGIN:VCALENDAR");
    expect(icsContent).toContain("END:VCALENDAR");
    expect(icsContent).toContain("BEGIN:VEVENT");
    expect(icsContent).toContain("END:VEVENT");
    expect(icsContent).toContain("SUMMARY:");
    expect(icsContent).toContain("DTSTART:");
  });
});

describe("SportsCalendar Component Rendering", () => {
  it("renders monthly view with days of week and calendar metrics", () => {
    const html = renderToString(<SportsCalendar initialTrials={TRIALS} />);

    // Weekdays
    expect(html).toContain("Sun");
    expect(html).toContain("Mon");
    expect(html).toContain("Tue");
    expect(html).toContain("Wed");
    expect(html).toContain("Thu");
    expect(html).toContain("Fri");
    expect(html).toContain("Sat");

    // Title & controls
    expect(html).toContain("Sports Selection Calendar");
    expect(html).toContain("Monthly View");
    expect(html).toContain("Agenda for");
  });

  it("renders the centralized sports calendar container", () => {
    const html = renderToString(<SportsCalendar initialTrials={TRIALS} />);
    expect(html).toContain('id="centralized-sports-calendar"');
  });
});
