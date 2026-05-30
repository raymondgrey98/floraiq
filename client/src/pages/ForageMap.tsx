import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Leaf, MapPin, Search, Loader2, X, ExternalLink, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Edible / useful plant search terms from OpenFarm + GBIF
const FORAGE_CATEGORIES = [
  { id: "edible",    label: "Edible Plants",   icon: "🌿", color: "#22c55e", q: "edible wild plant" },
  { id: "herbs",     label: "Herbs",           icon: "🌱", color: "#84cc16", q: "culinary herb medicinal" },
  { id: "fruit",     label: "Wild Fruits",     icon: "🍒", color: "#ef4444", q: "wild fruit berry" },
  { id: "mushroom",  label: "Mushrooms",       icon: "🍄", color: "#8b5cf6", q: "edible mushroom fungi" },
  { id: "medicinal", label: "Medicinal",       icon: "💊", color: "#06b6d4", q: "medicinal plant traditional" },
  { id: "survival",  label: "Survival Plants", icon: "🏕️", color: "#f97316", q: "survival edible wild" },
];

interface Plant {
  key: number;
  species?: string;
  decimalLatitude: number;
  decimalLongitude: number;
  country?: string;
  vernacularName?: string;
  eventDate?: string;
  gbifID?: number;
}

interface OpenFarmCrop {
  id: string;
  attributes: {
    name: string;
    description?: string;
    sun_requirements?: string;
    sowing_method?: string;
    main_image_path?: string;
    guides_count?: number;
  };
}

