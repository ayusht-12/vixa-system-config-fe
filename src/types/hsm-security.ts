import type { AccentColor } from "./command-center";

export interface HsmKpiCard {
  id: string;
  label: string;
  value: string;
  description: string;
  iconContent: string;
  iconPulse?: boolean;
  tone: AccentColor;
  glow?: string;
  borderHex: string;
}

export interface PkcsMechanism {
  label: string;
  tone: AccentColor;
}

export type SlotStyle = "active" | "warn" | "inactive";

export interface HsmSlot {
  id: string;
  name: string;
  badgeLabel: string;
  style: SlotStyle;
  labelValue: string;
  keysCount: string;
  capacityPercent: number;
  opsPerSecond: string;
  extraLabel: string;
  extraValue: string;
}

export type MasterKeyStatus = "ACTIVE" | "EXPIRING" | "RETIRED" | "PENDING" | "DISABLED";

export interface MasterKeyRow {
  id: string;
  keyId: string;
  keyIdMeta: string;
  algorithm: string;
  algorithmTone: AccentColor;
  created: string;
  expires: string;
  expiresTone: AccentColor;
  status: MasterKeyStatus;
  rotationPercent: number;
  rotationLabel: string;
  rotationNote: string;
  actionLabel: string;
  actionVariant: "primary" | "default" | "info";
  borderHex: string;
  keyIdTone: AccentColor;
  canRotate?: boolean;
  canDisable?: boolean;
  onDetails?: () => void;
  onRotate?: () => void;
  onDisable?: () => void;
  isMutating?: boolean;
}

export interface CustodianApproval {
  name: string;
  status: string;
  pending?: boolean;
}

export interface CeremonyEntry {
  id: string;
  eventLabel: string;
  eventTone: AccentColor;
  timeLabel: string;
  description: string;
  quorumLabel: string;
  approvals: CustodianApproval[];
  ceremonyMeta: string;
  dotColorHex: string;
  dotContent: string;
  dotPulse?: boolean;
  historical?: boolean;
  onApprove?: () => void;
  onComplete?: () => void;
  isMutating?: boolean;
}

export interface CertRow {
  id: string;
  cn: string;
  cnTone: string;
  algoLine: string;
  type: string;
  typeTone: AccentColor;
  issued: string;
  expires: string;
  expiresTone: AccentColor;
  daysLeft: string;
  daysLeftTone: AccentColor;
  status: string;
  statusTone: AccentColor;
  borderHex: string;
}

export interface AlgorithmStat {
  label: string;
  value: string;
  valueTone?: AccentColor;
}

export interface AlgorithmEntry {
  id: string;
  name: string;
  nameHex: string;
  badgeLabel: string;
  badgeHex: string;
  active: boolean;
  bgHex: string;
  borderHex: string;
  stats: AlgorithmStat[];
  note?: string;
  deprecated?: boolean;
}

export interface AttestationCheck {
  label: string;
  description: string;
  hashLabel: string;
  tone: AccentColor;
  glow: string;
  bgHex: string;
  borderHex: string;
}

export interface AttestationHistoryPoint {
  label: string;
  heightPercent: number;
  passed?: boolean;
}
