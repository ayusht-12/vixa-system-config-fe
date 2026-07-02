import clsx from "clsx";
import type { ComplianceKpiCard } from "../../types/compliance";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { PulseDot } from "../ui/PulseDot";

interface ComplianceKpiGridProps {
  cards: ComplianceKpiCard[];
}

function KpiCard({ card }: { card: ComplianceKpiCard }) {
  return (
    <div
      className={clsx("rounded-large border p-3 bg-card", card.glow)}
      style={{ borderColor: `${card.borderHex}40` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-600 uppercase tracking-widest">
          {card.label}
        </div>
        {card.pulseDot ? (
          <PulseDot color={card.barColor} />
        ) : card.badgeText && card.badgeStyle === "plain" ? (
          <span className="text-xs" style={{ color: card.badgeColorHex }}>
            {card.badgeText}
          </span>
        ) : card.badgeText ? (
          <span
            className="px-1.5 py-0.5 rounded-small text-[9px] bg-green-950 border"
            style={{ color: card.borderHex, borderColor: `${card.borderHex}40` }}
          >
            {card.badgeText}
          </span>
        ) : null}
      </div>
      <div className={clsx("font-heading text-3xl font-bold", ACCENT_CLASSES[card.barColor].text)}>
        {card.value}
        {card.unit && <span className="text-sm text-gray-500">{card.unit}</span>}
      </div>
      <div className="text-xs text-gray-600 mt-1">{card.trendLabel}</div>
      <div className="mt-2 w-full h-1 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={clsx("h-full rounded-full", ACCENT_CLASSES[card.barColor].bar)}
          style={{ width: `${card.barPercent}%` }}
        />
      </div>
    </div>
  );
}

export function ComplianceKpiGrid({ cards }: ComplianceKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}
