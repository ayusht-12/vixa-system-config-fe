import { useComplianceViewModel } from "../api/viewModels/compliance";
import { ComplianceKpiGrid } from "../components/compliance/ComplianceKpiGrid";
import { CompliancePageHeader } from "../components/compliance/CompliancePageHeader";
import { ComplianceScoreTrends } from "../components/compliance/ComplianceScoreTrends";
import { ComplianceTicker } from "../components/compliance/ComplianceTicker";
import { ControlMappingTable } from "../components/compliance/ControlMappingTable";
import { FrameworkGrid } from "../components/compliance/FrameworkGrid";
import { PolicyViolationPanel } from "../components/compliance/PolicyViolationPanel";
import { SchemaValidationPanel } from "../components/compliance/SchemaValidationPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

export function CompliancePage() {
  const { data, isLoading, error, refetch } = useComplianceViewModel();

  if (isLoading || !data) {
    return <LoadingState label="Loading compliance overview…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <ComplianceTicker items={data.ticker} />

      <div className="px-4 pt-4 pb-3">
        <CompliancePageHeader lastAuditAgo="N/A" nextScheduled="N/A" />
        <ComplianceKpiGrid cards={data.kpis} />
      </div>

      <div className="px-4 pb-4">
        <FrameworkGrid frameworks={data.frameworks} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <ControlMappingTable rows={data.controlMappingRows} summary={data.controlMappingSummary} />
          <PolicyViolationPanel violations={data.violations} resolved={data.resolvedViolation} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <SchemaValidationPanel
            summary={data.schemaSummary}
            failures={data.schemaFailures}
            schemas={[]}
          />
          <ComplianceScoreTrends series={[]} xAxisLabels={[]} insights={[]} />
        </div>

        <QuickLinksFooter />
      </div>
    </>
  );
}
