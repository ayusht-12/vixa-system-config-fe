import { useQueries } from "@tanstack/react-query";
import { fetchAnomalyOverview } from "../anomalies";
import { fetchCommandCenterOverview } from "../engine";
import { fetchHsmOverview } from "../hsm";
import { fetchTenancyOverview } from "../tenancy";
import type {
  AnomalyEvent,
  ApiRateSummary,
  EngineIdentity,
  EtcdClusterSummary,
  HsmSummary,
  OidcAuthSummary,
  Severity,
  SystemHealthMetric,
  TenantOverview,
  TenantStatus,
} from "../../types/command-center";
import { formatBytesGb, formatCompactCount, formatUptime, percentToAccentColor, timeAgo } from "../../lib/format";
import type { AnomalyEventDTO, CommandCenterOverviewDTO, HsmOverviewDTO, TenancyOverviewDTO } from "../types";

function toFeedSeverity(dtoSeverity: string): Severity {
  if (dtoSeverity === "critical") return "critical";
  if (dtoSeverity === "high" || dtoSeverity === "medium") return "warning";
  return "info";
}

function mapAnomalyEvents(events: AnomalyEventDTO[]): AnomalyEvent[] {
  return events.slice(0, 6).map((event) => ({
    id: event.id,
    severity: toFeedSeverity(event.severity),
    score: Math.round(event.score * 10) / 10,
    timestamp: timeAgo(event.occurred_at),
    message: event.title,
    meta: [event.category, event.actor ?? "system"],
  }));
}

function mapEngine(dto: CommandCenterOverviewDTO["engine"]): EngineIdentity {
  return {
    instanceId: dto.instance_uuid,
    region: dto.region,
    availabilityZone: dto.availability_zone,
    clusterRole: dto.cluster_role.toUpperCase(),
    uptime: formatUptime(dto.uptime_seconds),
    buildHash: dto.build_hash,
    buildBranch: dto.build_branch,
  };
}

function mapSystemHealth(dto: CommandCenterOverviewDTO["system_health"]): SystemHealthMetric[] {
  return dto.map((metric) => ({
    id: metric.metric_key,
    label: metric.label,
    value: metric.value.toString(),
    unit: metric.unit,
    percent: metric.percent_of_limit ?? 0,
    barColor: percentToAccentColor(metric.percent_of_limit ?? 0),
    footnote: metric.footnote,
  }));
}

function mapApiRate(dto: CommandCenterOverviewDTO["api_rate"]): ApiRateSummary {
  return {
    currentRate: Math.round(dto.current_rate),
    peakRate: Math.round(dto.peak_rate),
    limit: Math.round(dto.rate_limit),
    throttled: dto.throttled,
    rejected: dto.rejected,
    latencyP99Ms: dto.latency_p99_ms,
    endpoints: dto.endpoints.map((endpoint) => ({
      path: endpoint.endpoint_path,
      percent: endpoint.percent_of_total,
      color: percentToAccentColor(endpoint.percent_of_total),
      ratePerSecond: Math.round(endpoint.requests_per_second),
    })),
  };
}

function mapEtcd(dto: CommandCenterOverviewDTO["etcd_cluster"]): EtcdClusterSummary {
  return {
    raftTerm: dto.raft_term,
    commitIndex: "—",
    dbSizeGb: formatBytesGb(dto.db_size_bytes),
    keyCount: "—",
    writeOpsPerSecond: Math.round(dto.write_ops_per_second),
    readOpsPerSecond: Math.round(dto.read_ops_per_second),
    nodes: dto.nodes.map((node) => ({
      id: node.node_name,
      address: node.address,
      role: node.is_leader ? "leader" : "follower",
      term: node.raft_term,
      lagMs: Math.round(node.lag_ms),
    })),
  };
}

