import { apiFetch } from "../lib/apiClient";
import type {
  AuditLogEntryDTO,
  DashboardSummaryDTO,
  EventTrendsDTO,
  PageDTO,
  TenantHealthListDTO,
} from "./types";

export function fetchDashboardSummary(): Promise<DashboardSummaryDTO> {
  return apiFetch<DashboardSummaryDTO>("/dashboard/summary");
}

export function fetchDashboardActivity(pageSize = 10): Promise<PageDTO<AuditLogEntryDTO>> {
  return apiFetch<PageDTO<AuditLogEntryDTO>>(
    `/dashboard/activity?page=1&page_size=${pageSize}`,
  );
}

export function fetchTenantHealth(): Promise<TenantHealthListDTO> {
  return apiFetch<TenantHealthListDTO>("/dashboard/tenant-health");
}

export function fetchEventTrends(interval: "hour" | "day" = "day"): Promise<EventTrendsDTO> {
  return apiFetch<EventTrendsDTO>(`/dashboard/event-trends?interval=${interval}`);
}
