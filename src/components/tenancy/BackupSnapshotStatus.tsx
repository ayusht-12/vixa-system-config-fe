import clsx from "clsx";
import type { SnapshotEntry, SnapshotStyle } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface BackupSnapshotStatusProps {
  snapshots: SnapshotEntry[];
  badgeLabel: string;
  summary: { current: number; stale: number };
}

const CARD_STYLE: Record<SnapshotStyle, string> = {
  ok: "bg-[#001A0D] border-neon/25",
  stale: "glow-amber bg-[#1A1200] border-warn/25",
  pending: "bg-[#0A0F1A] border-info/25",
};

const STATUS_BADGE: Record<SnapshotStyle, string> = {
  ok: "text-neon bg-[#001A0D] border-neon/25",
  stale: "text-warn bg-[#1A1200] border-warn/25",
  pending: "text-info bg-[#0A0F1A] border-info/25",
};

const ICON_CLASS: Record<SnapshotStyle, string> = {
  ok: "text-neon",
  stale: "text-warn",
  pending: "text-info",
};

function SnapshotCard({ entry }: { entry: SnapshotEntry }) {
  return (
    <div className={clsx("p-3 rounded-small border", CARD_STYLE[entry.style])}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs", ICON_CLASS[entry.style])}>{entry.icon}</span>
          <span className={clsx("text-xs font-medium font-mono", ICON_CLASS[entry.style])}>{entry.tenant}</span>
        </div>
        <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] border", STATUS_BADGE[entry.style])}>
          {entry.statusLabel}
        </span>
      </div>
      {entry.fields.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {entry.fields.map((field) => (
            <div key={field.label} className="flex justify-between">
              <span className="text-gray-600">{field.label}</span>
              <span className={field.tone ? ACCENT_CLASSES[field.tone].text : "text-gray-300"}>{field.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500">{entry.note}</div>
      )}
      {entry.actionLabel && (
        <button
          type="button"
          className="mt-2 w-full px-2 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          {entry.actionLabel}
        </button>
      )}
    </div>
  );
}

export function BackupSnapshotStatus({ snapshots, badgeLabel, summary }: BackupSnapshotStatusProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Backup Snapshot Status</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            {badgeLabel}
          </span>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            Snapshot All
          </button>
        </div>
      </div>
      <div className="p-4 space-y-2 scrollbar-thin overflow-y-auto max-h-[380px]">
        {snapshots.map((entry) => (
          <SnapshotCard key={entry.id} entry={entry} />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon" />
            <span className="text-gray-500">Current: {summary.current}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span className="text-gray-500">Stale: {summary.stale}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          Schedule: <span className="text-neon">hourly · 30d retention</span>
        </span>
      </div>
    </div>
  );
}
