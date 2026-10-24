import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { UNVERIFIED_SAMPLE_TRIAL_IDS } from "@/data/trials";
import { getTrialEndDate } from "@/lib/opportunity-badge";
import type { Database } from "@/types/database";

export type TrialRow = Database["public"]["Tables"]["trials"]["Row"];

export interface TrialDiscoveryItem {
  id: string;
  title: string;
  academy: string;
  sport: string;
  city: string;
  state?: string;
  venue?: string;
  date: string;
  registrationDeadline?: string;
  fee: number;
  feeLabel?: string;
  spots: number;
  tag: string;
  ageCategory?: string;
  gender?: string;
  eligibility?: string;
  verifiedLabel?: string;
  urgencyText?: string;
  badge?: "New" | "Closing Soon" | "High Demand" | "Scouted" | "Popular";
  sourceUrl?: string;
  sourceLabel?: string;
  sources?: Array<{ label: string; url: string }>;
  timelines?: Array<{ label: string; date: string; description?: string }>;
  organizerContacts?: Array<{ title: string; name: string; email?: string; phone?: string }>;
  applyUrl?: string;
  isGovernmentQuota?: boolean;
  status?: string;
  isSupabaseOrigin?: boolean;
  requiredDocuments?: string[];
  selectionProcess?: string;
  lastVerified?: string;
  listingType?: "trial" | "competition";
  entryStatus?: string;
}

/**
 * Normalizes a Supabase trial row into a TrialDiscoveryItem
 */
export function normalizeSupabaseTrial(row: TrialRow): TrialDiscoveryItem {
  return {
    id: row.external_id || row.id,
    title: row.title,
    academy: row.academy_name,
    sport: row.sport,
    city: row.city,
    state: row.state || undefined,
    venue: row.venue_name || undefined,
    date: row.trial_date,
    registrationDeadline: row.registration_deadline || undefined,
    fee: Number(row.fee) || 0,
    spots: row.spots_available > 0 ? row.spots_available : row.spots_total,
    tag: row.tag || "Open",
    ageCategory: row.age_category || undefined,
    gender: row.gender || undefined,
    eligibility: row.eligibility || undefined,
    verifiedLabel: row.verified_label || undefined,
    urgencyText:
      row.urgency_text || (row.reporting_time ? `Reporting at ${row.reporting_time}` : undefined),
    badge:
      (row.badge as "New" | "Closing Soon" | "High Demand" | "Scouted" | "Popular") || undefined,
    sources: Array.isArray(row.sources)
      ? (row.sources as Array<{ label: string; url: string }>)
      : undefined,
    timelines: Array.isArray(row.timelines)
      ? (row.timelines as Array<{ label: string; date: string; description?: string }>)
      : undefined,
    organizerContacts: Array.isArray(row.organizer_contacts)
      ? (row.organizer_contacts as Array<{
          title: string;
          name: string;
          email?: string;
          phone?: string;
        }>)
      : undefined,
    sourceUrl: row.source_url || undefined,
    sourceLabel: row.source_label || undefined,
    applyUrl: row.apply_url || undefined,
    isGovernmentQuota: row.is_government_quota || false,
    status: row.status,
    isSupabaseOrigin: true,
    requiredDocuments: Array.isArray(row.required_documents) ? row.required_documents : undefined,
    selectionProcess: row.selection_process || undefined,
    lastVerified: row.last_verified
      ? new Date(row.last_verified).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined,
  };
}

/**
 * Fetches all available and active sports trials from Supabase.
 * Uses Supabase as the only source of truth; errors return an empty result with an error message.
 */
