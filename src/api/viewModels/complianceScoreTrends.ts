import { useQuery } from "@tanstack/react-query";
import { fetchScoreTrends } from "../compliance";
import type { FrameworkId, TrendInsight, TrendSeries } from "../../types/compliance";
import type { ScoreTrendSeriesDTO } from "../types";

const FRAMEWORK_COLORS: Record<string, string> = {
  soc2: "#00FFA3",
  iso27001: "#60A4FA",
  gdpr: "#FBBF24",
  hipaa: "#A78BFA",
};

// The chart's viewBox is 0..600 (x) by 0..200 (y). Y grid lines map
// 100% -> 40, 90% -> 80, 80% -> 120, 70% -> 160.
const X_MIN = 40;
const X_MAX = 600;

function isFrameworkId(value: string): value is FrameworkId {
  return value === "soc2" || value === "iso27001" || value === "gdpr" || value === "hipaa";
}

function yForScore(score: number): number {
  return Math.max(40, Math.min(180, 40 + (100 - score) * 4));
}

function toSeries(dto: ScoreTrendSeriesDTO): TrendSeries {
  const n = dto.points.length;
  const coords = dto.points.map((point, index) => {
    const x = n <= 1 ? X_MAX : X_MIN + (X_MAX - X_MIN) * (index / (n - 1));
    return { x, y: yForScore(point.score) };
  });
  const linePath = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(0)},${coord.y.toFixed(1)}`)
    .join(" ");
  const last = coords[coords.length - 1] ?? { x: X_MAX, y: yForScore(dto.current_score) };
  const first = coords[0] ?? last;
  const areaPath = `${linePath} L${last.x.toFixed(0)},200 L${first.x.toFixed(0)},200 Z`;

  return {
    id: isFrameworkId(dto.code) ? dto.code : "soc2",
    label: dto.code.toUpperCase(),
    colorHex: FRAMEWORK_COLORS[dto.code] ?? "#60A4FA",
    linePath,
    areaPath,
    dot: last,
    currentScore: `${dto.current_score.toFixed(1)}%`,
    trendLabel: `${dto.delta >= 0 ? "↑" : "↓"} ${Math.abs(dto.delta).toFixed(1)}%`,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildXAxisLabels(series: ScoreTrendSeriesDTO[]): string[] {
  const base = series.find((s) => s.points.length > 0);
  if (!base) return [];
  const points = base.points;
  const count = Math.min(7, points.length);
  if (count <= 1) return points.map((p) => formatDate(p.captured_at));
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    const index = Math.round((i / (count - 1)) * (points.length - 1));
    labels.push(formatDate(points[index].captured_at));
  }
  return labels;
}

function buildInsights(series: ScoreTrendSeriesDTO[]): TrendInsight[] {
  if (series.length === 0) return [];
  const sorted = [...series].sort((a, b) => b.delta - a.delta);
  const insights: TrendInsight[] = [];
  const best = sorted[0];
  if (best && best.delta > 0) {
    insights.push({
      direction: "up",
      title: `${best.code.toUpperCase()} improving — up ${best.delta.toFixed(1)}% this window`,
      description: `Now at ${best.current_score.toFixed(1)}%`,
      tone: "neon",
    });
  }
  const worst = sorted[sorted.length - 1];
  if (worst && worst.delta < 0) {
    insights.push({
      direction: "down",
      title: `${worst.code.toUpperCase()} declining — down ${Math.abs(worst.delta).toFixed(1)}% this window`,
      description: `Now at ${worst.current_score.toFixed(1)}%`,
      tone: "warn",
    });
  }
  return insights;
}

export function useComplianceScoreTrendsViewModel() {
  const query = useQuery({
    queryKey: ["compliance", "score-trends"],
    queryFn: () => fetchScoreTrends(30),
  });
  const dto = query.data;

  return {
    series: dto ? dto.series.map(toSeries) : [],
    xAxisLabels: dto ? buildXAxisLabels(dto.series) : [],
    insights: dto ? buildInsights(dto.series) : [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
