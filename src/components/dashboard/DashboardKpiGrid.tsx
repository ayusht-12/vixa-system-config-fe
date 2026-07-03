import type { DashboardKpiTile } from "../../types/dashboard";
import { ACCENT_CLASSES } from "../ui/accentColors";

export function DashboardKpiGrid({ tiles }: { tiles: DashboardKpiTile[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
      {tiles.map((tile) => (
        <div key={tile.id} className="p-3 rounded-large border border-subtle bg-card">
          <div className="text-xs text-gray-600">{tile.label}</div>
          <div className={`font-heading text-2xl font-bold mt-1 ${ACCENT_CLASSES[tile.tone].text}`}>
            {tile.value}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">{tile.description}</div>
        </div>
      ))}
    </div>
  );
}
