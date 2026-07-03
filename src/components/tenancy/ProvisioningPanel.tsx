import { useState } from "react";
import clsx from "clsx";
import type { ProvisioningState } from "../../types/tenancy";
import type { TenantCreateDTO } from "../../api/types";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";
import { ConfigSelect } from "../config-manager/primitives/ConfigSelect";
import { SegmentedButtons } from "../config-manager/primitives/SegmentedButtons";
import { ProgressBar } from "../ui/ProgressBar";

interface ProvisioningPanelProps {
  state: ProvisioningState;
  tierOptions: string[];
  regionOptions: string[];
  isolationModeOptions: string[];
  onProvision?: (payload: TenantCreateDTO) => Promise<unknown>;
}

const STEP_ICON = {
  done: { icon: "✓", className: "text-neon" },
  "in-progress": { icon: "⟳", className: "text-info animate-pulse-dot" },
  pending: { icon: "○", className: "text-gray-600" },
};

const STEP_STATUS_LABEL = {
  done: "DONE",
  "in-progress": "IN PROGRESS",
  pending: "PENDING",
};

export function ProvisioningPanel({
  state,
  tierOptions,
  regionOptions,
  isolationModeOptions,
  onProvision,
}: ProvisioningPanelProps) {
  const [autoBackup, setAutoBackup] = useState(false);
  const [hsmBind, setHsmBind] = useState(true);
  const [tenantSlug, setTenantSlug] = useState("");
  const [tier, setTier] = useState(tierOptions[0]);
  const [region, setRegion] = useState(regionOptions[0]);
  const [isolationMode, setIsolationMode] = useState(isolationModeOptions[0] ?? "STRICT");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleProvision() {
    if (!onProvision || !tenantSlug.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onProvision({
        slug: tenantSlug.trim(),
        org_id: `ORG-${Date.now().toString(36).toUpperCase()}`,
        display_name: tenantSlug.trim(),
        tier: tier.toLowerCase(),
        isolation_mode: isolationMode.toLowerCase(),
        region,
        db_schema_name: `schema_${tenantSlug.trim().replace(/[^a-z0-9]+/gi, "_").toLowerCase()}`,
      });
      setTenantSlug("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to provision tenant");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Tenant Provisioning Controls</h3>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-info border bg-[#0A0F1A] border-info/25">
          1 IN PROGRESS
        </span>
      </div>
      <div className="p-4">
        <div className="p-3 rounded-small border mb-4 bg-[#0A0F1A] border-info/25">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse-dot" />
              <span className="text-xs font-medium text-info">PROVISIONING: {state.tenantName}</span>
            </div>
            <span className="text-xs text-info">{state.percent}%</span>
          </div>
          <div className="mb-3">
            <ProgressBar percent={state.percent} color="info" height="regular" />
          </div>
          <div className="space-y-1.5">
            {state.steps.map((step) => {
              const iconStyle = STEP_ICON[step.status];
              return (
                <div key={step.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={iconStyle.className}>{iconStyle.icon}</span>
                    <span className={step.status === "pending" ? "text-gray-600" : "text-gray-400"}>
                      {step.label}
                    </span>
                  </div>
                  <span className={clsx("text-[9px]", iconStyle.className)}>
                    {STEP_STATUS_LABEL[step.status]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
              Pause
            </button>
            <button type="button" className="px-2.5 py-1 rounded-small text-xs text-danger border border-danger/25 bg-[#1A0505] hover:border-red-500 transition-colors">
              Abort
            </button>
            <span className="text-xs text-gray-600 ml-auto">ETA: {state.eta}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
            Quick Provision New Tenant
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Tenant ID</label>
              <ConfigInput
                placeholder="e.g. my-org-prod"
                value={tenantSlug}
                onChange={(event) => setTenantSlug(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600 block mb-1">Tier</label>
                <ConfigSelect
                  options={tierOptions}
                  value={tier}
                  onChange={(event) => setTier(event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Region</label>
                <ConfigSelect
                  options={regionOptions}
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Isolation Mode</label>
              <SegmentedButtons
                options={isolationModeOptions}
                defaultValue="STRICT"
                onChange={setIsolationMode}
              />
            </div>
            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(event) => setAutoBackup(event.target.checked)}
                className="w-3 h-3 accent-neon"
              />
              <span className="text-xs text-gray-400">Enable auto-backup snapshots</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hsmBind}
                onChange={(event) => setHsmBind(event.target.checked)}
                className="w-3 h-3 accent-neon"
              />
              <span className="text-xs text-gray-400">Bind dedicated DEK to HSM slot</span>
            </label>
            {submitError && <div className="text-xs text-danger">{submitError}</div>}
            <button
              type="button"
              disabled={!onProvision || !tenantSlug.trim() || submitting}
              onClick={handleProvision}
              className="w-full px-4 py-2 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Provisioning…" : "+ Provision Tenant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
