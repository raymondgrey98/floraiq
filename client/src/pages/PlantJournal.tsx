import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, Leaf, Download, Search, Filter, Trash2, ChevronLeft, ExternalLink, Calendar, TrendingUp } from "lucide-react";

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

const TYPE_COLORS: Record<string, string> = {
  plant:    "bg-green-500/20 text-green-400",
  insect:   "bg-yellow-500/20 text-yellow-400",
  bird:     "bg-blue-500/20 text-blue-400",
  mushroom: "bg-purple-500/20 text-purple-400",
  reptile:  "bg-lime-500/20 text-lime-400",
  marine:   "bg-cyan-500/20 text-cyan-400",
  survival: "bg-red-500/20 text-red-400",
};

export default function PlantJournal() {
  const [scans, setScans]             = useState<ScanEntry[]>([]);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("all");
  const [selected, setSelected]       = useState<ScanEntry | null>(null);
  const [view, setView]               = useState<"grid" | "list">("grid");

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

  function exportCSV() {
    const rows = [
      ["Name", "Scientific Name", "Type", "Confidence", "Date", "Risk Level"],
      ...scans.map(s => [s.name, s.scientific, s.type, s.confidence || "", s.date || "", s.riskLevel || ""]),
    ];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "floraiq_journal.csv";
    a.click();
  }

  const types = ["all", ...Array.from(new Set(scans.map(s => s.type?.toLowerCase()).filter(Boolean)))];

  const filtered = scans.filter(s => {
    const matchType   = filter === "all" || s.type?.toLowerCase() === filter;
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) ||
                        s.scientific?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Stats
  const byType = types.slice(1).map(t => ({
    type: t,
    count: scans.filter(s => s.type?.toLowerCase() === t).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/"><button type="button" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">My Plant Journal</h1>
            <span className="text-xs text-muted-foreground bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {scans.length} discoveries
            </span>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={exportCSV} variant="outline" size="sm" className="border-border/50 hidden sm:flex">
              <Download className="w-4 h-4 mr-1" />Export
            </Button>
            <Link href="/scan">
              <Button type="button" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Leaf className="w-4 h-4 mr-1" />Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Search + filter */}
        <div className="container pb-3 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search your discoveries..."
                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="button" onClick={() => setView(v => v === "grid" ? "list" : "grid")}
              className="glass border border-border/50 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition">
              {view === "grid" ? "☰ List" : "⊞ Grid"}
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center" />
            {types.map(t => (
              <button type="button" key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === t ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground hover:text-foreground"
                }`}>
                {t.charAt(0).toUpperCase() + t.slice(1)} {t !== "all" && `(${scans.filter(s => s.type?.toLowerCase() === t).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-5xl">
        {scans.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No discoveries yet</h3>
            <p className="text-muted-foreground mb-6 text-sm">Scan plants, animals, and organisms to build your journal</p>
            <Link href="/scan">
              <Button type="button" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Leaf className="w-4 h-4 mr-2" />Start Scanning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">No matches found</p>
              ) : view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filtered.map(scan => (
                    <div key={scan.id} onClick={() => setSelected(scan)}
                      className={`glass rounded-xl overflow-hidden border cursor-pointer transition-all group ${
                        selected?.id === scan.id ? "border-emerald-500/60" : "border-border/50 hover:border-emerald-500/40"
                      }`}>
                      <div className="h-32 bg-background/50 flex items-center justify-center overflow-hidden">
                        {scan.photoUrl
                          ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          : <Leaf className="w-10 h-10 text-emerald-500/20" />}
                      </div>
                      <div className="p-2.5">
                        <p className="font-semibold text-xs truncate">{scan.name}</p>
                        <p className="text-[10px] text-muted-foreground italic truncate">{scan.scientific}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${TYPE_COLORS[scan.type?.toLowerCase()] || "bg-zinc-500/20 text-zinc-400"}`}>
                            {scan.type}
                          </span>
                          {scan.confidence && <span className="text-[10px] text-emerald-400">{scan.confidence}%</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(scan => (
                    <div key={scan.id} onClick={() => setSelected(scan)}
                      className={`glass rounded-xl p-4 border cursor-pointer transition-all flex items-center gap-4 ${
                        selected?.id === scan.id ? "border-emerald-500/60" : "border-border/50 hover:border-emerald-500/40"
                      }`}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-background/50">
                        {scan.photoUrl
                          ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><Leaf className="w-6 h-6 text-emerald-500/30" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm truncate">{scan.name}</p>
                          {scan.confidence && <span className="text-xs text-emerald-400 flex-shrink-0 ml-2">{scan.confidence}%</span>}
                        </div>
                        <p className="text-xs text-muted-foreground italic truncate">{scan.scientific}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[scan.type?.toLowerCase()] || "bg-zinc-500/20 text-zinc-400"}`}>
                            {scan.type}
                          </span>
                          {scan.date && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{scan.date}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail panel */}
            {selected && (
              <div className="space-y-4">
                <div className="glass rounded-xl overflow-hidden border border-emerald-500/30 sticky top-40">
                  {selected.photoUrl
                    ? <img src={selected.photoUrl} alt={selected.name} className="w-full h-48 object-cover" />
                    : <div className="w-full h-48 bg-emerald-500/10 flex items-center justify-center"><Leaf className="w-16 h-16 text-emerald-500/20" /></div>}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground italic">{selected.scientific}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${TYPE_COLORS[selected.type?.toLowerCase()] || ""}`}>
                        {selected.type}
                      </span>
                      {selected.confidence && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-semibold">{selected.confidence}% match</span>}
                      {selected.riskLevel && <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        selected.riskLevel === "dangerous" ? "bg-red-500/20 text-red-400" :
                        selected.riskLevel === "caution"   ? "bg-amber-500/20 text-amber-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>{selected.riskLevel.toUpperCase()}</span>}
                    </div>
                    {selected.date && <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />Scanned {selected.date}</p>}
                    {selected.description && <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>}
                    {selected.habitat && <p className="text-xs text-muted-foreground">🏕️ {selected.habitat}</p>}
                    <div className="flex gap-2">
                      <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.scientific)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                        <ExternalLink className="w-3 h-3" />Wikipedia
                      </a>
                      <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                        <ExternalLink className="w-3 h-3" />iNaturalist
                      </a>
                    </div>
                    <Button type="button" size="sm" variant="outline"
                      onClick={() => deleteEntry(selected.id)}
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
                      <Trash2 className="w-3.5 h-3.5 mr-1" />Remove from Journal
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {scans.length > 0 && (
          <div className="mt-8 glass rounded-xl p-5 border border-border/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />Discovery Stats
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{scans.length}</p>
                <p className="text-xs text-muted-foreground">Total Scans</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{types.length - 1}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {scans.length > 0 ? Math.round(scans.reduce((s, e) => s + (e.confidence || 80), 0) / scans.length) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {scans.filter(s => s.riskLevel === "safe" || !s.riskLevel).length}
                </p>
                <p className="text-xs text-muted-foreground">Safe Species</p>
              </div>
            </div>
            {byType.length > 0 && (
              <div className="space-y-2">
                {byType.map(({ type, count }) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 capitalize">{type}</span>
                    <div className="flex-1 h-2 bg-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/60 rounded-full"
                        style={{ width: `${(count / scans.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
