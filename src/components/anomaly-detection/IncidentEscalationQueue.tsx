import clsx from "clsx";
import { Link } from "react-router-dom";
import type { Incident } from "../../types/anomaly-detection";
import { ActionButton } from "../ui/ActionButton";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { Badge } from "../ui/Badge";
import { SEVERITY_STYLES } from "../ui/severityStyles";

interface IncidentEscalationQueueProps {
  incidents: Incident[];
  pendingCount: number;
}

function IncidentCard({ incident }: { incident: Incident }) {
  const style = SEVERITY_STYLES[incident.severity];

  return (
    <div
      className={clsx(
        "p-3 rounded-small border bg-surface border-accent",
        incident.resolved && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx("text-xs font-bold", incident.resolved ? "text-gray-500" : style.text)}>
            {incident.code}
          </span>
          <span
            className={clsx(
              "px-1.5 py-0.5 rounded-small text-[9px]",
              style.badgeBg,
              incident.resolved ? "text-gray-600" : style.text,
            )}
          >
            {incident.severity.toUpperCase()}
          </span>
          <span className="px-1.5 py-0.5 rounded-small text-[9px] bg-card text-gray-500">
            {incident.assignment}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span>{incident.slaLabel}</span>
          <span className={clsx("font-medium", ACCENT_CLASSES[incident.slaTone].text)}>
            {incident.slaValue}
          </span>
        </div>
      </div>
      <div className={clsx("text-xs mb-2", incident.resolved ? "text-gray-500" : "text-gray-300")}>
        {incident.description}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {incident.actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
        {incident.auditHref && (
          <Link
            to={incident.auditHref}
            className="px-3 py-1 rounded-small text-xs text-gray-500 border border-accent bg-card hover:border-gray-500 transition-colors"
          >
            {incident.resolved ? "View Resolution →" : "Audit Trail →"}
          </Link>
        )}
      </div>
    </div>
  );
}

export function IncidentEscalationQueue({
  incidents,
  pendingCount,
}: IncidentEscalationQueueProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Incident Escalation Queue
          </h3>
          <div className="text-xs text-gray-600">
            One-click escalation · auto-routing · SLA tracking
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="danger">{pendingCount} PENDING</Badge>
          <button
            type="button"
            className="px-3 py-1 rounded-small text-xs font-medium text-danger border border-danger/40 bg-[#1A0505] transition-colors"
          >
            Escalate All Critical
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}
