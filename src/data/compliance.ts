import type {
  ComplianceKpiCard,
  ControlMappingRow,
  FrameworkCardData,
  ResolvedViolation,
  SchemaEntry,
  SchemaFailure,
  TrendInsight,
  TrendSeries,
  ViolationEntry,
} from "../types/compliance";
import type { TickerEntryData } from "../components/ui/Ticker";

export const auditStatus = {
  lastAuditAgo: "2h 14m ago",
  nextScheduled: "6h 00m",
};

export const complianceTicker: TickerEntryData[] = [
  { id: "c1", labelText: "VIOLATION", labelClassName: "text-warn", message: "GDPR Art.32 · healthsys-io · Encryption at rest not verified · control:CC6.1" },
  { id: "c2", labelText: "VIOLATION", labelClassName: "text-warn", message: "SOC2 CC7.2 · acme-corp · Incident response SLA exceeded · 14m overdue" },
  { id: "c3", labelText: "SCHEMA", labelClassName: "text-info", message: "JSON Schema 2020-12 · 3 validation failures · /api/v4/events endpoint" },
  { id: "c4", labelText: "PASSED", labelClassName: "text-neon", message: "ISO27001 A.9.4.2 · govcloud-fed · MFA enforcement verified · 100% coverage" },
  { id: "c5", labelText: "REVIEW", labelClassName: "text-warn", message: "HIPAA §164.312(a) · media-stream-x · Access control audit pending · due 2025-01-20" },
  { id: "c6", labelText: "PASSED", labelClassName: "text-neon", message: "SOC2 CC6.6 · fintech-labs · Logical access controls verified · last audit 2h ago" },
];

export const complianceKpis: ComplianceKpiCard[] = [
  {
    id: "overall-score",
    label: "Overall Score",
    value: "91.4",
    unit: "%",
    badgeText: "COMPLIANT",
    trendLabel: "↑ 1.2% from last week",
    barPercent: 91.4,
    barColor: "neon",
    borderHex: "#00FFA3",
    glow: "glow-green",
  },
  {
    id: "controls-mapped",
    label: "Controls Mapped",
    value: "231",
    unit: "/247",
    badgeText: "247 total",
    badgeStyle: "plain",
    badgeColorHex: "#00FFA3",
    trendLabel: "16 gaps · 4 partial",
    barPercent: 93.5,
    barColor: "info",
    borderHex: "#21262D",
    glow: "",
  },
  {
    id: "violations",
    label: "Violations",
    value: "3",
    trendLabel: "↓ 2 resolved today",
    barPercent: 30,
    barColor: "warn",
    borderHex: "#FBBF24",
    glow: "glow-amber",
    pulseDot: true,
  },
  {
    id: "schema-errors",
    label: "Schema Errors",
    value: "3",
    badgeText: "JSON 2020-12",
    badgeStyle: "plain",
    badgeColorHex: "#6B7280",
    trendLabel: "of 1,247 validated today",
    barPercent: 5,
    barColor: "danger",
    borderHex: "#FF3B3B",
    glow: "glow-red",
  },
];

