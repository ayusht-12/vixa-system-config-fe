interface DiffChange {
  key: string;
  badgeLabel: string;
  badgeTone: "neon" | "warn";
  fromValue: string;
  toValue: string;
  note: string;
}

const CHANGES: DiffChange[] = [
  {
    key: "retention.audit_logs",
    badgeLabel: "MODIFIED",
    badgeTone: "neon",
    fromValue: "5y",
    toValue: "7y",
    note: "Compliance requirement update · GDPR Art.30",
  },
  {
    key: "retention.debug_logs",
    badgeLabel: "MODIFIED",
    badgeTone: "neon",
    fromValue: "14d",
    toValue: "7d",
    note: "Cost optimization · reduce storage by ~40%",
  },
  {
    key: "redis.query_result_cache",
    badgeLabel: "DISABLED",
    badgeTone: "warn",
    fromValue: "enabled",
    toValue: "disabled",
    note: "Stale data risk · pending cache invalidation fix",
  },
];

const BADGE_CLASSES: Record<DiffChange["badgeTone"], string> = {
  neon: "text-neon bg-[#001A0D] border-[#00FFA330]",
  warn: "text-warn bg-[#1A1200] border-[#FBBF2430]",
};

const TO_VALUE_CLASSES: Record<DiffChange["badgeTone"], string> = {
  neon: "text-neon",
  warn: "text-warn",
};

export function ConfigDiffSummary() {
  return (
    <div className="rounded-large border bg-card mb-4 border-warn/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block bg-warn animate-pulse-dot" />
          <h3 className="font-heading font-semibold text-white text-sm">
            Pending Changes · Config Diff
          </h3>
          <span className="px-2 py-0.5 rounded-small text-xs text-warn border bg-[#1A1200] border-warn/25">
            {CHANGES.length} CHANGES
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
          >
            ↺ Revert All
          </button>
          <button
            type="button"
            className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
          >
            ▶ Apply All Changes
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHANGES.map((change) => (
            <div key={change.key} className="p-3 rounded-small border bg-[#0A0E14] border-neon/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{change.key}</span>
                <span className={`px-1.5 py-0.5 rounded-small text-[9px] border ${BADGE_CLASSES[change.badgeTone]}`}>
                  {change.badgeLabel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="text-danger line-through">{change.fromValue}</span>
                <span className="text-gray-600">→</span>
                <span className={`font-bold ${TO_VALUE_CLASSES[change.badgeTone]}`}>{change.toValue}</span>
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
              Changes to retention policy will not affect existing data · new policy
              applies to data ingested after apply · audit log entry will be created
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
