import { useState, useEffect, useRef, type ReactElement } from "react";
import { Link } from "wouter";
import {
  MapContainer, TileLayer, Circle, Polygon, Tooltip, useMapEvents, useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Leaf, Bug, Drop, Flame, SlidersHorizontal,
  GridFour, List, Plus, Minus, X, MagnifyingGlass,
  Binoculars, ChartBar, ArrowsClockwise, Warning,
  MapPin, Timer, Export, ShareNetwork, ArrowRight
} from "@phosphor-icons/react";

// ─── Types ─────────────────────────────────────────────────────────────────
type OverlayMode = "HEALTH" | "DISEASE" | "DIVERSITY" | "INVASIVE" | "MOISTURE";
type PlantCategory = "ALL" | "TREES" | "HERBS" | "CROPS" | "MEDICINAL" | "TOXIC";

interface PlantZone {
  id: string;
  label: string;
  category: PlantCategory;
  health: number;      // 0–1 (1 = thriving)
  disease: number;     // 0–1 (1 = severe outbreak)
  diversity: number;   // species count normalised 0–1
  invasive: number;    // 0–1 (1 = heavy invasion)
  moisture: number;    // 0–1
  species: string[];   // top species in zone
  lastScan: string;
  area: number;        // ha
  coords: [number, number][];
}

// ─── Colour scales ─────────────────────────────────────────────────────────
function healthColor(v: number) {
  if (v >= 0.80) return "#16a34a";
  if (v >= 0.65) return "#4ade80";
  if (v >= 0.50) return "#facc15";
  if (v >= 0.35) return "#f97316";
  return "#ef4444";
}

function diseaseColor(v: number) {
  if (v <= 0.20) return "#16a34a";
  if (v <= 0.40) return "#facc15";
  if (v <= 0.60) return "#f97316";
  return "#ef4444";
}

function diversityColor(v: number) {
  if (v >= 0.75) return "#3b82f6";
  if (v >= 0.50) return "#6366f1";
  if (v >= 0.30) return "#8b5cf6";
  return "#4b5563";
}

function invasiveColor(v: number) {
  if (v <= 0.15) return "#16a34a";
  if (v <= 0.35) return "#facc15";
  if (v <= 0.60) return "#f97316";
  return "#ef4444";
}

function moistureColor(v: number) {
  if (v >= 0.70) return "#0ea5e9";
  if (v >= 0.45) return "#38bdf8";
  if (v >= 0.25) return "#facc15";
  return "#ef4444";
}

function zoneColor(z: PlantZone, mode: OverlayMode): string {
  if (mode === "DISEASE")   return diseaseColor(z.disease);
  if (mode === "DIVERSITY") return diversityColor(z.diversity);
  if (mode === "INVASIVE")  return invasiveColor(z.invasive);
  if (mode === "MOISTURE")  return moistureColor(z.moisture);
  return healthColor(z.health);
}

