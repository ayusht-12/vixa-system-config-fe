import clsx from "clsx";
import {
  BoundInput,
  BoundSegmented,
  BoundSelect,
  BoundToggle,
  useConfigParam,
  useConfigParamsMap,
} from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

interface RetentionRowDef {
  key: string;
  label: string;
  hint?: string;
  dotHex: string;
}

const RETENTION_ROWS: RetentionRowDef[] = [
  { key: "retention.audit_logs", label: "Audit Logs", hint: "immutable", dotHex: "#FF3B3B" },
  { key: "retention.event_streams", label: "Event Streams", dotHex: "#FBBF24" },
  { key: "retention.metrics", label: "Metrics / Telemetry", dotHex: "#60A4FA" },
  { key: "retention.anomaly_snapshots", label: "Anomaly Snapshots", dotHex: "#A78BFA" },
  { key: "retention.debug_logs", label: "Temp / Debug Logs", dotHex: "#30363D" },
];

function RetentionRow({ row }: { row: RetentionRowDef }) {
  const param = useConfigParam(row.key);
  const changed = Boolean(param?.has_pending_change);

  return (
    <div
      className={clsx(
        "p-2.5 rounded-small",
        changed ? "border border-neon/20 bg-neon/5" : "bg-surface",
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.dotHex }} />
          <span className="text-xs text-gray-300 font-medium">{row.label}</span>
          {row.hint && <span className="text-xs text-gray-600">({row.hint})</span>}
        </div>
        {changed && <span className="text-xs text-neon">CHANGED ✎</span>}
      </div>
      {changed ? (
        <div className="flex items-center gap-2">
          <BoundInput paramKey={row.key} className="flex-1" />
          <span className="text-xs text-gray-600 whitespace-nowrap">was: {param?.active_value}</span>
        </div>
      ) : (
        <BoundInput paramKey={row.key} />
      )}
    </div>
  );
}

export function RetentionPolicyPanel() {
  const byKey = useConfigParamsMap();
  const unsaved = RETENTION_ROWS.some((row) => byKey[row.key]?.has_pending_change);

  return (
    <PanelShell
      tier="optional"
      title="Data Retention Policy"
      statusBadge={unsaved ? { label: "⚠ UNSAVED", colorHex: "#FBBF24" } : undefined}
    >
      <ConfigField label="retention.policy_mode">
        <BoundSegmented paramKey="retention.policy_mode" />
      </ConfigField>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
          retention.per_data_type
        </label>
        <div className="space-y-2">
          {RETENTION_ROWS.map((row) => (
            <RetentionRow key={row.key} row={row} />
          ))}
        </div>
      </div>

      <ConfigField label="retention.purge_strategy">
        <BoundSelect paramKey="retention.purge_strategy" />
      </ConfigField>

      <div className="flex items-center justify-between p-2.5 rounded-small border bg-[#0A0F1A] border-info/30">
        <div>
          <div className="text-xs text-info font-medium">GDPR Right to Erasure</div>
          <div className="text-xs text-gray-600 mt-0.5">Automated erasure on tenant request</div>
        </div>
        <BoundToggle paramKey="retention.gdpr_erasure" />
      </div>
    </PanelShell>
  );
}
