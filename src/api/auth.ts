import { apiFetch } from "../lib/apiClient";
import type { ForgotPasswordResponseDTO, SessionDTO } from "./types";

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("/auth/change-password", {
    method: "POST",
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

export function forgotPassword(email: string): Promise<ForgotPasswordResponseDTO> {
  return apiFetch<ForgotPasswordResponseDTO>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("/auth/reset-password", {
    method: "POST",
    body: { token, new_password: newPassword },
  });
}

export function fetchSessions(): Promise<SessionDTO[]> {
  return apiFetch<SessionDTO[]>("/auth/sessions");
}
