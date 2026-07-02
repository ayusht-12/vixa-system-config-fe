import type {
  ActorEntry,
  AuditKpiCard,
  EntryDetail,
  EventTypeChip,
  HashChainStat,
  IntegrityBadge,
  LogEntry,
  TenantFilterChip,
  WormSyncStatus,
} from "../types/audit-log";

export const auditHeader = {
  totalEntries: "4,721,847",
  integrityVerifiedAgo: "2m ago",
  rootHash: "a3f9c2d7e1b4...",
};

export const kpiCards: AuditKpiCard[] = [
  { id: "total-entries", label: "Total Entries", value: "4.72M", description: "+1,247 last hour", iconContent: "●", iconPulse: true, tone: "neon", highlighted: true },
  { id: "chain-integrity", label: "Chain Integrity", value: "100%", description: "All hashes verified", iconContent: "✓", tone: "neon", highlighted: true },
  { id: "worm-sync", label: "WORM Sync", value: "S3", description: "Synced 47s ago", iconContent: "⬡", tone: "info" },
  { id: "signatures", label: "Signatures", value: "4.72M", description: "ECDSA-P384 signed", iconContent: "🔐", tone: "purple" },
  { id: "anomalies", label: "Anomalies", value: "3", description: "Flagged for review", iconContent: "⚠", tone: "warn" },
];

export const tenantFilters: TenantFilterChip[] = [
  { id: "all", label: "All Tenants", count: "4.72M", colorHex: "#00FFA3" },
  { id: "acme-corp", label: "acme-corp", count: "1.2M", colorHex: "#A78BFA" },
  { id: "fintech-labs", label: "fintech-labs", count: "847K", colorHex: "#60A4FA" },
  { id: "healthsys-io", label: "healthsys-io", count: "634K", colorHex: "#34D399" },
  { id: "govcloud-fed", label: "govcloud-fed", count: "1.1M", colorHex: "#F87171" },
  { id: "retail-nexus", label: "retail-nexus", count: "421K", colorHex: "#FBBF24" },
  { id: "more", label: "+ 19 more", count: "519K", colorHex: "#6B7280" },
];

export const eventTypeFilters: EventTypeChip[] = [
  { id: "state-change", label: "STATE_CHANGE", count: "1.8M" },
  { id: "auth-event", label: "AUTH_EVENT", count: "892K" },
  { id: "config-change", label: "CONFIG_CHANGE", count: "14.7K" },
  { id: "policy-eval", label: "POLICY_EVAL", count: "1.2M" },
  { id: "tenant-lifecycle", label: "TENANT_LIFECYCLE", count: "2,847" },
  { id: "key-operation", label: "KEY_OPERATION", count: "487K" },
  { id: "anomaly-detected", label: "ANOMALY_DETECTED", count: "3,421" },
];

export const timeRangeOptions = ["1h", "6h", "24h", "7d", "30d", "Custom"];

export const actors: ActorEntry[] = [
  { id: "admin", label: "admin@nexus", count: "847", avatarLetter: "A", avatarBgClass: "bg-green-900", avatarBorderClass: "border-green-800", avatarTextClass: "text-neon" },
  { id: "svc-deploy", label: "svc-deploy-01", count: "1,247", avatarLetter: "S", avatarBgClass: "bg-blue-900", avatarBorderClass: "border-blue-800", avatarTextClass: "text-info" },
  { id: "engine-core", label: "engine-core", count: "4.1M", avatarLetter: "E", avatarBgClass: "bg-purple-900", avatarBorderClass: "border-purple-800", avatarTextClass: "text-purple-400" },
  { id: "tenant-provisioner", label: "tenant-provisioner", count: "2,847", avatarLetter: "T", avatarBgClass: "bg-amber-900", avatarBorderClass: "border-amber-800", avatarTextClass: "text-warn" },
];

export const wormSyncStatus: WormSyncStatus = {
  bucket: "nexus-audit-worm-us-e1",
  lockMode: "COMPLIANCE",
  retentionPeriod: "7 years",
  lastSync: "47s ago",
  pendingSync: "1,247 entries",
  syncPercent: 99.97,
  synced: "4.72M",
  replicas: "3 regions",
};

