import { useState } from "react";
import clsx from "clsx";
import { ConfigSelect } from "../config-manager/primitives/ConfigSelect";

interface ExportControlsPanelProps {
  scopeOptions: string[];
}

export function ExportControlsPanel({ scopeOptions }: ExportControlsPanelProps) {
  const [scope, setScope] = useState(scopeOptions[0]);

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Export Controls</h3>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
          COMPLIANCE EVIDENCE
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 block mb-1.5">Export Format</label>
            <ConfigSelect options={["JSON (signed)", "CSV", "NDJSON", "Parquet"]} />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1.5">Include</label>
            <ConfigSelect options={["Full payload + hashes", "Summary only", "Hashes only"]} />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1.5">Scope</label>
          <div className="flex gap-1.5 flex-wrap">
            {scopeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setScope(option)}
                className={clsx(
                  "px-2.5 py-1 rounded-small text-xs font-medium transition-colors",
                  option === scope
                    ? "text-gray-900 bg-neon"
                    : "text-gray-500 border border-accent bg-surface hover:border-gray-500",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            ↓ Export JSON
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            ↓ Export CSV
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            📋 SOC2 Report
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            📋 GDPR Report
          </button>
        </div>

        <button
          type="button"
          className="w-full px-3 py-2 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          🔐 Export with Cryptographic Proof
        </button>
        <div className="text-xs text-gray-600 text-center">
          Exports include Merkle proof + ECDSA-P384 signature bundle
        </div>
      </div>
    </div>
  );
}
