import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TRIALS, UNVERIFIED_SAMPLE_TRIAL_IDS } from "@/data/trials";
import { normalizeSupabaseTrial, type TrialDiscoveryItem } from "@/lib/trials-service";

/**
 * Server-side function to retrieve active trials from the Supabase database.
 * Executes on the backend server to ensure database records are handled backend-side.
 */
export const getBackendTrials = createServerFn({ method: "GET" })
  .validator((d: { sport?: string; city?: string; maxLimit?: number } | undefined) => d || {})
  .handler(async ({ data }) => {
    const limit = data.maxLimit || 50;

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from("trials").select("*").in("status", ["active", "upcoming"]);

        if (data.sport && data.sport !== "All Sports" && data.sport !== "all") {
          query = query.eq("sport", data.sport);
        }

        if (data.city && data.city !== "All Locations" && data.city !== "all") {
          query = query.eq("city", data.city);
        }

        const { data: dbTrials, error } = await query
          .order("trial_date", { ascending: true })
          .limit(limit);

        if (!error && dbTrials && dbTrials.length > 0) {
          return {
            success: true,
            isSupabaseLive: true,
            trials: dbTrials.filter((row) => !((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(row.id)) && !((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(row.external_id || "")).map(normalizeSupabaseTrial),
            totalCount: dbTrials.length,
          };
        }
      } catch (err) {
        console.warn("Backend trials query error:", err);
      }
    }

    // Static fallback if database is not reachable
    let fallback = [...TRIALS];
    if (data.sport && data.sport !== "All Sports" && data.sport !== "all") {
      fallback = fallback.filter((t) => t.sport.toLowerCase() === data.sport?.toLowerCase());
    }
    if (data.city && data.city !== "All Locations" && data.city !== "all") {
      fallback = fallback.filter((t) => t.city.toLowerCase() === data.city?.toLowerCase());
    }

    return {
      success: true,
      isSupabaseLive: false,
      trials: fallback.slice(0, limit),
      totalCount: fallback.length,
    };
  });

/**
 * Server-side function to fetch a single trial record by ID from the Supabase database.
 */
export const getBackendTrialById = createServerFn({ method: "GET" })
  .validator((d: { trialId: string }) => d)
  .handler(async ({ data }) => {
    const { trialId } = data;
    if ((UNVERIFIED_SAMPLE_TRIAL_IDS as readonly string[]).includes(trialId)) {
      return { success: false, trial: null, isSupabaseLive: false };
    }

    if (isSupabaseConfigured) {
      try {
        const { data: row, error } = await supabase
          .from("trials")
          .select("*")
          .eq("id", trialId)
          .maybeSingle();

        if (!error && row) {
          return {
            success: true,
            trial: normalizeSupabaseTrial(row),
            isSupabaseLive: true,
          };
        }
      } catch (err) {
        console.warn("Backend trial fetch error:", err);
      }
    }

    const staticItem = TRIALS.find((t) => t.id === trialId);
    if (staticItem) {
      return {
        success: true,
        trial: { ...staticItem, isSupabaseOrigin: false },
        isSupabaseLive: false,
      };
    }

    return {
      success: false,
      trial: null,
      isSupabaseLive: false,
    };
  });

/**
 * Server-side function to upsert a trial record into the Supabase database from backend.
 */
export const upsertBackendTrialRecord = createServerFn({ method: "POST" })
  .validator((d: { trial: Record<string, unknown> }) => d)
  .handler(async ({ data }) => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: "Supabase database is not configured in backend environment.",
      };
    }

    try {
      const rpcCaller = supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: unknown }>;

      const { data: result, error } = await rpcCaller("upsert_backend_trial_record", {
        p_trial: data.trial,
      });

      if (error) {
        return {
          success: false,
          error:
            typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: unknown }).message)
              : String(error),
        };
      }

      return {
        success: true,
        result,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });
