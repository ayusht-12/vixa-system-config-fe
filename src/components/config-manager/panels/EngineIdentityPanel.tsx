import { BoundInput, BoundSegmented, BoundSelect, useConfigParam } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

export function EngineIdentityPanel() {
  const engineId = useConfigParam("engine.id");

  return (
    <PanelShell
      tier="critical"
      title="Engine Identity"
      statusBadge={{ label: "LOCKED", colorHex: "#00FFA3" }}
      actionLink={{ label: "Audit →", href: "/audit-logs" }}
    >
      <ConfigField
        label="engine.id"
        hint="UUID-v7 · immutable"
        trailing={<span className="text-xs text-gray-600">read-only</span>}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-small text-xs font-mono bg-[#0A0E14] border border-subtle text-neon truncate">
            {engineId?.active_value ?? "—"}
          </div>
          <button
            type="button"
            onClick={() => engineId && navigator.clipboard?.writeText(engineId.active_value)}
            className="px-2.5 py-2 rounded-small text-xs border border-accent bg-surface hover:border-gray-500 transition-colors flex-shrink-0 text-gray-400"
            aria-label="Copy engine id"
          >
            ⎘
          </button>
        </div>
        <div className="text-xs text-gray-700 mt-1">
          Generated at boot · cannot be modified · used for cluster identity
        </div>
      </ConfigField>

      <ConfigField label="engine.name">
        <BoundInput paramKey="engine.name" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="engine.region">
          <BoundSelect paramKey="engine.region" />
        </ConfigField>
        <ConfigField label="engine.az">
          <BoundInput paramKey="engine.az" />
        </ConfigField>
      </div>

      <ConfigField label="engine.cluster_role">
        <div className="flex items-center gap-2">
          <BoundSegmented paramKey="engine.cluster_role" />
          <span className="text-xs text-gray-600">· Raft leader election active</span>
        </div>
      </ConfigField>
    </PanelShell>
  );
}
