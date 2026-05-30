import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, Trash2, CheckCircle, Clock, AlertCircle, Leaf, ChevronLeft, Bell } from "lucide-react";

interface TrackedPlant {
  id: string;
  name: string;
  species?: string;
  photo?: string;
  waterEveryDays: number;
  lastWatered: string; // ISO date
  notes?: string;
  location?: string;
}

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now  = Date.now();
  return Math.floor((now - then) / 86400000);
}

function statusFor(plant: TrackedPlant): { label: string; color: string; urgent: boolean } {
  const days = daysSince(plant.lastWatered);
  const due  = plant.waterEveryDays;
  if (days >= due + 1) return { label: "Overdue!", color: "text-red-400", urgent: true };
  if (days >= due)     return { label: "Water today", color: "text-amber-400", urgent: true };
  const left = due - days;
  if (left === 1)      return { label: "Tomorrow", color: "text-yellow-400", urgent: false };
  return { label: `In ${left} days`, color: "text-emerald-400", urgent: false };
}

const FREQ_PRESETS = [
  { label: "Daily",        days: 1 },
  { label: "Every 2 days", days: 2 },
  { label: "Every 3 days", days: 3 },
  { label: "Weekly",       days: 7 },
  { label: "Bi-weekly",    days: 14 },
  { label: "Monthly",      days: 30 },
];

