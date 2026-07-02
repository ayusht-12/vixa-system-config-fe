import { ConfigInput } from "../config-manager/primitives/ConfigInput";
import { SegmentedButtons } from "../config-manager/primitives/SegmentedButtons";

interface TimeRangePanelProps {
  options: string[];
  from: string;
  to: string;
}

export function TimeRangePanel({ options, from, to }: TimeRangePanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Time Range</h3>
      </div>
      <div className="p-3 space-y-2">
        <SegmentedButtons options={options} defaultValue="1h" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 block mb-1">From</label>
            <ConfigInput defaultValue={from} />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">To</label>
            <ConfigInput defaultValue={to} />
          </div>
        </div>
      </div>
    </div>
  );
}
