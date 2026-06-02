import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, Trash2, ExternalLink, Calendar, Camera } from "lucide-react";

interface ScanEntry {
  id: number;
  name: string;
  scientific: string;
  type: string;
  confidence?: number;
  photoUrl?: string;
  date?: string;
  riskLevel?: string;
  description?: string;
  habitat?: string;
}

// Plain-language type labels — no jargon
const TYPE_LABELS: Record<string, { emoji: string; label: string; color: string }> = {
  plant:    { emoji:"🌿", label:"Plant",     color:"bg-green-500/20 text-green-400" },
  insect:   { emoji:"🐛", label:"Bug",       color:"bg-yellow-500/20 text-yellow-400" },
  bird:     { emoji:"🐦", label:"Bird",      color:"bg-blue-500/20 text-blue-400" },
  mushroom: { emoji:"🍄", label:"Mushroom",  color:"bg-purple-500/20 text-purple-400" },
  reptile:  { emoji:"🦎", label:"Reptile",   color:"bg-lime-500/20 text-lime-400" },
  marine:   { emoji:"🐠", label:"Fish",      color:"bg-cyan-500/20 text-cyan-400" },
  survival: { emoji:"🏕️", label:"Wild",      color:"bg-red-500/20 text-red-400" },
  fungus:   { emoji:"🍄", label:"Fungus",    color:"bg-purple-500/20 text-purple-400" },
  animal:   { emoji:"🐾", label:"Animal",    color:"bg-orange-500/20 text-orange-400" },
};

function getSafetyInfo(riskLevel?: string) {
  if (riskLevel === "dangerous") return { emoji:"⚠️", text:"Be very careful — can be harmful", color:"bg-red-500/20 text-red-400 border-red-500/30" };
  if (riskLevel === "caution")   return { emoji:"😐", text:"Be careful — handle with care", color:"bg-amber-500/20 text-amber-400 border-amber-500/30" };
  return                                { emoji:"✅", text:"Generally safe to be around", color:"bg-green-500/20 text-green-400 border-green-500/30" };
}

