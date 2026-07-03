import { useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, fetchSessions } from "../auth";

export function useAccountViewModel() {
  const queryClient = useQueryClient();
  const sessions = useQuery({ queryKey: ["account", "sessions"], queryFn: fetchSessions });

  return {
    sessions: sessions.data ?? [],
    isLoading: sessions.isLoading,
    error: sessions.error as Error | null,
    refetchSessions: sessions.refetch,
    // Changing the password revokes all of the user's refresh tokens on the
    // server, so active sessions become unusable once their access token
    // expires — refresh the list afterwards to reflect that.
    changePassword: (current: string, next: string) =>
      changePassword(current, next).then(() =>
        queryClient.invalidateQueries({ queryKey: ["account", "sessions"] }),
      ),
  };
}
