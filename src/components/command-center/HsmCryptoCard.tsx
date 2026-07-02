import { Link } from "react-router-dom";
import type { HsmSummary } from "../../types/command-center";
import { ROUTES } from "../../routes/routes";
import { PulseDot } from "../ui/PulseDot";
import { SectionCard } from "../ui/SectionCard";
import { StatTile } from "../ui/StatTile";

interface HsmCryptoCardProps {
  summary: HsmSummary;
}

export function HsmCryptoCard({ summary }: HsmCryptoCardProps) {
  return (
    <SectionCard className="p-4 flex-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            HSM Crypto Core
          </h3>
          <div className="text-xs text-gray-600">FIPS 140-3 Level 3</div>
        </div>
        <Link
          to={ROUTES.hsmSecurity.path}
          className="text-xs text-neon hover:underline"
        >
          Details →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <StatTile label="Module" tone="text-purple-400">
          {summary.module}
        </StatTile>
        <StatTile label="Key Ops/s" tone="text-neon">
          {summary.keyOpsPerSecond.toLocaleString()}
        </StatTile>
        <StatTile label="Active Keys">
          {summary.activeKeys.toLocaleString()}
        </StatTile>
        <StatTile label="Slot Status" tone="text-neon">
          {summary.activeSlots}/{summary.totalSlots} active
        </StatTile>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <PulseDot color="purple" pulse={false} />
        <span className="text-gray-500">{summary.algorithms}</span>
      </div>
    </SectionCard>
  );
}