export const frameworkCards: FrameworkCardData[] = [
  {
    id: "soc2",
    badgeLabel: "SOC2",
    badgeColorHex: "#00FFA3",
    subtitle: "Type II",
    description: "Trust Services Criteria",
    statusLabel: "CERTIFIED",
    statusTone: "neon",
    score: "92.8",
    scoreTone: "neon",
    ringColorHex: "#00FFA3",
    ringPercent: 92.8,
    metaLines: [
      { label: "Cert expires", value: "2025-09-30" },
      { label: "Auditor", value: "Deloitte" },
    ],
    breakdown: [
      { label: "CC6 · Logical Access", percent: 95, tone: "neon" },
      { label: "CC7 · System Ops", percent: 82, tone: "warn" },
      { label: "CC8 · Change Mgmt", percent: 98, tone: "neon" },
      { label: "A1 · Availability", percent: 99, tone: "neon" },
    ],
    footerLeft: "1 open violation",
    footerRight: "CC7.2 ⚠",
    footerRightTone: "warn",
  },
  {
    id: "iso27001",
    badgeLabel: "ISO",
    badgeColorHex: "#60A4FA",
    subtitle: "27001:2022",
    description: "Information Security Mgmt",
    statusLabel: "CERTIFIED",
    statusTone: "info",
    score: "88.1",
    scoreTone: "info",
    ringColorHex: "#60A4FA",
    ringPercent: 88.1,
    metaLines: [
      { label: "Cert expires", value: "2026-03-15" },
      { label: "Auditor", value: "BSI Group" },
    ],
    breakdown: [
      { label: "A.5 · Policies", percent: 100, tone: "info" },
      { label: "A.8 · Asset Mgmt", percent: 91, tone: "info" },
      { label: "A.9 · Access Ctrl", percent: 87, tone: "info" },
      { label: "A.12 · Operations", percent: 74, tone: "warn" },
    ],
    footerLeft: "0 violations",
    footerRight: "✓ Clean",
    footerRightTone: "neon",
  },
  {
    id: "gdpr",
    badgeLabel: "GDPR",
    badgeColorHex: "#FBBF24",
    subtitle: "EU 2016/679",
    description: "Data Protection Regulation",
    statusLabel: "⚠ REVIEW",
    statusTone: "warn",
    score: "82.0",
    scoreTone: "warn",
    ringColorHex: "#FBBF24",
    ringPercent: 82.0,
    metaLines: [
      { label: "DPA review", value: "2025-02-01", tone: "warn" },
      { label: "DPO", value: "J. Schmidt" },
    ],
    breakdown: [
      { label: "Art.5 · Principles", percent: 90, tone: "warn" },
      { label: "Art.25 · Privacy by Design", percent: 85, tone: "warn" },
      { label: "Art.32 · Security", percent: 61, tone: "danger" },
      { label: "Art.33 · Breach Notif.", percent: 92, tone: "warn" },
    ],
    footerLeft: "1 violation",
    footerRight: "Art.32 ✗",
    footerRightTone: "danger",
    borderHex: "#FBBF24",
  },
  {
    id: "hipaa",
    badgeLabel: "HIPAA",
    badgeColorHex: "#A78BFA",
    subtitle: "45 CFR §164",
    description: "Health Data Security",
    statusLabel: "COMPLIANT",
    statusTone: "neon",
    score: "90.0",
    scoreTone: "neon",
    ringColorHex: "#00FFA3",
    ringPercent: 90.0,
    metaLines: [
      { label: "BAA signed", value: "2024-07-01" },
      { label: "Covered", value: "healthsys-io" },
    ],
    breakdown: [
      { label: "§164.308 · Admin", percent: 93, tone: "neon" },
      { label: "§164.310 · Physical", percent: 96, tone: "neon" },
      { label: "§164.312 · Technical", percent: 84, tone: "warn" },
      { label: "§164.316 · Policies", percent: 97, tone: "neon" },
    ],
    footerLeft: "1 review pending",
    footerRight: "§164.312(a) ⚠",
    footerRightTone: "warn",
  },
];

export const controlMappingRows: ControlMappingRow[] = [
  {
    domain: "Access Control",
    description: "IAM · RBAC · MFA · SSO",
    cells: {
      soc2: { code: "✓ CC6", status: "mapped" },
      iso27001: { code: "✓ A.9", status: "mapped" },
      gdpr: { code: "✓ Art.5", status: "mapped" },
      hipaa: { code: "✓ §308", status: "mapped" },
    },
    coveragePercent: 100,
    coverageTone: "neon",
  },
  {
    domain: "Encryption & Crypto",
    description: "AES-256 · TLS 1.3 · HSM · Key Mgmt",
    cells: {
      soc2: { code: "✓ CC6.7", status: "mapped" },
      iso27001: { code: "✓ A.10", status: "mapped" },
      gdpr: { code: "~ Art.32", status: "partial" },
      hipaa: { code: "✓ §312", status: "mapped" },
    },
    coveragePercent: 75,
    coverageTone: "warn",
  },
  {
    domain: "Incident Response",
    description: "Detection · Escalation · Recovery · SLA",
    cells: {
      soc2: { code: "~ CC7.2", status: "partial" },
      iso27001: { code: "✓ A.16", status: "mapped" },
      gdpr: { code: "✓ Art.33", status: "mapped" },
      hipaa: { code: "✓ §308(a)", status: "mapped" },
    },
    coveragePercent: 82,
    coverageTone: "warn",
  },
  {
    domain: "Audit Logging",
    description: "Immutable · Merkle · Retention · SIEM",
    cells: {
      soc2: { code: "✓ CC7.3", status: "mapped" },
      iso27001: { code: "✓ A.12.4", status: "mapped" },
      gdpr: { code: "✓ Art.30", status: "mapped" },
      hipaa: { code: "✓ §312(b)", status: "mapped" },
    },
    coveragePercent: 100,
    coverageTone: "neon",
  },
  {
    domain: "Data Residency",
    description: "Geo-fencing · Cross-border · Retention",
    cells: {
      soc2: { code: "✓ CC6.3", status: "mapped" },
      iso27001: { code: "~ A.8.3", status: "partial" },
      gdpr: { code: "✓ Art.44", status: "mapped" },
      hipaa: { code: "N/A", status: "na" },
    },
    coveragePercent: 88,
    coverageTone: "warn",
  },
  {
    domain: "Vulnerability Mgmt",
    description: "CVE scanning · Patch SLA · Pen testing",
    cells: {
      soc2: { code: "✓ CC7.1", status: "mapped" },
      iso27001: { code: "✓ A.12.6", status: "mapped" },
      gdpr: { code: "✓ Art.32", status: "mapped" },
      hipaa: { code: "✗ §308", status: "gap" },
    },
    coveragePercent: 79,
    coverageTone: "warn",
  },
  {
    domain: "Tenant Isolation",
    description: "Network · Data · Compute · Namespace",
    cells: {
      soc2: { code: "✓ CC6.6", status: "mapped" },
      iso27001: { code: "✓ A.13", status: "mapped" },
      gdpr: { code: "✓ Art.25", status: "mapped" },
      hipaa: { code: "✓ §312(a)", status: "mapped" },
    },
    coveragePercent: 100,
    coverageTone: "neon",
  },
];

