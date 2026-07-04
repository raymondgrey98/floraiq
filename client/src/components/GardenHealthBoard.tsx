/**
 * GardenHealthBoard — at-a-glance health strip for My Garden.
 *
 * Computes everything client-side from the scan history in localStorage:
 * collection size, 14-day discovery sparkline, average AI confidence, and
 * the share of safe finds. Pure-SVG sparkline — no chart library needed at
 * this size, which keeps the bundle lean and the render instant.
 */
import { useMemo } from "react";
import ConfidenceRing from "@/components/ConfidenceRing";

interface Scan {
  id: number;
  confidence?: number;
  riskLevel?: string;
}

/** Discoveries per day for the last `days` days, oldest first. */
function activitySeries(scans: Scan[], days = 14): number[] {
  const counts = new Array(days).fill(0);
  const dayMs = 24 * 3600 * 1000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (const s of scans) {
    // scan ids are Date.now() timestamps set by the scan pipeline
    const age = Math.floor((today.getTime() + dayMs - s.id) / dayMs);
    if (age >= 0 && age < days) counts[days - 1 - age] += 1;
  }
  return counts;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120, h = 32, pad = 2;
  const max = Math.max(1, ...data);
  const pts = data
    .map((v, i) => {
      const x = pad + (i / (data.length - 1)) * (w - pad * 2);
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* soft area fill under the line */}
      <polyline
        points={`${pad},${h - pad} ${pts} ${w - pad},${h - pad}`}
        fill={`${color}22`}
        stroke="none"
      />
    </svg>
  );
}

export default function GardenHealthBoard({ scans }: { scans: Scan[] }) {
  const stats = useMemo(() => {
    const series = activitySeries(scans);
    const week = series.slice(-7).reduce((a, b) => a + b, 0);
    const avg = scans.length
      ? Math.round(scans.reduce((a, s) => a + (s.confidence || 80), 0) / scans.length)
      : 0;
    const safe = scans.length
      ? Math.round((scans.filter(s => !s.riskLevel || s.riskLevel === "safe").length / scans.length) * 100)
      : 100;
    return { series, week, avg, safe };
  }, [scans]);

  if (scans.length === 0) return null;

  return (
    <div className="glass mb-4 rounded-2xl border border-border/40 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Garden health
          </p>
          <p className="font-display text-xl font-semibold leading-tight">
            {scans.length} discoveries
          </p>
          <p className="text-[11px] text-muted-foreground">
            {stats.week > 0 ? `${stats.week} this week — keep going!` : "None this week — time for a walk?"}
          </p>
          <div className="mt-2">
            <Sparkline data={stats.series} color="#55c877" />
            <p className="text-[9px] text-muted-foreground">Last 14 days</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <ConfidenceRing confidence={stats.avg} size={60} showWord={false} />
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums text-leaf">{stats.safe}%</p>
            <p className="text-[9px] text-muted-foreground">safe finds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
