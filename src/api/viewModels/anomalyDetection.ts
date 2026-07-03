import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acknowledgeAnomalyEvent,
  dismissAnomalyEvent,
  fetchAnomalyOverview,
  reopenAnomalyEvent,
  resolveAnomalyEvent,
} from "../anomalies";
import type {
  BaselineMetric,
  HeatmapRow,
  Incident,
  SeveritySummaryCard,
  ThreatCategoryStat,
  ThreatSeverity,
  ThreatStreamEvent,
  TickerItem,
} from "../../types/anomaly-detection";
import { timeAgo } from "../../lib/format";
import type {
  AnomalyDetectionOverviewDTO,
  AnomalyEventDTO,
  BehavioralBaselineDTO,
  IncidentDTO,
} from "../types";

const CATEGORY_PALETTE = ["#60A4FA", "#A78BFA", "#00FFA3", "#FBBF24", "#FF3B3B", "#22D3EE"];

function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
}

function isThreatSeverity(value: string): value is ThreatSeverity {
  return value === "critical" || value === "high" || value === "medium" || value === "low";
}

function toSeverity(value: string): ThreatSeverity {
  return isThreatSeverity(value) ? value : "low";
}

function mapTicker(events: AnomalyEventDTO[]): TickerItem[] {
  return events.slice(0, 10).map((event) => ({
    id: event.id,
    severity: toSeverity(event.severity),
    message: event.title,
  }));
}

function mapSeveritySummary(dto: AnomalyDetectionOverviewDTO["severity_summary"]): SeveritySummaryCard[] {
  const maxCount = Math.max(1, ...dto.map((bucket) => bucket.count));
  return dto.map((bucket) => ({
    severity: toSeverity(bucket.severity),
    label: bucket.severity.toUpperCase(),
    count: bucket.count,
    trendLabel:
      bucket.trend_delta === 0
        ? `flat vs ${bucket.trend_window_label}`
        : `${bucket.trend_delta > 0 ? "+" : ""}${bucket.trend_delta} vs ${bucket.trend_window_label}`,
    barPercent: Math.round((bucket.count / maxCount) * 100),
  }));
}

function eventActions(
  event: AnomalyEventDTO,
  handlers: {
    onAcknowledge: (id: string) => void;
    onResolve: (id: string) => void;
    onDismiss: (id: string) => void;
    onReopen: (id: string) => void;
  },
): ThreatStreamEvent["actions"] {
  if (event.status === "open") {
    return [
      { label: "Acknowledge", variant: "primary", onClick: () => handlers.onAcknowledge(event.id) },
      { label: "Dismiss", variant: "default", onClick: () => handlers.onDismiss(event.id) },
    ];
  }
  if (event.status === "investigating") {
    return [
      { label: "Resolve", variant: "primary", onClick: () => handlers.onResolve(event.id) },
      { label: "Dismiss", variant: "default", onClick: () => handlers.onDismiss(event.id) },
    ];
  }
  if (event.status === "resolved" || event.status === "dismissed") {
    return [{ label: "Reopen", variant: "default", onClick: () => handlers.onReopen(event.id) }];
  }
  return [];
}

function mapThreatStream(
  events: AnomalyEventDTO[],
  handlers: Parameters<typeof eventActions>[1],
): ThreatStreamEvent[] {
  return events.map((event) => ({
    id: event.id,
    severity: toSeverity(event.severity),
    score: Math.round(event.score * 100) / 100,
    category: event.category,
    categoryColorHex: categoryColor(event.category),
    timestamp: timeAgo(event.occurred_at),
    status: event.status.toUpperCase(),
    description: event.description,
    meta: [
      { label: "Actor", value: event.actor ?? "system" },
      { label: "Source IP", value: event.source_ip ?? "—" },
      {
        label: "Baseline σ",
        value: event.baseline_sigma !== null ? `${event.baseline_sigma}σ` : "—",
        tone: event.baseline_sigma !== null && event.baseline_sigma >= 3 ? "danger" : "default",
      },
      { label: "Status", value: event.status.toUpperCase() },
    ],
    actions: eventActions(event, handlers),
  }));
}

function mapBaselines(dto: BehavioralBaselineDTO[]): BaselineMetric[] {
  return dto.map((metric) => ({
    id: metric.metric_key,
    label: metric.label,
    baselineLabel: `baseline ${metric.baseline_value}${metric.unit}`,
    currentLabel: `${metric.current_value}${metric.unit}`,
    currentTone: metric.deviation_multiple >= 2 ? "danger" : metric.deviation_multiple >= 1.3 ? "warn" : "neon",
    percent: Math.min(100, metric.percent_of_upper_bound),
    barStyle: metric.deviation_multiple >= 2 ? "#FF3B3B" : metric.deviation_multiple >= 1.3 ? "#FBBF24" : "#00FFA3",
    markerPercent: Math.min(100, (metric.baseline_value / metric.upper_bound) * 100),
  }));
}

