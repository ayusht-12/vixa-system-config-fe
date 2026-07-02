import { ConfigDiffSummary } from "../components/config-manager/ConfigDiffSummary";
import { ConfigPageHeader } from "../components/config-manager/ConfigPageHeader";
import { ConfigSectionHeader } from "../components/config-manager/ConfigSectionHeader";
import { ConfigSummaryGrid } from "../components/config-manager/ConfigSummaryGrid";
import { AuditSinkPanel } from "../components/config-manager/panels/AuditSinkPanel";
import { AuthStrategyPanel } from "../components/config-manager/panels/AuthStrategyPanel";
import { BackupIntervalsPanel } from "../components/config-manager/panels/BackupIntervalsPanel";
import { CryptoHsmPanel } from "../components/config-manager/panels/CryptoHsmPanel";
import { EngineIdentityPanel } from "../components/config-manager/panels/EngineIdentityPanel";
import { EtcdPersistencePanel } from "../components/config-manager/panels/EtcdPersistencePanel";
import { GeoRedundancyPanel } from "../components/config-manager/panels/GeoRedundancyPanel";
import { RateLimitingPanel } from "../components/config-manager/panels/RateLimitingPanel";
import { RedisCachePanel } from "../components/config-manager/panels/RedisCachePanel";
import { RetentionPolicyPanel } from "../components/config-manager/panels/RetentionPolicyPanel";
import { TenancyIsolationPanel } from "../components/config-manager/panels/TenancyIsolationPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";

export function ConfigManagerPage() {
  return (
    <div className="px-4 pt-4 pb-4">
      <ConfigPageHeader unsavedCount={3} configVersion="v2.14.7" lastApplied="47m ago" />
      <div className="mb-4">
        <ConfigSummaryGrid />
      </div>

      <ConfigSectionHeader tier="critical" hint="Engine restart required on change" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <EngineIdentityPanel />
        <EtcdPersistencePanel />
        <AuditSinkPanel />
        <AuthStrategyPanel />
      </div>

      <ConfigSectionHeader tier="necessary" hint="Hot-reload supported · no restart required" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <CryptoHsmPanel />
        <RateLimitingPanel />
        <TenancyIsolationPanel />
        <BackupIntervalsPanel />
      </div>

      <ConfigSectionHeader tier="optional" hint="Feature flags · performance tuning · infrastructure" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <RedisCachePanel />
        <GeoRedundancyPanel />
        <RetentionPolicyPanel />
      </div>

      <ConfigDiffSummary />

      <QuickLinksFooter />
    </div>
  );
}
