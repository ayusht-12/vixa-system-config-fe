import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";
import {
  fetchAlertRules,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../notifications";

export function useNotificationsViewModel() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_admin);

  const notifications = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => fetchNotifications(false),
    refetchInterval: 60_000,
  });
  const unread = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 60_000,
  });
  // Alert rules are an admin-only surface; skip the query for non-admins to
  // avoid a guaranteed 403.
  const alertRules = useQuery({
    queryKey: ["notifications", "alert-rules"],
    queryFn: fetchAlertRules,
    enabled: isAdmin,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    void queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
  };

  return {
    isAdmin,
    notifications: notifications.data ?? [],
    unread: unread.data ?? null,
    alertRules: alertRules.data ?? [],
    isLoading: notifications.isLoading || unread.isLoading,
    error: (notifications.error ?? unread.error) as Error | null,
    refetch: () => {
      void notifications.refetch();
      void unread.refetch();
      if (isAdmin) void alertRules.refetch();
    },
    markRead: (id: string) => markNotificationRead(id).then(invalidate),
    markAllRead: () => markAllNotificationsRead().then(invalidate),
  };
}
