import clsx from "clsx";
import type { TenancyKpiCard } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface TenancyKpiGridProps {
  cards: TenancyKpiCard[];
}

const COLORED_VALUE_IDS = new Set(["isolation-score", "breach-alerts", "provisioning"]);

function KpiCard({ card }: { card: TenancyKpiCard }) {
  return (
    <div
      className={clsx("rounded-large border p-3 bg-card", card.glow)}
      style={{ borderColor: `${card.borderHex}40` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={clsx("text-xs", ACCENT_CLASSES[card.tone].text, card.iconPulse && "animate-pulse-dot")}>
          {card.iconContent}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest">{card.label}</span>
      </div>
      <div
        className={clsx(
          "font-heading text-2xl font-bold",
          COLORED_VALUE_IDS.has(card.id) ? ACCENT_CLASSES[card.tone].text : "text-white",
        )}
      >
        {card.value}
        {card.unit && <span className="text-sm text-gray-500">{card.unit}</span>}
      </div>
      <div className="text-xs text-gray-600 mt-0.5">{card.description}</div>
    </div>
  );
}

export function TenancyKpiGrid({ cards }: TenancyKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}
