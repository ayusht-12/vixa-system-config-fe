import { useDashboardViewModel } from "../api/viewModels/dashboard";
import { ActivityFeedPanel } from "../components/dashboard/ActivityFeedPanel";
import { DashboardKpiGrid } from "../components/dashboard/DashboardKpiGrid";
import { EventTrendsChart } from "../components/dashboard/EventTrendsChart";
import { TenantHealthTable } from "../components/dashboard/TenantHealthTable";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboardViewModel();

  if (isLoading || !data) {
    return <LoadingState label="Loading dashboard…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-3">
        <h2 className="font-heading text-lg font-bold text-white">Dashboard</h2>
        <div className="text-xs text-gray-600">Cross-tenant overview of the Nexus control plane</div>
      </div>

      <DashboardKpiGrid tiles={data.kpis} />

      <EventTrendsChart bars={data.trends} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <TenantHealthTable rows={data.tenantHealth} />
        <ActivityFeedPanel items={data.activity} />
      </div>

      <QuickLinksFooter />
    </div>
  );
}
