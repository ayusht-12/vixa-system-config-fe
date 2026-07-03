import { useQuery } from "@tanstack/react-query";
import { fetchComplianceOverview } from "../compliance";
import type {
  ComplianceKpiCard,
  ControlMappingRow,
  FrameworkCardData,
  FrameworkId,
  ResolvedViolation,
  SchemaFailure,
  ViolationEntry,
} from "../../types/compliance";
import type { TickerEntryData } from "../../components/ui/Ticker";
import { timeAgo } from "../../lib/format";
import type {
  ComplianceOverviewDTO,
  ControlMappingDTO,
  FrameworkDTO,
  SchemaValidationRowDTO,
  ViolationDTO,
} from "../types";

const FRAMEWORK_COLORS: Record<FrameworkId, string> = {
  soc2: "#00FFA3",
  iso27001: "#60A4FA",
  gdpr: "#A78BFA",
  hipaa: "#FBBF24",
};

function isFrameworkId(value: string): value is FrameworkId {
  return value === "soc2" || value === "iso27001" || value === "gdpr" || value === "hipaa";
}

function scoreTone(score: number): "neon" | "warn" | "danger" {
  if (score >= 85) return "neon";
  if (score >= 70) return "warn";
  return "danger";
}

function controlStatusPercent(status: string): number {
  if (status === "mapped") return 100;
  if (status === "partial") return 50;
  return 0;
}

function mapKpis(dto: ComplianceOverviewDTO): ComplianceKpiCard[] {
  const openViolations = dto.violations.filter((v) => v.status !== "resolved").length;
  const criticalViolations = dto.violations.filter(
    (v) => v.status !== "resolved" && v.severity === "critical",
  ).length;
  const certifiedCount = dto.frameworks.filter((f) => f.certified).length;

  return [
    {
      id: "overall-score",
      label: "Overall Compliance",
      value: dto.overall_score.toFixed(1),
      unit: "%",
      trendLabel: `${dto.frameworks.length} frameworks tracked`,
      barPercent: dto.overall_score,
      barColor: scoreTone(dto.overall_score),
      borderHex: "#00FFA3",
      glow: "",
      pulseDot: true,
    },
    {
      id: "certified",
      label: "Certified Frameworks",
      value: String(certifiedCount),
      unit: `/${dto.frameworks.length}`,
      trendLabel: "auditor-attested",
      barPercent: dto.frameworks.length ? (certifiedCount / dto.frameworks.length) * 100 : 0,
      barColor: "info",
      borderHex: "#60A4FA",
      glow: "",
    },
    {
      id: "open-violations",
      label: "Open Violations",
      value: String(openViolations),
      trendLabel: `${criticalViolations} critical`,
      barPercent: Math.min(100, openViolations * 10),
      barColor: openViolations > 0 ? "danger" : "neon",
      borderHex: "#FF3B3B",
      glow: "",
    },
    {
      id: "schema-pass-rate",
      label: "Schema Pass Rate",
      value: dto.schema_validation.pass_rate_percent.toFixed(1),
      unit: "%",
      trendLabel: `${dto.schema_validation.failure_count} failures today`,
      barPercent: dto.schema_validation.pass_rate_percent,
      barColor: dto.schema_validation.pass_rate_percent >= 99 ? "neon" : "warn",
      borderHex: "#FBBF24",
      glow: "",
    },
  ];
}

function mapFrameworks(dto: FrameworkDTO[]): FrameworkCardData[] {
  return dto.map((framework) => {
    const id: FrameworkId = isFrameworkId(framework.code) ? framework.code : "soc2";
    const tone = scoreTone(framework.score);
    return {
      id,
      badgeLabel: framework.display_name,
      badgeColorHex: FRAMEWORK_COLORS[id],
      subtitle: framework.subtitle,
      description: framework.description,
      statusLabel: framework.certified ? "CERTIFIED" : "IN PROGRESS",
      statusTone: framework.certified ? "neon" : "warn",
      score: framework.score.toFixed(1),
      scoreTone: tone,
      ringColorHex: FRAMEWORK_COLORS[id],
      ringPercent: framework.score,
      metaLines: [
        { label: "Auditor", value: framework.auditor ?? "—" },
        {
          label: "Cert expires",
          value: framework.cert_expires_at ? new Date(framework.cert_expires_at).toLocaleDateString() : "—",
        },
      ],
      breakdown: framework.control_breakdown.slice(0, 4).map((control) => ({
        label: control.control_domain,
        percent: controlStatusPercent(control.status),
        tone:
          control.status === "mapped" ? "neon" : control.status === "partial" ? "warn" : "danger",
      })),
      footerLeft: `${framework.open_violation_count} open violation${framework.open_violation_count === 1 ? "" : "s"}`,
      footerRight: framework.certified ? "Certified" : "Pending",
      footerRightTone: framework.certified ? "neon" : "warn",
      borderHex: FRAMEWORK_COLORS[id],
    };
  });
}

