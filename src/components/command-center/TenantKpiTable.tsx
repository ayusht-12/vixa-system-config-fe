import clsx from "clsx";
import { Link } from "react-router-dom";
import type {
  TenantOverview,
  TenantRow,
  TenantStatus,
  TenantTier,
} from "../../types/command-center";
import { ROUTES } from "../../routes/routes";
import { PulseDot } from "../ui/PulseDot";
import { ProgressBar } from "../ui/ProgressBar";
import { SectionCard } from "../ui/SectionCard";

interface TenantKpiTableProps {
  overview: TenantOverview;
}

const TIER_BADGE: Record<TenantTier, string> = {
  enterprise: "bg-purple-950 text-purple-400",
  premium: "bg-blue-950 text-blue-400",
  standard: "bg-gray-800 text-gray-500",
};

const STATUS_DOT: Record<TenantStatus, { color: "danger" | "warn" | "neon"; pulse: boolean }> = {
  critical: { color: "danger", pulse: true },
  warning: { color: "warn", pulse: true },
  healthy: { color: "neon", pulse: false },
};

const SLA_TONE: Record<TenantStatus, string> = {
  critical: "text-neon",
  warning: "text-warn",
  healthy: "text-neon",
};

const QUOTA_TONE: Record<TenantStatus, string> = {
  critical: "text-gray-400",
  warning: "text-warn",
  healthy: "text-gray-400",
};

function SummaryTile({
  value,
  label,
  tone = "text-white",
}: {
  value: string;
  label: string;
  tone?: string;
}) {
  return (
    <div className="p-2.5 rounded-small text-center bg-surface">
      <div className={clsx("font-heading text-xl font-bold", tone)}>
        {value}
      </div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}

function TenantTableRow({ tenant }: { tenant: TenantRow }) {
  const dot = STATUS_DOT[tenant.status];
  const quotaColor = tenant.apiQuotaPercent >= 85 ? "warn" : "neon";

  return (
    <tr className="hover:bg-gray-900 transition-colors">
      <td className="py-2 text-gray-300 font-medium">{tenant.name}</td>
      <td className="py-2">
        <span
          className={clsx(
            "px-1.5 py-0.5 rounded-small text-[9px]",
            TIER_BADGE[tenant.tier],
          )}
        >
          {tenant.tier.toUpperCase()}
        </span>
      </td>
      <td className="py-2 text-right text-gray-400">
        {tenant.eventsPerSecond.toLocaleString()}
      </td>
      <td className="py-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <ProgressBar
            percent={tenant.apiQuotaPercent}
            color={quotaColor}
            trackClassName="w-12"
          />
          <span className={QUOTA_TONE[tenant.status]}>
            {tenant.apiQuotaPercent}%
          </span>
        </div>
      </td>
      <td className={clsx("py-2 text-right", SLA_TONE[tenant.status])}>
        {tenant.sla}
      </td>
      <td className="py-2 text-center">
        <PulseDot color={dot.color} pulse={dot.pulse} className="inline-block" />
      </td>
    </tr>
  );
}

export function TenantKpiTable({ overview }: TenantKpiTableProps) {
  return (
    <SectionCard className="lg:col-span-3 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Tenant KPIs — All Tenants
          </h3>
          <div className="text-xs text-gray-600">
            Operational metrics across {overview.totalTenants} active tenants
          </div>
        </div>
        <Link
          to={ROUTES.tenancy.path}
          className="text-xs text-neon hover:underline"
        >
          Manage →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <SummaryTile value={String(overview.activeTenants)} label="Active" />
        <SummaryTile value={overview.avgSla} label="Avg SLA" tone="text-neon" />
        <SummaryTile value={overview.eventsPerHour} label="Events/hr" />
        <SummaryTile
          value={String(overview.degradedTenants)}
          label="Degraded"
          tone="text-warn"
        />
      </div>

      <div className="overflow-x-auto scrollbar-thin max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-subtle">
              <th className="text-left text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                Tenant
              </th>
              <th className="text-left text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                Tier
              </th>
              <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                Events/s
              </th>
              <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                API Quota
              </th>
              <th className="text-right text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                SLA
              </th>
              <th className="text-center text-gray-600 pb-2 font-medium uppercase tracking-wider text-[10px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {overview.rows.map((tenant) => (
              <TenantTableRow key={tenant.id} tenant={tenant} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 pt-2 border-t border-subtle flex items-center justify-between">
        <span className="text-xs text-gray-600">
          Showing {overview.rows.length} of {overview.totalTenants} tenants
        </span>
        <Link
          to={ROUTES.tenancy.path}
          className="text-xs text-neon hover:underline"
        >
          View all tenants →
        </Link>
      </div>
    </SectionCard>
  );
}
