import { useEffect, useState } from "react";
import clsx from "clsx";
import type { ActorEntry } from "../../types/audit-log";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";

interface ActorFilterPanelProps {
  actors: ActorEntry[];
  value: string;
  onFilter: (value: string) => void;
}

export function ActorFilterPanel({ actors, value, onFilter }: ActorFilterPanelProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Actor Attribution</h3>
        <button
          type="button"
          onClick={() => onFilter("")}
          className="text-xs text-neon cursor-pointer hover:underline"
        >
          Clear
        </button>
      </div>
      <div className="p-3 space-y-2">
        <form
          className="flex gap-1.5"
          onSubmit={(event) => {
            event.preventDefault();
            onFilter(draft);
          }}
        >
          <ConfigInput
            placeholder="Filter actor..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded-small text-xs font-medium text-gray-900 bg-neon"
          >
            Apply
          </button>
        </form>
        <div className="text-[10px] text-gray-600">Suggestions reflect the current page.</div>
        <div className="space-y-1.5">
          {actors.map((actor) => (
            <button
              key={actor.id}
              type="button"
              onClick={() => onFilter(actor.id)}
              className="w-full flex items-center justify-between p-2 rounded-small text-xs bg-surface hover:border-neon/40 border border-transparent"
            >
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "w-5 h-5 rounded-small border flex items-center justify-center font-bold text-[9px]",
                    actor.avatarBgClass,
                    actor.avatarBorderClass,
                    actor.avatarTextClass,
                  )}
                >
                  {actor.avatarLetter}
                </span>
                <span className="text-gray-300">{actor.label}</span>
              </div>
              <span className="text-gray-600 text-[9px]">{actor.count}</span>
            </button>
          ))}
          {actors.length === 0 && (
            <div className="p-2 rounded-small text-xs text-gray-600 bg-surface">
              No actors on this page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
