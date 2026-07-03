import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth";
import { fetchDependencies, fetchLiveness, fetchReadiness, fetchVersion } from "../system";

// Surfaces the /system/* probes for a status widget. The /dependencies probe
// is admin-only, so it is only enabled for admins to avoid a guaranteed 401.
export function useSystemStatusViewModel() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.is_admin);

  const liveness = useQuery({
    queryKey: ["system", "live"],
    queryFn: fetchLiveness,
    refetchInterval: 30_000,
  });
  const readiness = useQuery({
    queryKey: ["system", "ready"],
    queryFn: fetchReadiness,
    refetchInterval: 30_000,
  });
  const version = useQuery({ queryKey: ["system", "version"], queryFn: fetchVersion });
  const dependencies = useQuery({
    queryKey: ["system", "dependencies"],
    queryFn: fetchDependencies,
    enabled: isAdmin,
    refetchInterval: 30_000,
  });

  return {
    isAdmin,
    liveness: liveness.data ?? null,
    readiness: readiness.data ?? null,
    version: version.data ?? null,
    dependencies: dependencies.data ?? null,
    isLoading: liveness.isLoading || readiness.isLoading || version.isLoading,
    error: (liveness.error ?? readiness.error ?? version.error) as Error | null,
    refetch: () => {
      void liveness.refetch();
      void readiness.refetch();
      void version.refetch();
      if (isAdmin) void dependencies.refetch();
    },
  };
}
