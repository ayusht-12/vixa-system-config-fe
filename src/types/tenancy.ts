import type { AccentColor } from "./command-center";
import type { StreamAction } from "./anomaly-detection";

export interface TenancyKpiCard {
  id: string;
  label: string;
  value: string;
  unit?: string;
  description: string;
  iconContent: string;
  iconPulse?: boolean;
  tone: AccentColor;
  glow?: string;
  borderHex: string;
}

export type IsolationLevel = "STRICT" | "PARTIAL" | "BREACH" | "PENDING";

export interface TenantIsolationRow {
  id: string;
  tenantId: string;
  orgId: string;
  tenantTone: AccentColor;
  tier: string;
  tierTone: AccentColor;
  isolationLevel: IsolationLevel;
  isolationTone: AccentColor;
  isolationPulse: boolean;
  dbSchema: string;
  dbSchemaTone: AccentColor;
  network: string;
  networkTone: AccentColor;
  encryption: string;
  encryptionTone: AccentColor;
  statusLabel: string;
  statusTone: AccentColor;
  scoreLabel: string;
}

export interface BreachAlert {
  id: string;
  severity: "critical" | "warning";
  title: string;
  timestamp: string;
  description: string;
  details: { label: string; value: string; tone?: AccentColor }[];
  actions: StreamAction[];
  auditLink?: { label: string; href: string };
}

export interface ProvisioningStep {
  label: string;
  status: "done" | "in-progress" | "pending";
}

export interface ProvisioningState {
  tenantName: string;
  percent: number;
  steps: ProvisioningStep[];
  eta: string;
}

export type BoundaryStyle = "intact" | "partial" | "breach" | "provisioning";

export interface BoundaryField {
  tag: string;
  tagTone: AccentColor;
  value: string;
}

export interface BoundaryTenant {
  id: string;
  name: string;
  tone: AccentColor;
  dotPulse: boolean;
  style: BoundaryStyle;
  fields: BoundaryField[];
  footerLabel: string;
  footerTone: AccentColor;
}

export interface SchemaRow {
  id: string;
  tenant: string;
  tenantTone: AccentColor;
  schemaName: string;
  version: string;
  tables: string;
  status: string;
  statusTone: AccentColor;
  lastValidated: string;
  lastValidatedNote: string;
  lastValidatedTone: AccentColor;
  blink?: boolean;
}

export type SnapshotStyle = "ok" | "stale" | "pending";

export interface SnapshotEntry {
  id: string;
  tenant: string;
  icon: string;
  style: SnapshotStyle;
  statusLabel: string;
  fields: { label: string; value: string; tone?: AccentColor }[];
  note?: string;
  actionLabel?: string;
}
