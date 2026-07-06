import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateConfiguration,
  archiveConfiguration,
  fetchConfigurations,
  rollbackConfiguration,
} from "../config";
import type { ConfigurationDTO } from "../types";

export interface ConfigurationGroup {
  name: string;
  activeVersion: number | null;
  latestVersion: number;
  versions: ConfigurationDTO[];
}

function groupByName(configs: ConfigurationDTO[]): ConfigurationGroup[] {
  const byName = new Map<string, ConfigurationDTO[]>();
  for (const config of configs) {
    const list = byName.get(config.name) ?? [];
    list.push(config);
    byName.set(config.name, list);
  }
  const groups: ConfigurationGroup[] = [];
  for (const [name, versions] of byName) {
    const sorted = [...versions].sort((a, b) => b.version - a.version);
    const active = sorted.find((v) => v.status === "active") ?? null;
    groups.push({
      name,
      activeVersion: active?.version ?? null,
      latestVersion: sorted[0]?.version ?? 0,
      versions: sorted,
    });
  }
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

export function useConfigurationVersionsViewModel() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["config", "configurations"],
    queryFn: fetchConfigurations,
  });

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["config", "configurations"] });
  }

  const activate = useMutation({ mutationFn: activateConfiguration, onSuccess: invalidate });
  const archive = useMutation({ mutationFn: archiveConfiguration, onSuccess: invalidate });
  const rollback = useMutation({ mutationFn: rollbackConfiguration, onSuccess: invalidate });

  return {
    groups: groupByName(query.data ?? []),
    isLoading: query.isLoading,
    error: query.error as Error | null,
    activate: (id: string) => activate.mutateAsync(id),
    archive: (id: string) => archive.mutateAsync(id),
    rollback: (id: string) => rollback.mutateAsync(id),
    isMutating: activate.isPending || archive.isPending || rollback.isPending,
  };
}
