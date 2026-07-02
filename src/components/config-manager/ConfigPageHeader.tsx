interface ConfigPageHeaderProps {
  unsavedCount: number;
  configVersion: string;
  lastApplied: string;
}

export function ConfigPageHeader({
  unsavedCount,
  configVersion,
  lastApplied,
}: ConfigPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-heading font-bold text-white text-lg tracking-wide">
            Engine Configuration Manager
          </h1>
          <span className="px-2 py-0.5 rounded-small text-xs font-medium bg-[#1A1200] text-warn border border-warn/25">
            {unsavedCount} UNSAVED CHANGES
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Critical · Necessary · Optional configuration panels — engine.id · etcd ·
          audit · OIDC · HSM · rate limiting · tenancy · backup · Redis ·
          geo-redundancy · retention
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-neon" />
          <span className="text-gray-400">Config Version:</span>
          <span className="text-neon">{configVersion}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-small border border-subtle bg-card text-xs">
          <span className="text-gray-400">Last Applied:</span>
          <span className="text-gray-300">{lastApplied}</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ↺ Revert
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors"
        >
          ↓ Export YAML
        </button>
        <button
          type="button"
          className="px-4 py-1.5 rounded-small text-xs font-bold text-gray-900 bg-neon hover:opacity-90 transition-opacity"
        >
          ▶ Apply Changes
        </button>
      </div>
    </div>
  );
}
