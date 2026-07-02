import { useState } from "react";
import clsx from "clsx";
import type { ReactNode } from "react";

interface FilterChipBase {
  id: string;
  label: string;
  count: string;
}

interface FilterPanelProps<T extends FilterChipBase> {
  title: string;
  actionLabel: string;
  items: T[];
  defaultActiveId?: string;
  renderLeading?: (item: T) => ReactNode;
}

export function FilterPanel<T extends FilterChipBase>({
  title,
  actionLabel,
  items,
  defaultActiveId,
  renderLeading,
}: FilterPanelProps<T>) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">{title}</h3>
        <button
          type="button"
          onClick={() => setActiveId(items[0]?.id)}
          className="text-xs text-neon cursor-pointer hover:underline"
        >
          {actionLabel}
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={clsx(
                "w-full px-3 py-2 rounded-small border text-xs flex items-center justify-between transition-colors",
                isActive
                  ? "bg-[#001A0D] border-neon/40 text-neon"
                  : "bg-surface border-accent text-gray-500 hover:border-gray-500 hover:text-gray-300",
              )}
            >
              <div className="flex items-center gap-2">
                {renderLeading?.(item)}
                <span>{item.label}</span>
              </div>
              <span className="text-gray-600 text-[9px]">{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
