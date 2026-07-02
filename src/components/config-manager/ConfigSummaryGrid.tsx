import clsx from "clsx";
import { TIER_STYLES } from "./primitives/tierStyles";

interface SummaryCard {
  tier: "critical" | "necessary" | "optional" | "applied";
  count: string;
  description: string;
}

const CARDS: SummaryCard[] = [
  { tier: "critical", count: "4", description: "engine.id · etcd · audit · auth" },
  { tier: "necessary", count: "4", description: "HSM · rate limit · tenancy · backup" },
  { tier: "optional", count: "3", description: "Redis · geo-redundancy · retention" },
  { tier: "applied", count: "8/11", description: "3 pending apply" },
];

const GLOW_CLASSES: Record<SummaryCard["tier"], string> = {
  critical: "glow-red",
  necessary: "glow-amber",
  optional: "",
  applied: "glow-green",
};

function CardTile({ card }: { card: SummaryCard }) {
  if (card.tier === "applied") {
    return (
      <div className="rounded-large border p-3 bg-card glow-green" style={{ borderColor: "#00FFA340" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block bg-neon animate-pulse-dot" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">Applied</span>
        </div>
        <div className="font-heading text-2xl font-bold text-neon">{card.count}</div>
        <div className="text-xs text-gray-600 mt-0.5">{card.description}</div>
      </div>
    );
  }

  const style = TIER_STYLES[card.tier];

  return (
    <div
      className={clsx("rounded-large border p-3 bg-card", GLOW_CLASSES[card.tier])}
      style={{ borderColor: card.tier === "optional" ? "#21262D" : `${style.dotHex}40` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2.5 h-2.5 rounded-small inline-block" style={{ backgroundColor: style.dotHex }} />
        <span className="text-xs text-gray-500 uppercase tracking-widest">{style.label}</span>
      </div>
      <div className="font-heading text-2xl font-bold text-white">{card.count}</div>
      <div className="text-xs text-gray-600 mt-0.5">{card.description}</div>
    </div>
  );
}

export function ConfigSummaryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CARDS.map((card) => (
        <CardTile key={card.tier} card={card} />
      ))}
    </div>
  );
}
