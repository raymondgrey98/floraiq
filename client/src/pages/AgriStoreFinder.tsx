import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, Navigation, MapPin, Phone, ExternalLink, Loader2, RefreshCw, SlidersHorizontal } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.DivIcon({
  html: `<div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:3px solid white;box-shadow:0 0 0 3px rgba(16,185,129,0.3)"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const storeIcon = (color: string) => new L.DivIcon({
  html: `<div style="background:${color};border:2px solid white;border-radius:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🌱</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Store {
  id: number;
  name: string;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  distance?: number;
  type: string;
  score: number;
}

/**
 * Best-market ranking for buying fertilizer and farm inputs.
 * Relevance of the store type is weighed against travel distance, with a
 * small boost for listings that publish contact/opening data (a proxy for
 * an active, findable business). Works identically in all 196 countries —
 * the data source is OpenStreetMap, not a regional directory.
 */
const TYPE_RELEVANCE: Record<string, number> = {
  "Agriculture Supply":     1.0,  // dedicated agri input dealers — fertilizer certain
  "Garden Centre":          0.9,
  "Plant Nursery":          0.7,
  "Hardware / Farm Supply": 0.55,
  "Market":                 0.45, // general marketplaces — fertilizer possible
  "Farm Supply":            0.6,
};

function scoreStore(type: string, distanceKm: number, tags: Record<string, string>): number {
  const relevance = TYPE_RELEVANCE[type] ?? 0.5;
  const infoBoost =
    (tags.phone || tags["contact:phone"] ? 0.05 : 0) +
    (tags.website || tags["contact:website"] ? 0.05 : 0) +
    (tags.opening_hours ? 0.05 : 0);
  // Inverse-distance weighting: a perfect store 20 km away should not beat
  // a good one around the corner.
  return (relevance + infoBoost) / (1 + distanceKm / 3);
}

const RADIUS_OPTIONS = [2, 5, 10, 25, 50];

const OVERPASS_QUERY = (lat: number, lon: number, radius: number) => `
[out:json][timeout:30];
(
  node["shop"="garden_centre"](around:${radius * 1000},${lat},${lon});
  node["shop"="agrarian"](around:${radius * 1000},${lat},${lon});
  node["shop"="farm"](around:${radius * 1000},${lat},${lon});
  node["shop"="nursery"](around:${radius * 1000},${lat},${lon});
  node["shop"="doityourself"](around:${radius * 1000},${lat},${lon});
  node["shop"="hardware"](around:${radius * 1000},${lat},${lon});
  node["amenity"="marketplace"](around:${radius * 1000},${lat},${lon});
  node["landuse"="farmyard"]["name"](around:${radius * 1000},${lat},${lon});
  way["shop"="garden_centre"](around:${radius * 1000},${lat},${lon});
  way["shop"="agrarian"](around:${radius * 1000},${lat},${lon});
  way["shop"="nursery"](around:${radius * 1000},${lat},${lon});
  way["shop"="hardware"](around:${radius * 1000},${lat},${lon});
  way["amenity"="marketplace"](around:${radius * 1000},${lat},${lon});
);
out body center qt;
`;

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStoreType(tags: Record<string, string>): string {
  const s = tags.shop || tags.amenity || tags.landuse || "";
  if (s === "garden_centre") return "Garden Centre";
  if (s === "agrarian" || s === "farm") return "Agriculture Supply";
  if (s === "nursery") return "Plant Nursery";
  if (s === "hardware" || s === "doityourself") return "Hardware / Farm Supply";
  if (s === "marketplace") return "Market";
  return "Farm Supply";
}

function getStoreColor(type: string): string {
  if (type.includes("Garden")) return "#10b981";
  if (type.includes("Agriculture") || type.includes("Farm Supply")) return "#f59e0b";
  if (type.includes("Nursery")) return "#6366f1";
  if (type.includes("Hardware")) return "#3b82f6";
  if (type.includes("Market")) return "#ec4899";
  return "#10b981";
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

export default function AgriStoreFinder() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [radius, setRadius] = useState(10);
  const [selected, setSelected] = useState<Store | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  function getLocation() {
    setGpsLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setGpsLoading(false);
        fetchStores(coords[0], coords[1], radius);
      },
      () => {
        setGpsLoading(false);
        // No regional fallback — this app serves all 196 countries. Without a
        // pinpoint we cannot rank nearby markets, so ask for permission instead
        // of silently teleporting the user somewhere they are not.
        setError("Location permission needed to find markets near you. Enable it and tap refresh.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  async function fetchStores(lat: number, lon: number, r: number) {
    setLoading(true);
    setStores([]);
    setSearched(false);
    try {
      const query = OVERPASS_QUERY(lat, lon, r);
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
        headers: { "Content-Type": "text/plain" },
      });
      const data = await res.json();

      const results: Store[] = (data.elements || [])
        .filter((el: any) => el.lat || el.center?.lat)
        .map((el: any) => {
          const slat = el.lat || el.center?.lat;
          const slon = el.lon || el.center?.lon;
          const tags = el.tags || {};
          const type = getStoreType(tags);
          const distance = calcDistance(lat, lon, slat, slon);
          return {
            id: el.id,
            name: tags.name || tags["name:en"] || type,
            lat: slat,
            lon: slon,
            tags,
            distance,
            type,
            score: scoreStore(type, distance, tags),
          };
        })
        // Best market first: relevance-per-distance, not raw proximity
        .sort((a: Store, b: Store) => b.score - a.score);

      setStores(results);
      setSearched(true);
    } catch {
      setError("Could not load store data. Check your connection.");
    }
    setLoading(false);
  }

  function openRoute(store: Store, app: "waze" | "gmaps") {
    if (!userPos) return;
    if (app === "waze") {
      window.open(`https://waze.com/ul?ll=${store.lat},${store.lon}&navigate=yes`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/dir/${userPos[0]},${userPos[1]}/${store.lat},${store.lon}`, "_blank");
    }
  }

  useEffect(() => { getLocation(); }, []);

  // Neutral world view until the user shares a pinpoint — no regional bias
  const mapCenter: [number, number] = userPos || [20, 0];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="glass border-b border-border z-50 flex-shrink-0">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/tools">
            <button type="button" aria-label="Back" className="text-muted-foreground hover:text-white p-1">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <Navigation className="w-4 h-4 text-emerald-400" />
          <div className="flex-1">
            <h1 className="text-base font-bold leading-none">Nearest Agri Store</h1>
            <p className="text-[11px] text-muted-foreground">Real stores near your location</p>
          </div>
          <button
            type="button"
            onClick={() => userPos && fetchStores(userPos[0], userPos[1], radius)}
            disabled={loading || !userPos}
            className="p-2 glass border border-border/50 rounded-lg text-muted-foreground hover:text-white disabled:opacity-40 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Map — full area */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={userPos ? 12 : 2}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://openstreetmap.org">OSM</a>'
          />
          <MapUpdater center={mapCenter} />

          {/* User position */}
          {userPos && (
            <>
              <Marker position={userPos} icon={userIcon}>
                <Popup><div className="text-xs font-bold text-center">📍 You are here</div></Popup>
              </Marker>
              <Circle
                center={userPos}
                radius={radius * 1000}
                pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.05, dashArray: "6" }}
              />
            </>
          )}

          {/* Store markers */}
          {stores.map(store => (
            <Marker
              key={store.id}
              position={[store.lat, store.lon]}
              icon={storeIcon(getStoreColor(store.type))}
              eventHandlers={{ click: () => setSelected(store) }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{store.name}</p>
                  <p className="text-gray-600 text-xs">{store.type}</p>
                  <p className="text-xs mt-1">{store.distance?.toFixed(1)} km away</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => openRoute(store, "waze")} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Waze</button>
                    <button onClick={() => openRoute(store, "gmaps")} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Maps</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* GPS / loading overlay */}
        {(gpsLoading || loading) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-40 backdrop-blur-sm">
            <div className="glass rounded-2xl p-6 border border-emerald-500/30 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold">{gpsLoading ? "Getting your location…" : "Finding nearby stores…"}</p>
              <p className="text-xs text-muted-foreground">Searching {radius}km radius via OpenStreetMap</p>
            </div>
          </div>
        )}

        {/* Radius + GPS controls — floating top right */}
        <div className="absolute top-3 right-3 z-30 space-y-2">
          <div className="glass rounded-xl border border-border/60 p-2 space-y-1">
            <p className="text-[10px] text-muted-foreground text-center font-bold px-1">RADIUS</p>
            {RADIUS_OPTIONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => { setRadius(r); if (userPos) fetchStores(userPos[0], userPos[1], r); }}
                className={`w-full text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${radius === r ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white"}`}
              >
                {r}km
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={getLocation}
            disabled={gpsLoading}
            className="w-full glass border border-emerald-500/50 text-emerald-400 rounded-xl p-2.5 text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-500/10 transition disabled:opacity-50"
          >
            <Navigation className="w-3 h-3" />
            GPS
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="absolute top-3 left-3 right-16 z-30 glass border border-amber-500/40 rounded-xl p-3">
            <p className="text-xs text-amber-300">⚠️ {error} Showing Kuching area.</p>
          </div>
        )}

        {/* Bottom results panel */}
        <div ref={panelRef} className="absolute bottom-0 left-0 right-0 z-30">
          {/* Results count bar */}
          <div className="glass border-t border-border/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold">
                {loading ? "Searching…" : searched ? `${stores.length} stores found within ${radius}km` : "Locating…"}
              </span>
            </div>
            {stores.length === 0 && searched && !loading && (
              <button
                type="button"
                onClick={() => { const next = RADIUS_OPTIONS[Math.min(RADIUS_OPTIONS.indexOf(radius) + 1, RADIUS_OPTIONS.length - 1)]; setRadius(next); if (userPos) fetchStores(userPos[0], userPos[1], next); }}
                className="text-xs text-emerald-400 font-bold"
              >
                Expand radius →
              </button>
            )}
          </div>

          {/* Horizontal scroll store cards */}
          {stores.length > 0 && (
            <div className="bg-background/95 backdrop-blur-md border-t border-border/30 overflow-x-auto">
              <div className="flex gap-3 p-3 w-max">
                {stores.slice(0, 15).map((store, idx) => (
                  <div
                    key={store.id}
                    onClick={() => setSelected(store === selected ? null : store)}
                    className={`relative flex-shrink-0 w-64 glass rounded-xl p-3 border cursor-pointer transition-all ${selected?.id === store.id ? "border-emerald-500/70 bg-emerald-500/5" : "border-border/50 hover:border-emerald-500/30"}`}
                  >
                    {idx === 0 && (
                      <span className="absolute -top-2 right-3 rounded-full bg-sunlight px-2 py-0.5 text-[9px] font-black tracking-wide text-primary-foreground shadow-[var(--shadow-lift)]">
                        ⭐ BEST PICK
                      </span>
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: getStoreColor(store.type) + "22", border: `1px solid ${getStoreColor(store.type)}44` }}>
                        <span className="text-base">{store.type.includes("Nursery") ? "🌱" : store.type.includes("Garden") ? "🪴" : store.type.includes("Hardware") ? "🔧" : store.type.includes("Market") ? "🏪" : "🌾"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{store.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{store.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" />{store.distance?.toFixed(1)} km</span>
                      {store.tags.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{store.tags.phone}</span>}
                    </div>

                    {store.tags["addr:street"] && (
                      <p className="text-[10px] text-muted-foreground mb-2 truncate">📍 {store.tags["addr:street"]}{store.tags["addr:city"] ? `, ${store.tags["addr:city"]}` : ""}</p>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openRoute(store, "waze"); }}
                        className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition flex items-center justify-center gap-1"
                      >
                        🚗 Waze
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openRoute(store, "gmaps"); }}
                        className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition flex items-center justify-center gap-1"
                      >
                        🗺️ Maps
                      </button>
                      {store.tags.website && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); window.open(store.tags.website, "_blank"); }}
                          className="text-[11px] px-2 py-1.5 rounded-lg bg-border/30 text-muted-foreground hover:text-white transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {stores.length === 0 && searched && !loading && (
            <div className="bg-background/95 backdrop-blur-md border-t border-border/30 p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">No tagged stores found in {radius}km</p>
              <p className="text-xs text-muted-foreground">OpenStreetMap may not have local stores mapped yet.</p>
              <div className="flex gap-2 justify-center mt-2">
                <a
                  href={userPos ? `https://www.google.com/maps/search/fertilizer+shop+agriculture/@${userPos[0]},${userPos[1]},13z` : "https://www.google.com/maps/search/fertilizer+shop"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl font-bold"
                >
                  Search Google Maps →
                </a>
                <a
                  href={userPos ? `https://waze.com/ul?ll=${userPos[0]},${userPos[1]}&navigate=yes&q=fertilizer+shop` : "https://waze.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl font-bold"
                >
                  Search Waze →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
