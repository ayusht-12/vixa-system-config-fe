import clsx from "clsx";
import { Link } from "react-router-dom";
import type { AnomalyEvent, Severity } from "../../types/command-center";
import { ROUTES } from "../../routes/routes";
import { Badge } from "../ui/Badge";
import { SectionCard } from "../ui/SectionCard";

interface AnomalyFeedProps {
  events: AnomalyEvent[];
}

interface SeverityStyle {
  label: string;
  dotClass: string;
  textClass: string;
  cardClass: string;
  glow?: string;
}

const SEVERITY_STYLES: Record<Severity, SeverityStyle> = {
  critical: {
    label: "CRITICAL",
    dotClass: "text-danger",
    textClass: "text-danger",
    cardClass: "bg-[#1A0A0A] border-[#FF3B3B40]",
    glow: "glow-red",
  },
  warning: {
    label: "WARNING",
    dotClass: "text-warn",
    textClass: "text-warn",
    cardClass: "bg-[#1A1200] border-[#FBBF2440]",
  },
  info: {
    label: "INFO",
    dotClass: "text-info",
    textClass: "text-info",
    cardClass: "bg-[#0A0F1A] border-[#60A4FA40]",
  },
};

function AnomalyCard({ event }: { event: AnomalyEvent }) {
  const style = SEVERITY_STYLES[event.severity];

  return (
    <div
      className={clsx("p-2.5 rounded-small border", style.cardClass, style.glow)}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className={clsx("text-xs", style.dotClass)}>⬤</span>
          <span className={clsx("text-xs font-medium", style.textClass)}>
            {style.label}
          </span>
          <span className="text-xs text-gray-600">· score {event.score}</span>
        </div>
        <span className="text-xs text-gray-600">{event.timestamp}</span>
      </div>
      <div className="text-xs text-gray-300 mb-1">
        {event.message}
        {event.highlight && (
          <>
            {" "}
            <span className="text-warn">{event.highlight}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {event.meta.map((item, index) => (
          <span key={item} className="flex items-center gap-2">
            {index > 0 && <span>·</span>}
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function AnomalyFeed({ events }: AnomalyFeedProps) {
  const criticalCount = events.filter((e) => e.severity === "critical").length;

  return (
    <SectionCard className="lg:col-span-2 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Active Anomaly Feed
          </h3>
          <div className="text-xs text-gray-600">
            Real-time · ML-scored events
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="danger">{criticalCount} CRITICAL</Badge>
          <Link
            to={ROUTES.anomalyDetection.path}
            className="text-xs text-neon hover:underline"
          >
            View All →
          </Link>
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto scrollbar-thin max-h-80">
        {events.map((event) => (
          <AnomalyCard key={event.id} event={event} />
        ))}
      </div>
    </SectionCard>
  );
}
