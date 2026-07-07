import { BoundInput, BoundSegmented } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";
import { StatTile } from "../../ui/StatTile";

export interface OidcTelemetry {
  provider: string;
  activeTokens: string;
  certValid: string;
}

export function AuthStrategyPanel({ telemetry }: { telemetry?: OidcTelemetry }) {
  return (
    <PanelShell
      tier="critical"
      title="Auth Strategy · OIDC"
      statusBadge={{ label: "OIDC ACTIVE", colorHex: "#60A4FA", bgHex: "#0A1525", borderHex: "#1e3a8a" }}
    >
      <ConfigField label="auth.strategy">
        <BoundSegmented paramKey="auth.strategy" />
      </ConfigField>

      <ConfigField label="oidc.issuer_url">
        <BoundInput paramKey="oidc.issuer_url" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="oidc.client_id">
          <BoundInput paramKey="oidc.client_id" />
        </ConfigField>
        <ConfigField label="oidc.client_secret">
          <BoundInput paramKey="oidc.client_secret" type="password" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="jwks_refresh_interval">
          <BoundInput paramKey="oidc.jwks_refresh_interval" />
        </ConfigField>
        <ConfigField label="token_cache_ttl">
          <BoundInput paramKey="oidc.token_cache_ttl" />
        </ConfigField>
      </div>

      <ConfigField label="oidc.scopes">
        <BoundInput paramKey="oidc.scopes" />
      </ConfigField>

      {telemetry && (
        <div className="pt-2 border-t border-subtle grid grid-cols-3 gap-2 text-center">
          <StatTile label="Provider" tone="text-info">
            {telemetry.provider}
          </StatTile>
          <StatTile label="Active Tokens" tone="text-neon">
            {telemetry.activeTokens}
          </StatTile>
          <StatTile label="Cert Valid" tone="text-neon">
            {telemetry.certValid}
          </StatTile>
        </div>
      )}
    </PanelShell>
  );
}
