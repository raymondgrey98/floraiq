import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, Filter, Loader2, Search, X, MapPin, ExternalLink } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { getSightings } from "@/lib/sightings";
import L from "leaflet";
import * as THREE from "three";

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIES = [
  { id: "all",      label: "All",      icon: "🌍", taxonKey: 1,      color: "#10b981" },
  { id: "plant",    label: "Plants",   icon: "🌿", taxonKey: 6,      color: "#22c55e" },
  { id: "insect",   label: "Insects",  icon: "🦋", taxonKey: 216,    color: "#f59e0b" },
  { id: "bird",     label: "Birds",    icon: "🐦", taxonKey: 212,    color: "#3b82f6" },
  { id: "mushroom", label: "Fungi",    icon: "🍄", taxonKey: 5,      color: "#8b5cf6" },
  { id: "reptile",  label: "Reptiles", icon: "🦎", taxonKey: 358,    color: "#84cc16" },
  { id: "marine",   label: "Marine",   icon: "🐠", taxonKey: 204,    color: "#06b6d4" },
  { id: "mammal",   label: "Mammals",  icon: "🐆", taxonKey: 359,    color: "#f97316" },
];

interface Occurrence {
  key: number;
  species: string;
  decimalLatitude: number;
  decimalLongitude: number;
  country?: string;
  stateProvince?: string;
  eventDate?: string;
  vernacularName?: string;
  taxonRank?: string;
  gbifID?: number;
}

