import { PulseDot } from "../ui/PulseDot";

interface TenancyPageHeaderProps {
  isolationEngineStatus: string;
}

export function TenancyPageHeader({ isolationEngineStatus }: TenancyPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="font-heading font-bold text-white text-lg tracking-wide">
            Tenancy Orchestration &amp; Isolation
          </h1>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#001A0D] text-neon border border-neon/25">
            STRICT ISOLATION MODE
          </span>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#0A0F1A] text-info border border-info/19">
            SCHEMA-PER-TENANT
          </span>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#1A0505] text-danger border border-danger/25">
            3 BREACH ALERTS
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Multi-tenant management · isolation enforcement · data boundary
          visualization · schema validation · backup snapshots · cross-tenant
          access alerts
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <PulseDot color="neon" />
          <span className="text-gray-400">Isolation Engine:</span>
          <span className="text-neon font-mono">{isolationEngineStatus}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ↓ Export Tenant Report
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ⚙ Isolation Policy
        </button>
        <button
          type="button"
          className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          + Provision Tenant
        </button>
      </div>
    </div>
  );
}
