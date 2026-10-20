import type { Game } from "@/data/khelgrid";

export interface PlayerRosterItem {
  id: string;
  name: string;
  avatar?: string;
  skillLevel?: "Beginner" | "Intermediate" | "Advanced";
  position?: string;
  joinedAt: string;
  isHost?: boolean;
}

export interface EnrichedGame extends Game {
  address?: string;
  area?: string;
  durationMinutes?: number;
  description?: string;
  rules?: string[];
  equipmentProvided?: string[];
  equipmentNeeded?: string[];
  players?: PlayerRosterItem[];
  whatsappGroupUrl?: string;
  contactNumber?: string;
  isUserHosted?: boolean;
  isUserJoined?: boolean;
  amenities?: string[];
  courtType?: string;
}

export type PlayFilterCategory =
  | "All"
  | "Football"
  | "Badminton"
  | "Cricket"
  | "Box Cricket"
  | "Pickleball"
  | "Tennis"
  | "Basketball"
  | "Table Tennis";

export type PlayDateFilter = "all" | "today" | "tomorrow" | "weekend" | "open";
