import clsx from "clsx";
import type { AuditKpiCard } from "../../types/audit-log";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface AuditKpiGridProps {
  cards: AuditKpiCard[];
}

const GLOW_CLASSES: Record<AuditKpiCard["tone"], string> = {
  neon: "glow-green",
  info: "",
  warn: "glow-amber",
  danger: "glow-red",
  purple: "",
};

function KpiCard({ card }: { card: AuditKpiCard }) {
  return (
    <div
      className={clsx(
        "rounded-large border p-3 bg-card",
        card.highlighted && "border-neon/25",
        !card.highlighted && "border-subtle",
        GLOW_CLASSES[card.tone],
      )}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={clsx("text-xs", ACCENT_CLASSES[card.tone].text, card.iconPulse && "animate-pulse-dot")}>
          {card.iconContent}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-widest">{card.label}</span>
      </div>
      <div className={clsx("font-heading text-2xl font-bold", card.highlighted ? ACCENT_CLASSES[card.tone].text : "text-white")}>
        {card.value}
      </div>
      <div className="text-xs text-gray-600 mt-0.5">{card.description}</div>
    </div>
  );
}

export function AuditKpiGrid({ cards }: AuditKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}
