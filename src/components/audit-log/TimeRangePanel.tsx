import { useEffect, useState } from "react";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";
import { SegmentedButtons } from "../config-manager/primitives/SegmentedButtons";

interface TimeRangePanelProps {
  options: string[];
  from: string;
  to: string;
  onSelectPreset: (option: string) => void;
  onApplyCustomRange: (from: string, to: string) => void;
}

export function TimeRangePanel({
  options,
  from,
  to,
  onSelectPreset,
  onApplyCustomRange,
}: TimeRangePanelProps) {
  const [draftFrom, setDraftFrom] = useState(from);
  const [draftTo, setDraftTo] = useState(to);

  useEffect(() => setDraftFrom(from), [from]);
  useEffect(() => setDraftTo(to), [to]);

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Time Range</h3>
      </div>
      <div className="p-3 space-y-2">
        <SegmentedButtons options={options} defaultValue="Custom" onChange={onSelectPreset} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 block mb-1">From</label>
            <ConfigInput
              type="datetime-local"
              value={draftFrom}
              onChange={(event) => setDraftFrom(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">To</label>
            <ConfigInput
              type="datetime-local"
              value={draftTo}
              onChange={(event) => setDraftTo(event.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onApplyCustomRange(draftFrom, draftTo)}
          className="w-full px-3 py-1.5 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          Apply Custom Range
        </button>
      </div>
    </div>
  );
}
