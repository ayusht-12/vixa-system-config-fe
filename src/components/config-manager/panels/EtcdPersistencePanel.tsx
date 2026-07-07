import { BoundInput, BoundTextArea } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";
import { StatTile } from "../../ui/StatTile";

export interface EtcdTelemetry {
  raftTerm: string;
  dbSize: string;
  lag: string;
  hasQuorum: boolean;
}

export function EtcdPersistencePanel({ telemetry }: { telemetry?: EtcdTelemetry }) {
  return (
    <PanelShell
      tier="critical"
      title="State Persistence · etcd"
      statusBadge={
        telemetry
          ? {
              label: telemetry.hasQuorum ? "QUORUM OK" : "NO QUORUM",
              colorHex: telemetry.hasQuorum ? "#00FFA3" : "#FBBF24",
            }
          : undefined
      }
      actionLink={{ label: "Status →", href: "/" }}
    >
      <ConfigField label="etcd.endpoints" hint="comma-separated">
        <BoundTextArea paramKey="etcd.endpoints" rows={2} />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="etcd.tls_cert_path">
          <BoundInput paramKey="etcd.tls_cert_path" />
        </ConfigField>
        <ConfigField label="etcd.tls_key_path">
          <BoundInput paramKey="etcd.tls_key_path" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ConfigField label="dial_timeout">
          <BoundInput paramKey="etcd.dial_timeout" />
        </ConfigField>
        <ConfigField label="request_timeout">
          <BoundInput paramKey="etcd.request_timeout" />
        </ConfigField>
        <ConfigField label="keepalive">
          <BoundInput paramKey="etcd.keepalive" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="compaction_interval">
          <BoundInput paramKey="etcd.compaction_interval" />
        </ConfigField>
        <ConfigField label="defrag_interval">
          <BoundInput paramKey="etcd.defrag_interval" />
        </ConfigField>
      </div>

      {telemetry && (
        <div className="pt-2 border-t border-subtle grid grid-cols-3 gap-2 text-center">
          <StatTile label="Raft Term" size="lg" tone="text-neon">
            {telemetry.raftTerm}
          </StatTile>
          <StatTile label="DB Size" size="lg" tone="text-white">
            {telemetry.dbSize}
          </StatTile>
          <StatTile label="Lag (max)" size="lg" tone="text-neon">
            {telemetry.lag}
          </StatTile>
        </div>
      )}
    </PanelShell>
  );
}
