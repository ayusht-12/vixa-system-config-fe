import { useQuery } from "@tanstack/react-query";
import {
  fetchApplicationErrors,
  fetchBackgroundJobs,
  fetchCacheStatus,
  fetchDbStatus,
  fetchEventPublisherStatus,
  fetchMetricsSummary,
  fetchMigrationStatus,
  fetchOperationalReadiness,
} from "../operations";

// The whole operations surface is admin-only server-side; the page is only
// reachable by admins, so the queries run unconditionally here.
export function useOperationsViewModel() {
  const metrics = useQuery({
    queryKey: ["operations", "metrics"],
    queryFn: fetchMetricsSummary,
    refetchInterval: 30_000,
  });
  const jobs = useQuery({
    queryKey: ["operations", "jobs"],
    queryFn: fetchBackgroundJobs,
    refetchInterval: 30_000,
  });
  const errors = useQuery({
    queryKey: ["operations", "errors"],
    queryFn: fetchApplicationErrors,
    refetchInterval: 30_000,
  });
  const cache = useQuery({ queryKey: ["operations", "cache"], queryFn: fetchCacheStatus });
  const db = useQuery({
    queryKey: ["operations", "db"],
    queryFn: fetchDbStatus,
    refetchInterval: 30_000,
  });
  const migrations = useQuery({
    queryKey: ["operations", "migrations"],
    queryFn: fetchMigrationStatus,
  });
  const events = useQuery({
    queryKey: ["operations", "events"],
    queryFn: fetchEventPublisherStatus,
    refetchInterval: 30_000,
  });
  const readiness = useQuery({
    queryKey: ["operations", "readiness"],
    queryFn: fetchOperationalReadiness,
    refetchInterval: 30_000,
  });

  return {
    metrics: metrics.data ?? null,
    jobs: jobs.data ?? [],
    errors: errors.data ?? [],
    cache: cache.data ?? null,
    db: db.data ?? null,
    migrations: migrations.data ?? null,
    events: events.data ?? null,
    readiness: readiness.data ?? null,
    isLoading: metrics.isLoading || db.isLoading || readiness.isLoading,
    error: (metrics.error ?? db.error ?? readiness.error) as Error | null,
    refetch: () => {
      void metrics.refetch();
      void jobs.refetch();
      void errors.refetch();
      void cache.refetch();
      void db.refetch();
      void migrations.refetch();
      void events.refetch();
      void readiness.refetch();
    },
  };
}
