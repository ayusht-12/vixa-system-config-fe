import { apiFetch } from "../lib/apiClient";
import type { AuditLogEntriesPageDTO, ChainVerificationResultDTO, HashChainSummaryDTO } from "./types";

export interface AuditLogEntriesQuery {
  severity?: string;
  eventType?: string;
  tenantSlug?: string;
  actor?: string;
  search?: string;
  fromTime?: string;
  toTime?: string;
  page?: number;
  pageSize?: number;
}

export function fetchAuditLogEntries(
  query: AuditLogEntriesQuery = {},
): Promise<AuditLogEntriesPageDTO> {
  const params = new URLSearchParams();
  if (query.severity) params.set("severity", query.severity);
  if (query.eventType) params.set("event_type", query.eventType);
  if (query.tenantSlug) params.set("tenant_slug", query.tenantSlug);
  if (query.actor) params.set("actor", query.actor);
  if (query.search) params.set("search", query.search);
  if (query.fromTime) params.set("from_time", query.fromTime);
  if (query.toTime) params.set("to_time", query.toTime);
  params.set("page", String(query.page ?? 1));
  params.set("page_size", String(query.pageSize ?? 50));

  return apiFetch<AuditLogEntriesPageDTO>(`/audit-log/entries?${params.toString()}`);
}

export function fetchAuditLogSummary(): Promise<HashChainSummaryDTO> {
  return apiFetch<HashChainSummaryDTO>("/audit-log/summary");
}

export function verifyAuditLogChain(): Promise<ChainVerificationResultDTO> {
  return apiFetch<ChainVerificationResultDTO>("/audit-log/verify", { method: "POST" });
}
