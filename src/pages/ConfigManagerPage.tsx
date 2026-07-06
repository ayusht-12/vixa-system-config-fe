import { useConfigManagerViewModel } from "../api/viewModels/configManager";
import type { ConfigParameterDTO } from "../api/types";
import { ConfigDiffSummary } from "../components/config-manager/ConfigDiffSummary";
import { ConfigPageHeader } from "../components/config-manager/ConfigPageHeader";
import { ConfigSectionHeader } from "../components/config-manager/ConfigSectionHeader";
import { ConfigSummaryGrid } from "../components/config-manager/ConfigSummaryGrid";
import { ConfigurationVersionsPanel } from "../components/config-manager/ConfigurationVersionsPanel";
import { DynamicConfigSection } from "../components/config-manager/DynamicConfigSection";
import type { ConfigTier } from "../components/config-manager/primitives/tierStyles";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

const TIER_HINTS: Record<ConfigTier, string> = {
  critical: "Engine restart may be required on change",
  necessary: "Hot-reload supported · no restart required",
  optional: "Feature flags · performance tuning · infrastructure",
};

function sectionsForTier(
  sections: Record<string, ConfigParameterDTO[]>,
  tier: ConfigTier,
): Record<string, ConfigParameterDTO[]> {
  const result: Record<string, ConfigParameterDTO[]> = {};
  for (const [section, parameters] of Object.entries(sections)) {
    const filtered = parameters.filter((p) => p.tier === tier);
    if (filtered.length > 0) result[section] = filtered;
  }
  return result;
}

export function ConfigManagerPage() {
  const { overview, isLoading, error, refetch, stageChange, revertChange, applyAll, isMutating } =
    useConfigManagerViewModel();

  if (isLoading || !overview) {
    return <LoadingState label="Loading configuration…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  const tiers: ConfigTier[] = ["critical", "necessary", "optional"];
  const totalParams = Object.values(overview.sections).reduce((sum, params) => sum + params.length, 0);
  const totalPending = overview.pending_changes.length;

  const summaryCards = [
    ...tiers.map((tier) => {
      const summary = overview.tier_summary.find((t) => t.tier === tier);
      return {
        tier,
        count: String(summary?.total ?? 0),
        description: `${summary?.pending ?? 0} pending`,
      };
    }),
    {
      tier: "applied" as const,
      count: `${totalParams - totalPending}/${totalParams}`,
      description: `${totalPending} pending apply`,
    },
  ];

  const diffChanges = overview.pending_changes.map((change) => ({
    key: change.parameter_key,
    fromValue: change.previous_value,
    toValue: change.new_value,
    note: change.reason ?? `staged by ${change.changed_by}`,
  }));

  return (
    <div className="px-4 pt-4 pb-4">
      <ConfigPageHeader
        unsavedCount={totalPending}
        configVersion="—"
        lastApplied="—"
        onApply={applyAll}
        applyDisabled={totalPending === 0 || isMutating}
      />
      <div className="mb-4">
        <ConfigSummaryGrid cards={summaryCards} />
      </div>

      {tiers.map((tier) => (
        <div key={tier}>
          <ConfigSectionHeader tier={tier} hint={TIER_HINTS[tier]} />
          <DynamicConfigSection
            sections={sectionsForTier(overview.sections, tier)}
            onStage={stageChange}
            onRevert={revertChange}
          />
        </div>
      ))}

      <ConfigDiffSummary changes={diffChanges} onApplyAll={applyAll} applyDisabled={totalPending === 0 || isMutating} />

      <div className="mt-3">
        <ConfigurationVersionsPanel />
      </div>

      <QuickLinksFooter />
    </div>
  );
}
