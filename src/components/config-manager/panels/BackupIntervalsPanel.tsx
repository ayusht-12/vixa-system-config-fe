import { BoundInput, BoundSegmented, BoundSelect, BoundToggle } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

const BACKUP_TOGGLES = [
  { key: "backup.full_snapshot", label: "Full Snapshot", description: "Every 6h · includes etcd + config + state" },
  { key: "backup.incremental_wal", label: "Incremental WAL", description: "Continuous · 30s flush to S3" },
];

export function BackupIntervalsPanel() {
  return (
    <PanelShell tier="necessary" title="Backup Intervals">
      <ConfigField label="backup.interval" hint="default: 6h">
        <BoundSegmented
          paramKey="backup.interval"
          options={["1h", "3h", "6h", "12h", "24h", "Custom"]}
        />
      </ConfigField>

      <ConfigField label="backup.destination">
        <BoundInput paramKey="backup.destination" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="backup.retention_count">
          <BoundInput paramKey="backup.retention_count" />
        </ConfigField>
        <ConfigField label="backup.encryption">
          <BoundSelect paramKey="backup.encryption" />
        </ConfigField>
      </div>

      <div className="space-y-2">
        {BACKUP_TOGGLES.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2.5 rounded-small bg-surface"
          >
            <div>
              <div className="text-xs text-gray-300 font-medium">{item.label}</div>
              <div className="text-xs text-gray-600">{item.description}</div>
            </div>
            <BoundToggle paramKey={item.key} />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
