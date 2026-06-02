import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, Plus, Trash, MapPin, Ruler, X, Download } from "@phosphor-icons/react";

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Plot { id:string; name:string; points:[number,number][]; color:string; }

// Shoelace formula for polygon area in m²
function calcAreaM2(points: [number,number][]): number {
  if (points.length < 3) return 0;
  const R = 6371000;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const [lat1, lon1] = points[i].map(d => d * Math.PI / 180);
    const [lat2, lon2] = points[j].map(d => d * Math.PI / 180);
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  return Math.abs(area * R * R / 2);
}

function fmtArea(m2: number) {
  const ha = m2 / 10000;
  const acres = m2 / 4047;
  const sqkm = m2 / 1e6;
  return { ha:ha.toFixed(2), acres:acres.toFixed(2), sqkm:sqkm.toFixed(4), sqm:Math.round(m2).toLocaleString() };
}

const PLOT_COLORS = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899"];

function ClickHandler({ drawing, onPoint }: { drawing:boolean; onPoint:(p:[number,number])=>void }) {
  useMapEvents({ click(e) { if (drawing) onPoint([e.latlng.lat, e.latlng.lng]); } });
  return null;
}

function TileSwitch({ layer }: { layer: string }) {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [layer]);
  return null;
}

const LAYERS = [
  { id:"satellite", label:"Satellite", url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
  { id:"street",    label:"Street",    url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
  { id:"terrain",   label:"Terrain",   url:"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" },
];

export default function LandMapper() {
  const [plots, setPlots]         = useState<Plot[]>([]);
  const [drawing, setDrawing]     = useState(false);
  const [currentPts, setCurrentPts] = useState<[number,number][]>([]);
  const [plotName, setPlotName]   = useState("");
  const [selected, setSelected]   = useState<Plot|null>(null);
  const [layer, setLayer]         = useState("satellite");
  const [center, setCenter]       = useState<[number,number]>([1.5535, 110.3593]);
  const [zoom, setZoom]           = useState(13);

  // Try get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      p => setCenter([p.coords.latitude, p.coords.longitude]),
      () => {}
    );
  }, []);

  const addPoint = useCallback((p: [number,number]) => {
    setCurrentPts(pts => [...pts, p]);
  }, []);

  function finishPlot() {
    if (currentPts.length < 3) return;
    const color = PLOT_COLORS[plots.length % PLOT_COLORS.length];
    const plot: Plot = { id:Date.now().toString(), name:plotName || `Plot ${plots.length + 1}`, points:currentPts, color };
    setPlots(ps => [...ps, plot]);
    setSelected(plot);
    setCurrentPts([]);
    setDrawing(false);
    setPlotName("");
  }

  function deletePlot(id: string) {
    setPlots(ps => ps.filter(p => p.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function exportData() {
    const rows = ["Plot Name,Hectares,Acres,Sq Meters",
      ...plots.map(p => { const a = fmtArea(calcAreaM2(p.points)); return `${p.name},${a.ha},${a.acres},${a.sqm}`; })
    ].join("\n");
    const blob = new Blob([rows], { type:"text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "land-plots.csv"; a.click();
  }

  const tileUrl = LAYERS.find(l => l.id === layer)?.url || LAYERS[0].url;
  const totalHa = plots.reduce((s, p) => s + calcAreaM2(p.points)/10000, 0);

  return (
    <div className="h-screen flex flex-col text-white" style={{ background:"#0a0a0a" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/8 flex items-center gap-3"
        style={{ background:"rgba(10,10,10,0.95)", backdropFilter:"blur(20px)" }}>
        <Link href="/farm">
          <button type="button" aria-label="Back" className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12 transition">
            <ArrowLeft size={15} />
          </button>
        </Link>
        <div className="flex-1">
          <p className="font-bold text-sm leading-none">Land Mapper</p>
          <p className="text-[10px] text-white/40">Draw plots · Calculate area in hectares, acres & sq km</p>
        </div>
        <div className="flex gap-1.5">
          {LAYERS.map(l => (
            <button key={l.id} type="button" onClick={() => setLayer(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${layer === l.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-white/40 hover:text-white/60"}`}>
              {l.label}
            </button>
          ))}
        </div>
        {plots.length > 0 && (
          <button type="button" onClick={exportData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/12 text-xs font-bold text-white/60 hover:bg-white/6 transition">
            <Download size={13} />Export
          </button>
        )}
      </div>

      <div className="flex-1 relative flex">
        {/* Left panel */}
        <div className="w-64 flex-shrink-0 border-r border-white/8 flex flex-col overflow-hidden" style={{ background:"rgba(15,18,15,0.97)" }}>
          {/* Stats */}
          <div className="p-4 border-b border-white/6">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Land Summary</p>
            <div className="space-y-2">
              {[
                { l:"Total Plots",   v:String(plots.length),            icon:<MapPin size={13} className="text-emerald-400" /> },
                { l:"Total Hectares",v:`${totalHa.toFixed(2)} ha`,      icon:<Ruler size={13} className="text-blue-400" /> },
                { l:"Total Acres",   v:`${(totalHa*2.471).toFixed(2)} ac`, icon:<Ruler size={13} className="text-amber-400" /> },
              ].map(s => (
                <div key={s.l} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">{s.icon}<span className="text-xs text-white/45">{s.l}</span></div>
                  <span className="text-sm font-bold">{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plots list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[10px] text-white/40 uppercase tracking-widest px-1 mb-2">Plots</p>
            {plots.length === 0 ? (
              <div className="text-center py-8 px-3">
                <MapPin size={28} className="mx-auto mb-2 opacity-15" />
                <p className="text-xs text-white/25">Draw a plot on the map to start</p>
              </div>
            ) : plots.map(plot => {
              const area = fmtArea(calcAreaM2(plot.points));
              return (
                <button key={plot.id} type="button" onClick={() => setSelected(plot === selected ? null : plot)}
                  className={`w-full text-left rounded-xl p-3 border transition-all ${selected?.id === plot.id ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/8 hover:border-white/14 bg-white/3"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background:plot.color }} />
                    <p className="text-sm font-semibold truncate flex-1">{plot.name}</p>
                    <button type="button" onClick={e => { e.stopPropagation(); deletePlot(plot.id); }}
                      className="text-white/20 hover:text-red-400 transition p-0.5">
                      <Trash size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    <p className="text-[10px] text-white/40">Hectares</p>
                    <p className="text-[10px] font-bold text-emerald-400">{area.ha} ha</p>
                    <p className="text-[10px] text-white/40">Acres</p>
                    <p className="text-[10px] font-bold text-blue-400">{area.acres} ac</p>
                    <p className="text-[10px] text-white/40">Sq meters</p>
                    <p className="text-[10px] font-bold text-white/60">{area.sqm} m²</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Draw controls */}
          <div className="p-3 border-t border-white/8">
            {drawing ? (
              <div className="space-y-2">
                <p className="text-[10px] text-emerald-400 text-center animate-pulse">Click on map to place points ({currentPts.length} placed)</p>
                <input value={plotName} onChange={e => setPlotName(e.target.value)} placeholder="Plot name (optional)"
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs focus:outline-none focus:border-emerald-500/40 placeholder:text-white/25" />
                <div className="flex gap-2">
                  <button type="button" onClick={finishPlot} disabled={currentPts.length < 3}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
                    style={{ background:"linear-gradient(135deg,#10b981,#059669)" }}>
                    Finish ({currentPts.length} pts)
                  </button>
                  <button type="button" onClick={() => { setDrawing(false); setCurrentPts([]); }}
                    className="p-2 rounded-xl border border-white/10 text-white/50 hover:bg-white/6 transition">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setDrawing(true)}
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                style={{ background:"linear-gradient(135deg,#10b981,#059669)" }}>
                <Plus size={16} weight="bold" />Draw New Plot
              </button>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {drawing && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-500/30"
              style={{ background:"rgba(10,10,10,0.9)", backdropFilter:"blur(12px)" }}>
              Click map to place points · 3+ points to finish
            </div>
          )}
          <MapContainer center={center} zoom={zoom} style={{ height:"100%", width:"100%" }} zoomControl={false}>
            <TileLayer url={tileUrl} attribution="© OpenStreetMap / Esri" />
            <TileSwitch layer={layer} />
            <ClickHandler drawing={drawing} onPoint={addPoint} />

            {/* Saved plots */}
            {plots.map(plot => (
              <Polygon key={plot.id} positions={plot.points}
                pathOptions={{ color:plot.color, fillColor:plot.color, fillOpacity:selected?.id===plot.id?0.25:0.12, weight:selected?.id===plot.id?3:2 }}
                eventHandlers={{ click:() => setSelected(plot === selected ? null : plot) }} />
            ))}

            {/* Current drawing */}
            {currentPts.length >= 2 && (
              <Polygon positions={currentPts}
                pathOptions={{ color:"#10b981", fillColor:"#10b981", fillOpacity:0.15, weight:2, dashArray:"6 4" }} />
            )}
            {currentPts.map((pt, i) => (
              <Marker key={i} position={pt} />
            ))}
          </MapContainer>

          {/* Selected plot info overlay */}
          {selected && (
            <div className="absolute bottom-4 right-4 z-10 rounded-2xl p-4 border border-white/12 min-w-[200px]"
              style={{ background:"rgba(15,18,15,0.95)", backdropFilter:"blur(16px)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-sm" style={{ background:selected.color }} />
                <p className="font-bold text-sm">{selected.name}</p>
                <button type="button" onClick={() => setSelected(null)} className="ml-auto text-white/30 hover:text-white transition">
                  <X size={14} />
                </button>
              </div>
              {(() => {
                const area = fmtArea(calcAreaM2(selected.points));
                return (
                  <div className="space-y-1.5">
                    {[["Hectares",`${area.ha} ha`,"text-emerald-400"],["Acres",`${area.acres} ac`,"text-blue-400"],["Square km",`${area.sqkm} km²`,"text-purple-400"],["Square meters",`${area.sqm} m²`,"text-white/60"]].map(([l,v,c]) => (
                      <div key={String(l)} className="flex justify-between text-xs">
                        <span className="text-white/40">{l}</span>
                        <span className={`font-bold ${c}`}>{v}</span>
                      </div>
                    ))}
                    <div className="pt-1.5 border-t border-white/8 text-xs text-white/30">
                      {selected.points.length} boundary points
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right panel — Map layers */}
        <div className="w-52 flex-shrink-0 border-l border-white/8 flex flex-col overflow-hidden" style={{ background:"rgba(15,18,15,0.97)" }}>
          <div className="p-4 border-b border-white/6">
            <p className="text-xs font-bold mb-3">Map Layers</p>
            <div className="space-y-1.5">
              {[
                { id:"satellite",l:"Satellite View",   active:layer==="satellite" },
                { id:"street",   l:"Street Map",       active:layer==="street"    },
                { id:"terrain",  l:"Terrain / Topo",   active:layer==="terrain"   },
              ].map(l => (
                <button key={l.id} type="button" onClick={() => setLayer(l.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-2 ${l.active ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/20" : "text-white/45 hover:bg-white/4"}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.active ? "bg-emerald-400" : "bg-white/20"}`} />
                  {l.l}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs font-bold mb-3 text-white/60">Measurements</p>
            <div className="space-y-2 text-[11px]">
              {[["Total area",`${totalHa.toFixed(2)} ha`],["In acres",`${(totalHa*2.471).toFixed(2)} ac`],["In sq km",`${(totalHa/100).toFixed(4)} km²`]].map(([l,v]) => (
                <div key={String(l)} className="flex justify-between">
                  <span className="text-white/40">{l}</span>
                  <span className="font-bold text-white/80">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/6 text-[10px] text-white/25">
              Draw polygons on the map to calculate land area. Click "Draw New Plot" to start.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
