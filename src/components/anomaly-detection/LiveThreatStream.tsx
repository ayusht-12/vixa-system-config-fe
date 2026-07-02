import clsx from "clsx";
import type { StreamMetaField, ThreatStreamEvent } from "../../types/anomaly-detection";
import { ActionButton } from "../ui/ActionButton";
import { PulseDot } from "../ui/PulseDot";
import { SEVERITY_STYLES } from "../ui/severityStyles";

interface LiveThreatStreamProps {
  events: ThreatStreamEvent[];
}

const META_TONE_CLASSES: Record<NonNullable<StreamMetaField["tone"]>, string> = {
  neon: "text-neon",
  danger: "text-danger",
  warn: "text-warn",
  info: "text-info",
  purple: "text-purple-400",
  default: "text-gray-300",
};

function MetaTile({ field }: { field: StreamMetaField }) {
  return (
    <div className="p-1.5 rounded-small bg-surface">
      <div className="text-xs text-gray-600">{field.label}</div>
      <div className={clsx("text-xs font-medium", META_TONE_CLASSES[field.tone ?? "default"])}>
        {field.value}
      </div>
    </div>
  );
}

const SEVERITY_BORDER_HEX: Record<ThreatStreamEvent["severity"], string> = {
  critical: "#FF3B3B",
  high: "#FBBF24",
  medium: "#60A4FA",
  low: "#00FFA3",
};

function StreamEventCard({ event }: { event: ThreatStreamEvent }) {
  const style = SEVERITY_STYLES[event.severity];
  const isOpen = event.status === "OPEN";

  return (
    <div
      className="animate-slide-in border-b border-subtle px-4 py-3 hover:bg-gray-900 transition-colors last:border-b-0"
      style={{ borderLeft: `3px solid ${SEVERITY_BORDER_HEX[event.severity]}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={clsx(
              "px-2 py-0.5 rounded-small text-xs font-bold border",
              style.text,
              style.badgeBg,
              style.cardBorder,
            )}
          >
            ● {style.label}
          </span>
          <span className="text-xs text-gray-600">score:</span>
          <span className={clsx("text-xs font-bold", style.text)}>
            {event.score}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-small text-xs bg-surface"
            style={{ color: event.categoryColorHex }}
          >
            {event.category}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-600">{event.timestamp}</span>
          <span
            className={clsx(
              "px-1.5 py-0.5 rounded-small text-xs bg-surface",
              isOpen ? "text-gray-500" : style.text,
            )}
          >
            {event.status}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-200 mb-2 font-medium">
        {event.description}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        {event.meta.map((field) => (
          <MetaTile key={field.label} field={field} />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {event.actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
      </div>
    </div>
  );
}

export function LiveThreatStream({ events }: LiveThreatStreamProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Live Threat Stream
          </h3>
          <div className="text-xs text-gray-600">
            Auto-classified · ML-scored · real-time ingestion
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <PulseDot color="neon" />
            <span className="text-neon">STREAMING</span>
          </div>
          <select className="text-xs rounded-small border border-accent px-2 py-1 text-gray-400 cursor-pointer bg-surface">
            <option>All Severities</option>
            <option>Critical Only</option>
            <option>High+</option>
          </select>
        </div>
      </div>
      <div className="scrollbar-thin overflow-y-auto max-h-[520px]">
        {events.map((event) => (
          <StreamEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
