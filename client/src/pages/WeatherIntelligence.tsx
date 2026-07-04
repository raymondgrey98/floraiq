/**
 * WeatherIntelligence — Route: /weathermap
 *
 * ArcGIS-style multi-layer Earth intelligence map, global coverage, zero API keys:
 *   RADAR — live precipitation tiles from RainViewer (rainviewer.com/api.html)
 *   CLOUDS — infrared satellite tiles from RainViewer
 *   SAT — NASA GIBS MODIS Terra true-color satellite imagery, updated daily
 *          (nasa-gibs.github.io/gibs-api-docs — public WMTS, no key)
 *   EVENTS — NASA EONET live natural events: wildfires, severe storms,
 *          volcanoes, floods, sea ice (eonet.gsfc.nasa.gov — public API)
 *   HEAT — temperature grid sampled from Open-Meteo (open-meteo.com), rendered
 *          as a color-ramped field that re-samples as the map moves
 *   WIND — direction/speed arrows from the same Open-Meteo grid
 *
 * Tap anywhere for a 7-day forecast at that exact point. Farmers use this to
 * time fertilizer application (no rain within ~24h), irrigation, and heat
 * stress protection — anywhere on Earth.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CloudRain, Cloud, Thermometer, Wind, Crosshair, X,
  Satellite, Flame,
} from "lucide-react";
import { useT } from "@/i18n";

type LayerKey = "RADAR" | "CLOUDS" | "SAT" | "EVENTS" | "HEAT" | "WIND";

const LAYERS: { key: LayerKey; label: string; Icon: typeof CloudRain; color: string }[] = [
  { key: "RADAR",  label: "Rain radar",   Icon: CloudRain,   color: "#5aa7de" },
  { key: "CLOUDS", label: "Clouds IR",    Icon: Cloud,       color: "#94aa97" },
  { key: "SAT",    label: "NASA satellite", Icon: Satellite, color: "#d976a8" },
  { key: "EVENTS", label: "NASA events",  Icon: Flame,       color: "#e9b95c" },
  { key: "HEAT",   label: "Heat",         Icon: Thermometer, color: "#e05648" },
  { key: "WIND",   label: "Wind",         Icon: Wind,        color: "#7fe29d" },
];

/** NASA EONET category → marker glyph */
const EONET_EMOJI: Record<string, string> = {
  wildfires: "🔥", severeStorms: "🌀", volcanoes: "🌋", floods: "🌊",
  seaLakeIce: "🧊", drought: "🏜️", dustHaze: "🌫️", earthquakes: "💥",
  landslides: "⛰️", snow: "❄️", tempExtremes: "🌡️", manmade: "⚠️",
};

const WMO_ICON: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "⛈️",
  71: "🌨️", 73: "🌨️", 75: "❄️", 80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

/** Temperature → color ramp (°C), water-blue through leaf-green to wilt-red */
function tempColor(t: number): string {
  if (t <= -10) return "#7fb5e8";
  if (t <= 0)   return "#5aa7de";
  if (t <= 10)  return "#8fd0a0";
  if (t <= 20)  return "#55c877";
  if (t <= 27)  return "#c9c95e";
  if (t <= 32)  return "#e9b95c";
  if (t <= 37)  return "#e0813f";
  return "#e05648";
}

interface ForecastDay {
  date: string;
  tMax: number;
  tMin: number;
  precip: number;
  code: number;
}

interface PointForecast {
  lat: number;
  lon: number;
  days: ForecastDay[];
}

