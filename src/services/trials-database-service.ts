import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TRIALS, UNVERIFIED_SAMPLE_TRIAL_IDS, type Trial } from "@/data/trials";
import type { Database } from "@/types/database";
import { normalizeSupabaseTrial, type TrialDiscoveryItem } from "@/lib/trials-service";

export type TrialRow = Database["public"]["Tables"]["trials"]["Row"];
export type SavedOpportunityRow = Database["public"]["Tables"]["saved_opportunities"]["Row"];
export type VenueReviewRow = Database["public"]["Tables"]["venue_reviews"]["Row"];

export interface TrialsSummaryStats {
  totalTrials: number;
  activeTrials: number;
  govtQuotaTrials: number;
  totalVacancies: number;
  distinctSports: number;
  distinctCities: number;
  isSupabaseLive: boolean;
}

/**
 * Service to interact with enhanced trials and user opportunities in Supabase.
 */
export const trialsDatabaseService = {
  /**
   * Fetches statistics about trials from Supabase RPC or calculates from static data.
   */
  async getSummaryStats(): Promise<TrialsSummaryStats> {
    if (isSupabaseConfigured) {
      try {
        const rpcCaller = supabase.rpc as unknown as (
          fn: string,
        ) => Promise<{ data: unknown; error: unknown }>;
        const { data, error } = (await rpcCaller("get_trials_summary_stats")) as {
          data: {
            total_trials: number;
            active_trials: number;
            govt_quota_trials: number;
            total_vacancies: number;
            distinct_sports: number;
            distinct_cities: number;
          } | null;
          error: unknown;
        };
        if (!error && data) {
          return {
            totalTrials: data.total_trials,
            activeTrials: data.active_trials,
            govtQuotaTrials: data.govt_quota_trials,
            totalVacancies: data.total_vacancies,
            distinctSports: data.distinct_sports,
            distinctCities: data.distinct_cities,
            isSupabaseLive: true,
          };
        }
      } catch (err) {
        console.warn("Failed to get trial stats from Supabase:", err);
      }
    }

    // Static fallback calculations
    const active = TRIALS.length;
    const govt = TRIALS.filter(
      (t) =>
        t.tag.toLowerCase().includes("govt") ||
        t.tag.toLowerCase().includes("directorate") ||
        t.id.includes("crpf") ||
        t.id.includes("sai"),
    ).length;
    const vacancies = TRIALS.reduce((acc, t) => acc + (t.spots || 0), 0);
    const sports = new Set(TRIALS.map((t) => t.sport.toLowerCase())).size;
    const cities = new Set(TRIALS.map((t) => t.city.toLowerCase())).size;

    return {
      totalTrials: active,
      activeTrials: active,
      govtQuotaTrials: govt,
      totalVacancies: vacancies,
      distinctSports: sports,
      distinctCities: cities,
      isSupabaseLive: false,
    };
  },

  /**
   * Retrieves a single trial by ID from Supabase or static TRIALS.
   */
  async getTrialById(trialId: string): Promise<TrialDiscoveryItem | null> {
    if ((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(trialId)) return null;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("trials")
          .select("*")
          .eq("id", trialId)
          .maybeSingle();

        if (!error && data) {
          return normalizeSupabaseTrial(data);
        }
      } catch (err) {
        console.warn("Failed to get trial from Supabase:", err);
      }
    }

    const staticItem = TRIALS.find((t) => t.id === trialId);
    if (staticItem) {
      return {
        ...staticItem,
        isSupabaseOrigin: false,
      };
    }

    return null;
  },

  /**
   * Retrieves all reviews for a venue.
   */
  async getVenueReviews(venueId: string): Promise<VenueReviewRow[]> {
    if (!isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from("venue_reviews")
        .select("*")
        .eq("venue_id", venueId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Failed to fetch venue reviews:", err);
    }

    return [];
  },

  /**
   * Submits a verified review for a venue.
   */
  async submitVenueReview(params: {
    venueId: string;
    userName: string;
    rating: number;
    comment?: string;
    sport?: string;
    verifiedBooking?: boolean;
    userId?: string;
  }): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, error: "Database is not connected" };
    }

    try {
      const { error } = await supabase.from("venue_reviews").insert({
        venue_id: params.venueId,
        user_name: params.userName.trim(),
        rating: Math.min(5, Math.max(1, params.rating)),
        comment: params.comment?.trim() || null,
        sport: params.sport || null,
        verified_booking: params.verifiedBooking || false,
        user_id: params.userId || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
};

export default trialsDatabaseService;
