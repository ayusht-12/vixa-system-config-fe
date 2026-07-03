import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveKeyCeremony, completeKeyCeremony, fetchHsmOverview, runHsmAttestation } from "../hsm";
import type {
  AlgorithmEntry,
  AttestationCheck,
  AttestationHistoryPoint,
  CeremonyEntry,
  CertRow,
  HsmKpiCard,
  HsmSlot,
  MasterKeyRow,
} from "../../types/hsm-security";
import type { AccentColor } from "../../types/command-center";
import type {
  CertificateDTO,
  CryptoAlgorithmDTO,
  HsmOverviewDTO,
  HsmSlotDTO,
  KeyCeremonyDTO,
  MasterKeyDTO,
} from "../types";

function mapSlots(dto: HsmSlotDTO[]): HsmSlot[] {
  return dto.map((slot) => ({
    id: slot.id,
    name: `Slot ${slot.slot_number}`,
    badgeLabel: slot.purpose.toUpperCase(),
    style: !slot.is_active ? "inactive" : slot.capacity_percent >= 80 ? "warn" : "active",
    labelValue: slot.label,
    keysCount: `${slot.object_count}/${slot.capacity_max_objects}`,
    capacityPercent: Math.round(slot.capacity_percent),
    opsPerSecond: slot.ops_per_second.toLocaleString(),
    extraLabel: "Flags",
    extraValue: slot.token_flags,
  }));
}

function keyStatus(effectiveStatus: string): MasterKeyRow["status"] {
  const upper = effectiveStatus.toUpperCase();
  if (upper === "ACTIVE" || upper === "EXPIRING" || upper === "RETIRED" || upper === "PENDING") return upper;
  return "ACTIVE";
}

function mapMasterKeys(dto: MasterKeyDTO[]): MasterKeyRow[] {
  return dto.map((key) => {
    const status = keyStatus(key.effective_status);
    return {
      id: key.id,
      keyId: key.key_label,
      keyIdMeta: key.slot_label ?? "—",
      algorithm: key.algorithm,
      algorithmTone: "purple",
      created: key.activated_at ? key.activated_at.slice(0, 10) : "—",
      expires: key.expires_at ? key.expires_at.slice(0, 10) : "—",
      expiresTone: status === "EXPIRING" ? "warn" : status === "RETIRED" ? "danger" : "neon",
      status,
      rotationPercent: Math.round(key.rotation_percent),
      rotationLabel: `${Math.round(key.rotation_percent)}%`,
      rotationNote:
        key.days_until_rotation !== null
          ? key.days_until_rotation >= 0
            ? `${key.days_until_rotation}d until rotation`
            : "rotation overdue"
          : "—",
      actionLabel: status === "RETIRED" ? "Archived" : "Details",
      actionVariant: status === "EXPIRING" ? "primary" : "default",
      borderHex: status === "EXPIRING" ? "#FBBF24" : "#21262D",
      keyIdTone: "neon",
    };
  });
}

function mapCeremonies(
  dto: KeyCeremonyDTO[],
  handlers: { onApprove: (id: string) => void; onComplete: (id: string) => void },
): CeremonyEntry[] {
  return dto.map((ceremony) => {
    const isPending = ceremony.status === "pending" || ceremony.status === "awaiting_approval";
    const canComplete = ceremony.quorum_met && ceremony.status !== "completed";
    return {
      id: ceremony.id,
      eventLabel: ceremony.ceremony_ref,
      eventTone: ceremony.status === "completed" ? "neon" : "info",
      timeLabel: ceremony.completed_at ? ceremony.completed_at.slice(0, 10) : (ceremony.scheduled_at?.slice(0, 10) ?? "—"),
      description: `${ceremony.master_key_label}${ceremony.predecessor_label ? ` ← ${ceremony.predecessor_label}` : ""} · ${ceremony.status.replace("_", " ")}`,
      quorumLabel: `Quorum: ${ceremony.approval_count}/${ceremony.required_approvals}`,
      approvals: ceremony.approvals.map((a) => ({
        name: a.custodian_email,
        status: a.approved_at ? `✓ ${a.approved_at.slice(0, 10)}` : "⏳ PENDING",
        pending: !a.approved_at,
      })),
      ceremonyMeta: `${ceremony.approval_count}/${ceremony.required_approvals} approvals`,
      dotColorHex: ceremony.status === "completed" ? "#00FFA3" : "#60A4FA",
      dotContent: ceremony.status === "completed" ? "✓" : "…",
      dotPulse: isPending,
      historical: ceremony.status === "completed",
      onApprove: isPending ? () => handlers.onApprove(ceremony.id) : undefined,
      onComplete: canComplete ? () => handlers.onComplete(ceremony.id) : undefined,
    };
  });
}

