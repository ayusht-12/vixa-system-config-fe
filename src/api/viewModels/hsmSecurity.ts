import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveKeyCeremony,
  completeKeyCeremony,
  createHsmKey,
  disableHsmKey,
  fetchHsmKey,
  fetchHsmOverview,
  fetchHsmProviders,
  initiateKeyCeremony,
  rotateHsmKey,
  runHsmAttestation,
} from "../hsm";
import type {
  AlgorithmEntry,
  AttestationCheck,
  AttestationHistoryPoint,
  CeremonyEntry,
  CertRow,
  HsmKpiCard,
  HsmSlot,
  MasterKeyRow,
  PkcsMechanism,
} from "../../types/hsm-security";
import type { AccentColor } from "../../types/command-center";
import type {
  CertificateDTO,
  CryptoAlgorithmDTO,
  HsmOverviewDTO,
  HsmSlotDTO,
  KeyCeremonyDTO,
  MasterKeyDTO,
  SecurityProviderDTO,
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
  if (
    upper === "ACTIVE" ||
    upper === "EXPIRING" ||
    upper === "RETIRED" ||
    upper === "PENDING" ||
    upper === "DISABLED"
  ) {
    return upper;
  }
  return "DISABLED";
}

function mapMasterKeys(
  dto: MasterKeyDTO[],
  handlers: {
    onDetails: (id: string) => void;
    onRotate: (id: string) => void;
    onDisable: (id: string) => void;
    pendingKeyId: string | null;
  },
): MasterKeyRow[] {
  return dto.map((key) => {
    const status = keyStatus(key.effective_status);
    const canRotate = status === "ACTIVE" || status === "EXPIRING";
    const canDisable = status === "ACTIVE" || status === "EXPIRING" || status === "PENDING";
    return {
      id: key.id,
      keyId: key.key_label,
      keyIdMeta: key.slot_label ?? "—",
      algorithm: key.algorithm,
      algorithmTone: "purple",
      created: key.activated_at ? key.activated_at.slice(0, 10) : "—",
      expires: key.expires_at ? key.expires_at.slice(0, 10) : "—",
      expiresTone: status === "EXPIRING" ? "warn" : status === "RETIRED" || status === "DISABLED" ? "danger" : "neon",
      status,
      rotationPercent: Math.round(key.rotation_percent),
      rotationLabel: `${Math.round(key.rotation_percent)}%`,
      rotationNote:
        key.days_until_rotation !== null
          ? key.days_until_rotation >= 0
            ? `${key.days_until_rotation}d until rotation`
            : "rotation overdue"
          : "—",
      actionLabel: canRotate ? "Rotate" : "Details",
      actionVariant: status === "EXPIRING" ? "primary" : "default",
      borderHex: status === "EXPIRING" ? "#FBBF24" : status === "DISABLED" ? "#FF3B3B" : "#21262D",
      keyIdTone: "neon",
      canRotate,
      canDisable,
      isMutating: handlers.pendingKeyId === key.id,
      onDetails: () => handlers.onDetails(key.id),
      onRotate: canRotate ? () => handlers.onRotate(key.id) : undefined,
      onDisable: canDisable ? () => handlers.onDisable(key.id) : undefined,
    };
  });
}

function mapCeremonies(
  dto: KeyCeremonyDTO[],
  handlers: { onApprove: (id: string) => void; onComplete: (id: string) => void; pendingCeremonyId: string | null },
): CeremonyEntry[] {
  return dto.map((ceremony) => {
    const isPending = ceremony.status === "pending";
    const isComplete = ceremony.status === "complete";
    const canComplete = ceremony.quorum_met && isPending;
    return {
      id: ceremony.id,
      eventLabel: ceremony.ceremony_ref,
      eventTone: isComplete ? "neon" : "info",
      timeLabel: ceremony.completed_at ? ceremony.completed_at.slice(0, 10) : (ceremony.scheduled_at?.slice(0, 10) ?? "—"),
      description: `${ceremony.master_key_label}${ceremony.predecessor_label ? ` ← ${ceremony.predecessor_label}` : ""} · ${ceremony.status.replace("_", " ")}`,
      quorumLabel: `Quorum: ${ceremony.approval_count}/${ceremony.required_approvals}`,
      approvals: ceremony.approvals.map((a) => ({
        name: a.custodian_email,
        status: a.approved_at ? `✓ ${a.approved_at.slice(0, 10)}` : "⏳ PENDING",
        pending: !a.approved_at,
      })),
      ceremonyMeta: `${ceremony.approval_count}/${ceremony.required_approvals} approvals`,
      dotColorHex: isComplete ? "#00FFA3" : "#60A4FA",
      dotContent: isComplete ? "✓" : "…",
      dotPulse: isPending,
      historical: isComplete,
      onApprove: isPending ? () => handlers.onApprove(ceremony.id) : undefined,
      onComplete: canComplete ? () => handlers.onComplete(ceremony.id) : undefined,
      isMutating: handlers.pendingCeremonyId === ceremony.id,
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
    passed: point.all_passed,
  }));

  return {
    checks,
    history,
    lastRunLabel: run ? `Last run ${run.ran_at.slice(0, 10)}` : "Never run",
  };
}