export const hashChainStats: HashChainStat[] = [
  { label: "Merkle Root Hash", line1: "a3f9c2d7e1b4", line2: "8f2a1c9e4d7b", statusIcon: "✓", statusLabel: "VALID", statusTone: "neon", highlighted: true },
  { label: "Previous Root (t-1)", line1: "7c4e9a2f1d8b", line2: "3e6c0f5a2b9d", statusIcon: "✓", statusLabel: "CHAIN OK", statusTone: "neon" },
  { label: "Signing Key ID", line1: "nexus-signing", line2: "-key-v4:slot-2", statusIcon: "🔐", statusLabel: "HSM-BOUND", statusTone: "purple" },
];

export const verificationStats = {
  verified: "4,721,847",
  failed: "0",
  duration: "1.2s",
};

export const hashChainSequence = [
  "a3f9c2d7",
  "7c4e9a2f",
  "b2d8f1e3",
  "e9c4a7f2",
  "4d1b8c6e",
  "f7a3e2d9",
];

export const logEntries: LogEntry[] = [
  {
    id: "e1", seq: "4721847", timestamp: "14:31:52.847", severity: "CRITICAL",
    eventType: "STATE_CHANGE", eventSubtype: "PRIV_ESCALATION", tenant: "acme-corp", tenantToneClass: "text-purple-400",
    description: "Privilege escalation: svc-deploy-01 assumed IAM::AdminRole without MFA",
    chainLabel: "prev:7c4e9a2f → curr:a3f9c2d7", actor: "svc-deploy-01", actorMeta: "ip:10.0.4.22",
    integrity: "verified", selected: true,
  },
  {
    id: "e2", seq: "4721846", timestamp: "14:30:17.213", severity: "CRITICAL",
    eventType: "STATE_CHANGE", eventSubtype: "RATE_ANOMALY", tenant: "acme-corp", tenantToneClass: "text-purple-400",
    description: "API rate spike 3.2σ above baseline — DDoS vector detected on /ingest",
    chainLabel: "prev:b2d8f1e3 → curr:7c4e9a2f", actor: "engine-core", actorMeta: "src:203.0.113.0",
    integrity: "verified",
  },
  {
    id: "e3", seq: "4721845", timestamp: "14:28:44.091", severity: "WARNING",
    eventType: "STATE_CHANGE", eventSubtype: "LATENCY_BREACH", tenant: "system", tenantToneClass: "text-gray-400",
    description: "etcd write latency p99 exceeded 15ms threshold — node etcd-1 degraded",
    chainLabel: "prev:e9c4a7f2 → curr:b2d8f1e3", actor: "engine-core", actorMeta: "node:etcd-1",
    integrity: "warning",
  },
  {
    id: "e4", seq: "4721844", timestamp: "14:27:33.512", severity: "AUTH",
    eventType: "AUTH_EVENT", eventSubtype: "TOKEN_ISSUED", tenant: "fintech-labs", tenantToneClass: "text-info",
    description: "OIDC token issued for user analyst@fintech-labs.com — scope: nexus:read",
    chainLabel: "prev:4d1b8c6e → curr:e9c4a7f2", actor: "keycloak-22", actorMeta: "ip:172.16.4.8",
    integrity: "verified",
  },
  {
    id: "e5", seq: "4721843", timestamp: "14:26:11.774", severity: "CONFIG",
    eventType: "CONFIG_CHANGE", eventSubtype: "RETENTION_MOD", tenant: "global", tenantToneClass: "text-gray-400",
    description: "Audit log retention policy updated: 5y → 7y (GDPR Art.30 compliance)",
    chainLabel: "prev:f7a3e2d9 → curr:4d1b8c6e", actor: "admin@nexus", actorMeta: "ip:10.0.1.5",
    integrity: "verified",
  },
  {
    id: "e6", seq: "4721842", timestamp: "14:22:03.341", severity: "INFO",
    eventType: "TENANT_LIFECYCLE", eventSubtype: "TENANT_CREATED", tenant: "fintech-labs", tenantToneClass: "text-neon",
    description: "New tenant provisioned — namespace isolated, encryption keys generated, audit stream initialized",
    chainLabel: "prev:c1e5b9a4 → curr:f7a3e2d9", actor: "tenant-provisioner", actorMeta: "tier:enterprise",
    integrity: "verified",
  },
  {
    id: "e7", seq: "4721841", timestamp: "14:19:47.882", severity: "HSM",
    eventType: "KEY_OPERATION", eventSubtype: "KEY_ROTATION", tenant: "global", tenantToneClass: "text-gray-400",
    description: "HSM master key rotation completed — nexus-master-key-v4 → v5, 1,247 DEKs re-wrapped",
    chainLabel: "prev:9a7d3f2e → curr:c1e5b9a4", actor: "engine-core", actorMeta: "hsm:slot-2",
    integrity: "verified",
  },
  {
    id: "e8", seq: "4721840", timestamp: "14:17:22.104", severity: "WARNING",
    eventType: "POLICY_EVAL", eventSubtype: "QUOTA_BREACH", tenant: "healthsys-io", tenantToneClass: "text-warn",
    description: "API quota 91% utilized — throttling imminent for healthsys-io PREMIUM tier",
    chainLabel: "prev:2b8e4c1f → curr:9a7d3f2e", actor: "rate-limiter", actorMeta: "quota:455/500",
    integrity: "warning",
  },
  {
    id: "e9", seq: "4721839", timestamp: "14:15:09.667", severity: "INFO",
    eventType: "AUTH_EVENT", eventSubtype: "MFA_VERIFIED", tenant: "govcloud-fed", tenantToneClass: "text-gray-400",
    description: "MFA verification successful — TOTP + hardware key for admin@govcloud-fed.gov",
    chainLabel: "prev:5d9c7a3e → curr:2b8e4c1f", actor: "keycloak-22", actorMeta: "ip:198.51.100.4",
    integrity: "verified",
  },
  {
    id: "e10", seq: "4721838", timestamp: "14:12:44.229", severity: "INFO",
    eventType: "STATE_CHANGE", eventSubtype: "BACKUP_COMPLETE", tenant: "global", tenantToneClass: "text-gray-400",
    description: "Full snapshot backup completed — 4.7 GB, encrypted AES-256-GCM, uploaded to S3",
    chainLabel: "prev:8f1a6d4c → curr:5d9c7a3e", actor: "backup-svc", actorMeta: "s3:nexus-bkp",
    integrity: "verified",
  },
];

