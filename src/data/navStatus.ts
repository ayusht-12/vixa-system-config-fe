import type { PulseDotColor } from "../components/ui/PulseDot";
import { severitySummary } from "./anomalyDetection";
import { violations } from "./compliance";
import { kpiCards as tenancyKpiCards } from "./tenancy";
import { ROUTES } from "../routes/routes";

export interface NavBadge {
  label: string;
  color: PulseDotColor;
}

const criticalCount = severitySummary.find((s) => s.severity === "critical")?.count ?? 0;
const activeTenants = tenancyKpiCards.find((card) => card.id === "active-tenants")?.value ?? "0";

export const NAV_BADGES: Record<string, NavBadge> = {
  [ROUTES.anomalyDetection.path]: { label: `${criticalCount} CRITICAL`, color: "danger" },
  [ROUTES.compliance.path]: { label: `${violations.length} VIOLATIONS`, color: "warn" },
  [ROUTES.configManager.path]: { label: "3 UNSAVED", color: "warn" },
  [ROUTES.auditLogs.path]: { label: "APPEND-ONLY", color: "neon" },
  [ROUTES.hsmSecurity.path]: { label: "FIPS 140-3 L3", color: "purple" },
  [ROUTES.tenancy.path]: { label: `${activeTenants} TENANTS LIVE`, color: "neon" },
};
