import type { TrendBar } from "../../types/dashboard";
import { SectionCard } from "../ui/SectionCard";

const SEGMENT_COLOR = {
  critical: "#FF3B3B",
  warning: "#FBBF24",
  info: "#60A4FA",
};

export function EventTrendsChart({ bars }: { bars: TrendBar[] }) {
  const maxTotal = Math.max(1, ...bars.map((bar) => bar.total));

  return (
    <SectionCard className="p-4 mb-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">Event Trends</h3>
          <div className="text-xs text-gray-600">Audit event volume by severity, last 7 days</div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {(["critical", "warning", "info"] as const).map((key) => (
            <div key={key} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-small inline-block"
                style={{ backgroundColor: SEGMENT_COLOR[key] }}
              />
              <span className="text-gray-500 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {bars.length === 0 ? (
        <div className="text-xs text-gray-600 text-center py-6">No events in this window</div>
      ) : (
        <div className="flex items-end gap-3 h-32">
          {bars.map((bar) => (
            <div key={bar.bucketLabel} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 flex flex-col-reverse rounded-small overflow-hidden bg-gray-900">
                {bar.critical > 0 && (
                  <div
                    style={{
                      height: `${(bar.critical / maxTotal) * 100}%`,
                      backgroundColor: SEGMENT_COLOR.critical,
                    }}
                  />
                )}
                {bar.warning > 0 && (
                  <div
                    style={{
                      height: `${(bar.warning / maxTotal) * 100}%`,
                      backgroundColor: SEGMENT_COLOR.warning,
                    }}
                  />
                )}
                {bar.info > 0 && (
                  <div
                    style={{
                      height: `${(bar.info / maxTotal) * 100}%`,
                      backgroundColor: SEGMENT_COLOR.info,
                    }}
                  />
                )}
              </div>
              <span className="text-[10px] text-gray-600">{bar.bucketLabel}</span>
              <span className="text-[10px] text-gray-400">{bar.total}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
