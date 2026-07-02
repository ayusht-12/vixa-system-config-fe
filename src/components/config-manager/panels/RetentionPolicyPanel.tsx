import clsx from "clsx";
import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigSelect } from "../primitives/ConfigSelect";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { ToggleSwitch } from "../primitives/ToggleSwitch";

interface RetentionRow {
  label: string;
  hint?: string;
  dotHex: string;
  value: string;
  wasValue?: string;
  changed?: boolean;
}

const RETENTION_ROWS: RetentionRow[] = [
  { label: "Audit Logs", hint: "immutable", dotHex: "#FF3B3B", value: "7y", wasValue: "5y", changed: true },
  { label: "Event Streams", dotHex: "#FBBF24", value: "90d" },
  { label: "Metrics / Telemetry", dotHex: "#60A4FA", value: "30d" },
  { label: "Anomaly Snapshots", dotHex: "#A78BFA", value: "180d" },
  { label: "Temp / Debug Logs", dotHex: "#30363D", value: "7d", wasValue: "14d", changed: true },
];

function RetentionRowItem({ row }: { row: RetentionRow }) {
  return (
    <div
      className={clsx(
        "p-2.5 rounded-small",
        row.changed ? "border border-neon/20 bg-neon/5" : "bg-surface",
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.dotHex }} />
          <span className="text-xs text-gray-300 font-medium">{row.label}</span>
          {row.hint && <span className="text-xs text-gray-600">({row.hint})</span>}
        </div>
        {row.changed && <span className="text-xs text-neon">CHANGED ✎</span>}
      </div>
      {row.changed ? (
        <div className="flex items-center gap-2">
          <ConfigInput defaultValue={row.value} className="flex-1" />
          <span className="text-xs text-gray-600">was: {row.wasValue}</span>
        </div>
      ) : (
        <ConfigInput defaultValue={row.value} />
      )}
    </div>
  );
}

export function RetentionPolicyPanel() {
  return (
    <PanelShell
      tier="optional"
      title="Data Retention Policy"
      statusBadge={{ label: "⚠ UNSAVED", colorHex: "#FBBF24" }}
    >
      <ConfigField label="retention.policy_mode">
        <SegmentedButtons options={["TIME_BASED", "SIZE_BASED", "HYBRID"]} />
      </ConfigField>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
          retention.per_data_type
        </label>
        <div className="space-y-2">
          {RETENTION_ROWS.map((row) => (
            <RetentionRowItem key={row.label} row={row} />
          ))}
        </div>
      </div>

      <ConfigField label="retention.purge_strategy">
        <ConfigSelect
          options={["SOFT_DELETE_THEN_PURGE", "IMMEDIATE_PURGE", "ARCHIVE_TO_COLD_STORAGE"]}
        />
      </ConfigField>

      <div className="flex items-center justify-between p-2.5 rounded-small border bg-[#0A0F1A] border-info/30">
        <div>
          <div className="text-xs text-info font-medium">GDPR Right to Erasure</div>
          <div className="text-xs text-gray-600 mt-0.5">Automated erasure on tenant request</div>
        </div>
        <ToggleSwitch defaultOn />
      </div>
    </PanelShell>
  );
}
