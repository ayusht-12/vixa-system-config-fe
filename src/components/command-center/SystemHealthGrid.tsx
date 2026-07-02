import clsx from "clsx";
import type { SystemHealthMetric } from "../../types/command-center";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionCard } from "../ui/SectionCard";

interface SystemHealthGridProps {
  metrics: SystemHealthMetric[];
}

function MetricCard({ metric }: { metric: SystemHealthMetric }) {
  return (
    <SectionCard className={clsx("p-3", metric.id === "cpu" && "glow-green")}>
      <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">
        {metric.label}
      </div>
      <div className="font-heading text-2xl font-bold text-white mb-1">
        {metric.value}
        {metric.unit && (
          <span className="text-sm text-gray-500">{metric.unit}</span>
        )}
      </div>
      <ProgressBar percent={metric.percent} color={metric.barColor} />
      <div className="text-xs text-gray-600 mt-1">{metric.footnote}</div>
    </SectionCard>
  );
}

export function SystemHealthGrid({ metrics }: SystemHealthGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
