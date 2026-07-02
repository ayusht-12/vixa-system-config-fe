import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { ToggleSwitch } from "../primitives/ToggleSwitch";

const ISOLATION_TOGGLES = [
  { label: "Network Isolation", description: "Per-tenant VPC · eBPF network policies" },
  { label: "Data Isolation", description: "Separate encryption keys per tenant" },
  { label: "Compute Isolation", description: "CPU/memory cgroup limits per tenant" },
  { label: "Audit Isolation", description: "Separate audit streams per tenant" },
];

export function TenancyIsolationPanel() {
  return (
    <PanelShell
      tier="necessary"
      title="Tenancy Isolation"
      statusBadge={{ label: "24 TENANTS", colorHex: "#00FFA3" }}
      actionLink={{ label: "Manage →", href: "/tenancy" }}
    >
      <ConfigField label="tenancy.isolation_model">
        <SegmentedButtons options={["NAMESPACE", "PROCESS", "VM"]} />
      </ConfigField>

      <div className="space-y-2">
        {ISOLATION_TOGGLES.map((item) => (
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

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="namespace_prefix">
          <ConfigInput defaultValue="nexus-tenant-" />
        </ConfigField>
        <ConfigField label="max_tenants">
          <ConfigInput defaultValue="100" />
        </ConfigField>
      </div>
    </PanelShell>
  );
}
