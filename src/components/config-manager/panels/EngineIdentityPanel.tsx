import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigSelect } from "../primitives/ConfigSelect";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";

export function EngineIdentityPanel() {
  return (
    <PanelShell
      tier="critical"
      title="Engine Identity"
      statusBadge={{ label: "LOCKED", colorHex: "#00FFA3" }}
      actionLink={{ label: "Audit →", href: "/audit-logs" }}
    >
      <ConfigField label="engine.id" hint="UUID-v7 · immutable" trailing={<span className="text-xs text-gray-600">read-only</span>}>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-small text-xs font-mono bg-[#0A0E14] border border-subtle text-neon">
            01944f2c-7b3a-7000-8e4d-2f9a1b3c5d7e
          </div>
          <button
            type="button"
            className="px-2.5 py-2 rounded-small text-xs border border-accent bg-surface hover:border-gray-500 transition-colors flex-shrink-0 text-gray-400"
          >
            ⎘
          </button>
        </div>
        <div className="text-xs text-gray-700 mt-1">
          Generated at boot · cannot be modified · used for cluster identity
        </div>
      </ConfigField>

      <ConfigField label="engine.name">
        <ConfigInput defaultValue="nexus-primary-us-east-1" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="engine.region">
          <ConfigSelect options={["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"]} />
        </ConfigField>
        <ConfigField label="engine.az">
          <ConfigSelect options={["AZ-3", "AZ-1", "AZ-2"]} />
        </ConfigField>
      </div>

      <ConfigField label="engine.cluster_role">
        <div className="flex items-center gap-2">
          <SegmentedButtons options={["PRIMARY", "REPLICA", "STANDBY"]} />
          <span className="text-xs text-gray-600">· Raft leader election active</span>
        </div>
      </ConfigField>

      <div className="pt-2 border-t border-subtle flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-neon" />
          <span>
            Identity hash: <span className="text-gray-500">sha256:a3f9c2d7...</span>
          </span>
        </div>
        <span className="text-xs text-gray-700">Fingerprint verified</span>
      </div>
    </PanelShell>
  );
}
