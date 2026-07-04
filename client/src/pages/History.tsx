import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, Clock, Download, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Category definitions ──────────────────────────────────────────────────────
const LIB_CATS = [
  { id: "Plantae",        taxonId: 47126, label: "Plants",    icon: "🌿", color: "#22c55e" },
  { id: "Insecta",        taxonId: 47158, label: "Insects",   icon: "🐛", color: "#f59e0b" },
  { id: "Aves",           taxonId: 3,     label: "Birds",     icon: "🐦", color: "#3b82f6" },
  { id: "Fungi",          taxonId: 47170, label: "Mushrooms", icon: "🍄", color: "#8b5cf6" },
  { id: "Reptilia",       taxonId: 26036, label: "Reptiles",  icon: "🦎", color: "#ef4444" },
  { id: "Actinopterygii", taxonId: 47178, label: "Marine",    icon: "🐠", color: "#06b6d4" },
  { id: "Mammalia",       taxonId: 40151, label: "Mammals",   icon: "🐆", color: "#f97316" },
  { id: "Arachnida",      taxonId: 47119, label: "Spiders",   icon: "🕷️", color: "#a78bfa" },
];

const STATUS_COLORS: Record<string, string> = {
  LC: "#22c55e", NT: "#84cc16", VU: "#f59e0b",
  EN: "#f97316", CR: "#ef4444", EW: "#dc2626", EX: "#7f1d1d",
};

interface InatTaxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  rank?: string;
  iconic_taxon_name?: string;
  observations_count?: number;
  wikipedia_url?: string;
  wikipedia_summary?: string;
  conservation_status?: { status: string };
  default_photo?: { medium_url?: string; square_url?: string };
}

interface ScanEntry {
  id: number | string;
  name: string;
  scientific: string;
  type: string;
  date?: string;
  confidence?: number;
  photoUrl?: string;
}

