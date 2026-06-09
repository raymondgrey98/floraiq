import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Navigation, MapPin, Phone, ExternalLink, Loader2,
  RefreshCw, Star, StarOff, Bell, BellOff, Share2, Search,
  Layers, Filter, X, AlertTriangle,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { requestNotificationPermission, sendImmediateNotification } from "@/lib/notifications";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.DivIcon({
  html: `<div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);border:3px solid white;box-shadow:0 0 0 4px rgba(16,185,129,0.25),0 2px 8px rgba(0,0,0,0.4)"></div>`,
  className: "", iconSize: [22, 22], iconAnchor: [11, 11],
});

const pinIcon = new L.DivIcon({
  html: `<div style="width:18px;height:18px;border-radius:50%;background:rgba(251,191,36,0.3);border:2px solid #fbbf24;box-shadow:0 0 0 3px rgba(251,191,36,0.15)"></div>`,
  className: "", iconSize: [18, 18], iconAnchor: [9, 9],
});

const makeStoreIcon = (color: string, emoji: string, fav: boolean) => new L.DivIcon({
  html: `<div style="background:${color};border:2px solid ${fav ? "#fbbf24" : "white"};border-radius:10px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 10px rgba(0,0,0,0.5);${fav ? "box-shadow:0 0 0 2px #fbbf24,0 2px 10px rgba(0,0,0,0.5)" : ""}">${emoji}</div>`,
  className: "", iconSize: [32, 32], iconAnchor: [16, 16],
});

interface Store {
  id: number;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distance?: number;
  type: string;
  category: string;
}

const CATEGORIES = [
  { id: "all",        label: "All",          emoji: "🗺️",  color: "#6b7280" },
  { id: "seeds",      label: "Seeds",        emoji: "🌱",  color: "#10b981" },
  { id: "fertilizer", label: "Fertilizer",   emoji: "🧪",  color: "#f59e0b" },
  { id: "nursery",    label: "Nursery",      emoji: "🪴",  color: "#6366f1" },
  { id: "hardware",   label: "Hardware",     emoji: "🔧",  color: "#3b82f6" },
  { id: "vet",        label: "Vet / Feed",   emoji: "🐄",  color: "#ec4899" },
  { id: "market",     label: "Market",       emoji: "🏪",  color: "#8b5cf6" },
  { id: "equipment",  label: "Equipment",    emoji: "🚜",  color: "#ef4444" },
  { id: "irrigation", label: "Irrigation",   emoji: "💧",  color: "#06b6d4" },
];

const STORE_EMOJI: Record<string, string> = {
  seeds: "🌱", fertilizer: "🧪", nursery: "🪴",
  hardware: "🔧", vet: "🐄", market: "🏪", equipment: "🚜", irrigation: "💧",
  default: "🌾",
};
const STORE_COLOR: Record<string, string> = {
  seeds: "#10b981", fertilizer: "#f59e0b", nursery: "#6366f1",
  hardware: "#3b82f6", vet: "#ec4899", market: "#8b5cf6", equipment: "#ef4444", irrigation: "#06b6d4",
  default: "#10b981",
};

const RADIUS_OPTIONS = [1, 2, 5, 10, 25, 50, 100];

const TILES = {
  street:    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  topo:      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
};
const TILE_LABELS: Record<keyof typeof TILES, string> = { street: "Street", satellite: "Satellite", topo: "Terrain" };

function overpassQuery(lat: number, lon: number, radius: number) {
  const r = radius * 1000;
  return `[out:json][timeout:30];
(
  node["shop"="garden_centre"](around:${r},${lat},${lon});
  node["shop"="agrarian"](around:${r},${lat},${lon});
  node["shop"="farm"](around:${r},${lat},${lon});
  node["shop"="nursery"](around:${r},${lat},${lon});
  node["shop"="doityourself"](around:${r},${lat},${lon});
  node["shop"="hardware"](around:${r},${lat},${lon});
  node["shop"="seeds"](around:${r},${lat},${lon});
  node["shop"="fertilizer"](around:${r},${lat},${lon});
  node["shop"="pesticides"](around:${r},${lat},${lon});
  node["shop"="irrigation"](around:${r},${lat},${lon});
  node["amenity"="veterinary"](around:${r},${lat},${lon});
  node["shop"="pet"](around:${r},${lat},${lon});
  node["amenity"="marketplace"](around:${r},${lat},${lon});
  node["shop"="agricultural_supplies"](around:${r},${lat},${lon});
  node["craft"="agricultural_engines"](around:${r},${lat},${lon});
  node["landuse"="farmyard"]["name"](around:${r},${lat},${lon});
  way["shop"="garden_centre"](around:${r},${lat},${lon});
  way["shop"="agrarian"](around:${r},${lat},${lon});
  way["shop"="nursery"](around:${r},${lat},${lon});
  way["shop"="hardware"](around:${r},${lat},${lon});
  way["amenity"="marketplace"](around:${r},${lat},${lon});
  way["shop"="agricultural_supplies"](around:${r},${lat},${lon});
);
out body center qt;`;
}

