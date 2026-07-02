import type {
  BaselineMetric,
  HeatmapRow,
  Incident,
  SeveritySummaryCard,
  StreamAction,
  TenantIsolationEntry,
  ThreatCategoryStat,
  ThreatStreamEvent,
  TickerItem,
} from "../types/anomaly-detection";

export const streamStatus = {
  eventsPerSecond: 2847,
  mlModel: "IsolationForest v3.2",
};

export const tickerItems: TickerItem[] = [
  { id: "t1", severity: "critical", message: "acme-corp · Privilege escalation · IAM::AssumeRole × 847 · score:0.97" },
  { id: "t2", severity: "critical", message: "203.0.113.0/24 · DDoS vector detected · /ingest endpoint · score:0.94" },
  { id: "t3", severity: "high", message: "healthsys-io · Unusual data exfil pattern · 2.3GB outbound · score:0.82" },
  { id: "t4", severity: "high", message: "govcloud-fed · Auth token replay attempt · 14 failed validations · score:0.79" },
  { id: "t5", severity: "medium", message: "etcd-1 · Write latency spike · p99:18.3ms · score:0.61" },
  { id: "t6", severity: "low", message: "startup-alpha · Config drift detected · 3 parameters · score:0.34" },
];

export const severitySummary: SeveritySummaryCard[] = [
  { severity: "critical", label: "Critical", count: 4, trendLabel: "↑ 2 from last hour", barPercent: 100 },
  { severity: "high", label: "High", count: 11, trendLabel: "↑ 3 from last hour", barPercent: 75 },
  { severity: "medium", label: "Medium", count: 23, trendLabel: "↓ 5 from last hour", barPercent: 55 },
  { severity: "low", label: "Low", count: 47, trendLabel: "↓ 12 from last hour", barPercent: 30 },
];

const escalate: StreamAction = { label: "🚨 Escalate Incident", variant: "escalate" };
const isolate: StreamAction = { label: "🔒 Isolate Tenant", variant: "isolate" };
const investigate: StreamAction = { label: "Investigate →", variant: "default" };
const dismiss: StreamAction = { label: "Dismiss", variant: "default" };
const acknowledge: StreamAction = { label: "Acknowledge", variant: "default" };

