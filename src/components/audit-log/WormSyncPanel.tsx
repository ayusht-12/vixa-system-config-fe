import type { WormSyncStatus } from "../../types/audit-log";
import { PulseDot } from "../ui/PulseDot";
import { ProgressBar } from "../ui/ProgressBar";

interface WormSyncPanelProps {
  status: WormSyncStatus;
}

export function WormSyncPanel({ status }: WormSyncPanelProps) {
  return (
    <div className="rounded-large border glow-blue bg-card border-info/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <PulseDot color="info" />
          <h3 className="font-heading font-semibold text-white text-sm">WORM Storage Sync</h3>
        </div>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-info border bg-[#0A0F1A] border-info/25">
          S3 OBJECT LOCK
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Bucket</span>
          <span className="text-info font-mono text-[10px]">{status.bucket}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Object Lock Mode</span>
          <span className="text-neon">{status.lockMode}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Retention Period</span>
          <span className="text-gray-300">{status.retentionPeriod}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Last Sync</span>
          <span className="text-neon">{status.lastSync}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Pending Sync</span>
          <span className="text-gray-300">{status.pendingSync}</span>
        </div>
        <div className="pt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">Sync Progress</span>
            <span className="text-neon">{status.syncPercent}%</span>
          </div>
          <ProgressBar percent={status.syncPercent} color="info" height="sm" />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-small text-center bg-surface">
            <div className="text-xs text-gray-600">Synced</div>
            <div className="text-xs text-neon font-bold">{status.synced}</div>
          </div>
          <div className="p-2 rounded-small text-center bg-surface">
            <div className="text-xs text-gray-600">Replicas</div>
            <div className="text-xs text-info font-bold">{status.replicas}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
