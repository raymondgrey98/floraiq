// Time-of-day helper — powers the "living" home hero (greeting, tint, particles).
export type Daypart = "morning" | "afternoon" | "evening" | "night";

export interface DaytimeInfo {
  part: Daypart;
  greeting: string;
  subline: string;
  emoji: string;
  /** "r,g,b" for ambient particles */
  particleColor: string;
  /** fireflies glow (evening/night) vs plain motes (day) */
  glow: boolean;
  /** subtle radial overlay tint for the hero */
  tint: string;
}

export function getDaytime(now: Date = new Date()): DaytimeInfo {
  const h = now.getHours();

  if (h >= 5 && h < 12) {
    return {
      part: "morning",
      greeting: "Good morning",
      subline: "The wild is waking up — what will you find?",
      emoji: "🌅",
      particleColor: "134,239,172",
      glow: false,
      tint: "radial-gradient(ellipse at 50% -10%, rgba(251,191,36,0.10), transparent 60%)",
    };
  }
  if (h >= 12 && h < 17) {
    return {
      part: "afternoon",
      greeting: "Good afternoon",
      subline: "Perfect light for a scan.",
      emoji: "☀️",
      particleColor: "163,230,53",
      glow: false,
      tint: "radial-gradient(ellipse at 50% -10%, rgba(16,185,129,0.10), transparent 60%)",
    };
  }
  if (h >= 17 && h < 21) {
    return {
      part: "evening",
      greeting: "Good evening",
      subline: "Golden hour — nature never looks better.",
      emoji: "🌆",
      particleColor: "251,146,60",
      glow: true,
      tint: "radial-gradient(ellipse at 50% -10%, rgba(244,114,182,0.10), transparent 60%)",
    };
  }
  return {
    part: "night",
    greeting: h < 5 ? "Still exploring" : "Good night",
    subline: "The nocturnal world is out there.",
    emoji: "🌙",
    particleColor: "110,231,183",
    glow: true,
    tint: "radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.12), transparent 60%)",
  };
}
