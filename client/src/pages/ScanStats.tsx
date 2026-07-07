import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, BarChart3, Flame, Trophy, Sparkles, Camera, Leaf, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ScanEntry {
  id: number; // Date.now() at scan time
  name: string;
  scientific: string;
  type: string;
  confidence: number; // 0–100
  photoUrl?: string;
  date: string;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Consecutive days with at least one scan, counting back from today (or yesterday). */
function computeStreak(entries: ScanEntry[]): number {
  const days = new Set(entries.map(e => dayKey(e.id)));
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  // streak may start today or yesterday
  if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const TYPE_COLORS: Record<string, string> = {
  Plant: "#10b981", Bird: "#38bdf8", Insect: "#f59e0b", Mushroom: "#a78bfa",
  Animal: "#f87171", Flower: "#f472b6", Tree: "#34d399",
};

export default function ScanStats() {
  const [history, setHistory] = useState<ScanEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("floraiq_scan_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const speciesCounts = new Map<string, { name: string; count: number }>();
    const typeCounts = new Map<string, number>();
    let best: ScanEntry | null = null;

    for (const e of history) {
      const key = e.scientific || e.name;
      const cur = speciesCounts.get(key) ?? { name: e.name || key, count: 0 };
      cur.count++;
      speciesCounts.set(key, cur);
      typeCounts.set(e.type || "Other", (typeCounts.get(e.type || "Other") ?? 0) + 1);
      if (!best || (e.confidence ?? 0) > (best.confidence ?? 0)) best = e;
    }

    const topSpecies = Array.from(speciesCounts.entries())
      .map(([sci, v]) => ({ sci, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Last 14 days activity
    const activity: { day: string; label: string; scans: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dayKey(d.getTime());
      activity.push({
        day: key,
        label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2),
        scans: history.filter(e => dayKey(e.id) === key).length,
      });
    }

    const byType = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    const avgConfidence = total
      ? Math.round(history.reduce((s, e) => s + (e.confidence ?? 0), 0) / total)
      : 0;

    return {
      total,
      unique: speciesCounts.size,
      streak: computeStreak(history),
      topSpecies,
      activity,
      byType,
      best,
      avgConfidence,
    };
  }, [history]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <h1 className="text-xl font-bold">My Scan Stats</h1>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-6">
        {history.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No scans yet</h3>
            <p className="text-muted-foreground text-sm mb-6">Scan your first plant, bird, or bug and your stats will appear here</p>
            <Link href="/scan">
              <button type="button" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold text-sm">
                Start Scanning
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Headline numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <Camera className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total scans</p>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <Leaf className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.unique}</p>
                <p className="text-xs text-muted-foreground">Unique species</p>
              </div>
              <div className="glass rounded-xl p-4 border border-orange-500/30 text-center">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">Day streak</p>
              </div>
              <div className="glass rounded-xl p-4 border border-border/50 text-center">
                <Target className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg confidence</p>
              </div>
            </div>

            {/* 14-day activity */}
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />Last 14 Days
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.activity} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(16,185,129,0.08)" }}
                      contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
                      labelFormatter={(_, p) => (p?.[0]?.payload as any)?.day ?? ""}
                    />
                    <Bar dataKey="scans" radius={[4, 4, 0, 0]}>
                      {stats.activity.map((d, i) => (
                        <Cell key={i} fill={d.scans > 0 ? "#10b981" : "#27272a"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top species */}
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />Most Scanned Species
              </h3>
              <div className="space-y-2">
                {stats.topSpecies.map((s, i) => (
                  <div key={s.sci} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground italic truncate">{s.sci}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${Math.max((s.count / stats.topSpecies[0].count) * 80, 8)}px` }} />
                      <span className="text-xs font-bold text-emerald-400 w-6 text-right">{s.count}×</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scans by type */}
            <div className="glass rounded-xl p-5 border border-border/50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />Scans by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {stats.byType.map(t => (
                  <span key={t.type} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border/50"
                    style={{ color: TYPE_COLORS[t.type] ?? "#a1a1aa" }}>
                    {t.type} · {t.count}
                  </span>
                ))}
              </div>
            </div>

            {/* Best find */}
            {stats.best && (
              <div className="glass rounded-xl p-5 border border-amber-500/30">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />Best Find (highest confidence)
                </h3>
                <div className="flex items-center gap-4">
                  {stats.best.photoUrl && (
                    <img src={stats.best.photoUrl} alt={stats.best.name}
                      className="w-16 h-16 rounded-xl object-cover border border-border/50" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{stats.best.name}</p>
                    <p className="text-xs text-muted-foreground italic truncate">{stats.best.scientific}</p>
                    <p className="text-xs text-amber-400 font-bold mt-1">{stats.best.confidence}% confidence · {stats.best.date}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
