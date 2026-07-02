import { PulseDot } from "../ui/PulseDot";

interface CompliancePageHeaderProps {
  lastAuditAgo: string;
  nextScheduled: string;
}

export function CompliancePageHeader({
  lastAuditAgo,
  nextScheduled,
}: CompliancePageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="font-heading font-bold text-white text-lg tracking-wide">
          Regulatory & Compliance Monitor
        </h1>
        <div className="text-xs text-gray-500 mt-0.5">
          Active frameworks · control mapping · policy violations · schema
          validation · score trends
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <PulseDot color="neon" />
          <span className="text-gray-400">Last Audit:</span>
          <span className="text-neon">{lastAuditAgo}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <span className="text-gray-400">Next Scheduled:</span>
          <span className="text-info">{nextScheduled}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          ▶ Run Audit Now
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-300 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ↓ Export Report
        </button>
      </div>
    </div>
  );
}
