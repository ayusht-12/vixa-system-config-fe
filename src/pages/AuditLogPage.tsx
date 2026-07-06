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
const EXPORT_SCOPE_OPTIONS = ["Current Page", "Selected Entry"];

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
      icon: vm.isValid ? "✓" : "?",
      label: "Hash Chain",
      description: `${vm.verification.verified} verified`,
      tone: vm.isValid ? "neon" : vm.hasVerification ? "danger" : "warn",
    },
    { icon: "KEY", label: "ECDSA Signed", description: "P-384", tone: "neon" },
  ];

  return (
    <div className="px-4 pt-4 pb-4">
      <AuditPageHeader
        totalEntriesLabel={vm.totalEntriesLabel}
        verificationLabel={vm.verification.statusLabel}
        rootHash={vm.rootHash}
        onExportCsv={vm.onExportCurrentPageCsv}
        onExportJson={vm.onExportCurrentPageJson}
        onVerify={vm.onVerify}
        isVerifying={vm.isVerifying}
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
            activeId={vm.activeTenant}
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
            activeId={vm.activeEventType}
            onSelect={vm.onSelectEventType}
          />
          <TimeRangePanel
            options={TIME_RANGE_OPTIONS}
            from={vm.fromInput}
            to={vm.toInput}
            onSelectPreset={vm.onSelectTimePreset}
            onApplyCustomRange={vm.onApplyCustomTimeRange}
          />
          <ActorFilterPanel actors={vm.actors} value={vm.actorFilter} onFilter={vm.onActorFilter} />
        </div>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <SearchFilterBar
            search={vm.search}
            severity={vm.activeSeverity}
            eventType={vm.activeEventType}
            eventTypeOptions={vm.eventTypeFilters.filter((item) => item.id !== "all").map((item) => item.id)}
            onSearch={vm.onSearch}
          />

          <HashChainVerificationPanel
            stats={vm.hashChainStats}
            verification={vm.verification}
            chainSequence={[]}
            onVerify={vm.onVerify}
            isVerifying={vm.isVerifying}
            verifyError={vm.verifyError}
          />

          <LogTable
            entries={vm.logEntries}
            entryCountLabel={`${vm.total.toLocaleString()} filtered`}
            paginationLabel={`Page ${vm.page.toLocaleString()} of ${vm.totalPages.toLocaleString()} · showing ${vm.logEntries.length.toLocaleString()} of ${vm.total.toLocaleString()} filtered`}
            selectedId={vm.selectedId}
            onSelect={vm.setSelectedId}
            page={vm.page}
            totalPages={vm.totalPages}
            pageSize={vm.pageSize}
            onPageChange={vm.onSetPage}
            onPageSizeChange={vm.onSetPageSize}
            onExportCsv={vm.onExportCurrentPageCsv}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {vm.selectedEntryDetail ? (
              <EntryDetailPanel detail={vm.selectedEntryDetail} />
            ) : (
              <div className="rounded-large border border-subtle bg-card p-4 text-xs text-gray-600">
                No selected audit entry.
              </div>
            )}
            <div className="flex flex-col gap-3">
              <ExportControlsPanel
                scopeOptions={EXPORT_SCOPE_OPTIONS}
                hasRows={vm.rawEntries.length > 0}
                hasSelectedEntry={!!vm.selectedEntryDetail}
                onExportCurrentPageJson={vm.onExportCurrentPageJson}
                onExportCurrentPageCsv={vm.onExportCurrentPageCsv}
                onExportSelectedJson={vm.onExportSelectedJson}
                onExportSelectedCsv={vm.onExportSelectedCsv}
              />
              <IntegrityBadgesPanel badges={integrityBadges} />
            </div>
          </div>

          <QuickLinksFooter />
        </div>
      </div>
    </div>
  );
}
