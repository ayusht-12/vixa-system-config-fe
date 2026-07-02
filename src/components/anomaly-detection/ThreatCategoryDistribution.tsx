import type { ThreatCategoryStat } from "../../types/anomaly-detection";
import { ProgressBar } from "../ui/ProgressBar";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface ThreatCategoryDistributionProps {
  categories: ThreatCategoryStat[];
  windowLabel: string;
  totalEvents: number;
}

function CategoryRow({ category }: { category: ThreatCategoryStat }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{category.label}</span>
        <span className={ACCENT_CLASSES[category.tone].text}>
          {category.count} ({category.percent}%)
        </span>
      </div>
      <ProgressBar percent={category.percent} color={category.tone} height="sm" />
    </div>
  );
}

export function ThreatCategoryDistribution({
  categories,
  windowLabel,
  totalEvents,
}: ThreatCategoryDistributionProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-4 flex-1">
      <div className="mb-3">
        <h3 className="font-heading font-semibold text-white text-sm">
          Threat Categories
        </h3>
        <div className="text-xs text-gray-600">
          {windowLabel} · {totalEvents} total events
        </div>
      </div>
      <div className="space-y-2.5">
        {categories.map((category) => (
          <CategoryRow key={category.label} category={category} />
        ))}
      </div>
    </div>
  );
}
