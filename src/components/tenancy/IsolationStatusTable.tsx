import clsx from "clsx";
import type { TenantIsolationRow } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { PulseDot } from "../ui/PulseDot";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";

interface TenantActions {
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

interface IsolationStatusTableProps {
  rows: TenantIsolationRow[];
  badgeLabel: string;
  summary: { enforced: number; partial: number; breach: number; pending: number; showingLabel: string };
  actions?: TenantActions;
}

const GRID_COLUMNS_BASE = "140px 80px 90px 80px 80px 80px 1fr";
const GRID_COLUMNS_WITH_ACTIONS = "140px 80px 90px 80px 80px 80px 1fr 170px";

const TIER_BADGE: Record<string, string> = {
  purple: "bg-[#0D0A1A] border-purple-500/25",
  info: "bg-[#0A0F1A] border-info/25",
  neon: "bg-[#161B22] border-accent",
};

const STATUS_BADGE: Record<string, string> = {
  neon: "bg-[#001A0D] border-neon/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
  info: "bg-[#0A0F1A] border-info/25",
};

function ActionButtons({ row, actions }: { row: TenantIsolationRow; actions: TenantActions }) {
  const status = row.lifecycleStatus;
  return (
    <div className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
      {status === "active" ? (
        <button
          type="button"
          onClick={() => actions.onDeactivate(row.id)}
          className="px-1.5 py-0.5 rounded-small text-[9px] text-warn border border-warn/25 bg-[#1A1200] hover:border-amber-500 transition-colors"
        >
          Suspend
        </button>
      ) : (
        <button
          type="button"
          onClick={() => actions.onActivate(row.id)}
          className="px-1.5 py-0.5 rounded-small text-[9px] text-neon border border-neon/25 bg-[#001A0D] hover:border-green-500 transition-colors"
        >
          Activate
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Delete tenant "${row.tenantId}"? This cannot be undone.`)) {
            actions.onDelete(row.id);
          }
        }}
        className="px-1.5 py-0.5 rounded-small text-[9px] text-danger border border-danger/25 bg-[#1A0505] hover:border-red-500 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

function Row({ row, actions }: { row: TenantIsolationRow; actions?: TenantActions }) {
  return (
    <div className="row-hover px-4 py-2.5 border-b border-subtle last:border-b-0 cursor-pointer transition-colors">
      <div
        className="grid items-center gap-2"
        style={{ gridTemplateColumns: actions ? GRID_COLUMNS_WITH_ACTIONS : GRID_COLUMNS_BASE }}
      >
        <div>
          <div className={clsx("text-xs font-mono", ACCENT_CLASSES[row.tenantTone].text)}>{row.tenantId}</div>
          <div className="hash-text mt-0.5">{row.orgId}</div>
        </div>
        <span
          className={clsx(
            "px-1.5 py-0.5 rounded-small text-[9px] border",
            ACCENT_CLASSES[row.tierTone].text,
            TIER_BADGE[row.tierTone] ?? TIER_BADGE.neon,
          )}
        >
          {row.tier}
        </span>
        <div className="flex items-center gap-1.5">
          <PulseDot color={row.isolationTone} size="sm" pulse={row.isolationPulse} />
          <span className={clsx("text-xs", ACCENT_CLASSES[row.isolationTone].text)}>{row.isolationLevel}</span>
        </div>
        <span className={clsx("text-xs", ACCENT_CLASSES[row.dbSchemaTone].text)}>{row.dbSchema}</span>
        <span className={clsx("text-xs", ACCENT_CLASSES[row.networkTone].text)}>{row.network}</span>
        <span className={clsx("text-xs", ACCENT_CLASSES[row.encryptionTone].text)}>{row.encryption}</span>
        <div className="flex items-center gap-1.5">
          <span
            className={clsx(
              "px-1.5 py-0.5 rounded-small text-[9px] border",
              ACCENT_CLASSES[row.statusTone].text,
              STATUS_BADGE[row.statusTone],
            )}
          >
            {row.statusLabel}
          </span>
          <span className="text-xs text-gray-600">{row.scoreLabel}</span>
        </div>
        {actions && <ActionButtons row={row} actions={actions} />}
      </div>
    </div>
  );
}

export function IsolationStatusTable({ rows, badgeLabel, summary, actions }: IsolationStatusTableProps) {
  const columns = actions ? GRID_COLUMNS_WITH_ACTIONS : GRID_COLUMNS_BASE;
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white text-sm">Isolation Enforcement Status</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            {badgeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-40">
            <ConfigInput placeholder="Filter tenants..." />
          </div>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-subtle bg-[#0A0E14]">
        <div className="grid text-gray-600 uppercase tracking-wider text-[9px]" style={{ gridTemplateColumns: columns, gap: 8 }}>
          <span>Tenant ID</span>
          <span>Tier</span>
          <span>Isolation</span>
          <span>DB Schema</span>
          <span>Network</span>
          <span>Encryption</span>
          <span>Status</span>
          {actions && <span>Actions</span>}
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto max-h-[380px]">
        {rows.map((row) => (
          <Row key={row.id} row={row} actions={actions} />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon" />
            <span className="text-gray-500">Enforced: {summary.enforced}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span className="text-gray-500">Partial: {summary.partial}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-gray-500">Breach: {summary.breach}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-info" />
            <span className="text-gray-500">Pending: {summary.pending}</span>
          </div>
        </div>
        <span className="text-xs text-gray-500">{summary.showingLabel}</span>
      </div>
    </div>
  );
}