export const controlMappingSummary = {
  fullyMapped: 231,
  partial: 4,
  gaps: 12,
  total: 247,
};

export const violations: ViolationEntry[] = [
  {
    id: "v1",
    tag: "VIOLATION",
    tagTone: "danger",
    frameworkLabel: "GDPR",
    frameworkColorHex: "#FBBF24",
    timestamp: "14:18:03",
    title: "Art.32 — Encryption at rest not verified",
    description: "Tenant healthsys-io · PHI data store · AES-256 key rotation overdue by 47 days",
    meta: [
      { label: "Tenant", value: "healthsys-io", tone: "warn" },
      { label: "Control", value: "CC6.1 · A.10.1", tone: "danger" },
    ],
    actions: [
      { label: "Remediate", variant: "primary" },
      { label: "HSM Keys →", variant: "link", href: "/hsm-security" },
      { label: "Snooze", variant: "default" },
    ],
    borderHex: "#FF3B3B",
    cardBgHex: "#1A0505",
  },
  {
    id: "v2",
    tag: "VIOLATION",
    tagTone: "warn",
    frameworkLabel: "SOC2",
    frameworkColorHex: "#00FFA3",
    timestamp: "14:17:41",
    title: "CC7.2 — Incident response SLA exceeded",
    description: "Tenant acme-corp · INC-2025-0847 · P1 SLA breach by 14 minutes",
    meta: [
      { label: "Tenant", value: "acme-corp", tone: "warn" },
      { label: "SLA Breach", value: "+14 min", tone: "danger" },
    ],
    actions: [
      { label: "View Incident", variant: "primary" },
      { label: "Escalate", variant: "default" },
    ],
    borderHex: "#FBBF24",
    cardBgHex: "#1A1200",
  },
  {
    id: "v3",
    tag: "REVIEW",
    tagTone: "warn",
    frameworkLabel: "HIPAA",
    frameworkColorHex: "#A78BFA",
    timestamp: "13:55:22",
    title: "§164.312(a) — Access control audit pending",
    description: "Tenant media-stream-x · Unique user ID assignment review due 2025-01-20",
    meta: [
      { label: "Tenant", value: "media-stream-x", tone: "warn" },
      { label: "Due Date", value: "2025-01-20", tone: "warn" },
    ],
    actions: [
      { label: "Schedule Audit", variant: "primary" },
      { label: "Audit Log →", variant: "link", href: "/audit-logs" },
    ],
    borderHex: "#FBBF24",
    cardBgHex: "#1A1200",
  },
];

export const resolvedViolation: ResolvedViolation = {
  id: "resolved-1",
  tenantLabel: "SOC2 CC6.2 · fintech-labs",
  resolvedAt: "12:44 UTC",
  description: "MFA enforcement gap — remediated via policy push · auto-verified",
};

export const schemaSummary = {
  totalToday: 1247,
  passRate: "99.76%",
  failures: 3,
  passedLabel: "1,244 PASSED",
  failedLabel: "3 FAILED",
};

