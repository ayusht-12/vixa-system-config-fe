import { useState } from "react";
import clsx from "clsx";

interface SegmentedButtonsProps {
  options: string[];
  defaultValue?: string;
}

export function SegmentedButtons({ options, defaultValue }: SegmentedButtonsProps) {
  const [active, setActive] = useState(defaultValue ?? options[0]);

  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setActive(option)}
          className={clsx(
            "px-3 py-1.5 rounded-small text-xs font-medium transition-colors",
            option === active
              ? "text-gray-900 bg-neon"
              : "text-gray-500 border border-accent bg-surface hover:border-gray-500",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
