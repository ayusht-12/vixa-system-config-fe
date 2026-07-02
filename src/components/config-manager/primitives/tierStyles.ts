export type ConfigTier = "critical" | "necessary" | "optional";

interface TierStyle {
  dotHex: string;
  label: string;
  textHex: string;
  badgeBgHex: string;
  badgeBorderHex: string;
  cardBorderHex: string;
}

export const TIER_STYLES: Record<ConfigTier, TierStyle> = {
  critical: {
    dotHex: "#FF3B3B",
    label: "CRITICAL",
    textHex: "#FF3B3B",
    badgeBgHex: "#1A0505",
    badgeBorderHex: "#FF3B3B30",
    cardBorderHex: "#FF3B3B30",
  },
  necessary: {
    dotHex: "#FBBF24",
    label: "NECESSARY",
    textHex: "#FBBF24",
    badgeBgHex: "#1A1200",
    badgeBorderHex: "#FBBF2430",
    cardBorderHex: "#FBBF2430",
  },
  optional: {
    dotHex: "#30363D",
    label: "OPTIONAL",
    textHex: "#6B7280",
    badgeBgHex: "#161B22",
    badgeBorderHex: "#30363D",
    cardBorderHex: "#21262D",
  },
};
