import { useAnomalyDetectionViewModel } from "../api/viewModels/anomalyDetection";
import { AnomalyHeatmap } from "../components/anomaly-detection/AnomalyHeatmap";
import { AnomalyPageHeader } from "../components/anomaly-detection/AnomalyPageHeader";
import { IncidentEscalationQueue } from "../components/anomaly-detection/IncidentEscalationQueue";
import { LiveThreatStream } from "../components/anomaly-detection/LiveThreatStream";
import { MlBaselinesPanel } from "../components/anomaly-detection/MlBaselinesPanel";
import { SeveritySummaryGrid } from "../components/anomaly-detection/SeveritySummaryGrid";
import { TenantIsolationPanel } from "../components/anomaly-detection/TenantIsolationPanel";
import { ThreatCategoryDistribution } from "../components/anomaly-detection/ThreatCategoryDistribution";
import { ThreatTicker } from "../components/anomaly-detection/ThreatTicker";
import { QuickNavPanel } from "../components/layout/QuickNavPanel";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { ROUTES } from "../routes/routes";

const QUICK_NAV_ITEMS = [
  ROUTES.commandCenter,
  ROUTES.compliance,
  ROUTES.auditLogs,
  ROUTES.tenancy,
  ROUTES.hsmSecurity,
  ROUTES.configManager,
];

export function AnomalyDetectionPage() {
  const { data, isLoading, error, refetch } = useAnomalyDetectionViewModel();

  if (isLoading || !data) {
    return <LoadingState label="Loading anomaly detection…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  const pendingIncidents = data.incidents.filter((incident) => !incident.resolved).length;

  return (
    <>
      <ThreatTicker items={data.tickerItems} />

      <div className="px-4 pt-4 pb-3">
        <AnomalyPageHeader
          eventsPerSecond={data.streamStatus.eventsPerSecond}
          mlModel={data.streamStatus.mlModel}
        />
        <SeveritySummaryGrid cards={data.severitySummary} />
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <LiveThreatStream events={data.threatStreamEvents} />
          <div className="lg:col-span-2 flex flex-col gap-3">
            <MlBaselinesPanel metrics={data.baselineMetrics} accuracy="N/A" falsePositiveRate="N/A" />
            <TenantIsolationPanel entries={[]} />
          </div>
        </div>

        <AnomalyHeatmap
          rows={data.heatmapRows}
          peakWindow={data.heatmapFooter.peakWindow}
          peakSummary={data.heatmapFooter.peakSummary}
          total24h={data.heatmapFooter.total24h}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <IncidentEscalationQueue incidents={data.incidents} pendingCount={pendingIncidents} />
          <div className="flex flex-col gap-3">
            <ThreatCategoryDistribution
              categories={data.threatCategories}
              windowLabel={data.threatCategoryTotal.windowLabel}
              totalEvents={data.threatCategoryTotal.totalEvents}
            />
            <QuickNavPanel items={QUICK_NAV_ITEMS} />
          </div>
        </div>
      </div>
    </>
  );
}
