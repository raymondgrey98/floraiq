import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, Plus, Camera, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Plant { id: string; name: string; species?: string; startDate: string; entries: Entry[] }
interface Entry { id: string; date: string; height: number; notes?: string; photo?: string; health: "excellent"|"good"|"fair"|"poor" }

const HEALTH_COLOR = { excellent:"text-emerald-400", good:"text-green-400", fair:"text-amber-400", poor:"text-red-400" };

export default function GrowthLog() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selected, setSelected] = useState<Plant|null>(null);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [plantForm, setPlantForm] = useState({ name:"", species:"" });
  const [entryForm, setEntryForm] = useState({ height:"", notes:"", health:"good" as Entry["health"], photo:"" });
  const camRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { const s = localStorage.getItem("floraiq_growth_log"); if (s) { const p = JSON.parse(s); setPlants(p); if (p.length) setSelected(p[0]); } } catch {}
  }, []);

  function save(list: Plant[]) { setPlants(list); localStorage.setItem("floraiq_growth_log", JSON.stringify(list)); }

  function addPlant() {
    if (!plantForm.name.trim()) return;
    const p: Plant = { id: Date.now().toString(), name: plantForm.name, species: plantForm.species || undefined, startDate: new Date().toISOString(), entries: [] };
    const updated = [...plants, p];
    save(updated); setSelected(p); setPlantForm({ name:"", species:"" }); setShowAddPlant(false);
  }

  function addEntry() {
    if (!selected || !entryForm.height) return;
    const e: Entry = { id: Date.now().toString(), date: new Date().toISOString(), height: Number(entryForm.height), notes: entryForm.notes || undefined, health: entryForm.health, photo: entryForm.photo || undefined };
    const updated = plants.map(p => p.id === selected.id ? { ...p, entries: [...p.entries, e] } : p);
    const sel = updated.find(p => p.id === selected.id)!;
    save(updated); setSelected(sel); setEntryForm({ height:"", notes:"", health:"good", photo:"" }); setShowAddEntry(false);
  }

  function deletePlant(id: string) { const updated = plants.filter(p => p.id !== id); save(updated); setSelected(updated[0] || null); }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = ev => setEntryForm(x => ({...x, photo: ev.target?.result as string})); reader.readAsDataURL(f);
  }

  const growth = selected && selected.entries.length >= 2
    ? selected.entries[selected.entries.length-1].height - selected.entries[0].height : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
            <span className="text-2xl">📈</span>
            <h1 className="text-xl font-bold">Plant Growth Log</h1>
          </div>
          <Button type="button" size="sm" onClick={() => setShowAddPlant(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white"><Plus className="w-4 h-4 mr-1" />Add Plant</Button>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Plant list */}
          <div className="space-y-1.5">
            {plants.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No plants tracked yet</div>}
            {plants.map(p => (
              <button type="button" key={p.id} onClick={() => setSelected(p)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected?.id === p.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/40 hover:border-emerald-500/30"}`}>
                <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.entries.length} entries · {p.species || "No species"}</p></div>
                <button type="button" onClick={e => { e.stopPropagation(); deletePlant(p.id); }} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </button>
            ))}
            {showAddPlant && (
              <div className="glass rounded-xl p-4 border border-emerald-500/40 space-y-3">
                <input value={plantForm.name} onChange={e => setPlantForm(x => ({...x, name: e.target.value}))} placeholder="Plant name *" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input value={plantForm.species} onChange={e => setPlantForm(x => ({...x, species: e.target.value}))} placeholder="Species (optional)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addPlant} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">Add</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowAddPlant(false)} className="border-border/50">Cancel</Button>
                </div>
              </div>
            )}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-xl p-5 border border-emerald-500/30">
                <div className="flex justify-between items-start mb-4">
                  <div><h2 className="text-xl font-bold">{selected.name}</h2>{selected.species && <p className="text-xs italic text-muted-foreground">{selected.species}</p>}</div>
                  <Button type="button" size="sm" onClick={() => setShowAddEntry(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white"><Plus className="w-4 h-4 mr-1" />Log Entry</Button>
                </div>

                {selected.entries.length >= 2 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="glass rounded-xl p-3 border border-emerald-500/20 text-center"><p className="text-lg font-bold text-emerald-400">{selected.entries[selected.entries.length-1].height}cm</p><p className="text-xs text-muted-foreground">Current height</p></div>
                    <div className="glass rounded-xl p-3 border border-blue-500/20 text-center"><p className="text-lg font-bold text-blue-400">+{growth}cm</p><p className="text-xs text-muted-foreground">Total growth</p></div>
                    <div className="glass rounded-xl p-3 border border-purple-500/20 text-center"><p className="text-lg font-bold text-purple-400">{selected.entries.length}</p><p className="text-xs text-muted-foreground">Entries</p></div>
                  </div>
                )}

                {showAddEntry && (
                  <div className="glass rounded-xl p-4 border border-emerald-500/40 mb-4 space-y-3">
                    <div className="flex gap-2">
                      <input type="number" value={entryForm.height} onChange={e => setEntryForm(x => ({...x, height: e.target.value}))} placeholder="Height (cm) *" className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      <select value={entryForm.health} onChange={e => setEntryForm(x => ({...x, health: e.target.value as Entry["health"]}))} className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                      </select>
                    </div>
                    <input value={entryForm.notes} onChange={e => setEntryForm(x => ({...x, notes: e.target.value}))} placeholder="Notes (optional)" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input ref={camRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => camRef.current?.click()} className="flex items-center gap-1 text-xs glass border border-border/50 px-3 py-2 rounded-lg text-muted-foreground hover:text-white"><Camera className="w-3.5 h-3.5" />{entryForm.photo ? "Photo added" : "Add photo"}</button>
                      <Button type="button" size="sm" onClick={addEntry} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">Save Entry</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setShowAddEntry(false)} className="border-border/50">Cancel</Button>
                    </div>
                  </div>
                )}

                {/* Entry list */}
                <div className="space-y-2">
                  {[...selected.entries].reverse().map((entry, i) => (
                    <div key={entry.id} className="flex items-center gap-4 glass rounded-lg p-3 border border-border/30">
                      {entry.photo && <img src={entry.photo} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{entry.height}cm</p>
                          <span className={`text-xs font-bold ${HEALTH_COLOR[entry.health]}`}>{entry.health}</span>
                          <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        {entry.notes && <p className="text-xs text-muted-foreground">{entry.notes}</p>}
                      </div>
                    </div>
                  ))}
                  {selected.entries.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No entries yet. Log your first measurement!</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
