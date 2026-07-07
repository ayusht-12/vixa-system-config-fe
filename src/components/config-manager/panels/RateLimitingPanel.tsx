import { BoundInput, BoundSegmented, BoundSelect, BoundSlider } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

export function RateLimitingPanel() {
  return (
    <PanelShell tier="necessary" title="Rate Limiting">
      <ConfigField label="ratelimit.algorithm">
        <BoundSegmented paramKey="ratelimit.algorithm" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="global.req_per_sec">
          <BoundSlider
            paramKey="ratelimit.global_req_per_sec"
            min={100}
            max={5000}
            formatValue={(v) => `${v}/s`}
          />
        </ConfigField>
        <ConfigField label="global.burst_size">
          <BoundSlider
            paramKey="ratelimit.global_burst_size"
            min={100}
            max={10000}
            formatValue={(v) => `${v}`}
          />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="throttle_action">
          <BoundSelect paramKey="ratelimit.throttle_action" />
        </ConfigField>
        <ConfigField label="retry_after_header">
          <BoundInput paramKey="ratelimit.retry_after_header" />
        </ConfigField>
      </div>
    </PanelShell>
  );
}
