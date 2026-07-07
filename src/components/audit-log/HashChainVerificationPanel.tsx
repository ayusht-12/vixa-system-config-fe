import type { HashChainStat } from "../../types/audit-log";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface HashChainVerificationPanelProps {
  stats: HashChainStat[];
  verification: { verified: string; failed: string; duration: string; statusLabel: string };
  chainSequence: string[];
  onVerify?: () => void;
  isVerifying?: boolean;
  verifyError?: Error | null;
}

function HashStatCard({ stat }: { stat: HashChainStat }) {
  return (
    <div
      className={
        stat.highlighted
          ? "p-3 rounded-small border bg-[#001A0D] border-neon/19"
          : "p-3 rounded-small border bg-[#0A0E14] border-subtle"
      }
    >
      <div className="text-xs text-gray-600 uppercase tracking-widest mb-1.5">{stat.label}</div>
      <div className="hash-text mb-1">{stat.line1}</div>
      <div className="hash-text">{stat.line2}</div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className={`text-xs ${ACCENT_CLASSES[stat.statusTone].text}`}>{stat.statusIcon}</span>
        <span className={`text-xs ${ACCENT_CLASSES[stat.statusTone].text}`}>{stat.statusLabel}</span>
      </div>
    </div>
  );
}

export function HashChainVerificationPanel({
  stats,
  verification,
  chainSequence,
  onVerify,
  isVerifying,
  verifyError,
}: HashChainVerificationPanelProps) {
  return (
    <div className="rounded-large border bg-card border-neon/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-warn text-sm">?</span>
            <h3 className="font-heading font-semibold text-white text-sm">
              Cryptographic Hash Chain Verification
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-warn border bg-[#1A1200] border-warn/25">
            {verification.statusLabel}
          </span>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-purple-400 border border-purple-900 bg-[#1A0A2A]">
            ECDSA-P384
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Merkle proof: unavailable</span>
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerifying}
            className="px-3 py-1 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-green-700 transition-colors disabled:opacity-40"
          >
            {isVerifying ? "Verifying…" : "↻ Re-verify"}
          </button>
        </div>
      </div>
      <div className="p-4">
        {verifyError && (
          <div className="mb-3 rounded-small border border-danger/25 bg-[#1A0505] px-3 py-2 text-xs text-danger">
            {verifyError.message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          {stats.map((stat) => (
            <HashStatCard key={stat.label} stat={stat} />
          ))}
          <div className="p-3 rounded-small border bg-[#0A0E14] border-subtle">
            <div className="text-xs text-gray-600 uppercase tracking-widest mb-1.5">
              Verification Stats
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Verified</span>
                <span className="text-neon">{verification.verified}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Failed</span>
                <span className="text-danger">{verification.failed}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-300">{verification.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <div className="text-xs text-gray-600 flex-shrink-0">Chain:</div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {chainSequence.map((hash, index) => (
              <span key={hash} className="flex items-center gap-1">
                {index > 0 && <span className="text-neon text-xs">→</span>}
                <span className="px-2 py-1 rounded-small border text-[9px] font-mono bg-[#001A0D] border-neon/25 text-neon">
                  {hash}
                </span>
              </span>
            ))}
            {chainSequence.length === 0 && (
              <span className="px-2 py-1 rounded-small border text-[9px] font-mono bg-[#1A1200] border-warn/25 text-warn">
                awaiting explicit verification
              </span>
            )}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span className="text-xs text-warn">Summary does not run full verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
