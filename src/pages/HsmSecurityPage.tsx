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
import {
  algorithmSummary,
  algorithms,
  attestationChecks,
  attestationHeader,
  attestationHistory,
  attestationScheduleNote,
  ceremonySummary,
  certSummary,
  certificates,
  hsmHeader,
  hsmSlots,
  keyCeremonies,
  kpiCards,
  masterKeySummary,
  masterKeys,
  pkcs11Module,
  pkcsMechanisms,
  slotSummary,
} from "../data/hsmSecurity";

export function HsmSecurityPage() {
  return (
    <div className="px-4 pt-4 pb-4">
      <HsmPageHeader serial={hsmHeader.serial} />
      <div className="mb-3">
        <HsmKpiGrid cards={kpiCards} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <Pkcs11Panel module={pkcs11Module} mechanisms={pkcsMechanisms} />
        <HsmSlotMap slots={hsmSlots} summary={slotSummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <MasterKeyTable keys={masterKeys} summary={masterKeySummary} />
        <KeyCeremonyTrail ceremonies={keyCeremonies} summary={ceremonySummary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
        <CertificateInventory certificates={certificates} summary={certSummary} />
        <AlgorithmRegistry algorithms={algorithms} summary={algorithmSummary} />
      </div>

      <AttestationPanel
        checks={attestationChecks}
        history={attestationHistory}
        lastRunLabel={attestationHeader.lastRun}
        scheduleNote={attestationScheduleNote}
      />

      <QuickLinksFooter />
    </div>
  );
}
