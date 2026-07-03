import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchDashboardActivity,
  fetchDashboardSummary,
  fetchEventTrends,
  fetchTenantHealth,
} from "../dashboard";
import { timeAgo } from "../../lib/format";
import type { AccentColor } from "../../types/command-center";
import type { ActivityFeedItem, DashboardKpiTile, TenantHealthRow, TrendBar } from "../../types/dashboard";
import type {
  AuditLogEntryDTO,
  DashboardSummaryDTO,
  EventTrendsDTO,
  TenantHealthDTO,
} from "../types";

function severityTone(severity: string): AccentColor {
  if (severity === "critical") return "danger";
  if (severity === "warning") return "warn";
  return "info";
}

function isolationTone(level: string): AccentColor {
  if (level === "strict") return "neon";
  if (level === "partial") return "warn";
  if (level === "breach") return "danger";
  return "info";
}

function statusTone(status: string): AccentColor {
  if (status === "active") return "neon";
  if (status === "provisioning") return "info";
  if (status === "suspended") return "warn";
  return "danger";
}

function mapKpis(summary: DashboardSummaryDTO): DashboardKpiTile[] {
  return [
    {
      id: "total-tenants",
      label: "Total Tenants",
      value: String(summary.total_tenants),
      tone: "neon",
      description: `${summary.active_tenants} active`,
    },
    {
      id: "total-configs",
      label: "Configurations",
      value: String(summary.total_configurations),
      tone: "info",
      description: `${summary.configurations_with_pending_changes} pending change${summary.configurations_with_pending_changes === 1 ? "" : "s"}`,
    },
    {
      id: "audit-24h",
      label: "Audit Events (24h)",
      value: String(summary.audit_events_last_24h),
      tone: summary.critical_audit_events_last_24h > 0 ? "warn" : "neon",
      description: `${summary.critical_audit_events_last_24h} critical`,
    },
    {
      id: "open-anomalies",
      label: "Open Anomalies",
      value: String(summary.open_anomalies),
      tone: summary.open_anomalies > 0 ? "danger" : "neon",
      description: "open + investigating",
    },
  ];
}

function mapTenantHealth(items: TenantHealthDTO[]): TenantHealthRow[] {
  return items.map((row) => ({
    id: row.tenant_id,
    slug: row.tenant_slug,
    displayName: row.tenant_display_name,
    statusLabel: row.tenant_status.toUpperCase(),
    statusTone: statusTone(row.tenant_status),
    isolationScoreLabel: `${row.isolation_score}%`,
    isolationLevel: row.isolation_level.toUpperCase(),
    isolationTone: isolationTone(row.isolation_level),
    recentAuditCount: row.recent_audit_event_count,
    criticalAuditCount: row.critical_audit_event_count,
    openAnomalyCount: row.open_anomaly_count,
  }));
}

function mapActivity(items: AuditLogEntryDTO[]): ActivityFeedItem[] {
  return items.map((item) => ({
    id: item.id,
    severity: item.severity.toUpperCase(),
    severityTone: severityTone(item.severity),
    eventType: item.event_type.replace(/_/g, " "),
    description: item.description,
    actor: item.actor,
    tenantSlug: item.tenant_slug,
    timestamp: timeAgo(item.occurred_at),
  }));
}

function mapTrends(dto: EventTrendsDTO): TrendBar[] {
  const byBucket = new Map<string, TrendBar>();
  for (const row of dto.buckets) {
    const key = row.bucket;
    const existing = byBucket.get(key) ?? {
      bucketLabel: new Date(row.bucket).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      critical: 0,
      warning: 0,
      info: 0,
      total: 0,
    };
    if (row.severity === "critical") existing.critical += row.count;
    else if (row.severity === "warning") existing.warning += row.count;
    else existing.info += row.count;
    existing.total += row.count;
    byBucket.set(key, existing);
  }
  return Array.from(byBucket.values());
}

export function useDashboardViewModel() {
  const queryClient = useQueryClient();

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
  });
  const activityQuery = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: () => fetchDashboardActivity(10),
  });
  const tenantHealthQuery = useQuery({
    queryKey: ["dashboard", "tenant-health"],
    queryFn: fetchTenantHealth,
  });
  const trendsQuery = useQuery({
    queryKey: ["dashboard", "event-trends"],
    queryFn: () => fetchEventTrends("day"),
  });

  const isLoading =
    summaryQuery.isLoading ||
    activityQuery.isLoading ||
    tenantHealthQuery.isLoading ||
    trendsQuery.isLoading;

  const error = (summaryQuery.error ??
    activityQuery.error ??
    tenantHealthQuery.error ??
    trendsQuery.error) as Error | null;

  const data =
    summaryQuery.data && activityQuery.data && tenantHealthQuery.data && trendsQuery.data
      ? {
          kpis: mapKpis(summaryQuery.data),
          tenantHealth: mapTenantHealth(tenantHealthQuery.data.items),
          activity: mapActivity(activityQuery.data.items),
          trends: mapTrends(trendsQuery.data),
        }
      : undefined;

  function refetch() {
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  }

  return { data, isLoading, error, refetch };
}
