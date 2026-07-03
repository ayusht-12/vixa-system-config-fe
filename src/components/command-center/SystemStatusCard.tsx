import type { DependencyHealthDTO } from "../../api/types";
import { useSystemStatusViewModel } from "../../api/viewModels/systemStatus";
import { Badge } from "../ui/Badge";
import { PulseDot } from "../ui/PulseDot";
import { SectionCard } from "../ui/SectionCard";
import { StatTile } from "../ui/StatTile";

export function SystemStatusCard() {
  const vm = useSystemStatusViewModel();

  const alive = vm.liveness?.status === "alive";
  const ready = vm.readiness?.status === "ready";
  // The admin-only /dependencies probe is richer; fall back to the public
  // readiness dependencies (which still include the database) otherwise.
  const deps: DependencyHealthDTO[] =
    vm.dependencies?.dependencies ?? vm.readiness?.dependencies ?? [];

  return (
    <SectionCard>
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">System Status</h3>
        <div className="flex items-center gap-1.5 text-xs">
          <PulseDot color={alive ? "neon" : "danger"} pulse={!alive} />
          <span className={alive ? "text-neon" : "text-danger"}>{alive ? "LIVE" : "DOWN"}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Readiness</span>
          <Badge tone={ready ? "neon" : "danger"}>{ready ? "READY" : "NOT READY"}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Version">{vm.version?.version ?? "—"}</StatTile>
          <StatTile label="Environment">{vm.version?.environment ?? "—"}</StatTile>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Dependencies</div>
          {deps.length === 0 ? (
            <div className="text-xs text-gray-600">No dependency data available.</div>
          ) : (
            <div className="space-y-1.5">
              {deps.map((dep) => {
                const up = dep.status === "up";
                return (
                  <div key={dep.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <PulseDot color={up ? "neon" : "danger"} pulse={!up} />
                      <span className="text-gray-400">{dep.name}</span>
                    </div>
                    <span className={up ? "text-neon" : "text-danger"}>
                      {dep.status.toUpperCase()}
                      {dep.detail ? <span className="text-gray-600"> · {dep.detail}</span> : null}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
