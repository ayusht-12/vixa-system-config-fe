import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigSelect } from "../primitives/ConfigSelect";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";

export function AuditSinkPanel() {
  return (
    <PanelShell
      tier="critical"
      title="Audit Sink · Immutable"
      statusBadge={{ label: "MERKLE ACTIVE", colorHex: "#00FFA3" }}
      actionLink={{ label: "View Logs →", href: "/audit-logs" }}
    >
      <ConfigField label="audit.sink_type">
        <SegmentedButtons options={["IMMUTABLE_APPEND", "S3_WORM", "KAFKA_IMMUTABLE"]} />
      </ConfigField>

      <ConfigField label="audit.sink_endpoint">
        <ConfigInput defaultValue="https://audit-sink.nexus.internal:9443/v2/ingest" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="merkle_tree_depth">
          <ConfigInput defaultValue="32" />
        </ConfigField>
        <ConfigField label="signing_algo">
          <ConfigSelect options={["ECDSA-P384", "RSA-4096", "Ed25519"]} />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="flush_interval">
          <ConfigInput defaultValue="500ms" />
        </ConfigField>
        <ConfigField label="batch_size">
          <ConfigInput defaultValue="1000" />
        </ConfigField>
      </div>

      <div className="p-3 rounded-small border bg-[#001A0D] border-[#00FFA330]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon" />
            <span className="text-xs text-neon font-medium">Tamper Detection</span>
          </div>
          <span className="text-xs text-neon">ENABLED</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xs text-gray-600">Root Hash</div>
            <div className="text-xs text-neon font-mono">a3f9c2d7</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Entries</div>
            <div className="text-xs text-white">4.7M</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Last Verified</div>
            <div className="text-xs text-neon">2m ago</div>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