export const threatStreamEvents: ThreatStreamEvent[] = [
  {
    id: "evt-1",
    severity: "critical",
    score: 0.97,
    category: "PRIVILEGE_ESC",
    categoryColorHex: "#A78BFA",
    timestamp: "14:31:52",
    status: "OPEN",
    description: "Unusual privilege escalation pattern — IAM::AssumeRole called 847× in 90s window",
    meta: [
      { label: "Tenant", value: "acme-corp", tone: "warn" },
      { label: "Principal", value: "svc-deploy-01" },
      { label: "Baseline σ", value: "+4.7σ", tone: "danger" },
      { label: "Duration", value: "90s" },
    ],
    actions: [escalate, isolate, investigate, dismiss],
  },
  {
    id: "evt-2",
    severity: "critical",
    score: 0.94,
    category: "DDOS_VECTOR",
    categoryColorHex: "#FF3B3B",
    timestamp: "14:30:17",
    status: "OPEN",
    description: "API rate spike 3.2σ above behavioral baseline — possible volumetric DDoS",
    meta: [
      { label: "Source CIDR", value: "203.0.113.0/24", tone: "danger" },
      { label: "Endpoint", value: "/api/v4/ingest" },
      { label: "Rate", value: "3,241/s", tone: "danger" },
      { label: "Baseline", value: "743/s" },
    ],
    actions: [escalate, { label: "🛡 Block CIDR", variant: "block" }, investigate, dismiss],
  },
  {
    id: "evt-3",
    severity: "high",
    score: 0.82,
    category: "DATA_EXFIL",
    categoryColorHex: "#FBBF24",
    timestamp: "14:29:03",
    status: "INVESTIGATING",
    description: "Anomalous outbound data transfer — 2.3GB in 4min window, 6.1σ above baseline",
    meta: [
      { label: "Tenant", value: "healthsys-io", tone: "warn" },
      { label: "Volume", value: "2.3 GB", tone: "warn" },
      { label: "Dest IP", value: "198.51.100.42" },
      { label: "Protocol", value: "HTTPS/443" },
    ],
    actions: [escalate, isolate, investigate],
  },
  {
    id: "evt-4",
    severity: "high",
    score: 0.79,
    category: "TOKEN_REPLAY",
    categoryColorHex: "#FBBF24",
    timestamp: "14:27:41",
    status: "OPEN",
    description: "JWT token replay attack — 14 failed validations with expired tokens from 3 source IPs",
    meta: [
      { label: "Tenant", value: "govcloud-fed", tone: "warn" },
      { label: "Attempts", value: "14 failed", tone: "warn" },
      { label: "Source IPs", value: "3 distinct" },
      { label: "Token Age", value: "+72h expired", tone: "danger" },
    ],
    actions: [escalate, investigate, dismiss],
  },
  {
    id: "evt-5",
    severity: "medium",
    score: 0.61,
    category: "LATENCY_SPIKE",
    categoryColorHex: "#60A4FA",
    timestamp: "14:28:44",
    status: "OPEN",
    description: "etcd write latency p99 exceeded threshold — 18.3ms vs 15ms limit",
    meta: [
      { label: "Node", value: "etcd-1", tone: "info" },
      { label: "p99 Latency", value: "18.3ms", tone: "warn" },
      { label: "Threshold", value: "15ms" },
      { label: "Duration", value: "3m 22s" },
    ],
    actions: [investigate, acknowledge, dismiss],
  },
  {
    id: "evt-6",
    severity: "low",
    score: 0.34,
    category: "CONFIG_DRIFT",
    categoryColorHex: "#00FFA3",
    timestamp: "14:22:03",
    status: "OPEN",
    description: "Configuration drift detected — 3 parameters deviated from baseline snapshot",
    meta: [
      { label: "Tenant", value: "startup-alpha", tone: "neon" },
      { label: "Parameters", value: "3 changed" },
      { label: "Last Snapshot", value: "2h 14m ago" },
      { label: "Risk", value: "LOW", tone: "neon" },
    ],
    actions: [{ label: "View Config →", variant: "link", href: "/config-manager" }, acknowledge],
  },
];

export const baselineMetrics: BaselineMetric[] = [
  {
    id: "api-rate",
    label: "API Request Rate",
    baselineLabel: "baseline: 743/s",
    currentLabel: "current: 3,241/s",
    currentTone: "danger",
    percent: 100,
    barStyle: "linear-gradient(90deg, #00FFA3 0%, #FBBF24 30%, #FF3B3B 60%)",
    markerPercent: 22.9,
    showAxis: true,
  },
  {
    id: "auth-failure",
    label: "Auth Failure Rate",
    baselineLabel: "baseline: 0.02%",
    currentLabel: "current: 0.31%",
    currentTone: "warn",
    percent: 31,
    barStyle: "#FBBF24",
    markerPercent: 2,
  },
  {
    id: "data-transfer",
    label: "Outbound Transfer",
    baselineLabel: "baseline: 120MB/h",
    currentLabel: "current: 2.3GB",
    currentTone: "danger",
    percent: 92,
    barStyle: "linear-gradient(90deg, #00FFA3 0%, #FF3B3B 40%)",
    markerPercent: 5,
  },
  {
    id: "privilege-ops",
    label: "Privilege Ops/min",
    baselineLabel: "baseline: 12/min",
    currentLabel: "current: 565/min",
    currentTone: "danger",
    percent: 100,
    barStyle: "#FF3B3B",
    markerPercent: 2,
  },
  {
    id: "etcd-latency",
    label: "etcd Write p99",
    baselineLabel: "baseline: 4.2ms",
    currentLabel: "current: 18.3ms",
    currentTone: "info",
    percent: 37,
    barStyle: "#60A4FA",
    markerPercent: 8,
  },
];

export const modelStats = {
  accuracy: "98.7%",
  falsePositiveRate: "0.3%",
};

