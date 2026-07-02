import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { PanelShell } from "../primitives/PanelShell";
import { SegmentedButtons } from "../primitives/SegmentedButtons";
import { StatTile } from "../../ui/StatTile";

export function AuthStrategyPanel() {
  return (
    <PanelShell
      tier="critical"
      title="Auth Strategy · OIDC"
      statusBadge={{ label: "OIDC ACTIVE", colorHex: "#60A4FA", bgHex: "#0A1525", borderHex: "#1e3a8a" }}
    >
      <ConfigField label="auth.strategy">
        <SegmentedButtons options={["OIDC", "SAML2", "mTLS", "API_KEY"]} />
      </ConfigField>

      <ConfigField label="oidc.issuer_url">
        <ConfigInput defaultValue="https://auth.nexus.internal/realms/nexus-engine" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="oidc.client_id">
          <ConfigInput defaultValue="nexus-engine-v4" />
        </ConfigField>
        <ConfigField label="oidc.client_secret">
          <ConfigInput type="password" defaultValue="supersecretvalue" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="jwks_refresh_interval">
          <ConfigInput defaultValue="5m" />
        </ConfigField>
        <ConfigField label="token_cache_ttl">
          <ConfigInput defaultValue="15m" />
        </ConfigField>
      </div>

      <ConfigField label="oidc.scopes">
        <ConfigInput defaultValue="openid profile email nexus:admin nexus:read nexus:write" />
      </ConfigField>

      <div className="pt-2 border-t border-subtle grid grid-cols-3 gap-2 text-center">
        <StatTile label="Provider" tone="text-info">Keycloak 22</StatTile>
        <StatTile label="Active Tokens" tone="text-neon">14,821</StatTile>
        <StatTile label="Cert Valid" tone="text-neon">89d</StatTile>
      </div>
    </PanelShell>
  );
}
