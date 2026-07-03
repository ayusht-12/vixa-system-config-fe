import { apiFetch } from "../lib/apiClient";
import type { AnomalyDetectionOverviewDTO, AnomalyEventDTO } from "./types";

export function fetchAnomalyOverview(): Promise<AnomalyDetectionOverviewDTO> {
  return apiFetch<AnomalyDetectionOverviewDTO>("/anomalies/overview");
}

export function acknowledgeAnomalyEvent(eventId: string): Promise<AnomalyEventDTO> {
  return apiFetch<AnomalyEventDTO>(`/anomalies/events/${eventId}/acknowledge`, {
    method: "POST",
  });
}

export function resolveAnomalyEvent(eventId: string): Promise<AnomalyEventDTO> {
  return apiFetch<AnomalyEventDTO>(`/anomalies/events/${eventId}/resolve`, { method: "POST" });
}

export function dismissAnomalyEvent(eventId: string): Promise<AnomalyEventDTO> {
  return apiFetch<AnomalyEventDTO>(`/anomalies/events/${eventId}/dismiss`, { method: "POST" });
}

export function reopenAnomalyEvent(eventId: string): Promise<AnomalyEventDTO> {
  return apiFetch<AnomalyEventDTO>(`/anomalies/events/${eventId}/reopen`, { method: "POST" });
}