const MECHANISM_TONES: AccentColor[] = ["neon", "info", "purple"];

interface Pkcs11ViewData {
  module: {
    libraryPath: string;
    manufacturer: string;
    firmware: string;
    serial: string;
    connectionPoolActive: string;
    connectionPoolPercent: number;
    latency: string;
    timeout: string;
    sessions: string;
    rwSessions: string;
    errors24h: string;
  };
  mechanisms: PkcsMechanism[];
}

function mapPkcs11(providers: SecurityProviderDTO[], fallbackSerial: string): Pkcs11ViewData {
  // The panel shows a single representative provider: the busiest active one
  // (the primary that is actually serving sessions), not whichever sorts first
  // alphabetically. Falls back to the first provider, or an honest empty panel
  // when none are configured yet.
  const provider =
    [...providers]
      .filter((p) => p.is_active)
      .sort(
        (a, b) =>
          b.session_count - a.session_count ||
          b.pool_active - a.pool_active ||
          a.name.localeCompare(b.name),
      )[0] ?? providers[0];
  if (!provider) {
    return {
      module: {
        libraryPath: "—",
        manufacturer: "—",
        firmware: "—",
        serial: fallbackSerial,
        connectionPoolActive: "—",
        connectionPoolPercent: 0,
        latency: "—",
        timeout: "—",
        sessions: "—",
        rwSessions: "—",
        errors24h: "—",
      },
      mechanisms: [],
    };
  }
  return {
    module: {
      libraryPath: provider.library_path ?? "—",
      manufacturer: provider.manufacturer,
      firmware: provider.firmware_version ?? "—",
      serial: provider.serial_number ?? fallbackSerial,
      connectionPoolActive: `${provider.pool_active}/${provider.pool_max} active`,
      connectionPoolPercent: Math.round(provider.pool_utilization_percent),
      latency: `${provider.avg_latency_ms}ms avg`,
      timeout: `${provider.connection_timeout_seconds}s`,
      sessions: String(provider.session_count),
      rwSessions: String(provider.rw_session_count),
      errors24h: String(provider.error_count_24h),
    },
    mechanisms: provider.supported_mechanisms.map((label, index) => ({
      label,
      tone: MECHANISM_TONES[index % MECHANISM_TONES.length],
    })),
  };
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvValue(value: string | number | null | undefined): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function useHsmSecurityViewModel() {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingKeyId, setPendingKeyId] = useState<string | null>(null);
  const [pendingCeremonyId, setPendingCeremonyId] = useState<string | null>(null);
  const query = useQuery({ queryKey: ["hsm", "overview"], queryFn: fetchHsmOverview });
  const providersQuery = useQuery({ queryKey: ["hsm", "providers"], queryFn: fetchHsmProviders });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["hsm", "overview"] });
    queryClient.invalidateQueries({ queryKey: ["hsm", "providers"] });
    queryClient.invalidateQueries({ queryKey: ["engine", "overview"] });
  }

  const commonMutationOptions = {
    onSuccess: () => {
      setActionError(null);
      invalidate();
    },
    onError: (error: Error) => setActionError(error.message),
  };

  const createKeyMutation = useMutation({ mutationFn: createHsmKey, ...commonMutationOptions });
  const rotateMutation = useMutation({
    mutationFn: (keyId: string) => rotateHsmKey(keyId),
    ...commonMutationOptions,
    onSettled: () => setPendingKeyId(null),
  });
  const disableMutation = useMutation({
    mutationFn: disableHsmKey,
    ...commonMutationOptions,
    onSettled: () => setPendingKeyId(null),
  });
  const detailMutation = useMutation({
    mutationFn: fetchHsmKey,
    onSuccess: (key) => {
      setActionError(null);
      window.alert(
        [
          `Key: ${key.key_label}`,
          `Status: ${key.effective_status}`,
          `Algorithm: ${key.algorithm}`,
          `Slot: ${key.slot_label ?? "not assigned"}`,
          `Rotation policy: ${key.rotation_policy_days} days`,
          `Wraps DEKs: ${key.wraps_dek_count}`,
        ].join("\n"),
      );
    },
    onError: (error: Error) => setActionError(error.message),
    onSettled: () => setPendingKeyId(null),
  });
  const initiateMutation = useMutation({ mutationFn: initiateKeyCeremony, ...commonMutationOptions });
  const approveMutation = useMutation({
    mutationFn: approveKeyCeremony,
    ...commonMutationOptions,
    onSettled: () => setPendingCeremonyId(null),
  });
  const completeMutation = useMutation({
    mutationFn: completeKeyCeremony,
    ...commonMutationOptions,
    onSettled: () => setPendingCeremonyId(null),
  });
  const attestMutation = useMutation({ mutationFn: runHsmAttestation, ...commonMutationOptions });

  const dto = query.data;
  const providers = providersQuery.data ?? [];
  const primaryProvider =
    [...providers].filter((p) => p.provider_type === "pkcs11").sort((a, b) => Number(b.is_active) - Number(a.is_active))[0] ??
    providers[0];
  const providerStatus = primaryProvider?.status ?? "not configured";
  const statusTone: AccentColor =
    providerStatus === "online" ? "neon" : providerStatus === "degraded" || providerStatus === "stale" ? "warn" : "danger";

  const data = dto
    ? {
        serial: dto.module_serial,
        headerBadges: [
          primaryProvider?.fips_level || "FIPS level not reported",
          primaryProvider?.provider_type === "pkcs11" ? "PKCS#11 configured" : "PKCS#11 not configured",
          primaryProvider ? `${primaryProvider.manufacturer} ${primaryProvider.model}` : "Provider not configured",
        ],
        pkcs11: mapPkcs11(providers, dto.module_serial),
        slots: mapSlots(dto.slots),
        slotSummary: `${dto.slots.filter((s) => s.is_active).length}/${dto.slots.length} active`,
        masterKeys: mapMasterKeys(dto.master_keys, {
          pendingKeyId,
          onDetails: (id) => {
            setPendingKeyId(id);
            detailMutation.mutate(id);
          },
          onRotate: (id) => {
            if (window.confirm("Rotate this key now through the HSM backend?")) {
              setPendingKeyId(id);
              rotateMutation.mutate(id);
            }
          },
          onDisable: (id) => {
            if (window.confirm("Disable this key? This is not an archive operation.")) {
              setPendingKeyId(id);
              disableMutation.mutate(id);
            }
          },
        }),
        masterKeySummary: {
          active: dto.master_keys.filter((k) => k.effective_status === "active").length,
          expiring: dto.master_keys.filter((k) => k.effective_status === "expiring").length,
          retired: dto.master_keys.filter((k) => k.effective_status === "retired").length,
          pending: dto.master_keys.filter((k) => k.effective_status === "pending").length,
          policyNote: "rotation policy varies per key",
        },
        ceremonies: mapCeremonies(dto.ceremonies, {
          pendingCeremonyId,
          onApprove: (id) => {
            setPendingCeremonyId(id);
            approveMutation.mutate(id);
          },
          onComplete: (id) => {
            setPendingCeremonyId(id);
            completeMutation.mutate(id);
          },
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
            id: "status",
            label: "HSM Status",
            value: providerStatus.toUpperCase(),
            description: primaryProvider ? primaryProvider.name : "no provider reported",
            iconContent: "●",
            tone: statusTone,
            iconPulse: providerStatus === "online",
            borderHex: statusTone === "neon" ? "#00FFA3" : statusTone === "warn" ? "#FBBF24" : "#FF3B3B",
          },
          {
            id: "active-keys",
            label: "Active Keys",
            value: String(dto.master_keys.filter((k) => k.effective_status === "active").length),
            description: `${dto.master_keys.length} total`,
            iconContent: "KEY",
            tone: "neon" as const,
            borderHex: "#00FFA3",
          },
          {
            id: "key-ops",
            label: "Key Ops/s",
            value: Math.round(dto.slots.reduce((sum, slot) => sum + slot.ops_per_second, 0)).toLocaleString(),
            description: "from slot telemetry",
            iconContent: "OPS",
            tone: "info" as const,
            borderHex: "#60A4FA",
          },
          {
            id: "certificates",
            label: "Certificates",
            value: String(dto.certificates.length),
            description: `${dto.certificates.filter((c) => c.status !== "valid").length} attention`,
            iconContent: "CRT",
            tone: "purple" as const,
            borderHex: "#A78BFA",
          },
          {
            id: "next-rotation",
            label: "Next Rotation",
            value:
              dto.master_keys
                .filter((k) => k.days_until_rotation !== null)
                .map((k) => k.days_until_rotation as number)
                .sort((a, b) => a - b)[0] !== undefined
                ? `${Math.max(0, dto.master_keys
                    .filter((k) => k.days_until_rotation !== null)
                    .map((k) => k.days_until_rotation as number)
                    .sort((a, b) => a - b)[0])}d`
                : "—",
            description: "backend schedule",
            iconContent: "ROT",
            tone: "warn" as const,
            borderHex: "#FBBF24",
          },
          {
            id: "attestation",
            label: "Attestation",
            value: dto.latest_attestation ? (dto.latest_attestation.all_passed ? "PASS" : "FAIL") : "—",
            description: `${dto.latest_attestation?.pass_count ?? 0}/${dto.latest_attestation?.total_checks ?? 0} checks`,
            iconContent: "✓",
            tone: dto.latest_attestation?.all_passed ? ("neon" as const) : dto.latest_attestation ? ("danger" as const) : ("warn" as const),
            borderHex: dto.latest_attestation?.all_passed ? "#00FFA3" : dto.latest_attestation ? "#FF3B3B" : "#FBBF24",
          },
        ] satisfies HsmKpiCard[],
      }
    : undefined;

  return {
    data,
    isLoading: query.isLoading || providersQuery.isLoading,
    error: query.error as Error | null,
    actionError,
    refetch: query.refetch,
    onRefreshSlots: () => query.refetch(),
    onRunAttestation: () => attestMutation.mutate(),
    isRunningAttestation: attestMutation.isPending,
    onCreateKey: () => {
      const key_label = window.prompt("New key label");
      if (!key_label) return;
      const algorithm = window.prompt("Algorithm", "AES-256");
      if (!algorithm) return;
      const policy = window.prompt("Rotation policy days", "180");
      createKeyMutation.mutate({
        key_label,
        algorithm,
        rotation_policy_days: policy ? Number(policy) : 180,
      });
    },
    onRotateNow: () => {
      const candidate = dto?.master_keys.find((k) => k.effective_status === "expiring") ?? dto?.master_keys.find((k) => k.effective_status === "active");
      if (!candidate) {
        window.alert("No active or expiring key is available to rotate.");
        return;
      }
      if (window.confirm(`Rotate ${candidate.key_label} now?`)) {
        setPendingKeyId(candidate.id);
        rotateMutation.mutate(candidate.id);
      }
    },
    onInitiateCeremony: () => {
      const pendingKeys = dto?.master_keys.filter(
        (key) =>
          key.effective_status === "pending" &&
          !dto.ceremonies.some((ceremony) => ceremony.status === "pending" && ceremony.master_key_label === key.key_label),
      ) ?? [];
      if (pendingKeys.length === 0) {
        window.alert("No pending key is available for a new ceremony. Register a new key first.");
        return;
      }
      const selectedLabel =
        pendingKeys.length === 1
          ? pendingKeys[0].key_label
          : window.prompt(`Pending key label:\n${pendingKeys.map((key) => key.key_label).join("\n")}`, pendingKeys[0].key_label);
      const key = pendingKeys.find((item) => item.key_label === selectedLabel);
      if (!key) return;
      const approvals = Number(window.prompt("Required approvals", "5") ?? "5");
      const predecessor = dto?.master_keys.find((item) => item.effective_status === "active");
      initiateMutation.mutate({
        master_key_id: key.id,
        predecessor_key_id: predecessor?.id,
        required_approvals: approvals,
      });
    },
    onExportKeysCsv: () => {
      if (!dto) return;
      const rows = [
        ["id", "key_label", "algorithm", "status", "slot_label", "activated_at", "expires_at", "wraps_dek_count"],
        ...dto.master_keys.map((key) => [
          key.id,
          key.key_label,
          key.algorithm,
          key.effective_status,
          key.slot_label ?? "",
          key.activated_at ?? "",
          key.expires_at ?? "",
          key.wraps_dek_count,
        ]),
      ];
      downloadTextFile(
        `hsm-keys-${dto.module_serial}.csv`,
        rows.map((row) => row.map(csvValue).join(",")).join("\n"),
        "text/csv",
      );
    },
    onExportAttestation: () => {
      if (!dto?.latest_attestation) {
        window.alert("No attestation run is available to export.");
        return;
      }
      downloadTextFile(
        `hsm-attestation-${dto.latest_attestation.id}.json`,
        JSON.stringify(
          {
            note: "Client-side export of currently loaded attestation data; not a signed compliance report.",
            module_serial: dto.module_serial,
            latest_attestation: dto.latest_attestation,
            history: dto.attestation_history,
          },
          null,
          2,
        ),
        "application/json",
      );
    },
  };
}
