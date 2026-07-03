import type { AccentColor } from "../../types/command-center";

type BadgeTone = "neon" | "blue" | "purple" | "danger" | "warn" | "neutral";

const ACCENT_TO_BADGE: Record<AccentColor, BadgeTone> = {
  neon: "neon",
  info: "blue",
  warn: "warn",
  danger: "danger",
  purple: "purple",
};

export function toBadgeTone(tone: AccentColor): BadgeTone {
  return ACCENT_TO_BADGE[tone];
}
