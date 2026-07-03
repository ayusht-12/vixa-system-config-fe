import { useCommandCenterViewModel } from "../api/viewModels/commandCenter";
import { AnomalyFeed } from "../components/command-center/AnomalyFeed";
import { ApiRateMeter } from "../components/command-center/ApiRateMeter";
import { EngineIdentityBanner } from "../components/command-center/EngineIdentityBanner";
import { EtcdClusterState } from "../components/command-center/EtcdClusterState";
import { HsmCryptoCard } from "../components/command-center/HsmCryptoCard";
import { OidcAuthCard } from "../components/command-center/OidcAuthCard";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { SystemHealthGrid } from "../components/command-center/SystemHealthGrid";
import { TenantKpiTable } from "../components/command-center/TenantKpiTable";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

export function CommandCenterPage() {
  const { data, isLoading, error, refetch } = useCommandCenterViewModel();

  if (isLoading || !data) {
    return <LoadingState label="Loading command center…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <EngineIdentityBanner identity={data.identity} />

      <div className="px-4 pb-4">
        <SystemHealthGrid metrics={data.systemHealth} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <ApiRateMeter summary={data.apiRate} />
          <EtcdClusterState summary={data.etcdCluster} />
          <div className="flex flex-col gap-3">
            <OidcAuthCard summary={data.oidc} />
            <HsmCryptoCard summary={data.hsm} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <AnomalyFeed events={data.anomalyEvents} />
          <TenantKpiTable overview={data.tenantOverview} />
        </div>

        <QuickLinksFooter />
      </div>
    </>
  );
}
