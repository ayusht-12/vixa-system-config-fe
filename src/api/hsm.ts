import { apiFetch } from "../lib/apiClient";
import type {
  AttestationRunDTO,
  HsmOverviewDTO,
  KeyCeremonyDTO,
  SecurityProviderDTO,
} from "./types";

export function fetchHsmOverview(): Promise<HsmOverviewDTO> {
  return apiFetch<HsmOverviewDTO>("/hsm/overview");
}

export function fetchHsmProviders(): Promise<SecurityProviderDTO[]> {
  return apiFetch<SecurityProviderDTO[]>("/hsm/providers");
}

export function approveKeyCeremony(ceremonyId: string): Promise<KeyCeremonyDTO> {
  return apiFetch<KeyCeremonyDTO>(`/hsm/ceremonies/${ceremonyId}/approve`, { method: "POST" });
}

export function completeKeyCeremony(ceremonyId: string): Promise<KeyCeremonyDTO> {
  return apiFetch<KeyCeremonyDTO>(`/hsm/ceremonies/${ceremonyId}/complete`, { method: "POST" });
}

export function runHsmAttestation(): Promise<AttestationRunDTO> {
  return apiFetch<AttestationRunDTO>("/hsm/attestation/run", { method: "POST" });
}
