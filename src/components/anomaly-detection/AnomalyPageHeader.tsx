import { PulseDot } from "../ui/PulseDot";

interface AnomalyPageHeaderProps {
  eventsPerSecond: number;
  mlModel: string;
}

export function AnomalyPageHeader({ eventsPerSecond, mlModel }: AnomalyPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div>
        <h1 className="font-heading font-bold text-white text-lg tracking-wide">
          Real-Time Anomaly Detection
        </h1>
        <div className="text-xs text-gray-500 mt-0.5">
          ML-powered behavioral analysis · streaming threat intelligence · auto-classification
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <PulseDot color="neon" />
          <span className="text-gray-400">Stream:</span>
          <span className="text-neon">ACTIVE</span>
          <span className="text-gray-600">
            · {eventsPerSecond.toLocaleString()} events/s
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <span className="text-gray-400">ML Model:</span>
          <span className="text-info">{mlModel}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-300 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ⏸ Pause Feed
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium border border-danger/40 bg-[#1A0505] text-danger transition-colors"
        >
          🔔 Silence All
        </button>
      </div>
    </div>
  );
}
