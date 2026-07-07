import { BoundInput, BoundSegmented, BoundToggle } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

const CACHE_TOGGLES = [
  { key: "redis.token_cache", label: "Token cache" },
  { key: "redis.schema_cache", label: "Schema cache" },
  { key: "redis.rate_limit_counters", label: "Rate limit counters" },
  { key: "redis.query_result_cache", label: "Query result cache" },
];

export function RedisCachePanel() {
  return (
    <PanelShell tier="optional" title="Redis Cache">
      <ConfigField label="redis.endpoints">
        <BoundInput paramKey="redis.endpoints" />
      </ConfigField>

      <ConfigField label="redis.mode">
        <BoundSegmented paramKey="redis.mode" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="default_ttl">
          <BoundInput paramKey="redis.default_ttl" />
        </ConfigField>
        <ConfigField label="max_memory">
          <BoundInput paramKey="redis.max_memory" />
        </ConfigField>
      </div>

      <div className="space-y-1.5">
        {CACHE_TOGGLES.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-2 rounded-small bg-surface"
          >
            <span className="text-xs text-gray-400">{item.label}</span>
            <BoundToggle paramKey={item.key} size="sm" />
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
