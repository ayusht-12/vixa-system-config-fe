import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
import type { AuditLogEntryDTO } from "../types";

function toLogSeverity(severity: string): LogSeverity {
  const upper = severity.toUpperCase();
  if (upper === "CRITICAL" || upper === "WARNING" || upper === "INFO") return upper;
  return "INFO";
}

function shortHash(hash: string | null): string {
  if (!hash) return "genesis";
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function mapLogEntry(entry: AuditLogEntryDTO): LogEntry {
  return {
    id: entry.id,
    seq: String(entry.sequence),
    timestamp: new Date(entry.occurred_at).toISOString().replace("T", " ").slice(0, 19),
    severity: toLogSeverity(entry.severity),
    eventType: entry.event_type.toUpperCase(),
    eventSubtype: entry.event_subtype,
    tenant: entry.tenant_slug ?? "—",
    tenantToneClass: entry.tenant_slug ? "text-purple-400" : "text-gray-600",
    description: entry.description,
    chainLabel: `${shortHash(entry.prev_hash)} → ${shortHash(entry.entry_hash)}`,
    actor: entry.actor,
    actorMeta: entry.source_ip ?? "",
    integrity: "verified",
  };
}

function mapDetail(entry: AuditLogEntryDTO): EntryDetail {
  return {
    seq: String(entry.sequence),
    severity: entry.severity.toUpperCase(),
    timestamp: new Date(entry.occurred_at).toISOString().replace("T", " ").slice(0, 19),
    eventType: `${entry.event_type.toUpperCase()} · ${entry.event_subtype}`,
    tenant: entry.tenant_slug ?? "—",
    actor: entry.actor,
    sourceIp: entry.source_ip ?? "—",
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

export function useAuditLogViewModel() {
  const queryClient = useQueryClient();
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [tenantSlug, setTenantSlug] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entriesQuery = useQuery({
    queryKey: ["audit-log", "entries", { severity, eventType, tenantSlug }],
    queryFn: () => fetchAuditLogEntries({ severity, eventType, tenantSlug, page: 1, pageSize: 100 }),
  });
  const summaryQuery = useQuery({ queryKey: ["audit-log", "summary"], queryFn: fetchAuditLogSummary });

  const verifyMutation = useMutation({
    mutationFn: verifyAuditLogChain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-log", "summary"] });
    },
  });

  const entries = entriesQuery.data?.items ?? [];
  const summary = summaryQuery.data;

  const logEntries = useMemo(() => entries.map(mapLogEntry), [entries]);

  const selectedEntry = entries.find((e) => e.id === selectedId) ?? entries[0];
  const selectedEntryDetail = selectedEntry ? mapDetail(selectedEntry) : null;

  const tenantFilters: TenantFilterChip[] = buildChips(
    entries,
    (e) => e.tenant_slug,
    (id, count) => ({ id, label: id, count: String(count), colorHex: "#A78BFA" }),
    { id: "all", label: "All Tenants", count: "0", colorHex: "#00FFA3" },
  );

  const eventTypeFilters: EventTypeChip[] = buildChips(
    entries,
    (e) => e.event_type,
    (id, count) => ({ id, label: id.toUpperCase(), count: String(count) }),
    { id: "all", label: "All Event Types", count: "0" },
  );

  const actorCounts = new Map<string, number>();
  for (const entry of entries) {
    actorCounts.set(entry.actor, (actorCounts.get(entry.actor) ?? 0) + 1);
  }
  const actors: ActorEntry[] = Array.from(actorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([actor, count]) => ({
      id: actor,
      label: actor,
      count: String(count),
      avatarLetter: actor.charAt(0).toUpperCase(),
      avatarBgClass: "bg-surface",
      avatarBorderClass: "border-accent",
      avatarTextClass: "text-gray-300",
    }));

  const verification = summary?.last_verification;
  const hashChainStats: HashChainStat[] = [
    {
      label: "Root Hash",
      line1: shortHash(summary?.root_hash ?? null),
      line2: `${summary?.total_entries ?? 0} entries`,
      statusIcon: "✓",
      statusLabel: verification?.is_valid ? "VALID" : "UNVERIFIED",
      statusTone: verification?.is_valid ? "neon" : "warn",
      highlighted: true,
    },
    {
      label: "Signing Key",
      line1: summary?.signing_key_id ?? "—",
      line2: "ECDSA P-384",
      statusIcon: "🔑",
      statusLabel: "ACTIVE",
      statusTone: "purple",
    },
  ];

  const kpiCards: AuditKpiCard[] = [
    {
      id: "total",
      label: "Total Entries",
      value: (summary?.total_entries ?? 0).toLocaleString(),
      description: "append-only",
      iconContent: "📋",
      tone: "neon",
    },
    {
      id: "verified",
      label: "Verified",
      value: (verification?.verified_count ?? 0).toLocaleString(),
      description: "hash + signature",
      iconContent: "✓",
      tone: "neon",
    },
    {
      id: "failed",
      label: "Failed",
      value: (verification?.failed_count ?? 0).toLocaleString(),
      description: verification?.first_break_sequence
        ? `first break: seq ${verification.first_break_sequence}`
        : "none",
      iconContent: "✗",
      tone: verification && verification.failed_count > 0 ? "danger" : "neon",
      highlighted: !!verification && verification.failed_count > 0,
    },
    {
      id: "last-verify",
      label: "Last Verify Duration",
      value: `${verification?.duration_ms.toFixed(1) ?? "—"}ms`,
      description: "full chain scan",
      iconContent: "⏱",
      tone: "info",
    },
    {
      id: "signing-key",
      label: "Signing Key",
      value: summary?.signing_key_id?.split(":")[1] ?? "—",
      description: "ECDSA P-384",
      iconContent: "🔐",
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
    selectedId: selectedEntry?.id ?? null,
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
        }
      : { verified: "—", failed: "—", duration: "—" },
    kpiCards,
    totalEntriesLabel: (summary?.total_entries ?? 0).toLocaleString(),
    rootHash: shortHash(summary?.root_hash ?? null),
    isValid: verification?.is_valid ?? true,
    onSelectSeverity: (id: string) => setSeverity(id === "all" ? undefined : id),
    onSelectEventType: (id: string) => setEventType(id === "all" ? undefined : id),
    onSelectTenant: (id: string) => setTenantSlug(id === "all" ? undefined : id),
    onVerify: () => verifyMutation.mutate(),
    isVerifying: verifyMutation.isPending,
  };
}
