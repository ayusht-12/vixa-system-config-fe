import type { AccentColor } from "./command-center";
import type { StreamAction } from "./anomaly-detection";

export type FrameworkId = "soc2" | "iso27001" | "gdpr" | "hipaa";

export interface ComplianceKpiCard {
  id: string;
  label: string;
  value: string;
  unit?: string;
  badgeText?: string;
  badgeStyle?: "pill" | "plain";
  badgeColorHex?: string;
  trendLabel: string;
  barPercent: number;
  barColor: AccentColor;
  borderHex: string;
  glow: string;
  pulseDot?: boolean;
}

export interface FrameworkBreakdownItem {
  label: string;
  percent: number;
  tone: AccentColor;
}

export interface FrameworkCardData {
  id: FrameworkId;
  badgeLabel: string;
  badgeColorHex: string;
  subtitle: string;
  description: string;
  statusLabel: string;
  statusTone: AccentColor;
  score: string;
  scoreTone: AccentColor;
  ringColorHex: string;
  ringPercent: number;
  metaLines: { label: string; value: string; tone?: AccentColor }[];
  breakdown: FrameworkBreakdownItem[];
  footerLeft: string;
  footerRight: string;
  footerRightTone: AccentColor;
  borderHex?: string;
}

export type ControlCellStatus = "mapped" | "partial" | "gap" | "na";

export interface ControlCell {
  code: string;
  status: ControlCellStatus;
}

export interface ControlMappingRow {
  domain: string;
  description: string;
  cells: Record<FrameworkId, ControlCell>;
  coveragePercent: number;
  coverageTone: AccentColor;
}

export interface ViolationEntry {
  id: string;
  tag: string;
  tagTone: AccentColor;
  frameworkLabel: string;
  frameworkColorHex: string;
  timestamp: string;
  title: string;
  description: string;
  meta: { label: string; value: string; tone?: AccentColor }[];
  actions: StreamAction[];
  borderHex: string;
  cardBgHex: string;
}

export interface ResolvedViolation {
  id: string;
  tenantLabel: string;
  resolvedAt: string;
  description: string;
}

export interface SchemaFailure {
  id: string;
  endpoint: string;
  timestamp: string;
  title: string;
  codeLines: { text: string; colorHex?: string }[];
  meta: { label: string; value: string }[];
}

export interface SchemaEntry {
  name: string;
  active: boolean;
}

export interface TrendSeries {
  id: FrameworkId;
  label: string;
  colorHex: string;
  linePath: string;
  areaPath?: string;
  dot: { x: number; y: number };
  currentScore: string;
  trendLabel: string;
}

export interface TrendInsight {
  direction: "up" | "down";
  title: string;
  description: string;
  tone: AccentColor;
}
