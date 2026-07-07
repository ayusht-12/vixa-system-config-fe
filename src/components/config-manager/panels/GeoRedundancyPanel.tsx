import clsx from "clsx";
import { BoundSegmented, useConfigParam } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";

export function GeoRedundancyPanel() {
  const activeRegions = useConfigParam("geo.active_regions");
  const regions =
    activeRegions?.active_value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return (
    <PanelShell
      tier="optional"
      title="Geo-Redundancy"
      statusBadge={
        activeRegions ? { label: `${regions.length} REGIONS`, colorHex: "#00FFA3" } : undefined
      }
    >
      <ConfigField label="geo.replication_mode">
        <BoundSegmented paramKey="geo.replication_mode" />
      </ConfigField>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
          geo.active_regions
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {regions.map((region, index) => (
            <div
              key={region}
              className="px-2.5 py-2 rounded-small border text-xs flex items-center justify-between bg-[#001A0D] border-neon/40 text-neon"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={clsx(
                    "w-1.5 h-1.5 rounded-full bg-neon",
                    index === 0 && "animate-pulse-dot",
                  )}
                />
                <span>{region}</span>
              </div>
              <span className="text-gray-600 text-[9px]">{index === 0 ? "PRIMARY" : "REPLICA"}</span>
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}
