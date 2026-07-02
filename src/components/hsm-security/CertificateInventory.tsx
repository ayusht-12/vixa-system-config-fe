import clsx from "clsx";
import type { CertRow } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";

interface CertificateInventoryProps {
  certificates: CertRow[];
  summary: { totalLabel: string; showingLabel: string };
}

const GRID_COLUMNS = "180px 80px 100px 100px 80px 80px";

const TYPE_BADGE: Record<string, string> = {
  neon: "bg-[#001A0D] border-neon/25",
  purple: "bg-[#0D0A1A] border-purple-500/25",
  info: "bg-[#0A0F1A] border-info/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
};

function CertRowItem({ cert }: { cert: CertRow }) {
  return (
    <div
      className="cert-row px-4 py-2.5 border-b border-subtle last:border-b-0 cursor-pointer transition-colors"
      style={{ borderLeft: `3px solid ${cert.borderHex}` }}
    >
      <div className="grid items-center gap-2" style={{ gridTemplateColumns: GRID_COLUMNS }}>
        <div>
          <div className={clsx("text-xs", cert.cnTone)}>{cert.cn}</div>
          <div className="hash-text mt-0.5">{cert.algoLine}</div>
        </div>
        <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] border", ACCENT_CLASSES[cert.typeTone].text, TYPE_BADGE[cert.typeTone])}>
          {cert.type}
        </span>
        <div className="text-xs text-gray-500 font-mono">{cert.issued}</div>
        <div className={clsx("text-xs font-mono", ACCENT_CLASSES[cert.expiresTone].text)}>{cert.expires}</div>
        <div className={clsx("text-xs", ACCENT_CLASSES[cert.daysLeftTone].text)}>{cert.daysLeft}</div>
        <span className={clsx("px-1.5 py-0.5 rounded-small text-[9px] border", ACCENT_CLASSES[cert.statusTone].text, TYPE_BADGE[cert.statusTone])}>
          {cert.status}
        </span>
      </div>
    </div>
  );
}

export function CertificateInventory({ certificates, summary }: CertificateInventoryProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white text-sm">Certificate Inventory</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-purple-400 border bg-[#0D0A1A] border-purple-500/25">
            {summary.totalLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-44">
            <ConfigInput placeholder="Search CN / SAN..." />
          </div>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity">
            + Import
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-subtle bg-[#0A0E14]">
        <div className="grid text-gray-600 uppercase tracking-wider text-[9px]" style={{ gridTemplateColumns: GRID_COLUMNS, gap: 8 }}>
          <span>Common Name</span>
          <span>Type</span>
          <span>Issued</span>
          <span>Expires</span>
          <span>Days Left</span>
          <span>Status</span>
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto max-h-[280px]">
        {certificates.map((cert) => (
          <CertRowItem key={cert.id} cert={cert} />
        ))}
      </div>

      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-gray-500">{summary.showingLabel}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500">
            Auto-renewal: <span className="text-neon">enabled</span> · threshold 30d
          </span>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            View All →
          </button>
        </div>
      </div>
    </div>
  );
}