export default function WaterTracker() {
  const [plants, setPlants]     = useState<TrackedPlant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState<"all" | "urgent" | "ok">("all");
  const [form, setForm]         = useState({
    name: "", species: "", waterEveryDays: 3, notes: "", location: "",
  });

  useEffect(() => {
    try {
      const s = localStorage.getItem("floraiq_water_tracker");
      if (s) setPlants(JSON.parse(s));
    } catch {}
  }, []);

  function save(list: TrackedPlant[]) {
    setPlants(list);
    localStorage.setItem("floraiq_water_tracker", JSON.stringify(list));
  }

  function addPlant() {
    if (!form.name.trim()) return;
    const p: TrackedPlant = {
      id: Date.now().toString(),
      name: form.name,
      species: form.species || undefined,
      waterEveryDays: form.waterEveryDays,
      lastWatered: new Date().toISOString(),
      notes: form.notes || undefined,
      location: form.location || undefined,
    };
    save([...plants, p]);
    setForm({ name: "", species: "", waterEveryDays: 3, notes: "", location: "" });
    setShowForm(false);
  }

  function waterPlant(id: string) {
    save(plants.map(p => p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p));
  }

  function deletePlant(id: string) {
    save(plants.filter(p => p.id !== id));
  }

  const urgentCount = plants.filter(p => statusFor(p).urgent).length;

  const filtered = plants.filter(p => {
    if (filter === "urgent") return statusFor(p).urgent;
    if (filter === "ok")     return !statusFor(p).urgent;
    return true;
  }).sort((a, b) => {
    const da = daysSince(a.lastWatered) / a.waterEveryDays;
    const db = daysSince(b.lastWatered) / b.waterEveryDays;
    return db - da;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
            <Droplets className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold">Water Tracker</h1>
            {urgentCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {urgentCount} need water
              </span>
            )}
          </div>
          <Button type="button" onClick={() => setShowForm(true)} size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-1" />Add Plant
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="container flex gap-1 pb-3">
          {[
            { id: "all",    label: `All (${plants.length})` },
            { id: "urgent", label: `Need Water (${urgentCount})` },
            { id: "ok",     label: "On Schedule" },
          ].map(f => (
            <button type="button" key={f.id} onClick={() => setFilter(f.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === f.id ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6 max-w-3xl">
        {/* Add plant form */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowForm(false)}>
            <div className="glass rounded-2xl border border-blue-500/30 w-full max-w-md p-6 space-y-4"
              onClick={e => e.stopPropagation()}>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />Add Plant to Track
              </h2>

              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Plant name (e.g. Tomato, Orchid, Monstera) *"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <input value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))}
                placeholder="Scientific name (optional)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Watering frequency</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {FREQ_PRESETS.map(preset => (
                    <button type="button" key={preset.days} onClick={() => setForm(f => ({ ...f, waterEveryDays: preset.days }))}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        form.waterEveryDays === preset.days
                          ? "bg-blue-500 text-white"
                          : "glass border border-border/50 text-muted-foreground hover:text-foreground"
                      }`}>
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Custom:</span>
                  <input type="number" min="1" max="365" value={form.waterEveryDays}
                    onChange={e => setForm(f => ({ ...f, waterEveryDays: parseInt(e.target.value) || 1 }))}
                    className="w-20 bg-background border border-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="text-xs text-muted-foreground">days</span>
                </div>
              </div>

              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Location (e.g. Balcony, Garden, Bedroom)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Notes (optional)"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              <div className="flex gap-2">
                <Button type="button" onClick={addPlant} disabled={!form.name.trim()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50">
                  <Droplets className="w-4 h-4 mr-2" />Add Plant
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-border/50">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {plants.length === 0 && (
          <div className="text-center py-20">
            <Droplets className="w-16 h-16 text-blue-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No plants tracked yet</h3>
            <p className="text-muted-foreground mb-6 text-sm">Add your plants and FloraIQ will remind you when to water them</p>
            <Button type="button" onClick={() => setShowForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />Add Your First Plant
            </Button>
          </div>
        )}

        {/* Plant cards */}
        <div className="space-y-3">
          {filtered.map(plant => {
            const status = statusFor(plant);
            const days   = daysSince(plant.lastWatered);
            const pct    = Math.min((days / plant.waterEveryDays) * 100, 100);

            return (
              <div key={plant.id} className={`glass rounded-xl p-5 border transition-all ${
                status.urgent ? "border-amber-500/30" : "border-border/50"
              }`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    status.urgent ? "bg-amber-500/20" : "bg-blue-500/10"
                  }`}>
                    {status.urgent
                      ? <AlertCircle className="w-6 h-6 text-amber-400" />
                      : <Leaf className="w-6 h-6 text-emerald-400" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold">{plant.name}</h3>
                        {plant.species && <p className="text-xs text-muted-foreground italic">{plant.species}</p>}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                        status.urgent ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Water progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Last watered {days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`}</span>
                        <span>Every {plant.waterEveryDays}d</span>
                      </div>
                      <div className="h-1.5 bg-border/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: pct >= 100 ? "#f97316" : pct >= 80 ? "#f59e0b" : "#3b82f6" }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {plant.location && <span>📍 {plant.location}</span>}
                      {plant.notes && <span className="truncate">📝 {plant.notes}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button type="button" onClick={() => waterPlant(plant.id)} size="sm"
                    className={`flex-1 ${status.urgent ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-500/20 hover:bg-blue-500/40 text-blue-400"} text-white`}>
                    <Droplets className="w-4 h-4 mr-1" />
                    {status.urgent ? "Water Now!" : "Mark Watered"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => deletePlant(plant.id)}
                    className="border-border/50 text-muted-foreground hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        {plants.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="glass rounded-xl p-4 border border-border/50 text-center">
              <p className="text-2xl font-bold text-blue-400">{plants.length}</p>
              <p className="text-xs text-muted-foreground">Plants tracked</p>
            </div>
            <div className="glass rounded-xl p-4 border border-red-500/20 text-center">
              <p className="text-2xl font-bold text-red-400">{urgentCount}</p>
              <p className="text-xs text-muted-foreground">Need water</p>
            </div>
            <div className="glass rounded-xl p-4 border border-emerald-500/20 text-center">
              <p className="text-2xl font-bold text-emerald-400">{plants.length - urgentCount}</p>
              <p className="text-xs text-muted-foreground">On schedule</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="glass rounded-xl p-5 border border-border/50 mt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-blue-400" />Watering Tips
          </h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• Water in the morning to reduce evaporation</li>
            <li>• Check soil moisture before watering — stick finger 2cm deep</li>
            <li>• Tropical plants (Malaysia) generally need more water</li>
            <li>• Reduce watering during rainy season</li>
            <li>• Yellow leaves = overwatering, wilting = underwatering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
