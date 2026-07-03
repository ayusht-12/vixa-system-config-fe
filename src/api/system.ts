import { API_BASE_URL, ApiError, apiFetch, getStoredToken } from "../lib/apiClient";
import type { DependenciesDTO, LivenessDTO, ReadinessDTO, VersionDTO } from "./types";

// /system/ready and /system/dependencies return HTTP 503 (with a full JSON
// body) when a dependency is down — that "degraded" body is exactly what we
// want to render, not treat as a thrown error. So these two are fetched with a
// helper that accepts 200 and 503 alike, while still surfacing real failures.
async function fetchAllowingUnavailable<T>(path: string): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (response.status === 200 || response.status === 503) {
    return (await response.json()) as T;
  }
  const detail = await response.json().catch(() => null);
  throw new ApiError(
    response.status,
    (detail?.detail as string | undefined) ?? response.statusText,
  );
}

export function fetchLiveness(): Promise<LivenessDTO> {
  return apiFetch<LivenessDTO>("/system/live");
}

export function fetchReadiness(): Promise<ReadinessDTO> {
  return fetchAllowingUnavailable<ReadinessDTO>("/system/ready");
}

export function fetchVersion(): Promise<VersionDTO> {
  return apiFetch<VersionDTO>("/system/version");
}

export function fetchDependencies(): Promise<DependenciesDTO> {
  return fetchAllowingUnavailable<DependenciesDTO>("/system/dependencies");
}
