import type {
  BoundaryTenant,
  BreachAlert,
  ProvisioningState,
  SchemaRow,
  SnapshotEntry,
  TenancyKpiCard,
  TenantIsolationRow,
} from "../types/tenancy";

export const tenancyHeader = {
  isolationEngineStatus: "ENFORCED",
};

export const kpiCards: TenancyKpiCard[] = [
  { id: "active-tenants", label: "Active Tenants", value: "24", description: "+1 provisioning", iconContent: "●", iconPulse: true, tone: "neon", glow: "glow-green", borderHex: "#00FFA3" },
  { id: "isolation-score", label: "Isolation Score", value: "98.7%", description: "22 fully enforced", iconContent: "🔒", tone: "neon", glow: "glow-green", borderHex: "#00FFA3" },
  { id: "breach-alerts", label: "Breach Alerts", value: "3", description: "cross-tenant attempts", iconContent: "⚠", tone: "danger", glow: "glow-red", borderHex: "#FF3B3B" },
  { id: "schemas-valid", label: "Schemas Valid", value: "21", unit: "/24", description: "3 in validation queue", iconContent: "📦", tone: "info", borderHex: "#21262D" },
  { id: "snapshots-ok", label: "Snapshots OK", value: "23", unit: "/24", description: "1 stale >24h", iconContent: "💾", tone: "neon", glow: "glow-green", borderHex: "#00FFA3" },
  { id: "total-events", label: "Total Events/s", value: "4,717", description: "across all tenants", iconContent: "⚡", tone: "purple", borderHex: "#21262D" },
  { id: "provisioning", label: "Provisioning", value: "1", description: "fintech-labs-2", iconContent: "⏳", tone: "warn", glow: "glow-amber", borderHex: "#FBBF24" },
];

export const isolationSummaryBadge = "PER-ORG ENFORCEMENT";

