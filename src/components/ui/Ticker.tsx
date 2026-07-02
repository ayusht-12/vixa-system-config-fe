import clsx from "clsx";
import { PulseDot } from "./PulseDot";
import type { PulseDotColor } from "./PulseDot";

export interface TickerEntryData {
  id: string;
  labelText: string;
  labelClassName: string;
  message: string;
}

interface TickerProps {
  title: string;
  items: TickerEntryData[];
  accentColor: PulseDotColor;
  borderColorHex: string;
  railBgHex: string;
  chipBgHex: string;
}

export function Ticker({
  title,
  items,
  accentColor,
  borderColorHex,
  railBgHex,
  chipBgHex,
}: TickerProps) {
  return (
    <div
      className="overflow-hidden border-b"
      style={{ backgroundColor: railBgHex, borderColor: `${borderColorHex}30` }}
    >
      <div className="flex items-center">
        <div
          className={clsx(
            "flex-shrink-0 px-3 py-1.5 text-xs font-medium border-r flex items-center gap-1.5",
          )}
          style={{ borderColor: `${borderColorHex}30`, backgroundColor: chipBgHex }}
        >
          <PulseDot color={accentColor} />
          <span style={{ color: borderColorHex }}>{title}</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex gap-8 py-1.5 px-4 text-xs text-gray-500 whitespace-nowrap">
            {[...items, ...items].map((item, index) => (
              <span key={`${item.id}-${index}`} className="flex items-center gap-8">
                <span>
                  <span className={item.labelClassName}>{item.labelText}</span> ·{" "}
                  {item.message}
                </span>
                <span className="text-gray-700">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
