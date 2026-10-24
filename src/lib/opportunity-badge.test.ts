import { describe, it, expect } from "vitest";
import { TRIALS } from "@/data/trials";
import {
  getRealtimeOpportunityBadge,
  getTrialEndDate,
  getTrialStartDate,
  isTrialArchived,
  parseTrialDate,
} from "./opportunity-badge";

describe("Trial archive date handling", () => {
  const referenceNow = new Date("2026-10-22T12:00:00+05:30");

  it("parses the start and end of compact and cross-month date ranges", () => {
    expect(getTrialStartDate("Oct 26–28, 2026")?.getDate()).toBe(26);
    expect(getTrialEndDate("Oct 26–28, 2026")?.getDate()).toBe(28);
    expect(getTrialStartDate("Oct 23, 24 & 25, 2026")?.getDate()).toBe(23);
    expect(getTrialEndDate("Oct 23, 24 & 25, 2026")?.getDate()).toBe(25);
    expect(getTrialStartDate("Nov 01 - Nov 18, 2026")?.getDate()).toBe(1);
    expect(getTrialEndDate("Nov 01 - Nov 18, 2026")?.getDate()).toBe(18);
    expect(getTrialStartDate("Dec 30, 2026 - Jan 04, 2027")?.getFullYear()).toBe(2026);
    expect(getTrialEndDate("Dec 30, 2026 - Jan 04, 2027")?.getFullYear()).toBe(2027);
  });

  it("archives only after the event end date has passed", () => {
    expect(isTrialArchived({ date: "Oct 19 - Oct 20, 2026" }, referenceNow)).toBe(true);
    expect(isTrialArchived({ date: "Oct 23, 24 & 25, 2026" }, referenceNow)).toBe(false);
    expect(isTrialArchived({ date: "Oct 26–28, 2026" }, referenceNow)).toBe(false);
  });

  it("marks completed date ranges as closed in card badges", () => {
    const badge = getRealtimeOpportunityBadge(
      { date: "Oct 19 - Oct 20, 2026", spots: 12, badge: undefined, urgencyText: undefined },
      referenceNow,
    );
    expect(badge?.isExpired).toBe(true);
    expect(badge?.label).toBe("Closed");
  });

  it("keeps the SGFI calendar fixtures uniquely identified and date-parseable", () => {
    const fixtures = TRIALS.filter((trial) => trial.id.startsWith("t-sgfi-70th-"));
    const ids = fixtures.map((trial) => trial.id);

    expect(fixtures.length).toBeGreaterThanOrEqual(50);
    expect(new Set(ids).size).toBe(ids.length);
    expect(
      fixtures.every(
        (trial) =>
          trial.listingType === "competition" &&
          Boolean(getTrialStartDate(trial.date)) &&
          Boolean(getTrialEndDate(trial.date)) &&
          trial.sourceUrl?.includes("sgfi.org.in"),
      ),
    ).toBe(true);
  });

  it("does not automatically archive records with unparseable dates", () => {
    expect(isTrialArchived({ date: "Date to be announced" }, referenceNow)).toBe(false);
  });
});

describe("Real-time Opportunity Badge Calculation", () => {
  const referenceNow = new Date("2026-09-26T12:00:00Z");

  it("returns 'Closed' badge when trial date is in the past", () => {
    const expiredTrial = {
      date: "2026-09-20",
      registrationDeadline: "2026-09-20",
      badge: "Popular" as const,
      spots: 50,
      urgencyText: "Concluded",
    };

    const badge = getRealtimeOpportunityBadge(expiredTrial, referenceNow);
    expect(badge).not.toBeNull();
    expect(badge?.label).toBe("Closed");
    expect(badge?.isExpired).toBe(true);
    expect(badge?.style).toContain("line-through");
  });

  it("returns 'Closing Soon' when less than 24 hours remain", () => {
    // 6 hours in the future
    const nearDeadline = new Date(referenceNow.getTime() + 6 * 60 * 60 * 1000).toISOString();
    const urgentTrial = {
      date: nearDeadline,
      registrationDeadline: nearDeadline,
      badge: "Closing Soon" as const,
      spots: 10,
      urgencyText: "Ends tonight",
    };

    const badge = getRealtimeOpportunityBadge(urgentTrial, referenceNow);
    expect(badge).not.toBeNull();
    expect(badge?.label).toBe("Closing Soon");
    expect(badge?.isUrgent).toBe(true);
    expect(badge?.isExpired).toBe(false);
  });

  it("returns 'Closes in Xd' when between 24 and 72 hours remain", () => {
    // 48 hours in the future
    const twoDaysDeadline = new Date(referenceNow.getTime() + 48 * 60 * 60 * 1000).toISOString();
    const trial = {
      date: twoDaysDeadline,
      registrationDeadline: twoDaysDeadline,
      spots: 30,
      urgencyText: "Closes soon",
    };

    const badge = getRealtimeOpportunityBadge(trial, referenceNow);
    expect(badge).not.toBeNull();
    expect(badge?.label).toMatch(/Closes in \d+d/);
    expect(badge?.isUrgent).toBe(true);
  });

  it("returns 'High Demand' when spots are 20 or fewer", () => {
    const futureDate = new Date(referenceNow.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const trial = {
      date: futureDate,
      registrationDeadline: futureDate,
      spots: 8,
      urgencyText: "Final spots",
      badge: "High Demand" as const,
    };

    const badge = getRealtimeOpportunityBadge(trial, referenceNow);
    expect(badge).not.toBeNull();
    expect(badge?.label).toBe("High Demand");
  });

  it("returns 'New' for freshly added opportunities", () => {
    const futureDate = new Date(referenceNow.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString();
    const trial = {
      date: futureDate,
      registrationDeadline: futureDate,
      spots: 50,
      badge: "New" as const,
    };

    const badge = getRealtimeOpportunityBadge(trial, referenceNow);
    expect(badge).not.toBeNull();
    expect(badge?.label).toBe("New");
  });

  it("correctly parses human-formatted dates", () => {
    const parsed = parseTrialDate("Sep 26, 2026");
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(8); // September is 8 (0-indexed)
  });
});
