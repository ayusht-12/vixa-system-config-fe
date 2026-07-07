import { useQuery } from "@tanstack/react-query";
import type { ConfigParameterDTO } from "../api/types";
import { fetchCommandCenterOverview } from "../api/engine";
import { fetchHsmOverview, fetchHsmProviders } from "../api/hsm";
import { fetchTenancyOverview } from "../api/tenancy";
import { useConfigManagerViewModel } from "../api/viewModels/configManager";
import { ConfigParamsProvider } from "../components/config-manager/configBinding";
import { ConfigDiffSummary } from "../components/config-manager/ConfigDiffSummary";
import { ConfigPageHeader } from "../components/config-manager/ConfigPageHeader";
import { ConfigSectionHeader } from "../components/config-manager/ConfigSectionHeader";
import { ConfigSummaryGrid } from "../components/config-manager/ConfigSummaryGrid";
import { ConfigurationVersionsPanel } from "../components/config-manager/ConfigurationVersionsPanel";
import { AuditSinkPanel } from "../components/config-manager/panels/AuditSinkPanel";
import { AuthStrategyPanel } from "../components/config-manager/panels/AuthStrategyPanel";
import { BackupIntervalsPanel } from "../components/config-manager/panels/BackupIntervalsPanel";
import { CryptoHsmPanel } from "../components/config-manager/panels/CryptoHsmPanel";
import { EngineIdentityPanel } from "../components/config-manager/panels/EngineIdentityPanel";
import { EtcdPersistencePanel } from "../components/config-manager/panels/EtcdPersistencePanel";
import { GeoRedundancyPanel } from "../components/config-manager/panels/GeoRedundancyPanel";
import { RateLimitingPanel } from "../components/config-manager/panels/RateLimitingPanel";
import { RedisCachePanel } from "../components/config-manager/panels/RedisCachePanel";
import { RetentionPolicyPanel } from "../components/config-manager/panels/RetentionPolicyPanel";
import { TenancyIsolationPanel } from "../components/config-manager/panels/TenancyIsolationPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { formatBytesGb } from "../lib/format";

const GRID = "grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4";

const TIER_HINTS = {
  critical: "Engine restart may be required on change",
  necessary: "Hot-reload supported · no restart required",
  optional: "Feature flags · performance tuning · infrastructure",
} as const;

export function ConfigManagerPage() {
  const { overview, isLoading, error, refetch, stageChange, revertChange, applyAll, isMutating } =
    useConfigManagerViewModel();

  // Telemetry from real cross-module endpoints (non-blocking; tiles appear as
  // each resolves). Nothing here is fabricated — tiles without a source were
  // removed from the panels rather than shown with placeholder numbers.
  const engineQ = useQuery({ queryKey: ["engine", "overview"], queryFn: fetchCommandCenterOverview });
  const hsmOverviewQ = useQuery({ queryKey: ["hsm", "overview"], queryFn: fetchHsmOverview });
  const hsmProvidersQ = useQuery({ queryKey: ["hsm", "providers"], queryFn: fetchHsmProviders });
  const tenancyQ = useQuery({ queryKey: ["tenancy", "overview"], queryFn: fetchTenancyOverview });

  if (isLoading || !overview) {
    return <LoadingState label="Loading configuration…" />;
  }
  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  const byKey: Record<string, ConfigParameterDTO> = {};
  const flat = Object.values(overview.sections).flat();
  for (const param of flat) byKey[param.key] = param;

  const total = flat.length;
  const pendingParams = flat.filter((p) => p.has_pending_change).length;
  const pendingChanges = overview.pending_changes.length;

  const summaryCards = [
    { tier: "critical" as const, count: "4", description: "engine.id · etcd · audit · auth" },
    { tier: "necessary" as const, count: "4", description: "HSM · rate limit · tenancy · backup" },
    { tier: "optional" as const, count: "3", description: "Redis · geo · retention" },
    {
      tier: "applied" as const,
      count: `${total - pendingParams}/${total}`,
      description: `${pendingChanges} pending apply`,
    },
  ];

  const diffChanges = overview.pending_changes.map((change) => ({
    key: change.parameter_key,
    fromValue: change.previous_value,
    toValue: change.new_value,
    note: change.reason ?? `staged by ${change.changed_by}`,
  }));

  // ---- real telemetry derivations ----
  const etcd = engineQ.data?.etcd_cluster;
  const etcdTelemetry = etcd
    ? {
        raftTerm: String(etcd.raft_term),
        dbSize: `${formatBytesGb(etcd.db_size_bytes)} GB`,
        lag: `${etcd.nodes.length ? Math.round(Math.max(...etcd.nodes.map((n) => n.lag_ms))) : 0}ms`,
        hasQuorum: etcd.has_quorum,
      }
    : undefined;

  const oidc = engineQ.data?.oidc;
  const oidcTelemetry = oidc
    ? {
        provider: oidc.provider ?? "—",
        activeTokens: oidc.active_tokens.toLocaleString(),
        certValid: oidc.cert_valid_days != null ? `${oidc.cert_valid_days}d` : "—",
      }
    : undefined;

  const hsmOverview = hsmOverviewQ.data;
  const providers = hsmProvidersQ.data ?? [];
  const primaryProvider =
    [...providers].filter((p) => p.is_active).sort((a, b) => b.session_count - a.session_count)[0] ??
    providers[0];
  const hsmTelemetry = hsmOverview
    ? {
        module: primaryProvider?.model ?? "—",
        fips: primaryProvider ? primaryProvider.fips_level.replace("FIPS ", "").replace("Level ", "L") : "—",
        keys: hsmOverview.slots.reduce((sum, s) => sum + s.object_count, 0).toLocaleString(),
        slots: `${hsmOverview.slots.filter((s) => s.is_active).length}/${hsmOverview.slots.length}`,
      }
    : undefined;

  const tenantCount = tenancyQ.data?.tenants.length;

  return (
    <ConfigParamsProvider byKey={byKey} stage={stageChange} revert={revertChange}>
      <div className="px-4 pt-4 pb-4">
        <ConfigPageHeader
          unsavedCount={pendingChanges}
          configVersion="—"
          lastApplied="—"
          onApply={applyAll}
          applyDisabled={pendingChanges === 0 || isMutating}
        />
        <div className="mb-4">
          <ConfigSummaryGrid cards={summaryCards} />
        </div>

        <ConfigSectionHeader tier="critical" hint={TIER_HINTS.critical} />
        <div className={GRID}>
          <EngineIdentityPanel />
          <EtcdPersistencePanel telemetry={etcdTelemetry} />
          <AuditSinkPanel />
          <AuthStrategyPanel telemetry={oidcTelemetry} />
        </div>

        <ConfigSectionHeader tier="necessary" hint={TIER_HINTS.necessary} />
        <div className={GRID}>
          <CryptoHsmPanel telemetry={hsmTelemetry} />
          <RateLimitingPanel />
          <TenancyIsolationPanel tenantCount={tenantCount} />
          <BackupIntervalsPanel />
        </div>

        <ConfigSectionHeader tier="optional" hint={TIER_HINTS.optional} />
        <div className={GRID}>
          <RedisCachePanel />
          <GeoRedundancyPanel />
          <RetentionPolicyPanel />
        </div>

        <ConfigDiffSummary
          changes={diffChanges}
          onApplyAll={applyAll}
          applyDisabled={pendingChanges === 0 || isMutating}
        />

        <div className="mt-3">
          <ConfigurationVersionsPanel />
        </div>

        <QuickLinksFooter />
      </div>
    </ConfigParamsProvider>
  );
}
