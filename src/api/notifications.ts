import { apiFetch } from "../lib/apiClient";
import type {
  AlertRuleDTO,
  MarkAllReadDTO,
  NotificationDTO,
  UnreadCountDTO,
} from "./types";

export function fetchNotifications(unreadOnly = false): Promise<NotificationDTO[]> {
  const query = unreadOnly ? "?unread_only=true" : "";
  return apiFetch<NotificationDTO[]>(`/notifications${query}`);
}

export function fetchUnreadCount(): Promise<UnreadCountDTO> {
  return apiFetch<UnreadCountDTO>("/notifications/unread-count");
}

export function markNotificationRead(notificationId: string): Promise<NotificationDTO> {
  return apiFetch<NotificationDTO>(`/notifications/${notificationId}/read`, { method: "POST" });
}

export function markAllNotificationsRead(): Promise<MarkAllReadDTO> {
  return apiFetch<MarkAllReadDTO>("/notifications/read-all", { method: "POST" });
}

export function fetchAlertRules(): Promise<AlertRuleDTO[]> {
  return apiFetch<AlertRuleDTO[]>("/alert-rules");
}
