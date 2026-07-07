import { BoundInput, BoundSegmented, BoundToggle } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

const ISOLATION_TOGGLES = [
  { key: "tenancy.network_isolation", label: "Network Isolation", description: "Per-tenant VPC · eBPF network policies" },
  { key: "tenancy.data_isolation", label: "Data Isolation", description: "Separate encryption keys per tenant" },
  { key: "tenancy.compute_isolation", label: "Compute Isolation", description: "CPU/memory cgroup limits per tenant" },
  { key: "tenancy.audit_isolation", label: "Audit Isolation", description: "Separate audit streams per tenant" },
];

export function TenancyIsolationPanel({ tenantCount }: { tenantCount?: number }) {
  return (
    <PanelShell
      tier="necessary"
      title="Tenancy Isolation"
      statusBadge={
        tenantCount !== undefined
          ? { label: `${tenantCount} TENANTS`, colorHex: "#00FFA3" }
          : undefined
      }
      actionLink={{ label: "Manage →", href: "/tenancy" }}
    >
      <ConfigField label="tenancy.isolation_model">
        <BoundSegmented paramKey="tenancy.isolation_model" />
      </ConfigField>

      <div className="space-y-2">
        {ISOLATION_TOGGLES.map((item) => (
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

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="namespace_prefix">
          <BoundInput paramKey="tenancy.namespace_prefix" />
        </ConfigField>
        <ConfigField label="max_tenants">
          <BoundInput paramKey="tenancy.max_tenants" />
        </ConfigField>
      </div>
    </PanelShell>
  );
}
