import { PulseDot } from "../ui/PulseDot";

interface HsmPageHeaderProps {
  serial: string;
}

export function HsmPageHeader({ serial }: HsmPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="font-heading font-bold text-white text-lg tracking-wide">
            Cryptographic &amp; HSM Security
          </h1>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#0D0A1A] text-purple-400 border border-purple-500/25">
            FIPS 140-3 LEVEL 3
          </span>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#001A0D] text-neon border border-neon/25">
            PKCS#11 ACTIVE
          </span>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#0A0F1A] text-info border border-info/19">
            THALES LUNA 7
          </span>
        </div>
        <div className="text-xs text-gray-500">
          HSM module management · Master key lifecycle · Key ceremony audit ·
          Certificate inventory · Algorithm registry · Hardware attestation
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <PulseDot color="neon" />
          <span className="text-gray-400">HSM Serial:</span>
          <span className="text-neon font-mono">{serial}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          📋 Attestation Report
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ↓ Export Keys CSV
        </button>
        <button
          type="button"
          className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          + Initiate Key Ceremony
        </button>
      </div>
    </div>
  );
}
