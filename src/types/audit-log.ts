import type { AccentColor } from "./command-center";

export interface AuditKpiCard {
  id: string;
  label: string;
  value: string;
  description: string;
  iconContent: string;
  iconPulse?: boolean;
  tone: AccentColor;
  highlighted?: boolean;
}

export interface TenantFilterChip {
  id: string;
  label: string;
  count: string;
  colorHex: string;
}

export interface EventTypeChip {
  id: string;
  label: string;
  count: string;
}

export interface ActorEntry {
  id: string;
  label: string;
  count: string;
  avatarLetter: string;
  avatarBgClass: string;
  avatarBorderClass: string;
  avatarTextClass: string;
}

export interface WormSyncStatus {
  bucket: string;
  lockMode: string;
  retentionPeriod: string;
  lastSync: string;
  pendingSync: string;
  syncPercent: number;
  synced: string;
  replicas: string;
}

export interface HashChainStat {
  label: string;
  line1: string;
  line2: string;
  statusIcon: string;
  statusLabel: string;
  statusTone: AccentColor;
  highlighted?: boolean;
}

export type LogSeverity = "CRITICAL" | "WARNING" | "INFO" | "AUTH" | "CONFIG" | "HSM";

export interface LogEntry {
  id: string;
  seq: string;
  timestamp: string;
  severity: LogSeverity;
  eventType: string;
  eventSubtype: string;
  tenant: string;
  tenantToneClass: string;
  description: string;
  chainLabel: string;
  actor: string;
  actorMeta: string;
  integrity: "verified" | "warning" | "failed";
  selected?: boolean;
}

export interface EntryDetail {
  seq: string;
  severity: string;
  timestamp: string;
  eventType: string;
  tenant: string;
  actor: string;
  sourceIp: string;
  description: string;
  entryHash: string;
  previousHash: string;
  signature: string;
}

export interface IntegrityBadge {
  icon: string;
  label: string;
  description: string;
  tone: AccentColor;
  wide?: boolean;
  tags?: string[];
}
