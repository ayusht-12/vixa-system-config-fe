import type { TickerEntryData } from "../ui/Ticker";
import { Ticker } from "../ui/Ticker";

interface ComplianceTickerProps {
  items: TickerEntryData[];
}

export function ComplianceTicker({ items }: ComplianceTickerProps) {
  return (
    <Ticker
      title="COMPLIANCE FEED"
      accentColor="warn"
      borderColorHex="#FBBF24"
      railBgHex="#0A0C05"
      chipBgHex="#1A1200"
      items={items}
    />
  );
}
