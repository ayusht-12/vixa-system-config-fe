import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyPendingConfigChanges,
  fetchConfigOverview,
  revertConfigChange,
  stageConfigChange,
} from "../config";

export function useConfigManagerViewModel() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["config", "overview"], queryFn: fetchConfigOverview });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["config", "overview"] });
  }

  const stageMutation = useMutation({
    mutationFn: ({ parameterId, value }: { parameterId: string; value: string }) =>
      stageConfigChange(parameterId, value),
    onSuccess: invalidate,
  });

  const revertMutation = useMutation({
    mutationFn: (parameterId: string) => revertConfigChange(parameterId),
    onSuccess: invalidate,
  });

  const applyMutation = useMutation({
    mutationFn: () => applyPendingConfigChanges(),
    onSuccess: invalidate,
  });

  return {
    overview: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
    stageChange: (parameterId: string, value: string) => stageMutation.mutate({ parameterId, value }),
    revertChange: (parameterId: string) => revertMutation.mutate(parameterId),
    applyAll: () => applyMutation.mutate(),
    isMutating: stageMutation.isPending || revertMutation.isPending || applyMutation.isPending,
  };
}
