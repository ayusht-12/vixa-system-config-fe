import type { AccentColor } from "../../types/command-center";
import type { ThreatSeverity } from "../../types/anomaly-detection";

interface SeverityStyle {
  accent: AccentColor;
  label: string;
  text: string;
  glow: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
}

export const SEVERITY_STYLES: Record<ThreatSeverity, SeverityStyle> = {
  critical: {
    accent: "danger",
    label: "CRITICAL",
    text: "text-danger",
    glow: "glow-red",
    cardBg: "bg-[#1A0505]",
    cardBorder: "border-[#FF3B3B40]",
    badgeBg: "bg-[#1A0505]",
  },
  high: {
    accent: "warn",
    label: "HIGH",
    text: "text-warn",
    glow: "glow-amber",
    cardBg: "bg-[#1A1200]",
    cardBorder: "border-[#FBBF2440]",
    badgeBg: "bg-[#1A1200]",
  },
  medium: {
    accent: "info",
    label: "MEDIUM",
    text: "text-info",
    glow: "glow-blue",
    cardBg: "bg-[#0A0F1A]",
    cardBorder: "border-[#60A4FA40]",
    badgeBg: "bg-[#0A0F1A]",
  },
  low: {
    accent: "neon",
    label: "LOW",
    text: "text-neon",
    glow: "glow-green",
    cardBg: "bg-[#001A0D]",
    cardBorder: "border-[#00FFA340]",
    badgeBg: "bg-[#001A0D]",
  },
};