function mapOidc(dto: CommandCenterOverviewDTO["oidc"]): OidcAuthSummary {
  return {
    provider: dto.provider ?? "—",
    activeTokenCount: formatCompactCount(dto.active_tokens),
    authRatePerSecond: Math.round(dto.auth_rate),
    failureCount: dto.failure_count,
    failureRate: `${dto.failure_rate_percent.toFixed(1)}%`,
    jwksRefreshedMinutesAgo: dto.jwks_refreshed_minutes_ago ?? 0,
    certValidDays: dto.cert_valid_days ?? 0,
  };
}

function mapHsm(dto: HsmOverviewDTO | undefined): HsmSummary {
  const activeKeys = dto?.master_keys.filter((k) => k.effective_status === "active").length ?? 0;
  const activeSlots = dto?.slots.filter((s) => s.is_active).length ?? 0;
  const totalSlots = dto?.slots.length ?? 0;
  const keyOpsPerSecond = Math.round(dto?.slots.reduce((sum, s) => sum + s.ops_per_second, 0) ?? 0);
  const algorithms =
    dto?.algorithms
      .filter((a) => a.is_active)
      .map((a) => a.name)
      .join(", ") ?? "—";

  return {
    module: dto?.module_serial ?? "—",
    keyOpsPerSecond,
    activeKeys,
    activeSlots,
    totalSlots,
    algorithms,
  };
}

// TenantRow.apiQuotaPercent and .sla have no backend source yet (see
// backend coverage audit) — surfaced as "N/A" rather than fabricated.
function mapTenants(dto: TenancyOverviewDTO | undefined): TenantOverview {
  const tenants = dto?.tenants ?? [];
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const degradedTenants = tenants.filter(
    (t) => t.isolation_level === "partial" || t.isolation_level === "breach",
  ).length;

  const statusFor = (isolationLevel: string): TenantStatus => {
    if (isolationLevel === "breach") return "critical";
    if (isolationLevel === "partial" || isolationLevel === "pending") return "warning";
    return "healthy";
  };

  return {
    activeTenants,
    avgSla: "N/A",
    eventsPerHour: formatCompactCount((dto?.total_events_per_second ?? 0) * 3600),
    degradedTenants,
    totalTenants: tenants.length,
    rows: tenants.slice(0, 8).map((tenant) => ({
      id: tenant.id,
      name: tenant.display_name,
      tier: tenant.tier as TenantOverview["rows"][number]["tier"],
      eventsPerSecond: Math.round(tenant.events_per_second),
      apiQuotaPercent: 0,
      sla: "N/A",
      status: statusFor(tenant.isolation_level),
    })),
  };
}

export function useCommandCenterViewModel() {
  const results = useQueries({
    queries: [
      { queryKey: ["engine", "overview"], queryFn: fetchCommandCenterOverview },
      { queryKey: ["anomalies", "overview"], queryFn: fetchAnomalyOverview },
      { queryKey: ["hsm", "overview"], queryFn: fetchHsmOverview },
      { queryKey: ["tenancy", "overview"], queryFn: fetchTenancyOverview },
    ],
  });

  const [engineQuery, anomaliesQuery, hsmQuery, tenancyQuery] = results;

  const isLoading = results.some((r) => r.isLoading);
  const error = results.find((r) => r.error)?.error as Error | undefined;

  const data = engineQuery.data
    ? {
        identity: mapEngine(engineQuery.data.engine),
        systemHealth: mapSystemHealth(engineQuery.data.system_health),
        apiRate: mapApiRate(engineQuery.data.api_rate),
        etcdCluster: mapEtcd(engineQuery.data.etcd_cluster),
        oidc: mapOidc(engineQuery.data.oidc),
        hsm: mapHsm(hsmQuery.data),
        anomalyEvents: mapAnomalyEvents(anomaliesQuery.data?.recent_events ?? []),
        tenantOverview: mapTenants(tenancyQuery.data),
      }
    : undefined;

  return { data, isLoading, error, refetch: () => results.forEach((r) => r.refetch()) };
}
