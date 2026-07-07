import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ConfigParameterDTO } from "../../api/types";
import { ConfigInput } from "./primitives/ConfigInput";
import { ConfigSelect } from "./primitives/ConfigSelect";
import { ConfigTextArea } from "./primitives/ConfigTextArea";
import { SegmentedButtons } from "./primitives/SegmentedButtons";
import { ToggleSwitch } from "./primitives/ToggleSwitch";
import { RangeSlider } from "./primitives/RangeSlider";

// --------------------------------------------------------------------------- //
// Context: real config parameters keyed by `key`, plus stage/revert actions.
// Bound field components read from here so the bespoke panels stay declarative
// (`<BoundInput paramKey="engine.name" />`) and every value comes from the API.
// --------------------------------------------------------------------------- //

interface ConfigBindingValue {
  byKey: Record<string, ConfigParameterDTO>;
  stage: (parameterId: string, value: string) => void;
  revert: (parameterId: string) => void;
}

const ConfigBindingContext = createContext<ConfigBindingValue | null>(null);

export function ConfigParamsProvider({
  byKey,
  stage,
  revert,
  children,
}: ConfigBindingValue & { children: ReactNode }) {
  return (
    <ConfigBindingContext.Provider value={{ byKey, stage, revert }}>
      {children}
    </ConfigBindingContext.Provider>
  );
}

function useBinding(): ConfigBindingValue {
  const ctx = useContext(ConfigBindingContext);
  if (!ctx) throw new Error("Config field used outside <ConfigParamsProvider>");
  return ctx;
}

export function useConfigParam(key: string): ConfigParameterDTO | undefined {
  return useBinding().byKey[key];
}

export function useConfigParamsMap(): Record<string, ConfigParameterDTO> {
  return useBinding().byKey;
}

/** The value a field should show: the staged (pending) value if any, else active. */
function effectiveValue(param: ConfigParameterDTO): string {
  return param.pending_value ?? param.active_value;
}

// --------------------------------------------------------------------------- //
// Bound field wrappers
// --------------------------------------------------------------------------- //

interface BoundProps {
  paramKey: string;
  className?: string;
}

export function BoundInput({ paramKey, className, type }: BoundProps & { type?: string }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  const shown = param ? effectiveValue(param) : "";
  const [draft, setDraft] = useState(shown);
  useEffect(() => setDraft(shown), [shown]);

  if (!param) {
    return <ConfigInput value="—" readOnly disabled className={className} />;
  }
  if (param.is_sensitive) {
    // Backend already returns the masked value; never editable from the client.
    return <ConfigInput type="password" value={param.active_value} readOnly disabled className={className} />;
  }
  return (
    <ConfigInput
      type={type}
      value={draft}
      warn={param.has_pending_change}
      className={className}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft !== shown) stage(param.id, draft);
      }}
    />
  );
}

export function BoundTextArea({ paramKey, rows = 2 }: BoundProps & { rows?: number }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  const shown = param ? effectiveValue(param) : "";
  const [draft, setDraft] = useState(shown);
  useEffect(() => setDraft(shown), [shown]);

  if (!param) return <ConfigTextArea rows={rows} value="—" readOnly disabled />;
  return (
    <ConfigTextArea
      rows={rows}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        if (draft !== shown) stage(param.id, draft);
      }}
    />
  );
}

export function BoundSelect({ paramKey, options }: BoundProps & { options?: string[] }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  if (!param) return <ConfigSelect options={options ?? ["—"]} disabled />;
  const opts = options ?? param.allowed_values ?? [param.active_value];
  return (
    <ConfigSelect
      options={opts}
      value={effectiveValue(param)}
      onChange={(event) => stage(param.id, event.target.value)}
    />
  );
}

export function BoundSegmented({ paramKey, options }: BoundProps & { options?: string[] }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  if (!param) return null;
  const opts = options ?? param.allowed_values ?? [param.active_value];
  const current = effectiveValue(param);
  return (
    <SegmentedButtons
      key={current}
      options={opts}
      defaultValue={current}
      onChange={(value) => stage(param.id, value)}
    />
  );
}

export function BoundToggle({ paramKey, size = "md" }: BoundProps & { size?: "sm" | "md" | "lg" }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  if (!param) return <ToggleSwitch defaultOn={false} size={size} disabled />;
  const on = effectiveValue(param) === "true";
  return (
    <ToggleSwitch
      key={String(on)}
      defaultOn={on}
      size={size}
      onChange={(next) => stage(param.id, next ? "true" : "false")}
    />
  );
}

export function BoundSlider({
  paramKey,
  min,
  max,
  formatValue,
}: BoundProps & { min: number; max: number; formatValue: (value: number) => string }) {
  const { byKey, stage } = useBinding();
  const param = byKey[paramKey];
  if (!param) return null;
  const current = Number(effectiveValue(param)) || min;
  return (
    <RangeSlider
      key={current}
      min={min}
      max={max}
      defaultValue={current}
      formatValue={formatValue}
      onCommit={(value) => stage(param.id, String(value))}
    />
  );
}

/** True when the named parameter has a staged-but-unapplied change. */
export function useHasPending(key: string): boolean {
  return Boolean(useBinding().byKey[key]?.has_pending_change);
}