// ─── Demo data (generated around map centre) ──────────────────────────────
function buildZones(lat: number, lng: number): PlantZone[] {
  const D = 0.0028;
  return [
    {
      id:"Z1", label:"Zone A — Canopy Layer", category:"TREES",
      health:0.88, disease:0.10, diversity:0.82, invasive:0.08, moisture:0.71,
      species:["Dryobalanops aromatica","Shorea macrophylla","Dipterocarpus sp."],
      lastScan:"2 min ago", area:8.4,
      coords:[[lat+D*2,lng-D],[lat+D*2,lng],[lat+D*3,lng],[lat+D*3,lng-D]],
    },
    {
      id:"Z2", label:"Zone B — Mixed Herb Layer", category:"HERBS",
      health:0.65, disease:0.32, diversity:0.61, invasive:0.19, moisture:0.55,
      species:["Zingiber officinale","Curcuma longa","Pandanus amaryllifolius"],
      lastScan:"15 min ago", area:5.2,
      coords:[[lat+D*2,lng],[lat+D*2,lng+D],[lat+D*3,lng+D],[lat+D*3,lng]],
    },
    {
      id:"Z3", label:"Zone C — Crop Field", category:"CROPS",
      health:0.47, disease:0.55, diversity:0.35, invasive:0.42, moisture:0.43,
      species:["Oryza sativa","Zea mays","Solanum lycopersicum"],
      lastScan:"1 hr ago", area:12.1,
      coords:[[lat+D,lng-D],[lat+D,lng],[lat+D*2,lng],[lat+D*2,lng-D]],
    },
    {
      id:"Z4", label:"Zone D — Medicinal Garden", category:"MEDICINAL",
      health:0.79, disease:0.14, diversity:0.78, invasive:0.11, moisture:0.64,
      species:["Morinda citrifolia","Andrographis paniculata","Centella asiatica"],
      lastScan:"30 min ago", area:3.7,
      coords:[[lat+D,lng],[lat+D,lng+D],[lat+D*2,lng+D],[lat+D*2,lng]],
    },
    {
      id:"Z5", label:"Zone E — Stressed Crops", category:"CROPS",
      health:0.28, disease:0.79, diversity:0.22, invasive:0.68, moisture:0.21,
      species:["Oryza sativa (diseased)","Cyperus rotundus","Eleusine indica"],
      lastScan:"3 hr ago", area:9.3,
      coords:[[lat,lng-D],[lat,lng],[lat+D,lng],[lat+D,lng-D]],
    },
    {
      id:"Z6", label:"Zone F — Toxic Plant Alert", category:"TOXIC",
      health:0.60, disease:0.25, diversity:0.45, invasive:0.55, moisture:0.38,
      species:["Jatropha curcas","Lantana camara","Abrus precatorius"],
      lastScan:"45 min ago", area:2.8,
      coords:[[lat,lng],[lat,lng+D],[lat+D,lng+D],[lat+D,lng]],
    },
    {
      id:"Z7", label:"Zone G — Riparian Buffer", category:"TREES",
      health:0.82, disease:0.08, diversity:0.91, invasive:0.05, moisture:0.88,
      species:["Barringtonia racemosa","Calophyllum inophyllum","Ficus benjamina"],
      lastScan:"20 min ago", area:6.6,
      coords:[[lat-D,lng-D],[lat-D,lng],[lat,lng],[lat,lng-D]],
    },
    {
      id:"Z8", label:"Zone H — Invasive Spread", category:"HERBS",
      health:0.35, disease:0.44, diversity:0.28, invasive:0.87, moisture:0.30,
      species:["Mikania micrantha","Chromolaena odorata","Mimosa pigra"],
      lastScan:"5 hr ago", area:7.1,
      coords:[[lat-D,lng],[lat-D,lng+D],[lat,lng+D],[lat,lng]],
    },
  ];
}

function MapClickClear({ onClear }: { onClear: () => void }) {
  useMapEvents({ click() { onClear(); } });
  return null;
}

function ZoomCtrl() {
  const map = useMap();
  return (
    <div className="absolute right-4 bottom-20 z-[500] flex flex-col gap-1.5">
      {[{ fn: () => map.zoomIn(), Icon: Plus }, { fn: () => map.zoomOut(), Icon: Minus }].map(({ fn, Icon }, i) => (
        <button key={i} type="button" onClick={fn}
          className="w-9 h-9 rounded-xl border border-white/12 flex items-center justify-center hover:bg-white/10 transition"
          style={{ background:"rgba(10,13,10,0.90)", backdropFilter:"blur(14px)" }}>
          <Icon size={15} weight="bold" className="text-white/80" />
        </button>
      ))}
    </div>
  );
}

// ─── Mode config ───────────────────────────────────────────────────────────
const MODES: { key: OverlayMode; icon: ReactElement; label: string; unit: string }[] = [
  { key:"HEALTH",    icon:<Leaf size={15} />,            label:"Plant Health",      unit:"index" },
  { key:"DISEASE",   icon:<Bug size={15} />,             label:"Disease Risk",       unit:"risk"  },
  { key:"DIVERSITY", icon:<Binoculars size={15} />,      label:"Biodiversity",       unit:"score" },
  { key:"INVASIVE",  icon:<Warning size={15} />,         label:"Invasive Species",   unit:"level" },
  { key:"MOISTURE",  icon:<Drop size={15} />,            label:"Soil Moisture",      unit:"%"     },
];

