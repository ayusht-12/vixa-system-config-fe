import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchAuditLogEntries, fetchAuditLogSummary, verifyAuditLogChain } from "../auditLog";
import type {
  ActorEntry,
  AuditKpiCard,
  EntryDetail,
  EventTypeChip,
  HashChainStat,
  LogEntry,
  LogSeverity,
  TenantFilterChip,
} from "../../types/audit-log";
import type { AuditLogEntryDTO, ChainVerificationResultDTO } from "../types";

const DEFAULT_PAGE_SIZE = 25;
const EMPTY_ENTRIES: AuditLogEntryDTO[] = [];
const EVENT_TYPE_OPTIONS = [
  "STATE_CHANGE",
  "AUTH_EVENT",
  "CONFIG_CHANGE",
  "POLICY_EVAL",
  "TENANT_LIFECYCLE",
  "KEY_OPERATION",
  "ANOMALY_DETECTED",
];

function toLogSeverity(severity: string): LogSeverity {
  const upper = severity.toUpperCase();
  if (upper === "CRITICAL" || upper === "WARNING" || upper === "INFO") return upper;
  return "INFO";
}

function shortHash(hash: string | null): string {
  if (!hash) return "genesis";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function formatTimestamp(value: string): string {
  return new Date(value).toISOString().replace("T", " ").slice(0, 19);
}

function rowIntegrity(
  entry: AuditLogEntryDTO,
  verification: ChainVerificationResultDTO | null,
): LogEntry["integrity"] {
  if (!verification) return "unverified";
  if (verification.is_valid) return "verified";
  if (entry.sequence === verification.first_break_sequence) return "failed";
  return "warning";
}

function mapLogEntry(
  entry: AuditLogEntryDTO,
  verification: ChainVerificationResultDTO | null,
): LogEntry {
  return {
    id: entry.id,
    seq: String(entry.sequence),
    timestamp: formatTimestamp(entry.occurred_at),
    severity: toLogSeverity(entry.severity),
    eventType: entry.event_type.toUpperCase(),
    eventSubtype: entry.event_subtype,
    tenant: entry.tenant_slug ?? "-",
    tenantToneClass: entry.tenant_slug ? "text-purple-400" : "text-gray-600",
    description: entry.description,
    chainLabel: `${shortHash(entry.prev_hash)} -> ${shortHash(entry.entry_hash)}`,
    actor: entry.actor,
    actorMeta: entry.source_ip ?? "",
    integrity: rowIntegrity(entry, verification),
  };
}

function mapDetail(entry: AuditLogEntryDTO): EntryDetail {
  return {
    seq: String(entry.sequence),
    severity: entry.severity.toUpperCase(),
    timestamp: formatTimestamp(entry.occurred_at),
    eventType: `${entry.event_type.toUpperCase()} · ${entry.event_subtype}`,
    tenant: entry.tenant_slug ?? "-",
    actor: entry.actor,
    sourceIp: entry.source_ip ?? "-",
    description: entry.description,
    entryHash: entry.entry_hash,
    previousHash: entry.prev_hash ?? "genesis (first entry in chain)",
    signature: entry.signature,
  };
}

function buildChips<T extends { id: string; label: string; count: string }>(
  entries: AuditLogEntryDTO[],
  keyFn: (e: AuditLogEntryDTO) => string | null,
  build: (id: string, count: number) => T,
  allLabel: T,
): T[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyFn(entry);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const chips = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, count]) => build(key, count));
  return [{ ...allLabel, count: String(entries.length) }, ...chips];
}

function buildPresetRange(option: string): { fromTime?: string; toTime?: string } {
  const now = new Date();
  const from = new Date(now);
  const hoursByOption: Record<string, number> = {
    "1h": 1,
    "6h": 6,
    "24h": 24,
    "7d": 24 * 7,
    "30d": 24 * 30,
  };
  const hours = hoursByOption[option];
  if (!hours) return {};
  from.setHours(now.getHours() - hours);
  return { fromTime: from.toISOString(), toTime: now.toISOString() };
}

function toLocalInputValue(value?: string): string {
  if (!value) return "";
  return value.slice(0, 16);
}

function fromLocalInputValue(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function downloadText(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function exportRows(rows: AuditLogEntryDTO[], format: "json" | "csv"): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  if (format === "json") {
    downloadText(
      `audit-log-current-page-${timestamp}.json`,
      JSON.stringify(rows, null, 2),
      "application/json",
    );
    return;
  }

  const fields: Array<keyof AuditLogEntryDTO> = [
    "sequence",
    "occurred_at",
    "severity",
    "event_type",
    "event_subtype",
    "tenant_slug",
    "actor",
    "source_ip",
    "description",
    "prev_hash",
    "entry_hash",
    "signing_key_id",
    "integrity",
  ];
  const lines = [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => csvCell(row[field])).join(",")),
  ];
  downloadText(`audit-log-current-page-${timestamp}.csv`, lines.join("\n"), "text/csv");
}

