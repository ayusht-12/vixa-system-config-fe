import { Link } from "react-router-dom";
import type { TenantHealthRow } from "../../types/dashboard";
import { ROUTES } from "../../routes/routes";
import { Badge } from "../ui/Badge";
import { SectionCard } from "../ui/SectionCard";
import { toBadgeTone } from "./tone";

export function TenantHealthTable({ rows }: { rows: TenantHealthRow[] }) {
  return (
    <SectionCard className="lg:col-span-3 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">Tenant Health</h3>
          <div className="text-xs text-gray-600">Isolation posture + recent activity per tenant</div>
        </div>
        <Link to={ROUTES.tenancy.path} className="text-xs text-neon hover:underline">
          Manage →
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-thin max-h-72 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-subtle">
              <th className="text-left text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">Tenant</th>
              <th className="text-center text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">Status</th>
              <th className="text-center text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">Isolation</th>
              <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">Audit (24h)</th>
              <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">Open Anomalies</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-900 transition-colors">
                <td className="py-2 text-gray-300 font-medium">{row.displayName}</td>
                <td className="py-2 text-center">
                  <Badge tone={toBadgeTone(row.statusTone)}>{row.statusLabel}</Badge>
                </td>
                <td className="py-2 text-center">
                  <Badge tone={toBadgeTone(row.isolationTone)}>
                    {row.isolationLevel} · {row.isolationScoreLabel}
                  </Badge>
                </td>
                <td className="py-2 text-right text-gray-400">
                  {row.recentAuditCount}
                  {row.criticalAuditCount > 0 && (
                    <span className="text-danger"> ({row.criticalAuditCount} crit)</span>
                  )}
                </td>
                <td className="py-2 text-right">
                  <span className={row.openAnomalyCount > 0 ? "text-warn" : "text-gray-400"}>
                    {row.openAnomalyCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
