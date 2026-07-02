export type Severity = "critical" | "warning" | "info";

export type TenantTier = "enterprise" | "premium" | "standard";

export type TenantStatus = "critical" | "warning" | "healthy";

export type AccentColor = "neon" | "info" | "warn" | "danger" | "purple";

export interface EngineIdentity {
  instanceId: string;
  region: string;
  availabilityZone: string;
  clusterRole: string;
  uptime: string;
  buildHash: string;
  buildBranch: string;
}

export interface SystemHealthMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  percent: number;
  barColor: AccentColor;
  footnote: string;
}

export interface EndpointThroughput {
  path: string;
  percent: number;
  color: AccentColor;
  ratePerSecond: number;
}

export interface ApiRateSummary {
  currentRate: number;
  peakRate: number;
  limit: number;
  throttled: number;
  rejected: number;
  latencyP99Ms: number;
  endpoints: EndpointThroughput[];
}

export interface EtcdNode {
  id: string;
  address: string;
  role: "leader" | "follower";
  term: number;
  lagMs: number;
}

export interface EtcdClusterSummary {
  raftTerm: number;
  commitIndex: string;
  dbSizeGb: number;
  keyCount: string;
  writeOpsPerSecond: number;
  readOpsPerSecond: number;
  nodes: EtcdNode[];
}

export interface OidcAuthSummary {
  provider: string;
  activeTokenCount: string;
  authRatePerSecond: number;
  failureCount: number;
  failureRate: string;
  jwksRefreshedMinutesAgo: number;
  certValidDays: number;
}

export interface HsmSummary {
  module: string;
  keyOpsPerSecond: number;
  activeKeys: number;
  activeSlots: number;
  totalSlots: number;
  algorithms: string;
}

export interface AnomalyEvent {
  id: string;
  severity: Severity;
  score: number;
  timestamp: string;
  message: string;
  highlight?: string;
  meta: string[];
}

export interface TenantRow {
  id: string;
  name: string;
  tier: TenantTier;
  eventsPerSecond: number;
  apiQuotaPercent: number;
  sla: string;
  status: TenantStatus;
}

export interface TenantOverview {
  activeTenants: number;
  avgSla: string;
  eventsPerHour: string;
  degradedTenants: number;
  totalTenants: number;
  rows: TenantRow[];
}
