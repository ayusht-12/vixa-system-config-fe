export interface RouteDef {
  path: string;
  label: string;
  icon: string;
  description: string;
}

export const ROUTES = {
  commandCenter: {
    path: "/",
    label: "Command Center",
    icon: "⬡",
    description: "Live engine overview",
  },
  anomalyDetection: {
    path: "/anomaly-detection",
    label: "Anomaly Detection",
    icon: "⚡",
    description: "4 active alerts",
  },
  compliance: {
    path: "/compliance",
    label: "Compliance",
    icon: "⚖",
    description: "SOC2 · GDPR · PCI",
  },
  configManager: {
    path: "/config-manager",
    label: "Config Manager",
    icon: "⚙",
    description: "247 parameters",
  },
  auditLogs: {
    path: "/audit-logs",
    label: "Audit Logs",
    icon: "📋",
    description: "Immutable · Merkle",
  },
  hsmSecurity: {
    path: "/hsm-security",
    label: "HSM Security",
    icon: "🔐",
    description: "FIPS 140-3 L3",
  },
  tenancy: {
    path: "/tenancy",
    label: "Tenancy",
    icon: "🏗",
    description: "24 tenants active",
  },
} as const satisfies Record<string, RouteDef>;

export const NAV_ITEMS: RouteDef[] = Object.values(ROUTES);