export async function fetchAvailableTrialsFromSupabase(options?: {
  sport?: string;
  city?: string;
  maxLimit?: number;
  archive?: boolean;
}): Promise<{
  trials: TrialDiscoveryItem[];
  isSupabaseLive: boolean;
  totalCount: number;
  error?: string;
}> {
  const limit = options?.maxLimit || 50;
  const archive = options?.archive === true;
  let isSupabaseLive = false;
  let databaseTrials: TrialDiscoveryItem[] = [];
  let queryError: string | undefined;

  if (!isSupabaseConfigured) {
    queryError = "Supabase is not configured in this deployment.";
  }

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from("trials").select("*");

      // The active feed uses active/upcoming records. Archive mode reads all statuses
      // and then applies the same event-end-date rule as the UI.
      if (!archive) query = query.in("status", ["active", "upcoming"]);
      if (options?.sport && options.sport !== "All Sports" && options.sport !== "all") {
        query = query.eq("sport", options.sport);
      }
      if (options?.city && options.city !== "All Locations" && options.city !== "all") {
        query = query.eq("city", options.city);
      }

      const { data, error } = await query.order("trial_date", { ascending: true }).limit(500);
      if (!error) {
        isSupabaseLive = true;
        databaseTrials = (data || []).filter((row) => !((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(row.id)) && !((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(row.external_id || "")).map(normalizeSupabaseTrial);
      } else {
        queryError = error.message;
        console.warn("Supabase trials query failed:", error.message);
      }
    } catch (err: unknown) {
      queryError = err instanceof Error ? err.message : String(err);
      console.warn(
        "Supabase trials query failed, using curated listings:",
        queryError,
      );
    }
  }

  // Supabase is the source of truth. Do not merge hard-coded curated cards
  // into a successful database response; stable external IDs preserve card URLs.
  const merged = new Map<string, TrialDiscoveryItem>();
  for (const trial of databaseTrials) merged.set(trial.id, trial);

  const now = new Date();
  let results = Array.from(merged.values()).filter((trial) => {
    const endDate = getTrialEndDate(trial.date);

    // Never present static mock/curated data as a database result.
    // Archive mode still applies date rules so expired listings remain findable there.
    if (queryError) return false;
    if (!endDate) return !archive;
    return archive ? endDate.getTime() < now.getTime() : endDate.getTime() >= now.getTime();
  });

  if (options?.sport && options.sport !== "All Sports" && options.sport !== "all") {
    results = results.filter((trial) => trial.sport.toLowerCase() === options.sport?.toLowerCase());
  }
  if (options?.city && options.city !== "All Locations" && options.city !== "all") {
    results = results.filter((trial) => trial.city.toLowerCase() === options.city?.toLowerCase());
  }

  return {
    trials: results.slice(0, limit),
    isSupabaseLive,
    totalCount: results.length,
    error: queryError,
  };
}

/**
 * Searches trials in Supabase using full-text search and filters.
 */
export async function searchTrialsInSupabase(params: {
  query?: string;
  sport?: string;
  city?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ trials: TrialDiscoveryItem[]; isSupabaseLive: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { trials: [], isSupabaseLive: false };
  }

  try {
    const { data, error } = await supabase.rpc("search_trials", {
      p_query: params.query || null,
      p_sport: params.sport || null,
      p_city: params.city || null,
      p_category: params.category || null,
      p_limit: params.limit || 50,
      p_offset: params.offset || 0,
    });

    if (error) {
      console.warn("RPC search_trials error, falling back:", error.message);
      return { trials: [], isSupabaseLive: false, error: error.message };
    }

    if (data && data.length > 0) {
      return {
        trials: data.map(normalizeSupabaseTrial).filter((trial) => !((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(trial.id))),
        isSupabaseLive: true,
      };
    }
  } catch (err: unknown) {
    console.warn("Supabase search exception:", err instanceof Error ? err.message : String(err));
  }

  return { trials: [], isSupabaseLive: false };
}

/**
 * Syncs curated trials (including CRPF, KCA, UP Sports Directorate, etc.) to Supabase database.
 */
export async function syncCuratedTrialsToSupabase(): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, insertedCount: 0, error: "Supabase is not configured" };
  }

  try {
    const rowsToUpsert = TRIALS.map((t) => {
      // Map ISO or standard date
      let parsedDate = new Date().toISOString().split("T")[0];
      if (t.date && /\d{4}/.test(t.date)) {
        // approximate standard date
        const match = t.date.match(/(\w{3})\s+(\d{1,2})/);
        if (match) {
          parsedDate = "2026-11-15";
        }
      }

      return {
        id: t.id,
        title: t.title,
        academy_name: t.academy,
        sport: t.sport,
        city: t.city,
        venue_name: t.venue || null,
        trial_date: parsedDate,
        reporting_time: t.urgencyText || null,
        fee: t.fee,
        spots_total: t.spots,
        spots_available: t.spots,
        tag: t.tag,
        age_category: t.ageCategory || null,
        gender: t.gender || null,
        verified_label: t.verifiedLabel || null,
        urgency_text: t.urgencyText || null,
        badge: t.badge || null,
        eligibility: t.eligibility || null,
        required_documents: t.requiredDocuments || [],
        selection_process: t.selectionProcess || null,
        registration_deadline: t.registrationDeadline || null,
        source_url: t.sourceUrl || null,
        source_label: t.sourceLabel || null,
        sources: (t.sources as unknown as Json) || [],
        timelines: (t.timelines as unknown as Json) || [],
        organizer_contacts: (t.organizerContacts as unknown as Json) || [],
        apply_url: t.id.includes("crpf") ? "https://rect.crpf.gov.in" : t.sourceUrl || null,
        is_government_quota:
          t.tag.toLowerCase().includes("govt") || t.tag.toLowerCase().includes("directorate"),
        status: "active" as const,
        last_verified: new Date().toISOString(),
      };
    });

    const { data, error } = await supabase
      .from("trials")
      .upsert(rowsToUpsert, { onConflict: "id" })
      .select("id");

    if (error) {
      return { success: false, insertedCount: 0, error: error.message };
    }

    return {
      success: true,
      insertedCount: data ? data.length : rowsToUpsert.length,
    };
  } catch (err: unknown) {
    return {
      success: false,
      insertedCount: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
