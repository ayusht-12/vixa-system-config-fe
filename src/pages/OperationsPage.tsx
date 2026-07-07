import { useOperationsViewModel } from "../api/viewModels/operations";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { Badge } from "../components/ui/Badge";
import { SectionCard } from "../components/ui/SectionCard";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { timeAgo } from "../lib/format";

type BadgeTone = "neon" | "blue" | "purple" | "danger" | "warn" | "neutral";

function statusTone(status: string): BadgeTone {
  if (["up", "ready", "healthy", "succeeded"].includes(status)) return "neon";
  if (["down", "not_ready", "failed", "degraded"].includes(status)) return "danger";
  if (["running", "queued"].includes(status)) return "warn";
  return "neutral";
}

function levelTone(level: string): BadgeTone {
  if (level === "critical") return "danger";
  if (level === "error") return "danger";
  if (level === "warning") return "warn";
  return "neutral";
}

function StatusTile({ label, status, detail }: { label: string; status: string; detail?: string }) {
  return (
    <div className="rounded-small bg-surface p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <Badge tone={statusTone(status)}>{status.toUpperCase()}</Badge>
      </div>
      {detail && <div className="text-[10px] text-gray-600 mt-1 truncate">{detail}</div>}
    </div>
  );
}

export function OperationsPage() {
  const vm = useOperationsViewModel();

  if (vm.isLoading) return <LoadingState label="Loading operations…" />;
  if (vm.error) return <ErrorState message={vm.error.message} onRetry={vm.refetch} />;

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-3 rounded-large border border-subtle bg-card px-4 py-3">
        <h1 className="font-heading font-bold text-white text-sm">Operations &amp; Observability</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Live infrastructure status, jobs, metrics and application errors
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {vm.readiness && (
          <StatusTile
            label="Readiness"
            status={vm.readiness.status}
            detail={`${vm.readiness.checks.length} checks`}
          />
        )}
        {vm.db && (
          <StatusTile
            label="Database"
            status={vm.db.status}
            detail={
              vm.db.latency_ms != null
                ? `${vm.db.latency_ms}ms · pool ${vm.db.checked_out}/${vm.db.pool_size}`
                : (vm.db.detail ?? undefined)
            }
          />
        )}
        {vm.cache && (
          <StatusTile label="Cache" status={vm.cache.status} detail={vm.cache.backend} />
        )}
        {vm.migrations && (
          <StatusTile
            label="Migrations"
            status={vm.migrations.is_up_to_date ? "up" : "degraded"}
            detail={vm.migrations.head_revision ?? "unknown head"}
          />
        )}
        {vm.events && (
          <StatusTile
            label="Event Sink"
            status={vm.events.status}
            detail={`${vm.events.total_published} published`}
          />
        )}
      </div>

      {vm.metrics && (
        <SectionCard className="mb-4">
          <div className="px-4 py-2.5 border-b border-subtle flex items-center justify-between">
            <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
              System Metrics
            </h2>
            <span className="text-[10px] text-gray-600">
              {vm.metrics.total_requests_per_second} req/s · p99{" "}
              {vm.metrics.max_latency_p99_ms}ms · {vm.metrics.total_throttled} throttled
            </span>
          </div>
          {vm.metrics.gauges.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-gray-600">
              No metric samples recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 p-4">
              {vm.metrics.gauges.map((gauge) => (
                <div key={gauge.metric_key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">{gauge.metric_key}</span>
                    <span className="text-gray-300 font-medium">
                      {gauge.value}
                      {gauge.unit ? ` ${gauge.unit}` : ""}
                    </span>
                  </div>
                  {gauge.percent_of_limit != null && (
                    <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-neon"
                        style={{ width: `${Math.min(100, gauge.percent_of_limit)}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard className="mb-4">
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Background Jobs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-subtle">
                <th className="text-left font-medium px-4 py-2">Job</th>
                <th className="text-left font-medium px-4 py-2">Queue</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Progress</th>
                <th className="text-left font-medium px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {vm.jobs.map((job) => (
                <tr key={job.id} className="border-b border-subtle/60 last:border-0">
                  <td className="px-4 py-2.5 text-gray-200 font-medium">{job.name}</td>
                  <td className="px-4 py-2.5 text-gray-500">{job.queue}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone={statusTone(job.status)}>{job.status.toUpperCase()}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-gray-400">
                    {Math.round(job.progress_percent)}%
                    {job.attempts > 1 && (
                      <span className="text-gray-600">
                        {" "}
                        · try {job.attempts}/{job.max_attempts}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 max-w-xs truncate">
                    {job.last_error ? (
                      <span className="text-danger">{job.last_error}</span>
                    ) : (
                      (job.detail ?? "—")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Recent Application Errors
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-subtle">
                <th className="text-left font-medium px-4 py-2">Level</th>
                <th className="text-left font-medium px-4 py-2">Type</th>
                <th className="text-left font-medium px-4 py-2">Message</th>
                <th className="text-left font-medium px-4 py-2">Source</th>
                <th className="text-right font-medium px-4 py-2">×</th>
                <th className="text-right font-medium px-4 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {vm.errors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-600">
                    No recent errors.
                  </td>
                </tr>
              ) : (
                vm.errors.map((err) => (
                  <tr key={err.id} className="border-b border-subtle/60 last:border-0">
                    <td className="px-4 py-2.5">
                      <Badge tone={levelTone(err.level)}>{err.level.toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-gray-300 font-medium">{err.error_type}</td>
                    <td className="px-4 py-2.5 text-gray-500 max-w-md truncate">{err.message}</td>
                    <td className="px-4 py-2.5 text-gray-600 font-mono">{err.source}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400">{err.occurrences}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">
                      {timeAgo(err.occurred_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <QuickLinksFooter />
    </div>
  );
}
