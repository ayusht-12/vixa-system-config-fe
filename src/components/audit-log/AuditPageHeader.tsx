import { PulseDot } from "../ui/PulseDot";

interface AuditPageHeaderProps {
  totalEntriesLabel: string;
  integrityVerifiedAgo: string;
  rootHash: string;
}

export function AuditPageHeader({
  totalEntriesLabel,
  integrityVerifiedAgo,
  rootHash,
}: AuditPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="font-heading font-bold text-white text-lg tracking-wide">
            Immutable Audit Log Viewer
          </h1>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium text-neon bg-gradient-to-br from-[#001A0D] to-card border border-neon/40">
            APPEND-ONLY · WORM
          </span>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#0A0F1A] text-info border border-info/25">
            MERKLE CHAIN ACTIVE
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Cryptographic hash chain · ECDSA-P384 signed · WORM storage synced ·{" "}
          {totalEntriesLabel} entries · integrity verified {integrityVerifiedAgo}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <PulseDot color="neon" />
          <span className="text-gray-400">Root Hash:</span>
          <span className="text-neon font-mono">{rootHash}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors"
        >
          ↓ Export CSV
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors"
        >
          ↓ Export JSON
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors"
        >
          📋 Compliance Report
        </button>
        <button
          type="button"
          className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          ✓ Verify Chain
        </button>
      </div>
    </div>
  );
}
