import type { OidcAuthSummary } from "../../types/command-center";
import { PulseDot } from "../ui/PulseDot";
import { SectionCard } from "../ui/SectionCard";
import { StatTile } from "../ui/StatTile";

interface OidcAuthCardProps {
  summary: OidcAuthSummary;
}

export function OidcAuthCard({ summary }: OidcAuthCardProps) {
  return (
    <SectionCard className="p-4 flex-1">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            OIDC Auth Status
          </h3>
          <div className="text-xs text-gray-600">
            OpenID Connect · JWT validation
          </div>
        </div>
        <PulseDot color="neon" size="md" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <StatTile label="Provider">{summary.provider}</StatTile>
        <StatTile label="Token Cache" tone="text-neon">
          {summary.activeTokenCount}
        </StatTile>
        <StatTile label="Auth Rate">{summary.authRatePerSecond}/s</StatTile>
        <StatTile label="Failures" tone="text-warn">
          {summary.failureCount} ({summary.failureRate})
        </StatTile>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <PulseDot color="neon" pulse={false} />
        <span className="text-gray-500">
          JWKS refreshed {summary.jwksRefreshedMinutesAgo}m ago · cert valid{" "}
          {summary.certValidDays}d
        </span>
      </div>
    </SectionCard>
  );
}
