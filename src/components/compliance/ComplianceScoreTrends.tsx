import clsx from "clsx";
import type { TrendInsight, TrendSeries } from "../../types/compliance";

interface ComplianceScoreTrendsProps {
  series: TrendSeries[];
  xAxisLabels: string[];
  insights: TrendInsight[];
}

const Y_GRID_LINES = [40, 80, 120, 160];
const Y_LABELS = ["100%", "90%", "80%", "70%"];

function TrendChart({ series }: { series: TrendSeries[] }) {
  return (
    <div className="relative overflow-hidden rounded-small mb-4 bg-[#0A0E14]" style={{ height: 200 }}>
      <svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
        {Y_GRID_LINES.map((y) => (
          <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#21262D" strokeWidth="1" />
        ))}
        {Y_GRID_LINES.map((y, index) => (
          <text key={y} x="8" y={y + 4} fill="#374151" fontSize="9" fontFamily="JetBrains Mono">
            {Y_LABELS[index]}
          </text>
        ))}

        {series.map((line) => (
          <g key={line.id}>
            {line.areaPath && <path d={line.areaPath} fill={`${line.colorHex}0F`} />}
            <path
              d={line.linePath}
              fill="none"
              stroke={line.colorHex}
              strokeWidth="2"
              className="trend-line"
            />
            <circle cx={line.dot.x} cy={line.dot.y} r="3" fill={line.colorHex} />
          </g>
        ))}

        <line
          x1="480"
          y1="40"
          x2="480"
          y2="180"
          stroke="#FF3B3B"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
        />
        <text x="484" y="55" fill="#FF3B3B" fontSize="8" fontFamily="JetBrains Mono">
          GDPR violation
        </text>
      </svg>
    </div>
  );
}

export function ComplianceScoreTrends({
  series,
  xAxisLabels,
  insights,
}: ComplianceScoreTrendsProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Compliance Score Trends
          </h3>
          <div className="text-xs text-gray-600">30-day rolling window · all frameworks</div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {series.map((line) => (
            <div key={line.id} className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 inline-block"
                style={{ backgroundColor: line.colorHex }}
              />
              <span className="text-gray-500">{line.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <TrendChart series={series} />

        <div className="flex justify-between text-gray-700 mb-4 px-1 text-[9px]">
          {xAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {series.map((line) => (
            <div
              key={line.id}
              className="p-2.5 rounded-small border bg-surface"
              style={{ borderColor: `${line.colorHex}30` }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: line.colorHex }}
                />
                <span className="text-xs text-gray-500">{line.label}</span>
              </div>
              <div className="font-heading text-lg font-bold" style={{ color: line.colorHex }}>
                {line.currentScore}
              </div>
              <div className="text-xs text-gray-600">{line.trendLabel}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className={clsx(
                "p-2.5 rounded-small border",
                insight.direction === "up" ? "bg-surface border-subtle" : "bg-[#1A1200] border-[#FBBF2430]",
              )}
            >
              <div className="flex items-start gap-2">
                <span
                  className={clsx(
                    "text-xs mt-0.5",
                    insight.direction === "up" ? "text-neon" : "text-warn",
                  )}
                >
                  {insight.direction === "up" ? "↑" : "↓"}
                </span>
                <div>
                  <div className="text-xs text-gray-300 font-medium">{insight.title}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{insight.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
