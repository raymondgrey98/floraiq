import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Sprout, Droplets, FlaskConical, Shovel, Plus, Trash2,
  HeartPulse, Camera, X, CalendarClock, StickyNote,
} from "lucide-react";
import { requestNotificationPermission, scheduleWaterReminder, cancelNotification } from "@/lib/notifications";

// My Garden — unified plant lifecycle hub (PictureThis "My Plants" equivalent).
// Shares the floraiq_water_tracker storage key with WaterTracker: existing plants
// appear here automatically, and extra care fields are simply ignored over there.

interface GardenPlant {
  id: string;
  name: string;
  species?: string;
  photo?: string;
  waterEveryDays: number;
  lastWatered: string;
  fertilizeEveryDays?: number;
  lastFertilized?: string;
  repotEveryMonths?: number;
  lastRepotted?: string;
  notes?: string;
  location?: string;
}

interface ScanEntry { id: number; name: string; scientific: string; photoUrl?: string; }

const STORE_KEY = "floraiq_water_tracker";

function daysSince(iso?: string): number {
  if (!iso) return Infinity;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

interface CareItem {
  kind: "water" | "fertilize" | "repot";
  label: string;
  dueIn: number; // days until due (negative = overdue)
}

function careStatus(p: GardenPlant): CareItem[] {
  const items: CareItem[] = [
    { kind: "water", label: "Water", dueIn: p.waterEveryDays - daysSince(p.lastWatered) },
  ];
  if (p.fertilizeEveryDays) {
    items.push({ kind: "fertilize", label: "Fertilize", dueIn: p.fertilizeEveryDays - daysSince(p.lastFertilized ?? p.lastWatered) });
  }
  if (p.repotEveryMonths) {
    items.push({ kind: "repot", label: "Repot", dueIn: p.repotEveryMonths * 30 - daysSince(p.lastRepotted ?? p.lastWatered) });
  }
  return items;
}

/** 0–100 health score from care punctuality. */
function healthScore(p: GardenPlant): number {
  let score = 100;
  for (const c of careStatus(p)) {
    if (c.dueIn < 0) score -= Math.min(Math.abs(c.dueIn) * (c.kind === "water" ? 8 : 3), 40);
  }
  return Math.max(10, Math.round(score));
}

function scoreColor(s: number): string {
  if (s >= 80) return "#10b981";
  if (s >= 55) return "#f59e0b";
  return "#ef4444";
}

const CARE_ICONS = {
  water: Droplets,
  fertilize: FlaskConical,
  repot: Shovel,
} as const;

export default function MyGarden() {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [selected, setSelected] = useState<GardenPlant | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [form, setForm] = useState({ name: "", species: "", waterEveryDays: 3, fertilizeEveryDays: 30, repotEveryMonths: 12, location: "", notes: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setPlants(JSON.parse(raw));
      const hist = localStorage.getItem("floraiq_scan_history");
      if (hist) setScans(JSON.parse(hist).slice(0, 12));
    } catch {}
  }, []);

  function save(list: GardenPlant[]) {
    setPlants(list);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
    if (selected) setSelected(list.find(p => p.id === selected.id) ?? null);
  }

  async function addPlant(fromScan?: ScanEntry) {
    const name = fromScan?.name ?? form.name.trim();
    if (!name) return;
    const p: GardenPlant = {
      id: Date.now().toString(),
      name,
      species: fromScan?.scientific ?? (form.species || undefined),
      photo: fromScan?.photoUrl,
      waterEveryDays: form.waterEveryDays,
      lastWatered: new Date().toISOString(),
      fertilizeEveryDays: form.fertilizeEveryDays || undefined,
      lastFertilized: new Date().toISOString(),
      repotEveryMonths: form.repotEveryMonths || undefined,
      lastRepotted: new Date().toISOString(),
      location: form.location || undefined,
      notes: form.notes || undefined,
    };
    save([...plants, p]);
    const granted = await requestNotificationPermission();
    if (granted) {
      await scheduleWaterReminder({ id: parseInt(p.id.slice(-6)), plantName: p.name, daysFromNow: p.waterEveryDays });
    }
    setForm({ name: "", species: "", waterEveryDays: 3, fertilizeEveryDays: 30, repotEveryMonths: 12, location: "", notes: "" });
    setShowAdd(false);
  }

  async function doCare(id: string, kind: CareItem["kind"]) {
    const now = new Date().toISOString();
    const next = plants.map(p => {
      if (p.id !== id) return p;
      if (kind === "water") return { ...p, lastWatered: now };
      if (kind === "fertilize") return { ...p, lastFertilized: now };
      return { ...p, lastRepotted: now };
    });
    save(next);
    if (kind === "water") {
      const plant = next.find(p => p.id === id);
      if (plant) {
        const nid = parseInt(id.slice(-6));
        await cancelNotification(nid);
        await scheduleWaterReminder({ id: nid, plantName: plant.name, daysFromNow: plant.waterEveryDays });
      }
    }
  }

  async function removePlant(id: string) {
    await cancelNotification(parseInt(id.slice(-6)));
    save(plants.filter(p => p.id !== id));
    setSelected(null);
  }

  const avgHealth = useMemo(
    () => (plants.length ? Math.round(plants.reduce((s, p) => s + healthScore(p), 0) / plants.length) : 0),
    [plants],
  );
  const dueCount = plants.filter(p => careStatus(p).some(c => c.dueIn <= 0)).length;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
            <Sprout className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">My Garden</h1>
            {dueCount > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">{dueCount} need care</span>
            )}
          </div>
          <Button type="button" size="sm" onClick={() => setShowAdd(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-1" />Add Plant
          </Button>
        </div>
      </div>

      <div className="container py-6 max-w-3xl space-y-6">
        {/* Garden overview */}
        {plants.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-emerald-400">{plants.length}</p>
              <p className="text-xs text-muted-foreground">Plants</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold" style={{ color: scoreColor(avgHealth) }}>{avgHealth}</p>
              <p className="text-xs text-muted-foreground">Garden health</p>
            </div>
            <div className="glass rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-amber-400">{dueCount}</p>
              <p className="text-xs text-muted-foreground">Need care</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {plants.length === 0 && (
          <div className="text-center py-16">
            <Sprout className="w-16 h-16 text-emerald-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your garden is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">Add a plant manually or import one from your scans</p>
            <Button type="button" onClick={() => setShowAdd(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />Add Your First Plant
            </Button>
          </div>
        )}

        {/* Plant grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {plants.map(p => {
            const score = healthScore(p);
            const due = careStatus(p).filter(c => c.dueIn <= 0);
            return (
              <button type="button" key={p.id} onClick={() => setSelected(p)}
                className="glass rounded-2xl border border-border/50 p-4 text-left hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  {p.photo
                    ? <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    : <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Sprout className="w-6 h-6 text-emerald-400" /></div>}
                  <div className="relative w-10 h-10">
                    <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={scoreColor(score)} strokeWidth="3"
                        strokeDasharray={`${(score / 100) * 94.2} 94.2`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color: scoreColor(score) }}>{score}</span>
                  </div>
                </div>
                <p className="font-semibold text-sm truncate">{p.name}</p>
                {p.species && <p className="text-[11px] text-muted-foreground italic truncate">{p.species}</p>}
                <div className="flex gap-1.5 mt-2">
                  {due.length === 0
                    ? <span className="text-[10px] text-emerald-400 font-semibold">All care up to date</span>
                    : due.map(c => {
                        const Icon = CARE_ICONS[c.kind];
                        return <span key={c.kind} className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold"><Icon className="w-3 h-3" />{c.label}</span>;
                      })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Plant detail sheet ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl border border-emerald-500/30 w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {selected.photo
                  ? <img src={selected.photo} alt={selected.name} className="w-14 h-14 rounded-xl object-cover" />
                  : <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Sprout className="w-7 h-7 text-emerald-400" /></div>}
                <div>
                  <h2 className="font-bold text-lg leading-tight">{selected.name}</h2>
                  {selected.species && <p className="text-xs text-muted-foreground italic">{selected.species}</p>}
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex items-center gap-2 glass rounded-xl border border-border/50 p-3">
              <HeartPulse className="w-5 h-5" style={{ color: scoreColor(healthScore(selected)) }} />
              <span className="text-sm font-semibold">Health score</span>
              <span className="ml-auto text-xl font-bold" style={{ color: scoreColor(healthScore(selected)) }}>{healthScore(selected)}/100</span>
            </div>

            {/* Care schedule rows */}
            <div className="space-y-2">
              {careStatus(selected).map(c => {
                const Icon = CARE_ICONS[c.kind];
                const overdue = c.dueIn <= 0;
                return (
                  <div key={c.kind} className={`flex items-center gap-3 rounded-xl border p-3 ${overdue ? "border-amber-500/40 bg-amber-500/5" : "border-border/50"}`}>
                    <Icon className={`w-5 h-5 ${overdue ? "text-amber-400" : "text-sky-400"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.label}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" />
                        {overdue ? `Overdue by ${Math.abs(c.dueIn)} day${Math.abs(c.dueIn) === 1 ? "" : "s"}` : `Due in ${c.dueIn} day${c.dueIn === 1 ? "" : "s"}`}
                      </p>
                    </div>
                    <Button type="button" size="sm" onClick={() => doCare(selected.id, c.kind)}
                      className={overdue ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400"}>
                      Done
                    </Button>
                  </div>
                );
              })}
            </div>

            {selected.notes && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <StickyNote className="w-4 h-4 flex-shrink-0" />{selected.notes}
              </div>
            )}

            <Button type="button" variant="outline" onClick={() => removePlant(selected.id)}
              className="w-full border-border/50 text-muted-foreground hover:text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />Remove from garden
            </Button>
          </div>
        </div>
      )}

      {/* ── Add plant sheet ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="glass rounded-2xl border border-emerald-500/30 w-full max-w-md p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg flex items-center gap-2"><Sprout className="w-5 h-5 text-emerald-400" />Add to My Garden</h2>

            {scans.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Camera className="w-3 h-3" />Import from your recent scans</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {scans.map(s => (
                    <button type="button" key={s.id} onClick={() => addPlant(s)}
                      className="flex-shrink-0 w-20 glass rounded-xl border border-border/50 p-2 hover:border-emerald-500/40 transition-all">
                      {s.photoUrl
                        ? <img src={s.photoUrl} alt={s.name} className="w-full h-14 rounded-lg object-cover mb-1" />
                        : <div className="w-full h-14 rounded-lg bg-emerald-500/10 mb-1" />}
                      <p className="text-[10px] font-semibold truncate">{s.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Plant name *"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))}
              placeholder="Scientific name (optional)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Water every</p>
                <div className="flex items-center gap-1">
                  <input type="number" min="1" max="60" value={form.waterEveryDays}
                    onChange={e => setForm(f => ({ ...f, waterEveryDays: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm" />
                  <span className="text-[11px] text-muted-foreground">d</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Fertilize every</p>
                <div className="flex items-center gap-1">
                  <input type="number" min="0" max="365" value={form.fertilizeEveryDays}
                    onChange={e => setForm(f => ({ ...f, fertilizeEveryDays: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm" />
                  <span className="text-[11px] text-muted-foreground">d</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Repot every</p>
                <div className="flex items-center gap-1">
                  <input type="number" min="0" max="60" value={form.repotEveryMonths}
                    onChange={e => setForm(f => ({ ...f, repotEveryMonths: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-sm" />
                  <span className="text-[11px] text-muted-foreground">mo</span>
                </div>
              </div>
            </div>

            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="Location (balcony, garden, indoors…)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />

            <div className="flex gap-2">
              <Button type="button" onClick={() => addPlant()} disabled={!form.name.trim()}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50">
                <Plus className="w-4 h-4 mr-2" />Add Plant
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)} className="border-border/50">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
