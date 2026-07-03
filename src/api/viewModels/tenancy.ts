import { useQuery, useQueryClient } from "@tanstack/react-query";
import { activateTenant, createTenant, deactivateTenant, deleteTenant, fetchTenants } from "../tenancy";
import type { AccentColor } from "../../types/command-center";
import type { TenantIsolationRow } from "../../types/tenancy";
import type { TenantCreateDTO, TenantDTO } from "../types";

function tierTone(tier: string): AccentColor {
  return tier === "enterprise" ? "purple" : "info";
}

function isolationStyle(level: string): { label: string; tone: AccentColor; statusLabel: string; pulse: boolean } {
  switch (level) {
    case "strict":
      return { label: "STRICT", tone: "neon", statusLabel: "ENFORCED", pulse: false };
    case "partial":
      return { label: "PARTIAL", tone: "warn", statusLabel: "DEGRADED", pulse: true };
    case "breach":
      return { label: "BREACH", tone: "danger", statusLabel: "ALERT", pulse: true };
    default:
      return { label: "PENDING", tone: "info", statusLabel: "PROVISIONING", pulse: true };
  }
}

function mapTenant(tenant: TenantDTO): TenantIsolationRow {
  const isolation = isolationStyle(tenant.isolation_level);
  return {
    id: tenant.id,
    tenantId: tenant.slug,
    orgId: `org:${tenant.org_id}`,
    tenantTone: isolation.tone,
    tier: tenant.tier.toUpperCase(),
    tierTone: tierTone(tenant.tier),
    isolationLevel: isolation.label as TenantIsolationRow["isolationLevel"],
    isolationTone: isolation.tone,
    isolationPulse: isolation.pulse,
    dbSchema: tenant.db_schema_valid ? "✓ VALID" : "⚠ INVALID",
    dbSchemaTone: tenant.db_schema_valid ? "neon" : "danger",
    network: tenant.network_shared ? "⚠ SHARED" : tenant.network_vpc ? "✓ VPC" : "— NONE",
    networkTone: tenant.network_shared ? "warn" : "neon",
    encryption: tenant.encryption_valid ? "✓ AES-256" : "✗ INVALID",
    encryptionTone: tenant.encryption_valid ? "neon" : "danger",
    statusLabel: isolation.statusLabel,
    statusTone: isolation.tone,
    scoreLabel: `score: ${tenant.isolation_score}%`,
    lifecycleStatus: tenant.status,
  };
}

export function useTenantManagementViewModel() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["tenancy", "tenants"], queryFn: () => fetchTenants(50) });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["tenancy"] });
  }

  const tenants = query.data?.items ?? [];
  const rows = tenants.map(mapTenant);
  const summary = {
    enforced: rows.filter((r) => r.isolationLevel === "STRICT").length,
    partial: rows.filter((r) => r.isolationLevel === "PARTIAL").length,
    breach: rows.filter((r) => r.isolationLevel === "BREACH").length,
    pending: rows.filter((r) => r.isolationLevel === "PENDING").length,
    showingLabel: `Showing ${rows.length} of ${query.data?.total ?? 0} tenants`,
  };

  return {
    rows,
    summary,
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    onCreate: (payload: TenantCreateDTO) => createTenant(payload).then(invalidate),
    onActivate: (id: string) => activateTenant(id).then(invalidate),
    onDeactivate: (id: string) => deactivateTenant(id).then(invalidate),
    onDelete: (id: string) => deleteTenant(id).then(invalidate),
  };
}
