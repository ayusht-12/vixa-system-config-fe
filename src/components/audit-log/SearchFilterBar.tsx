import { useEffect, useState } from "react";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";
import { ConfigSelect } from "../config-manager/primitives/ConfigSelect";
import { PulseDot } from "../ui/PulseDot";

interface SearchFilterBarProps {
  search: string;
  severity: string;
  eventType: string;
  eventTypeOptions: string[];
  onSearch: (filters: { search?: string; severity?: string; eventType?: string }) => void;
}

export function SearchFilterBar({
  search,
  severity,
  eventType,
  eventTypeOptions,
  onSearch,
}: SearchFilterBarProps) {
  const [draftSearch, setDraftSearch] = useState(search);
  const [draftSeverity, setDraftSeverity] = useState(severity);
  const [draftEventType, setDraftEventType] = useState(eventType);

  useEffect(() => setDraftSearch(search), [search]);
  useEffect(() => setDraftSeverity(severity), [severity]);
  useEffect(() => setDraftEventType(eventType), [eventType]);

  function submit() {
    onSearch({
      search: draftSearch,
      severity: draftSeverity,
      eventType: draftEventType,
    });
  }

  return (
    <div className="rounded-large border border-subtle bg-card p-3">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex-1 min-w-48">
          <ConfigInput
            placeholder="Search actors, descriptions, subtypes, tenants, source IPs..."
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
          />
        </div>
        <div className="w-36">
          <ConfigSelect
            value={draftSeverity}
            onChange={(event) => setDraftSeverity(event.target.value)}
            options={["all", "critical", "warning", "info"]}
          />
        </div>
        <div className="w-40">
          <ConfigSelect
            value={draftEventType}
            onChange={(event) => setDraftEventType(event.target.value)}
            options={["all", ...eventTypeOptions]}
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-small text-xs font-medium text-gray-900 bg-neon hover:opacity-90 transition-opacity flex-shrink-0"
        >
          🔍 Search
        </button>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
          <PulseDot color="neon" />
          <span className="text-neon">Live</span>
        </div>
      </form>
    </div>
  );
}
