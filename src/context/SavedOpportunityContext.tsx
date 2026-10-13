import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { TRIALS, type Trial } from "@/data/trials";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = "khelgrid-saved-opportunities-v1";

type SavedOpportunityContextValue = {
  savedIds: string[];
  savedOpportunities: Trial[];
  isSaved: (trialId: string) => boolean;
  toggleSaved: (trialId: string) => void;
  syncWithCloud: () => Promise<void>;
};

const SavedOpportunityContext = createContext<SavedOpportunityContextValue | null>(null);

export function SavedOpportunityProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { user } = useAuth();
  const userEmail = user?.email?.trim().toLowerCase();

  // 1. Initial LocalStorage Hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed))
          setSavedIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      // Saved opportunities remain available for the current session.
    }
    setHydrated(true);
  }, []);

  // 2. Persist to LocalStorage on changes
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [hydrated, savedIds]);

  // 3. Supabase Cloud Sync when user is authenticated
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured || !userEmail) return;

    try {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("trial_id")
        .eq("user_email", userEmail);

      if (!error && data) {
        const cloudTrialIds = data.map((row) => row.trial_id).filter(Boolean);
        setSavedIds((currentLocal) => {
          const merged = Array.from(new Set([...currentLocal, ...cloudTrialIds]));
          return merged;
        });
      }
    } catch (err) {
      console.warn("Error syncing saved opportunities from Supabase:", err);
    }
  }, [userEmail]);

  useEffect(() => {
    if (hydrated && userEmail) {
      void syncWithCloud();
    }
  }, [hydrated, userEmail, syncWithCloud]);

  const toggleSaved = useCallback(
    (trialId: string) => {
      setSavedIds((current) => {
        const willBeSaved = !current.includes(trialId);
        const next = willBeSaved ? [...current, trialId] : current.filter((id) => id !== trialId);

        // Async write to Supabase if configured and user is logged in
        if (isSupabaseConfigured && userEmail) {
          if (willBeSaved) {
            void supabase
              .from("saved_opportunities")
              .upsert(
                {
                  user_email: userEmail,
                  trial_id: trialId,
                },
                { onConflict: "user_email,trial_id" },
              )
              .then(({ error }) => {
                if (error) console.warn("Supabase save opportunity error:", error.message);
              });
          } else {
            void supabase
              .from("saved_opportunities")
              .delete()
              .eq("user_email", userEmail)
              .eq("trial_id", trialId)
              .then(({ error }) => {
                if (error) console.warn("Supabase unsave opportunity error:", error.message);
              });
          }
        }

        return next;
      });
    },
    [userEmail],
  );

  const value = useMemo<SavedOpportunityContextValue>(
    () => ({
      savedIds,
      savedOpportunities: savedIds
        .map((id) => TRIALS.find((trial) => trial.id === id))
        .filter((trial): trial is Trial => Boolean(trial)),
      isSaved: (trialId) => savedIds.includes(trialId),
      toggleSaved,
      syncWithCloud,
    }),
    [savedIds, toggleSaved, syncWithCloud],
  );

  return (
    <SavedOpportunityContext.Provider value={value}>{children}</SavedOpportunityContext.Provider>
  );
}

export function useSavedOpportunities(): SavedOpportunityContextValue {
  return (
    useContext(SavedOpportunityContext) ?? {
      savedIds: [],
      savedOpportunities: [],
      isSaved: () => false,
      toggleSaved: () => {},
      syncWithCloud: async () => {},
    }
  );
}
