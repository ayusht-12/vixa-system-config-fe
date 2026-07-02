import type { ApiRateSummary } from "../../types/command-center";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionCard } from "../ui/SectionCard";

interface ApiRateMeterProps {
  summary: ApiRateSummary;
}

export function ApiRateMeter({ summary }: ApiRateMeterProps) {
  const ratePercent = (summary.currentRate / summary.limit) * 100;

  return (
    <SectionCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            API Rate Meter
          </h3>
          <div className="text-xs text-gray-600">
            Throughput · {summary.limit} req/s limit
          </div>
        </div>
        <Badge tone="neon">NOMINAL</Badge>
      </div>

      <div className="text-center mb-3">
        <div className="font-heading text-4xl font-bold text-white">
          {summary.currentRate}
          <span className="text-lg text-gray-500">/s</span>
        </div>
        <div className="text-xs text-gray-600 mt-0.5">
          current · peak {summary.peakRate}/s today
        </div>
      </div>

      <div className="mb-2">
        <div className="w-full h-4 rounded-small bg-gray-800 overflow-hidden">
          <div
            className="h-full rate-bar rounded-small transition-all duration-1000"
            style={{ width: `${ratePercent}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600 mb-3">
        <span>0</span>
        <span>250</span>
        <span>500</span>
        <span>750</span>
        <span className="text-danger">{summary.limit}</span>
      </div>

      <div className="space-y-1.5">
        {summary.endpoints.map((endpoint) => (
          <div
            key={endpoint.path}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-gray-500">{endpoint.path}</span>
            <div className="flex items-center gap-2">
              <ProgressBar
                percent={endpoint.percent}
                color={endpoint.color}
                trackClassName="w-20"
              />
              <span className="text-gray-400 w-12 text-right">
                {endpoint.ratePerSecond}/s
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-subtle grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-xs text-gray-600">Throttled</div>
          <div className="text-sm font-medium text-warn">
            {summary.throttled}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Rejected</div>
          <div className="text-sm font-medium text-danger">
            {summary.rejected}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Latency p99</div>
          <div className="text-sm font-medium text-neon">
            {summary.latencyP99Ms}ms
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
