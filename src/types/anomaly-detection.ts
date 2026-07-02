import type { AccentColor } from "./command-center";

export type ThreatSeverity = "critical" | "high" | "medium" | "low";

export interface TickerItem {
  id: string;
  severity: ThreatSeverity;
  message: string;
}

export interface SeveritySummaryCard {
  severity: ThreatSeverity;
  label: string;
  count: number;
  trendLabel: string;
  barPercent: number;
}

export interface StreamMetaField {
  label: string;
  value: string;
  tone?: AccentColor | "default";
}

export interface StreamAction {
  label: string;
  variant: "escalate" | "isolate" | "block" | "primary" | "default" | "link";
  href?: string;
}

export interface ThreatStreamEvent {
  id: string;
  severity: ThreatSeverity;
  score: number;
  category: string;
  categoryColorHex: string;
  timestamp: string;
  status: string;
  description: string;
  meta: StreamMetaField[];
  actions: StreamAction[];
}

export interface BaselineMetric {
  id: string;
  label: string;
  baselineLabel: string;
  currentLabel: string;
  currentTone: AccentColor;
  percent: number;
  barStyle: string;
  markerPercent: number;
  showAxis?: boolean;
}

export interface TenantIsolationEntry {
  id: string;
  name: string;
  severity: ThreatSeverity;
  anomalyLabel: string;
  pulse: boolean;
  actions: StreamAction[];
}

export interface HeatmapRow {
  severity: ThreatSeverity;
  label: string;
  cells: number[];
}

export interface Incident {
  id: string;
  code: string;
  severity: ThreatSeverity;
  assignment: string;
  slaLabel: string;
  slaValue: string;
  slaTone: AccentColor;
  description: string;
  actions: StreamAction[];
  auditHref?: string;
  resolved?: boolean;
}

export interface ThreatCategoryStat {
  label: string;
  count: number;
  percent: number;
  tone: AccentColor;
}