export default function WeatherIntelligence() {
  const t = useT();
  const mapDivRef  = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<L.Map | null>(null);
  const radarRef   = useRef<L.TileLayer | null>(null);
  const cloudsRef  = useRef<L.TileLayer | null>(null);
  const satRef     = useRef<L.TileLayer | null>(null);
  const eventsRef  = useRef<L.LayerGroup | null>(null);
  const heatRef    = useRef<L.LayerGroup | null>(null);
  const windRef    = useRef<L.LayerGroup | null>(null);
  const pinRef     = useRef<L.Marker | null>(null);
  const gridAbort  = useRef<AbortController | null>(null);
  const activeRef  = useRef<Set<LayerKey>>(new Set(["RADAR", "HEAT"]));

  const [active, setActive]     = useState<Set<LayerKey>>(new Set(["RADAR", "HEAT"]));
  const [radarTime, setRadarTime] = useState<string>("");
  const [forecast, setForecast] = useState<PointForecast | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // ── Sample a lat/lon grid over the current viewport from Open-Meteo ────────
  const refreshGrid = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const wantHeat = activeRef.current.has("HEAT");
    const wantWind = activeRef.current.has("WIND");
    heatRef.current?.clearLayers();
    windRef.current?.clearLayers();
    if (!wantHeat && !wantWind) return;

    const b = map.getBounds();
    const cols = 6, rows = 5;
    const lats: number[] = [];
    const lons: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        lats.push(+(b.getSouth() + ((r + 0.5) / rows) * (b.getNorth() - b.getSouth())).toFixed(3));
        lons.push(+(b.getWest()  + ((c + 0.5) / cols) * (b.getEast()  - b.getWest())).toFixed(3));
      }
    }

    gridAbort.current?.abort();
    gridAbort.current = new AbortController();
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lats.join(",")}&longitude=${lons.join(",")}` +
        `&current=temperature_2m,wind_speed_10m,wind_direction_10m`;
      const res = await fetch(url, { signal: gridAbort.current.signal });
      if (!res.ok) return;
      const json = await res.json();
      const points: any[] = Array.isArray(json) ? json : [json];

      points.forEach((p, i) => {
        const cur = p?.current;
        if (!cur) return;
        const lat = lats[i], lon = lons[i];

        if (wantHeat && typeof cur.temperature_2m === "number") {
          const temp = Math.round(cur.temperature_2m);
          L.marker([lat, lon], {
            interactive: false,
            icon: L.divIcon({
              className: "",
              html: `<div style="transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;
                       width:44px;height:28px;border-radius:9999px;font:700 11px Inter,sans-serif;
                       color:#06130a;background:${tempColor(temp)};opacity:.88;
                       box-shadow:0 2px 8px rgba(4,12,7,.5)">${temp}°</div>`,
              iconSize: [0, 0],
            }),
          }).addTo(heatRef.current!);
        }

        if (wantWind && typeof cur.wind_direction_10m === "number") {
          const speed = Math.round(cur.wind_speed_10m ?? 0);
          L.marker([lat, lon], {
            interactive: false,
            icon: L.divIcon({
              className: "",
              html: `<div style="transform:translate(-50%,-50%) rotate(${cur.wind_direction_10m + 180}deg);
                       color:#7fe29d;font-size:${Math.min(14 + speed / 3, 26)}px;
                       text-shadow:0 1px 4px rgba(4,12,7,.8)">↑</div>
                     <div style="transform:translate(-50%,4px);color:#94aa97;font:600 9px Inter,sans-serif;
                       text-align:center">${speed}</div>`,
              iconSize: [0, 0],
            }),
          }).addTo(windRef.current!);
        }
      });
    } catch { /* aborted or offline — keep previous field */ }
  }, []);

  // ── Map init ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, { zoomControl: false, worldCopyJump: true })
      .setView([15, 15], 3); // whole-world start — no regional bias
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(map);

    heatRef.current   = L.layerGroup().addTo(map);
    windRef.current   = L.layerGroup().addTo(map);
    eventsRef.current = L.layerGroup();
    mapRef.current    = map;

    // NASA GIBS — MODIS Terra true-color, yesterday's UTC pass (today's
    // imagery is incomplete until the daily processing finishes)
    const d = new Date(Date.now() - 24 * 3600 * 1000);
    const gibsDate = d.toISOString().slice(0, 10);
    satRef.current = L.tileLayer(
      `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
      { attribution: "NASA GIBS", opacity: 0.85, maxNativeZoom: 9, maxZoom: 18 },
    );
    if (activeRef.current.has("SAT")) satRef.current.addTo(map);

    // NASA EONET — live natural events (wildfires, storms, volcanoes, floods…)
    fetch("https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=300")
      .then(r => r.json())
      .then(json => {
        (json?.events ?? []).forEach((ev: any) => {
          const geo = ev.geometry?.[ev.geometry.length - 1];
          if (geo?.type !== "Point" || !Array.isArray(geo.coordinates)) return;
          const [lon, lat] = geo.coordinates;
          const cat = ev.categories?.[0];
          const glyph = EONET_EMOJI[cat?.id] ?? "📍";
          L.marker([lat, lon], {
            icon: L.divIcon({
              className: "",
              html: `<div style="transform:translate(-50%,-50%);font-size:18px;
                       text-shadow:0 1px 6px rgba(4,12,7,.9)">${glyph}</div>`,
              iconSize: [0, 0],
            }),
          })
            .bindPopup(
              `<b>${ev.title}</b><br/>${cat?.title ?? "Event"} · ${
                geo.date ? new Date(geo.date).toLocaleDateString() : ""
              }<br/><span style="font-size:10px">Source: NASA EONET</span>`,
            )
            .addTo(eventsRef.current!);
        });
        if (activeRef.current.has("EVENTS")) eventsRef.current!.addTo(map);
      })
      .catch(() => { /* EONET unavailable — other layers still work */ });

    // RainViewer frame catalog → newest radar + infrared tile layers
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then(r => r.json())
      .then(cat => {
        const host = cat?.host ?? "https://tilecache.rainviewer.com";
        const radarFrames = cat?.radar?.past ?? [];
        const newest = radarFrames[radarFrames.length - 1];
        if (newest) {
          radarRef.current = L.tileLayer(
            `${host}${newest.path}/256/{z}/{x}/{y}/2/1_1.png`,
            { opacity: 0.75, maxZoom: 18 },
          );
          if (activeRef.current.has("RADAR")) radarRef.current.addTo(map);
          setRadarTime(new Date(newest.time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
        const irFrames = cat?.satellite?.infrared ?? [];
        const newestIr = irFrames[irFrames.length - 1];
        if (newestIr) {
          cloudsRef.current = L.tileLayer(
            `${host}${newestIr.path}/256/{z}/{x}/{y}/0/0_0.png`,
            { opacity: 0.45, maxZoom: 18 },
          );
          if (activeRef.current.has("CLOUDS")) cloudsRef.current.addTo(map);
        }
      })
      .catch(() => { /* radar unavailable — other layers still work */ });

    // Re-sample the temperature/wind grid when the viewport settles
    let debounce: ReturnType<typeof setTimeout>;
    map.on("moveend", () => {
      clearTimeout(debounce);
      debounce = setTimeout(refreshGrid, 600);
    });
    refreshGrid();

    // Tap → point forecast
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      pinRef.current?.remove();
      pinRef.current = L.marker([lat, lng]).addTo(map);
      setLoadingForecast(true);
      setForecast(null);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}` +
          `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`,
        );
        const json = await res.json();
        const d = json?.daily;
        if (d?.time?.length) {
          setForecast({
            lat, lon: lng,
            days: d.time.map((date: string, i: number) => ({
              date,
              tMax: Math.round(d.temperature_2m_max?.[i] ?? 0),
              tMin: Math.round(d.temperature_2m_min?.[i] ?? 0),
              precip: +(d.precipitation_sum?.[i] ?? 0).toFixed(1),
              code: d.weather_code?.[i] ?? 0,
            })),
          });
        }
      } catch { /* offline */ }
      setLoadingForecast(false);
    });

    return () => {
      gridAbort.current?.abort();
      map.remove();
      mapRef.current = null;
    };
  }, [refreshGrid]);

  // ── Layer toggling ──────────────────────────────────────────────────────────
  const toggle = (key: LayerKey) => {
    const next = new Set(active);
    if (next.has(key)) next.delete(key); else next.add(key);
    setActive(next);
    activeRef.current = next;

    const map = mapRef.current;
    if (!map) return;
    if (key === "RADAR" && radarRef.current) {
      next.has("RADAR") ? radarRef.current.addTo(map) : radarRef.current.remove();
    }
    if (key === "CLOUDS" && cloudsRef.current) {
      next.has("CLOUDS") ? cloudsRef.current.addTo(map) : cloudsRef.current.remove();
    }
    if (key === "SAT" && satRef.current) {
      next.has("SAT") ? satRef.current.addTo(map) : satRef.current.remove();
    }
    if (key === "EVENTS" && eventsRef.current) {
      next.has("EVENTS") ? eventsRef.current.addTo(map) : eventsRef.current.remove();
    }
    if (key === "HEAT" || key === "WIND") refreshGrid();
  };

  const locateMe = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 9),
      () => { /* denied — stay global */ },
      { timeout: 5000 },
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div ref={mapDivRef} className="absolute inset-0 z-0" />

      {/* ── Top bar ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3 pt-safe">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link href="/">
            <button type="button" aria-label={t("common.close")}
              className="glass flex h-10 w-10 items-center justify-center rounded-2xl">
              <ArrowLeft size={18} className="text-foreground" />
            </button>
          </Link>
          <div className="glass rounded-2xl px-3 py-2">
            <p className="text-sm font-semibold leading-tight">{t("weather.title")}</p>
            {radarTime && (
              <p className="text-[10px] text-muted-foreground">Radar {radarTime} · NASA · Open-Meteo · RainViewer</p>
            )}
          </div>
        </div>
        <button type="button" onClick={locateMe} aria-label={t("weather.myLocation")}
          className="glass pointer-events-auto flex h-10 w-10 items-center justify-center rounded-2xl">
          <Crosshair size={18} className="text-leaf" />
        </button>
      </div>

      {/* ── Layer chips ── */}
      <div className="absolute left-3 top-20 z-10 flex flex-col gap-2">
        {LAYERS.map(({ key, label, Icon, color }) => {
          const on = active.has(key);
          return (
            <button key={key} type="button" onClick={() => toggle(key)} aria-pressed={on}
              className={`glass flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ${
                on ? "ring-1 ring-leaf/50" : "opacity-60"
              }`}>
              <Icon size={14} style={{ color: on ? color : "var(--muted-foreground)" }} />
              <span className={on ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Heat legend ── */}
      {active.has("HEAT") && (
        <div className="glass absolute right-3 top-20 z-10 rounded-2xl px-3 py-2">
          <p className="mb-1 text-[10px] font-semibold text-muted-foreground">°C</p>
          {[38, 30, 22, 12, 0, -15].map(v => (
            <div key={v} className="flex items-center gap-1.5 py-0.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: tempColor(v) }} />
              <span className="text-[10px] text-muted-foreground">{v > 37 ? "38+" : v}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Point forecast sheet ── */}
      <AnimatePresence>
        {(forecast || loadingForecast) && (
          <motion.div
            initial={{ y: 160, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 160, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="glass-strong absolute inset-x-3 bottom-24 z-10 rounded-3xl p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">
                {loadingForecast
                  ? t("common.loading")
                  : `7-day forecast · ${forecast!.lat.toFixed(2)}, ${forecast!.lon.toFixed(2)}`}
              </p>
              <button type="button" aria-label={t("common.close")}
                onClick={() => { setForecast(null); pinRef.current?.remove(); }}>
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            {forecast && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {forecast.days.map(d => (
                  <div key={d.date} className="min-w-16 rounded-2xl bg-secondary/60 px-2 py-2 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {new Date(d.date + "T00:00").toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p className="my-1 text-lg leading-none">{WMO_ICON[d.code] ?? "🌡️"}</p>
                    <p className="text-[11px] font-bold text-foreground">{d.tMax}°</p>
                    <p className="text-[10px] text-muted-foreground">{d.tMin}°</p>
                    {d.precip > 0 && (
                      <p className="mt-0.5 text-[9px] font-semibold text-water">{d.precip}mm</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
