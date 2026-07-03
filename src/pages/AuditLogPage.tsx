import { useAuditLogViewModel } from "../api/viewModels/auditLog";
import { ActorFilterPanel } from "../components/audit-log/ActorFilterPanel";
import { AuditKpiGrid } from "../components/audit-log/AuditKpiGrid";
import { AuditPageHeader } from "../components/audit-log/AuditPageHeader";
import { EntryDetailPanel } from "../components/audit-log/EntryDetailPanel";
import { ExportControlsPanel } from "../components/audit-log/ExportControlsPanel";
import { FilterPanel } from "../components/audit-log/FilterPanel";
import { HashChainVerificationPanel } from "../components/audit-log/HashChainVerificationPanel";
import { IntegrityBadgesPanel } from "../components/audit-log/IntegrityBadgesPanel";
import { LogTable } from "../components/audit-log/LogTable";
import { SearchFilterBar } from "../components/audit-log/SearchFilterBar";
import { TimeRangePanel } from "../components/audit-log/TimeRangePanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import type { IntegrityBadge } from "../types/audit-log";

const TIME_RANGE_OPTIONS = ["1h", "6h", "24h", "7d", "30d", "Custom"];
const EXPORT_SCOPE_OPTIONS = ["Current Filter", "Selected Entry", "All Logs"];

export function AuditLogPage() {
  const vm = useAuditLogViewModel();

  if (vm.isLoading) {
    return <LoadingState label="Loading audit log…" />;
  }

  if (vm.error) {
    return <ErrorState message={vm.error.message} onRetry={vm.refetch} />;
  }

  const integrityBadges: IntegrityBadge[] = [
    {
      icon: vm.isValid ? "✓" : "✗",
      label: "Hash Chain",
      description: `${vm.verification.verified} verified`,
      tone: vm.isValid ? "neon" : "danger",
    },
    { icon: "🔐", label: "ECDSA Signed", description: "P-384", tone: "neon" },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <AuditPageHeader
        totalEntriesLabel={vm.totalEntriesLabel}
        integrityVerifiedAgo="just now"
        rootHash={vm.rootHash}
      />
      <div className="mb-3">
        <AuditKpiGrid cards={vm.kpiCards} />
      </div>

      <div className="flex gap-3 items-start">
        <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: 280 }}>
          <FilterPanel
            title="Tenant Scope"
            actionLabel="Clear"
            items={vm.tenantFilters}
            activeId="all"
            onSelect={vm.onSelectTenant}
            renderLeading={(item) => (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.colorHex }}
              />
            )}
          />
          <FilterPanel
            title="Event Type"
            actionLabel="All"
            items={vm.eventTypeFilters}
            activeId="all"
            onSelect={vm.onSelectEventType}
          />
          <TimeRangePanel options={TIME_RANGE_OPTIONS} from="—" to="—" />
          <ActorFilterPanel actors={vm.actors} />
        </div>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <SearchFilterBar />

          <HashChainVerificationPanel
            stats={vm.hashChainStats}
            verification={vm.verification}
            chainSequence={[]}
            onVerify={vm.onVerify}
            isVerifying={vm.isVerifying}
          />

          <LogTable
            entries={vm.logEntries}
            entryCountLabel={`${vm.logEntries.length.toLocaleString()} entries`}
            paginationLabel={`Showing ${vm.logEntries.length} of ${vm.totalEntriesLabel}`}
            selectedId={vm.selectedId}
            onSelect={vm.setSelectedId}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {vm.selectedEntryDetail && <EntryDetailPanel detail={vm.selectedEntryDetail} />}
            <div className="flex flex-col gap-3">
              <ExportControlsPanel scopeOptions={EXPORT_SCOPE_OPTIONS} />
              <IntegrityBadgesPanel badges={integrityBadges} />
            </div>
          </div>

          <QuickLinksFooter />
        </div>
      </div>
    </div>
  );
}
