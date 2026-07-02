import type { TickerItem } from "../../types/anomaly-detection";
import { Ticker } from "../ui/Ticker";
import { SEVERITY_STYLES } from "../ui/severityStyles";

interface ThreatTickerProps {
  items: TickerItem[];
}

export function ThreatTicker({ items }: ThreatTickerProps) {
  return (
    <Ticker
      title="THREAT FEED"
      accentColor="danger"
      borderColorHex="#FF3B3B"
      railBgHex="#0A0005"
      chipBgHex="#1A0505"
      items={items.map((item) => ({
        id: item.id,
        labelText: SEVERITY_STYLES[item.severity].label,
        labelClassName: SEVERITY_STYLES[item.severity].text,
        message: item.message,
      }))}
    />
  );
}
