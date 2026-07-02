import clsx from "clsx";
import { Link } from "react-router-dom";
import type { ControlCell, ControlCellStatus, ControlMappingRow } from "../../types/compliance";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { ROUTES } from "../../routes/routes";

interface ControlMappingTableProps {
  rows: ControlMappingRow[];
  summary: { fullyMapped: number; partial: number; gaps: number; total: number };
}

const CELL_STYLES: Record<ControlCellStatus, string> = {
  mapped: "text-neon bg-[#001A0D] border-[#00FFA330]",
  partial: "text-warn bg-[#1A1200] border-[#FBBF2430]",
  gap: "text-danger bg-[#1A0505] border-[#FF3B3B30]",
  na: "text-gray-500 bg-surface border-accent",
};

function ControlCellBadge({ cell }: { cell: ControlCell }) {
  return (
    <span className={clsx("px-1.5 py-0.5 rounded-small text-xs border", CELL_STYLES[cell.status])}>
      {cell.code}
    </span>
  );
}

const FRAMEWORK_COLUMNS: { id: keyof ControlMappingRow["cells"]; label: string }[] = [
  { id: "soc2", label: "SOC2" },
  { id: "iso27001", label: "ISO27001" },
  { id: "gdpr", label: "GDPR" },
  { id: "hipaa", label: "HIPAA" },
];

export function ControlMappingTable({ rows, summary }: ControlMappingTableProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Control Mapping Status
          </h3>
          <div className="text-xs text-gray-600">
            Cross-framework control coverage · {summary.total} controls total
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-small inline-block bg-neon" />
            <span className="text-gray-500">Mapped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-small inline-block bg-warn" />
            <span className="text-gray-500">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-small inline-block bg-danger" />
            <span className="text-gray-500">Gap</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="scrollbar-thin overflow-x-auto overflow-y-auto max-h-[380px]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-subtle">
                <th className="text-left text-gray-600 pb-2 font-medium uppercase tracking-wider pr-4 text-[10px]">
                  Control Domain
                </th>
                {FRAMEWORK_COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    className="text-center text-gray-600 pb-2 font-medium uppercase tracking-wider px-2 text-[10px]"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider pl-2 text-[10px]">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.domain}
                  className="border-b border-subtle last:border-b-0 hover:bg-gray-900 transition-colors"
                >
                  <td className="py-2.5 pr-4">
                    <div className="text-gray-300 font-medium">{row.domain}</div>
                    <div className="text-gray-600 text-[10px]">{row.description}</div>
                  </td>
                  {FRAMEWORK_COLUMNS.map((col) => (
                    <td key={col.id} className="py-2.5 px-2 text-center">
                      <ControlCellBadge cell={row.cells[col.id]} />
                    </td>
                  ))}
                  <td className="py-2.5 pl-2 text-right">
                    <span className={clsx("font-bold", ACCENT_CLASSES[row.coverageTone].text)}>
                      {row.coveragePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 pt-2 border-t border-subtle flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Fully mapped: <span className="text-neon">{summary.fullyMapped}</span>
            </span>
            <span className="text-gray-600">
              Partial: <span className="text-warn">{summary.partial}</span>
            </span>
            <span className="text-gray-600">
              Gaps: <span className="text-danger">{summary.gaps}</span>
            </span>
          </div>
          <Link to={ROUTES.auditLogs.path} className="text-neon hover:underline">
            View Audit Trail →
          </Link>
        </div>
      </div>
    </div>
  );
}
