import { apiFetch } from "../lib/apiClient";
import type { ComplianceOverviewDTO } from "./types";

export function fetchComplianceOverview(): Promise<ComplianceOverviewDTO> {
  return apiFetch<ComplianceOverviewDTO>("/compliance/overview");
}