export const paginationLabel = "Showing entries 4,721,838 – 4,721,847 of 4,721,847 total";

export const selectedEntryDetail: EntryDetail = {
  seq: "4,721,847",
  severity: "CRITICAL",
  timestamp: "2025-01-15T14:31:52.847Z",
  eventType: "STATE_CHANGE · PRIV_ESCALATION",
  tenant: "acme-corp",
  actor: "svc-deploy-01",
  sourceIp: "10.0.4.22",
  description: "Privilege escalation: svc-deploy-01 assumed IAM::AdminRole without MFA challenge. 847 consecutive role assumptions detected within 2-minute window.",
  entryHash: "a3f9c2d7e1b48f2a1c9e4d7b3e6c0f5a2b9d7c4e9a2f1d8b3e6c0f5a2b9d7c4",
  previousHash: "7c4e9a2f1d8b3e6c0f5a2b9d7c4e9a2f1d8b3e6c0f5a2b9d7c4e9a2f1d8b3e6",
  signature: "3046022100f4a9c2d7e1b48f2a1c9e4d7b3e6c0f5a2b9d7c4e9a2f1d8b022100a3f9c2d7e1b48f2a1c9e4d7b3e6c0f5a2b9d7c4e9a2f1d8b3e6c0f5",
};

export const exportScopeOptions = ["Current Filter", "Selected Entry", "All Logs"];

export const integrityBadges: IntegrityBadge[] = [
  { icon: "✓", label: "Hash Chain", description: "4.72M verified", tone: "neon" },
  { icon: "🔐", label: "ECDSA Signed", description: "All entries", tone: "neon" },
  { icon: "⬡", label: "WORM Synced", description: "S3 Object Lock", tone: "info" },
  { icon: "🌳", label: "Merkle Tree", description: "Depth 32", tone: "purple" },
  {
    icon: "📋",
    label: "Compliance Frameworks",
    description: "",
    tone: "info",
    wide: true,
    tags: ["SOC2 Type II", "GDPR Art.30", "PCI-DSS", "ISO 27001"],
  },
];
