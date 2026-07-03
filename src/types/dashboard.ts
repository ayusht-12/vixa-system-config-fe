import type { AccentColor } from "./command-center";

export interface DashboardKpiTile {
  id: string;
  label: string;
  value: string;
  tone: AccentColor;
  description: string;
}

export interface TenantHealthRow {
  id: string;
  slug: string;
  displayName: string;
  statusLabel: string;
  statusTone: AccentColor;
  isolationScoreLabel: string;
  isolationLevel: string;
  isolationTone: AccentColor;
  recentAuditCount: number;
  criticalAuditCount: number;
  openAnomalyCount: number;
}

export interface ActivityFeedItem {
  id: string;
  severity: string;
  severityTone: AccentColor;
  eventType: string;
  description: string;
  actor: string;
  tenantSlug: string | null;
  timestamp: string;
}

export interface TrendBar {
  bucketLabel: string;
  critical: number;
  warning: number;
  info: number;
  total: number;
}
