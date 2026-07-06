import { apiFetch } from "../lib/apiClient";
import type { ConfigManagerOverviewDTO, ConfigParameterDTO, ConfigurationDTO } from "./types";

export function fetchConfigOverview(): Promise<ConfigManagerOverviewDTO> {
  return apiFetch<ConfigManagerOverviewDTO>("/config/overview");
}

export function stageConfigChange(
  parameterId: string,
  value: string,
  reason?: string,
): Promise<ConfigParameterDTO> {
  return apiFetch<ConfigParameterDTO>(`/config/parameters/${parameterId}`, {
    method: "PATCH",
    body: { value, reason },
  });
}

export function revertConfigChange(parameterId: string): Promise<ConfigParameterDTO> {
  return apiFetch<ConfigParameterDTO>(`/config/parameters/${parameterId}/revert`, {
    method: "POST",
  });
}

export function applyPendingConfigChanges(): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("/config/apply", { method: "POST" });
}

// --- versioned configuration documents ---

export function fetchConfigurations(): Promise<ConfigurationDTO[]> {
  return apiFetch<ConfigurationDTO[]>("/config/configurations");
}

export function activateConfiguration(id: string): Promise<ConfigurationDTO> {
  return apiFetch<ConfigurationDTO>(`/config/configurations/${id}/activate`, { method: "POST" });
}

export function archiveConfiguration(id: string): Promise<ConfigurationDTO> {
  return apiFetch<ConfigurationDTO>(`/config/configurations/${id}/archive`, { method: "POST" });
}

export function rollbackConfiguration(id: string): Promise<ConfigurationDTO> {
  return apiFetch<ConfigurationDTO>(`/config/configurations/${id}/rollback`, { method: "POST" });
}
