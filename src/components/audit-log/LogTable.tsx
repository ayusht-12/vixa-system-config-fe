import clsx from "clsx";
import type { LogEntry, LogSeverity } from "../../types/audit-log";

interface LogTableProps {
  entries: LogEntry[];
  entryCountLabel: string;
  paginationLabel: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onExportCsv: () => void;
}

const SEVERITY_BADGE_CLASSES: Record<LogSeverity, string> = {
  CRITICAL: "bg-[#1A0505] text-danger border-danger/25",
  WARNING: "bg-[#1A1200] text-warn border-warn/25",
  INFO: "bg-[#001A0D] text-neon border-neon/25",
  AUTH: "bg-[#0A0F1A] text-info border-info/25",
  CONFIG: "bg-[#0D0A1A] text-purple-400 border-purple-500/25",
  HSM: "bg-[#0D0A1A] text-purple-400 border-purple-500/25",
};

const INTEGRITY_CLASSES: Record<LogEntry["integrity"], string> = {
  verified: "text-neon",
  unverified: "text-warn",
  warning: "text-warn",
  failed: "text-danger",
};

const GRID_COLUMNS = "140px 80px 120px 100px 1fr 120px 80px";

function LogRow({
  entry,
  isSelected,
  onSelect,
}: {
  entry: LogEntry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={clsx(
        "log-row px-4 py-2.5 border-b border-subtle last:border-b-0 cursor-pointer transition-colors",
        isSelected && "bg-[#001A0D] !border-neon/25",
      )}
    >
      <div className="grid items-start gap-2" style={{ gridTemplateColumns: GRID_COLUMNS }}>
        <div>
          <div className="text-xs text-gray-300 font-mono">{entry.timestamp}</div>
          <div className="hash-text mt-0.5">seq:{entry.seq}</div>
        </div>
        <div>
          <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] font-medium border", SEVERITY_BADGE_CLASSES[entry.severity])}>
            {entry.severity}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-400">{entry.eventType}</span>
          <div className="hash-text mt-0.5">{entry.eventSubtype}</div>
        </div>
        <div>
          <span className={clsx("text-xs", entry.tenantToneClass)}>{entry.tenant}</span>
        </div>
        <div>
          <div className="text-xs text-gray-300">{entry.description}</div>
          <div className="hash-text mt-0.5">{entry.chainLabel}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">{entry.actor}</div>
          <div className="hash-text mt-0.5">{entry.actorMeta}</div>
        </div>
        <div className="flex items-center gap-1">
          <span className={clsx("text-xs", INTEGRITY_CLASSES[entry.integrity])}>
            {entry.integrity === "verified" ? "✓" : entry.integrity === "failed" ? "!" : "?"}
          </span>
          <span className={clsx("text-[9px]", INTEGRITY_CLASSES[entry.integrity])}>
            {entry.integrity === "verified" ? "VALID" : entry.integrity.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function LogTable({
  entries,
  entryCountLabel,
  paginationLabel,
  selectedId,
  onSelect,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onExportCsv,
}: LogTableProps) {
  const pages = Array.from(
    new Set([1, Math.max(1, page - 1), page, Math.min(totalPages, page + 1), totalPages]),
  ).filter((candidate) => candidate >= 1 && candidate <= totalPages);

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="font-heading font-semibold text-white text-sm">
            State-Change Event Timeline
          </h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            {entryCountLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-gray-600">Critical</span>
            <span className="w-2 h-2 rounded-full ml-2 bg-warn" />
            <span className="text-gray-600">Warning</span>
            <span className="w-2 h-2 rounded-full ml-2 bg-neon" />
            <span className="text-gray-600">Info</span>
            <span className="w-2 h-2 rounded-full ml-2 bg-info" />
            <span className="text-gray-600">Auth</span>
          </div>
          <button
            type="button"
            onClick={onExportCsv}
            disabled={entries.length === 0}
            className="px-2.5 py-1 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors"
          >
            ↓ Export Page CSV
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-subtle bg-[#0A0E14]">
        <div
          className="grid text-gray-600 uppercase tracking-wider text-[9px]"
          style={{ gridTemplateColumns: GRID_COLUMNS, gap: 8 }}
        >
          <span>Timestamp (UTC)</span>
          <span>Severity</span>
          <span>Event Type</span>
          <span>Tenant</span>
          <span>Description</span>
          <span>Actor</span>
          <span>Integrity</span>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto max-h-[480px]">
        {entries.map((entry) => (
          <LogRow
            key={entry.id}
            entry={entry}
            isSelected={entry.id === selectedId}
            onSelect={() => onSelect(entry.id)}
          />
        ))}
        {entries.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-gray-600">
            No audit entries match the current filters.
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <div className="text-xs text-gray-500">{paginationLabel}</div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-small px-2 py-1 text-xs bg-surface border border-accent text-gray-400"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}/page
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="px-2.5 py-1 rounded-small text-xs text-gray-500 border border-accent bg-surface hover:border-gray-500 transition-colors disabled:opacity-40"
          >
            ← Prev
          </button>
          {pages.map((candidate, index) => (
            <span key={candidate} className="flex items-center gap-2">
              {index > 0 && candidate - pages[index - 1] > 1 && (
                <span className="text-xs text-gray-600">...</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(candidate)}
                className={clsx(
                  "px-2.5 py-1 rounded-small text-xs border transition-colors",
                  candidate === page
                    ? "text-neon bg-[#001A0D] border-neon/25"
                    : "text-gray-500 border-accent bg-surface hover:border-gray-500",
                )}
              >
                {candidate.toLocaleString()}
              </button>
            </span>
          ))}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-2.5 py-1 rounded-small text-xs text-gray-500 border border-accent bg-surface hover:border-gray-500 transition-colors disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
