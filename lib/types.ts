// Shared domain types for The Villa Algorithm.
// Data always comes from /data/ JSON files, never hardcoded in components.

export type IslanderStatus = "participating" | "dumped";
export type EntryType = "original" | "bombshell";

export interface Islander {
  id: string;
  name: string;
  age: number | null;
  hometown: string | null;
  occupation: string | null;
  status: IslanderStatus;
  partner: string | null;
  entryDay: number | null;
  entryType: EntryType;
  followersStart: number | null;
  followersCurrent: number | null;
  zodiac: string | null;
  instagram: string | null;
  tiktok: string | null;
  riskScore: number | null;
  riskReasoning: string | null;
  lat: number | null;
  lng: number | null;
}

// UI-facing couple state, derived from status + partner.
export type CoupleState = "coupled" | "single" | "dumped";

export type SkillCategory =
  | "api"
  | "structured"
  | "scraping"
  | "multimodel"
  | "mcp"
  | "analysis"
  | "database"
  | "education";

export interface Feature {
  id: string;
  title: string;
  description: string;
  skill: string;
  skillCategory: SkillCategory;
  unlocked: boolean;
  unlockDate: string;
  week: number;
  route: string;
}

export interface Episode {
  episode: number;
  date: string;
  title: string;
  events: string[];
  recouplings: string[];
  dumpings: string[];
  bombshells: string[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string | null;
  displayDate: string;
  note: string;
  key: boolean;
  estimated: boolean;
}

// A timeline event is "aired" (unlocked) once its real date has passed.
// Estimated/undated future events stay locked.
export function hasAired(event: TimelineEvent, now: Date = new Date()): boolean {
  if (event.estimated || !event.date) return false;
  return new Date(event.date) <= now;
}

export type PredictionOutcome = "pending" | "correct" | "wrong";

export interface Prediction {
  id: string;
  episode: number;
  claim: string;
  outcome: PredictionOutcome;
  model?: string;
  timestamp?: string;
}

// Derive the UI couple state from an islander record.
export function coupleState(islander: Islander): CoupleState {
  if (islander.status === "dumped") return "dumped";
  return islander.partner ? "coupled" : "single";
}