function mapHeatmap(dto: AnomalyDetectionOverviewDTO["heatmap"]): {
  rows: HeatmapRow[];
  footer: { peakWindow: string; peakSummary: string; total24h: string };
} {
  const severities: ThreatSeverity[] = ["critical", "high", "medium", "low"];
  const rows: HeatmapRow[] = severities.map((severity) => {
    const cells = new Array(24).fill(0);
    for (const cell of dto) {
      if (toSeverity(cell.severity) === severity) {
        cells[cell.hour] = cell.intensity_percent;
      }
    }
    return { severity, label: severity.toUpperCase(), cells };
  });

  let peakHour = 0;
  let peakCount = -1;
  let total = 0;
  const hourTotals = new Array(24).fill(0);
  for (const cell of dto) {
    hourTotals[cell.hour] += cell.count;
    total += cell.count;
  }
  hourTotals.forEach((count, hour) => {
    if (count > peakCount) {
      peakCount = count;
      peakHour = hour;
    }
  });

  const peakWindow = `${String(peakHour).padStart(2, "0")}:00–${String((peakHour + 1) % 24).padStart(2, "0")}:00`;

  return {
    rows,
    footer: {
      peakWindow,
      peakSummary: `${peakCount >= 0 ? peakCount : 0} events`,
      total24h: String(total),
    },
  };
}

function mapThreatCategories(dto: AnomalyDetectionOverviewDTO["threat_categories"]): {
  categories: ThreatCategoryStat[];
  total: number;
} {
  const tones: ThreatCategoryStat["tone"][] = ["danger", "warn", "info", "purple", "neon"];
  const total = dto.reduce((sum, c) => sum + c.count, 0);
  return {
    categories: dto.map((cat, index) => ({
      label: cat.category,
      count: cat.count,
      percent: Math.round(cat.percent),
      tone: tones[index % tones.length],
    })),
    total,
  };
}

function mapIncidents(dto: IncidentDTO[]): Incident[] {
  return dto.map((incident) => ({
    id: incident.id,
    code: incident.code,
    severity: incident.severity === "p1" ? "critical" : incident.severity === "p2" ? "high" : "medium",
    assignment: incident.status.replace("_", " ").toUpperCase(),
    slaLabel: incident.is_overdue ? "SLA breached" : "SLA remaining",
    slaValue:
      incident.sla_remaining_minutes !== null
        ? `${incident.sla_remaining_minutes}m`
        : incident.resolved_at
          ? "closed"
          : "—",
    slaTone: incident.is_overdue ? "danger" : incident.status === "resolved" ? "neon" : "warn",
    description: incident.summary,
    actions: [],
    resolved: incident.status === "resolved",
  }));
}

export function useAnomalyDetectionViewModel() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["anomalies", "overview"], queryFn: fetchAnomalyOverview });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["anomalies", "overview"] });
    queryClient.invalidateQueries({ queryKey: ["engine", "overview"] });
  }

  const handlers = {
    onAcknowledge: (id: string) => acknowledgeAnomalyEvent(id).then(invalidate),
    onResolve: (id: string) => resolveAnomalyEvent(id).then(invalidate),
    onDismiss: (id: string) => dismissAnomalyEvent(id).then(invalidate),
    onReopen: (id: string) => reopenAnomalyEvent(id).then(invalidate),
  };

  const dto = query.data;
  const heatmap = dto ? mapHeatmap(dto.heatmap) : undefined;
  const threatCategories = dto ? mapThreatCategories(dto.threat_categories) : undefined;

  const data = dto
    ? {
        streamStatus: { eventsPerSecond: Math.round(dto.stream_events_per_second), mlModel: dto.ml_model_name },
        tickerItems: mapTicker(dto.recent_events),
        severitySummary: mapSeveritySummary(dto.severity_summary),
        threatStreamEvents: mapThreatStream(dto.recent_events, handlers),
        baselineMetrics: mapBaselines(dto.baselines),
        heatmapRows: heatmap!.rows,
        heatmapFooter: heatmap!.footer,
        incidents: mapIncidents(dto.incidents),
        threatCategories: threatCategories!.categories,
        threatCategoryTotal: { windowLabel: "last 24h", totalEvents: threatCategories!.total },
      }
    : undefined;

  return {
    data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
