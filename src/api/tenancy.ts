import { apiFetch } from "../lib/apiClient";
import type { PageDTO, ProvisioningJobDTO, TenancyOverviewDTO, TenantCreateDTO, TenantDTO } from "./types";

export function fetchTenancyOverview(): Promise<TenancyOverviewDTO> {
  return apiFetch<TenancyOverviewDTO>("/tenancy/overview");
}

export function dismissBreachAlert(alertId: string): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>(`/tenancy/breach-alerts/${alertId}/dismiss`, {
    method: "POST",
  });
}

export function advanceProvisioningJob(jobId: string): Promise<ProvisioningJobDTO> {
  return apiFetch<ProvisioningJobDTO>(`/tenancy/provisioning/${jobId}/advance`, {
    method: "POST",
  });
}

export function fetchTenants(pageSize = 50): Promise<PageDTO<TenantDTO>> {
  return apiFetch<PageDTO<TenantDTO>>(`/tenancy/tenants?page=1&page_size=${pageSize}`);
}

export function createTenant(payload: TenantCreateDTO): Promise<TenantDTO> {
  return apiFetch<TenantDTO>("/tenancy/tenants", { method: "POST", body: payload });
}

export function activateTenant(tenantId: string): Promise<TenantDTO> {
  return apiFetch<TenantDTO>(`/tenancy/tenants/${tenantId}/activate`, { method: "POST" });
}

export function deactivateTenant(tenantId: string): Promise<TenantDTO> {
  return apiFetch<TenantDTO>(`/tenancy/tenants/${tenantId}/deactivate`, { method: "POST" });
}

export function deleteTenant(tenantId: string): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>(`/tenancy/tenants/${tenantId}`, { method: "DELETE" });
}
