import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { ConfigSelect } from "../primitives/ConfigSelect";
import { PanelShell } from "../primitives/PanelShell";
import { RangeSlider } from "../primitives/RangeSlider";
import { SegmentedButtons } from "../primitives/SegmentedButtons";

interface TierLimit {
  tier: string;
  colorClass: string;
  bgHex: string;
  borderClass: string;
  description: string;
  value: string;
}

const TIER_LIMITS: TierLimit[] = [
  {
    tier: "ENTERPRISE",
    colorClass: "text-purple-400",
    bgHex: "#1A0A2A",
    borderClass: "border-purple-900",
    description: "unlimited · burst 5000",
    value: "unlimited",
  },
  {
    tier: "PREMIUM",
    colorClass: "text-info",
    bgHex: "#0A1A2A",
    borderClass: "border-blue-900",
    description: "500/s · burst 1000",
    value: "500",
  },
  {
    tier: "STANDARD",
    colorClass: "text-gray-500",
    bgHex: "#21262D",
    borderClass: "border-accent",
    description: "100/s · burst 200",
    value: "100",
  },
];

export function RateLimitingPanel() {
  return (
    <PanelShell
      tier="necessary"
      title="Rate Limiting"
      statusBadge={{ label: "ACTIVE · 743/s", colorHex: "#00FFA3" }}
    >
      <ConfigField label="ratelimit.algorithm">
        <SegmentedButtons options={["TOKEN_BUCKET", "SLIDING_WINDOW", "LEAKY_BUCKET"]} />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="global.req_per_sec">
          <RangeSlider min={100} max={5000} defaultValue={1000} formatValue={(v) => `${v}/s`} />
        </ConfigField>
        <ConfigField label="global.burst_size">
          <RangeSlider min={100} max={10000} defaultValue={2000} formatValue={(v) => `${v}`} />
        </ConfigField>
      </div>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
          per_tenant.tier_limits
        </label>
        <div className="space-y-2">
          {TIER_LIMITS.map((limit) => (
            <div
              key={limit.tier}
              className="flex items-center justify-between p-2 rounded-small bg-surface"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded-small text-[9px] border ${limit.colorClass} ${limit.borderClass}`}
                  style={{ backgroundColor: limit.bgHex }}
                >
                  {limit.tier}
                </span>
                <span className="text-xs text-gray-400">{limit.description}</span>
              </div>
              <ConfigInput defaultValue={limit.value} className="w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="throttle_action">
          <ConfigSelect options={["QUEUE_WITH_BACKPRESSURE", "REJECT_429", "DROP_SILENT"]} />
        </ConfigField>
        <ConfigField label="retry_after_header">
          <ConfigInput defaultValue="1s" />
        </ConfigField>
      </div>
    </PanelShell>
  );
}
