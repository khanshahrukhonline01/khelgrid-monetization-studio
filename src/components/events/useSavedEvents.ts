import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { SportEvent } from "@/data/khelgrid";

const STORAGE_KEY = "khelgrid_saved_tournaments";
const EVENT_NAME = "khelgrid:saved_tournaments_changed";

function getStoredSavedIds(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((item): item is string => typeof item === "string"));
    }
  } catch (err) {
    console.error("Failed to read saved tournaments from localStorage", err);
  }
  return new Set<string>();
}

function persistSavedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    const arr = Array.from(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: arr }));
  } catch (err) {
    console.error("Failed to persist saved tournaments to localStorage", err);
  }
}

export function useSavedEvents() {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    // Seed with a default favorite tournament on initial visit for instant gratification
    const stored = getStoredSavedIds();
    return stored;
  });

  // Keep state synchronized with localStorage and across instances
  useEffect(() => {
    const handleStorageChange = () => {
      setSavedIds(getStoredSavedIds());
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setSavedIds(new Set(customEvent.detail));
      } else {
        setSavedIds(getStoredSavedIds());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomChange);
    };
  }, []);

  const isSaved = useCallback(
    (eventId: string) => {
      return savedIds.has(eventId);
    },
    [savedIds],
  );

  const toggleSave = useCallback(
    (event: { id: string; title: string }, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const next = new Set(savedIds);
      let willBeSaved = false;

      if (next.has(event.id)) {
        next.delete(event.id);
        willBeSaved = false;
        persistSavedIds(next);
        setSavedIds(next);
        toast.info(`Removed "${event.title}" from saved tournaments`);
      } else {
        next.add(event.id);
        willBeSaved = true;
        persistSavedIds(next);
        setSavedIds(next);
        toast.success(`Saved "${event.title}" for later! View anytime in your Shortlist.`);
      }

      return willBeSaved;
    },
    [savedIds],
  );

  const clearSaved = useCallback(() => {
    const next = new Set<string>();
    persistSavedIds(next);
    setSavedIds(next);
    toast.info("Cleared all saved tournaments");
  }, []);

  return {
    savedIds,
    savedCount: savedIds.size,
    isSaved,
    toggleSave,
    clearSaved,
  };
}