function makeIcon(color: string) {
  return L.divIcon({
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

export default function SpeciesMap() {
  const mapDivRef   = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<L.Map | null>(null);
  const markersRef  = useRef<L.LayerGroup | null>(null);
  // Vanta NET background
  const vantaBgRef    = useRef<HTMLDivElement>(null);
  const vantaEffect   = useRef<any>(null);

  // ── Memory-safe Vanta NET init & destroy ────────────────────────────────
  useEffect(() => {
    let mounted = true;
    import("vanta/dist/vanta.net.min").then(({ default: NET }) => {
      if (!mounted || !vantaBgRef.current || vantaEffect.current) return;
      vantaEffect.current = NET({
        el: vantaBgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        // FloraIQ brand — deep midnight green bg, mint green net
        color: 0x10b981,        // emerald net lines
        backgroundColor: 0x07100c, // deep forest black-green
        points: 9,
        maxDistance: 22,
        spacing: 18,
        showDots: true,
      });
    });
    return () => {
      mounted = false;
      // CRITICAL: destroy WebGL context on unmount to prevent memory leaks
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const [category, setCategory]       = useState("plant");
  const [loading, setLoading]         = useState(false);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [selected, setSelected]       = useState<Occurrence | null>(null);
  const [searchQ, setSearchQ]         = useState("");
  const [totalCount, setTotalCount]   = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const heatRef  = useRef<L.TileLayer | null>(null);

  // GBIF density-tile URL for the current category — a hex-binned heatmap of the
  // full billion-record occurrence dataset (free, no key). Filtered by taxonKey.
  function heatUrl(cat: string): string {
    const catInfo = CATEGORIES.find(c => c.id === cat) || CATEGORIES[0];
    let filter = "";
    if (cat === "plant") filter = "&taxonKey=6";
    else if (cat === "mushroom") filter = "&taxonKey=5";
    else if (cat !== "all") filter = `&taxonKey=${catInfo.taxonKey}`;
    return `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?srs=EPSG:3857&style=classic.poly&bin=hex&hexPerTile=25${filter}`;
  }

  // Init map once
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      zoomControl: true,
      worldCopyJump: true,          // markers wrap cleanly across the antimeridian
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 0.8,
    });

    // ── Base layers — ArcGIS-style global imagery switcher ──
    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap", maxZoom: 19,
    });
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri · Maxar · Earthstar Geographics", maxZoom: 19 },
    );
    const terrain = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri · USGS · NOAA", maxZoom: 19 },
    );
    const ocean = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Esri · GEBCO · NOAA", maxZoom: 13 },
    );
    // NASA GIBS — Blue Marble (true global satellite mosaic from MODIS)
    const nasa = L.tileLayer(
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg",
      { attribution: "NASA EOSDIS GIBS · Blue Marble", maxZoom: 8 },
    );

    satellite.addTo(map); // default: high-end satellite view, like ArcGIS

    // GBIF density heatmap overlay (billion-record occurrence view, on by default)
    const heat = L.tileLayer(heatUrl(category), {
      tileSize: 512, zoomOffset: -1, opacity: 0.7,
      className: "gbif-heat", attribution: "GBIF occurrence density",
    });
    heat.addTo(map);
    heatRef.current = heat;

    // ── My Sightings — every scan you took, pinned where you took it ──
    const mine = L.layerGroup();
    const sightings = getSightings();
    for (const s of sightings) {
      const pin = L.marker([s.lat, s.lng], {
        icon: L.divIcon({
          className: "",
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          html: `<div style="width:16px;height:16px;border-radius:50%;background:#fbbf24;border:3px solid #fff;box-shadow:0 0 10px rgba(251,191,36,.9)"></div>`,
        }),
      });
      const when = new Date(s.date).toLocaleDateString();
      pin.bindPopup(
        `<div style="min-width:150px">
           ${s.photoUrl ? `<img src="${s.photoUrl}" alt="" style="width:100%;border-radius:8px;margin-bottom:6px" />` : ""}
           <strong>${s.name}</strong><br/>
           <em style="opacity:.7">${s.scientific ?? ""}</em><br/>
           <span style="opacity:.6;font-size:11px">You found this · ${when}</span>
         </div>`,
      );
      mine.addLayer(pin);
    }
    if (sightings.length) mine.addTo(map);

    L.control.layers(
      {
        "Satellite (Esri)": satellite,
        "Street (OSM)": street,
        "Terrain (Esri)": terrain,
        "Ocean floor": ocean,
        "NASA Blue Marble": nasa,
      },
      {
        "GBIF density heatmap": heat,
        [`My sightings (${sightings.length})`]: mine,
      },
      { position: "topright", collapsed: true },
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Leaflet caches the container size at init; if the flex layout wasn't ready
    // yet, only a couple of tiles load. Recompute after layout + on every resize.
    const invalidate = () => map.invalidateSize({ animate: false });
    requestAnimationFrame(invalidate);
    const t = setTimeout(invalidate, 250);
    const ro = new ResizeObserver(invalidate);
    if (mapDivRef.current) ro.observe(mapDivRef.current);

    return () => { clearTimeout(t); ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  async function fetchOccurrences(cat: string, q?: string) {
    const catInfo = CATEGORIES.find(c => c.id === cat) || CATEGORIES[0];
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setOccurrences([]);
    setTotalCount(0);

    try {
      // Random offset so results cycle through all continents globally, not just Europe
      const offset = q?.trim() ? 0 : Math.floor(Math.random() * 500);
      const params = new URLSearchParams({
        limit: "300",
        offset: String(offset),
        hasCoordinate: "true",
        hasGeospatialIssue: "false",
        occurrenceStatus: "PRESENT",
      });

      if (q?.trim()) {
        // Use generic text search so "rose" matches any language/region globally
        params.set("q", q.trim());
      } else if (cat !== "all") {
        if (cat === "plant")    params.set("kingdomKey", "6");
        else if (cat === "mushroom") params.set("kingdomKey", "5");
        else params.set("classKey", String(catInfo.taxonKey));
      }

      const res = await fetch(`https://api.gbif.org/v1/occurrence/search?${params}`, {
        // Abort on a new request OR after 12s so a slow GBIF never hangs the map.
        signal: AbortSignal.any([abortRef.current.signal, AbortSignal.timeout(12_000)]),
      });
      if (!res.ok) throw new Error("GBIF error");
      const data = await res.json();
      const results: Occurrence[] = (data.results || []).filter(
        (o: any) => o.decimalLatitude && o.decimalLongitude
      );
      setOccurrences(results);
      setTotalCount(data.count || results.length);
    } catch (e: any) {
      if (e.name !== "AbortError") setOccurrences([]);
    } finally {
      setLoading(false);
    }
  }

  // Load on category change
  useEffect(() => { fetchOccurrences(category); }, [category]);

  // Re-filter the GBIF heatmap when the category changes
  useEffect(() => {
    if (heatRef.current) heatRef.current.setUrl(heatUrl(category));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Draw markers
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    const catInfo = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
    const icon = makeIcon(catInfo.color);

    occurrences.forEach(occ => {
      if (!occ.decimalLatitude || !occ.decimalLongitude) return;
      const marker = L.marker([occ.decimalLatitude, occ.decimalLongitude], { icon });
      const name = occ.vernacularName || occ.species || "Unknown species";
      marker.bindTooltip(name, { permanent: false, direction: "top", className: "leaflet-tooltip-dark" });
      marker.on("click", () => setSelected(occ));
      markersRef.current!.addLayer(marker);
    });
  }, [occurrences, category]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchOccurrences(category, searchQ);
  }

  const catInfo = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 glass border-b border-border z-10">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold">Species Map</h1>
            {totalCount > 0 && (
              <span className="text-xs text-muted-foreground bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {totalCount.toLocaleString()} records
              </span>
            )}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
          </div>
          <Link href="/"><Button type="button" variant="ghost" size="sm">Back</Button></Link>
        </div>

        {/* Filters + Search */}
        <div className="container pb-2 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button type="button" key={cat.id} onClick={() => setCategory(cat.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border"
                style={category === cat.id
                  ? { background: cat.color + "22", color: cat.color, borderColor: cat.color + "66" }
                  : { background: "#18181b", color: "#a1a1aa", borderColor: "#3f3f46" }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search species (e.g. Quercus robur)..."
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <Button type="submit" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Search</Button>
            {searchQ && (
              <Button type="button" size="sm" variant="outline" onClick={() => { setSearchQ(""); fetchOccurrences(category); }}>
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {/* Vanta NET WebGL background — z-0, fills container, pointer events off */}
        <div
          ref={vantaBgRef}
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {/* Leaflet map — transparent bg so Vanta shows through, z-1 */}
        <div
          ref={mapDivRef}
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "transparent",
            // GPU-accelerated stacking context keeps Vanta beneath map tiles
            transform: "translateZ(0)",
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass rounded-xl p-3 border border-border/50 z-[400] text-xs space-y-1.5">
          <p className="font-bold text-muted-foreground uppercase tracking-wide text-[10px] mb-1">Live GBIF Data</p>
          {CATEGORIES.filter(c => c.id !== "all").map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-white" style={{ background: c.color }} />
              <span className="text-muted-foreground">{c.icon} {c.label}</span>
            </div>
          ))}
        </div>

        {/* Selected occurrence panel */}
        {selected && (
          <div className="absolute top-4 right-4 glass rounded-xl p-4 border border-emerald-500/30 z-[400] w-72 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{selected.vernacularName || selected.species || "Unknown"}</h3>
                <p className="text-xs text-muted-foreground italic truncate">{selected.species}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-white ml-2"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />
                {selected.decimalLatitude.toFixed(3)}°, {selected.decimalLongitude.toFixed(3)}°
              </p>
              {selected.country && <p>🌍 {selected.country}{selected.stateProvince ? `, ${selected.stateProvince}` : ""}</p>}
              {selected.eventDate && <p>📅 {selected.eventDate.slice(0, 10)}</p>}
            </div>
            <div className="flex gap-2">
              <a href={`https://www.gbif.org/occurrence/${selected.key}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition">
                <ExternalLink className="w-3 h-3" />GBIF
              </a>
              <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.species || "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition">
                <ExternalLink className="w-3 h-3" />iNaturalist
              </a>
              <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.species || "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition">
                <ExternalLink className="w-3 h-3" />Wiki
              </a>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-[400]">
            <div className="glass rounded-xl p-4 border border-border/50 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span className="text-sm">Loading {catInfo.label} occurrences from GBIF...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
