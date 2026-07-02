import { ConfigField } from "../primitives/ConfigField";
import { ConfigInput } from "../primitives/ConfigInput";
import { PanelShell } from "../primitives/PanelShell";
import { StatTile } from "../../ui/StatTile";

const ALGORITHMS = ["AES-256-GCM", "RSA-4096", "ECDSA-P384", "Ed25519"];

export function CryptoHsmPanel() {
  return (
    <PanelShell
      tier="necessary"
      title="Crypto HSM · PKCS#11"
      statusBadge={{ label: "HSM BOUND", colorHex: "#A78BFA", bgHex: "#1A0A2A", borderHex: "#5b21b6" }}
      actionLink={{ label: "HSM Details →", href: "/hsm-security" }}
    >
      <ConfigField label="pkcs11.library_path">
        <ConfigInput defaultValue="/usr/lib/softhsm/libsofthsm2.so" />
      </ConfigField>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="pkcs11.slot_id">
          <ConfigInput defaultValue="0" />
        </ConfigField>
        <ConfigField label="pkcs11.pin">
          <ConfigInput type="password" defaultValue="12345678" />
        </ConfigField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ConfigField label="master_key_label">
          <ConfigInput defaultValue="nexus-master-key-v4" />
        </ConfigField>
        <ConfigField label="signing_key_label">
          <ConfigInput defaultValue="nexus-signing-key-v4" />
        </ConfigField>
      </div>

      <ConfigField label="hsm.supported_algorithms">
        <div className="flex flex-wrap gap-1.5">
          {ALGORITHMS.map((algo) => (
            <span
              key={algo}
              className="px-2 py-0.5 rounded-small text-xs text-purple-400 border border-purple-900 bg-[#1A0A2A]"
            >
              {algo}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded-small text-xs text-gray-600 border border-accent bg-surface">
            + Add
          </span>
        </div>
      </ConfigField>

      <div className="pt-2 border-t border-subtle grid grid-cols-4 gap-2 text-center">
        <StatTile label="Module" tone="text-purple-400">Thales L7</StatTile>
        <StatTile label="FIPS" tone="text-neon">140-3 L3</StatTile>
        <StatTile label="Keys" tone="text-white">1,247</StatTile>
        <StatTile label="Slots" tone="text-neon">3/4</StatTile>
      </div>
    </PanelShell>
  );
}
