import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateRbacUser,
  deactivateRbacUser,
  fetchRbacPermissions,
  fetchRbacRoles,
  fetchRbacUsers,
} from "../rbac";

export function useAccessControlViewModel() {
  const queryClient = useQueryClient();

  const users = useQuery({ queryKey: ["rbac", "users"], queryFn: fetchRbacUsers });
  const roles = useQuery({ queryKey: ["rbac", "roles"], queryFn: fetchRbacRoles });
  const permissions = useQuery({
    queryKey: ["rbac", "permissions"],
    queryFn: fetchRbacPermissions,
  });

  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: ["rbac", "users"] });

  return {
    users: users.data ?? [],
    roles: roles.data ?? [],
    permissions: permissions.data ?? [],
    isLoading: users.isLoading || roles.isLoading || permissions.isLoading,
    error: (users.error ?? roles.error ?? permissions.error) as Error | null,
    refetch: () => {
      void users.refetch();
      void roles.refetch();
      void permissions.refetch();
    },
    activateUser: (userId: string) => activateRbacUser(userId).then(invalidateUsers),
    deactivateUser: (userId: string) => deactivateRbacUser(userId).then(invalidateUsers),
  };
}
