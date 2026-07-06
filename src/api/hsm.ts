import { apiFetch } from "../lib/apiClient";
import type {
  AttestationRunDTO,
  HsmOverviewDTO,
  KeyCeremonyCreateDTO,
  KeyCeremonyDTO,
  MasterKeyCreateDTO,
  MasterKeyDTO,
  MasterKeyRotateRequestDTO,
  SecurityProviderDTO,
} from "./types";

export function fetchHsmOverview(): Promise<HsmOverviewDTO> {
  return apiFetch<HsmOverviewDTO>("/hsm/overview");
}

export function fetchHsmProviders(): Promise<SecurityProviderDTO[]> {
  return apiFetch<SecurityProviderDTO[]>("/hsm/providers");
}

export function fetchHsmKey(keyId: string): Promise<MasterKeyDTO> {
  return apiFetch<MasterKeyDTO>(`/hsm/keys/${keyId}`);
}

export function createHsmKey(payload: MasterKeyCreateDTO): Promise<MasterKeyDTO> {
  return apiFetch<MasterKeyDTO>("/hsm/keys", { method: "POST", body: payload });
}

export function rotateHsmKey(keyId: string, payload?: MasterKeyRotateRequestDTO): Promise<MasterKeyDTO> {
  return apiFetch<MasterKeyDTO>(`/hsm/keys/${keyId}/rotate`, { method: "POST", body: payload });
}

export function disableHsmKey(keyId: string): Promise<MasterKeyDTO> {
  return apiFetch<MasterKeyDTO>(`/hsm/keys/${keyId}/disable`, { method: "POST" });
}

export function initiateKeyCeremony(payload: KeyCeremonyCreateDTO): Promise<KeyCeremonyDTO> {
  return apiFetch<KeyCeremonyDTO>("/hsm/ceremonies", { method: "POST", body: payload });
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
