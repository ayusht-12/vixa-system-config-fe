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
import {
  baselineMetrics,
  heatmapFooter,
  heatmapRows,
  incidents,
  modelStats,
  severitySummary,
  streamStatus,
  tenantIsolationEntries,
  threatCategories,
  threatCategoryTotal,
  threatStreamEvents,
  tickerItems,
} from "../data/anomalyDetection";
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
  const pendingIncidents = incidents.filter((incident) => !incident.resolved).length;

  return (
    <>
      <ThreatTicker items={tickerItems} />

      <div className="px-4 pt-4 pb-3">
        <AnomalyPageHeader
          eventsPerSecond={streamStatus.eventsPerSecond}
          mlModel={streamStatus.mlModel}
        />
        <SeveritySummaryGrid cards={severitySummary} />
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          <LiveThreatStream events={threatStreamEvents} />
          <div className="lg:col-span-2 flex flex-col gap-3">
            <MlBaselinesPanel
              metrics={baselineMetrics}
              accuracy={modelStats.accuracy}
              falsePositiveRate={modelStats.falsePositiveRate}
            />
            <TenantIsolationPanel entries={tenantIsolationEntries} />
          </div>
        </div>

        <AnomalyHeatmap
          rows={heatmapRows}
          peakWindow={heatmapFooter.peakWindow}
          peakSummary={heatmapFooter.peakSummary}
          total24h={heatmapFooter.total24h}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <IncidentEscalationQueue incidents={incidents} pendingCount={pendingIncidents} />
          <div className="flex flex-col gap-3">
            <ThreatCategoryDistribution
              categories={threatCategories}
              windowLabel={threatCategoryTotal.windowLabel}
              totalEvents={threatCategoryTotal.totalEvents}
            />
            <QuickNavPanel items={QUICK_NAV_ITEMS} />
          </div>
        </div>
      </div>
    </>
  );
}