export default function PlantJournal() {
  const [scans, setScans]       = useState<ScanEntry[]>([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState<ScanEntry | null>(null);
  const [view, setView]         = useState<"grid"|"list">("grid");

  useEffect(() => {
    try {
      const s = localStorage.getItem("floraiq_scan_history");
      if (s) setScans(JSON.parse(s));
    } catch {}
  }, []);

  function deleteEntry(id: number) {
    const updated = scans.filter(s => s.id !== id);
    setScans(updated);
    localStorage.setItem("floraiq_scan_history", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  }

  function saveList() {
    const rows = [
      ["Name", "Latin Name", "Type", "AI Confidence %", "Date Found", "Safety"],
      ...scans.map(s => [s.name, s.scientific, s.type, `${s.confidence || ""}%`, s.date || "", s.riskLevel || "safe"]),
    ];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "my-discoveries.csv"; a.click();
  }

  const types = ["all", ...Array.from(new Set(scans.map(s => s.type?.toLowerCase()).filter(Boolean)))];
  const filtered = scans.filter(s => {
    const matchType   = filter === "all" || s.type?.toLowerCase() === filter;
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const avgConfidence = scans.length > 0 ? Math.round(scans.reduce((a, s) => a + (s.confidence || 80), 0) / scans.length) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <div>
              <h1 className="text-base font-bold leading-none">My Discoveries</h1>
              <p className="text-[11px] text-muted-foreground">{scans.length} things I've found</p>
            </div>
          </div>
          <div className="flex gap-2">
            {scans.length > 0 && (
              <button type="button" onClick={saveList} className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-white">
                💾 Save List
              </button>
            )}
            <Link href="/scan">
              <button type="button" className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                <Camera className="w-3 h-3" />Scan New
              </button>
            </Link>
          </div>
        </div>

        {/* Search + filter */}
        <div className="container pb-3 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name…"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="button" onClick={() => setView(v => v === "grid" ? "list" : "grid")}
              className="glass border border-border/50 px-3 py-2 rounded-xl text-xs text-muted-foreground">
              {view === "grid" ? "☰" : "⊞"}
            </button>
          </div>
          {types.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {types.map(t => {
                const info = TYPE_LABELS[t];
                return (
                  <button type="button" key={t} onClick={() => setFilter(t)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      filter === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"
                    }`}>
                    {t === "all" ? "🌍 Show All" : `${info?.emoji || "•"} ${info?.label || t}`}
                    {t !== "all" && ` (${scans.filter(s => s.type?.toLowerCase() === t).length})`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        {/* Empty state */}
        {scans.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-7xl">🌱</p>
            <h3 className="text-xl font-bold">You haven't found anything yet!</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Take a photo of any plant, insect, bird, or mushroom. It will show up here so you can look at it again later.
            </p>
            <Link href="/scan">
              <button type="button" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
                📷 Take My First Photo
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Grid/List */}
            <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">Nothing found for "{search}"</p>
              ) : view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map(scan => {
                    const typeInfo = TYPE_LABELS[scan.type?.toLowerCase()] || { emoji:"🔍", label:scan.type, color:"bg-zinc-500/20 text-zinc-400" };
                    return (
                      <div key={scan.id} onClick={() => setSelected(scan === selected ? null : scan)}
                        className={`glass rounded-2xl overflow-hidden border cursor-pointer transition-all group ${
                          selected?.id === scan.id ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/50 hover:border-emerald-500/40"
                        }`}>
                        <div className="h-32 bg-background/50 flex items-center justify-center overflow-hidden">
                          {scan.photoUrl
                            ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            : <span className="text-4xl">{typeInfo.emoji}</span>}
                        </div>
                        <div className="p-2.5">
                          <p className="font-bold text-xs truncate">{scan.name}</p>
                          {scan.scientific && <p className="text-[10px] text-muted-foreground italic truncate">{scan.scientific}</p>}
                          <div className="flex items-center justify-between mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${typeInfo.color}`}>
                              {typeInfo.emoji} {typeInfo.label}
                            </span>
                            {scan.confidence && <span className="text-[10px] text-emerald-400 font-bold">{scan.confidence}%</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(scan => {
                    const typeInfo = TYPE_LABELS[scan.type?.toLowerCase()] || { emoji:"🔍", label:scan.type, color:"bg-zinc-500/20 text-zinc-400" };
                    return (
                      <div key={scan.id} onClick={() => setSelected(scan === selected ? null : scan)}
                        className={`glass rounded-2xl p-3 border cursor-pointer transition-all flex items-center gap-3 ${
                          selected?.id === scan.id ? "border-emerald-500/60" : "border-border/50 hover:border-emerald-500/40"
                        }`}>
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-border/20 flex items-center justify-center">
                          {scan.photoUrl
                            ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                            : <span className="text-2xl">{typeInfo.emoji}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{scan.name}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${typeInfo.color}`}>{typeInfo.emoji} {typeInfo.label}</span>
                            {scan.date && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{scan.date}</span>}
                          </div>
                        </div>
                        {scan.confidence && <span className="text-sm font-bold text-emerald-400 flex-shrink-0">{scan.confidence}%</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail panel — plain language */}
            {selected && (
              <div className="space-y-3">
                <div className="glass rounded-2xl overflow-hidden border border-emerald-500/30 sticky top-36">
                  {selected.photoUrl
                    ? <img src={selected.photoUrl} alt={selected.name} className="w-full h-44 object-cover" />
                    : <div className="w-full h-44 bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-6xl">{TYPE_LABELS[selected.type?.toLowerCase()]?.emoji || "🔍"}</span>
                      </div>}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{selected.name}</h3>
                      {selected.scientific && <p className="text-xs text-muted-foreground">Latin name: <em>{selected.scientific}</em></p>}
                    </div>

                    {/* Safety — plain words */}
                    {(() => {
                      const safety = getSafetyInfo(selected.riskLevel);
                      return (
                        <div className={`rounded-xl px-3 py-2 border text-xs font-bold flex items-center gap-2 ${safety.color}`}>
                          <span>{safety.emoji}</span>{safety.text}
                        </div>
                      );
                    })()}

                    {/* AI confidence — explained simply */}
                    {selected.confidence && (
                      <div className="glass rounded-xl p-3 border border-border/30">
                        <p className="text-xs text-muted-foreground mb-1">How sure was the AI?</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-border/30 rounded-full">
                            <div className="h-full rounded-full bg-emerald-400" style={{ width:`${selected.confidence}%` }} />
                          </div>
                          <span className="text-sm font-bold text-emerald-400">{selected.confidence}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">{selected.confidence >= 90 ? "Very confident" : selected.confidence >= 70 ? "Pretty sure" : "Not very sure — double check"}</p>
                      </div>
                    )}

                    {selected.date && <p className="text-xs text-muted-foreground">📅 You found this on {selected.date}</p>}
                    {selected.description && <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>}
                    {selected.habitat && <p className="text-xs text-muted-foreground">🌍 Usually found in: {selected.habitat}</p>}

                    {/* Links */}
                    <div className="flex gap-2 flex-wrap">
                      <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.scientific || selected.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 glass border border-border/40 px-2 py-1 rounded-lg hover:bg-blue-500/10">
                        <ExternalLink className="w-3 h-3" />Wikipedia
                      </a>
                      <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific || selected.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-400 glass border border-border/40 px-2 py-1 rounded-lg hover:bg-green-500/10">
                        <ExternalLink className="w-3 h-3" />See Where Found
                      </a>
                      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selected.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-red-400 glass border border-border/40 px-2 py-1 rounded-lg hover:bg-red-500/10">
                        <ExternalLink className="w-3 h-3" />Watch Video
                      </a>
                    </div>

                    <button type="button" onClick={() => deleteEntry(selected.id)}
                      className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 transition">
                      <Trash2 className="w-3.5 h-3.5" />Remove this discovery
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats — simple language */}
        {scans.length > 0 && (
          <div className="mt-6 glass rounded-2xl p-5 border border-border/40">
            <h3 className="font-bold mb-4">📊 My Discovery Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
              {[
                { val:scans.length, label:"Things I've found", color:"text-emerald-400" },
                { val:types.length - 1, label:"Different types", color:"text-blue-400" },
                { val:`${avgConfidence}%`, label:"Average AI accuracy", color:"text-amber-400" },
                { val:scans.filter(s => s.riskLevel === "safe" || !s.riskLevel).length, label:"Safe to be around", color:"text-purple-400" },
              ].map(s => (
                <div key={s.label}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {types.slice(1).map(t => {
                const count = scans.filter(s => s.type?.toLowerCase() === t).length;
                const info = TYPE_LABELS[t] || { emoji:"•", label:t };
                return (
                  <div key={t} className="flex items-center gap-3">
                    <span className="text-xs w-20 flex items-center gap-1">{info.emoji} {info.label}</span>
                    <div className="flex-1 h-2 bg-border/30 rounded-full">
                      <div className="h-full bg-emerald-500/60 rounded-full" style={{ width:`${(count / scans.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
