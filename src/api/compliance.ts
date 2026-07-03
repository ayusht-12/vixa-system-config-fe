import { apiFetch } from "../lib/apiClient";
import type {
  ComplianceAssessmentCreateDTO,
  ComplianceAssessmentDTO,
  ComplianceControlDTO,
  ComplianceGapDTO,
  ComplianceOverviewDTO,
  ComplianceSummaryDTO,
  FrameworkDTO,
  ScoreTrendsResponseDTO,
} from "./types";

export function fetchComplianceOverview(): Promise<ComplianceOverviewDTO> {
  return apiFetch<ComplianceOverviewDTO>("/compliance/overview");
}

export function fetchFrameworks(): Promise<FrameworkDTO[]> {
  return apiFetch<FrameworkDTO[]>("/compliance/frameworks");
}

export function fetchFramework(id: string): Promise<FrameworkDTO> {
  return apiFetch<FrameworkDTO>(`/compliance/frameworks/${id}`);
}

export function fetchControls(params?: {
  framework?: string;
  status?: string;
}): Promise<ComplianceControlDTO[]> {
  const query = new URLSearchParams();
  if (params?.framework) query.set("framework", params.framework);
  if (params?.status) query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<ComplianceControlDTO[]>(`/compliance/controls${suffix}`);
}

export function fetchControl(id: string): Promise<ComplianceControlDTO> {
  return apiFetch<ComplianceControlDTO>(`/compliance/controls/${id}`);
}

export function fetchAssessments(): Promise<ComplianceAssessmentDTO[]> {
  return apiFetch<ComplianceAssessmentDTO[]>("/compliance/assessments");
}

export function fetchAssessment(id: string): Promise<ComplianceAssessmentDTO> {
  return apiFetch<ComplianceAssessmentDTO>(`/compliance/assessments/${id}`);
}

export function startAssessment(
  payload: ComplianceAssessmentCreateDTO,
): Promise<ComplianceAssessmentDTO> {
  return apiFetch<ComplianceAssessmentDTO>("/compliance/assessments", {
    method: "POST",
    body: payload,
  });
}

export function completeAssessment(id: string): Promise<ComplianceAssessmentDTO> {
  return apiFetch<ComplianceAssessmentDTO>(`/compliance/assessments/${id}/complete`, {
    method: "POST",
  });
}

export function fetchComplianceSummary(): Promise<ComplianceSummaryDTO> {
  return apiFetch<ComplianceSummaryDTO>("/compliance/summary");
}

export function fetchComplianceGaps(): Promise<ComplianceGapDTO[]> {
  return apiFetch<ComplianceGapDTO[]>("/compliance/gaps");
}

export function fetchScoreTrends(windowDays = 30): Promise<ScoreTrendsResponseDTO> {
  return apiFetch<ScoreTrendsResponseDTO>(
    `/compliance/score-trends?window_days=${windowDays}`,
  );
}
