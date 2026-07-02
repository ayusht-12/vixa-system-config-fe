import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigTextArea } from "../primitives/ConfigTextArea";
import { PanelShell } from "../primitives/PanelShell";
import { StatTile } from "../../ui/StatTile";

export function EtcdPersistencePanel() {
  return (
    <PanelShell
      tier="critical"
      title="State Persistence · etcd"
      statusBadge={{ label: "QUORUM OK", colorHex: "#00FFA3" }}
      actionLink={{ label: "Status →", href: "/" }}
    >
      <ConfigField label="etcd.endpoints" hint="comma-separated">
        <ConfigTextArea
          rows={2}
          defaultValue="https://10.0.1.10:2379,https://10.0.1.11:2379,https://10.0.1.12:2379"
        />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="etcd.tls_cert_path">
          <ConfigInput defaultValue="/etc/nexus/etcd/tls/cert.pem" />
        </ConfigField>
        <ConfigField label="etcd.tls_key_path">
          <ConfigInput defaultValue="/etc/nexus/etcd/tls/key.pem" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ConfigField label="dial_timeout">
          <ConfigInput defaultValue="5s" />
        </ConfigField>
        <ConfigField label="request_timeout">
          <ConfigInput defaultValue="10s" />
        </ConfigField>
        <ConfigField label="keepalive">
          <ConfigInput defaultValue="30s" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="compaction_interval">
          <ConfigInput defaultValue="1h" />
        </ConfigField>
        <ConfigField label="defrag_interval">
          <ConfigInput defaultValue="24h" />
        </ConfigField>
      </div>

      <div className="pt-2 border-t border-subtle grid grid-cols-3 gap-2 text-center">
        <StatTile label="Raft Term" size="lg" tone="text-neon">47</StatTile>
        <StatTile label="DB Size" size="lg" tone="text-white">4.7 GB</StatTile>
        <StatTile label="Lag (max)" size="lg" tone="text-neon">3ms</StatTile>
      </div>
    </PanelShell>
  );
}
