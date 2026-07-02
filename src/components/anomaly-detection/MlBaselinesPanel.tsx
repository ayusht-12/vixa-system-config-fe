import clsx from "clsx";
import type { BaselineMetric } from "../../types/anomaly-detection";
import { Badge } from "../ui/Badge";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface MlBaselinesPanelProps {
  metrics: BaselineMetric[];
  accuracy: string;
  falsePositiveRate: string;
}

function BaselineRow({ metric }: { metric: BaselineMetric }) {
  const isGradient = metric.barStyle.includes("gradient");

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-500">{metric.label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{metric.baselineLabel}</span>
          <span className={clsx("font-medium", ACCENT_CLASSES[metric.currentTone].text)}>
            {metric.currentLabel}
          </span>
        </div>
      </div>
      <div className="relative w-full h-3 rounded-small bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-small transition-[width] duration-700 ease-in-out"
          style={{
            width: `${metric.percent}%`,
            background: isGradient ? metric.barStyle : undefined,
            backgroundColor: isGradient ? undefined : metric.barStyle,
          }}
        />
        <div
          className="absolute top-0 h-full w-px bg-neon opacity-80"
          style={{ left: `${metric.markerPercent}%` }}
        />
      </div>
      {metric.showAxis && (
        <div className="flex justify-between text-xs text-gray-700 mt-0.5">
          <span>0</span>
          <span className="text-neon" style={{ marginLeft: "20%" }}>
            ↑ baseline
          </span>
          <span>5000/s</span>
        </div>
      )}
    </div>
  );
}

export function MlBaselinesPanel({
  metrics,
  accuracy,
  falsePositiveRate,
}: MlBaselinesPanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            ML Behavioral Baselines
          </h3>
          <div className="text-xs text-gray-600">
            IsolationForest · 30-day rolling window
          </div>
        </div>
        <Badge tone="neon">TRAINED</Badge>
      </div>

      <div className="space-y-3">
        {metrics.map((metric) => (
          <BaselineRow key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-subtle flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Model accuracy: <span className="text-neon">{accuracy}</span>
        </span>
        <span className="text-gray-600">
          False positive rate: <span className="text-neon">{falsePositiveRate}</span>
        </span>
      </div>
    </div>
  );
}