// ── Species detail modal ─────────────────────────────────────────────────────
function SpeciesModal({ sp, onClose }: { sp: InatTaxon; onClose: () => void }) {
  const name     = sp.preferred_common_name || sp.name;
  const sciName  = sp.name;
  const taxon    = sp.iconic_taxon_name || "";
  const img      = sp.default_photo?.medium_url;
  const obs      = sp.observations_count ? sp.observations_count.toLocaleString() : "—";
  const status   = sp.conservation_status?.status?.toUpperCase() || "LC";
  const statusColor = STATUS_COLORS[status] || "#6b7280";
  const q        = encodeURIComponent(sciName);
  const qName    = encodeURIComponent(name);
  const ytUrl    = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " " + sciName + " species wildlife")}`;

  const extraSources: { label: string; url: string; bg: string }[] = [];
  if (taxon === "Aves")           extraSources.push(
    { label: "🐦 eBird — Bird Sightings & Range Maps", url: `https://ebird.org/search?q=${qName}`, bg: "bg-teal-900 hover:bg-teal-800" },
    { label: "🦅 All About Birds (Cornell)", url: `https://www.allaboutbirds.org/guide/search/?q=${qName}`, bg: "bg-sky-900 hover:bg-sky-800" },
    { label: "🪶 Audubon Society", url: `https://www.audubon.org/search#${qName}`, bg: "bg-blue-900 hover:bg-blue-800" },
    { label: "🔊 Xeno-canto — Bird Sounds", url: `https://xeno-canto.org/search?query=${q}`, bg: "bg-indigo-900 hover:bg-indigo-800" },
  );
  if (taxon === "Insecta")        extraSources.push(
    { label: "🐛 BugGuide", url: `https://bugguide.net/index.php?q=search&keys=${q}`, bg: "bg-amber-900 hover:bg-amber-800" },
    { label: "🦋 Butterflies & Moths of NA", url: `https://www.butterfliesandmoths.org/search?field_scientific_name=${q}`, bg: "bg-orange-900 hover:bg-orange-800" },
  );
  if (taxon === "Fungi")          extraSources.push(
    { label: "🍄 Mushroom Observer", url: `https://mushroomobserver.org/observer/lookup_name?name=${q}`, bg: "bg-purple-900 hover:bg-purple-800" },
    { label: "🔬 Index Fungorum", url: `https://www.indexfungorum.org/names/Names.asp?name=${q}`, bg: "bg-violet-900 hover:bg-violet-800" },
    { label: "🧫 MycoBank", url: `https://www.mycobank.org/quicksearch.aspx?criteria=${q}`, bg: "bg-fuchsia-900 hover:bg-fuchsia-800" },
  );
  if (taxon === "Reptilia")       extraSources.push(
    { label: "🦎 Reptile Database", url: `https://www.reptile-database.org/db-info/SpecieSearch.html?taxon=${q}`, bg: "bg-red-900 hover:bg-red-800" },
    { label: "🐍 HerpMapper", url: `https://herpmapper.org/search?q=${q}`, bg: "bg-rose-900 hover:bg-rose-800" },
    { label: "🐊 AmphibiaWeb", url: `https://amphibiaweb.org/search/index.html#q=${q}`, bg: "bg-orange-900 hover:bg-orange-800" },
  );
  if (taxon === "Actinopterygii") extraSources.push(
    { label: "🐠 FishBase", url: `https://www.fishbase.se/search.php?q=${q}`, bg: "bg-cyan-900 hover:bg-cyan-800" },
    { label: "🌊 OBIS — Ocean Biodiversity", url: `https://obis.org/taxon/${sp.id}`, bg: "bg-blue-900 hover:bg-blue-800" },
    { label: "🐋 SeaLifeBase", url: `https://www.sealifebase.ca/search.php?q=${q}`, bg: "bg-sky-900 hover:bg-sky-800" },
  );
  if (taxon === "Plantae")        extraSources.push(
    { label: "🌺 Plants of the World (Kew)", url: `https://powo.science.kew.org/results?q=${q}`, bg: "bg-green-900 hover:bg-green-800" },
    { label: "🌾 USDA PLANTS Database", url: `https://plants.usda.gov/search?query=${q}`, bg: "bg-lime-900 hover:bg-lime-800" },
    { label: "🌿 Tropicos (Missouri BG)", url: `https://www.tropicos.org/search?name=${q}`, bg: "bg-emerald-900 hover:bg-emerald-800" },
    { label: "🌱 Plants for a Future", url: `https://pfaf.org/user/Plant.aspx?LatinName=${q}`, bg: "bg-teal-900 hover:bg-teal-800" },
  );
  if (taxon === "Mammalia")       extraSources.push(
    { label: "🐆 IUCN Red List", url: `https://www.iucnredlist.org/search?query=${q}`, bg: "bg-orange-900 hover:bg-orange-800" },
    { label: "🐘 Wildscreen Arkive", url: `https://www.wildscreen.org/species/${encodeURIComponent(name.replace(/ /g, "-"))}`, bg: "bg-amber-900 hover:bg-amber-800" },
    { label: "🦁 Animal Diversity Web", url: `https://animaldiversity.org/search/?q=${q}`, bg: "bg-yellow-900 hover:bg-yellow-800" },
  );
  if (taxon === "Arachnida")      extraSources.push(
    { label: "🕷️ World Spider Catalog", url: `https://wsc.nmbe.ch/search?sSearch=${q}`, bg: "bg-slate-800 hover:bg-slate-700" },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="relative">
          {img && <img src={img} alt={name} className="w-full h-52 object-cover rounded-t-2xl" />}
          <a href={ytUrl} target="_blank" rel="noopener noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg transition">
            ▶ Watch on YouTube
          </a>
        </div>

        <div className="p-5 space-y-4">
          {/* Name + status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-white capitalize">{name}</h2>
              <p className="text-sm italic text-zinc-400">{sciName}</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full shrink-0"
              style={{ background: statusColor + "22", color: statusColor, border: `1px solid ${statusColor}55` }}>
              {status}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400">
            <div className="bg-zinc-800 rounded-lg p-2"><span className="text-zinc-500 block">Observations</span><p className="font-bold text-white">{obs}</p></div>
            <div className="bg-zinc-800 rounded-lg p-2"><span className="text-zinc-500 block">Rank</span><p className="font-bold text-white capitalize">{sp.rank || "species"}</p></div>
            <div className="bg-zinc-800 rounded-lg p-2"><span className="text-zinc-500 block">Group</span><p className="font-bold text-white capitalize">{taxon || "—"}</p></div>
          </div>

          {sp.wikipedia_summary && (
            <p className="text-sm text-zinc-400 leading-relaxed">{sp.wikipedia_summary}</p>
          )}

          {/* Core sources */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Core Sources</p>
            {sp.wikipedia_url && <a href={sp.wikipedia_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition">📖 Wikipedia — Full Species Article</a>}
            <a href={`https://www.inaturalist.org/taxa/${sp.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition">🌍 iNaturalist — Sightings & Photos</a>
            <a href={`https://www.gbif.org/species/search?q=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold rounded-xl transition">🔬 GBIF — Scientific Occurrence Data</a>
            <a href={`https://eol.org/search?q=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-800 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition">🌐 Encyclopedia of Life</a>
            <a href={`https://www.itis.gov/servlet/SingleRpt/SingleRpt?search_topic=Scientific_Name&search_value=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition">🏛️ ITIS — Taxonomic Information</a>
            <a href={`https://animaldiversity.org/search/?q=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white text-sm font-semibold rounded-xl transition">🦎 Animal Diversity Web (ADW)</a>
            <a href={`https://www.britannica.com/search?query=${qName}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl transition">📚 Britannica</a>
            <a href={`https://www.iucnredlist.org/search?query=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-red-900 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition">🔴 IUCN Red List</a>
            <a href={`https://www.biodiversitylibrary.org/search?SearchTerm=${q}&SearchCat=M`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-sm font-semibold rounded-xl transition">📜 Biodiversity Heritage Library</a>
            <a href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${q}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-sm font-semibold rounded-xl transition">🧬 NCBI / GenBank</a>
          </div>

          {/* Specialist sources */}
          {extraSources.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Specialist Sources</p>
              {extraSources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition ${s.bg}`}>
                  {s.label}
                </a>
              ))}
            </div>
          )}

          {/* Video */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Video</p>
            <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition">▶️ YouTube — Species Videos</a>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(name + " documentary nature")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-red-900 hover:bg-red-800 text-white text-sm font-semibold rounded-xl transition">🎬 YouTube — Nature Documentaries</a>
          </div>

          {/* Web search */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Search Online</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "🔍", label: "Google", href: `https://www.google.com/search?q=${encodeURIComponent(name + " " + sciName)}`, cls: "bg-blue-950/40 border-blue-700/40 text-blue-300 hover:bg-blue-950/70" },
                { icon: "🦆", label: "DuckDuckGo", href: `https://duckduckgo.com/?q=${encodeURIComponent(name + " species")}`, cls: "bg-orange-950/40 border-orange-700/40 text-orange-300 hover:bg-orange-950/70" },
                { icon: "🔎", label: "Bing", href: `https://www.bing.com/search?q=${encodeURIComponent(sciName + " species")}`, cls: "bg-cyan-950/40 border-cyan-700/40 text-cyan-300 hover:bg-cyan-950/70" },
                { icon: "🖼️", label: "Images", href: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + " " + sciName)}`, cls: "bg-green-950/40 border-green-700/40 text-green-300 hover:bg-green-950/70" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl text-sm font-semibold transition ${s.cls}`}>
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </div>

          <button type="button" onClick={onClose} className="w-full mt-2 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function History() {
  const [tab, setTab]           = useState<"library" | "history">("library");
  const [category, setCategory] = useState("Plantae");
  const [species, setSpecies]   = useState<InatTaxon[]>([]);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState<InatTaxon | null>(null);
  const [query, setQuery]       = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [myScans, setMyScans]   = useState<ScanEntry[]>([]);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef     = useRef<AbortController | null>(null);
  const categoryRef  = useRef("Plantae");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("floraiq_scan_history");
      if (stored) setMyScans(JSON.parse(stored));
    } catch {}
  }, []);

  const loadCategory = useCallback(async (catId: string) => {
    const cat = LIB_CATS.find(c => c.id === catId);
    if (!cat) return;
    categoryRef.current = catId;
    setCategory(catId); setIsSearchMode(false); setQuery(""); setLoading(true); setSpecies([]);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const r = await fetch(
        `https://api.inaturalist.org/v1/observations/species_counts?taxon_id=${cat.taxonId}&photos=true&quality_grade=research&per_page=48&order=desc&order_by=count`,
        { signal: ctrl.signal }
      );
      const d = await r.json();
      const list = (d.results || []).map((item: any) => item.taxon).filter((s: InatTaxon) => s?.default_photo?.medium_url);
      if (!ctrl.signal.aborted) setSpecies(list);
    } catch (e: any) {
      if (e.name !== "AbortError") setSpecies([]);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, []);

  const doSearch = useCallback(async (q: string, catId: string) => {
    if (!q.trim()) { loadCategory(catId); return; }
    const cat = LIB_CATS.find(c => c.id === catId);
    if (!cat) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true); setIsSearchMode(true); setSpecies([]);
    try {
      const r = await fetch(
        `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(q)}&ancestor_id=${cat.taxonId}&rank=species&per_page=48&photos=true&order_by=observations_count&order=desc`,
        { signal: ctrl.signal }
      );
      const d = await r.json();
      if (!ctrl.signal.aborted) setSpecies((d.results || []).filter((s: InatTaxon) => s.default_photo?.medium_url));
    } catch (e: any) {
      if (e.name !== "AbortError") setSpecies([]);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [loadCategory]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val, categoryRef.current), 300);
  };

  useEffect(() => { loadCategory("Plantae"); }, [loadCategory]);
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }, []);

  const catInfo = LIB_CATS.find(c => c.id === category) || LIB_CATS[0];

  const exportCSV = () => {
    const rows = [["Name","Scientific","Type","Confidence","Date"], ...myScans.map(s => [s.name, s.scientific, s.type, s.confidence || "", s.date || ""])];
    const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "floraiq_history.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/"><button type="button" className="text-zinc-400 hover:text-white transition"><ChevronLeft className="w-5 h-5" /></button></Link>
            <h1 className="text-lg font-bold">Species Library</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setTab("library")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${tab === "library" ? "bg-emerald-500 text-white" : "text-zinc-400 hover:text-white"}`}>
              Library
            </button>
            <button type="button" onClick={() => setTab("history")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${tab === "history" ? "bg-emerald-500 text-white" : "text-zinc-400 hover:text-white"}`}>
              My Scans
            </button>
          </div>
        </div>
      </div>

      {/* ── SPECIES LIBRARY ── */}
      {tab === "library" && (
        <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
          <p className="text-sm text-zinc-500 mb-4">
            {isSearchMode
              ? `Showing ${catInfo.label} matching "${query}"`
              : `Top ${catInfo.label.toLowerCase()} species — click any for sources & video`}
          </p>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {LIB_CATS.map(cat => (
              <button type="button" key={cat.id} onClick={() => loadCategory(cat.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border"
                style={category === cat.id
                  ? { background: cat.color + "22", color: cat.color, borderColor: cat.color + "55" }
                  : { background: "#18181b", color: "#a1a1aa", borderColor: "#3f3f46" }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <input value={query} onChange={handleInput}
                placeholder={`Search ${catInfo.label.toLowerCase()} — type to search instantly…`}
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 pr-8" />
              {loading && query && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            {(isSearchMode || query) && (
              <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); loadCategory(category); }}
                className="px-3 py-2.5 bg-zinc-800 text-zinc-400 text-sm rounded-xl hover:text-white">✕</button>
            )}
          </div>

          {/* Web search buttons */}
          <div className="flex gap-2 flex-wrap mb-5 items-center">
            <span className="text-xs text-zinc-600">Search web:</span>
            {[
              { label: "🔍 Google", href: `https://www.google.com/search?q=${encodeURIComponent(catInfo.label + " species")}`, cls: "border-blue-700/40 text-blue-400 hover:bg-blue-950/30" },
              { label: "🦆 DuckDuckGo", href: `https://duckduckgo.com/?q=${encodeURIComponent(catInfo.label + " species")}`, cls: "border-orange-700/40 text-orange-400 hover:bg-orange-950/30" },
              { label: "🔎 Bing", href: `https://www.bing.com/search?q=${encodeURIComponent(catInfo.label + " species")}`, cls: "border-cyan-700/40 text-cyan-400 hover:bg-cyan-950/30" },
              { label: "📖 Wikipedia", href: `https://en.wikipedia.org/wiki/${encodeURIComponent(catInfo.id)}`, cls: "border-zinc-600/40 text-zinc-300 hover:bg-zinc-800/30" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition ${s.cls}`}>
                {s.label}
              </a>
            ))}
          </div>

          {/* Grid */}
          {loading && !species.length && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && species.length === 0 && (
            <div className="text-center py-20 text-zinc-500">No results found</div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {species.map(sp => (
              <div key={sp.id} onClick={() => setSelected(sp)}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-zinc-800 hover:border-zinc-600 transition">
                <img src={sp.default_photo?.medium_url} alt={sp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs font-bold leading-tight truncate">
                    {sp.preferred_common_name || sp.name}
                  </p>
                  <p className="text-zinc-400 text-[10px] italic truncate">{sp.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY SCANS ── */}
      {tab === "history" && (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">My Scan History</h2>
            {myScans.length > 0 && (
              <Button type="button" onClick={exportCSV} size="sm" variant="outline" className="border-zinc-700 text-zinc-400">
                <Download className="w-4 h-4 mr-1" />Export CSV
              </Button>
            )}
          </div>

          {myScans.length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="font-semibold text-zinc-400 mb-2">No scans yet</h3>
              <p className="text-zinc-600 text-sm mb-5">Identify your first organism</p>
              <Link href="/scan">
                <Button type="button" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Leaf className="w-4 h-4 mr-2" />Start Scanning
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myScans.map(scan => (
                <div key={scan.id} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                    {scan.photoUrl
                      ? <img src={scan.photoUrl} alt={scan.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🌱</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{scan.name}</p>
                    <p className="text-xs text-zinc-500 italic truncate">{scan.scientific}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{scan.type}</span>
                      {scan.confidence && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">{scan.confidence}%</span>}
                      {scan.date && <span className="text-xs text-zinc-600">{scan.date}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {selected && <SpeciesModal sp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