function certType(certType: string): AccentColor {
  const lower = certType.toLowerCase();
  if (lower.includes("root")) return "purple";
  if (lower.includes("intermediate")) return "info";
  return "neon";
}

function mapCertificates(dto: CertificateDTO[]): CertRow[] {
  return dto.map((cert) => ({
    id: cert.id,
    cn: cert.common_name,
    cnTone: "text-gray-300",
    algoLine: `${cert.key_algorithm} · ${cert.signature_algorithm}`,
    type: cert.cert_type.toUpperCase(),
    typeTone: certType(cert.cert_type),
    issued: cert.issued_at.slice(0, 10),
    expires: cert.expires_at.slice(0, 10),
    expiresTone: cert.days_left <= 30 ? "warn" : "neon",
    daysLeft: `${cert.days_left}d`,
    daysLeftTone: cert.days_left <= 30 ? "warn" : cert.days_left <= 7 ? "danger" : "neon",
    status: cert.status.toUpperCase(),
    statusTone: cert.status === "valid" ? "neon" : "warn",
    borderHex: cert.days_left <= 30 ? "#FBBF24" : "#21262D",
  }));
}

function mapAlgorithms(dto: CryptoAlgorithmDTO[]): AlgorithmEntry[] {
  return dto.map((algo) => ({
    id: algo.id,
    name: algo.name,
    nameHex: algo.is_deprecated ? "#6B7280" : "#00FFA3",
    badgeLabel: algo.purpose_label,
    badgeHex: algo.is_deprecated ? "#FF3B3B" : "#60A4FA",
    active: algo.is_active,
    bgHex: algo.is_deprecated ? "#1A0505" : "#0A0E14",
    borderHex: algo.is_deprecated ? "#FF3B3B30" : "#21262D",
    stats: [{ label: "Ops/s", value: algo.ops_per_second.toLocaleString(), valueTone: "neon" }],
    note: algo.is_deprecated ? `Deprecated ${algo.deprecated_at?.slice(0, 10) ?? ""}` : undefined,
    deprecated: algo.is_deprecated,
  }));
}

function mapAttestation(dto: HsmOverviewDTO): {
  checks: AttestationCheck[];
  history: AttestationHistoryPoint[];
  lastRunLabel: string;
} {
  const run = dto.latest_attestation;
  const checks: AttestationCheck[] = (run?.checks ?? []).map((check) => ({
    label: check.label,
    description: check.detail,
    hashLabel: check.key,
    tone: check.passed ? "neon" : "danger",
    glow: check.passed ? "" : "glow-red",
    bgHex: check.passed ? "#001A0D" : "#1A0505",
    borderHex: check.passed ? "#00FFA330" : "#FF3B3B30",
  }));

  const history: AttestationHistoryPoint[] = dto.attestation_history.map((point) => ({
    label: point.ran_at.slice(0, 10),
    heightPercent: point.all_passed ? 100 : 40,
  }));

  return {
    checks,
    history,
    lastRunLabel: run ? `Last run ${run.ran_at.slice(0, 10)}` : "Never run",
  };
}

