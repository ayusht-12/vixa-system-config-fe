import clsx from "clsx";
import type { AccentColor } from "../../types/command-center";
import type { MasterKeyRow } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { ProgressBar } from "../ui/ProgressBar";

interface MasterKeyTableProps {
  keys: MasterKeyRow[];
  summary: { active: number; expiring: number; retired: number; pending: number; policyNote: string };
  onCreateKey?: () => void;
  onRotateNow?: () => void;
}

const ALGO_BADGE_STYLES: Record<AccentColor, string> = {
  neon: "bg-[#001A0D] border-neon/25",
  purple: "bg-[#0D0A1A] border-purple-500/25",
  info: "bg-[#0A0F1A] border-info/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
};

const GRID_COLUMNS = "160px 80px 100px 100px 80px 1fr 80px";

const STATUS_BADGE: Record<MasterKeyRow["status"], string> = {
  ACTIVE: "bg-[#001A0D] text-neon border-neon/25",
  EXPIRING: "bg-[#1A1200] text-warn border-warn/25",
  RETIRED: "bg-[#1A0505] text-danger border-danger/25",
  PENDING: "bg-[#0A0F1A] text-info border-info/25",
  DISABLED: "bg-[#1A0505] text-danger border-danger/25",
};

const ROTATION_COLOR: Record<MasterKeyRow["status"], "neon" | "warn" | "danger" | "info"> = {
  ACTIVE: "neon",
  EXPIRING: "warn",
  RETIRED: "danger",
  PENDING: "info",
  DISABLED: "danger",
};

const ACTION_CLASSES: Record<MasterKeyRow["actionVariant"], string> = {
  primary: "text-gray-900 bg-neon hover:opacity-90 font-medium",
  default: "text-gray-400 border border-accent bg-surface hover:border-gray-500",
  info: "text-info border border-info/25 bg-[#0A0F1A] hover:border-blue-500",
};

function KeyRow({ row }: { row: MasterKeyRow }) {
  const showBar = row.status === "ACTIVE" || row.status === "EXPIRING" || row.status === "PENDING";

  return (
    <div className="row-hover px-4 py-3 border-b border-subtle last:border-b-0 cursor-pointer transition-colors">
      <div className="grid items-center gap-2" style={{ gridTemplateColumns: GRID_COLUMNS }}>
        <div>
          <div className={clsx("text-xs font-mono", ACCENT_CLASSES[row.keyIdTone].text)}>{row.keyId}</div>
          <div className="hash-text mt-0.5">{row.keyIdMeta}</div>
        </div>
        <div>
          <span
            className={clsx(
              "algo-badge px-1.5 py-0.5 rounded-small border font-mono text-[10px]",
              ACCENT_CLASSES[row.algorithmTone].text,
              ALGO_BADGE_STYLES[row.algorithmTone],
            )}
          >
            {row.algorithm}
          </span>
        </div>
        <div className="text-xs text-gray-400 font-mono">{row.created}</div>
        <div className={clsx("text-xs font-mono", ACCENT_CLASSES[row.expiresTone].text)}>{row.expires}</div>
        <div>
          <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] border", STATUS_BADGE[row.status])}>
            {row.status}
          </span>
        </div>
        <div>
          {showBar ? (
            <div className="flex items-center gap-2">
              <ProgressBar percent={row.rotationPercent} color={ROTATION_COLOR[row.status]} trackClassName="flex-1" height="sm" />
              <span className={clsx("text-xs whitespace-nowrap", ACCENT_CLASSES[ROTATION_COLOR[row.status]].text)}>
                {row.rotationLabel}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-600">{row.rotationLabel}</div>
          )}
          <div className="text-xs text-gray-600 mt-0.5">{row.rotationNote}</div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={row.canRotate ? row.onRotate : row.onDetails}
            disabled={row.isMutating}
            className={clsx("px-1.5 py-0.5 rounded-small text-[9px]", ACTION_CLASSES[row.actionVariant])}
          >
            {row.isMutating ? "…" : row.actionLabel}
          </button>
          {row.canDisable && (
            <button
              type="button"
              onClick={row.onDisable}
              disabled={row.isMutating}
              className="px-1.5 py-0.5 rounded-small text-[9px] text-danger border border-danger/25 bg-[#1A0505] hover:border-red-700 disabled:opacity-40"
            >
              Disable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MasterKeyTable({ keys, summary, onCreateKey, onRotateNow }: MasterKeyTableProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white text-sm">Master Key Lifecycle</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            ROTATION SCHEDULE ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateKey}
            className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
          >
            + New Key
          </button>
          <button
            type="button"
            onClick={onRotateNow}
            className="px-2.5 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity"
          >
            ↻ Rotate Now
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-subtle bg-[#0A0E14]">
        <div className="grid text-gray-600 uppercase tracking-wider text-[9px]" style={{ gridTemplateColumns: GRID_COLUMNS, gap: 8 }}>
          <span>Key ID</span>
          <span>Algorithm</span>
          <span>Created</span>
          <span>Expires</span>
          <span>Status</span>
          <span>Rotation Schedule</span>
          <span>Actions</span>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto max-h-[340px]">
        {keys.map((row) => (
          <KeyRow key={row.id} row={row} />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon" />
            <span className="text-gray-500">Active: {summary.active}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span className="text-gray-500">Expiring: {summary.expiring}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-gray-500">Retired: {summary.retired}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-info" />
            <span className="text-gray-500">Pending: {summary.pending}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">{summary.policyNote}</div>
      </div>
    </div>
  );
}
