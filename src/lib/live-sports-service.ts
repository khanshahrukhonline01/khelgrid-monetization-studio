import { useCallback, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { LiveMatchUpdate } from "@/data/liveSports";
export interface LiveSportsFeed {
  matches: LiveMatchUpdate[];
  configuredSports: string[];
  unavailableSports: string[];
  fetchedAt: string | null;
  stale: boolean;
  error?: string;
}
const EMPTY: LiveSportsFeed = { matches: [], configuredSports: [], unavailableSports: ["cricket","football","tennis"], fetchedAt: null, stale: false };
export async function fetchLiveSportsFeed(): Promise<LiveSportsFeed> {
  if (!isSupabaseConfigured) return { ...EMPTY, error: "Sports feed backend is not configured." };
  const { data, error } = await supabase.functions.invoke("sports-feed", { body: { sport: "all" } });
  if (error || !data || !Array.isArray(data.matches)) return { ...EMPTY, error: "Live sports data is unavailable. Please try again." };
  return { matches: data.matches as LiveMatchUpdate[], configuredSports: Array.isArray(data.configuredSports) ? data.configuredSports : [], unavailableSports: Array.isArray(data.unavailableSports) ? data.unavailableSports : [], fetchedAt: typeof data.fetchedAt === "string" ? data.fetchedAt : null, stale: data.stale === true, error: typeof data.error === "string" ? data.error : undefined };
}
export function useLiveSportsUpdates() {
  const [feed, setFeed] = useState<LiveSportsFeed>(EMPTY);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { const next = await fetchLiveSportsFeed(); setFeed(next); return next; }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 120_000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  return { ...feed, loading, refresh };
}
