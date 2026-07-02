import type { AlgorithmEntry } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface AlgorithmRegistryProps {
  algorithms: AlgorithmEntry[];
  summary: string;
}

function AlgorithmCard({ algo }: { algo: AlgorithmEntry }) {
  if (algo.deprecated) {
    return (
      <div className="p-3 rounded-small border" style={{ backgroundColor: algo.bgHex, borderColor: algo.borderHex }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono" style={{ color: algo.nameHex }}>
              {algo.name}
            </span>
            <span
              className="px-1.5 py-0.5 rounded-small text-[9px] border"
              style={{ backgroundColor: algo.bgHex, color: algo.badgeHex, borderColor: `${algo.badgeHex}40` }}
            >
              {algo.badgeLabel}
            </span>
          </div>
          <span className="text-xs text-danger">✗ DISABLED</span>
        </div>
        <div className="text-xs text-gray-600">{algo.note}</div>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-small border" style={{ backgroundColor: algo.bgHex, borderColor: algo.borderHex }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-mono" style={{ color: algo.nameHex }}>
            {algo.name}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-small text-[9px] border"
            style={{ backgroundColor: algo.bgHex, color: algo.badgeHex, borderColor: `${algo.badgeHex}40` }}
          >
            {algo.badgeLabel}
          </span>
        </div>
        <span className="text-xs text-neon">✓ ACTIVE</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {algo.stats.map((stat) => (
          <div key={stat.label} className="flex justify-between">
            <span className="text-gray-600">{stat.label}</span>
            <span className={stat.valueTone ? ACCENT_CLASSES[stat.valueTone].text : "text-gray-300"}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlgorithmRegistry({ algorithms, summary }: AlgorithmRegistryProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Encryption Algorithm Registry</h3>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
          NIST APPROVED
        </span>
      </div>
      <div className="p-4 space-y-2 scrollbar-thin overflow-y-auto max-h-[380px]">
        {algorithms.map((algo) => (
          <AlgorithmCard key={algo.id} algo={algo} />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{summary}</span>
          <span className="text-neon">NIST SP 800-57 compliant</span>
        </div>
      </div>
    </div>
  );
}