export function useHsmSecurityViewModel() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["hsm", "overview"], queryFn: fetchHsmOverview });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["hsm", "overview"] });
    queryClient.invalidateQueries({ queryKey: ["engine", "overview"] });
  }

  const approveMutation = useMutation({ mutationFn: approveKeyCeremony, onSuccess: invalidate });
  const completeMutation = useMutation({ mutationFn: completeKeyCeremony, onSuccess: invalidate });
  const attestMutation = useMutation({ mutationFn: runHsmAttestation, onSuccess: invalidate });

  const dto = query.data;

  const data = dto
    ? {
        serial: dto.module_serial,
        slots: mapSlots(dto.slots),
        slotSummary: `${dto.slots.filter((s) => s.is_active).length}/${dto.slots.length} active`,
        masterKeys: mapMasterKeys(dto.master_keys),
        masterKeySummary: {
          active: dto.master_keys.filter((k) => k.effective_status === "active").length,
          expiring: dto.master_keys.filter((k) => k.effective_status === "expiring").length,
          retired: dto.master_keys.filter((k) => k.effective_status === "retired").length,
          pending: dto.master_keys.filter((k) => k.effective_status === "pending").length,
          policyNote: "rotation policy varies per key",
        },
        ceremonies: mapCeremonies(dto.ceremonies, {
          onApprove: (id) => approveMutation.mutate(id),
          onComplete: (id) => completeMutation.mutate(id),
        }),
        ceremonySummary: `${dto.ceremonies.length} ceremonies on record`,
        certificates: mapCertificates(dto.certificates),
        certSummary: {
          totalLabel: `${dto.certificates.length} certs`,
          showingLabel: `Showing ${dto.certificates.length} of ${dto.certificates.length}`,
        },
        algorithms: mapAlgorithms(dto.algorithms),
        algorithmSummary: `${dto.algorithms.filter((a) => a.is_active).length} active algorithms`,
        ...mapAttestation(dto),
        attestationScheduleNote: "on-demand",
        kpiCards: [
          {
            id: "active-keys",
            label: "Active Keys",
            value: String(dto.master_keys.filter((k) => k.effective_status === "active").length),
            description: "master keys",
            iconContent: "🔑",
            tone: "neon" as const,
            borderHex: "#00FFA3",
          },
          {
            id: "slots",
            label: "Slots",
            value: `${dto.slots.filter((s) => s.is_active).length}/${dto.slots.length}`,
            description: "active",
            iconContent: "🗄",
            tone: "info" as const,
            borderHex: "#60A4FA",
          },
          {
            id: "ceremonies",
            label: "Pending Ceremonies",
            value: String(dto.ceremonies.filter((c) => c.status !== "completed").length),
            description: "awaiting quorum",
            iconContent: "✍",
            tone: "purple" as const,
            borderHex: "#A78BFA",
          },
          {
            id: "certs-expiring",
            label: "Certs Expiring",
            value: String(dto.certificates.filter((c) => c.days_left <= 30).length),
            description: "within 30d",
            iconContent: "📜",
            tone: "warn" as const,
            borderHex: "#FBBF24",
          },
          {
            id: "attestation",
            label: "Attestation",
            value: dto.latest_attestation?.all_passed ? "PASS" : "—",
            description: `${dto.latest_attestation?.pass_count ?? 0}/${dto.latest_attestation?.total_checks ?? 0} checks`,
            iconContent: "✓",
            tone: "neon" as const,
            borderHex: "#00FFA3",
          },
          {
            id: "status",
            label: "Status",
            value: "OPERATIONAL",
            description: "FIPS 140-3 L3",
            iconContent: "●",
            tone: "neon" as const,
            iconPulse: true,
            borderHex: "#00FFA3",
          },
        ] satisfies HsmKpiCard[],
      }
    : undefined;

  return {
    data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    onRunAttestation: () => attestMutation.mutate(),
    isRunningAttestation: attestMutation.isPending,
  };
}
