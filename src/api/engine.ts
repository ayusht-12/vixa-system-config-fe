import { apiFetch } from "../lib/apiClient";
import type { CommandCenterOverviewDTO } from "./types";

export function fetchCommandCenterOverview(): Promise<CommandCenterOverviewDTO> {
  return apiFetch<CommandCenterOverviewDTO>("/engine/overview");
}
