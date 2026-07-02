import clsx from "clsx";
import type { HsmKpiCard } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface HsmKpiGridProps {
  cards: HsmKpiCard[];
}

function KpiCard({ card }: { card: HsmKpiCard }) {
  const isLargeValue = card.value.length > 4;

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
          "font-heading font-bold",
          isLargeValue ? "text-2xl" : "text-xl",
          card.id === "next-rotation" || card.id === "attestation" || card.id === "status"
            ? ACCENT_CLASSES[card.tone].text
            : "text-white",
        )}
      >
        {card.value}
      </div>
      <div className="text-xs text-gray-600 mt-0.5">{card.description}</div>
    </div>
  );
}

export function HsmKpiGrid({ cards }: HsmKpiGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {cards.map((card) => (
        <KpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}
