import { apiFetch } from "../lib/apiClient";
import type { ConfigManagerOverviewDTO, ConfigParameterDTO } from "./types";

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
