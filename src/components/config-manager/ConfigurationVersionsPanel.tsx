import { useState } from "react";
import {
  useConfigurationVersionsViewModel,
  type ConfigurationGroup,
} from "../../api/viewModels/configurationVersions";
import type { ConfigurationDTO } from "../../api/types";
import { ApiError } from "../../lib/apiClient";
import { timeAgo } from "../../lib/format";
import { Badge } from "../ui/Badge";

const STATUS_TONE: Record<string, "neon" | "warn" | "neutral"> = {
  active: "neon",
  draft: "warn",
  archived: "neutral",
};

const ACTION_CLASSES =
  "rounded-small border border-accent bg-surface px-2 py-0.5 text-[10px] text-gray-300 hover:border-neon transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

export function ConfigurationVersionsPanel() {
  const vm = useConfigurationVersionsViewModel();
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>, failure: string) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : failure);
    }
  }

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Configuration Versions</h3>
        <span className="text-[10px] text-gray-600">
          {vm.groups.length} configuration{vm.groups.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="p-4">
        {error ? <p className="text-xs text-danger mb-2">{error}</p> : null}
        {vm.isLoading ? (
          <p className="text-xs text-gray-500">Loading configurations…</p>
        ) : vm.error ? (
          <p className="text-xs text-danger">{vm.error.message}</p>
        ) : vm.groups.length === 0 ? (
          <p className="text-xs text-gray-600">No versioned configurations yet.</p>
        ) : (
          <div className="space-y-3">
            {vm.groups.map((group) => (
              <ConfigurationGroupRow
                key={group.name}
                group={group}
                busy={vm.isMutating}
                onActivate={(id) => run(() => vm.activate(id), "Failed to activate version.")}
                onArchive={(id) => run(() => vm.archive(id), "Failed to archive version.")}
                onRollback={(id) => run(() => vm.rollback(id), "Failed to roll back.")}
              />
            ))}
          </div>
        )}
        <p className="mt-3 text-[10px] text-gray-600">
          Activating a version archives the previously-active one. Rollback restores an archived
          version as a new active version — history is never rewritten.
        </p>
      </div>
    </div>
  );
}

function ConfigurationGroupRow({
  group,
  busy,
  onActivate,
  onArchive,
  onRollback,
}: {
  group: ConfigurationGroup;
  busy: boolean;
  onActivate: (id: string) => void;
  onArchive: (id: string) => void;
  onRollback: (id: string) => void;
}) {
  return (
    <div className="rounded-small border border-subtle bg-surface">
      <div className="flex items-center justify-between px-3 py-2 border-b border-subtle">
        <span className="text-xs font-mono text-gray-200">{group.name}</span>
        <span className="text-[10px] text-gray-600">
          {group.activeVersion !== null ? `active v${group.activeVersion}` : "no active version"} ·
          latest v{group.latestVersion}
        </span>
      </div>
      <div className="divide-y divide-subtle/60">
        {group.versions.map((version) => (
          <ConfigurationVersionRow
            key={version.id}
            version={version}
            busy={busy}
            onActivate={onActivate}
            onArchive={onArchive}
            onRollback={onRollback}
          />
        ))}
      </div>
    </div>
  );
}

function ConfigurationVersionRow({
  version,
  busy,
  onActivate,
  onArchive,
  onRollback,
}: {
  version: ConfigurationDTO;
  busy: boolean;
  onActivate: (id: string) => void;
  onArchive: (id: string) => void;
  onRollback: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-200">v{version.version}</span>
          <Badge tone={STATUS_TONE[version.status] ?? "neutral"}>
            {version.status.toUpperCase()}
          </Badge>
          <span className="text-[10px] text-gray-600 font-mono">
            {version.checksum.slice(0, 8)}
          </span>
        </div>
        <div className="text-[10px] text-gray-600 mt-0.5 truncate">
          {version.description ?? `${Object.keys(version.payload).length} keys`} · {version.created_by} ·{" "}
          {timeAgo(version.created_at)}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {version.status === "active" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onArchive(version.id)}
            className={ACTION_CLASSES}
          >
            Archive
          </button>
        ) : null}
        {version.status === "draft" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onActivate(version.id)}
            className={ACTION_CLASSES}
          >
            Activate
          </button>
        ) : null}
        {version.status === "archived" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onRollback(version.id)}
            className={ACTION_CLASSES}
          >
            Rollback
          </button>
        ) : null}
      </div>
    </div>
  );
}