export const tenantIsolationEntries: TenantIsolationEntry[] = [
  {
    id: "acme-corp",
    name: "acme-corp",
    severity: "critical",
    anomalyLabel: "2 anomalies",
    pulse: true,
    actions: [
      { label: "🔒 Isolate Now", variant: "isolate" },
      { label: "Throttle", variant: "default" },
      { label: "Escalate", variant: "escalate" },
    ],
  },
  {
    id: "healthsys-io",
    name: "healthsys-io",
    severity: "high",
    anomalyLabel: "1 anomaly",
    pulse: true,
    actions: [
      { label: "🔒 Isolate Now", variant: "isolate" },
      { label: "Monitor", variant: "default" },
    ],
  },
  {
    id: "govcloud-fed",
    name: "govcloud-fed",
    severity: "high",
    anomalyLabel: "1 anomaly",
    pulse: false,
    actions: [
      { label: "Revoke Tokens", variant: "default" },
      { label: "Monitor", variant: "default" },
    ],
  },
  {
    id: "etcd-1",
    name: "etcd-1 (infra)",
    severity: "medium",
    anomalyLabel: "1 anomaly",
    pulse: false,
    actions: [
      { label: "Investigate", variant: "default" },
      { label: "Acknowledge", variant: "default" },
    ],
  },
];

// Cell intensity as 0-100 percent; 0 renders the neutral track color.
export const heatmapRows: HeatmapRow[] = [
  {
    severity: "critical",
    label: "Critical",
    cells: [0, 0, 0, 0, 0, 0, 0, 20, 30, 20, 0, 20, 40, 60, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    severity: "high",
    label: "High",
    cells: [0, 0, 20, 0, 0, 0, 30, 40, 50, 30, 40, 50, 60, 70, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    severity: "medium",
    label: "Medium",
    cells: [20, 20, 30, 20, 20, 30, 40, 50, 60, 50, 60, 70, 80, 90, 100, 30, 20, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    severity: "low",
    label: "Low",
    cells: [20, 30, 40, 30, 20, 30, 40, 50, 60, 50, 60, 70, 80, 90, 100, 60, 40, 30, 20, 0, 0, 0, 0, 0],
  },
];

export const heatmapFooter = {
  peakWindow: "14:00–15:00 UTC",
  peakSummary: "4 critical, 11 high events",
  total24h: "85 events",
};

export const incidents: Incident[] = [
  {
    id: "inc-847",
    code: "INC-2025-0847",
    severity: "critical",
    assignment: "UNASSIGNED",
    slaLabel: "SLA:",
    slaValue: "14m remaining",
    slaTone: "danger",
    description: "Privilege escalation + DDoS vector — acme-corp tenant · 2 correlated anomalies",
    actions: [
      { label: "🚨 Escalate to P1", variant: "escalate" },
      { label: "Assign to SOC", variant: "default" },
      { label: "Create Ticket", variant: "default" },
    ],
    auditHref: "/audit-logs",
  },
  {
    id: "inc-846",
    code: "INC-2025-0846",
    severity: "high",
    assignment: "IN PROGRESS",
    slaLabel: "SLA:",
    slaValue: "47m remaining",
    slaTone: "warn",
    description: "Data exfiltration pattern — healthsys-io · 2.3GB anomalous outbound transfer",
    actions: [
      { label: "🔒 Isolate Tenant", variant: "isolate" },
      { label: "Assign to SOC", variant: "default" },
      { label: "Update Status", variant: "default" },
    ],
    auditHref: "/audit-logs",
  },
  {
    id: "inc-845",
    code: "INC-2025-0845",
    severity: "medium",
    assignment: "RESOLVED",
    slaLabel: "Resolved:",
    slaValue: "14:18 UTC",
    slaTone: "neon",
    description: "HSM slot utilization spike — auto-remediated via key rotation policy",
    actions: [],
    auditHref: "/audit-logs",
    resolved: true,
  },
];

export const threatCategories: ThreatCategoryStat[] = [
  { label: "Privilege Escalation", count: 18, percent: 21, tone: "danger" },
  { label: "DDoS / Rate Abuse", count: 12, percent: 14, tone: "danger" },
  { label: "Data Exfiltration", count: 9, percent: 11, tone: "warn" },
  { label: "Auth Anomalies", count: 14, percent: 16, tone: "warn" },
  { label: "Latency Spikes", count: 11, percent: 13, tone: "info" },
  { label: "Config Drift", count: 21, percent: 25, tone: "neon" },
];

export const threatCategoryTotal = {
  windowLabel: "Last 24 hours",
  totalEvents: 85,
};
