import { useState } from "react";
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
import { WormSyncPanel } from "../components/audit-log/WormSyncPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import {
  actors,
  auditHeader,
  eventTypeFilters,
  exportScopeOptions,
  hashChainSequence,
  hashChainStats,
  integrityBadges,
  kpiCards,
  logEntries,
  paginationLabel,
  selectedEntryDetail,
  tenantFilters,
  timeRangeOptions,
  verificationStats,
  wormSyncStatus,
} from "../data/auditLog";

export function AuditLogPage() {
  const [selectedId, setSelectedId] = useState<string | null>("e1");

  return (
    <div className="px-4 pt-4 pb-4">
      <AuditPageHeader
        totalEntriesLabel={auditHeader.totalEntries}
        integrityVerifiedAgo={auditHeader.integrityVerifiedAgo}
        rootHash={auditHeader.rootHash}
      />
      <div className="mb-3">
        <AuditKpiGrid cards={kpiCards} />
      </div>

      <div className="flex gap-3 items-start">
        <div className="flex flex-col gap-3 flex-shrink-0" style={{ width: 280 }}>
          <FilterPanel
            title="Tenant Scope"
            actionLabel="Clear"
            items={tenantFilters}
            defaultActiveId="all"
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
            items={eventTypeFilters}
            defaultActiveId="state-change"
          />
          <TimeRangePanel
            options={timeRangeOptions}
            from="2025-01-15 13:32"
            to="2025-01-15 14:32"
          />
          <ActorFilterPanel actors={actors} />
          <WormSyncPanel status={wormSyncStatus} />
        </div>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <SearchFilterBar />

          <HashChainVerificationPanel
            stats={hashChainStats}
            verification={verificationStats}
            chainSequence={hashChainSequence}
          />

          <LogTable
            entries={logEntries}
            entryCountLabel={`${logEntries.length.toLocaleString()} entries · last 1h`}
            paginationLabel={paginationLabel}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <EntryDetailPanel detail={selectedEntryDetail} />
            <div className="flex flex-col gap-3">
              <ExportControlsPanel scopeOptions={exportScopeOptions} />
              <IntegrityBadgesPanel badges={integrityBadges} />
            </div>
          </div>

          <QuickLinksFooter />
        </div>
      </div>
    </div>
  );
}
