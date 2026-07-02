import { Link } from "react-router-dom";
import type { HeatmapRow, ThreatSeverity } from "../../types/anomaly-detection";
import { ROUTES } from "../../routes/routes";

interface AnomalyHeatmapProps {
  rows: HeatmapRow[];
  peakWindow: string;
  peakSummary: string;
  total24h: string;
}

const HOURS = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, "0"));

const SEVERITY_HEX: Record<ThreatSeverity, string> = {
  critical: "#FF3B3B",
  high: "#FBBF24",
  medium: "#60A4FA",
  low: "#00FFA3",
};

const LEGEND_ITEMS: { severity: ThreatSeverity; label: string }[] = [
  { severity: "critical", label: "Critical" },
  { severity: "high", label: "High" },
  { severity: "medium", label: "Medium" },
  { severity: "low", label: "Low" },
];

const SEVERITY_LABEL_CLASS: Record<ThreatSeverity, string> = {
  critical: "text-danger",
  high: "text-warn",
  medium: "text-info",
  low: "text-neon",
};

function cellStyle(severity: ThreatSeverity, intensity: number) {
  if (intensity <= 0) {
    return { backgroundColor: "var(--color-subtle)" };
  }
  const hex = SEVERITY_HEX[severity];
  const alpha = Math.round((intensity / 100) * 255)
    .toString(16)
    .padStart(2, "0");
  return {
    backgroundColor: `${hex}${alpha}`,
    boxShadow: intensity >= 100 ? `0 0 6px ${hex}99` : undefined,
  };
}

function HeatmapRowView({ row }: { row: HeatmapRow }) {
  return (
    <div className="flex items-center gap-2 mb-0.5 last:mb-0">
      <div className={`w-20 text-xs text-right pr-2 flex-shrink-0 ${SEVERITY_LABEL_CLASS[row.severity]}`}>
        {row.label}
      </div>
      <div className="flex flex-1 gap-0.5">
        {row.cells.map((intensity, index) => (
          <div
            key={index}
            className="heatmap-cell h-6 flex-1 rounded-small"
            style={cellStyle(row.severity, intensity)}
          />
        ))}
      </div>
    </div>
  );
}

export function AnomalyHeatmap({
  rows,
  peakWindow,
  peakSummary,
  total24h,
}: AnomalyHeatmapProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-4 mb-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Anomaly Timeline Heatmap
          </h3>
          <div className="text-xs text-gray-600">
            24-hour rolling window · severity density by hour × category
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.severity} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-small inline-block"
                style={{ backgroundColor: SEVERITY_HEX[item.severity] }}
              />
              <span className="text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex mb-1 ml-20">
            <div className="flex flex-1 gap-0.5">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="text-gray-700 text-center flex-1"
                  style={{ fontSize: "9px" }}
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {rows.map((row) => (
            <HeatmapRowView key={row.severity} row={row} />
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-subtle flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Peak anomaly window: <span className="text-danger font-medium">{peakWindow}</span> ·{" "}
          {peakSummary}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">
            Total 24h: <span className="text-gray-300">{total24h}</span>
          </span>
          <Link to={ROUTES.auditLogs.path} className="text-neon hover:underline">
            View Audit Log →
          </Link>
        </div>
      </div>
    </div>
  );
}
