import { AnomalyFeed } from "../components/command-center/AnomalyFeed";
import { ApiRateMeter } from "../components/command-center/ApiRateMeter";
import { EngineIdentityBanner } from "../components/command-center/EngineIdentityBanner";
import { EtcdClusterState } from "../components/command-center/EtcdClusterState";
import { HsmCryptoCard } from "../components/command-center/HsmCryptoCard";
import { OidcAuthCard } from "../components/command-center/OidcAuthCard";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { SystemHealthGrid } from "../components/command-center/SystemHealthGrid";
import { TenantKpiTable } from "../components/command-center/TenantKpiTable";
import {
  anomalyEvents,
  apiRateSummary,
  engineIdentity,
  etcdClusterSummary,
  hsmSummary,
  oidcAuthSummary,
  systemHealthMetrics,
  tenantOverview,
} from "../data/commandCenter";

export function CommandCenterPage() {
  return (
    <>
      <EngineIdentityBanner identity={engineIdentity} />

      <div className="px-4 pb-4">
        <SystemHealthGrid metrics={systemHealthMetrics} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <ApiRateMeter summary={apiRateSummary} />
          <EtcdClusterState summary={etcdClusterSummary} />
          <div className="flex flex-col gap-3">
            <OidcAuthCard summary={oidcAuthSummary} />
            <HsmCryptoCard summary={hsmSummary} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <AnomalyFeed events={anomalyEvents} />
          <TenantKpiTable overview={tenantOverview} />
        </div>

        <QuickLinksFooter />
      </div>
    </>
  );
}
