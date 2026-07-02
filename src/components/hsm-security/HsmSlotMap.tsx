import clsx from "clsx";
import type { HsmSlot, SlotStyle } from "../../types/hsm-security";
import { PulseDot } from "../ui/PulseDot";
import { ProgressBar } from "../ui/ProgressBar";

interface HsmSlotMapProps {
  slots: HsmSlot[];
  summary: string;
}

const STYLE_CONFIG: Record<
  SlotStyle,
  { bg: string; borderHex: string; dotColor: "neon" | "warn"; barColor: "neon" | "warn"; badgeBg: string; badgeText: string; dotPulse: boolean }
> = {
  active: {
    bg: "linear-gradient(135deg, #001A0D 0%, #0D1117 100%)",
    borderHex: "#00FFA340",
    dotColor: "neon",
    barColor: "neon",
    badgeBg: "#001A0D",
    badgeText: "#00FFA3",
    dotPulse: true,
  },
  warn: {
    bg: "linear-gradient(135deg, #1A1200 0%, #0D1117 100%)",
    borderHex: "#FBBF2440",
    dotColor: "warn",
    barColor: "warn",
    badgeBg: "#1A1200",
    badgeText: "#FBBF24",
    dotPulse: true,
  },
  inactive: {
    bg: "linear-gradient(135deg, #0A0E14 0%, #0D1117 100%)",
    borderHex: "#21262D",
    dotColor: "neon",
    barColor: "neon",
    badgeBg: "#161B22",
    badgeText: "#6B7280",
    dotPulse: false,
  },
};

function SlotCard({ slot }: { slot: HsmSlot }) {
  const style = STYLE_CONFIG[slot.style];
  const isSigning = slot.badgeLabel === "SIGNING";

  return (
    <div
      className="rounded-large border p-3"
      style={{ borderColor: style.borderHex, background: style.bg }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {slot.style === "inactive" ? (
            <span className="w-2 h-2 rounded-full bg-gray-600" />
          ) : (
            <PulseDot color={style.dotColor} size="md" pulse={style.dotPulse} />
          )}
          <span className="font-heading font-semibold text-white text-xs">{slot.name}</span>
        </div>
        <span
          className="px-1.5 py-0.5 rounded-small text-[9px] border"
          style={{ backgroundColor: style.badgeBg, color: style.badgeText, borderColor: style.borderHex }}
        >
          {slot.badgeLabel}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Label</span>
          <span
            className={clsx("font-mono", slot.style === "inactive" && "text-gray-500")}
            style={slot.style !== "inactive" ? { color: isSigning ? "#A78BFA" : "#00FFA3" } : undefined}
          >
            {slot.labelValue}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Keys</span>
          <span className={slot.style === "inactive" ? "text-gray-500" : "text-gray-300"}>{slot.keysCount}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Capacity</span>
          <span className={slot.style === "warn" ? "text-warn" : slot.style === "inactive" ? "text-gray-500" : "text-gray-300"}>
            {slot.capacityPercent}%
          </span>
        </div>
        <ProgressBar percent={slot.capacityPercent} color={style.barColor} height="sm" />
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Ops/s</span>
          <span
            className={slot.style === "inactive" ? "text-gray-500" : undefined}
            style={slot.style === "active" ? { color: isSigning ? "#A78BFA" : "#00FFA3" } : slot.style === "warn" ? { color: "#FBBF24" } : undefined}
          >
            {slot.opsPerSecond}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">{slot.extraLabel}</span>
          <span
            className={clsx(
              "font-mono text-[9px]",
              slot.style === "inactive" ? "text-gray-500" : slot.style === "warn" ? "text-warn" : "text-gray-400",
            )}
          >
            {slot.extraValue}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HsmSlotMap({ slots, summary }: HsmSlotMapProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">HSM Slot Map</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{summary}</span>
          <button
            type="button"
            className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}