function makeMarker(color: string) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,.4)"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function ForageMap() {
  const mapDivRef  = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<L.Map | null>(null);
  const layerRef   = useRef<L.LayerGroup | null>(null);

  const [category, setCategory]     = useState("edible");
  const [loading, setLoading]       = useState(false);
  const [plants, setPlants]         = useState<Plant[]>([]);
  const [selected, setSelected]     = useState<Plant | null>(null);
  const [searchQ, setSearchQ]       = useState("");
  const [ofResults, setOfResults]   = useState<OpenFarmCrop[]>([]);
  const [ofLoading, setOfLoading]   = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [userPos, setUserPos]       = useState<[number, number] | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Init map
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;
    const map = L.map(mapDivRef.current, { center: [10, 110], zoom: 4 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Locate user
  function locateUser() {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserPos([lat, lng]);
      mapRef.current?.setView([lat, lng], 8);
      fetchPlants(category, lat, lng);
    }, () => fetchPlants(category));
  }

  // Fetch GBIF occurrences for edible/useful plants
  async function fetchPlants(cat: string, lat?: number, lng?: number) {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true); setPlants([]); setTotalCount(0);

    try {
      const params = new URLSearchParams({
        hasCoordinate: "true",
        hasGeospatialIssue: "false",
        kingdomKey: cat === "mushroom" ? "5" : "6",
        limit: "200",
        occurrenceStatus: "PRESENT",
      });
      if (lat && lng) {
        params.set("decimalLatitude", `${(lat - 5).toFixed(1)},${(lat + 5).toFixed(1)}`);
        params.set("decimalLongitude", `${(lng - 5).toFixed(1)},${(lng + 5).toFixed(1)}`);
      }

      const res = await fetch(`https://api.gbif.org/v1/occurrence/search?${params}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error("GBIF error");
      const data = await res.json();
      const results = (data.results || []).filter((p: Plant) => p.decimalLatitude && p.decimalLongitude);
      setPlants(results);
      setTotalCount(data.count || results.length);
    } catch (e: any) {
      if (e.name !== "AbortError") setPlants([]);
    } finally {
      setLoading(false);
    }
  }

  // Search OpenFarm for growing guides
  async function searchOpenFarm(q: string) {
    if (!q.trim()) return;
    setOfLoading(true);
    try {
      const res = await fetch(`https://openfarm.cc/api/v1/crops/?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setOfResults((data.data || []).slice(0, 8));
    } catch { setOfResults([]); }
    finally { setOfLoading(false); }
  }

  useEffect(() => { fetchPlants(category); }, [category]);

  // Draw markers
  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.clearLayers();
    const catInfo = FORAGE_CATEGORIES.find(c => c.id === category) || FORAGE_CATEGORIES[0];
    const icon = makeMarker(catInfo.color);
    plants.forEach(p => {
      const m = L.marker([p.decimalLatitude, p.decimalLongitude], { icon });
      m.bindTooltip(p.vernacularName || p.species || "Plant", { direction: "top" });
      m.on("click", () => setSelected(p));
      layerRef.current!.addLayer(m);
    });
    if (userPos) {
      L.circleMarker(userPos, { radius: 8, color: "#10b981", fillColor: "#10b981", fillOpacity: 0.8 })
        .bindTooltip("You are here", { permanent: false })
        .addTo(layerRef.current);
    }
  }, [plants, category, userPos]);

  const catInfo = FORAGE_CATEGORIES.find(c => c.id === category) || FORAGE_CATEGORIES[0];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 glass border-b border-border z-10">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold">Forage Map</h1>
            {totalCount > 0 && (
              <span className="text-xs text-muted-foreground bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {totalCount.toLocaleString()} plants
              </span>
            )}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={locateUser}
              className="border-emerald-500/30 text-emerald-400 hidden sm:flex">
              <Navigation className="w-3.5 h-3.5 mr-1" />Near Me
            </Button>
            <Link href="/"><Button type="button" variant="ghost" size="sm">Back</Button></Link>
          </div>
        </div>

        {/* Category tabs */}
        <div className="container pb-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FORAGE_CATEGORIES.map(cat => (
              <button type="button" key={cat.id} onClick={() => setCategory(cat.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all"
                style={category === cat.id
                  ? { background: cat.color + "22", color: cat.color, borderColor: cat.color + "66" }
                  : { background: "#18181b", color: "#a1a1aa", borderColor: "#3f3f46" }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapDivRef} className="w-full h-full" />

          {/* Selected plant panel */}
          {selected && (
            <div className="absolute top-4 right-4 glass rounded-xl p-4 border border-emerald-500/30 z-[400] w-72 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate">{selected.vernacularName || selected.species || "Wild Plant"}</h3>
                  <p className="text-xs text-muted-foreground italic truncate">{selected.species}</p>
                </div>
                <button type="button" aria-label="Close" onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-white ml-2 flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />
                  {selected.decimalLatitude.toFixed(3)}°, {selected.decimalLongitude.toFixed(3)}°</p>
                {selected.country && <p>🌍 {selected.country}</p>}
                {selected.eventDate && <p>📅 {selected.eventDate.slice(0, 10)}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`https://www.gbif.org/occurrence/${selected.key}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                  <ExternalLink className="w-3 h-3" />GBIF
                </a>
                <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.species || "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300">
                  <ExternalLink className="w-3 h-3" />Wikipedia
                </a>
                <a href={`https://pfaf.org/user/Plant.aspx?LatinName=${encodeURIComponent(selected.species || "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                  <ExternalLink className="w-3 h-3" />PFAF
                </a>
              </div>
              <Button type="button" size="sm"
                onClick={() => { searchOpenFarm(selected.vernacularName || selected.species || ""); }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs">
                Find Growing Guide (OpenFarm)
              </Button>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-[400]">
              <div className="glass rounded-xl p-4 border border-border/50 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span className="text-sm">Loading {catInfo.label} from GBIF...</span>
              </div>
            </div>
          )}
        </div>

        {/* OpenFarm sidebar */}
        {ofResults.length > 0 && (
          <div className="w-72 flex-shrink-0 border-l border-border overflow-y-auto bg-background/90">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">OpenFarm Growing Guides</p>
              <button type="button" onClick={() => setOfResults([])} aria-label="Close sidebar">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {ofLoading
              ? <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
              : ofResults.map(crop => (
                <div key={crop.id} className="p-3 border-b border-border/50">
                  {crop.attributes.main_image_path && (
                    <img src={crop.attributes.main_image_path} alt={crop.attributes.name}
                      className="w-full h-24 object-cover rounded-lg mb-2" />
                  )}
                  <h4 className="font-semibold text-sm">{crop.attributes.name}</h4>
                  {crop.attributes.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{crop.attributes.description}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    {crop.attributes.sun_requirements && <span>☀️ {crop.attributes.sun_requirements}</span>}
                    {crop.attributes.guides_count !== undefined && <span>📋 {crop.attributes.guides_count} guides</span>}
                  </div>
                  <a href={`https://openfarm.cc/en/crops/${crop.id}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-2">
                    <ExternalLink className="w-3 h-3" />View on OpenFarm
                  </a>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Bottom search bar for OpenFarm */}
      <div className="flex-shrink-0 glass border-t border-border p-3">
        <form onSubmit={e => { e.preventDefault(); searchOpenFarm(searchQ); }} className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search OpenFarm for growing guides (e.g. tomato, kangkung, durian)..."
              className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            {ofLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Map data: GBIF (3B+ records) · Growing guides: OpenFarm · Click any plant for details
        </p>
      </div>
    </div>
  );
}
