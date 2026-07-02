import clsx from "clsx";
import type { SchemaRow } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface SchemaValidationQueueProps {
  rows: SchemaRow[];
  badgeLabel: string;
  summary: { valid: number; warn: number; failed: number; migrating: number };
}

const GRID_COLUMNS = "150px 120px 80px 80px 80px 1fr";

const STATUS_BADGE: Record<string, string> = {
  neon: "bg-[#001A0D] border-neon/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
  info: "bg-[#0A0F1A] border-info/25",
};

function Row({ row }: { row: SchemaRow }) {
  return (
    <div className="row-hover px-4 py-2.5 border-b border-subtle last:border-b-0 cursor-pointer transition-colors">
      <div className="grid items-center gap-2" style={{ gridTemplateColumns: GRID_COLUMNS }}>
        <div className={clsx("text-xs font-mono", ACCENT_CLASSES[row.tenantTone].text)}>{row.tenant}</div>
        <div className="text-xs text-gray-400 font-mono">{row.schemaName}</div>
        <div className="text-xs text-gray-400">{row.version}</div>
        <div className="text-xs text-gray-400">{row.tables}</div>
        <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] border w-fit", ACCENT_CLASSES[row.statusTone].text, STATUS_BADGE[row.statusTone])}>
          {row.status}
        </span>
        {row.blink ? (
          <div className={clsx("text-xs animate-pulse-dot", ACCENT_CLASSES[row.lastValidatedTone].text)}>
            {row.lastValidatedNote}
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            {row.lastValidated} · <span className={ACCENT_CLASSES[row.lastValidatedTone].text}>{row.lastValidatedNote}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SchemaValidationQueue({ rows, badgeLabel, summary }: SchemaValidationQueueProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white text-sm">Schema Validation Queue</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-info border bg-[#0A0F1A] border-info/25">
            {badgeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            Run All Validations
          </button>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity">
            + Add Schema
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-subtle bg-[#0A0E14]">
        <div className="grid text-gray-600 uppercase tracking-wider text-[9px]" style={{ gridTemplateColumns: GRID_COLUMNS, gap: 8 }}>
          <span>Tenant</span>
          <span>Schema Name</span>
          <span>Version</span>
          <span>Tables</span>
          <span>Status</span>
          <span>Last Validated</span>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto max-h-[320px]">
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon" />
            <span className="text-gray-500">Valid: {summary.valid}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span className="text-gray-500">Warn: {summary.warn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-gray-500">Failed: {summary.failed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-info" />
            <span className="text-gray-500">Migrating: {summary.migrating}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          Auto-validation: <span className="text-neon">every 15min</span>
        </span>
      </div>
    </div>
  );
}
