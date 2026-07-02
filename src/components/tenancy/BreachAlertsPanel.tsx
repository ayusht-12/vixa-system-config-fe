import { Link } from "react-router-dom";
import type { BreachAlert } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { ActionButton } from "../ui/ActionButton";
import { Badge } from "../ui/Badge";
import { PulseDot } from "../ui/PulseDot";

interface BreachAlertsPanelProps {
  alerts: BreachAlert[];
  historyNote: { critical: number; warnings: number };
}

function AlertCard({ alert }: { alert: BreachAlert }) {
  const isCritical = alert.severity === "critical";

  return (
    <div
      className={`p-3 rounded-small border ${isCritical ? "glow-red bg-[#1A0505] border-danger/25" : "glow-amber bg-[#1A1200] border-warn/25"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs ${isCritical ? "text-danger" : "text-warn"}`}>⬤</span>
          <span className={`text-xs font-medium ${isCritical ? "text-danger" : "text-warn"}`}>{alert.title}</span>
        </div>
        <span className="text-xs text-gray-600">{alert.timestamp}</span>
      </div>
      <div className="text-xs text-gray-300 mb-2">{alert.description}</div>
      <div className="space-y-1.5 p-2 rounded-small bg-card">
        {alert.details.map((detail) => (
          <div key={detail.label} className="flex justify-between text-xs">
            <span className="text-gray-600">{detail.label}</span>
            <span className={`font-mono ${detail.tone ? ACCENT_CLASSES[detail.tone].text : "text-gray-400"}`}>
              {detail.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        {alert.actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
        {alert.auditLink && (
          <Link to={alert.auditLink.href} className="text-xs text-neon hover:underline ml-auto">
            {alert.auditLink.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export function BreachAlertsPanel({ alerts, historyNote }: BreachAlertsPanelProps) {
  return (
    <div className="lg:col-span-2 rounded-large border bg-card border-danger/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <PulseDot color="danger" />
          <h3 className="font-heading font-semibold text-white text-sm">Cross-Tenant Access Alerts</h3>
        </div>
        <Badge tone="danger">{alerts.length} ACTIVE</Badge>
      </div>
      <div className="p-4 space-y-3 scrollbar-thin overflow-y-auto max-h-[460px]">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        <div className="pt-2 border-t border-subtle">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Last 24h: <span className="text-danger">{historyNote.critical} critical</span> ·{" "}
              <span className="text-warn">{historyNote.warnings} warnings</span>
            </span>
            <Link to="/audit-logs" className="text-neon hover:underline">
              Full History →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
