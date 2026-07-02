import clsx from "clsx";
import type { BoundaryStyle, BoundaryTenant } from "../../types/tenancy";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { PulseDot } from "../ui/PulseDot";

interface DataBoundaryVisualizationProps {
  tenants: BoundaryTenant[];
  footerNote: string;
}

const STYLE_CLASSES: Record<BoundaryStyle, string> = {
  intact: "bg-[#001A0D]/10 border-neon/19",
  partial: "glow-amber bg-[#1A1200]/10 border-warn/38",
  breach: "glow-red bg-[#1A0505]/10 border-danger/38",
  provisioning: "bg-[#0A0F1A]/10 border-info/25",
};

const FOOTER_BORDER: Record<BoundaryStyle, string> = {
  intact: "border-neon/12",
  partial: "border-warn/19",
  breach: "border-danger/19",
  provisioning: "border-info/19",
};

function BoundaryCard({ tenant }: { tenant: BoundaryTenant }) {
  return (
    <div className={clsx("rounded-large border p-3", STYLE_CLASSES[tenant.style])}>
      <div className="flex items-center justify-between mb-2">
        <span className={clsx("text-xs font-mono font-bold", ACCENT_CLASSES[tenant.tone].text)}>
          {tenant.name}
        </span>
        <PulseDot color={tenant.tone} size="sm" pulse={tenant.dotPulse} />
      </div>
      <div className="space-y-1 text-xs">
        {tenant.fields.map((field) => (
          <div key={field.tag} className="flex items-center gap-1.5 text-gray-500">
            <span className={clsx("text-[9px]", ACCENT_CLASSES[field.tagTone].text)}>{field.tag}</span>
            <span className="text-[9px]">{field.value}</span>
          </div>
        ))}
      </div>
      <div className={clsx("mt-2 pt-1.5 border-t", FOOTER_BORDER[tenant.style])}>
        <span className={clsx("text-[9px]", ACCENT_CLASSES[tenant.footerTone].text)}>{tenant.footerLabel}</span>
      </div>
    </div>
  );
}

export function DataBoundaryVisualization({ tenants, footerNote }: DataBoundaryVisualizationProps) {
  return (
    <div className="lg:col-span-3 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white text-sm">Data Boundary Visualization</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
            LIVE TOPOLOGY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            Expand All
          </button>
          <button type="button" className="px-2.5 py-1 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors">
            ↓ Export Map
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="relative rounded-large border border-subtle p-4 overflow-hidden bg-backdrop grid-bg" style={{ minHeight: 320 }}>
          <div className="relative z-10 flex flex-col items-center mb-6">
            <div className="px-4 py-2 rounded-large border glow-green flex items-center gap-2 bg-[#001A0D] border-neon">
              <PulseDot color="neon" />
              <span className="text-xs font-bold text-neon font-mono">NEXUS ENGINE CORE</span>
              <span className="text-xs text-gray-500">· Isolation Enforcer</span>
            </div>
            <div className="w-px h-4 bg-green-800" />
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3">
            {tenants.map((tenant) => (
              <BoundaryCard key={tenant.id} tenant={tenant} />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-4 pt-3 border-t border-subtle flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-px bg-neon inline-block" />
              <span className="text-gray-600">Intact boundary</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-px bg-warn inline-block" />
              <span className="text-gray-600">Partial isolation</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-px bg-danger inline-block" />
              <span className="text-gray-600">Boundary violation</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-px bg-info inline-block" />
              <span className="text-gray-600">Provisioning</span>
            </div>
            <span className="text-xs text-gray-600 ml-auto">{footerNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
