import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { ToggleSwitch } from "../primitives/ToggleSwitch";
import { StatTile } from "../../ui/StatTile";

const CACHE_TOGGLES = [
  { label: "Token cache", defaultOn: true },
  { label: "Schema cache", defaultOn: true },
  { label: "Rate limit counters", defaultOn: true },
  { label: "Query result cache", defaultOn: false },
];

export function RedisCachePanel() {
  return (
    <PanelShell
      tier="optional"
      title="Redis Cache"
      statusBadge={{ label: "ENABLED", colorHex: "#00FFA3" }}
    >
      <div className="flex items-center justify-between p-3 rounded-small border glow-green bg-[#001A0D] border-[#00FFA330]">
        <div>
          <div className="text-xs text-neon font-medium">Redis Cache Layer</div>
          <div className="text-xs text-gray-600 mt-0.5">L2 cache · reduces etcd load by ~60%</div>
        </div>
        <ToggleSwitch defaultOn size="lg" />
      </div>

      <ConfigField label="redis.endpoints">
        <ConfigInput defaultValue="redis://redis-cluster.nexus.internal:6379" />
      </ConfigField>

      <ConfigField label="redis.mode">
        <SegmentedButtons options={["CLUSTER", "SENTINEL", "STANDALONE"]} />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="default_ttl">
          <ConfigInput defaultValue="15m" />
        </ConfigField>
        <ConfigField label="max_memory">
          <ConfigInput defaultValue="8GB" />
        </ConfigField>
      </div>

      <div className="space-y-1.5">
        {CACHE_TOGGLES.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2 rounded-small bg-surface"
          >
            <span className="text-xs text-gray-400">{item.label}</span>
            <ToggleSwitch defaultOn={item.defaultOn} size="sm" />
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-subtle grid grid-cols-3 gap-2 text-center">
        <StatTile label="Hit Rate" tone="text-neon">94.7%</StatTile>
        <StatTile label="Keys" tone="text-white">847K</StatTile>
        <StatTile label="Memory" tone="text-white">3.2 GB</StatTile>
      </div>
    </PanelShell>
  );
}
