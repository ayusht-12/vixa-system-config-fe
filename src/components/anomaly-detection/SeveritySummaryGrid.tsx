import clsx from "clsx";
import type { SeveritySummaryCard } from "../../types/anomaly-detection";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { PulseDot } from "../ui/PulseDot";
import { SEVERITY_STYLES } from "../ui/severityStyles";

interface SeveritySummaryGridProps {
  cards: SeveritySummaryCard[];
}

function Card({ card }: { card: SeveritySummaryCard }) {
  const style = SEVERITY_STYLES[card.severity];
  const accent = ACCENT_CLASSES[style.accent];

  return (
    <div
      className={clsx(
        "rounded-large border bg-card p-3",
        style.cardBorder,
        style.glow,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-600 uppercase tracking-widest">
          {card.label}
        </div>
        <PulseDot color={style.accent} pulse={card.severity === "critical"} />
      </div>
      <div className={clsx("font-heading text-3xl font-bold", style.text)}>
        {card.count}
      </div>
      <div className="text-xs text-gray-600 mt-1">{card.trendLabel}</div>
      <div className="mt-2 w-full h-0.5 rounded-full bg-gray-800">
        <div
          className={clsx("h-full rounded-full", accent.bar)}
          style={{ width: `${card.barPercent}%` }}
        />
      </div>
    </div>
  );
}

export function SeveritySummaryGrid({ cards }: SeveritySummaryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card) => (
        <Card key={card.severity} card={card} />
      ))}
    </div>
  );
}
