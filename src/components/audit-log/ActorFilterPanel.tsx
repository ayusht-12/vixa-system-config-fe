import clsx from "clsx";
import type { ActorEntry } from "../../types/audit-log";
import { ConfigInput } from "../config-manager/primitives/ConfigInput";

interface ActorFilterPanelProps {
  actors: ActorEntry[];
}

export function ActorFilterPanel({ actors }: ActorFilterPanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Actor Attribution</h3>
      </div>
      <div className="p-3 space-y-2">
        <ConfigInput placeholder="Search actor / service..." />
        <div className="space-y-1.5">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="flex items-center justify-between p-2 rounded-small text-xs bg-surface"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
