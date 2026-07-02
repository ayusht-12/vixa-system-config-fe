import type { ReactNode } from "react";
import type { EngineIdentity } from "../../types/command-center";
import { Badge } from "../ui/Badge";
import { SectionCard } from "../ui/SectionCard";

interface EngineIdentityBannerProps {
  identity: EngineIdentity;
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <div className="text-xs text-gray-600 mb-0.5 uppercase tracking-widest">
        {label}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-gray-800 hidden sm:block" />;
}

export function EngineIdentityBanner({ identity }: EngineIdentityBannerProps) {
  return (
    <div className="px-4 pt-4 pb-3">
      <SectionCard className="p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <Field label="Engine Instance · UUID-v7">
            <div className="font-heading font-semibold text-white text-sm tracking-wide">
              {identity.instanceId}
            </div>
          </Field>
          <Divider />
          <Field label="Region">
            <div className="text-sm text-gray-300">{identity.region}</div>
          </Field>
          <Divider />
          <Field label="Cluster Role">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse-dot" />
              <span className="text-sm text-neon font-medium">
                {identity.clusterRole}
              </span>
            </div>
          </Field>
          <Divider />
          <Field label="Uptime">
            <div className="text-sm text-gray-300">{identity.uptime}</div>
          </Field>
          <Divider />
          <Field label="Build Hash">
            <div className="text-sm text-gray-500">
              {identity.buildHash} · {identity.buildBranch}
            </div>
          </Field>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neon">● OPERATIONAL</Badge>
          <Badge tone="blue">OIDC ACTIVE</Badge>
          <Badge tone="purple">HSM BOUND</Badge>
        </div>
      </SectionCard>
    </div>
  );
}