export function useAuditLogViewModel() {
  const queryClient = useQueryClient();
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [tenantSlug, setTenantSlug] = useState<string | undefined>(undefined);
  const [actor, setActor] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [fromTime, setFromTime] = useState<string | undefined>(undefined);
  const [toTime, setToTime] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function resetToFirstPage() {
    setPage(1);
  }

  const entriesQuery = useQuery({
    queryKey: [
      "audit-log",
      "entries",
      { severity, eventType, tenantSlug, actor, search, fromTime, toTime, page, pageSize },
    ],
    queryFn: () =>
      fetchAuditLogEntries({
        severity,
        eventType,
        tenantSlug,
        actor,
        search,
        fromTime,
        toTime,
        page,
        pageSize,
      }),
  });
  const summaryQuery = useQuery({ queryKey: ["audit-log", "summary"], queryFn: fetchAuditLogSummary });

  const verifyMutation = useMutation({
    mutationFn: verifyAuditLogChain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-log", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log", "entries"] });
    },
  });

  const entries = entriesQuery.data?.items ?? EMPTY_ENTRIES;
  const total = entriesQuery.data?.total ?? 0;
  const responsePage = entriesQuery.data?.page ?? page;
  const responsePageSize = entriesQuery.data?.page_size ?? pageSize;
  const totalPages = Math.max(1, Math.ceil(total / responsePageSize));
  const summary = summaryQuery.data;
  const verification = verifyMutation.data ?? summary?.last_verification ?? null;

  useEffect(() => {
    if (entries.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !entries.some((entry) => entry.id === selectedId)) {
      setSelectedId(entries[0].id);
    }
  }, [entries, selectedId]);

  const logEntries = useMemo(
    () => entries.map((entry) => mapLogEntry(entry, verification)),
    [entries, verification],
  );

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? null;
  const selectedEntryDetail = selectedEntry ? mapDetail(selectedEntry) : null;

  const tenantFilters: TenantFilterChip[] = buildChips(
    entries,
    (e) => e.tenant_slug,
    (id, count) => ({ id, label: id, count: String(count), colorHex: "#A78BFA" }),
    { id: "all", label: "All Tenants", count: "0", colorHex: "#00FFA3" },
  );

  const eventTypeFilters: EventTypeChip[] = [
    { id: "all", label: "All Event Types", count: String(entries.length) },
    ...EVENT_TYPE_OPTIONS.map((id) => ({
      id: id.toLowerCase(),
      label: id,
      count: String(entries.filter((entry) => entry.event_type === id.toLowerCase()).length),
    })),
  ];

  const actorCounts = new Map<string, number>();
  for (const entry of entries) {
    actorCounts.set(entry.actor, (actorCounts.get(entry.actor) ?? 0) + 1);
  }
  const actors: ActorEntry[] = Array.from(actorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([actorLabel, count]) => ({
      id: actorLabel,
      label: actorLabel,
      count: String(count),
      avatarLetter: actorLabel.charAt(0).toUpperCase(),
      avatarBgClass: "bg-surface",
      avatarBorderClass: actor === actorLabel ? "border-neon" : "border-accent",
      avatarTextClass: "text-gray-300",
    }));

  const isVerifiedValid = verification?.is_valid === true;
  const hasVerification = verification !== null;
  const hashChainStats: HashChainStat[] = [
    {
      label: "Root Hash",
      line1: shortHash(summary?.root_hash ?? null),
      line2: `${summary?.total_entries ?? 0} entries`,
      statusIcon: isVerifiedValid ? "✓" : "!",
      statusLabel: isVerifiedValid ? "VALID" : hasVerification ? "FAILED" : "UNVERIFIED",
      statusTone: isVerifiedValid ? "neon" : hasVerification ? "danger" : "warn",
      highlighted: true,
    },
    {
      label: "Signing Key",
      line1: summary?.signing_key_id ?? "-",
      line2: "ECDSA P-384",
      statusIcon: summary?.signing_key_id ? "KEY" : "!",
      statusLabel: summary?.signing_key_id ? "CONFIGURED" : "MISSING",
      statusTone: summary?.signing_key_id ? "purple" : "warn",
    },
  ];

  const kpiCards: AuditKpiCard[] = [
    {
      id: "total",
      label: "Total Entries",
      value: (summary?.total_entries ?? 0).toLocaleString(),
      description: "append-only",
      iconContent: "LOG",
      tone: "neon",
    },
    {
      id: "verified",
      label: "Verified",
      value: verification ? verification.verified_count.toLocaleString() : "-",
      description: verification ? "explicit verify result" : "not yet verified",
      iconContent: "✓",
      tone: verification ? "neon" : "warn",
    },
    {
      id: "failed",
      label: "Failed",
      value: verification ? verification.failed_count.toLocaleString() : "-",
      description: verification?.first_break_sequence
        ? `first break: seq ${verification.first_break_sequence}`
        : verification
          ? "none"
          : "unknown",
      iconContent: "!",
      tone: verification && verification.failed_count > 0 ? "danger" : verification ? "neon" : "warn",
      highlighted: !!verification && verification.failed_count > 0,
    },
    {
      id: "last-verify",
      label: "Verify Duration",
      value: verification ? `${verification.duration_ms.toFixed(1)}ms` : "-",
      description: "full chain scan",
      iconContent: "MS",
      tone: "info",
    },
    {
      id: "signing-key",
      label: "Signing Key",
      value: summary?.signing_key_id?.split(":")[1] ?? "-",
      description: "ECDSA P-384",
      iconContent: "KEY",
      tone: "purple",
    },
  ];

  return {
    isLoading: entriesQuery.isLoading || summaryQuery.isLoading,
    error: (entriesQuery.error ?? summaryQuery.error) as Error | null,
    refetch: () => {
      entriesQuery.refetch();
      summaryQuery.refetch();
    },
    logEntries,
    rawEntries: entries,
    selectedId,
    setSelectedId,
    selectedEntryDetail,
    tenantFilters,
    eventTypeFilters,
    actors,
    hashChainStats,
    verification: verification
      ? {
          verified: verification.verified_count.toLocaleString(),
          failed: verification.failed_count.toLocaleString(),
          duration: `${verification.duration_ms.toFixed(1)}ms`,
          statusLabel: verification.is_valid ? "Verified by explicit scan" : "Verification failed",
        }
      : { verified: "-", failed: "-", duration: "-", statusLabel: "Not verified this session" },
    kpiCards,
    totalEntriesLabel: (summary?.total_entries ?? 0).toLocaleString(),
    rootHash: shortHash(summary?.root_hash ?? null),
    isValid: isVerifiedValid,
    hasVerification,
    activeSeverity: severity ?? "all",
    activeEventType: eventType ?? "all",
    activeTenant: tenantSlug ?? "all",
    actorFilter: actor ?? "",
    search: search ?? "",
    fromInput: toLocalInputValue(fromTime),
    toInput: toLocalInputValue(toTime),
    page: responsePage,
    pageSize: responsePageSize,
    total,
    totalPages,
    onSelectSeverity: (id: string) => {
      setSeverity(id === "all" ? undefined : id.toLowerCase());
      resetToFirstPage();
    },
    onSelectEventType: (id: string) => {
      setEventType(id === "all" ? undefined : id);
      resetToFirstPage();
    },
    onSelectTenant: (id: string) => {
      setTenantSlug(id === "all" ? undefined : id);
      resetToFirstPage();
    },
    onActorFilter: (value: string) => {
      setActor(value.trim() || undefined);
      resetToFirstPage();
    },
    onSearch: (next: { search?: string; severity?: string; eventType?: string }) => {
      setSearch(next.search?.trim() || undefined);
      setSeverity(next.severity && next.severity !== "all" ? next.severity : undefined);
      setEventType(next.eventType && next.eventType !== "all" ? next.eventType : undefined);
      resetToFirstPage();
    },
    onSelectTimePreset: (option: string) => {
      if (option === "Custom") return;
      const range = buildPresetRange(option);
      setFromTime(range.fromTime);
      setToTime(range.toTime);
      resetToFirstPage();
    },
    onApplyCustomTimeRange: (from: string, to: string) => {
      setFromTime(fromLocalInputValue(from));
      setToTime(fromLocalInputValue(to));
      resetToFirstPage();
    },
    onSetPage: (nextPage: number) => setPage(Math.min(Math.max(1, nextPage), totalPages)),
    onSetPageSize: (nextPageSize: number) => {
      setPageSize(nextPageSize);
      setPage(1);
    },
    onVerify: () => verifyMutation.mutate(),
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.error as Error | null,
    onExportCurrentPageJson: () => exportRows(entries, "json"),
    onExportCurrentPageCsv: () => exportRows(entries, "csv"),
    onExportSelectedJson: () => {
      if (selectedEntry) exportRows([selectedEntry], "json");
    },
    onExportSelectedCsv: () => {
      if (selectedEntry) exportRows([selectedEntry], "csv");
    },
  };
}
