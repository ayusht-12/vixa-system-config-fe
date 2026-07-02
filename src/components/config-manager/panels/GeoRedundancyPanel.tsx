import { useState } from "react";
import clsx from "clsx";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { ProgressBar } from "../../ui/ProgressBar";

interface RegionDot {
  id: string;
  top: string;
  left: string;
  active: boolean;
}

const MAP_DOTS: RegionDot[] = [
  { id: "us-east-1", top: "35%", left: "22%", active: true },
  { id: "us-west-2", top: "35%", left: "15%", active: true },
  { id: "eu-west-1", top: "28%", left: "47%", active: true },
  { id: "ap-southeast-1", top: "42%", left: "72%", active: false },
  { id: "ap-northeast-1", top: "38%", left: "65%", active: false },
];

interface RegionChip {
  id: string;
  label: string;
  role: string;
}

const INITIAL_ACTIVE_REGIONS: RegionChip[] = [
  { id: "us-east-1", label: "us-east-1", role: "PRIMARY" },
  { id: "us-west-2", label: "us-west-2", role: "REPLICA" },
  { id: "eu-west-1", label: "eu-west-1", role: "REPLICA" },
];

const INACTIVE_REGIONS: RegionChip[] = [
  { id: "ap-southeast-1", label: "ap-southeast-1", role: "" },
  { id: "ap-northeast-1", label: "ap-northeast-1", role: "" },
  { id: "sa-east-1", label: "sa-east-1", role: "" },
];

const REPLICATION_LAG = [
  { region: "us-west-2", percent: 5, ms: "12ms", color: "neon" as const },
  { region: "eu-west-1", percent: 18, ms: "87ms", color: "warn" as const },
];

export function GeoRedundancyPanel() {
  const [activeRegions, setActiveRegions] = useState(new Set(INITIAL_ACTIVE_REGIONS.map((r) => r.id)));

  function toggleRegion(id: string) {
    setActiveRegions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <PanelShell
      tier="optional"
      title="Geo-Redundancy"
      statusBadge={{ label: `${activeRegions.size} REGIONS`, colorHex: "#00FFA3" }}
    >
      <ConfigField label="geo.replication_mode">
        <SegmentedButtons options={["ACTIVE-PASSIVE", "ACTIVE-ACTIVE"]} />
      </ConfigField>

      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
          geo.active_regions <span className="text-gray-700 normal-case">(click to toggle)</span>
        </label>

        <div className="relative rounded-small overflow-hidden mb-3 bg-[#0A0E14] border border-subtle" style={{ height: 120 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-gray-700 text-center">
              <div className="text-2xl mb-1">🌍</div>
              <div>Interactive Region Map</div>
            </div>
          </div>
          {MAP_DOTS.map((dot) => (
            <div key={dot.id} className="absolute" style={{ top: dot.top, left: dot.left }}>
              <span
                className={clsx(
                  "rounded-full block",
                  dot.active ? "w-3 h-3 bg-neon" : "w-2 h-2 bg-accent",
                  dot.id === "us-east-1" && "animate-pulse-dot",
                )}
                title={dot.id}
              />
            </div>
          ))}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
            <line x1="22%" y1="35%" x2="15%" y2="35%" stroke="#00FFA3" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="22%" y1="35%" x2="47%" y2="28%" stroke="#00FFA3" strokeWidth="1" strokeDasharray="3,3" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[...INITIAL_ACTIVE_REGIONS, ...INACTIVE_REGIONS].map((region) => {
            const isActive = activeRegions.has(region.id);
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => toggleRegion(region.id)}
                className={clsx(
                  "px-2.5 py-2 rounded-small border text-xs flex items-center justify-between transition-colors",
                  isActive
                    ? "bg-[#001A0D] border-neon/40 text-neon"
                    : "bg-surface border-accent text-gray-500 hover:border-gray-500 hover:text-gray-300",
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      isActive ? "bg-neon animate-pulse-dot" : "bg-accent",
                    )}
                  />
                  <span>{region.label}</span>
                </div>
                <span className="text-gray-600 text-[9px]">
                  {isActive ? region.role || "ACTIVE" : "+ ADD"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-subtle">
        <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Replication Lag</div>
        <div className="space-y-1.5">
          {REPLICATION_LAG.map((row) => (
            <div key={row.region} className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{row.region}</span>
              <div className="flex items-center gap-2">
                <ProgressBar percent={row.percent} color={row.color} trackClassName="w-20" />
                <span className={clsx("w-10 text-right", row.color === "neon" ? "text-neon" : "text-warn")}>
                  {row.ms}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}