function mapControlMapping(dto: ComplianceOverviewDTO["control_coverage"]): {
  rows: ControlMappingRow[];
  summary: { fullyMapped: number; partial: number; gaps: number; total: number };
} {
  let fullyMapped = 0;
  let partial = 0;
  let gaps = 0;

  const emptyCell = (code: string): ControlMappingDTO => ({
    control_domain: "",
    control_description: "",
    control_code: code,
    status: "na",
  });

  const rows: ControlMappingRow[] = dto.map((row) => {
    if (row.coverage_percent >= 99.9) fullyMapped += 1;
    else if (row.coverage_percent > 0) partial += 1;
    else gaps += 1;

    const cells = {} as ControlMappingRow["cells"];
    (["soc2", "iso27001", "gdpr", "hipaa"] as FrameworkId[]).forEach((id) => {
      const cell = row.per_framework[id] ?? emptyCell("—");
      cells[id] = { code: cell.control_code || "—", status: cell.status as ControlMappingRow["cells"][FrameworkId]["status"] };
    });

    return {
      domain: row.control_domain,
      description: row.control_description,
      cells,
      coveragePercent: Math.round(row.coverage_percent),
      coverageTone: row.coverage_percent >= 85 ? "neon" : row.coverage_percent >= 60 ? "warn" : "danger",
    };
  });

  return { rows, summary: { fullyMapped, partial, gaps, total: rows.length } };
}

function mapViolations(dto: ViolationDTO[]): { active: ViolationEntry[]; resolved: ResolvedViolation | null } {
  const active = dto
    .filter((v) => v.status !== "resolved")
    .map((v) => ({
      id: v.id,
      tag: v.severity.toUpperCase(),
      tagTone: v.severity === "critical" ? ("danger" as const) : ("warn" as const),
      frameworkLabel: v.framework_code.toUpperCase(),
      frameworkColorHex: isFrameworkId(v.framework_code) ? FRAMEWORK_COLORS[v.framework_code] : "#60A4FA",
      timestamp: timeAgo(v.detected_at),
      title: v.title,
      description: v.description,
      meta: [{ label: "Control", value: v.control_reference }],
      actions: [],
      borderHex: v.severity === "critical" ? "#FF3B3B" : "#FBBF24",
      cardBgHex: v.severity === "critical" ? "#1A0505" : "#1A1200",
    }));

  const resolvedDto = dto.find((v) => v.status === "resolved");
  const resolved: ResolvedViolation | null = resolvedDto
    ? {
        id: resolvedDto.id,
        tenantLabel: resolvedDto.framework_code.toUpperCase(),
        resolvedAt: resolvedDto.resolved_at ? timeAgo(resolvedDto.resolved_at) : "—",
        description: resolvedDto.resolution_note ?? resolvedDto.title,
      }
    : null;

  return { active, resolved };
}

function mapSchemaFailures(dto: SchemaValidationRowDTO[]): SchemaFailure[] {
  return dto.map((row, index) => ({
    id: `${row.endpoint_path}-${index}`,
    endpoint: row.endpoint_path,
    timestamp: timeAgo(row.validated_at),
    title: row.schema_ref,
    codeLines: [{ text: row.error_message ?? "Validation failed", colorHex: "#FF3B3B" }],
    meta: [
      { label: "Tenant", value: row.tenant_slug ?? "—" },
      { label: "Ref", value: row.reference_id ?? "—" },
    ],
  }));
}

function mapTicker(violations: ViolationDTO[]): TickerEntryData[] {
  return violations.slice(0, 10).map((v) => ({
    id: v.id,
    labelText: v.severity.toUpperCase(),
    labelClassName: v.severity === "critical" ? "text-danger" : "text-warn",
    message: v.title,
  }));
}

export function useComplianceViewModel() {
  const query = useQuery({ queryKey: ["compliance", "overview"], queryFn: fetchComplianceOverview });
  const dto = query.data;

  const controlMapping = dto ? mapControlMapping(dto.control_coverage) : undefined;
  const violations = dto ? mapViolations(dto.violations) : undefined;

  const data = dto
    ? {
        ticker: mapTicker(dto.violations),
        kpis: mapKpis(dto),
        frameworks: mapFrameworks(dto.frameworks),
        controlMappingRows: controlMapping!.rows,
        controlMappingSummary: controlMapping!.summary,
        violations: violations!.active,
        resolvedViolation: violations!.resolved,
        schemaSummary: {
          totalToday: dto.schema_validation.total_today,
          passRate: `${dto.schema_validation.pass_rate_percent.toFixed(1)}%`,
          failures: dto.schema_validation.failure_count,
          passedLabel: `${dto.schema_validation.total_today - dto.schema_validation.failure_count} PASSED`,
          failedLabel: `${dto.schema_validation.failure_count} FAILED`,
        },
        schemaFailures: mapSchemaFailures(dto.schema_validation.failures),
      }
    : undefined;

  return { data, isLoading: query.isLoading, error: query.error as Error | null, refetch: query.refetch };
}
