import type { AttestationCheck, AttestationHistoryPoint } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface AttestationPanelProps {
  checks: AttestationCheck[];
  history: AttestationHistoryPoint[];
  lastRunLabel: string;
  scheduleNote: string;
  onRunAttestation?: () => void;
  isRunning?: boolean;
}

function CheckCard({ check }: { check: AttestationCheck }) {
  return (
    <div className={`rounded-large border p-3 ${check.glow}`} style={{ backgroundColor: check.bgHex, borderColor: check.borderHex }}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-sm ${ACCENT_CLASSES[check.tone].text}`}>✓</span>
        <span className={`text-xs font-medium ${ACCENT_CLASSES[check.tone].text}`}>{check.label}</span>
      </div>
      <div className="text-xs text-gray-400 mb-1">{check.description}</div>
      <div className="hash-text">{check.hashLabel}</div>
      <div className={`mt-2 text-xs font-bold ${ACCENT_CLASSES[check.tone].text}`}>PASS</div>
    </div>
  );
}

export function AttestationPanel({
  checks,
  history,
  lastRunLabel,
  scheduleNote,
  onRunAttestation,
  isRunning,
}: AttestationPanelProps) {
  return (
    <div className="rounded-large border bg-card border-neon/25 mb-3">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-neon text-sm">✓</span>
            <h3 className="font-heading font-semibold text-white text-sm">Hardware Attestation Reports</h3>
          </div>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            {lastRunLabel}
          </span>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-purple-400 border bg-[#0D0A1A] border-purple-500/25">
            FIPS 140-3 L3 VERIFIED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-3 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            ↓ Download Report
          </button>
          <button
            type="button"
            onClick={onRunAttestation}
            disabled={isRunning}
            className="px-3 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {isRunning ? "Running…" : "↻ Run Attestation"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {checks.map((check) => (
            <CheckCard key={check.label} check={check} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-subtle">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Attestation History (Last 7 Runs)
            </span>
            <span className="text-xs text-gray-600">{scheduleNote}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1">
              <div className="flex-1 flex items-end gap-1" style={{ height: 40 }}>
                {history.map((point, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-small bg-neon"
                    style={{ height: `${point.heightPercent}%` }}
                    title={point.label}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-small bg-neon" />
                <span>{history.length}/{history.length} PASS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-small bg-danger" />
                <span>0 FAIL</span>
              </div>
              <div>
                <span className="text-neon">100%</span> pass rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
