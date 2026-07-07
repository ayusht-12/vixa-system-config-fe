import { useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  defaultValue: number;
  formatValue: (value: number) => string;
  // Fires when the user finishes adjusting (pointer/key up or blur), so callers
  // can commit the value without a request per intermediate drag tick.
  onCommit?: (value: number) => void;
}

export function RangeSlider({ min, max, defaultValue, formatValue, onCommit }: RangeSliderProps) {
  const [value, setValue] = useState(defaultValue);

  const commit = () => {
    if (value !== defaultValue) onCommit?.(value);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
        className="flex-1 accent-neon"
      />
      <span className="text-neon text-xs w-16 text-right font-mono">{formatValue(value)}</span>
    </div>
  );
}