export const schemaFailures: SchemaFailure[] = [
  {
    id: "sf1",
    endpoint: "/api/v4/events",
    timestamp: "14:31:07",
    title: "Required property 'tenantId' missing",
    codeLines: [
      { text: "$.events[2].tenantId: required property missing" },
      { text: "schema: #/properties/events/items", colorHex: "#60A4FA" },
    ],
    meta: [
      { label: "Tenant", value: "acme-corp" },
      { label: "Event ID", value: "evt_9f3a2c" },
    ],
  },
  {
    id: "sf2",
    endpoint: "/api/v4/ingest",
    timestamp: "14:28:44",
    title: "Type mismatch: expected 'integer', got 'string'",
    codeLines: [
      { text: "$.payload.timestamp: type mismatch" },
      { text: 'expected: integer, received: "1705329124"', colorHex: "#60A4FA" },
    ],
    meta: [
      { label: "Tenant", value: "startup-alpha" },
      { label: "Batch", value: "batch_7d1e" },
    ],
  },
  {
    id: "sf3",
    endpoint: "/api/v4/query",
    timestamp: "14:22:11",
    title: "Pattern validation failed: UUID format",
    codeLines: [
      { text: "$.filter.correlationId: pattern mismatch" },
      { text: 'expected: uuid-v7, received: "not-a-uuid"', colorHex: "#60A4FA" },
    ],
    meta: [
      { label: "Tenant", value: "retail-nexus" },
      { label: "Req", value: "req_2b8f" },
    ],
  },
];

export const activeSchemas: SchemaEntry[] = [
  { name: "EventPayload v2.4", active: true },
  { name: "IngestBatch v1.8", active: true },
  { name: "QueryFilter v3.1", active: false },
  { name: "TenantConfig v1.2", active: true },
];

export const trendXAxisLabels = ["Dec 16", "Dec 21", "Dec 26", "Dec 31", "Jan 5", "Jan 10", "Jan 15"];

export const trendSeries: TrendSeries[] = [
  {
    id: "soc2",
    label: "SOC2",
    colorHex: "#00FFA3",
    linePath: "M40,72 L80,68 L120,65 L160,70 L200,67 L240,63 L280,60 L320,58 L360,55 L400,52 L440,50 L480,48 L520,45 L560,43 L600,43",
    areaPath: "M40,72 L80,68 L120,65 L160,70 L200,67 L240,63 L280,60 L320,58 L360,55 L400,52 L440,50 L480,48 L520,45 L560,43 L600,43 L600,200 L40,200 Z",
    dot: { x: 600, y: 43 },
    currentScore: "92.8%",
    trendLabel: "↑ 0.8%",
  },
  {
    id: "iso27001",
    label: "ISO27001",
    colorHex: "#60A4FA",
    linePath: "M40,90 L80,88 L120,85 L160,87 L200,84 L240,82 L280,80 L320,78 L360,76 L400,74 L440,72 L480,70 L520,68 L560,66 L600,64",
    dot: { x: 600, y: 64 },
    currentScore: "88.1%",
    trendLabel: "↑ 1.4%",
  },
  {
    id: "gdpr",
    label: "GDPR",
    colorHex: "#FBBF24",
    linePath: "M40,110 L80,108 L120,105 L160,112 L200,118 L240,115 L280,110 L320,108 L360,112 L400,115 L440,118 L480,115 L520,112 L560,110 L600,108",
    dot: { x: 600, y: 108 },
    currentScore: "82.0%",
    trendLabel: "↓ 2.1%",
  },
  {
    id: "hipaa",
    label: "HIPAA",
    colorHex: "#A78BFA",
    linePath: "M40,80 L80,78 L120,76 L160,74 L200,72 L240,70 L280,68 L320,66 L360,64 L400,62 L440,60 L480,58 L520,56 L560,54 L600,52",
    dot: { x: 600, y: 52 },
    currentScore: "90.0%",
    trendLabel: "↑ 0.5%",
  },
];

export const trendInsights: TrendInsight[] = [
  {
    direction: "up",
    title: "SOC2 improving — CC8 change management controls strengthened",
    description: "Automated change approval workflow deployed Jan 10 · +3.2% impact",
    tone: "neon",
  },
  {
    direction: "down",
    title: "GDPR declining — Art.32 encryption gap introduced Jan 12",
    description: "healthsys-io key rotation missed · remediation in progress · ETA 2h",
    tone: "warn",
  },
];
