import { useHsmSecurityViewModel } from "../api/viewModels/hsmSecurity";
import { AlgorithmRegistry } from "../components/hsm-security/AlgorithmRegistry";
import { AttestationPanel } from "../components/hsm-security/AttestationPanel";
import { CertificateInventory } from "../components/hsm-security/CertificateInventory";
import { HsmKpiGrid } from "../components/hsm-security/HsmKpiGrid";
import { HsmPageHeader } from "../components/hsm-security/HsmPageHeader";
import { HsmSlotMap } from "../components/hsm-security/HsmSlotMap";
import { KeyCeremonyTrail } from "../components/hsm-security/KeyCeremonyTrail";
import { MasterKeyTable } from "../components/hsm-security/MasterKeyTable";
import { Pkcs11Panel } from "../components/hsm-security/Pkcs11Panel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

export function HsmSecurityPage() {
  const { data, isLoading, error, refetch, onRunAttestation, isRunningAttestation } = useHsmSecurityViewModel();

  if (isLoading || !data) {
    return <LoadingState label="Loading HSM security…" />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <HsmPageHeader serial={data.serial} />
      <div className="mb-3">
        <HsmKpiGrid cards={data.kpiCards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <Pkcs11Panel module={data.pkcs11.module} mechanisms={data.pkcs11.mechanisms} />
        <HsmSlotMap slots={data.slots} summary={data.slotSummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <MasterKeyTable keys={data.masterKeys} summary={data.masterKeySummary} />
        <KeyCeremonyTrail ceremonies={data.ceremonies} summary={data.ceremonySummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <CertificateInventory certificates={data.certificates} summary={data.certSummary} />
        <AlgorithmRegistry algorithms={data.algorithms} summary={data.algorithmSummary} />
      </div>

      <AttestationPanel
        checks={data.checks}
        history={data.history}
        lastRunLabel={data.lastRunLabel}
        scheduleNote={data.attestationScheduleNote}
        onRunAttestation={onRunAttestation}
        isRunning={isRunningAttestation}
      />

      <QuickLinksFooter />
    </div>
  );
}
