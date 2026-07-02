import { ConfigInput } from "../config-manager/primitives/ConfigInput";
import { ConfigSelect } from "../config-manager/primitives/ConfigSelect";
import { PulseDot } from "../ui/PulseDot";

export function SearchFilterBar() {
  return (
    <div className="rounded-large border border-subtle bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-48">
          <ConfigInput placeholder="Search log entries, hashes, actors, event types..." />
        </div>
        <div className="w-36">
          <ConfigSelect options={["All Severities", "CRITICAL", "WARNING", "INFO"]} />
        </div>
        <div className="w-40">
          <ConfigSelect options={["All Event Types", "STATE_CHANGE", "AUTH_EVENT", "CONFIG_CHANGE"]} />
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity flex-shrink-0"
        >
          🔍 Search
        </button>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
          <PulseDot color="neon" />
          <span className="text-neon">Live</span>
        </div>
      </div>
    </div>
  );
}