export const tenantIsolationRows: TenantIsolationRow[] = [
  { id: "t1", tenantId: "acme-corp", orgId: "org:ORG-001", tenantTone: "neon", tier: "ENTERPRISE", tierTone: "purple", isolationLevel: "STRICT", isolationTone: "neon", isolationPulse: false, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ENFORCED", statusTone: "neon", scoreLabel: "score: 100%" },
  { id: "t2", tenantId: "govcloud-fed", orgId: "org:ORG-002", tenantTone: "neon", tier: "ENTERPRISE", tierTone: "purple", isolationLevel: "STRICT", isolationTone: "neon", isolationPulse: false, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ENFORCED", statusTone: "neon", scoreLabel: "score: 100%" },
  { id: "t3", tenantId: "healthsys-io", orgId: "org:ORG-003", tenantTone: "warn", tier: "PREMIUM", tierTone: "info", isolationLevel: "PARTIAL", isolationTone: "warn", isolationPulse: true, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "⚠ SHARED", networkTone: "warn", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "DEGRADED", statusTone: "warn", scoreLabel: "score: 82%" },
  { id: "t4", tenantId: "media-stream-x", orgId: "org:ORG-007", tenantTone: "danger", tier: "PREMIUM", tierTone: "info", isolationLevel: "BREACH", isolationTone: "danger", isolationPulse: true, dbSchema: "⚠ MIGRATING", dbSchemaTone: "warn", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ALERT", statusTone: "danger", scoreLabel: "score: 61%" },
  { id: "t5", tenantId: "fintech-labs", orgId: "org:ORG-004", tenantTone: "neon", tier: "ENTERPRISE", tierTone: "purple", isolationLevel: "STRICT", isolationTone: "neon", isolationPulse: false, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ENFORCED", statusTone: "neon", scoreLabel: "score: 100%" },
  { id: "t6", tenantId: "retail-nexus", orgId: "org:ORG-005", tenantTone: "neon", tier: "PREMIUM", tierTone: "info", isolationLevel: "STRICT", isolationTone: "neon", isolationPulse: false, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ENFORCED", statusTone: "neon", scoreLabel: "score: 99%" },
  { id: "t7", tenantId: "fintech-labs-2", orgId: "org:ORG-025", tenantTone: "info", tier: "ENTERPRISE", tierTone: "purple", isolationLevel: "PENDING", isolationTone: "info", isolationPulse: true, dbSchema: "⏳ INIT", dbSchemaTone: "info", network: "⏳ INIT", networkTone: "info", encryption: "⏳ INIT", encryptionTone: "info", statusLabel: "PROVISIONING", statusTone: "info", scoreLabel: "47% complete" },
  { id: "t8", tenantId: "startup-alpha", orgId: "org:ORG-006", tenantTone: "neon", tier: "STANDARD", tierTone: "info", isolationLevel: "STRICT", isolationTone: "neon", isolationPulse: false, dbSchema: "✓ VALID", dbSchemaTone: "neon", network: "✓ VPC", networkTone: "neon", encryption: "✓ AES-256", encryptionTone: "neon", statusLabel: "ENFORCED", statusTone: "neon", scoreLabel: "score: 100%" },
];

export const isolationSummary = {
  enforced: 22,
  partial: 1,
  breach: 1,
  pending: 1,
  showingLabel: "Showing 8 of 25 tenants",
};

export const breachAlerts: BreachAlert[] = [
  {
    id: "alert-1",
    severity: "critical",
    title: "CRITICAL BREACH",
    timestamp: "14:31:52 UTC",
    description: "Unauthorized cross-tenant data read attempt blocked",
    details: [
      { label: "Source Tenant", value: "media-stream-x", tone: "danger" },
      { label: "Target Tenant", value: "acme-corp", tone: "warn" },
      { label: "Resource", value: "events.acme_corp.raw" },
      { label: "Principal", value: "svc-media-etl@media-stream-x" },
      { label: "Action", value: "BLOCKED · RLS enforced", tone: "danger" },
    ],
    actions: [
      { label: "Investigate", variant: "primary" },
      { label: "Dismiss", variant: "default" },
    ],
    auditLink: { label: "Audit Log →", href: "/audit-logs" },
  },
  {
    id: "alert-2",
    severity: "warning",
    title: "POLICY VIOLATION",
    timestamp: "14:28:11 UTC",
    description: "Shared network namespace detected between tenants",
    details: [
      { label: "Tenants Affected", value: "healthsys-io, retail-nexus", tone: "warn" },
      { label: "Shared Resource", value: "subnet-10.0.4.0/24" },
      { label: "Risk Level", value: "MEDIUM · network segmentation", tone: "warn" },
    ],
    actions: [
      { label: "Remediate", variant: "primary" },
      { label: "Snooze 1h", variant: "default" },
    ],
  },
  {
    id: "alert-3",
    severity: "warning",
    title: "KEY SCOPE LEAK",
    timestamp: "14:19:44 UTC",
    description: "Encryption key referenced outside tenant boundary",
    details: [
      { label: "Source Tenant", value: "media-stream-x", tone: "warn" },
      { label: "Key ID", value: "dek-media-0x0047" },
      { label: "Scope Violation", value: "Referenced in govcloud-fed context", tone: "warn" },
    ],
    actions: [{ label: "Revoke Key", variant: "primary" }],
    auditLink: { label: "HSM Console →", href: "/hsm-security" },
  },
];

export const breachHistoryNote = {
  critical: 3,
  warnings: 7,
};

export const provisioningState: ProvisioningState = {
  tenantName: "fintech-labs-2",
  percent: 47,
  steps: [
    { label: "Org namespace created", status: "done" },
    { label: "VPC + network policy applied", status: "done" },
    { label: "Schema migration running", status: "in-progress" },
    { label: "DEK generation & HSM binding", status: "pending" },
    { label: "Isolation boundary validation", status: "pending" },
    { label: "Initial backup snapshot", status: "pending" },
  ],
  eta: "~4 min",
};

export const tierOptions = ["ENTERPRISE", "PREMIUM", "STANDARD"];
export const regionOptions = ["us-east-1", "eu-west-1", "ap-south-1"];
export const isolationModeOptions = ["STRICT", "STANDARD", "SHARED"];

export const boundaryTenants: BoundaryTenant[] = [
  {
    id: "b1", name: "acme-corp", tone: "neon", dotPulse: false, style: "intact",
    fields: [
      { tag: "DB", tagTone: "neon", value: "schema_acme_corp" },
      { tag: "NET", tagTone: "neon", value: "10.0.1.0/24 · VPC-001" },
      { tag: "KEY", tagTone: "neon", value: "dek-acme-0x0001" },
    ],
    footerLabel: "✓ BOUNDARY INTACT", footerTone: "neon",
  },
  {
    id: "b2", name: "govcloud-fed", tone: "neon", dotPulse: false, style: "intact",
    fields: [
      { tag: "DB", tagTone: "neon", value: "schema_govcloud_fed" },
      { tag: "NET", tagTone: "neon", value: "10.0.2.0/24 · VPC-002" },
      { tag: "KEY", tagTone: "neon", value: "dek-gov-0x0002" },
    ],
    footerLabel: "✓ BOUNDARY INTACT", footerTone: "neon",
  },
  {
    id: "b3", name: "media-stream-x", tone: "danger", dotPulse: true, style: "breach",
    fields: [
      { tag: "DB", tagTone: "warn", value: "schema_media_x ⚠" },
      { tag: "NET", tagTone: "neon", value: "10.0.7.0/24 · VPC-007" },
      { tag: "KEY", tagTone: "danger", value: "dek-media-0x0047 ✗" },
    ],
    footerLabel: "✗ BOUNDARY VIOLATION", footerTone: "danger",
  },
  {
    id: "b4", name: "fintech-labs", tone: "neon", dotPulse: false, style: "intact",
    fields: [
      { tag: "DB", tagTone: "neon", value: "schema_fintech_labs" },
      { tag: "NET", tagTone: "neon", value: "10.0.4.0/24 · VPC-004" },
      { tag: "KEY", tagTone: "neon", value: "dek-fintech-0x0004" },
    ],
    footerLabel: "✓ BOUNDARY INTACT", footerTone: "neon",
  },
  {
    id: "b5", name: "healthsys-io", tone: "warn", dotPulse: true, style: "partial",
    fields: [
      { tag: "DB", tagTone: "neon", value: "schema_healthsys_io" },
      { tag: "NET", tagTone: "warn", value: "10.0.4.0/24 ⚠ SHARED" },
      { tag: "KEY", tagTone: "neon", value: "dek-health-0x0003" },
    ],
    footerLabel: "⚠ PARTIAL ISOLATION", footerTone: "warn",
  },
  {
    id: "b6", name: "fintech-labs-2", tone: "info", dotPulse: true, style: "provisioning",
    fields: [
      { tag: "DB", tagTone: "info", value: "schema_fintech_2 ⟳" },
      { tag: "NET", tagTone: "info", value: "10.0.25.0/24 ⟳" },
      { tag: "KEY", tagTone: "info", value: "pending HSM binding" },
    ],
    footerLabel: "⟳ PROVISIONING 47%", footerTone: "info",
  },
];

export const boundaryFooterNote = "Showing 6 of 25 tenants";

export const schemaSummaryBadge = "3 PENDING · 21 VALID";

export const schemaRows: SchemaRow[] = [
  { id: "s1", tenant: "acme-corp", tenantTone: "neon", schemaName: "schema_acme_corp", version: "v2.14.1", tables: "47 tables", status: "VALID", statusTone: "neon", lastValidated: "14:30:00 UTC", lastValidatedNote: "0 errors", lastValidatedTone: "neon" },
  { id: "s2", tenant: "govcloud-fed", tenantTone: "neon", schemaName: "schema_govcloud_fed", version: "v3.2.0", tables: "63 tables", status: "VALID", statusTone: "neon", lastValidated: "14:28:11 UTC", lastValidatedNote: "0 errors", lastValidatedTone: "neon" },
  { id: "s3", tenant: "media-stream-x", tenantTone: "danger", schemaName: "schema_media_x", version: "v1.9.3", tables: "29 tables", status: "FAILED", statusTone: "danger", lastValidated: "14:25:00 UTC", lastValidatedNote: "3 constraint violations", lastValidatedTone: "danger" },
  { id: "s4", tenant: "fintech-labs-2", tenantTone: "info", schemaName: "schema_fintech_2", version: "v1.0.0", tables: "—", status: "MIGRATING", statusTone: "info", lastValidated: "", lastValidatedNote: "Migration in progress · 47% complete", lastValidatedTone: "info", blink: true },
  { id: "s5", tenant: "healthsys-io", tenantTone: "warn", schemaName: "schema_healthsys_io", version: "v2.7.1", tables: "38 tables", status: "WARN", statusTone: "warn", lastValidated: "14:20:00 UTC", lastValidatedNote: "1 deprecated column", lastValidatedTone: "warn" },
  { id: "s6", tenant: "fintech-labs", tenantTone: "neon", schemaName: "schema_fintech_labs", version: "v4.1.0", tables: "52 tables", status: "VALID", statusTone: "neon", lastValidated: "14:15:00 UTC", lastValidatedNote: "0 errors", lastValidatedTone: "neon" },
  { id: "s7", tenant: "retail-nexus", tenantTone: "neon", schemaName: "schema_retail_nexus", version: "v2.3.5", tables: "41 tables", status: "VALID", statusTone: "neon", lastValidated: "14:10:00 UTC", lastValidatedNote: "0 errors", lastValidatedTone: "neon" },
];

export const schemaSummary = {
  valid: 21,
  warn: 1,
  failed: 1,
  migrating: 1,
};

export const snapshotSummaryBadge = "23/24 CURRENT";

export const snapshots: SnapshotEntry[] = [
  {
    id: "snap-1", tenant: "acme-corp", icon: "💾", style: "ok", statusLabel: "CURRENT",
    fields: [
      { label: "Last Snapshot", value: "14:00 UTC" },
      { label: "Age", value: "32m ago", tone: "neon" },
      { label: "Size", value: "4.7 GB" },
      { label: "Retention", value: "30d · 12 kept" },
    ],
  },
  {
    id: "snap-2", tenant: "govcloud-fed", icon: "💾", style: "ok", statusLabel: "CURRENT",
    fields: [
      { label: "Last Snapshot", value: "14:00 UTC" },
      { label: "Age", value: "32m ago", tone: "neon" },
      { label: "Size", value: "8.2 GB" },
      { label: "Retention", value: "90d · 24 kept" },
    ],
  },
  {
    id: "snap-3", tenant: "media-stream-x", icon: "⚠", style: "stale", statusLabel: "STALE",
    fields: [
      { label: "Last Snapshot", value: "2025-01-14 12:00", tone: "warn" },
      { label: "Age", value: "26h ago ⚠", tone: "warn" },
      { label: "Size", value: "2.1 GB" },
      { label: "Reason", value: "Schema migration", tone: "warn" },
    ],
    actionLabel: "Force Snapshot Now",
  },
  {
    id: "snap-4", tenant: "fintech-labs", icon: "💾", style: "ok", statusLabel: "CURRENT",
    fields: [
      { label: "Last Snapshot", value: "14:00 UTC" },
      { label: "Age", value: "32m ago", tone: "neon" },
      { label: "Size", value: "6.3 GB" },
      { label: "Retention", value: "30d · 18 kept" },
    ],
  },
  {
    id: "snap-5", tenant: "fintech-labs-2", icon: "⟳", style: "pending", statusLabel: "PENDING",
    fields: [],
    note: "Initial snapshot scheduled after provisioning completes",
  },
];

export const snapshotSummary = {
  current: 23,
  stale: 1,
};
