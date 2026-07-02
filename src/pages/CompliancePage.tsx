import { ComplianceKpiGrid } from "../components/compliance/ComplianceKpiGrid";
import { CompliancePageHeader } from "../components/compliance/CompliancePageHeader";
import { ComplianceScoreTrends } from "../components/compliance/ComplianceScoreTrends";
import { ComplianceTicker } from "../components/compliance/ComplianceTicker";
import { ControlMappingTable } from "../components/compliance/ControlMappingTable";
import { FrameworkGrid } from "../components/compliance/FrameworkGrid";
import { PolicyViolationPanel } from "../components/compliance/PolicyViolationPanel";
import { SchemaValidationPanel } from "../components/compliance/SchemaValidationPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import {
  activeSchemas,
  auditStatus,
  complianceKpis,
  complianceTicker,
  controlMappingRows,
  controlMappingSummary,
  frameworkCards,
  resolvedViolation,
  schemaFailures,
  schemaSummary,
  trendInsights,
  trendSeries,
  trendXAxisLabels,
  violations,
} from "../data/compliance";

export function CompliancePage() {
  return (
    <>
      <ComplianceTicker items={complianceTicker} />

      <div className="px-4 pt-4 pb-3">
        <CompliancePageHeader
          lastAuditAgo={auditStatus.lastAuditAgo}
          nextScheduled={auditStatus.nextScheduled}
        />
        <ComplianceKpiGrid cards={complianceKpis} />
      </div>

      <div className="px-4 pb-4">
        <FrameworkGrid frameworks={frameworkCards} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <ControlMappingTable rows={controlMappingRows} summary={controlMappingSummary} />
          <PolicyViolationPanel violations={violations} resolved={resolvedViolation} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <SchemaValidationPanel
            summary={schemaSummary}
            failures={schemaFailures}
            schemas={activeSchemas}
          />
          <ComplianceScoreTrends
            series={trendSeries}
            xAxisLabels={trendXAxisLabels}
            insights={trendInsights}
          />
        </div>

        <QuickLinksFooter />
      </div>
    </>
  );
}
