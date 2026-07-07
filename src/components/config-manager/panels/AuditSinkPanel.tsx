import { BoundInput, BoundSegmented, BoundSelect } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

export function AuditSinkPanel() {
  return (
    <PanelShell
      tier="critical"
      title="Audit Sink · Immutable"
      statusBadge={{ label: "MERKLE ACTIVE", colorHex: "#00FFA3" }}
      actionLink={{ label: "View Logs →", href: "/audit-logs" }}
    >
      <ConfigField label="audit.sink_type">
        <BoundSegmented paramKey="audit.sink_type" />
      </ConfigField>

      <ConfigField label="audit.sink_endpoint">
        <BoundInput paramKey="audit.sink_endpoint" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="merkle_tree_depth">
          <BoundInput paramKey="audit.merkle_tree_depth" />
        </ConfigField>
        <ConfigField label="signing_algo">
          <BoundSelect paramKey="audit.signing_algo" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="flush_interval">
          <BoundInput paramKey="audit.flush_interval" />
        </ConfigField>
        <ConfigField label="batch_size">
          <BoundInput paramKey="audit.batch_size" />
        </ConfigField>
      </div>
    </PanelShell>
  );
}
