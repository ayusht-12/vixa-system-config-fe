import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigSelect } from "../primitives/ConfigSelect";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { ToggleSwitch } from "../primitives/ToggleSwitch";
import { ProgressBar } from "../../ui/ProgressBar";

const BACKUP_TYPES = [
  { label: "Full Snapshot", description: "Every 6h · includes etcd + config + state" },
  { label: "Incremental WAL", description: "Continuous · 30s flush to S3" },
];

export function BackupIntervalsPanel() {
  return (
    <PanelShell
      tier="necessary"
      title="Backup Intervals"
      statusBadge={{ label: "NEXT: 3h 47m", colorHex: "#00FFA3" }}
    >
      <ConfigField label="backup.interval" hint="default: 6h">
        <SegmentedButtons options={["1h", "3h", "6h", "12h", "24h", "Custom"]} defaultValue="6h" />
      </ConfigField>

      <ConfigField label="backup.destination">
        <ConfigInput defaultValue="s3://nexus-backups-us-east-1/engine/snapshots/" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="backup.retention_count">
          <ConfigInput defaultValue="30" />
        </ConfigField>
        <ConfigField label="backup.encryption">
          <ConfigSelect options={["AES-256-GCM", "AES-128-GCM", "NONE"]} />
        </ConfigField>
      </div>

      <div className="space-y-2">
        {BACKUP_TYPES.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2.5 rounded-small bg-surface"
          >
            <div>
              <div className="text-xs text-gray-300 font-medium">{item.label}</div>
              <div className="text-xs text-gray-600">{item.description}</div>
            </div>
            <ToggleSwitch defaultOn />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-subtle">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-600">Last backup:</span>
          <span className="text-neon">2h 13m ago · 4.7 GB · ✓ verified</span>
        </div>
        <ProgressBar percent={37} color="neon" height="sm" />
        <div className="flex justify-between text-xs text-gray-700 mt-1">
          <span>Last backup</span>
          <span className="text-neon">Next in 3h 47m</span>
        </div>
      </div>
    </PanelShell>
  );
}
