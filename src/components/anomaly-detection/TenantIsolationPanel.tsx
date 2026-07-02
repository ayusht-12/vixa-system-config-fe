import clsx from "clsx";
import { Link } from "react-router-dom";
import type { TenantIsolationEntry } from "../../types/anomaly-detection";
import { ROUTES } from "../../routes/routes";
import { ActionButton } from "../ui/ActionButton";
import { PulseDot } from "../ui/PulseDot";
import { SEVERITY_STYLES } from "../ui/severityStyles";

interface TenantIsolationPanelProps {
  entries: TenantIsolationEntry[];
}

function EntryCard({ entry }: { entry: TenantIsolationEntry }) {
  const style = SEVERITY_STYLES[entry.severity];

  return (
    <div
      className={clsx(
        "p-2.5 rounded-small border",
        style.cardBg,
        style.cardBorder,
        entry.severity === "critical" && "isolation-badge-active",
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <PulseDot color={style.accent} pulse={entry.pulse} />
          <span className="text-xs font-medium text-gray-200">{entry.name}</span>
          <span
            className={clsx("px-1.5 py-0.5 rounded-small text-[9px]", style.badgeBg, style.text)}
          >
            {style.label}
          </span>
        </div>
        <span className="text-xs text-gray-600">{entry.anomalyLabel}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {entry.actions.map((action) => (
          <ActionButton key={action.label} action={action} size="sm" />
        ))}
      </div>
    </div>
  );
}

export function TenantIsolationPanel({ entries }: TenantIsolationPanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Tenant Isolation Status
          </h3>
          <div className="text-xs text-gray-600">
            Affected tenants · isolation controls
          </div>
        </div>
        <Link to={ROUTES.tenancy.path} className="text-xs text-neon hover:underline">
          Manage →
        </Link>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
