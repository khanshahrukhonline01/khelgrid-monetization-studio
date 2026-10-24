import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { TrialsDiscoveryDashboard } from "./TrialsDiscoveryDashboard";
import {
  fetchAvailableTrialsFromSupabase,
  normalizeSupabaseTrial,
  type TrialRow,
} from "@/lib/trials-service";

// Mock router and auth
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={typeof to === "string" ? to : "#"} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "user-athlete-mehta",
      name: "Arjun Mehta",
    },
    applications: ["t-1"],
    applyToTrial: vi.fn(),
  }),
}));

describe("TrialsDiscoveryDashboard Component & Supabase Fetching Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("normalizes a Supabase trial row into a TrialDiscoveryItem with all metadata", () => {
    const mockRow: TrialRow = {
      id: "supabase-uuid-1234",
      venue_id: "venue-uuid-5678",
      academy_name: "Karnataka State Cricket Academy",
      title: "State U-19 Seam Bowlers Selection Camp",
      sport: "Cricket",
      city: "Bengaluru",
      venue_name: "Chinnaswamy Outdoor Practice Ground",
      trial_date: "2026-10-15",
      reporting_time: "07:30 AM",
      fee: 0,
      spots_total: 40,
      spots_available: 18,
      tag: "Official KSCA",
      eligibility: "Born on or after Sep 1, 2007",
      required_documents: ["Aadhaar", "Birth Certificate"],
      selection_process: "Net bowling spell assessment",
      registration_deadline: "2026-10-12",
      source_url: "https://ksca.cricket/trials",
      source_label: "KSCA Official Selection Notification",
      last_verified: "2026-09-29T10:00:00Z",
      status: "active",
      created_at: "2026-09-29T00:00:00Z",
      updated_at: "2026-09-29T00:00:00Z",
    };

    const item = normalizeSupabaseTrial(mockRow);
    expect(item.id).toBe("supabase-uuid-1234");
    expect(item.title).toBe("State U-19 Seam Bowlers Selection Camp");
    expect(item.academy).toBe("Karnataka State Cricket Academy");
    expect(item.sport).toBe("Cricket");
    expect(item.city).toBe("Bengaluru");
    expect(item.venue).toBe("Chinnaswamy Outdoor Practice Ground");
    expect(item.spots).toBe(18);
    expect(item.fee).toBe(0);
    expect(item.isSupabaseOrigin).toBe(true);
    expect(item.urgencyText).toBe("Reporting at 07:30 AM");
  });

  it("does not invent trial listings when live Supabase data is unavailable", async () => {
    const res = await fetchAvailableTrialsFromSupabase({
      maxLimit: 10,
    });

    expect(res.trials).toBeDefined();
    expect(Array.isArray(res.trials)).toBe(true);
    if (!res.isSupabaseLive) {
      expect(res.trials).toEqual([]);
      expect(res.totalCount).toBe(0);
    } else {
      expect(res.trials.every((trial) => trial.isSupabaseOrigin)).toBe(true);
      expect(res.totalCount).toBeGreaterThanOrEqual(res.trials.length);
    }
  });

  it("filters trials by sport using fetchAvailableTrialsFromSupabase", async () => {
    const res = await fetchAvailableTrialsFromSupabase({
      sport: "Cricket",
    });

    expect(res.trials.every((t) => t.sport === "Cricket")).toBe(true);
  });

  it("renders TrialsDiscoveryDashboard with grid view container, search bar and controls", () => {
    const html = renderToString(<TrialsDiscoveryDashboard defaultSport="All Sports" />);

    // Header & Supabase status badge
    expect(html).toContain('id="trials-discovery-dashboard-component"');
    expect(html).toContain("Trials Discovery Grid");
    expect(html).toContain("Verified Database Sync");

    // Search and filter controls
    expect(html).toContain('id="input-trials-discovery-search"');
    expect(html).toContain('id="select-trials-discovery-sport"');
    expect(html).toContain('id="select-trials-discovery-city"');
    expect(html).toContain("Free Entry (₹0)");

    // Renders either loading skeleton or grid container
    const hasGridOrSkeleton =
      html.includes('id="trials-grid-container"') || html.includes("animate-pulse");
    expect(hasGridOrSkeleton).toBe(true);
  });
});
