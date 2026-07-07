import { useNotificationsViewModel } from "../api/viewModels/notifications";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { Badge } from "../components/ui/Badge";
import { SectionCard } from "../components/ui/SectionCard";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { timeAgo } from "../lib/format";

type BadgeTone = "neon" | "blue" | "purple" | "danger" | "warn" | "neutral";

function severityTone(severity: string): BadgeTone {
  if (severity === "critical") return "danger";
  if (severity === "warning") return "warn";
  return "blue";
}

const SEVERITY_DOT: Record<string, string> = {
  critical: "#FF3B3B",
  warning: "#FBBF24",
  info: "#60A4FA",
};

export function NotificationsPage() {
  const vm = useNotificationsViewModel();

  if (vm.isLoading) return <LoadingState label="Loading notifications…" />;
  if (vm.error) return <ErrorState message={vm.error.message} onRetry={vm.refetch} />;

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-3 rounded-large border border-subtle bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-white text-sm">Notifications &amp; Alerting</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {vm.unread ? `${vm.unread.unread} unread of ${vm.unread.total}` : "Inbox"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => vm.markAllRead()}
          disabled={!vm.unread || vm.unread.unread === 0}
          className="rounded-small border border-accent px-3 py-1.5 text-xs text-gray-300 hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Mark all read
        </button>
      </div>

      <SectionCard className="mb-4">
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Inbox
          </h2>
        </div>
        <div className="divide-y divide-subtle/60">
          {vm.notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gray-600">No notifications.</div>
          ) : (
            vm.notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 ${n.is_read ? "opacity-60" : ""}`}
              >
                <span
                  className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: SEVERITY_DOT[n.severity] ?? "#60A4FA" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-200 text-xs font-medium">{n.title}</span>
                    <Badge tone={severityTone(n.severity)}>{n.severity.toUpperCase()}</Badge>
                    <span className="text-[10px] text-gray-600">{n.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">{n.body}</p>
                  <div className="text-[10px] text-gray-600 mt-1">
                    {n.source} · {timeAgo(n.created_at)}
                    {n.link && <span className="text-gray-700"> · {n.link}</span>}
                  </div>
                </div>
                {!n.is_read && (
                  <button
                    type="button"
                    onClick={() => vm.markRead(n.id)}
                    className="shrink-0 rounded-small border border-accent px-2 py-1 text-[10px] text-gray-400 hover:border-gray-500 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </SectionCard>

      {vm.isAdmin && (
        <SectionCard>
          <div className="px-4 py-2.5 border-b border-subtle">
            <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
              Alert Rules
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-600 border-b border-subtle">
                  <th className="text-left font-medium px-4 py-2">Rule</th>
                  <th className="text-left font-medium px-4 py-2">Source</th>
                  <th className="text-left font-medium px-4 py-2">Threshold</th>
                  <th className="text-left font-medium px-4 py-2">Channel → Target</th>
                  <th className="text-left font-medium px-4 py-2">Triggers</th>
                  <th className="text-right font-medium px-4 py-2">State</th>
                </tr>
              </thead>
              <tbody>
                {vm.alertRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-subtle/60 last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="text-gray-200 font-medium">{rule.name}</div>
                      <div className="text-gray-600 font-mono">{rule.condition}</div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">{rule.source}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={severityTone(rule.threshold_severity)}>
                        {rule.threshold_severity.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {rule.channel} → {rule.target}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {rule.trigger_count}
                      {rule.last_triggered_at && (
                        <span className="text-gray-600"> · {timeAgo(rule.last_triggered_at)}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Badge tone={rule.is_enabled ? "neon" : "neutral"}>
                        {rule.is_enabled ? "ENABLED" : "DISABLED"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      <QuickLinksFooter />
    </div>
  );
}
