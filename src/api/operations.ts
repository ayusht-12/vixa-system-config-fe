import { apiFetch } from "../lib/apiClient";
import type {
  ApplicationErrorDTO,
  BackgroundJobDTO,
  CacheStatusDTO,
  DbStatusDTO,
  EventPublisherStatusDTO,
  MetricsSummaryDTO,
  MigrationStatusDTO,
  OperationalReadinessDTO,
} from "./types";

export function fetchMetricsSummary(): Promise<MetricsSummaryDTO> {
  return apiFetch<MetricsSummaryDTO>("/operations/metrics-summary");
}

export function fetchApplicationErrors(): Promise<ApplicationErrorDTO[]> {
  return apiFetch<ApplicationErrorDTO[]>("/operations/errors");
}

export function fetchBackgroundJobs(): Promise<BackgroundJobDTO[]> {
  return apiFetch<BackgroundJobDTO[]>("/operations/jobs");
}

export function fetchCacheStatus(): Promise<CacheStatusDTO> {
  return apiFetch<CacheStatusDTO>("/operations/cache-status");
}

export function fetchDbStatus(): Promise<DbStatusDTO> {
  return apiFetch<DbStatusDTO>("/operations/db-status");
}

export function fetchMigrationStatus(): Promise<MigrationStatusDTO> {
  return apiFetch<MigrationStatusDTO>("/operations/migrations");
}

export function fetchEventPublisherStatus(): Promise<EventPublisherStatusDTO> {
  return apiFetch<EventPublisherStatusDTO>("/operations/events");
}

export function fetchOperationalReadiness(): Promise<OperationalReadinessDTO> {
  return apiFetch<OperationalReadinessDTO>("/operations/readiness");
}