function classifyStore(tags: Record<string, string>): { type: string; category: string } {
  const s = (tags.shop || tags.amenity || tags.craft || tags.landuse || "").toLowerCase();
  const n = (tags.name || "").toLowerCase();
  if (s === "nursery" || n.includes("nursery") || n.includes("nurseri")) return { type: "Plant Nursery", category: "nursery" };
  if (s === "garden_centre" || n.includes("garden")) return { type: "Garden Centre", category: "seeds" };
  if (s === "agrarian" || s === "farm" || s === "agricultural_supplies" || n.includes("agri") || n.includes("pertanian")) return { type: "Agriculture Supply", category: "fertilizer" };
  if (s === "seeds" || n.includes("seed") || n.includes("benih")) return { type: "Seeds & Plants", category: "seeds" };
  if (s === "fertilizer" || s === "pesticides" || n.includes("fertilizer") || n.includes("baja") || n.includes("pesticide")) return { type: "Fertilizer & Pesticides", category: "fertilizer" };
  if (s === "irrigation" || n.includes("irrigation") || n.includes("paip") || n.includes("sprinkler")) return { type: "Irrigation Supply", category: "irrigation" };
  if (s === "veterinary" || s === "pet" || n.includes("vet") || n.includes("haiwan") || n.includes("feed") || n.includes("makanan haiwan")) return { type: "Vet & Animal Feed", category: "vet" };
  if (s === "marketplace" || n.includes("market") || n.includes("pasar")) return { type: "Market / Pasar", category: "market" };
  if (s === "agricultural_engines" || n.includes("traktor") || n.includes("tractor") || n.includes("mesin")) return { type: "Farm Equipment", category: "equipment" };
  if (s === "hardware" || s === "doityourself" || n.includes("hardware") || n.includes("besi")) return { type: "Hardware / Tools", category: "hardware" };
  return { type: "Farm Supply", category: "seeds" };
}

function calcDist(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom ?? map.getZoom()); }, [center]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

const ALERT_DISTANCE_M = 500; // alert when within 500m of a saved store

