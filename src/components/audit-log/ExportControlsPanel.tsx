import { useState } from "react";
import clsx from "clsx";
import { ConfigSelect } from "../config-manager/primitives/ConfigSelect";

interface ExportControlsPanelProps {
  scopeOptions: string[];
  hasRows: boolean;
  hasSelectedEntry: boolean;
  onExportCurrentPageJson: () => void;
  onExportCurrentPageCsv: () => void;
  onExportSelectedJson: () => void;
  onExportSelectedCsv: () => void;
}

export function ExportControlsPanel({
  scopeOptions,
  hasRows,
  hasSelectedEntry,
  onExportCurrentPageJson,
  onExportCurrentPageCsv,
  onExportSelectedJson,
  onExportSelectedCsv,
}: ExportControlsPanelProps) {
  const [scope, setScope] = useState(scopeOptions[0]);
  const isSelectedScope = scope === "Selected Entry";
  const canExport = isSelectedScope ? hasSelectedEntry : hasRows;

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Export Controls</h3>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-warn border bg-[#1A1200] border-warn/25">
          CURRENT PAGE ONLY
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-600 block mb-1.5">Export Format</label>
            <ConfigSelect options={["JSON", "CSV"]} />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1.5">Include</label>
            <ConfigSelect options={["Visible fields + hashes", "Hashes only unavailable"]} />
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
            disabled={!canExport}
            onClick={isSelectedScope ? onExportSelectedJson : onExportCurrentPageJson}
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            ↓ Export JSON
          </button>
          <button
            type="button"
            disabled={!canExport}
            onClick={isSelectedScope ? onExportSelectedCsv : onExportCurrentPageCsv}
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-neon/40 hover:text-neon transition-colors flex items-center justify-center gap-1.5"
          >
            ↓ Export CSV
          </button>
          <button
            type="button"
            disabled
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-600 border border-accent bg-surface flex items-center justify-center gap-1.5 opacity-50"
          >
            SOC2 Report Unavailable
          </button>
          <button
            type="button"
            disabled
            className="px-3 py-2 rounded-small text-xs font-medium text-gray-600 border border-accent bg-surface flex items-center justify-center gap-1.5 opacity-50"
          >
            GDPR Report Unavailable
          </button>
        </div>

        <button
          type="button"
          disabled
          className="w-full px-3 py-2 rounded-small text-xs font-bold text-gray-600 border border-accent bg-surface flex items-center justify-center gap-2 opacity-50"
        >
          Cryptographic proof bundle unavailable
        </button>
        <div className="text-xs text-gray-600 text-center">
          Exports include only data currently loaded in this browser view.
        </div>
      </div>
    </div>
  );
}
