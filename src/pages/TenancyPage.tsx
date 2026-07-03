import { useTenantManagementViewModel } from "../api/viewModels/tenancy";
import { BackupSnapshotStatus } from "../components/tenancy/BackupSnapshotStatus";
import { BreachAlertsPanel } from "../components/tenancy/BreachAlertsPanel";
import { DataBoundaryVisualization } from "../components/tenancy/DataBoundaryVisualization";
import { IsolationStatusTable } from "../components/tenancy/IsolationStatusTable";
import { ProvisioningPanel } from "../components/tenancy/ProvisioningPanel";
import { SchemaValidationQueue } from "../components/tenancy/SchemaValidationQueue";
import { TenancyKpiGrid } from "../components/tenancy/TenancyKpiGrid";
import { TenancyPageHeader } from "../components/tenancy/TenancyPageHeader";
import { TenantMembersPanel } from "../components/tenancy/TenantMembersPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import {
  boundaryFooterNote,
  boundaryTenants,
  breachAlerts,
  breachHistoryNote,
  isolationModeOptions,
  kpiCards,
  provisioningState,
  regionOptions,
  schemaRows,
  schemaSummary,
  schemaSummaryBadge,
  snapshotSummary,
  snapshotSummaryBadge,
  snapshots,
  tenancyHeader,
  tierOptions,
} from "../data/tenancy";

export function TenancyPage() {
  const tenants = useTenantManagementViewModel();

  return (
    <div className="px-4 pt-4 pb-4">
      <TenancyPageHeader isolationEngineStatus={tenancyHeader.isolationEngineStatus} />
      <div className="mb-3">
        <TenancyKpiGrid cards={kpiCards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <IsolationStatusTable
          rows={tenants.rows}
          badgeLabel="LIVE · PER-ORG ENFORCEMENT"
          summary={tenants.summary}
          actions={{
            onActivate: tenants.onActivate,
            onDeactivate: tenants.onDeactivate,
            onDelete: tenants.onDelete,
          }}
        />
        <BreachAlertsPanel alerts={breachAlerts} historyNote={breachHistoryNote} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <ProvisioningPanel
          state={provisioningState}
          tierOptions={tierOptions}
          regionOptions={regionOptions}
          isolationModeOptions={isolationModeOptions}
          onProvision={tenants.onCreate}
        />
        <DataBoundaryVisualization tenants={boundaryTenants} footerNote={boundaryFooterNote} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <SchemaValidationQueue rows={schemaRows} badgeLabel={schemaSummaryBadge} summary={schemaSummary} />
        <BackupSnapshotStatus snapshots={snapshots} badgeLabel={snapshotSummaryBadge} summary={snapshotSummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <TenantMembersPanel
          tenants={tenants.rows.map((row) => ({ id: row.id, label: row.tenantId }))}
        />
      </div>

      <QuickLinksFooter />
    </div>
  );
}
