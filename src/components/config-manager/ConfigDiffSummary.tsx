interface DiffChange {
  key: string;
  fromValue: string;
  toValue: string;
  note: string;
}

interface ConfigDiffSummaryProps {
  changes: DiffChange[];
  onApplyAll?: () => void;
  applyDisabled?: boolean;
}

export function ConfigDiffSummary({ changes, onApplyAll, applyDisabled }: ConfigDiffSummaryProps) {
  if (changes.length === 0) return null;

  return (
    <div className="rounded-large border bg-card mb-4 border-warn/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block bg-warn animate-pulse-dot" />
          <h3 className="font-heading font-semibold text-white text-sm">
            Pending Changes · Config Diff
          </h3>
          <span className="px-2 py-0.5 rounded-small text-xs text-warn border bg-[#1A1200] border-warn/25">
            {changes.length} CHANGES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onApplyAll}
            disabled={applyDisabled}
            className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
          >
            ▶ Apply All Changes
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {changes.map((change) => (
            <div key={change.key} className="p-3 rounded-small border bg-[#0A0E14] border-neon/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{change.key}</span>
                <span className="px-1.5 py-0.5 rounded-small text-[9px] border text-neon bg-[#001A0D] border-[#00FFA330]">
                  MODIFIED
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="text-danger line-through">{change.fromValue}</span>
                <span className="text-gray-600">→</span>
                <span className="font-bold text-neon">{change.toValue}</span>
              </div>
              <div className="text-xs text-gray-600">{change.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-small border flex items-start gap-2 bg-[#1A1200] border-warn/25">
          <span className="text-warn text-sm mt-0.5">⚠</span>
          <div>
            <div className="text-xs text-warn font-medium">
              Hot-reload will apply changes without restart
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              An audit log entry is created for every parameter applied.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