export default function AgriStoreFinder() {
  const [userPos,    setUserPos]    = useState<[number, number] | null>(null);
  const [searchPin,  setSearchPin]  = useState<[number, number] | null>(null);
  const [stores,     setStores]     = useState<Store[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [radius,     setRadius]     = useState(10);
  const [selected,   setSelected]   = useState<Store | null>(null);
  const [error,      setError]      = useState("");
  const [searched,   setSearched]   = useState(false);
  const [catFilter,  setCatFilter]  = useState("all");
  const [tileKey,    setTileKey]    = useState<keyof typeof TILES>("street");
  const [favorites,  setFavorites]  = useState<number[]>([]);
  const [alertsOn,   setAlertsOn]   = useState(false);
  const [alertMsg,   setAlertMsg]   = useState("");
  const [searchText, setSearchText] = useState("");
  const [searching,  setSearching]  = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const watchRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    try {
      const f = localStorage.getItem("floraiq_agri_favs");
      if (f) setFavorites(JSON.parse(f));
      const a = localStorage.getItem("floraiq_agri_alerts");
      if (a === "true") setAlertsOn(true);
    } catch {}
    getLocation();
  }, []);

  // Proximity watch — check every 30 seconds if near a favourite store
  useEffect(() => {
    if (watchRef.current) clearInterval(watchRef.current);
    if (!alertsOn || favorites.length === 0) return;
    watchRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const nearbyFavs = stores.filter(s =>
          favorites.includes(s.id) &&
          !alertedRef.current.has(s.id) &&
          calcDist(lat, lon, s.lat, s.lon) * 1000 <= ALERT_DISTANCE_M
        );
        nearbyFavs.forEach(async s => {
          alertedRef.current.add(s.id);
          await sendImmediateNotification(
            `📍 Nearby: ${s.name}`,
            `You're within 500m of ${s.name} (${s.type}). Great time to pick up supplies!`
          );
          setAlertMsg(`Near ${s.name}!`);
          setTimeout(() => setAlertMsg(""), 5000);
        });
      }, () => {}, { timeout: 5000 });
    }, 30000);
    return () => { if (watchRef.current) clearInterval(watchRef.current); };
  }, [alertsOn, favorites, stores]);

  function saveFavs(ids: number[]) {
    setFavorites(ids);
    localStorage.setItem("floraiq_agri_favs", JSON.stringify(ids));
  }

  function toggleFav(id: number) {
    saveFavs(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]);
  }

  async function toggleAlerts() {
    if (alertsOn) {
      setAlertsOn(false);
      localStorage.setItem("floraiq_agri_alerts", "false");
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted) {
      setAlertsOn(true);
      localStorage.setItem("floraiq_agri_alerts", "true");
      setAlertMsg("Proximity alerts ON — you'll be notified when near a saved store.");
    } else {
      setAlertMsg("Allow notifications in Settings → Apps → FloraIQ → Notifications.");
    }
    setTimeout(() => setAlertMsg(""), 4000);
  }

  function getLocation() {
    setGpsLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setSearchPin(null);
        setGpsLoading(false);
        fetchStores(coords[0], coords[1], radius);
      },
      () => {
        setGpsLoading(false);
        setError("GPS denied. Using default location. Enable Location permission for accurate results.");
        const def: [number, number] = [1.5497, 110.3592];
        setUserPos(def);
        fetchStores(def[0], def[1], radius);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  async function geocodeSearch() {
    if (!searchText.trim()) return;
    setSearching(true);
    setError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (!data.length) { setError("Location not found. Try a more specific name."); setSearching(false); return; }
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setSearchPin([lat, lon]);
      fetchStores(lat, lon, radius);
    } catch {
      setError("Search failed. Check connection.");
    }
    setSearching(false);
  }

  function handleMapClick(lat: number, lon: number) {
    setSearchPin([lat, lon]);
    fetchStores(lat, lon, radius);
  }

  async function fetchStores(lat: number, lon: number, r: number) {
    setLoading(true);
    setStores([]);
    setSearched(false);
    setSelected(null);
    try {
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery(lat, lon, r),
        headers: { "Content-Type": "text/plain" },
      });
      const data = await res.json();
      const results: Store[] = (data.elements || [])
        .filter((el: any) => el.lat || el.center?.lat)
        .map((el: any) => {
          const slat = el.lat || el.center?.lat;
          const slon = el.lon || el.center?.lon;
          const { type, category } = classifyStore(el.tags || {});
          return {
            id: el.id,
            name: el.tags?.name || el.tags?.["name:en"] || el.tags?.["name:ms"] || type,
            lat: slat, lon: slon,
            tags: el.tags || {},
            distance: calcDist(lat, lon, slat, slon),
            type, category,
          };
        })
        .sort((a: Store, b: Store) => (a.distance || 0) - (b.distance || 0));
      setStores(results);
      setSearched(true);
    } catch {
      setError("Could not load store data. Check your connection.");
    }
    setLoading(false);
  }

  function openGoogleMaps(store: Store, mode: "directions" | "search") {
    const base = userPos;
    if (mode === "directions" && base) {
      window.open(`https://www.google.com/maps/dir/${base[0]},${base[1]}/${store.lat},${store.lon}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`, "_blank");
    }
  }

  function openWaze(store: Store) {
    window.open(`https://waze.com/ul?ll=${store.lat},${store.lon}&navigate=yes`, "_blank");
  }

  function openWazeSearch(query: string) {
    const base = userPos;
    if (base) window.open(`https://waze.com/ul?ll=${base[0]},${base[1]}&navigate=yes&q=${encodeURIComponent(query)}`, "_blank");
    else window.open(`https://waze.com/ul?q=${encodeURIComponent(query)}`, "_blank");
  }

  function shareStore(store: Store) {
    const text = `${store.name} — ${store.type}\nhttps://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`;
    if (navigator.share) navigator.share({ title: store.name, text });
    else { navigator.clipboard?.writeText(text); setAlertMsg("Location copied!"); setTimeout(() => setAlertMsg(""), 2000); }
  }

  const searchCenter = searchPin || userPos;
  const mapCenter: [number, number] = searchCenter || [1.5497, 110.3592];

  const displayed = stores.filter(s => catFilter === "all" || s.category === catFilter);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">

      {/* Header */}
      <div className="glass border-b border-border z-50 flex-shrink-0">
        <div className="container flex items-center gap-2 h-14">
          <Link href="/tools">
            <button type="button" className="text-muted-foreground hover:text-white p-1 shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />

          {/* Search bar */}
          <div className="flex-1 flex items-center gap-2">
            <form onSubmit={e => { e.preventDefault(); geocodeSearch(); }} className="flex-1 flex gap-1">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Search area, city, village…"
                  className="w-full bg-background/60 border border-border/50 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button type="submit" disabled={searching}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60 shrink-0">
                {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Go"}
              </button>
            </form>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={() => setShowFilters(f => !f)} title="Filters"
              className={`p-2 glass border rounded-lg text-xs transition ${showFilters ? "border-emerald-500/50 text-emerald-400" : "border-border/50 text-muted-foreground hover:text-white"}`}>
              <Filter className="w-4 h-4" />
            </button>
            <button type="button" onClick={toggleAlerts} title={alertsOn ? "Disable proximity alerts" : "Enable proximity alerts"}
              className={`p-2 glass border rounded-lg transition ${alertsOn ? "border-emerald-500/50 text-emerald-400" : "border-border/50 text-muted-foreground hover:text-white"}`}>
              {alertsOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>
            <button type="button" onClick={() => userPos && fetchStores(...(searchPin || userPos), radius)} disabled={loading}
              className="p-2 glass border border-border/50 rounded-lg text-muted-foreground hover:text-white disabled:opacity-40 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Category filter row */}
        {showFilters && (
          <div className="container pb-2 overflow-x-auto">
            <div className="flex gap-1.5 w-max">
              {CATEGORIES.map(cat => (
                <button key={cat.id} type="button" onClick={() => setCatFilter(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    catFilter === cat.id ? "text-white" : "glass border border-border/50 text-muted-foreground hover:text-white"
                  }`}
                  style={catFilter === cat.id ? { background: cat.color } : {}}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert banner */}
      {alertMsg && (
        <div className="bg-emerald-500/90 text-white text-xs font-semibold px-4 py-2 text-center z-50 flex items-center justify-center gap-2 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />{alertMsg}
        </div>
      )}

      {/* Map area */}
      <div className="flex-1 relative">
        <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>

          {/* Tile layer */}
          <TileLayer
            key={tileKey}
            url={TILES[tileKey]}
            attribution={tileKey === "satellite"
              ? "© Esri, Maxar, Earthstar Geographics"
              : tileKey === "topo" ? "© OpenTopoMap" : "© OpenStreetMap"}
            maxZoom={tileKey === "topo" ? 17 : 19}
          />

          <MapController center={mapCenter} />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* User GPS position */}
          {userPos && (
            <>
              <Marker position={userPos} icon={userIcon}>
                <Popup><div className="text-xs font-bold text-center">📍 Your location</div></Popup>
              </Marker>
              {!searchPin && (
                <Circle center={userPos} radius={radius * 1000}
                  pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.04, dashArray: "6", weight: 1.5 }} />
              )}
            </>
          )}

          {/* Search pin (tap-to-search) */}
          {searchPin && (
            <>
              <Marker position={searchPin} icon={pinIcon}>
                <Popup><div className="text-xs text-center font-semibold">🔍 Search point<br/><span className="text-gray-500 font-normal">Tap elsewhere to move</span></div></Popup>
              </Marker>
              <Circle center={searchPin} radius={radius * 1000}
                pathOptions={{ color: "#fbbf24", fillColor: "#fbbf24", fillOpacity: 0.04, dashArray: "6", weight: 1.5 }} />
            </>
          )}

          {/* Store markers */}
          {displayed.map(store => (
            <Marker key={store.id} position={[store.lat, store.lon]}
              icon={makeStoreIcon(STORE_COLOR[store.category] || STORE_COLOR.default, STORE_EMOJI[store.category] || STORE_EMOJI.default, favorites.includes(store.id))}
              eventHandlers={{ click: () => setSelected(s => s?.id === store.id ? null : store) }}>
              <Popup>
                <div className="text-sm min-w-[180px]">
                  <p className="font-bold">{store.name}</p>
                  <p className="text-gray-500 text-xs">{store.type}</p>
                  <p className="text-xs mt-1 text-gray-600">{store.distance?.toFixed(1)} km away</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <button onClick={() => openGoogleMaps(store, "directions")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">📍 Directions</button>
                    <button onClick={() => openWaze(store)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">🚗 Waze</button>
                    <button onClick={() => toggleFav(store.id)} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">
                      {favorites.includes(store.id) ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Loading overlay */}
        {(gpsLoading || loading) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 backdrop-blur-sm">
            <div className="glass rounded-2xl p-6 border border-emerald-500/30 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold">{gpsLoading ? "Getting your location…" : "Scanning for stores…"}</p>
              <p className="text-xs text-muted-foreground">Searching {radius}km radius</p>
            </div>
          </div>
        )}

        {/* Floating right controls */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">

          {/* Tile switcher */}
          <div className="glass rounded-xl border border-border/60 p-1.5 space-y-1">
            <p className="text-[9px] text-muted-foreground text-center font-bold px-1">MAP</p>
            {(Object.keys(TILES) as Array<keyof typeof TILES>).map(t => (
              <button key={t} type="button" onClick={() => setTileKey(t)}
                className={`w-full text-[10px] px-2 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${tileKey === t ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white"}`}>
                <Layers className="w-3 h-3" />{TILE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Radius */}
          <div className="glass rounded-xl border border-border/60 p-1.5 space-y-1">
            <p className="text-[9px] text-muted-foreground text-center font-bold px-1">RADIUS</p>
            {RADIUS_OPTIONS.map(r => (
              <button key={r} type="button"
                onClick={() => { setRadius(r); const c = searchPin || userPos; if (c) fetchStores(c[0], c[1], r); }}
                className={`w-full text-[10px] px-2 py-1.5 rounded-lg font-bold transition-all ${radius === r ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white"}`}>
                {r}km
              </button>
            ))}
          </div>

          {/* GPS button */}
          <button type="button" onClick={getLocation} disabled={gpsLoading}
            className="glass border border-emerald-500/50 text-emerald-400 rounded-xl p-2.5 text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-emerald-500/10 transition disabled:opacity-50">
            <Navigation className="w-3.5 h-3.5" />GPS
          </button>
        </div>

        {/* Tap hint */}
        <div className="absolute top-3 left-3 z-30 glass border border-border/40 rounded-xl px-3 py-1.5">
          <p className="text-[10px] text-muted-foreground">Tap map to search any location</p>
        </div>

        {/* Error */}
        {error && (
          <div className="absolute top-14 left-3 right-24 z-30 glass border border-amber-500/40 rounded-xl p-2">
            <p className="text-[11px] text-amber-300 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 shrink-0" />{error}</p>
          </div>
        )}

        {/* Bottom panel */}
        <div className="absolute bottom-0 left-0 right-0 z-30">

          {/* Stats bar */}
          <div className="glass border-t border-border/50 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-bold">
              {loading ? "Searching…" : searched
                ? `${displayed.length} stores${catFilter !== "all" ? ` (${CATEGORIES.find(c=>c.id===catFilter)?.label})` : ""} within ${radius}km`
                : "Tap GPS or search to find stores"}
            </span>
            <div className="flex items-center gap-2">
              {favorites.length > 0 && (
                <span className="text-[10px] text-yellow-400 font-semibold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400" />{favorites.length} saved
                </span>
              )}
              {stores.length === 0 && searched && !loading && (
                <button type="button"
                  onClick={() => { const next = RADIUS_OPTIONS[Math.min(RADIUS_OPTIONS.indexOf(radius)+1, RADIUS_OPTIONS.length-1)]; setRadius(next); const c = searchPin || userPos; if (c) fetchStores(c[0], c[1], next); }}
                  className="text-[11px] text-emerald-400 font-bold">
                  Expand →
                </button>
              )}
            </div>
          </div>

          {/* Waze category quick-search buttons */}
          <div className="bg-background/95 backdrop-blur-md border-t border-border/20 px-3 py-2 overflow-x-auto">
            <div className="flex gap-2 w-max">
              {[
                { label: "🌱 Seeds & Fertilizer", q: "agriculture seeds fertilizer shop" },
                { label: "🪴 Nursery", q: "plant nursery" },
                { label: "🔧 Hardware Tools", q: "hardware farm tools shop" },
                { label: "🐄 Animal Feed", q: "veterinary animal feed shop" },
                { label: "💧 Irrigation", q: "irrigation pipe supply" },
                { label: "🚜 Farm Equipment", q: "tractor farm equipment" },
                { label: "🏪 Agri Market", q: "agriculture market pasar" },
              ].map(item => (
                <button key={item.q} type="button" onClick={() => openWazeSearch(item.q)}
                  className="whitespace-nowrap glass border border-border/50 px-3 py-1.5 rounded-full text-xs hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Store cards */}
          {displayed.length > 0 && (
            <div className="bg-background/95 backdrop-blur-md border-t border-border/30 overflow-x-auto">
              <div className="flex gap-3 p-3 w-max">
                {displayed.slice(0, 20).map(store => {
                  const isFav = favorites.includes(store.id);
                  const color = STORE_COLOR[store.category] || STORE_COLOR.default;
                  const emoji = STORE_EMOJI[store.category] || STORE_EMOJI.default;
                  return (
                    <div key={store.id} onClick={() => setSelected(s => s?.id === store.id ? null : store)}
                      className={`flex-shrink-0 w-72 glass rounded-xl p-3 border cursor-pointer transition-all ${selected?.id === store.id ? "border-emerald-500/70 bg-emerald-500/5" : isFav ? "border-yellow-500/40" : "border-border/50 hover:border-emerald-500/30"}`}>

                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                          style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                          {emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-sm truncate">{store.name}</p>
                            {isFav && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{store.type}</p>
                        </div>
                      </div>

                      {/* Distance + info */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" />{store.distance?.toFixed(1)} km</span>
                        {store.tags.phone && <span className="flex items-center gap-1 truncate"><Phone className="w-3 h-3" />{store.tags.phone}</span>}
                      </div>
                      {store.tags["addr:street"] && (
                        <p className="text-[10px] text-muted-foreground mb-2 truncate">
                          📍 {store.tags["addr:street"]}{store.tags["addr:city"] ? `, ${store.tags["addr:city"]}` : ""}
                        </p>
                      )}
                      {store.tags.opening_hours && (
                        <p className="text-[10px] text-blue-400 mb-2">🕐 {store.tags.opening_hours}</p>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-1.5">
                        <button type="button" onClick={e => { e.stopPropagation(); openGoogleMaps(store, "directions"); }}
                          className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition flex items-center justify-center gap-1">
                          🗺️ Maps
                        </button>
                        <button type="button" onClick={e => { e.stopPropagation(); openWaze(store); }}
                          className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition flex items-center justify-center gap-1">
                          🚗 Waze
                        </button>
                        <button type="button" onClick={e => { e.stopPropagation(); toggleFav(store.id); }}
                          title={isFav ? "Unsave" : "Save"}
                          className={`px-2 py-1.5 rounded-lg text-sm transition ${isFav ? "bg-yellow-500/20 text-yellow-400" : "bg-border/20 text-muted-foreground hover:text-yellow-400"}`}>
                          {isFav ? <Star className="w-3.5 h-3.5 fill-yellow-400" /> : <StarOff className="w-3.5 h-3.5" />}
                        </button>
                        <button type="button" onClick={e => { e.stopPropagation(); shareStore(store); }}
                          title="Share location"
                          className="px-2 py-1.5 rounded-lg bg-border/20 text-muted-foreground hover:text-white transition">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        {store.tags.website && (
                          <button type="button" onClick={e => { e.stopPropagation(); window.open(store.tags.website, "_blank"); }}
                            className="px-2 py-1.5 rounded-lg bg-border/20 text-muted-foreground hover:text-white transition">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {displayed.length === 0 && searched && !loading && (
            <div className="bg-background/95 backdrop-blur-md border-t border-border/30 p-4 text-center space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">No stores found in {radius}km</p>
              <p className="text-xs text-muted-foreground">OpenStreetMap may not have them mapped yet. Try Google Maps or Waze:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <a href={searchCenter ? `https://www.google.com/maps/search/agriculture+supply+store/@${searchCenter[0]},${searchCenter[1]},13z` : `https://www.google.com/maps/search/agriculture+supply`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-green-500/20 text-green-400 px-4 py-2 rounded-xl font-bold">
                  🗺️ Google Maps
                </a>
                <button type="button" onClick={() => openWazeSearch("agriculture supply fertilizer shop")}
                  className="text-xs bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl font-bold">
                  🚗 Search Waze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