const GRADIENT: Record<OverlayMode, string> = {
  HEALTH:    "linear-gradient(to right,#ef4444,#f97316,#facc15,#4ade80,#16a34a)",
  DISEASE:   "linear-gradient(to right,#16a34a,#facc15,#f97316,#ef4444)",
  DIVERSITY: "linear-gradient(to right,#4b5563,#8b5cf6,#6366f1,#3b82f6)",
  INVASIVE:  "linear-gradient(to right,#16a34a,#facc15,#f97316,#ef4444)",
  MOISTURE:  "linear-gradient(to right,#ef4444,#facc15,#38bdf8,#0ea5e9)",
};

const CAT_COLORS: Record<PlantCategory, string> = {
  ALL:"#4ade80", TREES:"#16a34a", HERBS:"#84cc16", CROPS:"#facc15",
  MEDICINAL:"#3b82f6", TOXIC:"#ef4444",
};

// ─── Main ──────────────────────────────────────────────────────────────────
export default function DroneView() {
  const [center, setCenter]       = useState<[number, number]>([1.5535, 110.3593]);
  const [zones, setZones]         = useState<PlantZone[]>([]);
  const [selected, setSelected]   = useState<PlantZone | null>(null);
  const [mode, setMode]           = useState<OverlayMode>("HEALTH");
  const [catFilter, setCatFilter] = useState<PlantCategory>("ALL");
  const [listView, setListView]   = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [search, setSearch]       = useState("");
  const [time, setTime]           = useState(new Date());
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      p => {
        const c: [number, number] = [p.coords.latitude, p.coords.longitude];
        setCenter(c);
        setZones(buildZones(c[0], c[1]));
      },
      () => setZones(buildZones(center[0], center[1]))
    );
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate live scan counter
  useEffect(() => {
    const t = setInterval(() => setScanCount(c => c + Math.floor(Math.random() * 2)), 8000);
    return () => clearInterval(t);
  }, []);

  const visible = zones.filter(z =>
    (catFilter === "ALL" || z.category === catFilter) &&
    (!search || z.label.toLowerCase().includes(search.toLowerCase()) ||
     z.species.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  const avgHealth   = visible.length ? visible.reduce((s, z) => s + z.health, 0) / visible.length : 0;
  const riskZones   = visible.filter(z => z.disease > 0.5).length;
  const totalArea   = visible.reduce((s, z) => s + z.area, 0);

  function getModeValue(z: PlantZone) {
    if (mode === "DISEASE")   return z.disease.toFixed(2);
    if (mode === "DIVERSITY") return z.diversity.toFixed(2);
    if (mode === "INVASIVE")  return z.invasive.toFixed(2);
    if (mode === "MOISTURE")  return `${Math.round(z.moisture * 100)}%`;
    return z.health.toFixed(2);
  }

  const modeConfig = MODES.find(m2 => m2.key === mode)!;

  return (
    <div className="h-screen flex flex-col overflow-hidden"
      style={{ background:"#080b08", color:"#e8f5e9", fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* ── TOP TOOLBAR ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 h-[52px] flex items-center gap-2 px-4 border-b border-white/8 z-50"
        style={{ background:"rgba(8,11,8,0.98)", backdropFilter:"blur(20px)" }}>

        <Link href="/farm">
          <button type="button" aria-label="Back"
            className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 hover:bg-white/8 transition mr-1">
            <ArrowLeft size={14} className="text-white/60" />
          </button>
        </Link>

        {/* Brand */}
        <div className="flex items-center gap-2 mr-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background:"rgba(22,163,74,0.2)", border:"1px solid rgba(22,163,74,0.35)" }}>
            <Leaf size={14} className="text-emerald-400" weight="fill" />
          </div>
          <div>
            <p className="text-[11px] font-black tracking-wider uppercase text-white leading-none">Plant Insights</p>
            <p className="text-[8px] font-mono text-emerald-500/60">
              {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" })} · Live
            </p>
          </div>
        </div>

        {/* Analysis mode buttons */}
        <div className="flex items-center gap-0.5 bg-white/4 rounded-xl p-1 border border-white/8">
          {MODES.map(m2 => (
            <button key={m2.key} type="button" onClick={() => setMode(m2.key)} title={m2.label}
              className={`h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold transition-all ${
                mode === m2.key
                  ? "bg-emerald-500/25 text-emerald-400 border border-emerald-500/35"
                  : "text-white/30 hover:text-white/55 hover:bg-white/5"
              }`}>
              {m2.icon}
              <span className="hidden md:inline">{m2.label}</span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <MagnifyingGlass size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search species or zone..."
            className="h-8 pl-7 pr-3 rounded-xl border border-white/10 text-[11px] bg-white/4 focus:outline-none focus:border-emerald-500/40 w-48 placeholder:text-white/20" />
        </div>

        {/* Tools */}
        <button type="button" className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/35 hover:bg-white/6 transition">
          <ArrowsClockwise size={14} />
        </button>
        <button type="button" className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/35 hover:bg-white/6 transition">
          <Export size={14} />
        </button>
        <button type="button" className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center text-white/35 hover:bg-white/6 transition">
          <SlidersHorizontal size={14} />
        </button>

        {/* Map / List toggle */}
        <div className="flex border border-white/12 rounded-xl overflow-hidden h-8">
          {[{ v:false, Icon:GridFour, label:"Map" }, { v:true, Icon:List, label:"List" }].map(({ v, Icon, label }) => (
            <button key={String(v)} type="button" onClick={() => setListView(v)}
              className={`px-3 h-full flex items-center gap-1.5 text-[10px] font-bold transition-all ${
                listView === v ? "bg-emerald-600 text-white" : "text-white/30 hover:bg-white/6"
              }`}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
        <div className="w-[200px] flex-shrink-0 flex flex-col border-r border-white/8 overflow-hidden"
          style={{ background:"rgba(9,12,9,0.99)" }}>

          {/* Live scan preview */}
          <div className="p-3 border-b border-white/6">
            <div className="relative rounded-xl overflow-hidden border border-white/8"
              style={{ aspectRatio:"16/9", background:"#0d1a0d" }}>
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=50"
                alt="Field view"
                className="w-full h-full object-cover opacity-60"
              />
              {/* Scan animation overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-10 h-10 rounded-full border-2 border-emerald-400/70 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </motion.div>
              </div>
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[8px] font-black text-emerald-400/90 font-mono">SCANNING</span>
              </div>
              <div className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-white/40">{scanCount + 247} IDs today</div>
            </div>

            {/* GPS / accuracy */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[8px] text-emerald-400/50 font-mono uppercase tracking-widest">GPS LOCK</p>
                <p className="text-[11px] font-black font-mono text-white">±2.1 m</p>
              </div>
              <div>
                <p className="text-[8px] text-emerald-400/50 font-mono uppercase tracking-widest">SPECIES</p>
                <p className="text-[11px] font-black font-mono text-white">{visible.reduce((s,z)=>s+z.species.length,0)}</p>
              </div>
            </div>
          </div>

          {/* Category filter */}
          <div className="p-2.5 border-b border-white/6">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest mb-2 px-1">Category</p>
            <div className="space-y-0.5">
              {(["ALL","TREES","HERBS","CROPS","MEDICINAL","TOXIC"] as PlantCategory[]).map(c => (
                <button key={c} type="button" onClick={() => setCatFilter(c)}
                  className={`w-full h-7 rounded-lg flex items-center gap-2 px-2 text-[10px] font-bold transition-all ${
                    catFilter === c ? "bg-white/8 text-white" : "text-white/30 hover:bg-white/4 hover:text-white/50"
                  }`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: catFilter === c ? CAT_COLORS[c] : "rgba(255,255,255,0.15)" }} />
                  {c}
                  {catFilter === c && (
                    <span className="ml-auto text-[8px] text-white/30">{zones.filter(z => c === "ALL" || z.category === c).length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Zone list */}
          <div className="flex-1 overflow-y-auto">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest px-3 py-2">Zones ({visible.length})</p>
            {visible.map(z => (
              <button key={z.id} type="button" onClick={() => setSelected(z === selected ? null : z)}
                className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-2 hover:bg-white/3 border-l-2 ${
                  selected?.id === z.id ? "border-emerald-500 bg-emerald-500/6" : "border-transparent"
                }`}>
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: zoneColor(z, mode) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold leading-tight truncate text-white/80">{z.label}</p>
                  <p className="text-[8px] text-white/30 font-mono">{z.area.toFixed(1)} ha · {z.lastScan}</p>
                </div>
                <p className="text-[10px] font-black font-mono flex-shrink-0"
                  style={{ color: zoneColor(z, mode) }}>{getModeValue(z)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── MAP / LIST AREA ─────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">
          {!listView ? (
            <div className="absolute inset-0">
              <MapContainer center={center} zoom={15}
                style={{ height:"100%", width:"100%" }}
                zoomControl={false} attributionControl={false}>
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19} />
                {/* Subtle label layer */}
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
                  opacity={0.35} />
                <MapClickClear onClear={() => setSelected(null)} />
                <ZoomCtrl />

                {/* Zones */}
                {visible.map(z => (
                  <Polygon key={z.id} positions={z.coords}
                    pathOptions={{
                      fillColor: zoneColor(z, mode),
                      fillOpacity: selected?.id === z.id ? 0.52 : 0.33,
                      color: selected?.id === z.id ? "#ffffff" : zoneColor(z, mode),
                      weight: selected?.id === z.id ? 2.5 : 1.5,
                      dashArray: selected?.id === z.id ? undefined : "5 4",
                    }}
                    eventHandlers={{ click(e) { L.DomEvent.stopPropagation(e); setSelected(z === selected ? null : z); } }}>
                    <Tooltip permanent direction="center">
                      <span style={{ fontSize:"9px", fontWeight:900, color:"#fff", fontFamily:"monospace", background:"transparent" }}>
                        {z.id}
                      </span>
                    </Tooltip>
                  </Polygon>
                ))}

                {/* Disease hotspot pulses */}
                {aiEnabled && visible.filter(z => z.disease > 0.5).map(z => {
                  const midLat = z.coords.reduce((s, c) => s + c[0], 0) / z.coords.length;
                  const midLng = z.coords.reduce((s, c) => s + c[1], 0) / z.coords.length;
                  return (
                    <Circle key={`alert-${z.id}`} center={[midLat, midLng]} radius={80}
                      pathOptions={{ color:"#ef4444", fillColor:"#ef4444", fillOpacity:0.15, weight:1, dashArray:"3 3" }} />
                  );
                })}
              </MapContainer>

              {/* Mode label */}
              <div className="absolute top-3 left-3 z-[400] px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black tracking-widest uppercase font-mono flex items-center gap-2"
                style={{ background:"rgba(8,11,8,0.90)", backdropFilter:"blur(12px)" }}>
                <span className="text-emerald-400">{modeConfig.icon}</span>
                <span className="text-white/70">{modeConfig.label}</span>
              </div>

              {/* Risk alert strip */}
              {riskZones > 0 && (
                <motion.div initial={{ y:-30 }} animate={{ y:0 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] px-4 py-1.5 rounded-xl border border-red-500/40 text-[10px] font-black flex items-center gap-2"
                  style={{ background:"rgba(30,8,8,0.92)", backdropFilter:"blur(12px)" }}>
                  <motion.div animate={{ scale:[1,1.3,1] }} transition={{ duration:1.2, repeat:Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span className="text-red-400">{riskZones} disease risk zone{riskZones > 1 ? "s" : ""} detected</span>
                </motion.div>
              )}
            </div>
          ) : (
            /* ── LIST VIEW ─────────────────────────────────────────── */
            <div className="h-full overflow-y-auto p-4 space-y-2" style={{ background:"#080b08" }}>
              <div className="grid grid-cols-8 gap-2 text-[8px] text-white/25 font-mono uppercase tracking-widest px-3 pb-2 border-b border-white/6">
                <span className="col-span-3">Zone</span><span>Health</span><span>Disease</span><span>Diversity</span><span>Invasive</span><span>Area</span>
              </div>
              {visible.map(z => (
                <div key={z.id} onClick={() => setSelected(z === selected ? null : z)}
                  className={`grid grid-cols-8 gap-2 items-center rounded-xl px-3 py-3 cursor-pointer transition-all border ${
                    selected?.id === z.id ? "border-emerald-500/40 bg-emerald-500/6" : "border-white/6 hover:border-white/12 bg-white/2"
                  }`}>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: zoneColor(z, mode) }} />
                    <div>
                      <p className="text-[11px] font-bold text-white/80 leading-tight">{z.label}</p>
                      <p className="text-[8px] text-white/30">{z.category} · {z.lastScan}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-black font-mono" style={{ color: healthColor(z.health) }}>{z.health.toFixed(2)}</p>
                  <p className="text-[11px] font-black font-mono" style={{ color: diseaseColor(z.disease) }}>{z.disease.toFixed(2)}</p>
                  <p className="text-[11px] font-black font-mono" style={{ color: diversityColor(z.diversity) }}>{z.diversity.toFixed(2)}</p>
                  <p className="text-[11px] font-black font-mono" style={{ color: invasiveColor(z.invasive) }}>{z.invasive.toFixed(2)}</p>
                  <p className="text-[11px] font-mono text-white/50">{z.area.toFixed(1)} ha</p>
                </div>
              ))}
            </div>
          )}

          {/* ── ZONE DETAIL POPUP ──────────────────────────────────── */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity:0, y:-10, scale:0.97 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-10, scale:0.97 }}
                transition={{ duration:0.16 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 z-[500] rounded-2xl border border-white/12 w-[270px]"
                style={{ background:"rgba(10,14,10,0.97)", backdropFilter:"blur(24px)" }}>

                {/* Header */}
                <div className="px-4 pt-3 pb-2.5 border-b border-white/8 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: zoneColor(selected, mode) }} />
                  <p className="text-[12px] font-black flex-1 leading-tight">{selected.label}</p>
                  <button type="button" onClick={() => setSelected(null)} className="text-white/25 hover:text-white w-5 h-5 flex items-center justify-center transition">
                    <X size={12} />
                  </button>
                </div>

                {/* Metrics grid */}
                <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { l:"Plant Health",    v:selected.health.toFixed(2),   c:healthColor(selected.health) },
                    { l:"Disease Risk",    v:selected.disease.toFixed(2),  c:diseaseColor(selected.disease) },
                    { l:"Biodiversity",   v:selected.diversity.toFixed(2), c:diversityColor(selected.diversity) },
                    { l:"Invasive Level",  v:selected.invasive.toFixed(2), c:invasiveColor(selected.invasive) },
                    { l:"Soil Moisture",  v:`${Math.round(selected.moisture*100)}%`, c:moistureColor(selected.moisture) },
                    { l:"Area",           v:`${selected.area.toFixed(1)} ha`, c:"rgba(255,255,255,0.7)" },
                  ].map(({ l, v, c }) => (
                    <div key={l} className="flex justify-between items-center">
                      <span className="text-[10px] text-white/40">{l}</span>
                      <span className="text-[11px] font-black font-mono" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Species detected */}
                <div className="px-4 pb-2 border-t border-white/6 pt-2.5">
                  <p className="text-[8px] text-white/30 font-mono uppercase tracking-widest mb-1.5">Species Detected</p>
                  <div className="space-y-1">
                    {selected.species.map(s => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400/50" />
                        <p className="text-[10px] italic text-white/60">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History button */}
                <div className="px-4 pb-3 pt-2 border-t border-white/6 flex items-center gap-2">
                  <Timer size={12} className="text-white/25" />
                  <span className="text-[10px] text-white/35 flex-1">Last scan: {selected.lastScan}</span>
                  <button type="button" className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition">
                    History <ArrowRight size={10} />
                  </button>
                </div>

                {/* Category buttons */}
                <div className="px-4 pb-3 flex gap-2">
                  {(["TREES","HERBS","CROPS","MEDICINAL","TOXIC"] as PlantCategory[]).filter(c => c === selected.category).concat(
                    (["TREES","HERBS","CROPS","MEDICINAL","TOXIC"] as PlantCategory[]).filter(c => c !== selected.category).slice(0, 1)
                  ).map(c => (
                    <button key={c} type="button" onClick={() => setCatFilter(c)}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black border transition-all ${
                        selected.category === c
                          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                          : "border-white/8 text-white/35 hover:bg-white/5"
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────── */}
        <div className="w-[160px] flex-shrink-0 flex flex-col border-l border-white/8 overflow-hidden"
          style={{ background:"rgba(9,12,9,0.99)" }}>

          {/* Summary stats */}
          <div className="p-3 border-b border-white/6 space-y-3">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest">Live Summary</p>
            {[
              { l:"Zones",        v:String(visible.length),       c:"text-white/80"  },
              { l:"Avg Health",   v:avgHealth.toFixed(2),         c:"text-emerald-400" },
              { l:"Risk Zones",   v:String(riskZones),            c:riskZones > 0 ? "text-red-400" : "text-emerald-400" },
              { l:"Total Area",   v:`${totalArea.toFixed(1)} ha`, c:"text-white/60"  },
            ].map(s => (
              <div key={s.l}>
                <p className="text-[8px] text-white/25 font-mono">{s.l}</p>
                <p className={`text-lg font-black font-mono leading-tight ${s.c}`}>{s.v}</p>
              </div>
            ))}
          </div>

          {/* AI toggle */}
          <div className="p-3 border-b border-white/6">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest mb-2">AI Analysis</p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-emerald-400">Plant Health AI</p>
              <button type="button" onClick={() => setAiEnabled(e => !e)}
                className={`w-10 h-5 rounded-full transition-all relative ${aiEnabled ? "bg-emerald-500" : "bg-white/10"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${aiEnabled ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <p className="text-[8px] text-white/25 mt-1.5">
              {aiEnabled ? "Disease hotspots pulsing on map" : "AI overlay disabled"}
            </p>
          </div>

          {/* Layer toggles */}
          <div className="p-3 border-b border-white/6">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest mb-2">Layers</p>
            <div className="space-y-2">
              {[
                { label:"Satellite",        on:true  },
                { label:"Zone Overlay",     on:true  },
                { label:"Disease Pulse",    on:aiEnabled },
                { label:"Species Labels",   on:true  },
                { label:"Contour Lines",    on:false },
              ].map(l => (
                <div key={l.label} className="flex items-center justify-between">
                  <span className="text-[9px] text-white/35">{l.label}</span>
                  <div className={`w-5 h-2.5 rounded-full transition-all relative ${l.on ? "bg-emerald-500/60" : "bg-white/10"}`}>
                    <div className={`absolute top-0.5 w-1.5 h-1.5 rounded-full bg-white transition-all ${l.on ? "right-0.5" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-3 space-y-1.5">
            <p className="text-[8px] text-white/20 font-mono uppercase tracking-widest mb-2">Actions</p>
            {[
              { label:"Scan All Zones", icon:<MagnifyingGlass size={11} /> },
              { label:"Export Report",  icon:<Export size={11} /> },
              { label:"Share Map",      icon:<ShareNetwork size={11} /> },
            ].map(a => (
              <button key={a.label} type="button"
                className="w-full h-8 rounded-xl border border-white/8 flex items-center gap-2 px-2.5 text-[10px] font-bold text-white/40 hover:bg-white/5 hover:text-white/60 transition">
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 h-[52px] border-t border-white/8 flex items-center px-4 gap-5"
        style={{ background:"rgba(8,11,8,0.98)", backdropFilter:"blur(20px)" }}>

        {/* AI Health toggle */}
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">HEALTH</p>
            <p className="text-[8px] font-black text-emerald-400/60 uppercase tracking-widest leading-none">AI-ANALYSIS</p>
          </div>
          <button type="button" onClick={() => setAiEnabled(e => !e)}
            className={`w-11 h-6 rounded-full transition-all relative ${aiEnabled ? "bg-emerald-500" : "bg-white/12"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${aiEnabled ? "right-1" : "left-1"}`} />
          </button>
        </div>

        <div className="w-px h-7 bg-white/8" />

        {/* Average */}
        <div>
          <p className="text-[7px] text-white/25 uppercase tracking-widest font-mono">AVERAGE</p>
          <p className="text-xl font-black font-mono text-white leading-none">{avgHealth.toFixed(2)}</p>
        </div>

        {/* Variation */}
        <div>
          <p className="text-[7px] text-white/25 uppercase tracking-widest font-mono">RISK ZONES</p>
          <p className={`text-xl font-black font-mono leading-none ${riskZones > 0 ? "text-red-400" : "text-emerald-400"}`}>{riskZones}</p>
        </div>

        <div className="flex-1" />

        {/* Mode label */}
        <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{modeConfig.label.toUpperCase()} (INDEX)</p>

        {/* Gradient bar */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-white/30 font-mono">0</span>
          <div className="w-36 h-2.5 rounded-full overflow-hidden relative"
            style={{ background: GRADIENT[mode] }}>
            <motion.div
              animate={{ left:`${avgHealth * 100}%` }}
              transition={{ type:"spring", stiffness:60 }}
              className="absolute top-0 w-0.5 h-full bg-white/90 rounded-full" />
          </div>
          <span className="text-[8px] text-white/30 font-mono">1</span>
        </div>
      </div>
    </div>
  );
}
