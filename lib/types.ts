export type AppState =
  | "onboarding"
  | "role_selection"
  | "fan_unsubscribed"
  | "fan_subscribed"
  | "creator_hub";

export type Theme = {
  key: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

export const THEMES: Theme[] = [
  { key: "spotify", name: "Spotify Green",   primary: "#1DB954", secondary: "#169C46", accent: "#57FF96" },
  { key: "purple",  name: "Neon Purple",     primary: "#E040FB", secondary: "#AA00FF", accent: "#FF80AB" },
  { key: "cyber",   name: "Cyberpunk Green", primary: "#00FF41", secondary: "#00CC33", accent: "#39FF14" },
];

export interface PollVotes {
  Kyiv: number;
  Lviv: number;
  London: number;
}
