import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTenantMember,
  fetchTenantMembers,
  fetchTenantUsage,
  removeTenantMember,
} from "../tenancy";
import type { TenantMemberCreateDTO } from "../types";

export function useTenantMembersViewModel(tenantId: string | null) {
  const queryClient = useQueryClient();
  const enabled = Boolean(tenantId);

  const members = useQuery({
    queryKey: ["tenancy", "members", tenantId],
    queryFn: () => fetchTenantMembers(tenantId as string),
    enabled,
  });
  const usage = useQuery({
    queryKey: ["tenancy", "usage", tenantId],
    queryFn: () => fetchTenantUsage(tenantId as string),
    enabled,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["tenancy", "members", tenantId] });
    queryClient.invalidateQueries({ queryKey: ["tenancy", "usage", tenantId] });
  }

  return {
    members: members.data ?? [],
    usage: usage.data ?? null,
    isLoading: members.isLoading || usage.isLoading,
    error: (members.error ?? usage.error) as Error | null,
    addMember: (payload: TenantMemberCreateDTO) =>
      addTenantMember(tenantId as string, payload).then(invalidate),
    removeMember: (userId: string) =>
      removeTenantMember(tenantId as string, userId).then(invalidate),
    refetch: () => {
      void members.refetch();
      void usage.refetch();
    },
  };
}
