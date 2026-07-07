import { BoundInput, useConfigParam } from "../configBinding";
import { ConfigField } from "../primitives/ConfigField";
import { PanelShell } from "../primitives/PanelShell";
import { StatTile } from "../../ui/StatTile";

export interface HsmTelemetry {
  module: string;
  fips: string;
  keys: string;
  slots: string;
}

export function CryptoHsmPanel({ telemetry }: { telemetry?: HsmTelemetry }) {
  const algorithms = useConfigParam("hsm.supported_algorithms");
  const algoList =
    algorithms?.active_value
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  return (
    <PanelShell
      tier="necessary"
      title="Crypto HSM · PKCS#11"
      statusBadge={{ label: "HSM BOUND", colorHex: "#A78BFA", bgHex: "#1A0A2A", borderHex: "#5b21b6" }}
      actionLink={{ label: "HSM Details →", href: "/hsm-security" }}
    >
      <ConfigField label="pkcs11.library_path">
        <BoundInput paramKey="pkcs11.library_path" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="pkcs11.slot_id">
          <BoundInput paramKey="pkcs11.slot_id" />
        </ConfigField>
        <ConfigField label="pkcs11.pin">
          <BoundInput paramKey="pkcs11.pin" type="password" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="master_key_label">
          <BoundInput paramKey="hsm.master_key_label" />
        </ConfigField>
        <ConfigField label="signing_key_label">
          <BoundInput paramKey="hsm.signing_key_label" />
        </ConfigField>
      </div>

      <ConfigField label="hsm.supported_algorithms">
        <div className="flex flex-wrap gap-1.5">
          {algoList.map((algo) => (
            <span
              key={algo}
              className="px-2 py-0.5 rounded-small text-xs text-purple-400 border border-purple-900 bg-[#1A0A2A]"
            >
              {algo}
            </span>
          ))}
        </div>
      </ConfigField>

      {telemetry && (
        <div className="pt-2 border-t border-subtle grid grid-cols-4 gap-2 text-center">
          <StatTile label="Module" tone="text-purple-400">
            {telemetry.module}
          </StatTile>
          <StatTile label="FIPS" tone="text-neon">
            {telemetry.fips}
          </StatTile>
          <StatTile label="Keys" tone="text-white">
            {telemetry.keys}
          </StatTile>
          <StatTile label="Slots" tone="text-neon">
            {telemetry.slots}
          </StatTile>
        </div>
      )}
    </PanelShell>
  );
}
